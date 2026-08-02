"use client";

import { useState, useEffect, useActionState } from "react";
import { toast } from "sonner";
import { updateProfile, changePassword, updateAppearance } from "@/server/actions/settings";
import type { ProfileData } from "@/server/actions/settings";
import type { UserPreferences } from "@/types";
import { applyAppearance } from "@/lib/appearance";

interface SettingsFormProps {
  initialProfile: ProfileData;
}

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-text-secondary mt-1">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ProfileSection({ initialProfile }: { initialProfile: ProfileData }) {
  const [state, formAction, pending] = useActionState(updateProfile, {});

  useEffect(() => {
    if (state.success) toast.success("Profile updated");
  }, [state.success]);

  return (
    <Section
      title="Profile"
      description="Update your name, email, and avatar used across Docsync."
    >
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="settings-name" className="text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="settings-name"
            name="name"
            type="text"
            defaultValue={initialProfile.name}
            required
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="settings-email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="settings-email"
            name="email"
            type="email"
            defaultValue={initialProfile.email}
            required
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="settings-avatar" className="text-sm font-medium text-foreground">
            Avatar URL
          </label>
          <input
            id="settings-avatar"
            name="avatarUrl"
            type="url"
            placeholder="https://example.com/avatar.png"
            defaultValue={initialProfile.avatar_url ?? ""}
            className={inputClass}
          />
          <p className="text-xs text-text-muted">Leave empty to use your initials.</p>
        </div>
        {state.error && (
          <p className="text-sm text-error" role="alert">
            {state.error}
          </p>
        )}
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            Member since {new Date(initialProfile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {pending ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </Section>
  );
}

function PasswordSection() {
  const [state, formAction, pending] = useActionState(changePassword, {});
  const [confirm, setConfirm] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mismatch, setMismatch] = useState(false);

  useEffect(() => {
    if (state.success) toast.success("Password updated");
  }, [state.success]);

  return (
    <Section
      title="Password"
      description="Change your account password. Your current password is required."
    >
      <form
        action={(formData) => {
          if (newPassword !== confirm) {
            setMismatch(true);
            return;
          }
          setMismatch(false);
          formAction(formData);
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label htmlFor="settings-current-password" className="text-sm font-medium text-foreground">
            Current password
          </label>
          <input
            id="settings-current-password"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="settings-new-password" className="text-sm font-medium text-foreground">
            New password
          </label>
          <input
            id="settings-new-password"
            name="newPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            aria-describedby="settings-password-hint"
            className={inputClass}
          />
          <p id="settings-password-hint" className="text-xs text-text-muted">
            Must be at least 8 characters.
          </p>
        </div>
        <div className="space-y-2">
          <label htmlFor="settings-confirm-password" className="text-sm font-medium text-foreground">
            Confirm new password
          </label>
          <input
            id="settings-confirm-password"
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={mismatch}
            aria-describedby={mismatch ? "settings-password-mismatch" : undefined}
            className={inputClass}
          />
          {mismatch && (
            <p id="settings-password-mismatch" className="text-sm text-error" role="alert">
              New passwords do not match.
            </p>
          )}
        </div>
        {state.error && (
          <p className="text-sm text-error" role="alert">
            {state.error}
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {pending ? "Updating..." : "Update password"}
          </button>
        </div>
      </form>
    </Section>
  );
}

function AppearanceSection({ preferences }: { preferences: UserPreferences }) {
  const [state, formAction, pending] = useActionState(updateAppearance, {});

  useEffect(() => {
    if (state.success) toast.success("Appearance saved");
  }, [state.success]);

  return (
    <Section
      title="Appearance"
      description="Customize how Docsync looks and feels on your device."
    >
      <form
        action={(formData) => {
          formAction(formData);
          const theme = formData.get("theme") as UserPreferences["theme"];
          const reducedMotion = formData.get("reducedMotion") === "on";
          const density = formData.get("density") as UserPreferences["density"];
          applyAppearance({ theme, reducedMotion, density });
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label htmlFor="settings-theme" className="text-sm font-medium text-foreground">
            Theme
          </label>
          <select
            id="settings-theme"
            name="theme"
            defaultValue={preferences.theme}
            className={inputClass}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="settings-density" className="text-sm font-medium text-foreground">
            Density
          </label>
          <select
            id="settings-density"
            name="density"
            defaultValue={preferences.density}
            className={inputClass}
          >
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select>
          <p className="text-xs text-text-muted">Compact density reduces spacing and text size.</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Reduced motion</p>
            <p className="text-xs text-text-muted mt-0.5">
              Minimize animations and transitions across the interface.
            </p>
          </div>
          <input
            id="settings-reduced-motion"
            name="reducedMotion"
            type="checkbox"
            defaultChecked={preferences.reducedMotion}
            className="h-5 w-5 rounded border-border text-accent focus:ring-2 focus:ring-accent"
          />
        </div>
        {state.error && (
          <p className="text-sm text-error" role="alert">
            {state.error}
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {pending ? "Saving..." : "Save appearance"}
          </button>
        </div>
      </form>
    </Section>
  );
}

export default function SettingsForm({ initialProfile }: SettingsFormProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your account, password, and appearance preferences.
        </p>
      </div>
      <ProfileSection initialProfile={initialProfile} />
      <PasswordSection />
      <AppearanceSection preferences={initialProfile.preferences} />
    </div>
  );
}
