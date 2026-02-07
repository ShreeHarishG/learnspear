"use client";

import { useState } from "react";
import odooAPI from "@/lib/odoo-api";
import { toast } from "sonner";
import { useOdooPolling } from "@/lib/hooks/useOdooPolling";
import type { OdooCustomer } from "@/lib/odoo-api-types";

export default function AdminUsersPage() {
  // ================= STATE =================
  const { data: list, loading: loadingCustomers, error } = useOdooPolling<OdooCustomer[]>(odooAPI.getCustomers);

  // Invite Form State
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  // ================= HANDLERS =================
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);

    try {
      // TODO: Replace with your actual Server Action or API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Inviting:", email);
      
      toast.success(`Invitation sent to ${email}`);
      setEmail("");
    } catch (err) {
      toast.error("Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  // ================= RENDER =================
  return (
    <div className="flex flex-col h-full bg-slate-50">
       {/* Header */}
       <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users & Customers</h1>
          <nav className="flex items-center text-sm font-medium text-slate-500">
             <span>Admin</span>
             <span className="mx-2">/</span>
             <span className="text-slate-900">Users</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right mr-4">
              <span className="block text-2xl font-bold text-slate-900 leading-none">{list?.length || 0}</span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Users</span>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          
          {/* --- Invite Admin Section --- */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-fit">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Invite New Admin</h2>
            <p className="text-sm text-slate-500 mb-6">
              Send an invitation to a new administrator. They will be assigned the access rights upon acceptance.
            </p>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={inviting}
                className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {inviting ? "Sending..." : "Send Invitation"}
              </button>
            </form>
          </div>
        </div>

        {/* --- Customer Table Section --- */}
        <h2 className="text-lg font-bold text-slate-900 mb-4">Odoo Partners</h2>
        
        {loadingCustomers && !list ? (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
            <span className="text-slate-500">Loading customers...</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-100">
            Error: {error}
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-slate-900">ID</th>
                    <th className="px-6 py-3 font-semibold text-slate-900">Name</th>
                    <th className="px-6 py-3 font-semibold text-slate-900">Contact</th>
                    <th className="px-6 py-3 font-semibold text-slate-900">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list?.map((c, i) => (
                    <tr key={c.id || i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-slate-700">
                        #{c.id}
                      </td>
                      <td className="px-6 py-3 text-slate-900 font-medium">
                        {c.name || "Unknown"}
                      </td>
                      <td className="px-6 py-3 text-slate-500">
                        {c.phone || "—"}
                      </td>
                      <td className="px-6 py-3 text-slate-500">
                         {c.email || "—"}
                      </td>
                    </tr>
                  ))}
                  {(!list || list.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                        No customers found in Odoo database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}