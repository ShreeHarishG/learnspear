"use client";

import { useState, useEffect } from "react";
import odooAPI from "@/lib/odoo-api";

export default function AdminUsersPage() {
    const [list, setList] = useState<Array<Record<string, unknown>>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        odooAPI.getCustomers()
            .then((res) => setList(Array.isArray(res.data) ? res.data : []))
            .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-text-muted">Loading customers...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-text-heading">Users / Customers</h1>
            <p className="mt-2 text-text-muted">Customers from Odoo.</p>
            <div className="mt-6 overflow-x-auto rounded-xl border border-border-color bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-border-color bg-gray-50/80">
                        <tr>
                            <th className="px-4 py-3 font-medium text-text-heading">ID</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Name</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                        {list.map((c: Record<string, unknown>, i) => (
                            <tr key={(c.id as number) ?? i} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium">{String(c.id ?? "-")}</td>
                                <td className="px-4 py-3">{String(c.name ?? c.display_name ?? "-")}</td>
                                <td className="px-4 py-3 text-text-muted">{JSON.stringify(c).slice(0, 80)}…</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {list.length === 0 && <p className="p-6 text-text-muted">No customers found.</p>}
            </div>
        </div>
    );
}
