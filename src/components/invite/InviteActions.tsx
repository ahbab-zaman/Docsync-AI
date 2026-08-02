"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { acceptInviteByToken, declineInviteByToken } from "@/server/actions/members";

interface InviteActionsProps {
  token: string;
  workspaceName: string;
  role: string;
}

export default function InviteActions({
  token,
  workspaceName,
  role,
}: InviteActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState<"accept" | "decline" | null>(null);
  const [error, setError] = useState("");

  const handleAccept = async () => {
    setPending("accept");
    setError("");
    const result = await acceptInviteByToken(token);
    if (result.error) {
      setError(result.error);
      setPending(null);
      return;
    }
    if (result.workspaceId) {
      router.push(`/app?workspace=${encodeURIComponent(result.workspaceId)}`);
    } else {
      router.push("/app");
    }
  };

  const handleDecline = async () => {
    setPending("decline");
    setError("");
    const result = await declineInviteByToken(token);
    if (result.error) {
      setError(result.error);
      setPending(null);
      return;
    }
    router.refresh();
  };

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleAccept}
          disabled={pending !== null}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors disabled:opacity-50"
        >
          {pending === "accept" ? "Accepting..." : `Accept invite`}
        </button>
        <button
          type="button"
          onClick={handleDecline}
          disabled={pending !== null}
          className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors disabled:opacity-50"
        >
          {pending === "decline" ? "Declining..." : "Decline"}
        </button>
      </div>
      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
      <p className="text-xs text-text-muted">
        You will join {workspaceName} as {role === "admin" ? "an admin" : "a member"}.
      </p>
    </div>
  );
}
