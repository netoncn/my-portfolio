import type { Timestamp } from "firebase/firestore";

export type Locale = "en-US" | "pt-BR" | "es-ES";

export interface MultilingualText {
  "en-US": string;
  "pt-BR": string;
  "es-ES": string;
}

export type ProjectStatus = "draft" | "published" | "archived";

export type ProjectCategory =
  | "web"
  | "mobile"
  | "desktop"
  | "api"
  | "library"
  | "other";

export interface Project {
  id: string;
  title: MultilingualText;
  slug: string;
  shortDescription: MultilingualText;
  longDescription: MultilingualText;
  category: ProjectCategory;
  status: ProjectStatus;

  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  hasSourceCode: boolean;

  thumbnailUrl?: string;
  images?: string[];

  featured: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  metaTitle?: MultilingualText;
  metaDescription?: MultilingualText;
}

export interface Technology {
  id: string;
  name: string;
  slug: string;
  category?: string;
  icon?: string;
  usageCount: number;
  createdAt: Timestamp;
}

export interface PortfolioSettings {
  id: string;

  name: string;
  photo?: string;
  bio: MultilingualText;
  role: MultilingualText;

  email: string;
  github: string;
  linkedin: string;

  customLinks?: {
    url: string;
    label: MultilingualText;
  }[];

  metaTitle?: MultilingualText;
  metaDescription?: MultilingualText;

  createdAt?: string | null;
  updatedAt?: string | null;
}

export type ProjectData = Omit<Project, "id">;
export type TechnologyData = Omit<Technology, "id">;
export type PortfolioSettingsData = Omit<PortfolioSettings, "id">;

export interface ProjectFormData {
  title: MultilingualText;
  slug: string;
  shortDescription: MultilingualText;
  longDescription: MultilingualText;
  category: ProjectCategory;
  status: ProjectStatus;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  hasSourceCode: boolean;
  thumbnailUrl?: string;
  images?: string[];
  featured: boolean;
  order: number;
  metaTitle?: MultilingualText;
  metaDescription?: MultilingualText;
}

export interface TechnologyFormData {
  name: string;
  slug: string;
  category?: string;
  icon?: string;
}

export interface PortfolioSettingsInput {
  name: string;
  photo?: string;
  bio: MultilingualText;
  role: MultilingualText;
  email: string;
  github: string | null | undefined;
  linkedin: string | null | undefined;
  customLinks?: {
    url: string;
    label: MultilingualText;
  }[];
  metaTitle?: MultilingualText;
  metaDescription?: MultilingualText;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}
