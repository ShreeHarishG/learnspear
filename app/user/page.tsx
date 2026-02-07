"use client";

import { useEffect, useState } from "react";
import odooAPI from "@/lib/odoo-api";
import { Package, RefreshCw, FileText, ArrowRight } from "lucide-react";
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
        <div className="flex h-64 items-center justify-center">
            <div className="text-slate-500 animate-pulse">Loading dashboard for Customer 1...</div>
        </div>
      );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">
                Welcome back, {user?.name || 'User'}
            </h1>
            <p className="text-slate-500 mt-1">Here is the overview for <span className="font-semibold text-blue-600">Customer 1</span>.</p>
        </div>
        <Link href="/user/shop">
            <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-slate-800 transition-colors">
                Browse Shop
            </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Subscriptions */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between pointer-events-none">
                <div>
                    <p className="text-sm font-medium text-slate-500">Active Subscriptions</p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-900">{stats.subscriptions}</h3>
                </div>
                <div className="rounded-full bg-slate-50 p-3">
                    <RefreshCw className="h-6 w-6 text-slate-700" />
                </div>
            </div>
             <Link href="/user/subscriptions" className="mt-4 flex items-center text-sm font-medium text-slate-600 hover:text-slate-900">
                View Details <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
        </div>

        {/* Invoices */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
             <div className="flex items-center justify-between pointer-events-none">
                <div>
                    <p className="text-sm font-medium text-slate-500">Total Invoices</p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-900">{stats.invoices}</h3>
                </div>
                <div className="rounded-full bg-slate-50 p-3">
                    <FileText className="h-6 w-6 text-slate-700" />
                </div>
            </div>
             <Link href="/user/invoices" className="mt-4 flex items-center text-sm font-medium text-slate-600 hover:text-slate-900">
                View History <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
        </div>

        {/* Orders */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
             <div className="flex items-center justify-between pointer-events-none">
                <div>
                    <p className="text-sm font-medium text-slate-500">My Orders</p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-900">{stats.orders}</h3>
                </div>
                <div className="rounded-full bg-slate-50 p-3">
                    <Package className="h-6 w-6 text-slate-700" />
                </div>
            </div>
             <Link href="/user/orders" className="mt-4 flex items-center text-sm font-medium text-slate-600 hover:text-slate-900">
                View Orders <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Recent Orders</h3>
                    <Link href="/user/orders" className="text-sm text-blue-600 hover:underline">View All</Link>
                </div>
                <div className="divide-y divide-slate-100">
                    {recentOrders.length === 0 ? (
                        <p className="p-6 text-sm text-slate-500">No recent orders found.</p>
                    ) : (
                        recentOrders.map(order => (
                            <div key={order.id} className="block p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-slate-900">{order.name}</p>
                                        <p className="text-xs text-slate-500">{order.date_order}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">₹{order.amount_total}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            order.state === 'sale' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                        }`}>{order.state}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Recent Invoices</h3>
                    <Link href="/user/invoices" className="text-sm text-blue-600 hover:underline">View All</Link>
                </div>
                <div className="divide-y divide-slate-100">
                    {recentInvoices.length === 0 ? (
                         <p className="p-6 text-sm text-slate-500">No recent invoices found.</p>
                    ) : (
                        recentInvoices.map(inv => (
                            <div key={inv.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                <div>
                                    <p className="font-medium text-slate-900">{inv.name}</p>
                                    <p className="text-xs text-slate-500">{inv.invoice_date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">₹{inv.amount_total}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full uppercase ${
                                        inv.payment_state === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>{inv.payment_state}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
      </div>
    </div>
  );
}