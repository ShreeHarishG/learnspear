"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { ShoppingCart, User, Package, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export function UserNavbar() {
    const pathname = usePathname();
    const { user } = useUser();

    const navItems = [
        { name: "Home", href: "/user/" },
        { name: "Shop", href: "/user/shop" },
        { name: "My Orders", href: "/user/orders" },
        { name: "My Account", href: "/user/profile" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-blue-100/50 shadow-sm supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold transition-transform group-hover:scale-105 shadow-lg shadow-blue-200">
                        M
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:inline-block">
                        Mio
                    </span>
                </Link>

                {/* Center Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors hover:text-blue-600 ${isActive ? "text-blue-600" : "text-slate-500"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Cart */}
                    <Link href="/user/cart">
                        <button className="relative p-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors group">
                            <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110" />
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full ring-2 ring-white">
                                2
                            </span>
                        </button>
                    </Link>

                    {/* Profile Menu */}
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <span className="hidden sm:inline-block text-sm font-semibold text-slate-700">
                            My Profile
                        </span>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9 border-2 border-slate-100 hover:border-blue-200 transition-colors"
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
