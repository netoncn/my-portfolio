"use client";

import { Edit, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useI18n, useTranslations } from "@/i18n/client";
import analytics from "@/lib/analytics";
import { deleteProject } from "@/lib/firebase/services/admin-projects";
import type { Project } from "@/lib/firebase/types";

interface ProjectsTableProps {
  projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const { locale } = useI18n();
  const t = useTranslations();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusLabels = {
    draft: t("admin.projects.form.statuses.draft"),
    published: t("admin.projects.form.statuses.published"),
    archived: t("admin.projects.form.statuses.archived"),
  };

  const statusVariants = {
    draft: "secondary",
    published: "default",
    archived: "outline",
  } as const;

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProject(projectToDelete.id);

      analytics.admin.projectDeleted(
        projectToDelete.id,
        projectToDelete.title[locale],
      );

      toast.success(t("admin.projects.deleteSuccess"));
      setDeleteDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(t("common.error"), {
        description: error instanceof Error ? error.message : t("common.error"),
      });
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">
          {t("admin.projects.noProjects")}
        </p>
        <Button asChild className="mt-4">
          <Link href="/admin/projects/new">
            {t("admin.projects.createFirst")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.projects.table.title")}</TableHead>
              <TableHead>{t("admin.projects.table.category")}</TableHead>
              <TableHead>{t("admin.projects.table.status")}</TableHead>
              <TableHead>{t("admin.projects.table.featured")}</TableHead>
              <TableHead>{t("admin.projects.table.order")}</TableHead>
              <TableHead className="text-right">
                {t("admin.projects.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  {project.title[locale]}
                </TableCell>
                <TableCell className="capitalize">{project.category}</TableCell>
                <TableCell>
                  <Badge variant={statusVariants[project.status]}>
                    {statusLabels[project.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {project.featured
                    ? t("admin.projects.table.yes")
                    : t("admin.projects.table.no")}
                </TableCell>
                <TableCell>{project.order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {project.status === "published" && (
                      <Button variant="ghost" size="icon" asChild>
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/projects/edit/${project.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(project)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.projects.deleteConfirm")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.projects.deleteConfirm")} "
              {projectToDelete?.title[locale]}"
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t("common.loading") : t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
