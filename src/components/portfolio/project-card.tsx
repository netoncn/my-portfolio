"use client"

import Link from "next/link"
import Image from "next/image"
import type { Project } from "@/lib/firebase/types"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/client"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { locale } = useI18n()

  return (
    <article className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:border-primary/50">
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="aspect-video relative overflow-hidden bg-muted">
          {project.thumbnailUrl ? (
            <Image
              src={project.thumbnailUrl || "/placeholder.svg"}
              alt={project.title[locale] || "Project Thumbnail"}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground/20">{project.title[locale].charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors text-balance">
              {project.title[locale]}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{project.shortDescription[locale]}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{project.technologies.length - 4}
              </Badge>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {project.githubUrl && (
              <Button variant="ghost" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="Ver código no GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button variant="ghost" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label="Ver projeto ao vivo">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
