"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
    { name: "My Dashboard", href: "/user", icon: "📊" },
    { name: "My Subscriptions", href: "/user/subscriptions", icon: "📋" },
    { name: "My Invoices", href: "/user/invoices", icon: "🧾" },
    { name: "My Payments", href: "/user/payments", icon: "💳" },
    { name: "Profile", href: "/user/profile", icon: "👤" },
];

export function UserSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r border-border-color bg-white shadow-sm">
            <div className="flex h-16 items-center px-6 bg-primary">
                <span className="text-xl font-bold text-white tracking-widest uppercase">LearnSpear</span>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                                ? "bg-primary text-white shadow-md shadow-primary/20 border-l-4 border-accent"
                                : "text-text-muted hover:bg-slate-50 hover:text-primary"
                                }`}
                        >
                            <span className={`text-lg transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-accent" : "text-slate-400 group-hover:text-primary"}`}>{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-border-color p-4">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-border-color">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold border-2 border-accent">
                        JD
                    </div>
                    <div className="overflow-hidden">
                        <p className="truncate text-sm font-semibold text-text-heading">John Doe</p>
                        <p className="truncate text-xs text-text-muted">user@learnspear.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
