"use client";

import { useEffect, useState } from "react";
import odooAPI from "@/lib/odoo-api";
import type { OdooSubscription } from "@/lib/odoo-api-types";

export default function UserSubscriptionsPage() {
  const [list, setList] = useState<OdooSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data = await odooAPI.getSubscriptions();

        if (alive && Array.isArray(data)) {
          setList(data);
        }
      } catch (e) {
        if (alive) {
          setError("Failed to load subscriptions");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return <div className="p-8 text-text-muted">Loading subscriptions...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">My Subscriptions</h1>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Subscription</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Plan</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Amount</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {list.map((sub) => (
              <tr key={sub.id}>
                <td className="px-4 py-3">{sub.name}</td>
                <td className="px-4 py-3">{sub.partner_id?.[1] ?? "-"}</td>
                <td className="px-4 py-3">{sub.plan_id?.[1] ?? "-"}</td>
                <td className="px-4 py-3">{sub.state}</td>
                <td className="px-4 py-3">₹{sub.amount_total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {list.length === 0 && (
          <p className="p-6 text-gray-500">No subscriptions found.</p>
        )}
      </div>
    </div>
  );
}
