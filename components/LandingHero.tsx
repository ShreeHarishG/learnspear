"use client";

import Link from "next/link";
import Image from "next/image";

export function LandingHero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl opacity-60 animate-pulse" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl opacity-60 animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl opacity-30 -z-10" />

            <div className="container mx-auto px-6 text-center relative z-10">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-50 to-white border border-border-color rounded-full px-4 py-1.5 mb-8 shadow-sm animate-fade-in-up hover:shadow-md transition-shadow cursor-default">
                    <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
                    <span className="text-sm font-medium text-text-muted">
                        New: Smart Invoice Automation
                    </span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold text-text-heading tracking-tight mb-8 max-w-4xl mx-auto leading-[1.1] animate-fade-in-up delay-100">
                    Master Your Subscriptions. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-accent">
                        Optimize Your Spend.
                    </span>
                </h1>

                <p className="text-xl text-text-muted max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200">
                    The all-in-one platform for managing recurring payments, automating invoices, and gaining total visibility into your SaaS usage.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up delay-300">
                    <Link href="/sign-up">
                        <button className="w-full sm:w-auto bg-primary text-white rounded-full px-8 py-4 text-lg font-bold shadow-xl shadow-primary/25 hover:shadow-2xl hover:bg-primary-dark transition-all hover:-translate-y-1 cursor-pointer">
                            Get Started for Free
                        </button>
                    </Link>
                    <Link href="#demo">
                        <button className="w-full sm:w-auto bg-white text-text-heading border border-border-color rounded-full px-8 py-4 text-lg font-bold shadow-md hover:shadow-lg hover:border-accent transition-all hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-2 group">
                            <span className="group-hover:text-primary transition-colors">▶</span> Watch Demo
                        </button>
                    </Link>
                </div>

                {/* Dashboard Preview */}
                <div className="relative mx-auto max-w-5xl rounded-2xl p-2 bg-gradient-to-b from-white to-slate-50 border border-slate-200 shadow-2xl animate-fade-in-up delay-400">
                    <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative">
                        {/* Overlay Gradient for sheen effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                        <Image
                            src="/hero-dashboard.png"
                            alt="Mio Dashboard Mockup"
                            width={1200}
                            height={800}
                            className="w-full h-auto object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Trusted By Section */}
                <div className="mt-24 pt-10 border-t border-slate-100 animate-fade-in-up delay-500">
                    <p className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-8">Trusted by forward-thinking teams</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder Logos - In production, replace with Image components */}
                        <div className="text-2xl font-bold font-serif text-slate-800">Acme Corp</div>
                        <div className="text-2xl font-extrabold text-slate-800 tracking-tighter">GlobalBank</div>
                        <div className="text-2xl font-bold text-slate-800 italic">SaaSify</div>
                        <div className="text-2xl font-medium text-slate-800">TechFlow</div>
                        <div className="text-xl font-bold text-slate-800 border-2 border-slate-800 px-2 py-1">STARTUP</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
