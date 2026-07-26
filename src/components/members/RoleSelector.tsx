"use client";

import type { MockMember } from "@/data/mock-workspaces";

interface RoleSelectorProps {
  member: MockMember;
  currentUserRole: string;
  onChangeRole: (userId: string, role: "admin" | "member") => void;
}

export default function RoleSelector({ member, currentUserRole, onChangeRole }: RoleSelectorProps) {
  if (member.role === "owner") {
    return (
      <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
        Owner
      </span>
    );
  }

  const canChange = currentUserRole === "owner" || currentUserRole === "admin";

  if (!canChange) {
    return (
      <span className="text-sm text-text-secondary capitalize">{member.role}</span>
    );
  }

  return (
    <select
      value={member.role}
      onChange={(e) => onChangeRole(member.id, e.target.value as "admin" | "member")}
      className="rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
    >
      <option value="admin">Admin</option>
      <option value="member">Member</option>
    </select>
  );
}
