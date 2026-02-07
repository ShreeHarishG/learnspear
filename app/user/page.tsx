"use client";

<<<<<<< HEAD
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
=======
import { useState } from "react";
import Link from "next/link";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import Image from "next/image";

// Mock Data
const PRODUCTS = [
    { id: 1, name: "Premium SaaS Plan", category: "Subscription", price: 1200, billing: "Monthly", image: "/placeholder-product-1.png" },
    { id: 2, name: "Enterprise Analytics", category: "Add-on", price: 500, billing: "Monthly", image: "/placeholder-product-2.png" },
    { id: 3, name: "Data Storage Pack", category: "Infrastructure", price: 200, billing: "Monthly", image: "/placeholder-product-3.png" },
    { id: 4, name: "Security Audit Tool", category: "Tools", price: 800, billing: "One-time", image: "/placeholder-product-4.png" },
    { id: 5, name: "API Rate Limit Boost", category: "Add-on", price: 150, billing: "Monthly", image: "/placeholder-product-5.png" },
    { id: 6, name: "White Label License", category: "License", price: 5000, billing: "Yearly", image: "/placeholder-product-6.png" },
];

const CATEGORIES = ["All Products", "Subscription", "Add-on", "Infrastructure", "Tools", "License"];

export default function ShopPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Products");

    const filteredProducts = PRODUCTS.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-color">
                    <h3 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
                        <Filter className="w-5 h-5 text-accent" /> Filters
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-semibold text-text-heading mb-3">Category</h4>
                            <ul className="space-y-2">
                                {CATEGORIES.map(cat => (
                                    <li key={cat}>
                                        <button
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`text-sm w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat
                                                    ? "bg-primary text-white font-medium"
                                                    : "text-text-muted hover:bg-slate-50 hover:text-primary"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-text-heading mb-3">Price Range</h4>
                            <div className="flex items-center gap-2 text-sm text-text-muted">
                                <input type="number" placeholder="Min" className="w-full border border-border-color rounded px-2 py-1" />
                                <span>-</span>
                                <input type="number" placeholder="Max" className="w-full border border-border-color rounded px-2 py-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
                {/* Shop Header */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-border-color mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <h1 className="text-xl font-bold text-text-heading">All Products</h1>

                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-border-color focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                            />
                        </div>

                        <button className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary whitespace-nowrap">
                            Sort By: Price <ArrowUpDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <Link href={`/user/product/${product.id}`} key={product.id} className="group">
                            <div className="bg-white rounded-2xl shadow-sm border border-border-color overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="aspect-[4/3] bg-slate-100 relative items-center justify-center flex">
                                    {/* Placeholder for Product Image */}
                                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                                        IMG
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-text-heading group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                                        <span className="text-xs font-semibold bg-accent/10 text-accent-dark px-2 py-1 rounded">{product.category}</span>
                                    </div>
                                    <p className="text-sm text-text-muted mb-4 line-clamp-2">
                                        Detailed description for {product.name}. Helps improve workflow and efficiency.
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div>
                                            <p className="text-lg font-bold text-primary">${product.price}</p>
                                            <p className="text-xs text-text-muted">/ {product.billing}</p>
                                        </div>
                                        <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors">
                                            <span className="text-xs font-bold">View</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
>>>>>>> 718464b (user dashboard)
                </div>
            </div>
        </div>
    );
}
