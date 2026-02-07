"use client";

import odooAPI from "@/lib/odoo-api";
import { useOdooPolling } from "@/lib/hooks/useOdooPolling";

export default function SettingsPage() {
    const { data: settings, loading } = useOdooPolling<any>(odooAPI.getSettings);

    const isLoading = loading && !settings;

    return (
        <div className="flex flex-col h-full bg-white">
             {/* Header */}
             <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Company Settings</h1>
                  <nav className="flex items-center text-sm font-medium text-slate-500">
                     <span>Admin</span>
                     <span className="mx-2">/</span>
                     <span className="text-slate-900">Settings</span>
                  </nav>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-3xl bg-white rounded-lg border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-900">General Configuration</h2>
                        <p className="text-sm text-slate-500">Syncs directly with Odoo Company Settings</p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {isLoading ? (
                            <p className="text-slate-500">Loading settings...</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white text-slate-600" defaultValue={settings?.company_name || ""} disabled />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white text-slate-600" defaultValue={settings?.currency || ""} disabled />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input type="email" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white text-slate-600" defaultValue={settings?.email || ""} disabled />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white text-slate-600" defaultValue={settings?.phone || ""} disabled />
                                </div>
                            </div>
                        )}
                        
                        <div className="border-t border-slate-200 pt-6">
                            <h3 className="text-base font-bold text-slate-900 mb-4">Notification Preferences</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600" />
                                    <span className="text-sm text-slate-700">Email on new subscription</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600" />
                                    <span className="text-sm text-slate-700">Email on payment failure</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600" />
                                    <span className="text-sm text-slate-700">Weekly summary report</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-end">
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 shadow-sm transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
