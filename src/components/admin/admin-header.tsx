"use client";

import { Home, LogOut, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useTranslations } from "@/i18n/client";
import { signOutUser } from "@/lib/firebase/auth";

export function AdminHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslations();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.success(t("auth.signOutSuccess"));
      router.push("/admin/login");
    } catch (error) {
      toast.error(t("common.error"), {
        description:
          error instanceof Error ? error.message : t("common.error"),
      });
    }
  };

  return (
    <header className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-xl font-bold">
              {t("admin.title")}
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  {t("admin.viewSite")}
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/admin/projects/new">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("admin.projects.new")}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  {t("admin.settings.title")}
                </Link>
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <span className="hidden sm:inline text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t("admin.signOut")}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}