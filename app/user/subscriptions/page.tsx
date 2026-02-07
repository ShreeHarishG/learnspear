"use client";

import { useEffect, useState } from "react";
import odooAPI from "@/lib/odoo-api";
import type { OdooSubscription } from "@/lib/odoo-api-types";
import Link from "next/link";
import { Zap, CheckCircle, Clock, AlertCircle, ArrowUpRight, CreditCard } from "lucide-react";
import { usePathname } from "next/navigation";

export default function UserSubscriptionsPage() {
  const [list, setList] = useState<OdooSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let alive = true;
    let intervalId: NodeJS.Timeout;

    const fetchSubscriptions = async () => {
      // NOTE: We are bypassing the logged-in user check for this test
      // const user = odooAPI.getUser(); 
      
      try {
        // 1. Fetch ALL subscriptions from the system
        const res = await odooAPI.getSubscriptions();
        
        if (alive && res?.data && Array.isArray(res.data)) {
            // 2. FILTER: Only show "Customer 1"
            // In Odoo, partner_id is usually [id, "Name"]
            const customer1Subs = res.data.filter((sub: any) => 
                sub.partner_id && sub.partner_id[1] === "Customer 1"
            );
            
            setList(customer1Subs);
        }
      } catch (err) {
        console.error("Failed to load subscriptions", err);
      } finally {
        if (alive) setLoading(false);
      }
    };

    // 1. Initial Fetch
    fetchSubscriptions();

    // 2. Auto-refresh every 60 seconds
    intervalId = setInterval(fetchSubscriptions, 60000);

    return () => {
      alive = false;
      clearInterval(intervalId);
    };
  }, []);

  const getStatusConfig = (state: string) => {
    switch(state) {
        case 'running': 
        case 'active': // Odoo sometimes uses 'active' or 'running'
            return { color: 'bg-green-50 text-green-700 border-green-100', icon: Zap, label: 'Active' };
        case 'done': return { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: CheckCircle, label: 'Completed' };
        case 'option': return { color: 'bg-blue-50 text-blue-700 border-blue-100', icon: Clock, label: 'Quoted' };
        case 'draft': return { color: 'bg-slate-50 text-slate-600 border-slate-100', icon: Clock, label: 'Draft' };
        case 'close': return { color: 'bg-red-50 text-red-700 border-red-100', icon: AlertCircle, label: 'Closed' };
        default: return { color: 'bg-slate-50 text-slate-500 border-slate-100', icon: Clock, label: state };
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
            <div className="flex-1 space-y-8">
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Active Plans</h1>
                        <p className="text-slate-500 mt-2">Manage your recurring subscriptions.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map(i => (
                            <div key={i} className="h-64 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse"></div>
                        ))}
                    </div>
                ) : list.length === 0 ? (
                     <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Zap className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No active subscriptions</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2">No subscriptions found for Customer 1.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {list.map((sub) => {
                             const status = getStatusConfig(sub.state);
                             const StatusIcon = status.icon;

                            return (
                                <div key={sub.id} className="group bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 relative overflow-hidden flex flex-col">
                                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                                    </div>
                                    
                                    {/* Header */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${status.color}`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {status.label}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">{sub.name}</h3>
                                        <p className="text-sm text-slate-500 mt-1">{sub.plan_id?.[1] || 'Standard Plan'}</p>
                                    </div>

                                    {/* Amount */}
                                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pricing</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-bold text-slate-900">₹{sub.amount_total}</span>
                                                <span className="text-sm text-slate-500 font-medium">/ month</span>
                                            </div>
                                        </div>
                                        
                                        <button className="p-3 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                            <CreditCard className="w-5 h-5" />
                                        </button>
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