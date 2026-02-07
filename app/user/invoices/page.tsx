"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import odooAPI from "@/lib/odoo-api";
import type { OdooInvoice } from "@/lib/odoo-api-types";

export default function UserInvoicesPage() {
  const [list, setList] = useState<OdooInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = odooAPI.getUser();

    if (!user?.partner_id) {
      setError("User not linked to a customer");
      setLoading(false);
      return;
    }

    odooAPI
      .getUserInvoices(user.partner_id)
      .then((res) => setList(Array.isArray(res.data) ? res.data : []))
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load invoices")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-text-muted">Loading invoices...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-heading">My Invoices</h1>
      <p className="mt-2 text-text-muted">
        Download and view your invoices (from Odoo).
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border-color bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-color bg-gray-50/80">
            <tr>
              <th className="px-4 py-3 font-medium">Invoice #</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Amount</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-color">
            {list.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-primary">
                  <Link
                    href={`/user/invoices/${inv.id}`}
                    className="hover:underline"
                  >
                    {inv.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {inv.partner_id?.[1] ?? "-"}
                </td>
                <td className="px-4 py-3">{inv.invoice_date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase ${
                      inv.payment_state === "paid"
                        ? "bg-green-100 text-green-700"
                        : inv.payment_state === "partial"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {inv.payment_state}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">
                  ₹{Number(inv.amount_total).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {list.length === 0 && (
          <p className="p-6 text-text-muted">No invoices found.</p>
        )}
      </div>
    </div>
  );
}
