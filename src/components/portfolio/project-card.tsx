"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/client";
import analytics from "@/lib/analytics";
import { scaleIn } from "@/lib/animations";
import type { Project } from "@/lib/firebase/types";

interface ProjectCardProps {
  project: Project;
  index?: number;
  technologyMap?: Record<string, string>;
}

export const ProjectCard = memo(function ProjectCard({
  project,
  index = 0,
  technologyMap,
}: ProjectCardProps) {
  const { locale } = useI18n();

  const title = project.title[locale] || "Project Title";
  const shortDesc = project.shortDescription[locale] || "Project Description";

  const handleProjectClick = () => {
    analytics.project.viewed(project.id, title);
  };

  const handleGithubClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.githubUrl) {
      analytics.project.codeClicked(project.id, title, project.githubUrl);
    }
  };

  const handleLiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.liveUrl) {
      analytics.project.liveClicked(project.id, title, project.liveUrl);
    }
  };

  return (
    <motion.article
      className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      variants={scaleIn}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block"
        onClick={handleProjectClick}
      >
        <div className="aspect-video relative overflow-hidden bg-muted">
          {project.thumbnailUrl ? (
            <Image
              src={project.thumbnailUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              loading={index < 3 ? "eager" : "lazy"}
              quality={85}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground/20">
                {title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors text-balance">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">
              {shortDesc}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((techId) => {
              const label = technologyMap?.[techId] ?? techId;
              return (
                <Badge
                  key={techId}
                  variant="secondary"
                  className="text-xs transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {label}
                </Badge>
              );
            })}
            {project.technologies.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{project.technologies.length - 4}
              </Badge>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {project.githubUrl && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                onClick={handleGithubClick}
                className="hover:scale-110 transition-transform"
              >
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ver código no GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                onClick={handleLiveClick}
                className="hover:scale-110 transition-transform"
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ver projeto ao vivo"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
});
