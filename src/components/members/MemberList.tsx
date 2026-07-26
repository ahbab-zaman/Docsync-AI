"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { MockMember, MockPendingInvite } from "@/data/mock-workspaces";
import RoleSelector from "./RoleSelector";
import InviteModal from "./InviteModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { inviteMember, changeRole, removeMember, acceptInvite, cancelInvite } from "@/server/actions/members";

interface MemberListProps {
  workspaceId: string;
  initialMembers: MockMember[];
  initialInvites: MockPendingInvite[];
  currentUserId: string;
}

export default function MemberList({
  workspaceId,
  initialMembers,
  initialInvites,
  currentUserId,
}: MemberListProps) {
  const [members, setMembers] = useState<MockMember[]>(initialMembers);
  const [invites, setInvites] = useState<MockPendingInvite[]>(initialInvites);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [removingMember, setRemovingMember] = useState<MockMember | null>(null);

  const currentUser = members.find((m) => m.id === currentUserId);
  const currentUserRole = currentUser?.role ?? "member";

  const handleInvite = async (formData: FormData) => {
    const result = await inviteMember({}, formData);
    if (result.error) throw new Error(result.error);
    return result;
  };

  const handleChangeRole = async (userId: string, role: "admin" | "member") => {
    const result = await changeRole(workspaceId, userId, role);
    if (result.success) {
      setMembers((prev) => prev.map((m) => (m.id === userId ? { ...m, role } : m)));
      toast.success(`Role changed to ${role}`);
    }
  };

  const handleRemove = async (userId: string) => {
    const result = await removeMember(workspaceId, userId);
    if (result.success) {
      setMembers((prev) => prev.filter((m) => m.id !== userId));
      toast.success("Member removed");
    }
    setRemovingMember(null);
  };

  const handleAccept = async (inviteId: string) => {
    const result = await acceptInvite(workspaceId, inviteId);
    if (result.success) {
      setInvites((prev) => prev.filter((i) => i.id !== inviteId));
      toast.success("Invite accepted");
    }
  };

  const handleCancel = async (inviteId: string) => {
    const result = await cancelInvite(workspaceId, inviteId);
    if (result.success) {
      setInvites((prev) => prev.filter((i) => i.id !== inviteId));
      toast.success("Invite cancelled");
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
                    invited as {invite.role} &middot; {new Date(invite.invited_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAccept(invite.id)}
                    className="rounded-md bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/20 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCancel(invite.id)}
                    className="rounded-md px-3 py-1 text-xs font-medium text-text-muted hover:text-text-secondary transition-colors"
                  >
                    Cancel
                  </button>
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
