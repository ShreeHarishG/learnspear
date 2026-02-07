"use client";

import { useState, useEffect } from "react";
import odooAPI from "@/lib/odoo-api";

export default function UserProfilePage() {
    const [customers, setCustomers] = useState<Array<Record<string, unknown>>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        odooAPI.getCustomers()
            .then((res) => setCustomers(Array.isArray(res.data) ? res.data : []))
            .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-text-muted">Loading profile...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    const current = customers[0];
    const name = current ? String(current.name ?? current.display_name ?? "User") : "User";
    const email = current && typeof current.email === "string" ? current.email : "user@learnspear.com";

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-text-heading">My Profile</h1>
            <p className="mt-2 text-text-muted">Manage your profile (customer data from Odoo).</p>
            <div className="mt-6 max-w-md rounded-xl border border-border-color bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                        {name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-text-heading">{name}</p>
                        <p className="text-text-muted">{email}</p>
                    </div>
                </div>
                {current && (
                    <pre className="mt-4 overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-text-muted">
                        {JSON.stringify(current, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
}
