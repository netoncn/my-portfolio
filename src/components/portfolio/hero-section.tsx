"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/i18n/client";
import {
  fadeInUp,
  slideInFromLeft,
  slideInFromRight,
  smooth,
  staggerContainer,
} from "@/lib/animations";
import type { PortfolioSettings } from "@/lib/firebase/types";

interface HeroSectionProps {
  settings: PortfolioSettings | null;
}

export const HeroSection = memo(function HeroSection({
  settings,
}: HeroSectionProps) {
  const t = useTranslations();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
      <motion.div
        className="container"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="space-y-4 mb-12"
          variants={slideInFromLeft}
          transition={smooth as any}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
            {settings?.name || "Portfolio"}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            {t.getMultilingualText(settings?.role) || "Web Developer"}
          </p>
        </motion.div>

        <div className="max-w-7xl w-full flex flex-col md:flex-row gap-12 items-start md:items-center mx-auto">
          <motion.div
            className="flex-1 space-y-6 order-2 md:order-1"
            variants={fadeInUp}
            transition={{ ...(smooth as any), delay: 0.1 }}
          >
            <p className="text-l md:text-l text-muted-foreground leading-relaxed">
              {settings?.bio
                ? t.getMultilingualText(settings.bio)
                : t("portfolio.hero.description")}
            </p>
          </motion.div>

          <div className="w-full md:w-auto flex flex-col items-center gap-8 order-1 md:order-2">
            {settings?.photo && (
              <motion.div
                className="relative aspect-square w-full max-w-[300px]"
                variants={slideInFromRight}
                transition={smooth as any}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src={settings.photo}
                  alt={settings.name || "Profile"}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover rounded-full shadow-2xl"
                  priority
                  quality={90}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                />
              </motion.div>
            )}

            {settings && (
              <motion.div
                className="flex gap-4"
                variants={fadeInUp}
                transition={{ ...(smooth as any), delay: 0.3 }}
              >
                {settings.github && (
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="hover:scale-110 transition-transform"
                  >
                    <a
                      href={settings.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </Button>
                )}
                {settings.linkedin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="hover:scale-110 transition-transform"
                  >
                    <a
                      href={settings.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </Button>
                )}
                {settings.email && (
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="hover:scale-110 transition-transform"
                  >
                    <a href={`mailto:${settings.email}`} aria-label="Email">
                      <Mail className="h-5 w-5" />
                    </a>
                  </Button>
                )}
              </motion.div>
            )}

            <motion.div
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              variants={fadeInUp}
              transition={{ ...(smooth as any), delay: 0.2 }}
            >
              <Button asChild size="lg" className="group w-full sm:w-auto">
                <Link href="#projects">
                  {t("portfolio.hero.viewProjects")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent"
              >
                <Link href="#contact">{t("portfolio.hero.contact")}</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
});
