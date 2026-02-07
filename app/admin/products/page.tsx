"use client";

import { useState, useEffect } from "react";
import odooAPI from "@/lib/odoo-api";
import type { OdooProduct } from "@/lib/odoo-api-types";

export default function AdminProductsPage() {
  const [list, setList] = useState<OdooProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    odooAPI.getProducts()
      .then((res) => setList(Array.isArray(res.data) ? res.data : []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-text-muted">Loading products...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-heading">Products Management</h1>
      <p className="mt-2 text-text-muted">Products where sale_ok is true (from Odoo API).</p>
      <div className="mt-6 overflow-x-auto rounded-xl border border-border-color bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-color bg-gray-50/80">
            <tr>
              <th className="px-4 py-3 font-medium text-text-heading">ID</th>
              <th className="px-4 py-3 font-medium text-text-heading">Name</th>
              <th className="px-4 py-3 font-medium text-text-heading">List price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {list.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium">{product.id}</td>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">₹{Number(product.list_price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-6 text-text-muted">No products found.</p>}
      </div>
    </div>
  );
}
