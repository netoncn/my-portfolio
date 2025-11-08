"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { ProjectForm } from "@/components/admin/project-form";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTranslations } from "@/i18n/client";

export default function NewProjectPage() {
  const t = useTranslations();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {t("admin.projects.new")}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t("admin.projects.newSubtitle")}
              </p>
            </div>
            <ProjectForm />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
