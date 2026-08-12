"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Sparkles,
  Search,
  Bell,
  Users,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { getUnreadCount } from "@/server/actions/notifications";
import { cn } from "@/lib/utils";
import DocSync from "@/assets/DocSync-logo.png";


const SearchDialog = dynamic(() => import("@/components/search/SearchDialog"), { ssr: false });

interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
  showBadge?: boolean;
}

const baseNavLinks: NavLink[] = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/workspaces", label: "Workspaces", icon: Briefcase },
  { href: "/app/workspaces/new", label: "New Workspace", icon: PlusCircle },
  { href: "/app/ai", label: "AI Assistant", icon: Sparkles },
  { href: "/app/notifications", label: "Notifications", icon: Bell, showBadge: true },
  { href: "/app/members", label: "Members", icon: Users },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  canManageMembers = false,
}: {
  canManageMembers?: boolean;
}) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  const navLinks = baseNavLinks.filter(
    (link) => link.href !== "/app/members" || canManageMembers
  );

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const fetchCount = () => {
      getUnreadCount().then(({ count }) => setUnreadCount(count));
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  const sidebarContent = (
    <>
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

      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-muted hover:border-border-light hover:text-text-secondary transition-colors"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden sm:inline rounded border border-border bg-surface-secondary px-1.5 py-0.5 text-[10px] text-text-muted">
          Ctrl+K
        </kbd>
      </button>

      <div className="flex flex-col gap-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-text-secondary hover:bg-surface hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </span>
              {link.showBadge && unreadCount > 0 && (
                <span className="inline-flex items-center justify-center rounded-full bg-accent/10 px-1.5 py-0.5 text-xs font-medium text-accent">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger — visible below md */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-40 flex items-center justify-center h-9 w-9 rounded-lg bg-surface border border-border shadow-sm text-text-secondary hover:text-foreground transition-colors"
        aria-label="Open navigation"
        aria-expanded={mobileOpen}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Desktop sidebar — always visible md+ */}
      <nav className="hidden md:flex w-64 border-r border-border bg-surface-secondary p-4 flex-col gap-4 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </nav>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-overlay/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="relative w-64 h-full bg-surface-secondary border-r border-border p-4 flex flex-col gap-4 overflow-y-auto">
            {sidebarContent}
          </nav>
        </div>
      )}

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
