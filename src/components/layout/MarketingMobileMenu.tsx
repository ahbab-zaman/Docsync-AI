"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserPublic } from "@/types";

interface FeatureItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface MarketingMobileMenuProps {
  open: boolean;
  user: UserPublic | null;
  featureItems: FeatureItem[];
  sectionLinks: { href: string; label: string }[];
  pending: boolean;
  onClose: () => void;
  onLogout: () => void;
}

function UserAvatar({ user }: { user: UserPublic }) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (user.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatar_url}
        alt={`${user.name}'s avatar`}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground"
    >
      {initials}
    </span>
  );
}

export default function MarketingMobileMenu({
  open,
  user,
  featureItems,
  sectionLinks,
  pending,
  onClose,
  onLogout,
}: MarketingMobileMenuProps) {
  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-overlay/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        aria-label="Mobile navigation"
        className="animate-menu-fade-in relative flex h-full w-72 max-w-[85vw] flex-col gap-4 overflow-y-auto border-r border-border bg-surface p-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground tracking-tight">Docsync</span>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center h-9 w-9 rounded-lg text-text-secondary hover:bg-surface-secondary transition-colors"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {user && (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-secondary p-3">
            <UserAvatar user={user} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-text-muted">{user.email}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          {user && (
            <>
              <Link
                href="/app"
                onClick={onClose}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-secondary transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 text-text-muted" aria-hidden="true" />
                Dashboard
              </Link>
              {featureItems.map((item) => {
                const Icon = item.icon;
                if (item.href === "/app") return null;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
                  >
                    <Icon className="h-4 w-4 text-text-muted" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="my-1 h-px bg-border" role="separator" />
            </>
          )}
          {sectionLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
          {user ? (
            <button
              type="button"
              onClick={onLogout}
              disabled={pending}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-error hover:bg-error-lightest transition-colors disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {pending ? "Signing out..." : "Log out"}
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className={cn(
                  "w-full rounded-lg border border-border px-4 py-2 text-center text-sm font-medium text-text-secondary",
                  "hover:text-foreground hover:bg-surface-secondary transition-colors"
                )}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="w-full rounded-lg bg-accent px-4 py-2 text-center text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
