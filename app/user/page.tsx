"use client";

import { useState, useEffect } from "react";
import { KPICard } from "@/components/KPICard";
import odooAPI from "@/lib/odoo-api";

export default function UserDashboardPage() {
    const [stats, setStats] = useState<{ active_subscriptions?: number; total_revenue?: number; paid_invoices?: number } | null>(null);
    const [subscriptions, setSubscriptions] = useState<Array<{ id: number; name: string; plan_id: [number, string]; state: string; amount_total: number }>>([]);
    const [invoices, setInvoices] = useState<Array<{ id: number; name: string; invoice_date: string; payment_state: string; amount_total: number }>>([]);
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
                setSubscriptions(subsRes.data ?? []);
                setInvoices(invRes.data ?? []);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to load data");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <div className="min-h-screen bg-bg-light p-8 flex items-center justify-center"><p className="text-text-muted">Loading...</p></div>;
    if (error) return <div className="min-h-screen bg-bg-light p-8 flex items-center justify-center"><p className="text-red-600">Error: {error}</p></div>;

    const activeSubs = subscriptions.filter((s) => s.state === "active");
    const paidTotal = invoices.filter((i) => i.payment_state === "paid").reduce((sum, i) => sum + Number(i.amount_total), 0);

    return (
        <div className="min-h-screen bg-bg-light p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-heading tracking-tight">My Dashboard</h1>
                <p className="text-text-muted mt-1">Here&apos;s your subscription status (from Odoo).</p>
            </header>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                <KPICard title="Active Subscriptions" value={stats?.active_subscriptions ?? activeSubs.length} icon="⭐" />
                <KPICard title="Total Revenue (system)" value={`₹${(stats?.total_revenue ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} icon="💰" />
                <KPICard title="Paid Invoices" value={stats?.paid_invoices ?? invoices.filter((i) => i.payment_state === "paid").length} icon="✅" />
                <KPICard title="Total Paid" value={`₹${paidTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} icon="📅" />
            </div>

            <div className="rounded-2xl border border-border-color bg-white shadow-sm overflow-hidden">
                <div className="border-b border-border-color px-6 py-4 bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-text-heading">My Subscriptions</h2>
                </div>
                <div className="p-6 text-text-muted">
                    {subscriptions.length === 0 ? (
                        <p className="text-sm">No subscriptions yet.</p>
                    ) : (
                        <ul className="space-y-4">
                            {subscriptions.slice(0, 5).map((sub) => (
                                <li key={sub.id} className="flex items-center justify-between">
                                    <span>{sub.name} – {sub.plan_id?.[1]} (₹{Number(sub.amount_total).toFixed(2)})</span>
                                    <span className="text-xs">{sub.state}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="mt-6 rounded-2xl border border-border-color bg-white shadow-sm overflow-hidden">
                <div className="border-b border-border-color px-6 py-4 bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-text-heading">Recent Invoices</h2>
                </div>
                <div className="p-6 text-text-muted">
                    {invoices.length === 0 ? (
                        <p className="text-sm">No invoices yet.</p>
                    ) : (
                        <ul className="space-y-4">
                            {invoices.slice(0, 5).map((inv) => (
                                <li key={inv.id} className="flex items-center justify-between">
                                    <span>{inv.name} – {inv.payment_state}</span>
                                    <span className="text-xs">{inv.invoice_date} (₹{Number(inv.amount_total).toFixed(2)})</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
