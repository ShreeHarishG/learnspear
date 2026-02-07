"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, ShoppingBag, ArrowRight } from "lucide-react";
import odooAPI from "@/lib/odoo-api";
import { Toaster } from "react-hot-toast";

export default function ShopPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Fetch Products
    useEffect(() => {
        odooAPI.getProducts()
            .then(res => {
                if (Array.isArray(res.data)) {
                    setProducts(res.data);
                } else if (res && Array.isArray(res)) {
                     setProducts(res);
                }
            })
            .catch(err => console.error("Failed to fetch products", err))
            .finally(() => setLoading(false));
    }, []);

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || (product.categ_id && product.categ_id[1] === selectedCategory);
        // Matching basic search for now. Category filter needs real category data from Odoo to be perfect.
        return matchesSearch;
    });

    // Unique Categories (Mock + derived)
    const categories = ["All", ...Array.from(new Set(products.map(p => p.categ_id?.[1]).filter(Boolean)))];

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Toaster position="bottom-right" />
            
            {/* Header / Hero Section */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm opacity-95 backdrop-blur">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                        Marketplace
                    </h1>

                    <div className="relative flex-1 max-w-md hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search essentials..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-primary/50 focus:ring-2 focus:ring-primary/10 rounded-full text-sm transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 flex-shrink-0 space-y-8 animate-in fade-in slide-in-from-left duration-500">
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Filter className="w-4 h-4" /> Categories
                        </h3>
                        <div className="space-y-1">
                            {categories.length > 1 ? categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                        selectedCategory === cat
                                            ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
                                            : "text-slate-600 hover:bg-white hover:text-slate-900"
                                    }`}
                                >
                                    {cat}
                                </button>
                            )) : (
                                <div className="px-4 py-2 text-sm text-slate-400 italic">No categories available</div>
                            )}
                        </div>
                    </div>
                    
                    {/* Banners or Promos can go here */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white text-sm hidden lg:block">
                        <p className="font-bold text-lg mb-2">Premium Access</p>
                        <p className="text-slate-300 mb-4 opacity-90">Unlock exclusive deals with a Mio subscription.</p>
                        <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors w-full border border-white/10">
                            Upgrade Now
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Mobile Search (visible only on small screens) */}
                    <div className="mb-6 md:hidden relative">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-sm outline-none focus:border-primary"
                        />
                    </div>

                    {loading ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-2xl h-80 shadow-sm animate-pulse"></div>
                            ))}
                         </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                            <ShoppingBag className="mx-auto h-12 w-12 text-slate-200 mb-3" />
                            <h3 className="text-lg font-bold text-slate-900">No products found</h3>
                            <p className="text-slate-500">Try adjusting your filters or search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
                            {filteredProducts.map((product) => (
                                <Link 
                                    href={`/user/product/${product.id}`} 
                                    key={product.id} 
                                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="aspect-[4/3] bg-slate-50 relative p-6 flex items-center justify-center group-hover:bg-slate-100/50 transition-colors">
                                        {product.image_1920 ? (
                                             <img 
                                                src={`data:image/png;base64,${product.image_1920}`} 
                                                alt={product.name} 
                                                className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
                                             />
                                        ) : (
                                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 font-bold text-xl">
                                                {product.name.substring(0,1)}
                                            </div>
                                        )}
                                        
                                        {/* Quick Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur text-slate-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm border border-slate-100">
                                                {product.categ_id?.[1] || "Item"}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-5">
                                        <div className="mb-4">
                                            <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">Premium quality {product.name} for your business.</p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price</span>
                                                <span className="text-lg font-bold text-slate-900">₹{product.list_price.toLocaleString()}</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
