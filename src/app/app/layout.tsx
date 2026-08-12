import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth";
import { canManageWorkspaceMembers } from "@/server/access";
import Sidebar from "@/components/layout/Sidebar";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/login");
  }

  const canManageMembers = await canManageWorkspaceMembers(currentUser.id);

  return (
    <div className="flex min-h-screen">
      <Sidebar canManageMembers={canManageMembers} />
      <main id="main-content" className="flex-1 p-4 md:p-6 pt-14 md:pt-6">{children}</main>
    </div>
  );
}
