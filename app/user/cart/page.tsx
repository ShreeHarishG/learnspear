"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, CreditCard, MapPin, Truck } from "lucide-react";
import toast from "react-hot-toast";

export default function CartPage() {
    const [step, setStep] = useState(1); // 1: Cart, 2: Address, 3: Payment

    // Mock Cart Data
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Premium SaaS Plan", variant: "Pro", plan: "Yearly", price: 10080, quantity: 1, image: "/placeholder-product-1.png" },
        { id: 2, name: "Enterprise Analytics", variant: "Standard", plan: "Monthly", price: 500, quantity: 1, image: "/placeholder-product-2.png" },
    ]);

    // Mock Address Data
    const [address, setAddress] = useState({
        line1: "123 Business Rd",
        city: "Tech City",
        zip: "10001",
        country: "USA"
    });

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const handleRemove = (id: number) => {
        setCartItems(cartItems.filter(item => item.id !== id));
        toast.success("Item removed from cart");
    };

    const handleCheckout = () => {
        setStep(2);
    };

    const handlePlaceOrder = () => {
        setStep(4); // Success
        toast.success("Order placed successfully!");
    };

    if (step === 4) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Truck className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-text-heading mb-4">Thank you for your order!</h1>
                <p className="text-text-muted text-lg mb-8">Order #S0001 has been processed successfully.</p>
                <Link href="/user">
                    <button className="bg-primary text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-primary-dark transition-colors">
                        Continue Shopping
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-text-heading mb-8">
                {step === 1 ? "Shopping Cart" : step === 2 ? "Shipping Address" : "Payment"}
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Cart Items / Forms */}
                <div className="flex-1 space-y-6">
                    {step === 1 && (
                        <>
                            {cartItems.length === 0 ? (
                                <p>Your cart is empty.</p>
                            ) : (
                                cartItems.map(item => (
                                    <div key={item.id} className="bg-white p-6 rounded-xl border border-border-color flex items-center gap-6">
                                        <div className="w-20 h-20 bg-slate-100 rounded-lg flex-shrink-0" />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-text-heading">{item.name}</h3>
                                            <p className="text-sm text-text-muted">{item.variant} • {item.plan}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-primary">${item.price}</p>
                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 mt-2 justify-end"
                                            >
                                                <Trash2 className="w-4 h-4" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </>
                    )}

                    {step === 2 && (
                        <div className="bg-white p-8 rounded-xl border border-border-color">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <MapPin className="text-primary" /> Shipping Address
                            </h2>
                            <div className="grid gap-4">
                                <input type="text" value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} className="border p-3 rounded" placeholder="Address Line 1" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="border p-3 rounded" placeholder="City" />
                                    <input type="text" value={address.zip} onChange={e => setAddress({ ...address, zip: e.target.value })} className="border p-3 rounded" placeholder="ZIP Code" />
                                </div>
                                <input type="text" value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })} className="border p-3 rounded" placeholder="Country" />
                            </div>
                            <div className="mt-6 flex justify-between">
                                <button onClick={() => setStep(1)} className="text-text-muted hover:text-primary">Back to Cart</button>
                                <button onClick={() => setStep(3)} className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Continue to Payment</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="bg-white p-8 rounded-xl border border-border-color">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <CreditCard className="text-primary" /> Payment Method
                            </h2>
                            <div className="bg-slate-50 p-4 rounded-lg border border-border-color mb-6">
                                <p className="text-sm text-text-muted">This is a mock payment gateway. No real charge will be made.</p>
                            </div>
                            <div className="mt-6 flex justify-between">
                                <button onClick={() => setStep(2)} className="text-text-muted hover:text-primary">Back to Address</button>
                                <button onClick={handlePlaceOrder} className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Pay & Place Order</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Order Summary */}
                <div className="w-full lg:w-96">
                    <div className="bg-white p-6 rounded-xl border border-border-color sticky top-24">
                        <h2 className="text-xl font-bold text-text-heading mb-6">Order Summary</h2>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-text-muted">Subtotal</span>
                                <span className="font-medium">${subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-muted">Taxes (10%)</span>
                                <span className="font-medium">${tax}</span>
                            </div>
                            <div className="border-t border-border-color pt-4 flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary">${total}</span>
                            </div>
                        </div>

                        {step === 1 && (
                            <div className="mt-6 space-y-4">
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Discount Code" className="flex-1 border border-border-color rounded px-3 py-2 text-sm" />
                                    <button className="bg-slate-800 text-white px-4 py-2 rounded text-sm font-semibold">Apply</button>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-primary text-white py-3 rounded-lg font-bold shadow-lg hover:bg-primary-dark transition-colors"
                                >
                                    Checkout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
