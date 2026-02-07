"use client";

import { useState } from "react";
import { createAdminInvitation } from "@/app/actions";

export function AddInternalUserForm({ visible }: { visible: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!visible) return null;

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setLoading(true);

    try {
      const res = await createAdminInvitation(email.trim());

      if (!res.success) {
        setError(res.message || "Failed to send invitation.");
        return;
      }

      setMsg(res.message);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-border-color bg-white shadow-sm p-6">
      <h2 className="text-lg font-bold text-text-heading">Invite Internal User</h2>
      <p className="text-sm text-text-muted mt-1">
        Only admins can invite internal users.
      </p>

      <form onSubmit={handleInvite} className="mt-4 flex gap-3">
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-xl border border-border-color px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-primary px-5 py-2 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Invite"}
        </button>
      </form>

      {msg && <p className="mt-3 text-sm text-green-600">{msg}</p>}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
