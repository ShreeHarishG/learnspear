"use client";

import Link from "next/link";
import { User, CreditCard, FileText, Package, Settings, ShoppingCart, Activity, ShoppingBag, TrendingUp, AlertCircle, DollarSign, Calendar } from "lucide-react";
import { KPICard } from "@/components/KPICard";

// Mock Data for KPIs
const KEY_METRICS = [
    { title: "Total Monthly Spend", value: "$2,840", change: "+4.5%", changeType: "negative" as const, icon: DollarSign, color: "bg-blue-100 text-blue-600" },
    { title: "Active Subscriptions", value: "14", change: "+2", changeType: "neutral" as const, icon: Activity, color: "bg-purple-100 text-purple-600" },
    { title: "Upcoming Invoice", value: "$450", change: "Due in 3 days", changeType: "positive" as const, icon: Calendar, color: "bg-orange-100 text-orange-600" },
    { title: "Potential Savings", value: "$320/mo", change: "Optimize now", changeType: "positive" as const, icon: TrendingUp, color: "bg-green-100 text-green-600" },
];

const DASHBOARD_LINKS = [
    { name: "My Profile", href: "/user/profile", icon: User, color: "bg-slate-100 text-slate-600" },
    { name: "Subscriptions", href: "/user/subscriptions", icon: Activity, color: "bg-slate-100 text-slate-600" },
    { name: "My Orders", href: "/user/orders", icon: Package, color: "bg-slate-100 text-slate-600" },
    { name: "Browse Shop", href: "/user/shop", icon: ShoppingBag, color: "bg-indigo-100 text-indigo-600" },
    { name: "Invoices", href: "/user/invoices", icon: FileText, color: "bg-slate-100 text-slate-600" },
    { name: "Payments", href: "/user/payments", icon: CreditCard, color: "bg-slate-100 text-slate-600" },
    { name: "Settings", href: "/user/settings", icon: Settings, color: "bg-slate-100 text-slate-600" },
    { name: "My Cart", href: "/user/cart", icon: ShoppingCart, color: "bg-slate-100 text-slate-600" },
];

const RECENT_ACTIVITY = [
    { title: "Invoice Paid - Adobe Creative Cloud", date: "2 hours ago", amount: "$54.99", icon: FileText },
    { title: "New Subscription Added - Figma", date: "Yesterday", amount: "$15.00", icon: Activity },
    { title: "Payment Method Updated", date: "2 days ago", amount: null, icon: CreditCard },
];

const UPCOMING_PAYMENTS = [
    { name: "Salesforce CRM", date: "Oct 24, 2026", amount: "$450.00", status: "Upcoming" },
    { name: "Slack Enterprise", date: "Oct 28, 2026", amount: "$890.00", status: "Upcoming" },
    { name: "AWS Invoice", date: "Nov 01, 2026", amount: "$1,200.00", status: "Estim." },
];

export default function UserDashboard() {
    return (
        <div className="space-y-8">
            {/* Header & Stats */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-text-heading">Dashboard</h1>
                        <p className="text-text-muted mt-1">Welcome back, Vishwa. Here&apos;s your financial overview.</p>
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-sm font-medium text-text-muted bg-white px-3 py-1 rounded-full border border-border-color shadow-sm">
                            Last updated: Just now
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {KEY_METRICS.map((metric) => (
                        <KPICard key={metric.title} {...metric} />
                    ))}
                </div>
            </section>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Column: Quick Actions & Activity */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Quick Overview / Navigation */}
                    <section>
                        <h2 className="text-lg font-bold text-text-heading mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {DASHBOARD_LINKS.map((link) => (
                                <Link href={link.href} key={link.name} className="group">
                                    <div className="bg-white p-4 rounded-xl border border-border-color shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-3 h-full min-h-[140px]">
                                        <div className={`p-3 rounded-full ${link.color} group-hover:scale-110 transition-transform`}>
                                            <link.icon className="w-6 h-6" />
                                        </div>
                                        <span className={`text-sm font-semibold text-center ${link.name === "Browse Shop" ? "text-indigo-600" : "text-text-heading"}`}>{link.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Recent Activity */}
                    <section className="bg-white rounded-2xl border border-border-color shadow-sm p-6">
                        <h2 className="text-lg font-bold text-text-heading mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {RECENT_ACTIVITY.map((activity, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                            <activity.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-text-heading text-sm">{activity.title}</p>
                                            <p className="text-xs text-text-muted">{activity.date}</p>
                                        </div>
                                    </div>
                                    {activity.amount && (
                                        <span className="font-bold text-text-heading text-sm">{activity.amount}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Side Column: Upcoming Payments */}
                <div className="space-y-8">
                    <section className="bg-white rounded-2xl border border-border-color shadow-sm p-6 h-full">
                        <h2 className="text-lg font-bold text-text-heading mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-500" /> Upcoming Payments
                        </h2>
                        <div className="space-y-0 divide-y divide-slate-100">
                            {UPCOMING_PAYMENTS.map((payment, index) => (
                                <div key={index} className="py-4 first:pt-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-bold text-text-heading text-sm">{payment.name}</p>
                                        <span className="text-sm font-bold text-primary">{payment.amount}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-text-muted">
                                        <span>{payment.date}</span>
                                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">{payment.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2.5 text-sm font-bold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors">
                            View All Invoices
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
}
