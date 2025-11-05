"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react"
import { useTranslations } from "@/i18n/client"
import type { PortfolioSettings } from "@/lib/firebase/types"

export function HeroSection({ settings }: { settings: PortfolioSettings | null }) {
  const t = useTranslations()

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-[1fr,300px] gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
                {settings?.name || "Neton"}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light">
                {settings?.role ? t.getMultilingualText(settings.role) : t("portfolio.hero.role")}
              </p>
            </div>

            <div className="space-y-6 flex flex-row gap-6 md:items-center w-full justify-between">
              <div className="max-w-2xl space-y-6">
                <p className="text-lg md:text-l text-muted-foreground leading-relaxed">
                  {settings?.bio ? t.getMultilingualText(settings.bio) : t("portfolio.hero.description")}
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 justify-center md:items-center">
                {settings?.photo && (
                  <div className="relative aspect-square w-full max-w-[320px] mx-auto md:mx-0">
                    <Image
                      src={settings.photo || "/placeholder.svg"}
                      alt={settings.name || "Profile"}
                      fill
                      className="object-cover rounded-full"
                      priority
                    />
                  </div>
                )}

                {settings && (
                  <div className="flex gap-4">
                    {settings.github && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={settings.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                          <Github className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                    {settings.linkedin && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                    {settings.email && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`mailto:${settings.email}`} aria-label="Email">
                          <Mail className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-4">
                  <Button asChild size="lg">
                    <Link href="#projects">
                      {t("portfolio.hero.viewProjects")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#contact">{t("portfolio.hero.contact")}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
