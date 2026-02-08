"use client";

import { useEffect, useState } from "react";
import odooAPI from "@/lib/odoo-api";
import { Package, RefreshCw, FileText, ArrowRight, TrendingUp, ShoppingBag, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  const [stats, setStats] = useState({
    subscriptions: 0,
    invoices: 0,
    orders: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Get logged in user info (just for the Welcome name)
    const currentUser = odooAPI.getUser();
    setUser(currentUser);

    // 2. Fetch ALL data and filter for "Customer 1"
    const loadDashboardData = async () => {
        try {
            const [subsRes, invsRes, ordersRes] = await Promise.all([
                odooAPI.getSubscriptions(), // Fetch ALL subscriptions
                odooAPI.getInvoices(),      // Fetch ALL invoices
                odooAPI.getOrders()         // Fetch ALL orders
            ]);

            // Helper to safe-guard array access
            const allSubs = Array.isArray(subsRes?.data) ? subsRes.data : [];
            const allInvs = Array.isArray(invsRes?.data) ? invsRes.data : [];
            const allOrders = Array.isArray(ordersRes?.data) ? ordersRes.data : [];

            // 3. FILTER LOGIC: Only keep items where partner name is "Customer 1"
            const TARGET_CUSTOMER = "Customer 1";

            const mySubs = allSubs.filter((item: any) => 
                item.partner_id && item.partner_id[1] === TARGET_CUSTOMER
            );

            const myInvoices = allInvs.filter((item: any) => 
                item.partner_id && item.partner_id[1] === TARGET_CUSTOMER
            );

            const myOrders = allOrders.filter((item: any) => 
                item.partner_id && item.partner_id[1] === TARGET_CUSTOMER
            );

            // 4. Update State with filtered data
            setStats({
                subscriptions: mySubs.length,
                invoices: myInvoices.length,
                orders: myOrders.length
            });

            // Sort by ID descending (newest first) assuming higher ID = newer
            setRecentOrders(myOrders.sort((a: any, b: any) => b.id - a.id).slice(0, 3));
            setRecentInvoices(myInvoices.sort((a: any, b: any) => b.id - a.id).slice(0, 3));

        } catch (error) {
            console.error("Dashboard load failed:", error);
        } finally {
            setLoading(false);
        }
    };

    loadDashboardData();
  }, []);

  if (loading) {
      return (
        <div className="flex h-[80vh] items-center justify-center bg-slate-50/50">
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                <div className="text-blue-900/60 font-medium">Loading your dashboard...</div>
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-10 pb-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-8 sm:p-12 shadow-sm border border-blue-50/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">{user?.name?.split(' ')[0] || 'User'}</span> 👋
                </h1>
                <p className="text-lg text-slate-500 max-w-xl">
                    Here's what's happening with your account regarding <span className="font-semibold text-blue-600">Customer 1</span>.
                </p>
            </div>
            <Link href="/user/shop">
                <button className="group relative overflow-hidden rounded-2xl bg-blue-600 px-8 py-4 text-white shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-blue-300 active:scale-95">
                    <span className="relative z-10 flex items-center gap-2 font-bold">
                        <ShoppingBag className="w-5 h-5" />
                        Browse Store
                    </span>
                </button>
            </Link>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[300px] w-[300px] rounded-full bg-blue-50/50 blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[300px] w-[300px] rounded-full bg-cyan-50/50 blur-[80px]"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Subscriptions */}
        <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-blue-300">Subscriptions</p>
                    <h3 className="mt-4 text-4xl font-bold text-slate-900">{stats.subscriptions}</h3>
                    <p className="mt-1 text-sm font-medium text-slate-400">Active plans</p>
                </div>
                <div className="rounded-2xl bg-blue-50 p-4 transition-colors group-hover:bg-blue-600 group-hover:text-white text-blue-600">
                    <RefreshCw className="h-8 w-8" />
                </div>
            </div>
             <Link href="/user/subscriptions" className="absolute inset-0">
                <span className="sr-only">View Subscriptions</span>
            </Link>
        </div>

        {/* Invoices */}
         <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-blue-300">Invoices</p>
                    <h3 className="mt-4 text-4xl font-bold text-slate-900">{stats.invoices}</h3>
                    <p className="mt-1 text-sm font-medium text-slate-400">Total processed</p>
                </div>
                <div className="rounded-2xl bg-cyan-50 p-4 transition-colors group-hover:bg-cyan-500 group-hover:text-white text-cyan-600">
                    <FileText className="h-8 w-8" />
                </div>
            </div>
             <Link href="/user/invoices" className="absolute inset-0">
                <span className="sr-only">View Invoices</span>
            </Link>
        </div>

        {/* Orders */}
         <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-blue-300">Orders</p>
                    <h3 className="mt-4 text-4xl font-bold text-slate-900">{stats.orders}</h3>
                    <p className="mt-1 text-sm font-medium text-slate-400">Completed orders</p>
                </div>
                <div className="rounded-2xl bg-indigo-50 p-4 transition-colors group-hover:bg-indigo-600 group-hover:text-white text-indigo-600">
                    <Package className="h-8 w-8" />
                </div>
            </div>
             <Link href="/user/orders" className="absolute inset-0">
                <span className="sr-only">View Orders</span>
            </Link>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
            {/* Recent Orders */}
            <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-xl text-slate-900">Recent Orders</h3>
                    </div>
                    <Link href="/user/orders" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="flex-1 p-2">
                    {recentOrders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Package className="w-12 h-12 text-slate-200 mb-4" />
                            <p className="text-slate-500 font-medium">No recent orders found.</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                        {recentOrders.map(order => (
                            <div key={order.id} className="group p-4 rounded-2xl hover:bg-blue-50/50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{order.name}</p>
                                        <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {order.date_order}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">₹{Number(order.amount_total).toLocaleString()}</p>
                                    <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold ${
                                        order.state === 'sale' ? 'text-green-600' : 'text-slate-500'
                                    }`}>
                                        {order.state === 'sale' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        {order.state}
                                    </span>
                                </div>
                            </div>
                        ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Invoices */}
            <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-cyan-50 rounded-xl text-cyan-600">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-xl text-slate-900">Recent Invoices</h3>
                    </div>
                    <Link href="/user/invoices" className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 hover:underline flex items-center gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="flex-1 p-2">
                    {recentInvoices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileText className="w-12 h-12 text-slate-200 mb-4" />
                            <p className="text-slate-500 font-medium">No recent invoices found.</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                        {recentInvoices.map(inv => (
                            <div key={inv.id} className="group p-4 rounded-2xl hover:bg-cyan-50/50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                     <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-cyan-600 transition-colors">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{inv.name}</p>
                                        <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {inv.invoice_date}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">₹{Number(inv.amount_total).toLocaleString()}</p>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                                        inv.payment_state === 'paid' ? 'bg-green-100/50 text-green-700' : 'bg-yellow-100/50 text-yellow-700'
                                    }`}>
                                        {inv.payment_state === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                        {inv.payment_state}
                                    </span>
                                </div>
                            </div>
                        ))}
                        </div>
                    )}
                </div>
            </div>
      </div>
    </div>
  );
}