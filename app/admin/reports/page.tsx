"use client";

import { useOdooPolling } from "@/lib/hooks/useOdooPolling";
import odooAPI from "@/lib/odoo-api";
import type { OdooStats } from "@/lib/odoo-api-types";
import { Download } from "lucide-react";

export default function AdminReportsPage() {
    const { data: stats } = useOdooPolling<OdooStats>(odooAPI.getStats);

    return (
        <div className="flex flex-col h-full bg-white">
             {/* Header */}
             <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
                  <nav className="flex items-center text-sm font-medium text-slate-500">
                      <span>Admin</span>
                      <span className="mx-2">/</span>
                      <span className="text-slate-900">Reports</span>
                  </nav>
                </div>
                 <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                 </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Revenue Growth</h3>
                        <div className="mb-4">
                             <span className="text-3xl font-bold text-slate-900">
                                ₹{(stats?.total_revenue || 0).toLocaleString()}
                             </span>
                             <span className="text-sm text-slate-500 ml-2">Total Collected</span>
                        </div>
                        <div className="h-40 bg-white border border-slate-200 rounded-lg flex items-end justify-between px-4 pb-4">
                            <div className="w-8 bg-blue-200 h-[40%] rounded-t-sm"></div>
                            <div className="w-8 bg-blue-300 h-[60%] rounded-t-sm"></div>
                            <div className="w-8 bg-blue-400 h-[50%] rounded-t-sm"></div>
                            <div className="w-8 bg-blue-500 h-[80%] rounded-t-sm"></div>
                            <div className="w-8 bg-blue-600 h-[75%] rounded-t-sm"></div>
                            <div className="w-8 bg-blue-700 h-[90%] rounded-t-sm"></div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Subscription Types</h3>
                        <div className="flex items-center justify-center h-40">
                            <div className="w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center relative">
                                <div className="absolute inset-0 border-8 border-green-500 rounded-full clip-path-half"></div>
                                <span className="text-2xl font-bold text-slate-900">85%</span>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Premium</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-200"></div> Basic</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Churn Rate</h3>
                        <div className="flex flex-col justify-center h-40">
                            <div className="text-5xl font-bold text-red-600">2.4%</div>
                            <p className="text-slate-500 mt-2 flex items-center gap-1">
                                <span className="text-green-600 font-medium">↓ 0.5%</span> 
                                from last month
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
