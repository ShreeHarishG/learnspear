"use client";

import Link from "next/link";
import { Twitter, Linkedin, Github, Mail } from "lucide-react";

export function LandingFooter() {
    return (
        <footer className="bg-primary text-slate-300 py-16 border-t border-slate-800">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-primary text-xl font-bold">
                                L
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                Learn<span className="text-accent">Spear</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            Empowering businesses to master their recurring revenue and subscription spend with precision and ease.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-slate-800 hover:bg-accent hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-slate-800 hover:bg-accent hover:text-primary transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-slate-800 hover:bg-accent hover:text-primary transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h5 className="text-white font-bold mb-6">Product</h5>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-accent transition-colors">Features</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Integrations</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Enterprise</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-white font-bold mb-6">Resources</h5>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-accent transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">API Reference</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Community</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-white font-bold mb-6">Company</h5>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-accent transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Legal</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Contact
                            </Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} Mio. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
