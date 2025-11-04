"use client"

import { useState } from "react"
import type { Project, ProjectCategory } from "@/lib/firebase/types"
import { ProjectCard } from "./project-card"
import { Button } from "@/components/ui/button"

interface ProjectsGridProps {
  projects: Project[]
}

const categories: { value: ProjectCategory | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "desktop", label: "Desktop" },
  { value: "api", label: "API" },
  { value: "library", label: "Biblioteca" },
  { value: "other", label: "Outros" },
]

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "all">("all")

  const filteredProjects =
    selectedCategory === "all" ? projects : projects.filter((p) => p.category === selectedCategory)

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Projetos Selecionados</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Uma coleção dos meus trabalhos mais recentes e relevantes
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.value)}
              size="sm"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Nenhum projeto encontrado nesta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
