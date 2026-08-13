"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Sparkles,
  Bell,
  Users,
  Settings,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logout } from "@/server/actions/auth";
import { cn } from "@/lib/utils";
import type { UserPublic } from "@/types";
import MarketingMobileMenu from "@/components/layout/MarketingMobileMenu";

interface FeatureItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const allFeatureItems: FeatureItem[] = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/workspaces", label: "Workspaces", icon: Briefcase },
  { href: "/app/ai", label: "AI Assistant", icon: Sparkles },
  { href: "/app/notifications", label: "Notifications", icon: Bell },
  { href: "/app/members", label: "Members", icon: Users },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

const sectionLinks = [
  { href: "#showcase", label: "Showcase" },
  { href: "#process", label: "Process" },
  { href: "#about", label: "About" },
];

function UserAvatar({ user, size = "md" }: { user: UserPublic; size?: "sm" | "md" }) {
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
        className={cn(
          "shrink-0 rounded-full object-cover",
          size === "sm" ? "h-8 w-8" : "h-9 w-9"
        )}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground",
        size === "sm" ? "h-8 w-8" : "h-9 w-9"
      )}
    >
      {initials}
    </span>
  );
}

interface MarketingNavProps {
  user: UserPublic | null;
  canManageMembers?: boolean;
}

export default function MarketingNav({
  user,
  canManageMembers = false,
}: MarketingNavProps) {
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const featureItems = allFeatureItems.filter(
    (item) => item.href !== "/app/members" || canManageMembers
  );

  const closeAll = useCallback(() => {
    setUserMenuOpen(false);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeAll]);

  const handleLogout = async () => {
    setPending(true);
    try {
      await logout();
      router.push("/");
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  const userMenu = user ? (
    <div className="relative" ref={userMenuRef}>
      <button
        type="button"
        onClick={() => setUserMenuOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={userMenuOpen}
        className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-2.5 hover:bg-surface-secondary transition-colors"
      >
        <UserAvatar user={user} />
        <span className="max-w-40 truncate text-sm font-medium text-foreground">
          {user.name}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-text-muted transition-transform duration-150", userMenuOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {userMenuOpen && (
        <div
          role="menu"
          aria-label="User menu"
          className="animate-dropdown-in absolute right-0 top-full z-50 mt-3 w-64 rounded-xl border border-border bg-surface p-2 shadow-popover"
        >
          <div className="flex items-center gap-3 border-b border-border px-3 pb-3 pt-2">
            <UserAvatar user={user} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-text-muted">{user.email}</p>
            </div>
          </div>

          <div className="py-1">
            {featureItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={closeAll}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-foreground"
                >
                  <Icon className="h-4 w-4 text-text-muted" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-border pt-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              disabled={pending}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-error transition-colors hover:bg-error-lightest disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {pending ? "Signing out..." : "Log out"}
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="text-sm font-medium text-text-secondary hover:text-foreground transition-colors"
      >
        Sign in
      </Link>
      <Link
        href="/register"
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
      >
        Get started
      </Link>
    </div>
  );

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              aria-label="DocSync home"
              className="group flex flex-1 items-center rounded-xl px-2 py-2.5"
            >
              {/* Document Logo */}
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                {/* Back document */}
                <div className="absolute left-1 top-1 h-8 w-7 border-2 border-accent/40 bg-accent/10 -rotate-6" />

                {/* Main document */}
                <div className="relative h-9 w-7 overflow-hidden border-2 border-accent bg-accent/10 shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
                  {/* Folded corner */}
                  <div className="absolute -right-px -top-px h-3.5 w-3.5 border-b-2 border-l-2 border-accent bg-surface-secondary" />

                  {/* Document lines */}
                  <div className="absolute left-1.5 top-4 h-0.5 w-3 rounded-full bg-accent/70" />
                  <div className="absolute left-1.5 top-5.5 h-0.5 w-4 rounded-full bg-accent/50" />
                  <div className="absolute left-1.5 top-7 h-0.5 w-2.5 rounded-full bg-accent/40" />
                </div>
              </div>

              {/* Wordmark */}
              <span className="text-[23px] font-black tracking-[-0.045em] text-foreground">
                Doc<span className="text-accent">Sync</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="md:hidden flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
          <div className="hidden md:flex items-center gap-10" aria-label="Primary navigation">
            {sectionLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">{userMenu}</div>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-surface text-text-secondary hover:text-foreground transition-colors"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <MarketingMobileMenu
        open={mobileOpen}
        user={user}
        featureItems={featureItems}
        sectionLinks={sectionLinks}
        pending={pending}
        onClose={closeAll}
        onLogout={handleLogout}
      />
    </header>
  );
}
