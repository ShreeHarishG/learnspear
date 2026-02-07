import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface OdooFormLayoutProps {
    title: string;
    subtitle?: string;
    breadcrumbs?: { label: string; href: string }[];
    actions?: React.ReactNode;
    statusbar?: React.ReactNode;
    children: React.ReactNode;
}

export function OdooFormLayout({ 
    title, 
    subtitle, 
    breadcrumbs, 
    actions, 
    statusbar, 
    children 
}: OdooFormLayoutProps) {
    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="flex flex-col gap-4">
                     {/* Breadcrumbs / Back */}
                     <div className="flex items-center gap-2 text-sm text-slate-500">
                        {breadcrumbs && breadcrumbs.map((crumb, i) => (
                            <React.Fragment key={crumb.href}>
                                <Link href={crumb.href} className="hover:text-blue-600 transition-colors">
                                    {crumb.label}
                                </Link>
                                {i < breadcrumbs.length - 1 && <span>/</span>}
                            </React.Fragment>
                        ))}
                     </div>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
                            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                            {actions}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            {statusbar && (
                <div className="sticky top-0 z-10 shrink-0">
                    {statusbar}
                </div>
            )}

            {/* Main Content (Sheet) */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="mx-auto max-w-5xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px]">
                    {children}
                </div>
            </div>
        </div>
    );
}
