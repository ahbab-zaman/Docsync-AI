import { getMembers } from "@/server/actions/members";
import { getWorkspaces } from "@/server/actions/workspace";
import { getCurrentUserId } from "@/server/access";
import MemberList from "@/components/members/MemberList";
import WorkspaceSwitcher from "@/components/members/WorkspaceSwitcher";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ workspace?: string }>;
}) {
  const { workspace: workspaceParam } = await searchParams;
  const [{ workspaces }, currentUserId] = await Promise.all([
    getWorkspaces(),
    getCurrentUserId(),
  ]);

  const activeWorkspace =
    workspaces.find((workspace) => workspace.id === workspaceParam) ?? workspaces[0];

  const { members, pendingInvites } = activeWorkspace
    ? await getMembers(activeWorkspace.id)
    : { members: [], pendingInvites: [] };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Members</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage workspace members and roles.
          </p>
        </div>
        {workspaces.length > 0 && (
          <WorkspaceSwitcher
            workspaces={workspaces}
            selectedId={activeWorkspace?.id ?? ""}
          />
        )}
      </div>

      {!activeWorkspace ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface p-12 text-center">
          <p className="text-sm font-medium text-foreground">No workspaces yet</p>
          <p className="text-xs text-text-muted mt-1">
            Create a workspace to start managing members.
          </p>
        </div>
      ) : (
        <MemberList
          workspaceId={activeWorkspace.id}
          initialMembers={members}
          initialInvites={pendingInvites}
          currentUserId={currentUserId ?? ""}
        />
      )}
    </div>
  );
}
