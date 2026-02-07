"use client";

import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";

export function LandingNavbar() {
    return (
        <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border-color">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                        M
                    </div>
                    <span className="text-xl font-bold text-text-heading tracking-tight">
                        Mio
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-text-muted hover:text-primary transition-colors font-medium">
                        Features
                    </Link>
                    <Link href="#pricing" className="text-text-muted hover:text-primary transition-colors font-medium">
                        Pricing
                    </Link>
                    <Link href="#about" className="text-text-muted hover:text-primary transition-colors font-medium">
                        About
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <SignInButton mode="modal">
                        <button className="hidden sm:block text-text-heading font-semibold hover:text-primary transition-colors cursor-pointer">
                            Sign In
                        </button>
                    </SignInButton>
                    <Link href="/sign-up">
                        <button className="bg-primary text-white rounded-full px-6 py-2.5 font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:bg-primary-dark transition-all hover:-translate-y-0.5 cursor-pointer">
                            Get Started
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
