import { collection, type CollectionReference, type DocumentData } from "firebase/firestore"
import { db } from "./config"
import type { Project, Technology, PortfolioSettings } from "./types"

export const projectsCollection = collection(db, "projects") as CollectionReference<Project, DocumentData>

export const technologiesCollection = collection(db, "technologies") as CollectionReference<Technology, DocumentData>

export const settingsCollection = collection(db, "settings") as CollectionReference<PortfolioSettings, DocumentData>

export const COLLECTIONS = {
  PROJECTS: "projects",
  TECHNOLOGIES: "technologies",
  SETTINGS: "settings",
} as const
