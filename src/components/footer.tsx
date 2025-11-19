"use client";

import { useTranslations } from "@/i18n/client";

export function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-8 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <p>
          © {currentYear} Nelson Christovam Neto. {t("footer.rights")}
        </p>
        <p>{t("footer.builtWith")} Next.js & Firebase</p>
      </div>
    </footer>
  );
}
