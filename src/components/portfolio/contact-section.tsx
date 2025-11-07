"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/i18n/client";
import analytics from "@/lib/analytics";
import type { PortfolioSettings } from "@/lib/firebase/types";

export function ContactSection({
  settings,
}: {
  settings: PortfolioSettings | null;
}) {
  const t = useTranslations();

  const handleEmailClick = () => {
    if (settings?.email) {
      analytics.contact.emailClicked(settings.email);
    }
  };

  const handleGithubClick = () => {
    if (settings?.github) {
      analytics.contact.githubClicked(settings.github);
    }
  };

  const handleLinkedinClick = () => {
    if (settings?.linkedin) {
      analytics.contact.linkedinClicked(settings.linkedin);
    }
  };

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t("portfolio.contact.title")}
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {t("portfolio.contact.description")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          {settings?.email && (
            <Button asChild size="lg" onClick={handleEmailClick}>
              <a href={`mailto:${settings.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Enviar Email
              </a>
            </Button>
          )}
          {settings?.github && (
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              onClick={handleGithubClick}
            >
              <a
                href={settings.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          )}
          {settings?.linkedin && (
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              onClick={handleLinkedinClick}
            >
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}