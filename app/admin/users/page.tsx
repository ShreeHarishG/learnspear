"use client";

import { useState, useEffect } from "react";
import odooAPI from "@/lib/odoo-api";
import { createAdminInvitation } from "@/app/actions";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
    // State for Customer List
    const [list, setList] = useState<Array<Record<string, unknown>>>([]);
    const [loadingCustomers, setLoadingCustomers] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for Invite Form
    const [email, setEmail] = useState("");
    const [inviting, setInviting] = useState(false);

    // Load Customers (Mocked)
    useEffect(() => {
        // odooAPI.getCustomers()
        //     .then((res) => setList(Array.isArray(res.data) ? res.data : []))
        //     .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
        //     .finally(() => setLoadingCustomers(false));

        // Use mock data
        setList([
            { id: 1, name: "Vishwa Corp", display_name: "Vishwa Corp", email: "vishwa@example.com" },
            { id: 2, name: "Tech Solutions Ltd", display_name: "Tech Solutions Ltd", email: "tech@example.com" },
            { id: 3, name: "Global Innovations", display_name: "Global Innovations", email: "innovations@example.com" },
        ]);
        setLoadingCustomers(false);
    }, []);

    // Handle Invite
    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviting(true);

        const result = await createAdminInvitation(email);

        if (result.success) {
            toast.success(result.message);
            setEmail("");
        } else {
            toast.error(result.message);
        }
        setInviting(false);
    };

    return (
        <div className="p-8 space-y-12">
            <div>
                <h1 className="text-2xl font-bold text-text-heading mb-6">User Management</h1>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Invite Admin Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-color h-fit">
                        <h2 className="text-lg font-semibold text-text-heading mb-4">Invite New Admin</h2>
                        <p className="text-sm text-text-muted mb-4">
                            Send an invitation to a new administrator. They will be assigned the &apos;admin&apos; role upon acceptance.
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
                                disabled={inviting}
                                className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white shadow-md hover:bg-primary-dark disabled:opacity-50 transition-colors"
                            >
                                {inviting ? "Sending..." : "Send Invitation"}
                            </button>
                        </form>
                    </div>

                    {/* Placeholder or Stats */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-border-color flex items-center justify-center">
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-primary mb-1">{list.length}</h3>
                            <p className="text-text-muted font-medium">Total Customers (Odoo)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Odoo Customer List */}
            <div>
                <h2 className="text-xl font-bold text-text-heading mb-4">Odoo Customers</h2>
                {loadingCustomers ? (
                    <div className="text-text-muted">Loading customers...</div>
                ) : error ? (
                    <div className="text-red-500">Error: {error}</div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-border-color bg-white shadow-sm">
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
                    </div>
                )}
            </div>
        </div>
    );
}
