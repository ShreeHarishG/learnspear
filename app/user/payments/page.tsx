"use client";

import { useState, useEffect } from "react";
import odooAPI from "@/lib/odoo-api";

type Inv = { id: number; name: string; partner_id: [number, string]; invoice_date: string; payment_state: string; amount_total: number };

export default function UserPaymentsPage() {
    const [list, setList] = useState<Inv[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // odooAPI.getInvoices()
        //     .then((res) => {
        //         const all: Inv[] = res.data ?? [];
        //         setList(all.filter((i) => i.payment_state === "paid" || i.payment_state === "partial"));
        //     })
        //     .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
        //     .finally(() => setLoading(false));

        setList([
            { id: 201, name: "INV/2026/001", partner_id: [1, "Vishwa Corp"], invoice_date: "2026-02-01", payment_state: "paid", amount_total: 1200 },
        ]);
        setLoading(false);
    }, []);

    if (loading) return <div className="p-8 text-text-muted">Loading payments...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-text-heading">My Payments</h1>
            <p className="mt-2 text-text-muted">History of your payments (from Odoo).</p>
            <div className="mt-6 overflow-x-auto rounded-xl border border-border-color bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-border-color bg-gray-50/80">
                        <tr>
                            <th className="px-4 py-3 font-medium text-text-heading">Invoice</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Customer</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Date</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Status</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                        {list.map((inv) => (
                            <tr key={inv.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium">{inv.name}</td>
                                <td className="px-4 py-3">{inv.partner_id?.[1] ?? "-"}</td>
                                <td className="px-4 py-3">{inv.invoice_date}</td>
                                <td className="px-4 py-3">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${inv.payment_state === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                        {inv.payment_state}
                                    </span>
                                </td>
                                <td className="px-4 py-3">₹{Number(inv.amount_total).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {list.length === 0 && <p className="p-6 text-text-muted">No payments found.</p>}
            </div>
        </div>
    );
}
