"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, Check, CreditCard, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

// Mock Product Data Function (simulate fetching)
function getProduct(id: string) {
    return {
        id,
        name: "Premium SaaS Plan",
        category: "Subscription",
        basePrice: 1200,
        description: "The ultimate solution for your business needs. Includes advanced analytics, 24/7 support, and unlimited users.",
        variants: [
            { id: 1, name: "Standard", priceMod: 0 },
            { id: 2, name: "Pro", priceMod: 500 },
        ],
        plans: [
            { name: "Monthly", duration: 1, discount: 0 },
            { name: "6 Months", duration: 6, discount: 0.20 }, // 20% off
            { name: "Yearly", duration: 12, discount: 0.30 }, // 30% off
        ]
    };
}

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params?.id as string;
    const product = getProduct(productId);

    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    const [selectedPlan, setSelectedPlan] = useState(product.plans[0]);
    const [quantity, setQuantity] = useState(1);

    const basePrice = product.basePrice + selectedVariant.priceMod;
    const monthlyPrice = basePrice;

    // Calculate Plan Prices
    const calculatePlanPrice = (plan: typeof product.plans[0]) => {
        const totalMonths = plan.duration;
        const totalBase = monthlyPrice * totalMonths;
        const discountedTotal = totalBase * (1 - plan.discount);
        const pricePerMonth = discountedTotal / totalMonths;

        return {
            total: Math.round(discountedTotal),
            perMonth: Math.round(pricePerMonth),
            originalTotal: totalBase
        };
    };

    const currentPricing = calculatePlanPrice(selectedPlan);

    const handleAddToCart = () => {
        // Logic to add to cart context/store would go here
        toast.success(`Added ${quantity} x ${product.name} to cart!`);
        router.push("/user/cart");
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
                <Link href="/user" className="hover:text-primary">Shop</Link>
                <span>/</span>
                <span className="text-text-heading font-medium">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Gallery Mockup */}
                <div className="space-y-4">
                    <div className="aspect-square bg-white rounded-2xl border border-border-color flex items-center justify-center p-8 shadow-sm">
                        <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 text-4xl font-bold">
                            Big Image
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-square bg-white rounded-xl border border-border-color flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                                <span className="text-xs text-text-muted">Img {i}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <span className="text-accent font-bold tracking-wider uppercase text-sm">{product.category}</span>
                    <h1 className="text-4xl font-bold text-text-heading mt-2 mb-4">{product.name}</h1>

                    {/* Pricing Table (From Sketch) */}
                    <div className="bg-white rounded-xl border border-border-color overflow-hidden mb-8">
                        <div className="grid grid-cols-3 bg-slate-50 p-3 text-xs font-bold text-text-muted uppercase tracking-wide border-b border-border-color">
                            <div>Duration</div>
                            <div>Total Cost</div>
                            <div className="text-right">Monthly Eq.</div>
                        </div>
                        <div className="divide-y divide-border-color">
                            {product.plans.map(plan => {
                                const pricing = calculatePlanPrice(plan);
                                const isSelected = selectedPlan.name === plan.name;

                                return (
                                    <div
                                        key={plan.name}
                                        onClick={() => setSelectedPlan(plan)}
                                        className={`grid grid-cols-3 p-4 cursor-pointer transition-colors ${isSelected ? "bg-primary/5 shadow-inner" : "hover:bg-slate-50"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 font-medium text-text-heading">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-primary bg-primary" : "border-slate-300"}`}>
                                                {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                            </div>
                                            {plan.name}
                                        </div>
                                        <div className="font-semibold text-text-heading">
                                            ${pricing.total}
                                            {plan.discount > 0 && <span className="ml-2 text-xs text-red-500 line-through font-normal">${pricing.originalTotal}</span>}
                                        </div>
                                        <div className="text-right font-bold text-primary">
                                            ${pricing.perMonth}/mo
                                            {plan.discount > 0 && <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">-{plan.discount * 100}%</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="mb-8">
                        <h3 className="font-bold text-text-heading mb-3">Variants Available</h3>
                        <div className="flex gap-4">
                            {product.variants.map(variant => (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={`px-4 py-2 rounded-lg border font-medium transition-all ${selectedVariant.id === variant.id
                                        ? "border-primary bg-primary text-white"
                                        : "border-border-color text-text-muted hover:border-primary/50"
                                        }`}
                                >
                                    {variant.name} {variant.priceMod > 0 && `(+$${variant.priceMod})`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center border border-border-color rounded-lg">
                            <button
                                className="px-4 py-2 hover:bg-slate-50 text-text-muted"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >-</button>
                            <span className="px-4 py-2 font-bold text-text-heading min-w-[3rem] text-center">{quantity}</span>
                            <button
                                className="px-4 py-2 hover:bg-slate-50 text-text-muted"
                                onClick={() => setQuantity(quantity + 1)}
                            >+</button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-primary text-white rounded-lg py-3 font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" /> Add to Cart - ${currentPricing.total * quantity}
                        </button>
                    </div>

                    {/* Extra Info */}
                    <div className="space-y-2 text-sm text-text-muted">
                        <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Terms and conditions apply</p>
                        <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 30-day money-back guarantee</p>
                        <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Delivery: Instant Activation</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
