import type { Locale, MultilingualText, Project } from "../firebase/types";
import { getBaseUrl, getLocalizedText } from "./metadata";

interface Person {
  "@type": "Person";
  "@id"?: string;
  name: string;
  url?: string;
  image?: string;
  jobTitle?: string;
  description?: string;
  email?: string;
  sameAs?: string[];
}

interface WebSite {
  "@type": "WebSite";
  "@id"?: string;
  url: string;
  name: string;
  description?: string;
  inLanguage?: string[];
  publisher?: Person;
}

interface SoftwareSourceCode {
  "@type": "SoftwareSourceCode";
  "@id"?: string;
  name: string;
  description: string;
  url: string;
  codeRepository?: string;
  programmingLanguage: string[];
  author: Person;
  dateCreated?: string;
  dateModified?: string;
  image?: string;
  keywords?: string[];
}

interface BreadcrumbList {
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

type JsonLd = Person | WebSite | SoftwareSourceCode | BreadcrumbList;

export function generatePersonJsonLd(
  settings: {
    name: string;
    bio: MultilingualText;
    role: MultilingualText;
    email: string;
    github: string;
    linkedin: string;
    photo?: string;
  },
  locale: Locale = "pt-BR",
): Person {
  const baseUrl = getBaseUrl();

  const sameAs: string[] = [];
  if (settings.github) sameAs.push(settings.github);
  if (settings.linkedin) sameAs.push(settings.linkedin);

  return {
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    name: settings.name,
    url: baseUrl,
    image: settings.photo ? `${baseUrl}${settings.photo}` : undefined,
    jobTitle: getLocalizedText(settings.role, locale),
    description: getLocalizedText(settings.bio, locale),
    email: settings.email,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

export function generateWebSiteJsonLd(
  settings: {
    name: string;
    bio: MultilingualText;
    role: MultilingualText;
    email: string;
    github: string;
    linkedin: string;
    photo?: string;
  },
  locale: Locale = "pt-BR",
): WebSite {
  const baseUrl = getBaseUrl();

  return {
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: `${settings.name} - Portfolio`,
    description: getLocalizedText(settings.bio, locale),
    inLanguage: ["pt-BR", "en-US", "es-ES"],
    publisher: generatePersonJsonLd(settings, locale),
  };
}

export function generateProjectJsonLd(
  project: Project,
  locale: Locale = "pt-BR",
): SoftwareSourceCode {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/projects/${project.slug}`;

  return {
    "@type": "SoftwareSourceCode",
    "@id": url,
    name: getLocalizedText(project.title, locale),
    description: getLocalizedText(project.longDescription, locale),
    url,
    codeRepository: project.githubUrl || undefined,
    programmingLanguage: project.technologies,
    author: {
      "@type": "Person",
      name: "Nelson Christovam Neto",
      url: baseUrl,
    },
    dateCreated: project.createdAt as unknown as string,
    dateModified: project.updatedAt as unknown as string,
    image: project.thumbnailUrl,
    keywords: [...project.technologies, project.category],
  };
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url?: string }>,
): BreadcrumbList {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function jsonLdToScript(jsonLd: JsonLd | JsonLd[]): string {
  const data = Array.isArray(jsonLd)
    ? { "@context": "https://schema.org", "@graph": jsonLd }
    : { "@context": "https://schema.org", ...jsonLd };

  return JSON.stringify(data);
}

export function JsonLd({ data }: { data: JsonLd | JsonLd[] }) {
  const scriptContent = jsonLdToScript(data);

  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires this
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: scriptContent }}
      suppressHydrationWarning
    />
  );
}
