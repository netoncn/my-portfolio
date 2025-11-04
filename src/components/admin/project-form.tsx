"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Project, ProjectFormData, ProjectCategory, ProjectStatus } from "@/lib/firebase/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { createProject, updateProject, generateSlug } from "@/lib/firebase/services/admin-projects"
import { toast } from "sonner"
import { AIDescriptionGenerator } from "./ai-description-generator"

interface ProjectFormProps {
  project?: Project
}

const categories: { value: ProjectCategory; label: string }[] = [
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "desktop", label: "Desktop" },
  { value: "api", label: "API" },
  { value: "library", label: "Biblioteca" },
  { value: "other", label: "Outros" },
]

const statuses: { value: ProjectStatus; label: string }[] = [
  { value: "draft", label: "Rascunho" },
  { value: "published", label: "Publicado" },
  { value: "archived", label: "Arquivado" },
]

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [title, setTitle] = useState(project?.title || "")
  const [slug, setSlug] = useState(project?.slug || "")
  const [description, setDescription] = useState(project?.description || "")
  const [longDescription, setLongDescription] = useState(project?.longDescription || "")
  const [category, setCategory] = useState<ProjectCategory>(project?.category || "web")
  const [status, setStatus] = useState<ProjectStatus>(project?.status || "draft")
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies || [])
  const [techInput, setTechInput] = useState("")
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl || "")
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl || "")
  const [thumbnailUrl, setThumbnailUrl] = useState(project?.thumbnailUrl || "")
  const [images, setImages] = useState<string[]>(project?.images || [])
  const [imageInput, setImageInput] = useState("")
  const [featured, setFeatured] = useState(project?.featured || false)
  const [order, setOrder] = useState(project?.order || 0)

  useEffect(() => {
    if (!project && title) {
      setSlug(generateSlug(title))
    }
  }, [title, project])

  const handleAddTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()])
      setTechInput("")
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech))
  }

  const handleAddImage = () => {
    if (imageInput.trim() && !images.includes(imageInput.trim())) {
      setImages([...images, imageInput.trim()])
      setImageInput("")
    }
  }

  const handleRemoveImage = (image: string) => {
    setImages(images.filter((i) => i !== image))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !slug.trim() || !description.trim()) {
      toast.error("Campos obrigatórios", {
        description: "Preencha título, slug e descrição",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData: ProjectFormData = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        category,
        status,
        technologies,
        featured,
        order,
      }

      if (longDescription && longDescription.trim()) formData.longDescription = longDescription.trim()
      if (githubUrl && githubUrl.trim()) formData.githubUrl = githubUrl.trim()
      if (liveUrl && liveUrl.trim()) formData.liveUrl = liveUrl.trim()
      if (thumbnailUrl && thumbnailUrl.trim()) formData.thumbnailUrl = thumbnailUrl.trim()
      if (images.length > 0) formData.images = images

      if (project) {
        await updateProject(project.id, formData)
        toast.success("Projeto atualizado", {
          description: "As alterações foram salvas com sucesso",
        })
      } else {
        await createProject(formData)
        toast.success("Projeto criado", {
          description: "O novo projeto foi adicionado com sucesso",
        })
      }

      router.push("/admin")
      router.refresh()
    } catch (error) {
      toast.error("Erro ao salvar", {
        description: error instanceof Error ? error.message : "Erro desconhecido",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nome do projeto"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="url-amigavel" required />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="description">Descrição Curta *</Label>
          <AIDescriptionGenerator
            title={title}
            category={category}
            technologies={technologies}
            type="short"
            text={description}
            githubUrl={githubUrl}
            onGenerated={setDescription}
          />
        </div>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Breve descrição do projeto"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="longDescription">Descrição Longa</Label>
          <AIDescriptionGenerator
            title={title}
            category={category}
            technologies={technologies}
            type="long"
            text={longDescription}
            githubUrl={githubUrl}
            onGenerated={setLongDescription}
          />
        </div>
        <Textarea
          id="longDescription"
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
          placeholder="Descrição detalhada do projeto"
          rows={6}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as ProjectCategory)}>
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
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as ProjectStatus)}>
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
          <Label htmlFor="order">Ordem</Label>
          <Input
            id="order"
            type="number"
            value={order}
            onChange={(e) => setOrder(Number.parseInt(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="technologies">Tecnologias</Label>
        <div className="flex gap-2">
          <Input
            id="technologies"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddTechnology()
              }
            }}
            placeholder="Ex: React, TypeScript"
          />
          <Button type="button" onClick={handleAddTechnology} variant="secondary">
            Adicionar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="gap-1">
              {tech}
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
          <Label htmlFor="githubUrl">URL do GitHub</Label>
          <Input
            id="githubUrl"
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="liveUrl">URL do Projeto</Label>
          <Input
            id="liveUrl"
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnailUrl">URL da Thumbnail</Label>
        <Input
          id="thumbnailUrl"
          type="url"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Galeria de Imagens</Label>
        <div className="flex gap-2">
          <Input
            id="images"
            type="url"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddImage()
              }
            }}
            placeholder="https://..."
          />
          <Button type="button" onClick={handleAddImage} variant="secondary">
            Adicionar
          </Button>
        </div>
        <div className="space-y-2 mt-2">
          {images.map((image, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded">
              <span className="text-sm flex-1 truncate">{image}</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveImage(image)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
        <Label htmlFor="featured">Projeto em destaque</Label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : project ? "Atualizar Projeto" : "Criar Projeto"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
