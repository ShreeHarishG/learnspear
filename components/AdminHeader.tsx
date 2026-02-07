"use client";

import { Bell, Search, Menu, User } from "lucide-react";
import { usePathname } from "next/navigation";

export function AdminHeader() {
    const pathname = usePathname();
    
    // Simple breadcrumb logic
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
        return {
            name: segment.charAt(0).toUpperCase() + segment.slice(1),
            href
        };
    });

    return (
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-6 flex items-center justify-between">
            {/* Left: Breadcrumbs / Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
                <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md">
                    <Menu className="h-5 w-5" />
                </button>
                <nav className="hidden md:flex items-center text-sm font-medium text-slate-500">
                    <span className="mr-2">Mio</span>
                    {breadcrumbs.map((crumb, i) => (
                        <div key={crumb.href} className="flex items-center">
                            <span className="mx-2 text-slate-300">/</span>
                            <span className={i === breadcrumbs.length - 1 ? "text-slate-900" : "text-slate-500"}>
                                {crumb.name}
                            </span>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Right: Search + Actions */}
            <div className="flex items-center gap-4">
                {/* Global Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search anything..." 
                        className="h-9 w-64 rounded-md border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                </div>

                <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

                {/* Notifications */}
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
                </button>

                {/* Profile Dropdown (Simplified) */}
                <div className="flex items-center gap-3 pl-2 cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-xs">
                        AU
                    </div>
                </div>
            </div>
        </header>
    );
}
