import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/portfolio/footer"
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/firebase/services/projects"

export const revalidate = 3600 // Revalidate every hour (ISR)

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <div className="space-y-6">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">{project.title}</h1>
            <p className="text-xl text-muted-foreground text-pretty">{project.description}</p>
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
                  Ver Código
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button asChild variant="outline">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver Projeto
                </a>
              </Button>
            )}
          </div>
        </div>

        {project.thumbnailUrl && (
          <div className="aspect-video relative overflow-hidden rounded-lg border">
            <Image
              src={project.thumbnailUrl || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {project.longDescription && (
          <div className="prose prose-invert max-w-none">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {project.longDescription.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {project.images && project.images.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Galeria</h2>
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

      <Footer />
    </main>
  )
}
