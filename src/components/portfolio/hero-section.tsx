import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react"
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/constants"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-5xl w-full space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">Nelson Christovam Neto</h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">Desenvolvedor Full Stack</p>
        </div>

        <div className="max-w-2xl space-y-6">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Construo experiências digitais modernas e acessíveis que combinam design cuidadoso com engenharia robusta.
            Meu trabalho está na interseção entre design e desenvolvimento, criando produtos que não apenas funcionam
            bem, mas são meticulosamente construídos para performance e usabilidade.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          <Button asChild size="lg">
            <Link href="#projects">
              Ver Projetos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#contact">Contato</Link>
          </Button>
        </div>

        <div className="flex gap-4 pt-8">
          <Button variant="ghost" size="icon" asChild>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email">
              <Mail className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
