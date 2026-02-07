"use client";

import { useOdooPolling } from "@/lib/hooks/useOdooPolling";
import odooAPI from "@/lib/odoo-api";
import type { OdooOrder } from "@/lib/odoo-api-types";
import { Files, Filter, MoreHorizontal, Plus, Search, ArrowUpDown, Download, Send } from "lucide-react";
import { useState } from "react";

export default function QuotationsPage() {
  const { data: list, loading, error } = useOdooPolling<any[]>(odooAPI.getQuotations);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredList = list?.filter(q => 
    q.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.partner_id?.[1]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !list) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            <p className="text-sm font-medium text-slate-500">Loading Quotations...</p>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-8 text-red-600 font-medium">Error loading data: {error}</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
           <div className="flex items-center gap-2">
              <Files className="h-6 w-6 text-slate-600" />
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Quotations
              </h1>
           </div>
          <p className="text-sm text-slate-500 mt-1">
            Create and send sales quotations / estimates.
          </p>
        </div>
        <div className="flex items-center gap-2">
             <button className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Download className="mr-2 h-4 w-4" />
                Export
             </button>
             <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Plus className="mr-2 h-4 w-4" />
                New Quotation
             </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-4 flex items-center gap-4 px-6">
              <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search quotations..." 
                    className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <Filter className="h-4 w-4" />
                  Filter
              </button>
          </div>
      </div>

      {/* Quotations Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium text-slate-500">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                        Ref Number <ArrowUpDown className="h-3 w-3" />
                    </div>
                </th>
                <th className="px-6 py-3 font-medium text-slate-500">Customer</th>
                <th className="px-6 py-3 font-medium text-slate-500">Creation Date</th>
                <th className="px-6 py-3 font-medium text-slate-500">Expiration</th>
                <th className="px-6 py-3 font-medium text-slate-500 text-right">Total</th>
                <th className="px-6 py-3 font-medium text-slate-500 text-center">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!filteredList || filteredList.length === 0 ? (
                  <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                          {searchTerm ? "No quotations matching your search." : "No quotations found."}
                      </td>
                  </tr>
              ) : (
                  filteredList.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-3 font-medium text-blue-600 hover:underline cursor-pointer">
                         {q.name}
                      </td>
                      <td className="px-6 py-3 text-slate-700 font-medium">
                          {q.partner_id?.[1] || "Unknown Client"}
                      </td>
                      <td className="px-6 py-3 text-slate-500">
                           {/* Assuming date_order for now */}
                          {q.date_order?.split(" ")[0]} 
                      </td>
                      <td className="px-6 py-3 text-slate-500">
                          {q.validity_date || "-"}
                      </td>
                      <td className="px-6 py-3 text-right font-medium text-slate-900">
                        ₹{Number(q.amount_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-3 text-center">
                           <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                              q.state === 'sent' || q.state === 'sale' 
                              ? 'bg-blue-50 text-blue-700 ring-blue-600/20' 
                              : (q.state === 'draft' ? 'bg-slate-50 text-slate-600 ring-slate-500/20' : 'bg-gray-50 text-gray-700 ring-gray-600/20')
                          }`}>
                              {q.state === 'sent' ? 'Sent' : (q.state === 'sale' ? 'Sales Order' : 'Draft')}
                          </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                         <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-blue-600" title="Send by Email">
                                <Send className="h-4 w-4" />
                            </button>
                             <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100">
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-200 bg-white px-6 py-3 flex items-center justify-between">
           <p className="text-xs text-slate-500">
               Showing <span className="font-medium">{filteredList?.length}</span> quotations
           </p>
            <div className="flex gap-2">
               <button className="text-xs px-3 py-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:text-slate-900 disabled:opacity-50 hover:bg-slate-50 transition-colors" disabled>Previous</button>
               <button className="text-xs px-3 py-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:text-slate-900 disabled:opacity-50 hover:bg-slate-50 transition-colors" disabled>Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
