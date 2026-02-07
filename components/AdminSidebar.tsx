"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    Package, 
    RefreshCw, 
    Users, 
    FileText, 
    CreditCard, 
    Percent, 
    Scale, 
    Settings, 
    BarChart3, 
    Files,
    Layers,
    UserCircle,
    LogOut
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Subscriptions", href: "/admin/subscriptions", icon: RefreshCw },
    { name: "Quotations", href: "/admin/quotations", icon: Files },
    { name: "Invoices", href: "/admin/invoices", icon: FileText },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Recurring Plans", href: "/admin/plans", icon: Layers },
    { name: "Discounts", href: "/admin/discounts", icon: Percent },
    { name: "Taxes", href: "/admin/taxes", icon: Scale },
    { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300">
            {/* Logo Area */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/20">
                        M
                    </div>
                    <div>
                        <span className="block text-sm font-bold tracking-tight text-white">Mio SaaS</span>
                        <span className="block text-[10px] uppercase tracking-wider text-slate-500">Enterprise</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700">
                <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Main Menu
                </div>
                <div className="space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? "bg-blue-600/10 text-blue-400 shadow-sm ring-1 ring-inset ring-blue-500/20"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`h-4 w-4 transition-colors ${
                                        isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                                    }`} />
                                    <span>{item.name}</span>
                                </div>
                                {isActive && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* User Footer */}
            <div className="border-t border-slate-800 bg-slate-950 p-4">
                <div className="group flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 ring-2 ring-slate-800 transition-all group-hover:ring-slate-700">
                            <span className="text-xs font-semibold text-slate-300">AU</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-medium text-white">Admin User</p>
                            <p className="truncate text-xs text-slate-500">admin@mio.com</p>
                        </div>
                    </div>
                    <LogOut className="h-4 w-4 text-slate-500 transition-colors hover:text-red-400" />
                </div>
            </div>
        </aside>
    );
}
