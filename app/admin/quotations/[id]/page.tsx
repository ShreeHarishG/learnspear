"use client";

import { useOdooPolling } from "@/lib/hooks/useOdooPolling";
import odooAPI from "@/lib/odoo-api";
import { OdooStatusBar } from "@/components/ui/OdooStatusBar";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";

// 'sale' stage typically means confirmed sales order
const QUOTATION_STAGES = ["draft", "sent", "sale", "done", "cancel"];

export default function QuotationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    const { data: list, loading } = useOdooPolling<any[]>(odooAPI.getQuotations);
    const [quotation, setQuotation] = useState<any>(null);

    useEffect(() => {
        if (list) {
            const found = list.find((q) => q.id === id);
            setQuotation(found);
        }
    }, [list, id]);

    if (!quotation && loading) return <div className="p-8">Loading...</div>;
    if (!quotation && !loading) return <div className="p-8">Quotation/Order not found</div>;

    const currentState = quotation.state === 'sale' ? 'sale' : quotation.state;

    return (
        <div className="flex flex-col h-full bg-slate-50">
             {/* Header Section */}
             <div className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="flex flex-col gap-4">
                     <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-600">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <nav className="flex items-center text-sm font-medium text-slate-500">
                             <span className="hover:text-slate-700 cursor-pointer" onClick={() => router.push('/admin/quotations')}>
                                 Quotations
                             </span>
                             <span className="mx-2">/</span>
                             <span className="text-slate-900">{quotation.name}</span>
                        </nav>
                     </div>
                     
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            {/* Action Buttons */}
                            {(quotation.state === 'draft' || quotation.state === 'sent') && (
                                <>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">
                                        Confirm
                                    </button>
                                     <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
                                        <Send className="h-4 w-4" /> Send by Email
                                    </button>
                                </>
                            )}
                            {quotation.state === 'sale' && (
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">
                                    Create Invoice
                                </button>
                            )}
                             <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">
                                Cancel
                            </button>
                         </div>
                         
                         {/* Status Bar */}
                         <div className="flex items-center border rounded-md overflow-hidden text-sm font-medium">
                             {QUOTATION_STAGES.map((stage, idx) => {
                                 const isCurrent = currentState === stage;
                                 const isPast = QUOTATION_STAGES.indexOf(currentState) > idx;

                                 return (
                                     <div 
                                        key={stage}
                                        className={`
                                            px-4 py-2 border-r last:border-r-0 flex items-center capitalize
                                            ${isCurrent ? 'bg-blue-600 text-white' : ''}
                                            ${isPast ? 'bg-blue-50 text-blue-700' : ''}
                                            ${!isCurrent && !isPast ? 'bg-white text-slate-500' : ''}
                                        `}
                                     >
                                         {stage === 'sale' ? 'Sales Order' : stage}
                                     </div>
                                 )
                             })}
                         </div>
                     </div>
                </div>
            </div>

            {/* Main Form Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="mx-auto max-w-5xl bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden min-h-[600px]">
                    <div className="p-8">
                        <div className="mb-8">
                             <h1 className="text-3xl font-bold text-slate-900">
                                 {quotation.state === 'sale' ? 'Sales Order' : 'Quotation'} <span className="text-slate-400">{quotation.name}</span>
                             </h1>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-12">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                    <label className="text-sm font-medium text-slate-900">Customer</label>
                                    <div className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">
                                        {quotation.partner_id?.[1]}
                                    </div>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                    <label className="text-sm font-medium text-slate-900">Quotation Template</label>
                                    <div className="text-sm text-slate-700">Standard SaaS Agreement</div>
                                </div>
                            </div>
                            
                            {/* Right Column */}
                             <div className="space-y-4">
                                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                    <label className="text-sm font-medium text-slate-900">Date</label>
                                    <div className="text-sm text-slate-700">
                                        {quotation.date_order}
                                    </div>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                    <label className="text-sm font-medium text-slate-900">Expiration</label>
                                    <div className="text-sm text-slate-700">
                                        {quotation.validity_date || "-"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Lines Table */}
                        <div className="mt-8 border rounded-lg overflow-hidden">
                             <table className="w-full text-left text-sm">
                                 <thead className="bg-slate-50 border-b border-slate-200">
                                     <tr>
                                         <th className="px-4 py-3 font-medium text-slate-900">Product</th>
                                         <th className="px-4 py-3 font-medium text-slate-900 text-right">Quantity</th>
                                         <th className="px-4 py-3 font-medium text-slate-900 text-right">Unit Price</th>
                                         <th className="px-4 py-3 font-medium text-slate-900 text-right">Total</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                     <tr>
                                         <td className="px-4 py-3 text-slate-700 flex flex-col">
                                            <span className="font-medium">Service Subscription</span>
                                         </td>
                                         <td className="px-4 py-3 text-right text-slate-700">1.00</td>
                                         <td className="px-4 py-3 text-right text-slate-700">
                                             {Number(quotation.amount_untaxed).toFixed(2)}
                                         </td>
                                          <td className="px-4 py-3 text-right text-slate-900 font-medium">
                                             {Number(quotation.amount_untaxed).toFixed(2)}
                                         </td>
                                     </tr>
                                 </tbody>
                             </table>
                        </div>

                        {/* Totals */}
                        <div className="mt-6 flex justify-end">
                            <div className="w-64 space-y-3">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Untaxed Amount:</span>
                                    <span>₹{Number(quotation.amount_untaxed).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Tax:</span>
                                    <span>₹{Number(quotation.amount_tax).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-bold text-slate-900">
                                    <span>Total:</span>
                                    <span>₹{Number(quotation.amount_total).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
