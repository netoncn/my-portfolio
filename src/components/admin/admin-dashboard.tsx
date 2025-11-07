"use client";

import { useTranslations } from "@/i18n/client";
import { ProjectsTable } from "@/components/admin/projects-table";
import type { Project } from "@/lib/firebase/types";

interface AdminDashboardClientProps {
  projects: Project[];
}

export default function AdminDashboardClient({ projects }: AdminDashboardClientProps) {
  const t = useTranslations();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold tracking-tight">
                {t("admin.projects.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
                {t("admin.projects.subtitle")}
            </p>
            </div>
        </div>
        <ProjectsTable projects={projects} />
        </div>
    </main>
  );
}