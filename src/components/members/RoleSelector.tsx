"use client";

import { ShieldCheck, Shield } from "lucide-react";
import Select from "@/components/ui/Select";
import type { Member } from "@/server/actions/members";

interface RoleSelectorProps {
  member: Member;
  currentUserRole: string;
  onChangeRole: (userId: string, role: "admin" | "member") => void;
}

export default function RoleSelector({ member, currentUserRole, onChangeRole }: RoleSelectorProps) {
  if (member.role === "owner") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
        <ShieldCheck className="h-3 w-3" aria-hidden="true" />
        Owner
      </span>
    );
  }

  const canChange = currentUserRole === "owner" || currentUserRole === "admin";

  if (!canChange) {
    return (
      <span className="inline-flex items-center gap-1 text-sm text-text-secondary capitalize">
        <Shield className="h-3.5 w-3.5" aria-hidden="true" />
        {member.role}
      </span>
    );
  }

  return (
    <Select
      id={`role-${member.id}`}
      label={`Role for ${member.name}`}
      value={member.role}
      onChange={(value) => onChangeRole(member.id, value as "admin" | "member")}
      options={[
        { value: "admin", label: "Admin" },
        { value: "member", label: "Member" },
      ]}
      className="w-32"
    />
  );
}
