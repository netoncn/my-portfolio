"use client";

import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
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
  createTechnology,
  getAllTechnologies,
} from "@/lib/firebase/services/technologies";
import type {
  MultilingualText,
  Project,
  ProjectCategory,
  ProjectStatus,
} from "@/lib/firebase/types";
import {
  deleteImage,
  generateUniqueFileName,
  uploadImage,
  validateImageFile,
} from "@/lib/supabase/storage";
import { generateSlug } from "@/lib/utils";

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
  const [featured, setFeatured] = useState(project?.featured || false);
  const [order, setOrder] = useState(project?.order || 0);

  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [oldThumbnailUrl, setOldThumbnailUrl] = useState(
    project?.thumbnailUrl || "",
  );
  const [oldImages, _setOldImages] = useState<string[]>(project?.images || []);

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

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setUploadingThumbnail(true);

    try {
      const fileName = `thumbnail-${generateUniqueFileName(file.name)}`;
      const path = `projects/${slug || "temp"}/${fileName}`;

      const url = await uploadImage(file, path);

      if (oldThumbnailUrl && oldThumbnailUrl !== url) {
        await deleteImage(oldThumbnailUrl).catch(console.error);
      }

      setThumbnailUrl(url);
      setOldThumbnailUrl(url);
      toast.success("Thumbnail enviada com sucesso!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao fazer upload da thumbnail",
      );
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleRemoveThumbnail = async () => {
    try {
      if (thumbnailUrl) {
        await deleteImage(thumbnailUrl).catch(console.error);
      }
      setThumbnailUrl("");
      setOldThumbnailUrl("");
      toast.success("Thumbnail removida com sucesso!");
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Erro ao remover thumbnail");
    }
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.error}`);
        return;
      }
    }

    setUploadingGallery(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileName = `gallery-${generateUniqueFileName(file.name)}`;
        const path = `projects/${slug || "temp"}/${fileName}`;
        return await uploadImage(file, path);
      });

      const urls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...urls]);

      toast.success(
        files.length === 1
          ? "Imagem adicionada com sucesso!"
          : `${files.length} imagens adicionadas com sucesso!`,
      );
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao fazer upload das imagens",
      );
    } finally {
      setUploadingGallery(false);

      e.target.value = "";
    }
  };

  const handleRemoveGalleryImage = async (imageUrl: string) => {
    try {
      await deleteImage(imageUrl).catch(console.error);
      setImages((prev) => prev.filter((img) => img !== imageUrl));
      toast.success("Imagem removida com sucesso!");
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Erro ao remover imagem");
    }
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
        const response = await fetch(`/api/admin/projects/${project.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Falha ao atualizar projeto");
        }

        const removedImages = oldImages.filter((img) => !images.includes(img));
        await Promise.all(
          removedImages.map((img) => deleteImage(img).catch(console.error)),
        );

        analytics.admin.projectUpdated(project.id, title["pt-BR"]);
        toast.success(t("admin.projects.updateSuccess"));
      } else {
        const response = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Falha ao criar projeto");
        }

        const { id: projectId } = await response.json();

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
      {}
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

      {}
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

      {}
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

      {}
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

      {}
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

      {}
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

      {}
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

      {}
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

      {}
      <div className="space-y-3">
        <Label>{t("admin.projects.form.thumbnailUrl")}</Label>
        <div className="space-y-4">
          {thumbnailUrl ? (
            <div className="relative inline-block">
              <Image
                src={thumbnailUrl}
                alt="Thumbnail"
                width={300}
                height={169}
                className="rounded-lg border object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={handleRemoveThumbnail}
                disabled={uploadingThumbnail}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg bg-muted">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              disabled={uploadingThumbnail}
              className="max-w-xs"
            />
            {uploadingThumbnail && (
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Fazendo upload da thumbnail...
              </p>
            )}
            {!uploadingThumbnail && (
              <p className="text-sm text-muted-foreground mt-2">
                Recomendado: proporção 16:9, máximo 5MB
              </p>
            )}
          </div>
        </div>
      </div>

      {}
      <div className="space-y-3">
        <Label>{t("admin.projects.form.imageGallery")}</Label>
        <div className="space-y-4">
          <div>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
              disabled={uploadingGallery}
              className="max-w-xs"
            />
            {uploadingGallery && (
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Fazendo upload das imagens...
              </p>
            )}
            {!uploadingGallery && (
              <p className="text-sm text-muted-foreground mt-2">
                Você pode selecionar múltiplas imagens. Máximo 5MB cada.
              </p>
            )}
          </div>
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={image}
                    alt={`Galeria ${index + 1}`}
                    width={200}
                    height={150}
                    className="rounded-lg border object-cover w-full aspect-video"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveGalleryImage(image)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {}
      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={featured}
          onCheckedChange={setFeatured}
        />
        <Label htmlFor="featured">{t("admin.projects.form.featured")}</Label>
      </div>

      {}
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
