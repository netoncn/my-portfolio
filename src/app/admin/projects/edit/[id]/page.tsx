import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProjectForm } from "@/components/admin/project-form";
import { AuthGuard } from "@/components/auth/auth-guard";
import { getProjectByIdAdmin } from "@/lib/firebase/services/admin-projects";

export const dynamic = "force-dynamic";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProjectByIdAdmin(id);

  if (!project) {
    notFound();
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Editar Projeto
              </h1>
              <p className="text-muted-foreground mt-1">
                Atualize as informações do projeto
              </p>
            </div>
            <ProjectForm project={project} />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
