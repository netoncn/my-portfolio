"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/client";
import { scaleIn } from "@/lib/animations";
import type { Project } from "@/lib/firebase/types";

interface FeaturedProjectCardProps {
  project: Project;
  index?: number;
  technologyMap?: Record<string, string>;
}

export const FeaturedProjectCard = memo(function FeaturedProjectCard({
  project,
  index = 0,
  technologyMap,
}: FeaturedProjectCardProps) {
  const { locale } = useI18n();

  const title = project.title[locale] || "Project Title";
  const shortDesc = project.shortDescription[locale] || "Project Description";

  return (
    <motion.article
      className="group relative overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      variants={scaleIn}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -12, scale: 1.02 }}
    >
      <div className="absolute top-4 right-4 z-10">
        <Badge className="bg-primary text-primary-foreground gap-1 px-3 py-1 shadow-lg">
          <Star className="h-3 w-3 fill-current" />
          Featured
        </Badge>
      </div>

      <Link href={`/projects/${project.slug}`} className="block">
        <div className="aspect-video relative overflow-hidden bg-muted">
          {project.thumbnailUrl ? (
            <Image
              src={project.thumbnailUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              loading={index < 3 ? "eager" : "lazy"}
              quality={90}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
              <span className="text-6xl font-bold text-primary/40">
                {title.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors text-balance">
              {title}
            </h3>
            <p className="text-base text-muted-foreground line-clamp-3 text-pretty leading-relaxed">
              {shortDesc}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 6).map((techId) => {
              const label = technologyMap?.[techId] ?? techId;
              return (
                <Badge
                  key={techId}
                  variant="secondary"
                  className="text-xs transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105"
                >
                  {label}
                </Badge>
              );
            })}
            {project.technologies.length > 6 && (
              <Badge variant="secondary" className="text-xs">
                +{project.technologies.length - 6}
              </Badge>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {project.githubUrl && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                onClick={(e) => e.stopPropagation()}
                className="hover:scale-110 transition-transform"
              >
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View code on GitHub"
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
                onClick={(e) => e.stopPropagation()}
                className="hover:scale-110 transition-transform"
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View live project"
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