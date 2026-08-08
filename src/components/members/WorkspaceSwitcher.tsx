"use client";

import { useRouter, usePathname } from "next/navigation";
import Select from "@/components/ui/Select";

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
      <Select
        id="workspace-switcher"
        label="Switch workspace"
        value={selectedId}
        onChange={(value) =>
          router.push(`${pathname}?workspace=${encodeURIComponent(value)}`)
        }
        options={workspaces.map((workspace) => ({
          value: workspace.id,
          label: workspace.name,
        }))}
        className="w-48"
      />
    </div>
  );
}
