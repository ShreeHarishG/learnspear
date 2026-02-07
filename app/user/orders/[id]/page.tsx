"use client";

import Link from "next/link";
import { ArrowLeft, Download, FileText, CheckCircle, Clock } from "lucide-react";
import { useParams } from "next/navigation";

// Mock Data for a single order
const ORDER_DATA = {
    id: "S00022",
    date: "Feb 06, 2026",
    status: "Active",
    subscription: {
        plan: "Premium SaaS Plan",
        startDate: "Feb 06, 2026",
        endDate: "Feb 06, 2027",
    },
    address: {
        name: "Vishwa Corp",
        street: "123 Tech Park, Sector 5",
        city: "Bangalore, KA 560103",
        phone: "+91 98765 43210",
    },
    invoice: {
        number: "INV/2026/0015",
        id: "001",
        status: "Paid",
    },
    products: [
        { name: "Premium SaaS Plan (Yearly)", quantity: 1, price: 1200, tax: "18%", amount: 1200 },
        { name: "Setup Fee", quantity: 1, price: 100, tax: "18%", amount: 100 },
    ],
    subtotal: 1300,
    taxTotal: 234,
    total: 1534,
};

export default function OrderDetailsPage() {
    const params = useParams();
    const orderId = params.id || ORDER_DATA.id;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/user/orders" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-text-heading" />
                    </Link>
                    <h1 className="text-2xl font-bold text-text-heading">Order {orderId}</h1>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {ORDER_DATA.status}
                    </span>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-border-color rounded-lg font-semibold text-text-heading hover:bg-slate-50 transition-colors">
                        <Download className="w-4 h-4" /> Download
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-sm">
                        Renew Subscription
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content Info */}
                <div className="md:col-span-2 space-y-8">
                    {/* Subscription Details */}
                    <section className="bg-white p-6 rounded-2xl border border-border-color shadow-sm">
                        <h3 className="text-lg font-bold text-text-heading mb-4">Your Subscription</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-text-muted mb-1">Plan</p>
                                <p className="font-semibold text-text-heading">{ORDER_DATA.subscription.plan}</p>
                            </div>
                            <div className="hidden md:block"></div>
                            <div>
                                <p className="text-sm text-text-muted mb-1">Start Date</p>
                                <p className="font-semibold text-text-heading">{ORDER_DATA.subscription.startDate}</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-muted mb-1">End Date</p>
                                <p className="font-semibold text-text-heading">{ORDER_DATA.subscription.endDate}</p>
                            </div>
                        </div>
                    </section>

                    {/* Products Table */}
                    <section className="bg-white rounded-2xl border border-border-color shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border-color">
                            <h3 className="text-lg font-bold text-text-heading">Products</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-border-color">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-text-heading">Product Details</th>
                                        <th className="px-6 py-4 font-semibold text-text-heading text-center">Quantity</th>
                                        <th className="px-6 py-4 font-semibold text-text-heading text-right">Unit Price</th>
                                        <th className="px-6 py-4 font-semibold text-text-heading text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-color">
                                    {ORDER_DATA.products.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-4 font-medium text-text-heading">{item.name}</td>
                                            <td className="px-6 py-4 text-center">{item.quantity}</td>
                                            <td className="px-6 py-4 text-right">${item.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right font-medium">${item.amount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-slate-50/50">
                                    <tr>
                                        <td colSpan={3} className="px-6 py-3 text-right text-text-muted">Subtotal</td>
                                        <td className="px-6 py-3 text-right font-medium">${ORDER_DATA.subtotal.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} className="px-6 py-2 text-right text-text-muted">Tax (18%)</td>
                                        <td className="px-6 py-2 text-right font-medium">${ORDER_DATA.taxTotal.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-right font-bold text-text-heading text-lg">Total</td>
                                        <td className="px-6 py-4 text-right font-bold text-primary text-lg">${ORDER_DATA.total.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Address */}
                    <section className="bg-white p-6 rounded-2xl border border-border-color shadow-sm">
                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Invoicing Address</h3>
                        <address className="not-italic text-sm text-text-heading space-y-1">
                            <p className="font-bold">{ORDER_DATA.address.name}</p>
                            <p>{ORDER_DATA.address.street}</p>
                            <p>{ORDER_DATA.address.city}</p>
                            <p className="mt-2 text-text-muted">{ORDER_DATA.address.phone}</p>
                        </address>
                    </section>

                    {/* Associated Invoice */}
                    <section className="bg-white p-6 rounded-2xl border border-border-color shadow-sm">
                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Invoice</h3>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-border-color mb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg border border-border-color">
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-text-heading">{ORDER_DATA.invoice.number}</p>
                                    <p className="text-xs text-text-muted">Invoiced Overview</p>
                                </div>
                            </div>
                        </div>
                        <Link href={`/user/invoices/${ORDER_DATA.invoice.id}`}>
                            <button className="w-full py-2 text-sm font-semibold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
                                View Invoice
                            </button>
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    );
}
