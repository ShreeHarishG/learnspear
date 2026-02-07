"use client";

import { useOdooPolling } from "@/lib/hooks/useOdooPolling";
import odooAPI from "@/lib/odoo-api";
import type { OdooProduct } from "@/lib/odoo-api-types";
import { Plus, Search, Filter, MoreHorizontal, Package, Tag, ArrowUpDown } from "lucide-react";
import { useState } from "react";

export default function AdminProductsPage() {
  const { data: list, loading, error } = useOdooPolling<OdooProduct[]>(odooAPI.getProducts);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredList = list?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !list) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
                <p className="text-sm font-medium text-slate-500">Loading Products...</p>
            </div>
        </div>
      );
  }

  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-slate-900">
      
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
           <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-slate-600" />
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Products
              </h1>
           </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage your product catalog and pricing.
          </p>
        </div>
        <div className="flex items-center gap-2">
             <button className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Export
             </button>
             <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Plus className="mr-2 h-4 w-4" />
                New Product
             </button>
        </div>
      </div>

      {/* Stats/Filters */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase">Total Products</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{list?.length || 0}</h3>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-3 flex items-center gap-4 px-6">
              <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <Filter className="h-4 w-4" />
                  Filters
              </button>
          </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium text-slate-500">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                        Product Name <ArrowUpDown className="h-3 w-3" />
                    </div>
                </th>
                <th className="px-6 py-3 font-medium text-slate-500">
                    Internal Ref
                </th>
                <th className="px-6 py-3 font-medium text-slate-500">
                    Category
                </th>
                <th className="px-6 py-3 font-medium text-slate-500 text-right">
                    Price
                </th>
                <th className="px-6 py-3 font-medium text-slate-500 text-center">
                    Status
                </th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!filteredList || filteredList.length === 0 ? (
                  <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                          No products found matching your search.
                      </td>
                  </tr>
              ) : (
                  filteredList.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-3">
                         <div className="flex items-center gap-3">
                             <div className="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-400">
                                 <Tag className="h-4 w-4" />
                             </div>
                             <div>
                                 <p className="font-medium text-slate-900">{product.name}</p>
                             </div>
                         </div>
                      </td>
                      <td className="px-6 py-3 text-slate-500 font-mono text-xs">
                          #{product.id}
                      </td>
                      <td className="px-6 py-3">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                             Sellable
                          </span>
                      </td>
                      <td className="px-6 py-3 text-right font-medium text-slate-900">
                        ₹{Number(product.list_price).toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-center">
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Active
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
        <div className="border-t border-slate-200 bg-white px-6 py-3 flex items-center justify-between">
           <p className="text-xs text-slate-500">
               Showing <span className="font-medium">{filteredList?.length}</span> products
           </p>
           <div className="flex gap-2">
               <button className="text-xs text-slate-600 hover:text-slate-900 disabled:opacity-50" disabled>Previous</button>
               <button className="text-xs text-slate-600 hover:text-slate-900 disabled:opacity-50" disabled>Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
