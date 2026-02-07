"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, Check, CreditCard, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import odooAPI from "@/lib/odoo-api";

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params?.id as string;
    
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!productId) return;
        odooAPI.getProductDetail(productId)
            .then(res => {
                // Ensure we handle both "result" wrapper or direct data
                const p = res.data || res;
                if (p) setProduct(p);
            })
            .catch(err => toast.error("Failed to load product"))
            .finally(() => setLoading(false));
    }, [productId]);

    if (loading) return <div className="p-12 text-center text-slate-500">Loading product...</div>;
    if (!product) return <div className="p-12 text-center text-slate-500">Product not found.</div>;

    const handleAddToCart = () => {
        const cartItem = {
            id: product.id,
            product_id: product.id, // Odoo needs product_id
            name: product.name,
            price: product.list_price,
            quantity: quantity,
            image: product.image_1920
        };

        // Save to LocalStorage
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingItemIndex = existingCart.findIndex((item: any) => item.product_id === product.id);

        if (existingItemIndex > -1) {
            existingCart[existingItemIndex].quantity += quantity;
        } else {
            existingCart.push(cartItem);
        }

        localStorage.setItem("cart", JSON.stringify(existingCart));
        
        toast.success(`Added ${quantity} x ${product.name} to cart!`);
        router.push("/user/cart");
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                <Link href="/user/shop" className="hover:text-slate-900">Shop</Link>
                <span>/</span>
                <span className="text-slate-900 font-medium">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Gallery Mockup */}
                <div className="space-y-4">
                    <div className="aspect-square bg-white rounded-2xl border border-slate-200 flex items-center justify-center p-8 shadow-sm overflow-hidden">
                        {product.image_1920 ? (
                            <img src={`data:image/png;base64,${product.image_1920}`} alt={product.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                            <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 text-4xl font-bold">
                                {product.name?.[0]}
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">{product.categ_id?.[1] || "Product"}</span>
                    <h1 className="text-4xl font-bold text-slate-900 mt-2 mb-4">{product.name}</h1>
                    <div className="text-3xl font-bold text-slate-900 mb-6">₹{product.list_price}</div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
                        <p className="text-slate-600">
                             {product.description_sale || "No description available for this product."}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                            <button
                                className="px-4 py-3 hover:bg-slate-50 text-slate-500 rounded-l-lg"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >-</button>
                            <span className="px-4 py-3 font-bold text-slate-900 min-w-[3rem] text-center">{quantity}</span>
                            <button
                                className="px-4 py-3 hover:bg-slate-50 text-slate-500 rounded-r-lg"
                                onClick={() => setQuantity(quantity + 1)}
                            >+</button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-slate-900 text-white rounded-lg py-3 font-bold shadow-lg hover:bg-slate-800 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" /> Add to Cart
                        </button>
                    </div>

                    {/* Extra Info */}
                    <div className="space-y-2 text-sm text-slate-500">
                        <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> In Stock</p>
                        <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> Immediate Delivery</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
