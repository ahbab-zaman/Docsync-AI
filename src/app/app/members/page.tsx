import { getMembers } from "@/server/actions/members";
import { getWorkspaces } from "@/server/actions/workspace";
import MemberList from "@/components/members/MemberList";

const currentUserId = "user-1";

export default async function MembersPage() {
  const { workspaces } = await getWorkspaces();
  const activeWorkspace = workspaces[0];
  const { members, pendingInvites } = await getMembers(activeWorkspace.id);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Members</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage workspace members and roles.
        </p>
      </div>

      <MemberList
        workspaceId={activeWorkspace.id}
        initialMembers={members}
        initialInvites={pendingInvites}
        currentUserId={currentUserId}
      />
    </div>
  );
}
