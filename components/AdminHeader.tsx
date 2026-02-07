"use client";

import { Bell, Search, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

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
            <div className="flex items-center gap-4">
                <button className="lg:hidden text-slate-500 hover:text-slate-700">
                    <Menu className="h-6 w-6" />
                </button>
                
                {/* ERP Breadcrumbs */}
                <nav className="hidden md:flex items-center text-sm font-medium text-slate-500">
                    <span className="mr-2 text-slate-400">Mio</span>
                    {breadcrumbs.map((crumb, i) => (
                        <div key={crumb.href} className="flex items-center">
                            <span className="mx-2 text-slate-300">/</span>
                            <span className={i === breadcrumbs.length - 1 ? "text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"}>
                                {crumb.name}
                            </span>
                        </div>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                {/* Global Search */}
                <div className="hidden md:flex items-center relative w-64">
                    <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                </div>

                <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

                <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-2">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </header>
    );
}
