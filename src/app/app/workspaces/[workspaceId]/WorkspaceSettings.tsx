"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Settings, Trash2, X, Check } from "lucide-react";
import { updateWorkspace, deleteWorkspace } from "@/server/actions/workspace";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface WorkspaceSettingsProps {
  workspaceId: string;
  initialName: string;
  initialDescription: string | null;
  canManage: boolean;
}

export default function WorkspaceSettings({
  workspaceId,
  initialName,
  initialDescription,
  canManage,
}: WorkspaceSettingsProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [pending, setPending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) nameRef.current?.focus();
  }, [editing]);

  if (!canManage) return null;

  const handleSave = async () => {
    setPending(true);
    const result = await updateWorkspace(workspaceId, {
      name,
      description: description || null,
    });
    setPending(false);
    if (result.success) {
      toast.success("Workspace updated");
      setEditing(false);
      router.refresh();
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  const handleDelete = async () => {
    setConfirmDelete(false);
    const result = await deleteWorkspace(workspaceId);
    if (result.success) {
      toast.success("Workspace deleted");
      router.push("/app/workspaces");
      router.refresh();
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-secondary transition-colors"
        >
          <Settings className="h-3.5 w-3.5" aria-hidden="true" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-error hover:bg-error/10 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Delete
        </button>
      </div>

      {editing && (
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3" role="group" aria-label="Edit workspace">
          <div className="space-y-2">
            <label htmlFor="workspace-name" className="text-sm font-medium text-foreground">
              Workspace name
            </label>
            <input
              ref={nameRef}
              id="workspace-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="workspace-description" className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id="workspace-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setName(initialName);
                setDescription(initialDescription ?? "");
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-secondary transition-colors"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={pending || !name.trim()}
              className="inline-flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              {pending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Delete workspace"
        message={`Are you sure you want to delete ${initialName}? This will permanently remove all projects and documents in it. This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}
