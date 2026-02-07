"use client";

import { useState, useEffect } from "react";
import odooAPI from "@/lib/odoo-api";
import type { OdooPlan } from "@/lib/odoo-api-types";

export default function AdminPlansPage() {
  const [list, setList] = useState<OdooPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // odooAPI.getPlans()
        //     .then((res) => setList(Array.isArray(res.data) ? res.data : []))
        //     .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
        //     .finally(() => setLoading(false));

        setList([
            { id: 1, name: "Monthly", billing_period: "month", price: 100 },
            { id: 2, name: "Yearly", billing_period: "year", price: 1000 },
        ]);
        setLoading(false);
    }, []);

  if (loading) return <div className="p-8 text-text-muted">Loading plans...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-heading">Recurring Plans</h1>
      <p className="mt-2 text-text-muted">Billing period and pricing (from Odoo API).</p>
      <div className="mt-6 overflow-x-auto rounded-xl border border-border-color bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-color bg-gray-50/80">
            <tr>
              <th className="px-4 py-3 font-medium text-text-heading">ID</th>
              <th className="px-4 py-3 font-medium text-text-heading">Name</th>
              <th className="px-4 py-3 font-medium text-text-heading">Billing period</th>
              <th className="px-4 py-3 font-medium text-text-heading">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {list.map((plan) => (
              <tr key={plan.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium">{plan.id}</td>
                <td className="px-4 py-3">{plan.name}</td>
                <td className="px-4 py-3">{plan.billing_period}</td>
                <td className="px-4 py-3">₹{Number(plan.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-6 text-text-muted">No plans found.</p>}
      </div>
    </div>
  );
}
