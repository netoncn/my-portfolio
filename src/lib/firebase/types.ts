import type { Timestamp } from "firebase/firestore"

export type ProjectStatus = "draft" | "published" | "archived"

export type ProjectCategory = "web" | "mobile" | "desktop" | "api" | "library" | "other"

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  longDescription?: string
  category: ProjectCategory
  status: ProjectStatus

  technologies: string[]
  githubUrl?: string
  liveUrl?: string

  thumbnailUrl?: string
  images?: string[]

  featured: boolean
  order: number
  createdAt: Timestamp
  updatedAt: Timestamp

  metaTitle?: string
  metaDescription?: string
}

export type ProjectData = Omit<Project, "id">

export interface ProjectFormData {
  title: string
  slug: string
  description: string
  longDescription?: string
  category: ProjectCategory
  status: ProjectStatus
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  thumbnailUrl?: string | null | undefined
  images?: string[] | null | undefined
  featured: boolean
  order: number
  metaTitle?: string
  metaDescription?: string
}

export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
}
