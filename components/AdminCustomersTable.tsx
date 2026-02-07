"use client";

import { useState, useEffect } from "react";
import odooAPI from "@/lib/odoo-api";
import type { OdooCustomer } from "@/lib/odoo-api-types";

export function AdminCustomersTable() {
  const [list, setList] = useState<OdooCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    odooAPI.getCustomers()
      .then((res) => setList(Array.isArray(res.data) ? res.data : []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-text-muted">Loading customers...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="overflow-x-auto rounded-xl border border-border-color bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border-color bg-gray-50/80">
          <tr>
            <th className="px-4 py-3 font-medium text-text-heading">ID</th>
            <th className="px-4 py-3 font-medium text-text-heading">Name</th>
            <th className="px-4 py-3 font-medium text-text-heading">Email</th>
            <th className="px-4 py-3 font-medium text-text-heading">Phone</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color">
          {list.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50/50">
              <td className="px-4 py-3 font-medium">{c.id}</td>
              <td className="px-4 py-3">{c.name}</td>
              <td className="px-4 py-3">{c.email ?? "-"}</td>
              <td className="px-4 py-3">{c.phone ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {list.length === 0 && <p className="p-6 text-text-muted">No customers found.</p>}
    </div>
  );
}
