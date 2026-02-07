"use client";

import odooAPI from "@/lib/odoo-api";
import { useOdooPolling } from "@/lib/hooks/useOdooPolling";
import { Plus } from "lucide-react";

export default function AdminDiscountsPage() {
    const { data: discounts, loading, error } = useOdooPolling<any[]>(odooAPI.getDiscounts);

    return (
        <div className="flex flex-col h-full bg-slate-50">
             {/* Header */}
             <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Discounts & Pricelists</h1>
                  <nav className="flex items-center text-sm font-medium text-slate-500">
                      <span>Admin</span>
                      <span className="mx-2">/</span>
                      <span className="text-slate-900">Discounts</span>
                  </nav>
                </div>
                 <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" />
                    <span>New</span>
                 </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
                {loading && !discounts ? (
                    <div className="text-center py-12 text-slate-500">Loading discounts...</div>
                ) : error ? (
                    <div className="p-4 text-red-600 bg-red-50 border border-red-100 rounded-lg">{error}</div>
                ) : (
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 font-semibold text-slate-900">Name</th>
                                    <th className="px-6 py-3 font-semibold text-slate-900">Type</th>
                                    <th className="px-6 py-3 font-semibold text-slate-900">Currency/Value</th>
                                    <th className="px-6 py-3 font-semibold text-slate-900">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {discounts?.map((d) => (
                                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-slate-900">{d.name}</td>
                                        <td className="px-6 py-3 text-slate-600">{d.type}</td>
                                        <td className="px-6 py-3 text-slate-600">{d.value}</td>
                                        <td className="px-6 py-3">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                                d.status === "Active" 
                                                ? "bg-green-50 text-green-700 border-green-200" 
                                                : "bg-slate-100 text-slate-600 border-slate-200"
                                            }`}>
                                                {d.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!discounts || discounts.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                            No discount rules found.
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
