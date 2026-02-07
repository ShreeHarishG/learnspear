"use client";

import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Sarah Jenkins",
        role: "CTO at TechFlow",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        content: "Mio transformed how we manage our SaaS spend. We saved over $12k in the first month alone by identifying unused licenses.",
        rating: 5
    },
    {
        name: "Michael Chen",
        role: "Founder, StartUp Inc",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        content: "The automated invoicing feature is a game-changer. I used to spend hours on billing, now it happens automatically in the background.",
        rating: 5
    },
    {
        name: "Emily Rodriguez",
        role: "Finance Director, GlobalMedia",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
        content: "Incredible visibility into our subscription stack. The security features and audit logs give us the compliance assurance we need.",
        rating: 4
    }
];

export function LandingTestimonials() {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-20 -mt-20" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-20 -mb-20" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-4">Testimonials</h2>
                    <h3 className="text-4xl font-bold text-text-heading mb-6">
                        Loved by businesses <br /> across the globe.
                    </h3>
                    <p className="text-xl text-text-muted">
                        Don&apos;t just take our word for it. Here&apos;s what our customers have to say.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-border-color hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                            <div className="flex gap-1 mb-4 text-accent">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? "fill-current" : "text-slate-200"}`} />
                                ))}
                            </div>
                            <p className="text-text-heading text-lg mb-6 flex-grow italic">
                                &quot;{testimonial.content}&quot;
                            </p>
                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                                    {/* In a real app, use next/image here. For mock, we'll just show initials if image fails or for simplicity */}
                                    {/* <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" /> */}
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-heading">{testimonial.name}</h4>
                                    <p className="text-sm text-text-muted">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
