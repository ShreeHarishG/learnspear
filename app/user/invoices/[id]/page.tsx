"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, ArrowLeft, Calendar, User, Download, Printer, CheckCircle, Clock, AlertCircle } from "lucide-react";
import odooAPI from "@/lib/odoo-api";
import { Toaster, toast } from "react-hot-toast";

export default function InvoiceDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [invoice, setInvoice] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        // Fetch single invoice
        odooAPI.getInvoiceById(Number(id))
            .then((res) => {
                // Determine structure: { status: "success", data: ... } or just data
                const invoiceData = res?.data || res;

                if (invoiceData) {
                    setInvoice(invoiceData);
                } else {
                    toast.error("Invoice not found.");
                    setTimeout(() => router.push("/user/invoices"), 2000);
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to load invoice details.");
            })
            .finally(() => setLoading(false));
    }, [id, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
                    <div className="h-4 w-48 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!invoice) return null;

    const getStatusConfig = (state: string, paymentState: string) => {
         if (state === 'cancel') return { color: 'bg-red-50 text-red-700 border-red-100', icon: AlertCircle, label: 'Cancelled' };
         if (paymentState === 'paid') return { color: 'bg-green-50 text-green-700 border-green-100', icon: CheckCircle, label: 'Paid' };
         if (paymentState === 'reversed') return { color: 'bg-orange-50 text-orange-700 border-orange-100', icon: Clock, label: 'Reversed' };
         if (state === 'posted') return { color: 'bg-blue-50 text-blue-700 border-blue-100', icon: OpenIcon, label: 'Open' };
         return { color: 'bg-slate-50 text-slate-600 border-slate-100', icon: FileText, label: 'Draft' };
    };
    
    // Fix for missing icon
    const OpenIcon = FileText; 

    const status = getStatusConfig(invoice.state, invoice.payment_state);
    const StatusIcon = status.icon;

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <Toaster position="bottom-right" />
            
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Link 
                        href="/user/invoices" 
                        className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <div className="p-2 rounded-full bg-white border border-slate-200 group-hover:border-slate-300 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Back to Invoices
                    </Link>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                            <Printer className="w-4 h-4" /> Print
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                    </div>
                </div>

                {/* Main Invoice Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Invoice Header */}
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-slate-900">{invoice.name}</h1>
                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${status.color}`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {status.label}
                                </span>
                            </div>
                            <p className="text-slate-500 flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4" /> 
                                Issued on {invoice.invoice_date}
                            </p>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Amount Due</p>
                            <p className="text-4xl font-bold text-slate-900 tracking-tight">₹{Number(invoice.amount_total).toLocaleString()}</p>
                            <p className="text-sm text-slate-500 mt-1">
                                {invoice.payment_state === 'paid' ? 'Fully Paid' : 'Payment Pending'}
                            </p>
                        </div>
                    </div>

                    {/* Customer & Details */}
                    <div className="p-8 grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Bill To</h3>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-slate-100 rounded-xl">
                                    <User className="w-6 h-6 text-slate-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-lg">{invoice.partner_id?.[1]}</p>
                                    <p className="text-slate-500 text-sm mt-1">Customer ID: #{invoice.partner_id?.[0]}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between py-3 border-b border-slate-50">
                                <span className="text-slate-500 text-sm">Invoice Date</span>
                                <span className="font-medium text-slate-900">{invoice.invoice_date}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-slate-50">
                                <span className="text-slate-500 text-sm">Reference</span>
                                <span className="font-medium text-slate-900">{invoice.ref || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="p-8 pt-0">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Invoice Items</h3>
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4 text-right">Qty</th>
                                        <th className="px-6 py-4 text-right">Unit Price</th>
                                        <th className="px-6 py-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {invoice.lines?.map((line: any) => (
                                        <tr key={line.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">{line.name}</td>
                                            <td className="px-6 py-4 text-right text-slate-600">{line.quantity}</td>
                                            <td className="px-6 py-4 text-right text-slate-600">₹{line.price_unit.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right font-bold text-slate-900">₹{line.price_subtotal.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-slate-50 border-t border-slate-200">
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-right font-medium text-slate-600">Untaxed Amount</td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-900">₹{Number(invoice.amount_untaxed || 0).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-right font-medium text-slate-600">Tax</td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-900">₹{Number(invoice.amount_tax || 0).toLocaleString()}</td>
                                    </tr>
                                    <tr className="bg-slate-900 text-white">
                                        <td colSpan={3} className="px-6 py-4 text-right font-bold">Total</td>
                                        <td className="px-6 py-4 text-right font-bold text-lg">₹{Number(invoice.amount_total).toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
