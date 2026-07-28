"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Sparkles,
  Bell,
  Users,
  Settings,
} from "lucide-react";
import { getUnreadCount } from "@/server/actions/notifications";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
  showBadge?: boolean;
}

const navLinks: NavLink[] = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/workspaces", label: "Workspaces", icon: Briefcase },
  { href: "/app/workspaces/new", label: "New Workspace", icon: PlusCircle },
  { href: "/app/ai", label: "AI Assistant", icon: Sparkles },
  { href: "/app/notifications", label: "Notifications", icon: Bell, showBadge: true },
  { href: "/app/members", label: "Members", icon: Users },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchCount = () => {
      getUnreadCount().then(({ count }) => setUnreadCount(count));
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="w-64 border-r border-border bg-surface-secondary p-4 flex flex-col gap-4 shrink-0 h-screen sticky top-0">
      <div className="flex items-center gap-2 px-2">
        <span className="text-lg font-bold text-foreground">Docsync</span>
      </div>
      <div className="flex flex-col gap-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <a
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
            </a>
          );
        })}
      </div>
    </nav>
  );
}
