"use client";

import { useState, useEffect } from "react";
import odooAPI from "@/lib/odoo-api";

type Sub = { id: number; name: string; partner_id: [number, string]; plan_id: [number, string]; state: string; amount_total: number };

export default function SubscriptionsPage() {
    const [list, setList] = useState<Sub[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        odooAPI.getSubscriptions()
            .then((res) => setList(res.data ?? []))
            .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-text-muted">Loading subscriptions...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-text-heading">Subscriptions</h1>
            <p className="mt-2 text-text-muted">Manage your subscriptions (from Odoo).</p>
            <div className="mt-6 overflow-x-auto rounded-xl border border-border-color bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-border-color bg-gray-50/80">
                        <tr>
                            <th className="px-4 py-3 font-medium text-text-heading">#</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Customer</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Plan</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Status</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                        {list.map((sub) => (
                            <tr key={sub.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium">{sub.name}</td>
                                <td className="px-4 py-3">{sub.partner_id?.[1] ?? "-"}</td>
                                <td className="px-4 py-3">{sub.plan_id?.[1] ?? "-"}</td>
                                <td className="px-4 py-3">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sub.state === "active" ? "bg-green-100 text-green-800" : sub.state === "draft" ? "bg-gray-100 text-gray-700" : "bg-red-100 text-red-800"}`}>
                                        {sub.state}
                                    </span>
                                </td>
                                <td className="px-4 py-3">₹{Number(sub.amount_total).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {list.length === 0 && <p className="p-6 text-text-muted">No subscriptions found.</p>}
            </div>
        </div>
    );
}
