"use client";

import { useRouter, usePathname } from "next/navigation";

interface WorkspaceSwitcherProps {
  workspaces: { id: string; name: string }[];
  selectedId: string;
}

export default function WorkspaceSwitcher({ workspaces, selectedId }: WorkspaceSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="workspace-switcher" className="text-sm text-text-secondary">
        Workspace
      </label>
      <select
        id="workspace-switcher"
        value={selectedId}
        onChange={(e) => router.push(`${pathname}?workspace=${encodeURIComponent(e.target.value)}`)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {workspaces.map((workspace) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
          </option>
        ))}
      </select>
    </div>
  );
}
