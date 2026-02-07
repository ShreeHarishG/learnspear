"use client";

import Link from "next/link";
import { ArrowLeft, Download, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";

// Mock Data for a single invoice
const INVOICE_DATA = {
    id: "001",
    number: "INV/2026/0015",
    date: "Feb 06, 2026",
    dueDate: "Feb 06, 2026",
    status: "Unpaid",
    source: "Subscription Renewal",
    customer: {
        name: "Vishwa Corp",
        email: "billing@vishwacorp.com",
        address: "123 Tech Park, Sector 5, Bangalore, KA 560103",
    },
    items: [
        { name: "Premium SaaS Plan (Yearly)", quantity: 1, price: 2400, tax: "15%", amount: 2400, taxAmount: 360 },
        { name: "Discount (10% on Order)", quantity: 1, price: -120, tax: "-", amount: -120, taxAmount: 0 },
    ],
    subtotal: 2280,
    taxTotal: 360,
    total: 2640,
    amountDue: 2640,
};

export default function InvoiceDetailsPage() {
    const params = useParams();
    const invoiceId = params.id || INVOICE_DATA.id;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/user/invoices" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-text-heading" />
                    </Link>
                    <h1 className="text-2xl font-bold text-text-heading">Invoice {INVOICE_DATA.number}</h1>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${INVOICE_DATA.status === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                        {INVOICE_DATA.status}
                    </span>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-border-color rounded-lg font-semibold text-text-heading hover:bg-slate-50 transition-colors">
                        <Download className="w-4 h-4" /> Download PDF
                    </button>
                    {INVOICE_DATA.status !== "Paid" && (
                        <button className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2">
                            <CreditCard className="w-4 h-4" /> Pay Now
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-border-color shadow-sm overflow-hidden p-8">
                {/* Invoice Header */}
                <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-border-color">
                    <div>
                        <h2 className="text-xl font-bold text-text-heading mb-1">Invoice {INVOICE_DATA.number}</h2>
                        <p className="text-text-muted text-sm">{INVOICE_DATA.source}</p>

                        <div className="grid grid-cols-3 gap-8 mt-6">
                            <div>
                                <p className="text-xs text-text-muted uppercase font-bold tracking-wider mb-1">Invoice Date</p>
                                <p className="font-semibold text-text-heading">{INVOICE_DATA.date}</p>
                            </div>
                            <div>
                                <p className="text-xs text-text-muted uppercase font-bold tracking-wider mb-1">Due Date</p>
                                <p className="font-semibold text-text-heading">{INVOICE_DATA.dueDate}</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-left md:text-right">
                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Billed To</h3>
                        <address className="not-italic text-sm text-text-heading space-y-1">
                            <p className="font-bold">{INVOICE_DATA.customer.name}</p>
                            <p>{INVOICE_DATA.customer.address}</p>
                            <p className="mt-2 text-primary">{INVOICE_DATA.customer.email}</p>
                        </address>
                    </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto mb-8">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-border-color">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-text-heading">Product Details</th>
                                <th className="px-4 py-3 font-semibold text-text-heading text-center">Quantity</th>
                                <th className="px-4 py-3 font-semibold text-text-heading text-right">Unit Price</th>
                                <th className="px-4 py-3 font-semibold text-text-heading text-right">Taxes</th>
                                <th className="px-4 py-3 font-semibold text-text-heading text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-color">
                            {INVOICE_DATA.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="px-4 py-4 font-medium text-text-heading">{item.name}</td>
                                    <td className="px-4 py-4 text-center">{item.quantity} Unit</td>
                                    <td className="px-4 py-4 text-right">₹{Math.abs(item.price).toFixed(2)}</td>
                                    <td className="px-4 py-4 text-right">{item.tax}</td>
                                    <td className={`px-4 py-4 text-right font-medium ${item.amount < 0 ? "text-red-500" : ""}`}>
                                        {item.amount < 0 ? "-" : ""}₹{Math.abs(item.amount).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-full md:w-1/3 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-text-muted">Untaxed Amount</span>
                            <span className="font-medium text-text-heading">₹{INVOICE_DATA.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-muted">Tax (15%)</span>
                            <span className="font-medium text-text-heading">₹{INVOICE_DATA.taxTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t border-border-color pt-3">
                            <span className="text-text-heading">Total</span>
                            <span className="text-primary">₹{INVOICE_DATA.total.toFixed(2)}</span>
                        </div>

                        {INVOICE_DATA.status === "Paid" ? (
                            <div className="flex justify-between text-sm text-green-600 font-bold border-t border-dashed border-green-200 pt-3">
                                <span>Paid on {INVOICE_DATA.date}</span>
                                <span>₹{INVOICE_DATA.total.toFixed(2)}</span>
                            </div>
                        ) : (
                            <div className="flex justify-between text-sm text-red-600 font-bold border-t border-dashed border-red-200 pt-3">
                                <span>Amount Due</span>
                                <span>₹{INVOICE_DATA.amountDue.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
