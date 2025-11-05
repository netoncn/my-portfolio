"use client"

import { useState, useEffect } from "react"
import type { Project } from "@/lib/firebase/types"
import { ProjectCard } from "./project-card"
import { Button } from "@/components/ui/button"
import { getAllTechnologies } from "@/lib/firebase/services/technologies"
import { useTranslations } from "@/i18n/client"

interface ProjectsGridProps {
  projects: Project[]
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const t = useTranslations()
  const [selectedTech, setSelectedTech] = useState<string | "all">("all")
  const [topTechnologies, setTopTechnologies] = useState<Array<{ name: string; count: number }>>([])

  useEffect(() => {
    getAllTechnologies().then((techs) => {
      const sorted = techs.sort((a, b) => b.usageCount - a.usageCount).slice(0, 8)
      setTopTechnologies(sorted.map((t) => ({ name: t.name, count: t.usageCount })))
    })
  }, [])

  const filteredProjects =
    selectedTech === "all" ? projects : projects.filter((p) => p.technologies.includes(selectedTech))

  return (
    <section id="projects" className="py-16 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("portfolio.projects.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">{t("portfolio.projects.description")}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedTech === "all" ? "default" : "outline"}
            onClick={() => setSelectedTech("all")}
            size="sm"
          >
            {t("portfolio.projects.categories.all")}
          </Button>
          {topTechnologies.map((tech) => (
            <Button
              key={tech.name}
              variant={selectedTech === tech.name ? "default" : "outline"}
              onClick={() => setSelectedTech(tech.name)}
              size="sm"
            >
              {tech.name} ({tech.count})
            </Button>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">{t("portfolio.projects.noProjects")}</p>
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
