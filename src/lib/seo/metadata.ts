import type { Metadata } from "next";
import type { Locale, MultilingualText, Project } from "../firebase/types";

export interface SEOConfig {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: "website" | "article" | "profile";
  locale?: Locale;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const DEFAULT_SITE_NAME = "Nelson Christovam Neto";
const DEFAULT_DESCRIPTION =
  "Portfolio de Nelson Christovam Neto - Desenvolvedor Full Stack criando experiências digitais modernas e funcionais com React, Next.js, TypeScript e Firebase.";

export function getOgImageUrl(title?: string, description?: string): string {
  const baseUrl = getBaseUrl();
  const params = new URLSearchParams();

  if (title) params.set("title", title);
  if (description) params.set("description", description);

  return `${baseUrl}/api/og?${params.toString()}`;
}

export function getBaseUrl(): string {
  return process.env.SITE_URL || "https://netoncn.com.br";
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    url,
    image,
    type = "website",
    locale = "pt-BR",
    keywords = [],
    author,
    publishedTime,
    modifiedTime,
  } = config;

  const baseUrl = getBaseUrl();
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

  const fullImageUrl = image
    ? image.startsWith("http")
      ? image
      : `${baseUrl}${image}`
    : getOgImageUrl(title, description);

  const defaultKeywords = [
    "nelson christovam neto",
    "desenvolvedor full stack",
    "portfolio",
    "react",
    "nextjs",
    "typescript",
    "firebase",
    "web development",
    "desenvolvedor",
    "programador",
    "freelancer",
    "projetos",
    "freelance",
    "freelancing",
    "cto",
    "aplicações web",
    "desenvolvimento de software",
  ];

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])];

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: allKeywords,
    authors: author ? [{ name: author }] : [{ name: DEFAULT_SITE_NAME }],
    creator: DEFAULT_SITE_NAME,
    publisher: DEFAULT_SITE_NAME,

    alternates: {
      canonical: fullUrl,
      languages: {
        "pt-BR": fullUrl,
        "en-US": fullUrl,
        "es-ES": fullUrl,
      },
    },

    openGraph: {
      type,
      locale,
      url: fullUrl,
      title,
      description,
      siteName: DEFAULT_SITE_NAME,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
      creator: "@netoncn",
      site: "@netoncn",
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export function getLocalizedText(
  text: MultilingualText | string,
  locale: Locale = "pt-BR",
): string {
  if (typeof text === "string") return text;
  return text[locale] || text["pt-BR"];
}

export function generateProjectMetadata(
  project: Project,
  locale: Locale = "pt-BR",
): Metadata {
  const title =
    project.metaTitle?.[locale] ||
    getLocalizedText(project.title, locale);

  const description =
    project.metaDescription?.[locale] ||
    getLocalizedText(project.shortDescription, locale);

  const keywords = [
    ...project.technologies,
    project.category,
    "projeto",
    "portfolio",
  ];

  return generateMetadata({
    title: `${title} | ${DEFAULT_SITE_NAME}`,
    description,
    url: `/projects/${project.slug}`,
    image: project.thumbnailUrl,
    type: "article",
    locale,
    keywords,
    publishedTime: project.createdAt as unknown as string,
    modifiedTime: project.updatedAt as unknown as string,
  });
}

export function generateHomeMetadata(
  settings?: {
    name: string;
    bio: MultilingualText;
    role: MultilingualText;
    photo?: string;
    metaTitle?: MultilingualText;
    metaDescription?: MultilingualText;
  },
  locale: Locale = "pt-BR",
): Metadata {
  const defaultRole = {
    "pt-BR": "Desenvolvedor Full Stack",
    "en-US": "Full Stack Developer",
    "es-ES": "Desarrollador Full Stack",
  };

  const defaultBio = {
    "pt-BR": DEFAULT_DESCRIPTION,
    "en-US":
      "Nelson Christovam Neto's Portfolio - Full Stack Developer creating modern and functional digital experiences with React, Next.js, TypeScript, and Firebase.",
    "es-ES":
      "Portfolio de Nelson Christovam Neto - Desarrollador Full Stack creando experiencias digitales modernas y funcionales con React, Next.js, TypeScript y Firebase.",
  };

  const title = settings?.metaTitle
    ? getLocalizedText(settings.metaTitle, locale)
    : `${settings?.name || DEFAULT_SITE_NAME} - ${getLocalizedText(settings?.role || defaultRole, locale)}`;

  const description = settings?.metaDescription
    ? getLocalizedText(settings.metaDescription, locale)
    : getLocalizedText(settings?.bio || defaultBio, locale);

  return generateMetadata({
    title,
    description,
    url: "/",
    image: settings?.photo,
    type: "profile",
    locale,
    keywords: [
      "portfolio",
      "desenvolvedor",
      "full stack",
      "react",
      "next.js",
      "typescript",
    ],
  });
}
