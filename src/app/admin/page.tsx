import { AuthGuard } from "@/components/auth/auth-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { ProjectsTable } from "@/components/admin/projects-table"
import { getAllProjects } from "@/lib/firebase/services/admin-projects"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const projects = await getAllProjects()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
                <p className="text-muted-foreground mt-1">Gerencie seus projetos do portfólio</p>
              </div>
            </div>
            <ProjectsTable projects={projects} />
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
