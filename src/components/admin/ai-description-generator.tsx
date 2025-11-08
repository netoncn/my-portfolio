"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/i18n/client";
import analytics from "@/lib/analytics";

interface AIDescriptionGeneratorProps {
  title: string;
  category: string;
  technologies: string[];
  type: "short" | "long";
  text?: string | undefined;
  githubUrl?: string | undefined;
  onGenerated: (description: string) => void;
}

export function AIDescriptionGenerator({
  title,
  category,
  technologies,
  type,
  text,
  githubUrl,
  onGenerated,
}: AIDescriptionGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const t = useTranslations();

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error(t("admin.ai.titleNeeded"), {
        description: t("admin.ai.titleNeededDesc"),
      });
      return;
    }

    if (technologies.length === 0) {
      toast.error(t("admin.ai.technologiesNeeded"), {
        description: t("admin.ai.technologiesNeededDesc"),
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          technologies,
          type,
          text,
          githubUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(t("admin.ai.generationFailed"));
      }

      const { description } = await response.json();
      onGenerated(description);

      analytics.admin.aiDescriptionGenerated(type);

      toast.success(t("admin.ai.descriptionGenerated"), {
        description: t("admin.ai.descriptionGeneratedDesc"),
      });
    } catch (error) {
      toast.error(t("admin.ai.error"), {
        description: error instanceof Error ? error.message : t("common.error"),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleGenerate}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t("admin.ai.generating")}
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          {t("admin.ai.generateDescription")}
        </>
      )}
    </Button>
  );
}
