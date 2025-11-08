"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTranslations } from "@/i18n/client";

export default function AdminSettingsPage() {
  const t = useTranslations();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {t("admin.settings.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("admin.settings.subtitle")}
            </p>
          </div>
          <SettingsForm />
        </main>
      </div>
    </AuthGuard>
  );
}
