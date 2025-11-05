import { notFound } from "next/navigation"
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/firebase/services/projects"
import { ProjectInfo } from "@/components/portfolio/project-info"

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
    <ProjectInfo project={project} />
  )
}
