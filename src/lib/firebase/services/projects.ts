import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
  limit,
  type QueryConstraint,
  Timestamp,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore"
import { db } from "../config"
import type { Project, ProjectCategory } from "../types"
import { COLLECTIONS } from "../collections"

function serializeProject(document: QueryDocumentSnapshot<DocumentData>): Project {
  const data = document.data() as any

  const createdAt =
    data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : data.createdAt ?? null

  const updatedAt =
    data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : data.updatedAt ?? null

  return {
    id: document.id,
    ...data,
    createdAt,
    updatedAt,
  } as Project
}

export async function getPublishedProjects(
  category?: ProjectCategory,
  limitCount?: number,
): Promise<Project[]> {
  try {
    const constraints: QueryConstraint[] = [
      where("status", "==", "published"),
      orderBy("order", "asc"),
      orderBy("createdAt", "desc"),
    ]

    if (category) {
      constraints.push(where("category", "==", category))
    }

    if (typeof limitCount === "number") {
      constraints.push(limit(limitCount))
    }

    const q = query(collection(db, COLLECTIONS.PROJECTS), ...constraints)
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(serializeProject)
  } catch (error) {
    console.error("[v0] Error getting published projects:", error)
    return []
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.PROJECTS),
      where("status", "==", "published"),
      where("featured", "==", true),
      orderBy("order", "asc"),
      limit(6),
    )

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(serializeProject)
  } catch (error) {
    console.error("[v0] Error getting featured projects:", error)
    return []
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const q = query(
      collection(db, COLLECTIONS.PROJECTS),
      where("slug", "==", slug),
      where("status", "==", "published"),
      limit(1),
    )

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const document = querySnapshot.docs[0]
    return serializeProject(document)
  } catch (error) {
    console.error("[v0] Error getting project by slug:", error)
    return null
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const docRef = doc(db, COLLECTIONS.PROJECTS, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    const data = docSnap.data() as any

    const createdAt =
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt ?? null

    const updatedAt =
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate().toISOString()
        : data.updatedAt ?? null

    return {
      id: docSnap.id,
      ...data,
      createdAt,
      updatedAt,
    } as Project
  } catch (error) {
    console.error("[v0] Error getting project by ID:", error)
    return null
  }
}

export async function getAllProjectSlugs(): Promise<string[]> {
  try {
    const q = query(collection(db, COLLECTIONS.PROJECTS), where("status", "==", "published"))

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((document) => {
      const data = document.data() as any
      return data.slug as string
    })
  } catch (error) {
    console.error("[v0] Error getting project slugs:", error)
    return []
  }
}
