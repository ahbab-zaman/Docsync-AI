"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Member, PendingInvite } from "@/server/actions/members";
import RoleSelector from "./RoleSelector";
import InviteModal from "./InviteModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { inviteMember, changeRole, removeMember, cancelInvite, resendInvite } from "@/server/actions/members";
import { cn } from "@/lib/utils";

interface MemberListProps {
  workspaceId: string;
  initialMembers: Member[];
  initialInvites: PendingInvite[];
  currentUserId: string;
}

const statusStyles: Record<PendingInvite["status"], string> = {
  pending: "bg-warning-light text-warning",
  accepted: "bg-success-light text-success-foreground",
  declined: "bg-surface-tertiary text-text-muted",
  expired: "bg-error-light text-error",
};

const statusLabels: Record<PendingInvite["status"], string> = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  expired: "Expired",
};

export default function MemberList({
  workspaceId,
  initialMembers,
  initialInvites,
  currentUserId,
}: MemberListProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [invites, setInvites] = useState<PendingInvite[]>(initialInvites);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [removingMember, setRemovingMember] = useState<Member | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const currentUser = members.find((m) => m.id === currentUserId);
  const currentUserRole = currentUser?.role ?? "member";

  const handleInvite = async (formData: FormData) => {
    const result = await inviteMember({}, formData);
    if (result.success && result.invite) {
      setInvites((prev) => [result.invite!, ...prev]);
    }
    return result;
  };

  const handleChangeRole = async (userId: string, role: "admin" | "member") => {
    const previous = members;
    setMembers((prev) => prev.map((m) => (m.id === userId ? { ...m, role } : m)));
    const result = await changeRole(workspaceId, userId, role);
    if (result.success) {
      toast.success(`Role changed to ${role}`);
    } else {
      setMembers(previous);
      toast.error(result.error ?? "Failed to change role");
    }
  };

  const handleRemove = async (userId: string) => {
    setRemovingMember(null);
    const previous = members;
    setMembers((prev) => prev.filter((m) => m.id !== userId));
    const result = await removeMember(workspaceId, userId);
    if (result.success) {
      toast.success("Member removed");
    } else {
      setMembers(previous);
      toast.error(result.error ?? "Failed to remove member");
    }
  };

  const handleCancel = async (inviteId: string) => {
    const previous = invites;
    setInvites((prev) => prev.filter((i) => i.id !== inviteId));
    const result = await cancelInvite(workspaceId, inviteId);
    if (result.success) {
      toast.success("Invite cancelled");
    } else {
      setInvites(previous);
      toast.error(result.error ?? "Failed to cancel invite");
    }
  };

  const handleResend = async (inviteId: string) => {
    setResendingId(inviteId);
    const result = await resendInvite(workspaceId, inviteId);
    setResendingId(null);
    if (result.success) {
      toast.success("Invitation resent");
    } else {
      toast.error(result.error ?? "Failed to resend invitation");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Members ({members.length})</h2>
          <p className="text-sm text-text-secondary">Manage who has access to this workspace.</p>
        </div>
        {(currentUserRole === "owner" || currentUserRole === "admin") && (
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
          >
            Invite member
          </button>
        )}
      </div>

      <div className="rounded-lg border border-border divide-y divide-border">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-secondary text-sm font-medium text-text-secondary">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {member.name}
                  {member.id === currentUserId && (
                    <span className="ml-2 text-xs text-text-muted">(you)</span>
                  )}
                </p>
                <p className="text-xs text-text-muted">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RoleSelector member={member} currentUserRole={currentUserRole} onChangeRole={handleChangeRole} />
              {member.role !== "owner" && (currentUserRole === "owner" || currentUserRole === "admin") && (
                <button
                  type="button"
                  onClick={() => setRemovingMember(member)}
                  className="text-xs text-text-muted hover:text-error transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {invites.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3" id="pending-invites-heading">
            Pending invites ({invites.length})
          </h3>
          <div
            className="rounded-lg border border-border divide-y divide-border"
            role="list"
            aria-labelledby="pending-invites-heading"
          >
            {invites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between p-4" role="listitem">
                <div>
                  <p className="text-sm text-foreground">{invite.email}</p>
                  <p className="text-xs text-text-muted">
                    invited as {invite.role} &middot;{" "}
                    {new Date(invite.invited_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      statusStyles[invite.status]
                    )}
                  >
                    {statusLabels[invite.status]}
                  </span>
                  {invite.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => handleResend(invite.id)}
                      disabled={resendingId === invite.id}
                      className="rounded-md px-3 py-1 text-xs font-medium text-accent hover:bg-accent/10 transition-colors disabled:opacity-50"
                    >
                      {resendingId === invite.id ? "Sending..." : "Resend"}
                    </button>
                  )}
                  {(invite.status === "pending" || invite.status === "expired") && (
                    <button
                      type="button"
                      onClick={() => handleCancel(invite.id)}
                      className="rounded-md px-3 py-1 text-xs font-medium text-text-muted hover:text-text-secondary transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showInviteModal && (
        <InviteModal
          workspaceId={workspaceId}
          onInvite={handleInvite}
          onClose={() => setShowInviteModal(false)}
        />
      )}

      <ConfirmDialog
        open={removingMember !== null}
        title="Remove member"
        message={`Are you sure you want to remove ${removingMember?.name} from this workspace? This action cannot be undone.`}
        confirmLabel="Remove"
        variant="danger"
        onConfirm={() => removingMember && handleRemove(removingMember.id)}
        onCancel={() => setRemovingMember(null)}
      />
    </div>
  );
}
