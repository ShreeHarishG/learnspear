"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  MoreHorizontal,
  CreditCard,
  AlertCircle
} from "lucide-react";
import odooAPI from "@/lib/odoo-api";
import { useOdooPolling } from "@/lib/hooks/useOdooPolling";
import type {
  OdooStats,
  OdooSubscription,
  OdooInvoice,
} from "@/lib/odoo-api-types";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const { data: stats } = useOdooPolling<OdooStats>(odooAPI.getStats);
  const { data: subscriptions } = useOdooPolling<OdooSubscription[]>(odooAPI.getSubscriptions);
  const { data: invoices } = useOdooPolling<OdooInvoice[]>(odooAPI.getInvoices);

  const isLoading = !stats && !subscriptions && !invoices;

  // -- Metrics Calculations --
  const activeSubscriptions =
    subscriptions?.filter((s) => s.state === "active" || s.state === "sale").length || 0;

  const paidInvoices =
    invoices?.filter((i) => i.payment_state === "paid").length || 0;

  const pendingInvoices =
    invoices?.filter((i) => i.payment_state !== "paid").length || 0;
    
  // Calculate MRR (Monthly Recurring Revenue) - simplified assumption: sum of active subscription amounts
  // In a real scenario, you'd normalize strictly by billing period.
  const mrr = subscriptions
    ?.filter((s) => s.state === "active" || s.state === "sale")
    .reduce((sum, sub) => sum + (sub.amount_total || 0), 0) || 0;

  // Calculate Average Revenue Per User (ARPU)
  const arpu = activeSubscriptions > 0 ? mrr / activeSubscriptions : 0;

  // Recent Activity Feed (combining invoices and subs for now)
  const recentActivity = [
    ...(invoices?.map(i => ({ type: 'invoice', date: i.invoice_date, status: i.payment_state, ...i })) || []),
    ...(subscriptions?.map(s => ({ type: 'subscription', date: s.start_date, status: s.state, ...s })) || [])
  ].sort((a: any, b: any) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime())
   .slice(0, 7);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"></div>
            <p className="text-sm font-medium text-slate-500">Loading ERP Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-slate-900">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Overview of your business performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
             <button className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Clock className="mr-2 h-4 w-4 text-slate-400" />
                Last 30 Days
             </button>
             <button className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                <Plus className="mr-2 h-4 w-4" />
                New Entry
             </button>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Total Revenue */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Revenue</p>
                    <h3 className="mt-1 text-2xl font-bold text-slate-900">
                        ₹{(stats?.total_revenue ?? 0).toLocaleString("en-IN")}
                    </h3>
                </div>
                <div className="rounded-lg bg-green-50 p-2 text-green-600">
                    <DollarSign className="h-5 w-5" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-600">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span className="font-medium">+12.5%</span>
                <span className="ml-1 text-slate-400">from last month</span>
            </div>
        </div>

        {/* MRR */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">MRR</p>
                    <h3 className="mt-1 text-2xl font-bold text-slate-900">
                        ₹{mrr.toLocaleString("en-IN")}
                    </h3>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 text-slate-600">
                    <Activity className="h-5 w-5" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-slate-600">
                 <span className="font-medium">Active</span>
                 <span className="ml-1 text-slate-400"> recurring revenue</span>
            </div>
        </div>

        {/* Active Subs */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Subs</p>
                    <h3 className="mt-1 text-2xl font-bold text-slate-900">
                        {activeSubscriptions}
                    </h3>
                </div>
                <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                    <Users className="h-5 w-5" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-slate-500">
                <span className="font-medium text-slate-900">Avg. ₹{arpu.toFixed(0)}</span>
                <span className="ml-1">per user</span>
            </div>
        </div>

        {/* Pending Invoices */}
         <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Unpaid Invoices</p>
                    <h3 className="mt-1 text-2xl font-bold text-slate-900">
                        {pendingInvoices}
                    </h3>
                </div>
                <div className="rounded-lg bg-yellow-50 p-2 text-yellow-600">
                    <AlertCircle className="h-5 w-5" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-yellow-600">
                 <span className="font-medium">Action Required</span>
            </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Charts/Tables (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Actions (ERP style toolbar) */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap gap-3 items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">Quick Actions:</span>
                <Link href="/admin/invoices" className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition-colors border border-slate-200 flex items-center">
                    <Plus className="w-3 h-3 mr-1.5"/> Invoice
                </Link>
                <Link href="/admin/quotations" className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition-colors border border-slate-200 flex items-center">
                    <Plus className="w-3 h-3 mr-1.5"/> Quotation
                </Link>
                <Link href="/admin/users" className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition-colors border border-slate-200 flex items-center">
                    <Plus className="w-3 h-3 mr-1.5"/> User
                </Link>
                <Link href="/admin/products" className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition-colors border border-slate-200 flex items-center">
                    <Plus className="w-3 h-3 mr-1.5"/> Product
                </Link>
            </div>

            {/* Invoices Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-900">All Invoices</h2>
                    <Link href="/admin/invoices" className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center">
                        View All <ArrowRight className="ml-1 w-3 h-3" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-medium">Invoice</th>
                                <th className="px-6 py-3 font-medium">Customer</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Amount</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                             {!invoices || invoices.length === 0 ? (
                                <tr><td colSpan={5} className="p-6 text-center text-slate-500 font-medium">No invoices found</td></tr>
                             ) : (
                                invoices.slice(0, 5).map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-slate-900">{inv.name}</td>
                                        <td className="px-6 py-3 text-slate-600">{inv.partner_id?.[1] || "Unknown"}</td>
                                        <td className="px-6 py-3 text-slate-500">{inv.invoice_date}</td>
                                        <td className="px-6 py-3 font-medium text-slate-900">₹{Number(inv.amount_total).toLocaleString("en-IN")}</td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                inv.payment_state === "paid" ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20" : 
                                                "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
                                            }`}>
                                                {inv.payment_state === 'paid' ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                             )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Subscriptions Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-900">Active Subscriptions</h2>
                    <Link href="/admin/subscriptions" className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center">
                        View All <ArrowRight className="ml-1 w-3 h-3" />
                    </Link>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-medium">Subscription</th>
                                <th className="px-6 py-3 font-medium">Customer</th>
                                <th className="px-6 py-3 font-medium">Plan</th>
                                <th className="px-6 py-3 font-medium">Recurring</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                             {!subscriptions || subscriptions.length === 0 ? (
                                <tr><td colSpan={5} className="p-6 text-center text-slate-500 font-medium">No subscriptions found</td></tr>
                             ) : (
                                subscriptions.slice(0, 5).map((sub) => (
                                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-slate-900">{sub.name}</td>
                                        <td className="px-6 py-3 text-slate-600">{sub.partner_id?.[1] || "-"}</td>
                                        <td className="px-6 py-3 text-slate-500">{sub.plan_id?.[1] || "-"}</td>
                                        <td className="px-6 py-3 font-medium text-slate-900">₹{Number(sub.amount_total).toLocaleString("en-IN")}</td>
                                        <td className="px-6 py-3">
                                             <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                sub.state === "active" || sub.state === "sale" ? "bg-slate-100 text-slate-900 ring-1 ring-inset ring-slate-200" : 
                                                "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/10"
                                            }`}>
                                                {sub.state}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                             )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Right Column: Activity Feed / Secondary Widgets */}
        <div className="space-y-6">
            
            {/* Revenue Mini Chart (Visual only) */}
            <div className="rounded-xl border border-slate-200 bg-slate-900 p-6 shadow-sm text-white relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-slate-300 text-sm font-medium">Projected Revenue</p>
                    <h3 className="text-3xl font-bold mt-1">₹{(mrr * 12).toLocaleString("en-IN")}</h3>
                    <p className="text-slate-400 text-xs mt-2">Annual Run Rate based on current MRR</p>
                </div>
            </div>

            {/* Recent Activity */}
             <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-fit">
                <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="font-semibold text-slate-900 text-sm">Recent Activity</h2>
                </div>
                <div className="p-0">
                    {!recentActivity.length ? (
                         <p className="p-5 text-sm text-slate-500 text-center">No recent activity.</p>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {recentActivity.map((item: any, i) => (
                                <li key={i} className="flex items-start gap-3 p-4 hover:bg-slate-50/50 transition-colors">
                                    <div className={`mt-0.5 rounded-full p-1.5 ${item.type === 'invoice' ? 'bg-slate-100 text-slate-600' : 'bg-slate-100 text-slate-600'}`}>
                                        {item.type === 'invoice' ? <FileText className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">
                                            {item.type === 'invoice' ? `Invoice ${item.name}` : `Subscription ${item.name}`}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {item.partner_id?.[1] || "Unknown Client"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-slate-900">
                                             {item.type === 'invoice' ? item.payment_state : item.state}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            {item.type === 'invoice' ? item.invoice_date : item.start_date}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="border-t border-slate-200 bg-white px-5 py-3">
                     <Link href="/admin/reports" className="text-xs font-medium text-slate-600 hover:text-slate-900 block text-center">
                        View Full History
                     </Link>
                </div>
            </div>

            {/* System Status widget */}
             <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden p-5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">System Status</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium text-slate-700">Odoo Connection</span>
                        </div>
                        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Active</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium text-slate-700">Database</span>
                        </div>
                        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Healthy</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-sm font-medium text-slate-700">Sync (1m)</span>
                        </div>
                        <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">Running</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
