"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, CreditCard, MapPin, Truck } from "lucide-react";
import toast from "react-hot-toast";
import odooAPI from "@/lib/odoo-api";

export default function CartPage() {
    const [step, setStep] = useState(1); // 1: Cart, 2: Address, 3: Payment
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock Address Data (Load from Odoo user eventually)
    const [address, setAddress] = useState({
        line1: "123 Business Rd",
        city: "Tech City",
        zip: "10001",
        country: "USA"
    });

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(items);
        setLoading(false);
    }, []);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const handleRemove = (id: number) => {
        const newCart = cartItems.filter(item => item.product_id !== id);
        setCartItems(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        toast.success("Item removed from cart");
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        setStep(2);
    };

    const handlePlaceOrder = async () => {
        const user = odooAPI.getUser();
        if (!user?.partner_id) {
            toast.error("You must be logged in to place an order.");
            return;
        }

        const orderData = {
            partner_id: user.partner_id,
            lines: cartItems.map(item => ({
                product_id: item.product_id,
                product_uom_qty: item.quantity
            }))
        };
        
        // toast.loading("Placing order...");
        try {
            const result = await odooAPI.createOrder(orderData);
            if (result) {
                // Clear Cart
                localStorage.removeItem("cart");
                setCartItems([]);
                setStep(4); // Success
                toast.success("Order placed successfully!");
            } else {
                toast.error("Failed to place order.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred.");
        }
    };

    if (step === 4) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Truck className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Thank you for your order!</h1>
                <p className="text-slate-500 text-lg mb-8">Your order has been placed successfully.</p>
                <Link href="/user/orders">
                    <button className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-slate-800 transition-colors">
                        View My Orders
                    </button>
                </Link>
            </div>
        );
    }

    if (loading) return <div className="p-12 text-center text-slate-500">Loading cart...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">
                {step === 1 ? "Shopping Cart" : step === 2 ? "Shipping Address" : "Payment"}
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Cart Items / Forms */}
                <div className="flex-1 space-y-6">
                    {step === 1 && (
                        <>
                            {cartItems.length === 0 ? (
                                <div className="text-center py-12 border border-dashed rounded-xl">
                                    <p className="text-slate-500 mb-4">Your cart is empty.</p>
                                    <Link href="/user/shop" className="text-blue-600 hover:underline">Browse Products</Link>
                                </div>
                            ) : (
                                cartItems.map(item => (
                                    <div key={item.product_id} className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-6">
                                        <div className="w-20 h-20 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                             {item.image ? (
                                                <img src={`data:image/png;base64,${item.image}`} className="w-full h-full object-contain" />
                                             ) : (
                                                <span className="text-xs text-slate-400">No Img</span>
                                             )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900">{item.name}</h3>
                                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">₹{item.price * item.quantity}</p>
                                            <button
                                                onClick={() => handleRemove(item.product_id)}
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
                        <div className="bg-white p-8 rounded-xl border border-slate-200">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
                                <MapPin className="text-blue-600" /> Shipping Address
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
                                <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-900">Back to Cart</button>
                                <button onClick={() => setStep(3)} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold">Continue to Payment</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="bg-white p-8 rounded-xl border border-slate-200">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
                                <CreditCard className="text-blue-600" /> Payment Method
                            </h2>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                                <p className="text-sm text-slate-500">This is a mock payment gateway. No real charge will be made. The order will be created as "Draft Quotation" in Odoo.</p>
                            </div>
                            <div className="mt-6 flex justify-between">
                                <button onClick={() => setStep(2)} className="text-slate-500 hover:text-slate-900">Back to Address</button>
                                <button onClick={handlePlaceOrder} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800">Place Order</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Order Summary */}
                <div className="w-full lg:w-96">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 sticky top-24">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Subtotal</span>
                                <span className="font-medium text-slate-900">₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Taxes (Est. 10%)</span>
                                <span className="font-medium text-slate-900">₹{tax}</span>
                            </div>
                            <div className="border-t border-slate-200 pt-4 flex justify-between text-lg font-bold text-slate-900">
                                <span>Total</span>
                                <span className="text-blue-600">₹{total}</span>
                            </div>
                        </div>

                        {step === 1 && (
                            <div className="mt-6 space-y-4">
                                <button
                                    onClick={handleCheckout}
                                    disabled={cartItems.length === 0}
                                    className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
