"use client";

import { useState } from "react";
import { createAdminInvitation } from "@/app/actions";

export default function AdminUsersPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const result = await createAdminInvitation(email);

        setMessage(result.message);
        if (result.success) {
            setEmail("");
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

                        {message && (
                            <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                                {message}
                            </p>
                        )}

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
            </div>
        </div>
    );
}
