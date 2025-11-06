import { AdminHeader } from "@/components/admin/admin-header";
import { ProjectForm } from "@/components/admin/project-form";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function NewProjectPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Novo Projeto
              </h1>
              <p className="text-muted-foreground mt-1">
                Adicione um novo projeto ao seu portfólio
              </p>
            </div>
            <ProjectForm />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
