"use client";

import { CreditCard, BarChart3, ShieldCheck, Zap, Users, Globe } from "lucide-react";

const features = [
    {
        icon: <CreditCard className="w-8 h-8 text-white" />,
        title: "Consolidated Billing",
        description: "Manage all your SaaS subscriptions and recurring payments in one unified dashboard. Never miss a due date again.",
        color: "bg-primary"
    },
    {
        icon: <BarChart3 className="w-8 h-8 text-white" />,
        title: "Spend Analytics",
        description: "Gain deep insights into your spending habits with real-time analytics. Identify redundant subscriptions and save money.",
        color: "bg-accent"
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-white" />,
        title: "Enterprise Security",
        description: "Bank-grade encryption and role-based access control ensure your financial data is always secure and compliant.",
        color: "bg-primary-light"
    },
    {
        icon: <Zap className="w-8 h-8 text-white" />,
        title: "Automated Invoicing",
        description: "Generate and send professional invoices automatically. Streamline your billing workflow and get paid faster.",
        color: "bg-secondary"
    },
    {
        icon: <Users className="w-8 h-8 text-white" />,
        title: "Team Management",
        description: "Collaborate with your team. Assign roles, track usage, and manage access permissions effortlessly.",
        color: "bg-blue-600"
    },
    {
        icon: <Globe className="w-8 h-8 text-white" />,
        title: "Global Payments",
        description: "Accept payments from anywhere in the world. Support for multiple currencies and international tax compliance.",
        color: "bg-green-600"
    }
];

export function LandingFeatures() {
    return (
        <section id="features" className="py-24 bg-white relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[500px] bg-slate-50 -skew-y-3 -z-10" />

            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-4">Why Choose Mio</h2>
                    <h3 className="text-4xl lg:text-5xl font-bold text-text-heading mb-6 tracking-tight">
                        Powerful features for <br /> modern businesses.
                    </h3>
                    <p className="text-xl text-text-muted">
                        Everything you need to take control of your subscriptions and financial operations.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-3xl bg-white border border-border-color shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 relative overflow-hidden"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md transition-transform group-hover:scale-110 ${feature.color}`}>
                                {feature.icon}
                            </div>
                            <h4 className="text-xl font-bold text-text-heading mb-3 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h4>
                            <p className="text-text-muted leading-relaxed">
                                {feature.description}
                            </p>

                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-slate-100 rounded-tl-full -mr-4 -mb-4 opacity-50 group-hover:scale-150 transition-transform duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
