"use client";

import { motion } from "framer-motion";
import { memo, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/i18n/client";
import analytics from "@/lib/analytics";
import { fadeInUp, smooth, staggerContainer } from "@/lib/animations";
import { getAllTechnologies } from "@/lib/firebase/services/technologies";
import type { Project } from "@/lib/firebase/types";
import { FeaturedProjectCard } from "./featured-project-card";
import { ProjectCard } from "./project-card";

interface ProjectsGridProps {
  projects: Project[];
}

const TechFilter = memo(function TechFilter({
  technologies,
  selected,
  onSelect,
}: {
  technologies: Array<{ id: string; name: string; count: number }>;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const t = useTranslations();

  const handleFilterClick = (techId: string, techName: string) => {
    if (techId !== "all") {
      analytics.project.filtered(techName);
    }
    onSelect(techId);
  };

  return (
    <motion.div
      className="flex flex-wrap gap-2"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={staggerContainer}
      transition={smooth}
    >
      <motion.div variants={fadeInUp}>
        <Button
          variant={selected === "all" ? "default" : "outline"}
          onClick={() => handleFilterClick("all", "all")}
          size="sm"
          className="transition-all hover:scale-105"
        >
          {t("portfolio.projects.categories.all")}
        </Button>
      </motion.div>

      {technologies.map((tech, index) => (
        <motion.div
          key={tech.id}
          variants={fadeInUp}
          transition={{ delay: index * 0.05 }}
        >
          <Button
            variant={selected === tech.id ? "default" : "outline"}
            onClick={() => handleFilterClick(tech.id, tech.name)}
            size="sm"
            className="transition-all hover:scale-105"
          >
            {tech.name} ({tech.count})
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
});

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const t = useTranslations();
  const [selectedTech, setSelectedTech] = useState<string>("all");
  const [topTechnologies, setTopTechnologies] = useState<
    Array<{ id: string; name: string; count: number }>
  >([]);
  const [technologyMap, setTechnologyMap] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    getAllTechnologies().then((techs) => {
      const sorted = [...techs]
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 8);

      setTopTechnologies(
        sorted.map((t) => ({
          id: t.id,
          name: t.name,
          count: t.usageCount,
        })),
      );

      const map: Record<string, string> = {};
      techs.forEach((t) => {
        map[t.id] = t.name;
      });
      setTechnologyMap(map);
    });
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedTech === "all") return projects;
    return projects.filter(
      (p) =>
        Array.isArray(p.technologies) && p.technologies.includes(selectedTech),
    );
  }, [projects, selectedTech]);

  const featuredProjects = useMemo(
    () => filteredProjects.filter((p) => p.featured),
    [filteredProjects],
  );

  const regularProjects = useMemo(
    () => filteredProjects.filter((p) => !p.featured),
    [filteredProjects],
  );

  return (
    <section id="projects" className="py-16 px-4">
      <div className="container mx-auto space-y-12">
        <motion.div
          className="space-y-4"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={smooth}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t("portfolio.projects.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {t("portfolio.projects.description")}
          </p>
        </motion.div>

        <TechFilter
          technologies={topTechnologies}
          selected={selectedTech}
          onSelect={setSelectedTech}
        />

        {filteredProjects.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={smooth}
          >
            <p className="text-muted-foreground">
              {t("portfolio.projects.noProjects")}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-16">
            {featuredProjects.length > 0 && (
              <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold tracking-tight">
                  ⭐ {t("portfolio.projects.featuredProjects")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredProjects.map((project, index) => (
                    <FeaturedProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      technologyMap={technologyMap}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {regularProjects.length > 0 && (
              <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="space-y-6"
              >
                {featuredProjects.length > 0 && (
                  <h3 className="text-2xl font-bold tracking-tight">
                    {t("common.all")} {t("portfolio.projects.title")}
                  </h3>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      technologyMap={technologyMap}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
