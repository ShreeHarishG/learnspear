"use client";

import { useOdooPolling } from "@/lib/hooks/useOdooPolling";
import odooAPI from "@/lib/odoo-api";
import type { OdooInvoice } from "@/lib/odoo-api-types";
import { FileText, Filter, MoreHorizontal, Plus, Search, ArrowUpDown, Download } from "lucide-react";
import { useState } from "react";

export default function InvoicesPage() {
  const { data: list, loading, error } = useOdooPolling<OdooInvoice[]>(odooAPI.getInvoices);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredList = list?.filter(inv => 
    inv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.partner_id?.[1]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = list?.reduce((sum, inv) => sum + (inv.amount_total || 0), 0) || 0;

  if (loading && !list) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            <p className="text-sm font-medium text-slate-500">Loading Invoices...</p>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-8 text-red-600 font-medium">Error loading data: {error}</div>;

  return (
    <div className="font-sans text-slate-900">
      
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
           <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-slate-600" />
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Invoices
              </h1>
           </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage customer invoices and payments.
          </p>
        </div>
        <div className="flex items-center gap-2">
             <button className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Download className="mr-2 h-4 w-4" />
                Export
             </button>
             <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
             </button>
        </div>
      </div>

      {/* KPI / Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase">Total Invoiced</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">₹{totalAmount.toLocaleString('en-IN')}</h3>
          </div>
           {/* Search Bar */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-3 flex items-center gap-4 px-6">
              <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search invoices by number or customer..." 
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

      {/* Invoices Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium text-slate-500">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                        Invoice # <ArrowUpDown className="h-3 w-3" />
                    </div>
                </th>
                <th className="px-6 py-3 font-medium text-slate-500">Customer</th>
                <th className="px-6 py-3 font-medium text-slate-500">Date</th>
                <th className="px-6 py-3 font-medium text-slate-500">Due Date</th>
                <th className="px-6 py-3 font-medium text-slate-500 text-right">Amount</th>
                <th className="px-6 py-3 font-medium text-slate-500 text-center">Status</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!filteredList || filteredList.length === 0 ? (
                  <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                          {searchTerm ? "No invoices matching your search." : "No invoices found."}
                      </td>
                  </tr>
              ) : (
                  filteredList.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-3 font-medium text-blue-600 hover:underline cursor-pointer">
                         {inv.name}
                      </td>
                      <td className="px-6 py-3 text-slate-700 font-medium">
                          {inv.partner_id?.[1] || "Unknown"}
                      </td>
                      <td className="px-6 py-3 text-slate-500">
                          {inv.invoice_date}
                      </td>
                      <td className="px-6 py-3 text-slate-500">
                          {/* Mocking due date as same as invoice date for now */}
                          {inv.invoice_date}
                      </td>
                      <td className="px-6 py-3 text-right font-medium text-slate-900">
                        ₹{Number(inv.amount_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-3 text-center">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                              inv.payment_state === 'paid' 
                              ? 'bg-green-50 text-green-700 ring-green-600/20' 
                              : (inv.payment_state === 'reversed' ? 'bg-slate-50 text-slate-600 ring-slate-500/20' : 'bg-yellow-50 text-yellow-700 ring-yellow-600/20')
                          }`}>
                              {inv.payment_state === 'paid' ? 'Paid' : (inv.payment_state === 'reversed' ? 'Reversed' : 'Pending')}
                          </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                          <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                          </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between">
           <p className="text-xs text-slate-500">
               Showing <span className="font-medium">{filteredList?.length}</span> invoices
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
