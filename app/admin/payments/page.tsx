"use client";

import { useOdooPolling } from "@/lib/hooks/useOdooPolling";
import odooAPI from "@/lib/odoo-api";
import type { OdooInvoice } from "@/lib/odoo-api-types";
import { Filter } from "lucide-react";

export default function AdminPaymentsPage() {
    const { data: list, loading, error } = useOdooPolling<OdooInvoice[]>(odooAPI.getPayments);

    return (
        <div className="flex flex-col h-full bg-slate-50">
             {/* Header */}
             <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
                  <nav className="flex items-center text-sm font-medium text-slate-500">
                      <span>Admin</span>
                      <span className="mx-2">/</span>
                      <span className="text-slate-900">Payments</span>
                  </nav>
                </div>
                 <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                 </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
                {loading && !list ? (
                    <div className="text-center py-12 text-slate-500">Loading payments...</div>
                ) : error ? (
                    <div className="p-4 text-red-600 bg-red-50 border border-red-100 rounded-lg">{error}</div>
                ) : (
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 font-semibold text-slate-900">Payment Ref</th>
                                    <th className="px-6 py-3 font-semibold text-slate-900">Customer</th>
                                    <th className="px-6 py-3 font-semibold text-slate-900">Date</th>
                                    <th className="px-6 py-3 font-semibold text-slate-900">State</th>
                                    <th className="px-6 py-3 font-semibold text-slate-900">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {list?.map((pay: any) => (
                                    <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-slate-900">{pay.name}</td>
                                        <td className="px-6 py-3 text-slate-600">{pay.partner_id?.[1] ?? "-"}</td>
                                        <td className="px-6 py-3 text-slate-600">{pay.date}</td>
                                        <td className="px-6 py-3">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border capitalize ${
                                                pay.state === "posted" 
                                                ? "bg-green-50 text-green-700 border-green-200" 
                                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                            }`}>
                                                {pay.state}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 font-bold text-slate-900">₹{Number(pay.amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                                {(!list || list.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            No payments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
