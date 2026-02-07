"use client";

import { useState, useEffect } from "react";
import { KPICard } from "@/components/KPICard";
import odooAPI from "@/lib/odoo-api";
import type { OdooStats, OdooSubscription, OdooInvoice } from "@/lib/odoo-api-types";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<OdooStats | null>(null);
    const [subscriptions, setSubscriptions] = useState<OdooSubscription[]>([]);
    const [invoices, setInvoices] = useState<OdooInvoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const [statsRes, subsRes, invRes] = await Promise.all([
                    odooAPI.getStats(),
                    odooAPI.getSubscriptions(),
                    odooAPI.getInvoices(),
                ]);
                setStats(statsRes.data ?? null);
                setSubscriptions(Array.isArray(subsRes.data) ? subsRes.data : []);
                setInvoices(Array.isArray(invRes.data) ? invRes.data : []);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to load data");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-light p-8 flex items-center justify-center">
                <p className="text-text-muted">Loading dashboard...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-screen bg-bg-light p-8 flex items-center justify-center">
                <p className="text-red-600">Error: {error}</p>
            </div>
        );
    }

    const pendingInvoices = invoices.filter((i) => i.payment_state !== "paid").length;

    return (
        <div className="min-h-screen bg-bg-light p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-heading tracking-tight">Admin Dashboard</h1>
                <p className="text-text-muted mt-1">System Overview & Key Metrics (Odoo)</p>
            </header>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                <KPICard
                    title="Active Subscriptions"
                    value={stats?.active_subscriptions ?? 0}
                    icon="📋"
                />
                <KPICard
                    title="Total Revenue"
                    value={`₹${(stats?.total_revenue ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                    icon="💰"
                />
                <KPICard
                    title="Pending Invoices"
                    value={pendingInvoices}
                    icon="🧾"
                />
                <KPICard
                    title="Paid Invoices"
                    value={stats?.paid_invoices ?? invoices.filter((i) => i.payment_state === "paid").length}
                    icon="👥"
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="rounded-2xl border border-border-color bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-border-color px-6 py-4 flex items-center justify-between bg-gray-50/50">
                        <h2 className="text-lg font-semibold text-text-heading">Recent Subscriptions</h2>
                    </div>
                    <div className="p-6 text-text-muted">
                        {subscriptions.length === 0 ? (
                            <p className="text-sm">No subscriptions yet.</p>
                        ) : (
                            <ul className="space-y-4">
                                {subscriptions.slice(0, 5).map((sub) => (
                                    <li key={sub.id} className="flex items-center justify-between">
                                        <span>{sub.name} – {sub.partner_id?.[1]} ({sub.plan_id?.[1]})</span>
                                        <span className="text-xs text-text-muted">{sub.state}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-border-color bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-border-color px-6 py-4 flex items-center justify-between bg-gray-50/50">
                        <h2 className="text-lg font-semibold text-text-heading">Recent Invoices</h2>
                    </div>
                    <div className="p-6 text-text-muted">
                        {invoices.length === 0 ? (
                            <p className="text-sm">No invoices yet.</p>
                        ) : (
                            <ul className="space-y-4">
                                {invoices.slice(0, 5).map((inv) => (
                                    <li key={inv.id} className="flex items-center justify-between">
                                        <span>{inv.name} – {inv.partner_id?.[1]} ({inv.payment_state})</span>
                                        <span className="text-xs text-text-muted">{inv.invoice_date}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
