"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import analytics from "@/lib/analytics";
import { signOut } from "@/lib/firebase/auth";
import { useTranslations } from "@/i18n/client";

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

export function LogoutButton({
  variant = "ghost",
  size = "default",
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations();

  const handleLogout = async () => {
    setLoading(true);
    try {
      analytics.admin.logout();
      await signOut();
      
      toast.success(t("auth.logout.success.title"), {
        description: t("auth.logout.success.description"),
      });
      router.push("/");
    } catch (error) {
      console.error("[v0] Logout error:", error);
      toast.error(t("auth.logout.error.title"), {
        description: t("auth.logout.error.description"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      variant={variant}
      size={size}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {loading ? t("auth.logout.loading") : t("auth.logout.button")}
    </Button>
  );
}