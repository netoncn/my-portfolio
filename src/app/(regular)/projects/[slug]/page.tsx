import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectInfo } from "@/components/portfolio/project-info";
import {
  getAllProjectSlugs,
  getProjectBySlug,
} from "@/lib/firebase/services/projects";
import {
  JsonLd,
  generateBreadcrumbJsonLd,
  generateProjectJsonLd,
  generateProjectMetadata,
} from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Projeto não encontrado",
      description: "O projeto que você procura não foi encontrado.",
    };
  }

  return generateProjectMetadata(project);
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const jsonLdData = [
    generateProjectJsonLd(project),
    generateBreadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Projetos", url: "/#projetos" },
      { name: project.title["pt-BR"] },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />
      <ProjectInfo project={project} />
    </>
  );
}
