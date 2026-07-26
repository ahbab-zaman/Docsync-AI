"use client";

import { useState } from "react";

interface InviteModalProps {
  workspaceId: string;
  onInvite: (formData: FormData) => Promise<{ error?: string; success?: boolean } | void>;
  onClose: () => void;
}

export default function InviteModal({ workspaceId, onInvite, onClose }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");
    const formData = new FormData();
    formData.set("workspaceId", workspaceId);
    formData.set("email", email);
    formData.set("role", role);
    try {
      const result = await onInvite(formData);
      if (result && "error" in result && result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    } catch {
      setError("Failed to send invite.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-foreground">Invite member</h2>
        <p className="mt-1 text-sm text-text-secondary">Send an invitation to join this workspace.</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              required
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium text-foreground">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "member")}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending || !email}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              {pending ? "Sending..." : "Send invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
