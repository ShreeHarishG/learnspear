"use client";

import { useState, useEffect } from "react";
import { KPICard } from "@/components/KPICard";
import { Activity, DollarSign, FileText, Users } from "lucide-react";
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
                // const [statsRes, subsRes, invRes] = await Promise.all([
                //     odooAPI.getStats(),
                //     odooAPI.getSubscriptions(),
                //     odooAPI.getInvoices(),
                // ]);
                // setStats(statsRes.data ?? null);
                // setSubscriptions(subsRes.data ?? []);
                // setInvoices(invRes.data ?? []);

                // Mock Data
                setStats({
                    active_subscriptions: 142,
                    total_subscriptions: 156,
                    paid_invoices: 128,
                    total_revenue: 452000,
                });
                setSubscriptions([
                    { id: 101, name: "SUB/2026/001", partner_id: [1, "Vishwa Corp"], plan_id: [1, "Premium SaaS"], state: "active", amount_total: 1200 },
                    { id: 102, name: "SUB/2026/002", partner_id: [2, "Tech Solutions"], plan_id: [2, "Basic Plan"], state: "pending", amount_total: 800 },
                    { id: 103, name: "SUB/2026/003", partner_id: [3, "Global Innov"], plan_id: [1, "Premium SaaS"], state: "active", amount_total: 1200 },
                ]);
                setInvoices([
                    { id: 201, name: "INV/2026/001", partner_id: [1, "Vishwa Corp"], invoice_date: "2026-02-01", payment_state: "paid", amount_total: 1200 },
                    { id: 202, name: "INV/2026/002", partner_id: [2, "Tech Solutions"], invoice_date: "2026-02-05", payment_state: "not_paid", amount_total: 800 },
                ]);

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

            {/* // ... existing code ... */}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                <KPICard
                    title="Active Subscriptions"
                    value={String(stats?.active_subscriptions ?? 0)}
                    icon={Activity}
                    change="+12%"
                    changeType="positive"
                    color="bg-blue-100 text-blue-600"
                />
                <KPICard
                    title="Total Revenue"
                    value={`₹${(stats?.total_revenue ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                    icon={DollarSign}
                    change="+8.2%"
                    changeType="positive"
                    color="bg-green-100 text-green-600"
                />
                <KPICard
                    title="Pending Invoices"
                    value={String(pendingInvoices)}
                    icon={FileText}
                    change="Needs Attention"
                    changeType="negative"
                    color="bg-yellow-100 text-yellow-600"
                />
                <KPICard
                    title="Paid Invoices"
                    value={String(stats?.paid_invoices ?? 0)}
                    icon={Users}
                    change="+5"
                    changeType="neutral"
                    color="bg-purple-100 text-purple-600"
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
