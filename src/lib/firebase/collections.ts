import { collection, type CollectionReference, type DocumentData } from "firebase/firestore"
import { db } from "./config"
import type { Project } from "./types"

export const projectsCollection = collection(db, "projects") as CollectionReference<Project, DocumentData>

export const COLLECTIONS = {
  PROJECTS: "projects",
} as const
