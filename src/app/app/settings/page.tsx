import { getProfile } from "@/server/actions/settings";
import SettingsForm from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const { profile, error } = await getProfile();

  if (error || !profile) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-text-secondary mt-1">Unable to load your profile.</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-8 text-center">
          <p className="text-sm text-text-muted">{error ?? "Something went wrong."}</p>
        </div>
      </div>
    );
  }

  return <SettingsForm initialProfile={profile} />;
}
