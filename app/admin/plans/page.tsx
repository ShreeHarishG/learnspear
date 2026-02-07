"use client";

import odooAPI from "@/lib/odoo-api";
import { useOdooPolling } from "@/lib/hooks/useOdooPolling";
import type { OdooPlan } from "@/lib/odoo-api-types";
import { Plus } from "lucide-react";

export default function AdminPlansPage() {
  const { data: list, loading, error } = useOdooPolling<OdooPlan[]>(odooAPI.getPlans);

  return (
    <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Subscription Plans</h1>
              <nav className="flex items-center text-sm font-medium text-slate-500">
                  <span>Admin</span>
                  <span className="mx-2">/</span>
                  <span className="text-slate-900">Plans</span>
              </nav>
            </div>
             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                <Plus className="w-4 h-4" />
                <span>New</span>
             </button>
        </div>

      <div className="flex-1 overflow-auto p-6">
        {loading && !list ? (
           <div className="text-center py-12 text-slate-500">Loading plans...</div>
        ) : error ? (
           <div className="p-4 text-red-600 bg-red-50 border border-red-100 rounded-lg">{error}</div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-white">
                <tr>
                  <th className="px-6 py-3 font-semibold text-slate-900">ID</th>
                  <th className="px-6 py-3 font-semibold text-slate-900">Name</th>
                  <th className="px-6 py-3 font-semibold text-slate-900">Billing Period</th>
                  <th className="px-6 py-3 font-semibold text-slate-900 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list?.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-700">#{plan.id}</td>
                    <td className="px-6 py-3 font-medium text-slate-900">{plan.name}</td>
                    <td className="px-6 py-3 text-slate-600 capitalize">{plan.billing_period}</td>
                    <td className="px-6 py-3 text-slate-900 font-bold text-right">₹{Number(plan.price).toFixed(2)}</td>
                  </tr>
                ))}
                {(!list || list.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No plans available.
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
