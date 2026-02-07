"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, RefreshCw, Users, FileText, CreditCard, Percent, Scale, Settings, BarChart3, Files, Layers } from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Subscriptions", href: "/admin/subscriptions", icon: RefreshCw },
    { name: "Invoices", href: "/admin/invoices", icon: FileText },
    { name: "Quotations", href: "/admin/quotations", icon: Files },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Plans", href: "/admin/plans", icon: Layers }, // Changed icon
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Discounts", href: "/admin/discounts", icon: Percent },
    { name: "Taxes", href: "/admin/taxes", icon: Scale },
    { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-all duration-300">
            {/* Logo Area */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-6">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-white font-bold">
                        M
                    </div>
                    <span className="block text-lg font-bold tracking-tight text-slate-900">Mio</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
                <div className="space-y-0.5">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-slate-100 text-slate-900"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"}`} />
                                    <span>{item.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* User Footer - Removed */}
        </aside>
    );
}
