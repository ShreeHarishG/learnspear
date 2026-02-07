"use client";

import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";

export default function OrdersPage() {
    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            {/* Sidebar / Nav */}
            <aside className="w-full lg:w-64 space-y-2">
                <Link href="/user/profile" className="block px-4 py-2 rounded-lg text-text-muted hover:bg-slate-100 hover:text-text-heading transition-colors">User Details</Link>
                <Link href="/user/orders" className="block px-4 py-2 rounded-lg bg-primary text-white font-medium">My Orders</Link>
            </aside>

            {/* Main Content */}
            <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-border-color">
                <h1 className="text-2xl font-bold text-text-heading mb-8 flex items-center gap-2">
                    <Package className="text-primary" /> My Orders
                </h1>

                <div className="space-y-4">
                    {[1, 2, 3].map((order) => (
                        <div key={order} className="border border-border-color rounded-xl p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-text-heading text-lg">Order #S000{order}</h3>
                                    <p className="text-sm text-text-muted">Placed on Feb {10 - order}, 2026</p>
                                </div>
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Delivered
                                </span>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex -space-x-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                                </div>
                                <span className="text-sm text-text-muted">+ 2 items</span>
                            </div>

                            <div className="flex justify-between items-center border-t border-border-color pt-4">
                                <div className="font-bold text-primary">Total: $1,200.00</div>
                                <button className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                                    View Details <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
