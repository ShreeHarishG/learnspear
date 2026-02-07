"use client";

import { useOdooPolling } from "@/lib/hooks/useOdooPolling";
import odooAPI from "@/lib/odoo-api";
import { OdooStatusBar } from "@/components/ui/OdooStatusBar";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, Printer } from "lucide-react";

const INVOICE_STAGES = ["draft", "posted", "paid", "cancel"];

export default function InvoiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    const { data: list, loading } = useOdooPolling<any[]>(odooAPI.getInvoices);
    const [invoice, setInvoice] = useState<any>(null);

    useEffect(() => {
        if (list) {
            const found = list.find((i) => i.id === id);
            setInvoice(found);
        }
    }, [list, id]);

    if (!invoice && loading) return <div className="p-8">Loading...</div>;
    if (!invoice && !loading) return <div className="p-8">Invoice not found</div>;

    const invoiceState = invoice.state === 'posted' && invoice.payment_state === 'paid' ? 'paid' : invoice.state;

    return (
        <div className="flex flex-col h-full bg-white">
             {/* Header Section */}
             <div className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="flex flex-col gap-4">
                     <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-600">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <nav className="flex items-center text-sm font-medium text-slate-500">
                             <span className="hover:text-slate-700 cursor-pointer" onClick={() => router.push('/admin/invoices')}>
                                 Invoices
                             </span>
                             <span className="mx-2">/</span>
                             <span className="text-slate-900">{invoice.name}</span>
                        </nav>
                     </div>
                     
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            {/* Action Buttons */}
                            {invoice.state === 'draft' && (
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">
                                    Confirm
                                </button>
                            )}
                            {invoice.state === 'posted' && invoice.payment_state !== 'paid' && (
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">
                                    Register Payment
                                </button>
                            )}
                            <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
                                <Send className="h-4 w-4" /> Send & Print
                            </button>
                            <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
                                <Printer className="h-4 w-4" /> Preview
                            </button>
                         </div>
                         
                         {/* Status Bar */}
                         <div className="flex items-center border rounded-md overflow-hidden text-sm font-medium">
                             {INVOICE_STAGES.map((stage, idx) => {
                                 const isCurrent = invoiceState === stage;
                                 const isPast = INVOICE_STAGES.indexOf(invoiceState) > idx;

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
                                        {stage}
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
                        <div className="flex justify-between items-start mb-8">
                             <div>
                                <h1 className="text-3xl font-bold text-slate-900">{invoice.name}</h1>
                                {invoice.payment_state === 'paid' && (
                                    <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-green-200">
                                        Paid
                                    </span>
                                )}
                             </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-12">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                    <label className="text-sm font-medium text-slate-900">Customer</label>
                                    <div className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">
                                        {invoice.partner_id?.[1]}
                                    </div>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                    <label className="text-sm font-medium text-slate-900">Payment Terms</label>
                                    <div className="text-sm text-slate-700">Immediate Payment</div>
                                </div>
                            </div>
                            
                            {/* Right Column */}
                             <div className="space-y-4">
                                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                    <label className="text-sm font-medium text-slate-900">Invoice Date</label>
                                    <div className="text-sm text-slate-700">
                                        {invoice.invoice_date}
                                    </div>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                    <label className="text-sm font-medium text-slate-900">Due Date</label>
                                    <div className="text-sm text-slate-700">
                                        {invoice.invoice_date_due || invoice.invoice_date}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Lines Table */}
                        <div className="mt-8 border rounded-lg overflow-hidden">
                             <table className="w-full text-left text-sm">
                                 <thead className="bg-white border-b border-slate-200">
                                     <tr>
                                         <th className="px-4 py-3 font-medium text-slate-900">Product</th>
                                         <th className="px-4 py-3 font-medium text-slate-900 text-right">Quantity</th>
                                         <th className="px-4 py-3 font-medium text-slate-900 text-right">Price</th>
                                         <th className="px-4 py-3 font-medium text-slate-900 text-right">Subtotal</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                     <tr>
                                         <td className="px-4 py-3 text-slate-700 flex flex-col">
                                            <span className="font-medium">Service Subscription</span>
                                            <span className="text-xs text-slate-500">Monthly access</span>
                                         </td>
                                         <td className="px-4 py-3 text-right text-slate-700">1.00</td>
                                         <td className="px-4 py-3 text-right text-slate-700">
                                             {Number(invoice.amount_untaxed).toFixed(2)}
                                         </td>
                                          <td className="px-4 py-3 text-right text-slate-900 font-medium">
                                             {Number(invoice.amount_untaxed).toFixed(2)}
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
                                    <span>₹{Number(invoice.amount_untaxed).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Tax:</span>
                                    <span>₹{Number(invoice.amount_tax).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-bold text-slate-900">
                                    <span>Total:</span>
                                    <span>₹{Number(invoice.amount_total).toFixed(2)}</span>
                                </div>
                                {invoice.payment_state === 'paid' && (
                                     <div className="border-t border-slate-200 pt-3 flex justify-between text-sm text-green-600 italic">
                                        <span>Amount Due:</span>
                                        <span>₹0.00</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
