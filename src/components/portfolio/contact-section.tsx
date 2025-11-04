import { Mail, Github, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/constants"

export function ContactSection() {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Vamos Conversar</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Se você gostaria de discutir um projeto ou apenas dizer oi, estou sempre disponível para conversar.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <a href={`mailto:${CONTACT_EMAIL}`}>
              <Mail className="mr-2 h-4 w-4" />
              Enviar Email
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
