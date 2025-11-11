import AdminDashboardClient from "@/components/admin/admin-dashboard";
import { AdminHeader } from "@/components/admin/admin-header";
import { AuthGuard } from "@/components/auth/auth-guard";
import { getAllProjects } from "@/lib/firebase/services/admin-projects";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const projects = await getAllProjects();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <AdminDashboardClient projects={projects} />
      </div>
    </AuthGuard>
  );
}