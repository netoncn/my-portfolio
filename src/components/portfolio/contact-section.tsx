'use client'

import { Mail, Github, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/i18n/client"
import { PortfolioSettings } from "@/lib/firebase/types"

export function ContactSection({ settings }: { settings: PortfolioSettings | null }) {
  const t = useTranslations()
  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("portfolio.contact.title")}</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {t("portfolio.contact.description")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          {settings?.email && (
            <Button asChild size="lg">
              <a href={`mailto:${settings.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Enviar Email
              </a>
            </Button>
          )}
          {settings?.github && (
            <Button asChild variant="outline" size="lg">
              <a href={settings.github} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          )}
          {settings?.linkedin && (
            <Button asChild variant="outline" size="lg">
              <a href={settings.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
