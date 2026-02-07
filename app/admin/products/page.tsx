"use client";

import { useState, useEffect } from "react";
import odooAPI from "@/lib/odoo-api";

export default function AdminProductsPage() {
    const [list, setList] = useState<Array<Record<string, unknown>>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // odooAPI.getProducts()
        //     .then((res) => setList(Array.isArray(res.data) ? res.data : []))
        //     .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
        //     .finally(() => setLoading(false));

        setList([
            { id: 1, name: "Premium SaaS Subscription", list_price: 1200, type: "service" },
            { id: 2, name: "Basic Plan", list_price: 800, type: "service" },
            { id: 3, name: "Consulting Hours", list_price: 5000, type: "service" },
        ]);
        setLoading(false);
    }, []);

    if (loading) return <div className="p-8 text-text-muted">Loading products...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-text-heading">Products Management</h1>
            <p className="mt-2 text-text-muted">Manage your subscription products (from Odoo).</p>
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
                        {list.map((product: Record<string, unknown>, i) => (
                            <tr key={(product.id as number) ?? i} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium">{String(product.id ?? "-")}</td>
                                <td className="px-4 py-3">{String(product.name ?? product.display_name ?? "-")}</td>
                                <td className="px-4 py-3 text-text-muted">{JSON.stringify(product).slice(0, 80)}…</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {list.length === 0 && <p className="p-6 text-text-muted">No products found.</p>}
            </div>
        </div>
    );
}
