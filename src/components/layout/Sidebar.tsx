"use client";

import { useState, useEffect } from "react";
import { getUnreadCount } from "@/server/actions/notifications";

const navLinks = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/workspaces", label: "Workspaces" },
  { href: "/app/workspaces/new", label: "New Workspace" },
  { href: "/app/ai", label: "AI Assistant" },
  { href: "/app/notifications", label: "Notifications", showBadge: true },
  { href: "/app/members", label: "Members" },
  { href: "/app/settings", label: "Settings" },
];

export default function Sidebar() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getUnreadCount().then(({ count }) => setUnreadCount(count));
  }, []);

  return (
    <nav className="w-64 border-r border-border bg-surface-secondary p-4 flex flex-col gap-4 shrink-0">
      <div className="flex items-center gap-2 px-2">
        <span className="text-lg font-bold text-foreground">Docsync</span>
      </div>
      <div className="flex flex-col gap-1">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface hover:text-foreground transition-colors"
          >
            <span>{link.label}</span>
            {link.showBadge && unreadCount > 0 && (
              <span className="inline-flex items-center justify-center rounded-full bg-accent-soft px-1.5 py-0.5 text-xs font-medium text-accent">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </a>
        ))}
      </div>
    </nav>
  );
}
