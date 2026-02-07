"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingCTA() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="bg-gradient-to-br from-primary via-primary to-accent rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
                    {/* Background Patterns */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl -ml-16 -mb-16 animate-pulse delay-500" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                            Start Taking Control of Your <br /> Subscriptions Today.
                        </h2>
                        <p className="text-lg text-white/90 mb-10 leading-relaxed">
                            Join over 10,000 satisfied businesses who have streamlined their financial operations with Mio. Start your 14-day free trial now.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/sign-up">
                                <button className="w-full sm:w-auto bg-white text-primary font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
                                    Get Started for Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <Link href="#demo">
                                <button className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-all">
                                    Schedule a Demo
                                </button>
                            </Link>
                        </div>

                        <p className="mt-8 text-sm text-white/70">
                            No credit card required. Cancel anytime.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
