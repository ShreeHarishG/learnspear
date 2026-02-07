"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
import odooAPI from "@/lib/odoo-api";

export default function UserProfilePage() {
    const [customers, setCustomers] = useState<Array<Record<string, unknown>>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        odooAPI.getCustomers()
            .then((res) => setCustomers(Array.isArray(res.data) ? res.data : []))
            .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-text-muted">Loading profile...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    const current = customers[0];
    const name = current ? String(current.name ?? current.display_name ?? "User") : "User";
    const email = current && typeof current.email === "string" ? current.email : "user@learnspear.com";

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-text-heading">My Profile</h1>
            <p className="mt-2 text-text-muted">Manage your profile (customer data from Odoo).</p>
            <div className="mt-6 max-w-md rounded-xl border border-border-color bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                        {name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-text-heading">{name}</p>
                        <p className="text-text-muted">{email}</p>
                    </div>
                </div>
                {current && (
                    <pre className="mt-4 overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-text-muted">
                        {JSON.stringify(current, null, 2)}
                    </pre>
                )}
=======
import { useState } from "react";
import { User, Mail, Phone, MapPin, Save, List } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

export default function ProfilePage() {
    const { user } = useUser();

    // Mock Editable Data (In real app, fetch from DB)
    const [formData, setFormData] = useState({
        name: user?.fullName || "John Doe",
        email: user?.primaryEmailAddress?.emailAddress || "john@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Business Rd, Tech City, 10001, USA"
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Profile updated successfully!");
        }, 1000); // Mock save
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            {/* Sidebar / Nav */}
            <aside className="w-full lg:w-64 space-y-2">
                <Link href="/user/profile" className="block px-4 py-2 rounded-lg bg-primary text-white font-medium">User Details</Link>
                <Link href="/user/orders" className="block px-4 py-2 rounded-lg text-text-muted hover:bg-slate-100 hover:text-text-heading transition-colors">My Orders</Link>
            </aside>

            {/* Main Content */}
            <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-border-color">
                <h1 className="text-2xl font-bold text-text-heading mb-8 flex items-center gap-2">
                    <User className="text-primary" /> User Details
                </h1>

                <div className="space-y-6 max-w-2xl">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-text-heading ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-text-heading ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="email"
                                value={formData.email}
                                // Email usually read-only or requires verification
                                disabled
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-color bg-slate-50 text-text-muted cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-text-heading ml-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-text-heading ml-1">Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                            <textarea
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                rows={3}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <p className="text-xs text-text-muted ml-1">This address will be used as default for shipping.</p>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-primary-dark transition-all disabled:opacity-70 mt-4"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
>>>>>>> 718464b (user dashboard)
            </div>
        </div>
    );
}
