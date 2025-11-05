"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Project, ProjectCategory, ProjectStatus, MultilingualText } from "@/lib/firebase/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Combobox } from "@/components/ui/combobox"
import { X } from "lucide-react"
import { createProject, updateProject, generateSlug } from "@/lib/firebase/services/admin-projects"
import { getAllTechnologies, createTechnology } from "@/lib/firebase/services/technologies"
import { toast } from "sonner"

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

const emptyMultilingualText = (): MultilingualText => ({
  "en-US": "",
  "pt-BR": "",
  "es-ES": "",
})

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [title, setTitle] = useState<MultilingualText>(project?.title || emptyMultilingualText())
  const [slug, setSlug] = useState(project?.slug || "")
  const [shortDescription, setShortDescription] = useState<MultilingualText>(
    project?.shortDescription || emptyMultilingualText(),
  )
  const [longDescription, setLongDescription] = useState<MultilingualText>(
    project?.longDescription || emptyMultilingualText(),
  )
  const [category, setCategory] = useState<ProjectCategory>(project?.category || "web")
  const [status, setStatus] = useState<ProjectStatus>(project?.status || "draft")
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies || [])
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl || "")
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl || "")
  const [hasSourceCode, setHasSourceCode] = useState(project?.hasSourceCode ?? true)
  const [thumbnailUrl, setThumbnailUrl] = useState(project?.thumbnailUrl || "")
  const [images, setImages] = useState<string[]>(project?.images || [])
  const [imageInput, setImageInput] = useState("")
  const [featured, setFeatured] = useState(project?.featured || false)
  const [order, setOrder] = useState(project?.order || 0)

  const [availableTechnologies, setAvailableTechnologies] = useState<Array<{ value: string; label: string }>>([])
  const [selectedTechForAdd, setSelectedTechForAdd] = useState("")
  const [newTechInput, setNewTechInput] = useState("")

  useEffect(() => {
    getAllTechnologies().then((techs) => {
      setAvailableTechnologies(techs.map((t) => ({ value: t.name, label: t.name })))
    })
  }, [])

  useEffect(() => {
    if (!project && title["pt-BR"]) {
      setSlug(generateSlug(title["pt-BR"]))
    }
  }, [title, project])

  const handleAddTechnology = async () => {
    if (selectedTechForAdd && !technologies.includes(selectedTechForAdd)) {
      setTechnologies([...technologies, selectedTechForAdd])
      setSelectedTechForAdd("")
    } else if (newTechInput.trim() && !technologies.includes(newTechInput.trim())) {
      const newTech = newTechInput.trim()
      await createTechnology({ name: newTech, slug: generateSlug(newTech) })
      setTechnologies([...technologies, newTech])
      setNewTechInput("")
      const techs = await getAllTechnologies()
      setAvailableTechnologies(techs.map((t) => ({ value: t.name, label: t.name })))
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

    const titleValid = title["en-US"].trim() && title["pt-BR"].trim() && title["es-ES"].trim()
    const shortDescValid =
      shortDescription["en-US"].trim() && shortDescription["pt-BR"].trim() && shortDescription["es-ES"].trim()
    const longDescValid =
      longDescription["en-US"].trim() && longDescription["pt-BR"].trim() && longDescription["es-ES"].trim()

    if (!titleValid || !slug.trim() || !shortDescValid || !longDescValid) {
      toast.error("Campos obrigatórios", {
        description: "Preencha título, slug e descrições em todos os idiomas",
      })
      return
    }

    if (technologies.length === 0) {
      toast.error("Tecnologias obrigatórias", {
        description: "Adicione pelo menos uma tecnologia",
      })
      return
    }

    setIsSubmitting(true)

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
      }

      if (project) {
        await updateProject(project.id, formData)
        toast.success("Projeto atualizado com sucesso!")
      } else {
        await createProject(formData)
        toast.success("Projeto criado com sucesso!")
      }

      router.push("/admin")
      router.refresh()
    } catch (error) {
      toast.error("Erro ao salvar projeto", {
        description: error instanceof Error ? error.message : "Erro desconhecido",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-3">
        <Label>Título do Projeto *</Label>
        <Tabs defaultValue="pt-BR" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pt-BR">Português</TabsTrigger>
            <TabsTrigger value="en-US">English</TabsTrigger>
            <TabsTrigger value="es-ES">Español</TabsTrigger>
          </TabsList>
          <TabsContent value="pt-BR" className="mt-3">
            <Input
              value={title["pt-BR"]}
              onChange={(e) => setTitle({ ...title, "pt-BR": e.target.value })}
              placeholder="Nome do projeto em português"
              required
            />
          </TabsContent>
          <TabsContent value="en-US" className="mt-3">
            <Input
              value={title["en-US"]}
              onChange={(e) => setTitle({ ...title, "en-US": e.target.value })}
              placeholder="Project name in English"
              required
            />
          </TabsContent>
          <TabsContent value="es-ES" className="mt-3">
            <Input
              value={title["es-ES"]}
              onChange={(e) => setTitle({ ...title, "es-ES": e.target.value })}
              placeholder="Nombre del proyecto en español"
              required
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL amigável) *</Label>
        <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="meu-projeto" required />
        <p className="text-sm text-muted-foreground">Gerado automaticamente a partir do título em português</p>
      </div>

      <div className="space-y-3">
        <Label>Descrição Curta *</Label>
        <Tabs defaultValue="pt-BR" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pt-BR">Português</TabsTrigger>
            <TabsTrigger value="en-US">English</TabsTrigger>
            <TabsTrigger value="es-ES">Español</TabsTrigger>
          </TabsList>
          <TabsContent value="pt-BR" className="mt-3">
            <Textarea
              value={shortDescription["pt-BR"]}
              onChange={(e) => setShortDescription({ ...shortDescription, "pt-BR": e.target.value })}
              placeholder="Breve descrição do projeto em português"
              rows={3}
              required
            />
          </TabsContent>
          <TabsContent value="en-US" className="mt-3">
            <Textarea
              value={shortDescription["en-US"]}
              onChange={(e) => setShortDescription({ ...shortDescription, "en-US": e.target.value })}
              placeholder="Brief project description in English"
              rows={3}
              required
            />
          </TabsContent>
          <TabsContent value="es-ES" className="mt-3">
            <Textarea
              value={shortDescription["es-ES"]}
              onChange={(e) => setShortDescription({ ...shortDescription, "es-ES": e.target.value })}
              placeholder="Breve descripción del proyecto en español"
              rows={3}
              required
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-3">
        <Label>Descrição Longa *</Label>
        <Tabs defaultValue="pt-BR" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pt-BR">Português</TabsTrigger>
            <TabsTrigger value="en-US">English</TabsTrigger>
            <TabsTrigger value="es-ES">Español</TabsTrigger>
          </TabsList>
          <TabsContent value="pt-BR" className="mt-3">
            <Textarea
              value={longDescription["pt-BR"]}
              onChange={(e) => setLongDescription({ ...longDescription, "pt-BR": e.target.value })}
              placeholder="Descrição detalhada do projeto em português"
              rows={6}
              required
            />
          </TabsContent>
          <TabsContent value="en-US" className="mt-3">
            <Textarea
              value={longDescription["en-US"]}
              onChange={(e) => setLongDescription({ ...longDescription, "en-US": e.target.value })}
              placeholder="Detailed project description in English"
              rows={6}
              required
            />
          </TabsContent>
          <TabsContent value="es-ES" className="mt-3">
            <Textarea
              value={longDescription["es-ES"]}
              onChange={(e) => setLongDescription({ ...longDescription, "es-ES": e.target.value })}
              placeholder="Descripción detallada del proyecto en español"
              rows={6}
              required
            />
          </TabsContent>
        </Tabs>
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
          <Label htmlFor="order">Ordem de Exibição</Label>
          <Input
            id="order"
            type="number"
            value={order}
            onChange={(e) => setOrder(Number.parseInt(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Tecnologias *</Label>
        <div className="flex gap-2">
          <Combobox
            options={availableTechnologies}
            value={selectedTechForAdd}
            onValueChange={setSelectedTechForAdd}
            placeholder="Selecione uma tecnologia..."
            searchPlaceholder="Buscar tecnologia..."
            emptyText="Nenhuma tecnologia encontrada."
            className="flex-1"
          />
          <Input
            value={newTechInput}
            onChange={(e) => setNewTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddTechnology()
              }
            }}
            placeholder="Ou digite uma nova..."
            className="flex-1"
          />
          <Button type="button" onClick={handleAddTechnology} variant="secondary">
            Adicionar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
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
            placeholder="https://github.com/usuario/projeto"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="liveUrl">URL do Projeto Online</Label>
          <Input
            id="liveUrl"
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="https://meuprojeto.com"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="hasSourceCode" checked={hasSourceCode} onCheckedChange={setHasSourceCode} />
        <Label htmlFor="hasSourceCode">Código fonte disponível publicamente</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnailUrl">URL da Imagem de Capa</Label>
        <Input
          id="thumbnailUrl"
          type="url"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>

      <div className="space-y-3">
        <Label>Galeria de Imagens</Label>
        <div className="flex gap-2">
          <Input
            type="url"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddImage()
              }
            }}
            placeholder="https://exemplo.com/imagem.jpg"
            className="flex-1"
          />
          <Button type="button" onClick={handleAddImage} variant="secondary">
            Adicionar
          </Button>
        </div>
        {images.length > 0 && (
          <div className="space-y-2">
            {images.map((image, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                <span className="text-sm flex-1 truncate">{image}</span>
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveImage(image)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
        <Label htmlFor="featured">Projeto em destaque na página inicial</Label>
      </div>

      <div className="flex gap-4 pt-6 border-t">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? "Salvando..." : project ? "Atualizar Projeto" : "Criar Projeto"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.push("/admin")}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
