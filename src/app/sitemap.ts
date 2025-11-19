import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/firebase/services/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || "https://netoncn.com.br";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  try {
    const projects = await getPublishedProjects();

    const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => {
      const lastModified = project.updatedAt
        ? new Date(project.updatedAt as unknown as string)
        : new Date();

      return {
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: project.featured ? 0.9 : 0.7,
      };
    });

    return [...staticRoutes, ...projectRoutes];
  } catch (error) {
    console.error("[sitemap] Error generating sitemap:", error);
    return staticRoutes;
  }
}
