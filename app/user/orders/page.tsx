"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, Loader2, Clock, CheckCircle, Truck, ShoppingBag, ArrowUpRight, AlertCircle } from "lucide-react";
import odooAPI from "@/lib/odoo-api";
import { usePathname } from "next/navigation";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // The ID for "Customer 1" based on your JSON data
  const CUSTOMER_1_ID = 57;

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await odooAPI.getOrders();
        const data = Array.isArray(res) ? res : (res?.data || []);
        
        // --- FILTER LOGIC START ---
        // We only keep orders where the partner_id's first element matches 57
        const filteredData = data.filter((order: any) => 
          order.partner_id && order.partner_id[0] === CUSTOMER_1_ID
        );
        // --- FILTER LOGIC END ---

        setOrders(filteredData);
      } catch (err: any) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getStatusConfig = (state: string) => {
    switch(state) {
        case 'draft': return { color: 'bg-slate-100 text-slate-600', icon: Clock, label: 'Quotation' };
        case 'sent': return { color: 'bg-blue-50 text-blue-600', icon: CheckCircle, label: 'Sent' };
        case 'sale': return { color: 'bg-green-50 text-green-600', icon: ShoppingBag, label: 'Confirmed' };
        case 'done': return { color: 'bg-emerald-50 text-emerald-600', icon: Truck, label: 'Completed' };
        case 'cancel': return { color: 'bg-red-50 text-red-600', icon: AlertCircle, label: 'Cancelled' };
        default: return { color: 'bg-slate-50 text-slate-500', icon: Package, label: state };
    }
  };

  const navItems = [
      { name: 'Overview', href: '/user' },
      { name: 'My Orders', href: '/user/orders' },
      { name: 'Invoices', href: '/user/invoices' },
      { name: 'Subscriptions', href: '/user/subscriptions' },
      { name: 'Profile', href: '/user/profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-10">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 sticky top-24">
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link 
                                    key={item.name} 
                                    href={item.href}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                        isActive 
                                        ? 'bg-slate-900 text-white shadow-md' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    {item.name}
                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Order History</h1>
                        <p className="text-slate-500 mt-2">Viewing records for Customer 1.</p>
                    </div>
                </div>

                {loading ? (
                     <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse"></div>
                        ))}
                     </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No orders found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2">We couldn't find any orders matching this customer account.</p>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {orders.map((order) => {
                            const status = getStatusConfig(order.state);
                            const StatusIcon = status.icon;

                            return (
                                <div key={order.id} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-200/50 hover:border-primary/20 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-6">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${status.color} bg-opacity-20`}>
                                            <StatusIcon className="w-6 h-6" />
                                        </div>

                                        <div className="flex-1 min-w-0 text-center sm:text-left">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                                <h3 className="text-lg font-bold text-slate-900">{order.name}</h3>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium">
                                                {new Date(order.date_order).toLocaleDateString(undefined, {
                                                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                                })}
                                            </p>
                                        </div>

                                        <div className="text-center sm:text-right">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total</p>
                                            <p className="text-xl font-bold text-slate-900">₹{order.amount_total.toLocaleString()}</p>
                                        </div>

                                        <div className="shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                                            <Link href={`/user/orders/${order.id}`} className="block">
                                                <button className="w-full sm:w-auto px-6 py-2.5 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 font-medium rounded-xl transition-all duration-300">
                                                    Details
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}