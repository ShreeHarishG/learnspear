"use client";

import { useEffect, useState } from "react";
import odooAPI from "@/lib/odoo-api"; // Ensure this path matches your project
import { toast } from "sonner"; // Or your preferred toast library

export default function AdminUsersPage() {
  // ================= STATE =================
  const [list, setList] = useState<any[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Invite Form State
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  // ================= EFFECTS =================
  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingCustomers(true);
        // Fetch real customers from Odoo
        const res = await odooAPI.getCustomers();
        
        if (res && res.status === 'success' && Array.isArray(res.data)) {
           setList(res.data);
        } else if (Array.isArray(res)) {
           // Handle case where API might return array directly
           setList(res);
        } else {
           setList([]);
        }
      } catch (err: any) {
        console.error("Failed to fetch customers:", err);
        setError(err.message || "Failed to load customers");
      } finally {
        setLoadingCustomers(false);
      }
    }

    fetchData();
  }, []);

  // ================= HANDLERS =================
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);

    try {
      // TODO: Replace with your actual Server Action or API call
      // const result = await createAdminInvitation(email);
      
      // Simulating API call for now
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
    <div className="p-8 space-y-12 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* --- Invite Admin Section --- */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Invite New Admin</h2>
            <p className="text-sm text-gray-500 mb-6">
              Send an invitation to a new administrator. They will be assigned the &apos;admin&apos; role upon acceptance.
            </p>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={inviting}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {inviting ? "Sending..." : "Send Invitation"}
              </button>
            </form>
          </div>

          {/* --- Stats Section --- */}
          <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col items-center justify-center shadow-sm">
            <div className="text-center">
              <h3 className="text-5xl font-bold text-blue-600 mb-2">{list.length}</h3>
              <p className="text-gray-500 font-medium">Total Odoo Customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Customer Table Section --- */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Odoo Customers</h2>
        
        {loadingCustomers ? (
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white">
            <span className="text-gray-500">Loading customers...</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-100">
            Error: {error}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-700">ID</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Contact</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {list.map((c, i) => (
                    <tr key={c.id || i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        #{c.id}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {c.name || c.display_name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {c.phone || "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                         {c.email || "—"}
                      </td>
                    </tr>
                  ))}
                  {list.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
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