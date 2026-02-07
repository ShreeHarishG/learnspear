"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
import odooAPI from "@/lib/odoo-api";

export default function AdminUsersPage() {
    const [list, setList] = useState<Array<Record<string, unknown>>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        odooAPI.getCustomers()
            .then((res) => setList(Array.isArray(res.data) ? res.data : []))
            .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-text-muted">Loading customers...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-text-heading">Users / Customers</h1>
            <p className="mt-2 text-text-muted">Customers from Odoo.</p>
            <div className="mt-6 overflow-x-auto rounded-xl border border-border-color bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-border-color bg-gray-50/80">
                        <tr>
                            <th className="px-4 py-3 font-medium text-text-heading">ID</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Name</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                        {list.map((c: Record<string, unknown>, i) => (
                            <tr key={(c.id as number) ?? i} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium">{String(c.id ?? "-")}</td>
                                <td className="px-4 py-3">{String(c.name ?? c.display_name ?? "-")}</td>
                                <td className="px-4 py-3 text-text-muted">{JSON.stringify(c).slice(0, 80)}…</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {list.length === 0 && <p className="p-6 text-text-muted">No customers found.</p>}
=======
import { useState } from "react";
import { createAdminInvitation } from "@/app/actions";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await createAdminInvitation(email);

        if (result.success) {
            toast.success(result.message);
            setEmail("");
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-text-heading mb-6">User Management</h1>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Invite Admin Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-color">
                    <h2 className="text-lg font-semibold text-text-heading mb-4">Invite New Admin</h2>
                    <p className="text-sm text-text-muted mb-4">
                        Send an invitation to a new administrator. They will be assigned the 'admin' role upon acceptance.
                    </p>

                    <form onSubmit={handleInvite} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-heading mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-border-color p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white shadow-md hover:bg-primary-dark disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Sending..." : "Send Invitation"}
                        </button>
                    </form>
                </div>

                {/* Placeholder for User List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-color">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-text-heading">All Users</h2>
                        <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">Coming Soon</span>
                    </div>
                    <p className="text-text-muted">User listing functionality will be implemented here.</p>
                </div>
>>>>>>> 718464b (user dashboard)
            </div>
        </div>
    );
}
