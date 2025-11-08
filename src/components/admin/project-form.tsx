"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "@/i18n/client";
import analytics from "@/lib/analytics";
import {
  createProject,
  generateSlug,
  updateProject,
} from "@/lib/firebase/services/admin-projects";
import {
  createTechnology,
  getAllTechnologies,
} from "@/lib/firebase/services/technologies";
import type {
  MultilingualText,
  Project,
  ProjectCategory,
  ProjectStatus,
} from "@/lib/firebase/types";

interface ProjectFormProps {
  project?: Project;
}

const emptyMultilingualText = (): MultilingualText => ({
  "en-US": "",
  "pt-BR": "",
  "es-ES": "",
});

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: { value: ProjectCategory; label: string }[] = [
    { value: "web", label: t("admin.projects.form.categories.web") },
    { value: "mobile", label: t("admin.projects.form.categories.mobile") },
    { value: "desktop", label: t("admin.projects.form.categories.desktop") },
    { value: "api", label: t("admin.projects.form.categories.api") },
    { value: "library", label: t("admin.projects.form.categories.library") },
    { value: "other", label: t("admin.projects.form.categories.other") },
  ];

  const statuses: { value: ProjectStatus; label: string }[] = [
    { value: "draft", label: t("admin.projects.form.statuses.draft") },
    { value: "published", label: t("admin.projects.form.statuses.published") },
    { value: "archived", label: t("admin.projects.form.statuses.archived") },
  ];

  const [title, setTitle] = useState<MultilingualText>(
    project?.title || emptyMultilingualText(),
  );
  const [slug, setSlug] = useState(project?.slug || "");
  const [shortDescription, setShortDescription] = useState<MultilingualText>(
    project?.shortDescription || emptyMultilingualText(),
  );
  const [longDescription, setLongDescription] = useState<MultilingualText>(
    project?.longDescription || emptyMultilingualText(),
  );
  const [category, setCategory] = useState<ProjectCategory>(
    project?.category || "web",
  );
  const [status, setStatus] = useState<ProjectStatus>(
    project?.status || "draft",
  );
  const [technologies, setTechnologies] = useState<string[]>(
    project?.technologies || [],
  );
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl || "");
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl || "");
  const [hasSourceCode, setHasSourceCode] = useState(
    project?.hasSourceCode ?? true,
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(project?.thumbnailUrl || "");
  const [images, setImages] = useState<string[]>(project?.images || []);
  const [imageInput, setImageInput] = useState("");
  const [featured, setFeatured] = useState(project?.featured || false);
  const [order, setOrder] = useState(project?.order || 0);

  const [availableTechnologies, setAvailableTechnologies] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [selectedTechForAdd, setSelectedTechForAdd] = useState("");
  const [newTechInput, setNewTechInput] = useState("");

  useEffect(() => {
    getAllTechnologies().then((techs) => {
      setAvailableTechnologies(
        techs.map((t) => ({ value: t.id, label: t.name })),
      );
    });
  }, []);

  useEffect(() => {
    if (!project && title["pt-BR"]) {
      setSlug(generateSlug(title["pt-BR"]));
    }
  }, [title, project]);

  const getTechLabel = (id: string) =>
    availableTechnologies.find((t) => t.value === id)?.label ?? id;

  const handleAddTechnology = async () => {
    if (selectedTechForAdd) {
      if (!technologies.includes(selectedTechForAdd)) {
        setTechnologies((prev) => [...prev, selectedTechForAdd]);
      }
      setSelectedTechForAdd("");
      return;
    }

    const trimmed = newTechInput.trim();
    if (!trimmed) return;

    const existing = availableTechnologies.find(
      (t) => t.label.toLowerCase() === trimmed.toLowerCase(),
    );

    let techId: string;

    if (existing) {
      techId = existing.value;
    } else {
      techId = await createTechnology({
        name: trimmed,
        slug: generateSlug(trimmed),
      });

      const techs = await getAllTechnologies();
      setAvailableTechnologies(
        techs.map((t) => ({ value: t.id, label: t.name })),
      );
    }

    if (!technologies.includes(techId)) {
      setTechnologies((prev) => [...prev, techId]);
    }

    setNewTechInput("");
  };

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const handleAddImage = () => {
    if (imageInput.trim() && !images.includes(imageInput.trim())) {
      setImages([...images, imageInput.trim()]);
      setImageInput("");
    }
  };

  const handleRemoveImage = (image: string) => {
    setImages(images.filter((i) => i !== image));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const titleValid =
      title["en-US"].trim() && title["pt-BR"].trim() && title["es-ES"].trim();
    const shortDescValid =
      shortDescription["en-US"].trim() &&
      shortDescription["pt-BR"].trim() &&
      shortDescription["es-ES"].trim();
    const longDescValid =
      longDescription["en-US"].trim() &&
      longDescription["pt-BR"].trim() &&
      longDescription["es-ES"].trim();

    if (!titleValid || !slug.trim() || !shortDescValid || !longDescValid) {
      toast.error(t("admin.projects.requiredFields"), {
        description: t("admin.projects.requiredFieldsDesc"),
      });
      return;
    }

    if (technologies.length === 0) {
      toast.error(t("admin.projects.technologiesRequired"), {
        description: t("admin.projects.technologiesRequiredDesc"),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = {
        title,
        slug: slug.trim(),
        shortDescription,
        longDescription,
        category,
        status,
        technologies,
        githubUrl: githubUrl.trim() || undefined,
        liveUrl: liveUrl.trim() || undefined,
        hasSourceCode,
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        images: images.length > 0 ? images : undefined,
        featured,
        order,
      };

      if (project) {
        await updateProject(project.id, formData);

        analytics.admin.projectUpdated(project.id, title["pt-BR"]);

        toast.success(t("admin.projects.updateSuccess"));
      } else {
        const projectId = await createProject(formData);

        analytics.admin.projectCreated(projectId, title["pt-BR"]);

        toast.success(t("admin.projects.createSuccess"));
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      toast.error(t("admin.projects.errorSaving"), {
        description: error instanceof Error ? error.message : t("common.error"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-3">
        <Label>{t("admin.projects.form.title")} *</Label>
        <Tabs defaultValue="pt-BR" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pt-BR">{t("languages.pt-BR")}</TabsTrigger>
            <TabsTrigger value="en-US">{t("languages.en-US")}</TabsTrigger>
            <TabsTrigger value="es-ES">{t("languages.es-ES")}</TabsTrigger>
          </TabsList>
          <TabsContent value="pt-BR" className="mt-3">
            <Input
              value={title["pt-BR"]}
              onChange={(e) => setTitle({ ...title, "pt-BR": e.target.value })}
              placeholder={t("admin.projects.form.titlePlaceholder.pt")}
              required
            />
          </TabsContent>
          <TabsContent value="en-US" className="mt-3">
            <Input
              value={title["en-US"]}
              onChange={(e) => setTitle({ ...title, "en-US": e.target.value })}
              placeholder={t("admin.projects.form.titlePlaceholder.en")}
              required
            />
          </TabsContent>
          <TabsContent value="es-ES" className="mt-3">
            <Input
              value={title["es-ES"]}
              onChange={(e) => setTitle({ ...title, "es-ES": e.target.value })}
              placeholder={t("admin.projects.form.titlePlaceholder.es")}
              required
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">{t("admin.projects.form.slug")} *</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder={t("admin.projects.form.slugPlaceholder")}
          required
        />
        <p className="text-sm text-muted-foreground">
          {t("admin.projects.form.slugDescription")}
        </p>
      </div>

      <div className="space-y-3">
        <Label>{t("admin.projects.form.shortDescription")} *</Label>
        <Tabs defaultValue="pt-BR" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pt-BR">{t("languages.pt-BR")}</TabsTrigger>
            <TabsTrigger value="en-US">{t("languages.en-US")}</TabsTrigger>
            <TabsTrigger value="es-ES">{t("languages.es-ES")}</TabsTrigger>
          </TabsList>
          <TabsContent value="pt-BR" className="mt-3">
            <Textarea
              value={shortDescription["pt-BR"]}
              onChange={(e) =>
                setShortDescription({
                  ...shortDescription,
                  "pt-BR": e.target.value,
                })
              }
              placeholder={t("admin.projects.form.shortDescPlaceholder.pt")}
              rows={3}
              required
            />
          </TabsContent>
          <TabsContent value="en-US" className="mt-3">
            <Textarea
              value={shortDescription["en-US"]}
              onChange={(e) =>
                setShortDescription({
                  ...shortDescription,
                  "en-US": e.target.value,
                })
              }
              placeholder={t("admin.projects.form.shortDescPlaceholder.en")}
              rows={3}
              required
            />
          </TabsContent>
          <TabsContent value="es-ES" className="mt-3">
            <Textarea
              value={shortDescription["es-ES"]}
              onChange={(e) =>
                setShortDescription({
                  ...shortDescription,
                  "es-ES": e.target.value,
                })
              }
              placeholder={t("admin.projects.form.shortDescPlaceholder.es")}
              rows={3}
              required
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-3">
        <Label>{t("admin.projects.form.longDescription")} *</Label>
        <Tabs defaultValue="pt-BR" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pt-BR">{t("languages.pt-BR")}</TabsTrigger>
            <TabsTrigger value="en-US">{t("languages.en-US")}</TabsTrigger>
            <TabsTrigger value="es-ES">{t("languages.es-ES")}</TabsTrigger>
          </TabsList>
          <TabsContent value="pt-BR" className="mt-3">
            <Textarea
              value={longDescription["pt-BR"]}
              onChange={(e) =>
                setLongDescription({
                  ...longDescription,
                  "pt-BR": e.target.value,
                })
              }
              placeholder={t("admin.projects.form.longDescPlaceholder.pt")}
              rows={6}
              required
            />
          </TabsContent>
          <TabsContent value="en-US" className="mt-3">
            <Textarea
              value={longDescription["en-US"]}
              onChange={(e) =>
                setLongDescription({
                  ...longDescription,
                  "en-US": e.target.value,
                })
              }
              placeholder={t("admin.projects.form.longDescPlaceholder.en")}
              rows={6}
              required
            />
          </TabsContent>
          <TabsContent value="es-ES" className="mt-3">
            <Textarea
              value={longDescription["es-ES"]}
              onChange={(e) =>
                setLongDescription({
                  ...longDescription,
                  "es-ES": e.target.value,
                })
              }
              placeholder={t("admin.projects.form.longDescPlaceholder.es")}
              rows={6}
              required
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="category">{t("admin.projects.form.category")}</Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as ProjectCategory)}
          >
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">{t("admin.projects.form.status")}</Label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as ProjectStatus)}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((stat) => (
                <SelectItem key={stat.value} value={stat.value}>
                  {stat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="order">{t("admin.projects.form.order")}</Label>
          <Input
            id="order"
            type="number"
            value={order}
            onChange={(e) => setOrder(Number.parseInt(e.target.value, 10) || 0)}
            placeholder={t("admin.projects.form.orderPlaceholder")}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>{t("admin.projects.form.technologies")} *</Label>
        <div className="flex gap-2">
          <Combobox
            options={availableTechnologies}
            value={selectedTechForAdd}
            onValueChange={setSelectedTechForAdd}
            placeholder={t("admin.projects.form.selectTechnology")}
            searchPlaceholder={t("admin.projects.form.searchTechnology")}
            emptyText={t("admin.projects.form.noTechnologyFound")}
            className="flex-1"
          />
          <Input
            value={newTechInput}
            onChange={(e) => setNewTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTechnology();
              }
            }}
            placeholder={t("admin.projects.form.orTypeNew")}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddTechnology}
            variant="secondary"
          >
            {t("admin.projects.form.addTechnology")}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="gap-1">
              {getTechLabel(tech)}
              <button
                type="button"
                onClick={() => handleRemoveTechnology(tech)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="githubUrl">
            {t("admin.projects.form.githubUrlOptional")}
          </Label>
          <Input
            id="githubUrl"
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder={t("admin.projects.form.githubPlaceholder")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="liveUrl">{t("admin.projects.form.liveUrl")}</Label>
          <Input
            id="liveUrl"
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder={t("admin.projects.form.livePlaceholder")}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="hasSourceCode"
          checked={hasSourceCode}
          onCheckedChange={setHasSourceCode}
        />
        <Label htmlFor="hasSourceCode">
          {t("admin.projects.form.hasSourceCode")}
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnailUrl">
          {t("admin.projects.form.thumbnailUrl")}
        </Label>
        <Input
          id="thumbnailUrl"
          type="url"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder={t("admin.projects.form.thumbnailPlaceholder")}
        />
      </div>

      <div className="space-y-3">
        <Label>{t("admin.projects.form.imageGallery")}</Label>
        <div className="flex gap-2">
          <Input
            type="url"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddImage();
              }
            }}
            placeholder={t("admin.projects.form.imageUrlPlaceholder")}
            className="flex-1"
          />
          <Button type="button" onClick={handleAddImage} variant="secondary">
            {t("admin.projects.form.addImage")}
          </Button>
        </div>
        {images.length > 0 && (
          <div className="space-y-2">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 border rounded-lg"
              >
                <span className="text-sm flex-1 truncate">{image}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveImage(image)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={featured}
          onCheckedChange={setFeatured}
        />
        <Label htmlFor="featured">{t("admin.projects.form.featured")}</Label>
      </div>

      <div className="flex gap-4 pt-6 border-t">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting
            ? t("admin.projects.form.submitting")
            : project
              ? t("admin.projects.form.update")
              : t("admin.projects.form.create")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push("/admin")}
        >
          {t("admin.projects.form.cancel")}
        </Button>
      </div>
    </form>
  );
}
