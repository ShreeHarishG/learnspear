"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import Image from "next/image";

const PRODUCTS = [
  {
    id: 1,
    name: "Premium SaaS Plan",
    category: "Subscription",
    price: 1200,
    billing: "Monthly",
    image: "/placeholder-product-1.png",
  },
  {
    id: 2,
    name: "Enterprise Analytics",
    category: "Add-on",
    price: 500,
    billing: "Monthly",
    image: "/placeholder-product-2.png",
  },
  {
    id: 3,
    name: "Data Storage Pack",
    category: "Infrastructure",
    price: 200,
    billing: "Monthly",
    image: "/placeholder-product-3.png",
  },
  {
    id: 4,
    name: "Security Audit Tool",
    category: "Tools",
    price: 800,
    billing: "One-time",
    image: "/placeholder-product-4.png",
  },
  {
    id: 5,
    name: "API Rate Limit Boost",
    category: "Add-on",
    price: 150,
    billing: "Monthly",
    image: "/placeholder-product-5.png",
  },
  {
    id: 6,
    name: "White Label License",
    category: "License",
    price: 5000,
    billing: "Yearly",
    image: "/placeholder-product-6.png",
  },
];

const CATEGORIES = [
  "All Products",
  "Subscription",
  "Add-on",
  "Infrastructure",
  "Tools",
  "License",
];

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Products" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-bg-light p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-heading tracking-tight">
          Shop
        </h1>
        <p className="text-text-muted mt-1">
          Browse and purchase subscription plans and add-ons.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-color">
            <h3 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-accent" /> Filters
            </h3>

            <div>
              <h4 className="text-sm font-semibold text-text-heading mb-3">
                Category
              </h4>

              <ul className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-sm w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat
                          ? "bg-primary text-white font-medium"
                          : "text-text-muted hover:bg-slate-50 hover:text-primary"
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 space-y-6">
          {/* Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-border-color shadow-sm flex items-center gap-3">
            <Search className="w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none text-sm text-text-heading"
            />
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-border-color shadow-sm text-center">
              <p className="text-text-muted text-sm">No products found.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-border-color shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  <div className="relative w-full h-44 bg-gray-50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-text-heading text-lg">
                      {product.name}
                    </h3>

                    <p className="text-xs text-text-muted mt-1">
                      {product.category} • {product.billing}
                    </p>

                    <p className="mt-3 text-primary font-bold text-lg">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>

                    <button className="mt-4 w-full bg-primary text-white py-2 rounded-xl font-semibold text-sm hover:opacity-90 transition">
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
