"use client"

import { useI18n } from "@/i18n/client"
import { Button } from "../ui/button"
import Link from "next/dist/client/link"
import { ArrowLeft, ExternalLink, Github } from "lucide-react"
import { Project } from "@/lib/firebase/types"
import { Badge } from "../ui/badge"
import Image from "next/image"

interface ProjectInfoProps {
  project: Project
}

export function ProjectInfo({ project }: ProjectInfoProps) {
    const { locale, t } = useI18n()

    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <div className="space-y-6">
          <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("common.back")}
              </Link>
          </Button>

          <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">{project.title[locale]}</h1>
              <p className="text-xl text-muted-foreground text-pretty">{project.shortDescription[locale]}</p>
          </div>

          <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                  {tech}
              </Badge>
              ))}
          </div>

          <div className="flex gap-3">
              {project.githubUrl && (
              <Button asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    {t("portfolio.projects.viewCode")}
                  </a>
              </Button>
              )}
              {project.liveUrl && (
              <Button asChild variant="outline">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {t("portfolio.projects.viewLive")}
                  </a>
              </Button>
              )}
          </div>
          </div>

          {project.thumbnailUrl && (
          <div className="aspect-video relative overflow-hidden rounded-lg border">
              <Image
                  src={project.thumbnailUrl || "/placeholder.svg"}
                  alt={project.title[locale] || "Project Thumbnail"}
                  fill
                  className="object-cover"
                  priority
              />
          </div>
          )}

          {project.longDescription && (
          <div className="prose prose-invert max-w-none">
              <div className="space-y-4 text-muted-foreground leading-relaxed">
              {project.longDescription[locale].split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
              ))}
              </div>
          </div>
          )}

        {project.images && project.images.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t("portfolio.projects.gallery")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.images.map((image, index) => (
                <div key={index} className="aspect-video relative overflow-hidden rounded-lg border">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${project.title} - Imagem ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
}