"use client";

import { useState, useEffect } from "react";
import { User, Save } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import odooAPI from "@/lib/odoo-api";

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

    useEffect(() => {
        // Fetch real user data from Odoo/LocalStorage
        const odooUser = odooAPI.getUser();
        if (odooUser) {
            setFormData(prev => ({
                ...prev,
                name: odooUser.name || user?.fullName || "",
                email: user?.primaryEmailAddress?.emailAddress || "", // Odoo might not have email in simple session
                phone: odooUser.phone || "", // If we had phone in session
                address: odooUser.street || "" // If we had address
            }));
        }
    }, [user]);

    const handleSave = () => {
        setIsSaving(true);
        // Here we would call odooAPI.updateProfile(formData)
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Profile updated successfully!");
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-500 mt-1">Manage your account settings and preferences.</p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <User className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">{formData.name}</h2>
                        <p className="text-slate-500">{formData.email}</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-500 cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Phone Number</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium text-slate-700">Address</label>
                        <textarea
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
                            placeholder="Street Address, City, Zip Code"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-all disabled:opacity-70"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
