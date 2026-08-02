import { getInviteByToken } from "@/server/actions/members";
import { getCurrentUser } from "@/server/auth";
import InviteActions from "@/components/invite/InviteActions";
import { isInviteExpired } from "@/lib/invite-utils";

export const dynamic = "force-dynamic";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

function StateCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-xl text-accent" aria-hidden="true">
          ✉
        </div>
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-text-secondary">{description}</p>
        {children}
      </div>
    </div>
  );
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const [result, currentUser] = await Promise.all([
    getInviteByToken(token),
    getCurrentUser(),
  ]);

  if (result.error || !result.invite) {
    return (
      <StateCard
        title="Invitation not found"
        description="This invitation link is invalid or has expired. Please ask the workspace admin for a new invitation."
      />
    );
  }

  const invite = result.invite;

  if (invite.status === "expired" || isInviteExpired(invite.expiresAt)) {
    return (
      <StateCard
        title="Invitation expired"
        description={`This invitation to ${invite.workspaceName} expired on ${invite.expiresAt.toLocaleDateString()}. Please ask the workspace admin to send a new invitation.`}
      />
    );
  }

  if (invite.status === "accepted") {
    return (
      <StateCard
        title="Already accepted"
        description={`You have already joined ${invite.workspaceName}.`}
      />
    );
  }

  if (invite.status === "declined") {
    return (
      <StateCard
        title="Invitation declined"
        description={`You declined the invitation to join ${invite.workspaceName}.`}
      />
    );
  }

  const emailMatches =
    currentUser &&
    currentUser.email.toLowerCase() === invite.email.toLowerCase();

  if (currentUser && !emailMatches) {
    return (
      <StateCard
        title="This invite is for another account"
        description={`This invitation was sent to ${invite.email}. Sign out and sign in with that account to respond.`}
      />
    );
  }

  if (!currentUser) {
    if (!invite.isRegistered) {
      return (
        <StateCard
          title={`You're invited to ${invite.workspaceName}`}
          description={`${invite.invitedByName} invited you to collaborate. Create an account to accept the invitation.`}
        >
          <a
            href={`/register?next=${encodeURIComponent(`/invite/${token}`)}`}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
          >
            Create account
          </a>
        </StateCard>
      );
    }
    return (
      <StateCard
        title={`You're invited to ${invite.workspaceName}`}
        description={`${invite.invitedByName} invited you to collaborate. Sign in to accept the invitation.`}
      >
        <a
          href={`/login?next=${encodeURIComponent(`/invite/${token}`)}`}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
        >
          Sign in to accept
        </a>
      </StateCard>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-xl text-accent" aria-hidden="true">
          ✉
        </div>
        <h1 className="text-xl font-bold text-foreground">
          You&apos;re invited to {invite.workspaceName}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {invite.invitedByName} invited you to collaborate in this workspace.
        </p>
        <InviteActions
          token={token}
          workspaceName={invite.workspaceName}
          role={invite.role}
        />
      </div>
    </div>
  );
}
