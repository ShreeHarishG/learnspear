"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
    {
        question: "How does Mio integrate with my subscriptions?",
        answer: "Mio connects directly to your bank account or credit card statements via secure APIs (like Plaid) to automatically detect recurring payments. You can also manually add subscriptions or upload CSV statements."
    },
    {
        question: "Is my financial data secure?",
        answer: "Absolutely. We use bank-grade 256-bit encryption and never store your banking credentials. We are compliant with SOC2 and GDPR standards to ensure your data is always protected."
    },
    {
        question: "Can I manage multiple team members?",
        answer: "Yes! Our Team and Enterprise plans allow you to invite unlimited team members, assign custom roles, and track spending by department or individual."
    },
    {
        question: "Do you offer a free trial?",
        answer: "Yes, we offer a 14-day free trial on all paid plans. No credit card required to start. You can also use our Free tier forever for personal use with limited features."
    },
    {
        question: "Can I cancel my subscription at any time?",
        answer: "Yes, there are no long-term contracts. You can upgrade, downgrade, or cancel your plan at any time directly from your dashboard."
    }
];

export function LandingFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-white relative overflow-hidden" id="faq">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-4">FAQ</h2>
                    <h3 className="text-4xl font-bold text-text-heading mb-6">
                        Frequently Asked Questions
                    </h3>
                    <p className="text-xl text-text-muted">
                        Everything you need to know about the product and billing.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? "bg-slate-50 border-primary/20 shadow-md" : "bg-white border-border-color hover:border-text-muted/50"}`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className={`text-lg font-bold ${openIndex === index ? "text-primary" : "text-text-heading"}`}>
                                    {faq.question}
                                </span>
                                <span className={`p-2 rounded-full ${openIndex === index ? "bg-primary/10 text-primary" : "bg-slate-100 text-text-muted"}`}>
                                    {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </span>
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                            >
                                <div className="p-6 pt-0 text-text-muted leading-relaxed border-t border-transparent">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
