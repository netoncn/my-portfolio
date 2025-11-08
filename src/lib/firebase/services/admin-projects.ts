import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  type QueryConstraint,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "../collections";
import { db } from "../config";
import type { Project, ProjectFormData, ProjectStatus } from "../types";
import {
  decrementTechnologyUsage,
  incrementTechnologyUsage,
} from "./technologies";

type ProjectFirestoreData = Omit<Project, "id" | "createdAt" | "updatedAt"> & {
  createdAt?: Timestamp | string | null;
  updatedAt?: Timestamp | string | null;
};

export async function getAllProjects(
  status?: ProjectStatus,
): Promise<Project[]> {
  try {
    const constraints: QueryConstraint[] = [
      orderBy("order", "asc"),
      orderBy("createdAt", "desc"),
    ];

    if (typeof status !== "undefined") {
      constraints.push(where("status", "==", status));
    }

    const q = query(collection(db, COLLECTIONS.PROJECTS), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((snap) => {
      const data = snap.data() as ProjectFirestoreData;

      const createdAt =
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : null;

      const updatedAt =
        data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate().toISOString()
          : null;

      const { createdAt: _c, updatedAt: _u, ...rest } = data;

      return {
        id: snap.id,
        ...rest,
        createdAt: createdAt as unknown as Timestamp,
        updatedAt: updatedAt as unknown as Timestamp,
      } as Project;
    });
  } catch (error) {
    console.error("[v0] Error getting all projects:", error);
    throw new Error("Falha ao buscar projetos");
  }
}

export async function createProject(data: ProjectFormData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    if (data.technologies && data.technologies.length > 0) {
      await Promise.all(
        data.technologies.map((tech) => incrementTechnologyUsage(tech)),
      );
    }

    return docRef.id;
  } catch (error) {
    console.error("[v0] Error creating project:", error);
    throw new Error("Falha ao criar projeto");
  }
}

export async function updateProject(
  id: string,
  data: Partial<ProjectFormData>,
): Promise<void> {
  try {
    const oldProject = await getProjectByIdAdmin(id);

    const sanitizedData: Partial<ProjectFormData> = { ...data };
    if (data.githubUrl === null || data.githubUrl === undefined) {
      sanitizedData.githubUrl = "";
    }
    if (data.liveUrl === null || data.liveUrl === undefined) {
      sanitizedData.liveUrl = "";
    }

    const docRef = doc(db, COLLECTIONS.PROJECTS, id);
    await updateDoc(docRef, {
      ...sanitizedData,
      updatedAt: serverTimestamp(),
    });

    if (data.technologies && oldProject) {
      const oldTechs = oldProject.technologies || [];
      const newTechs = data.technologies;

      const removedTechs = oldTechs.filter((tech) => !newTechs.includes(tech));
      await Promise.all(
        removedTechs.map((tech) => decrementTechnologyUsage(tech)),
      );

      const addedTechs = newTechs.filter((tech) => !oldTechs.includes(tech));
      await Promise.all(
        addedTechs.map((tech) => incrementTechnologyUsage(tech)),
      );
    }
  } catch (error) {
    console.error("[v0] Error updating project:", error);
    throw new Error("Falha ao atualizar projeto");
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const project = await getProjectByIdAdmin(id);

    const docRef = doc(db, COLLECTIONS.PROJECTS, id);
    await deleteDoc(docRef);

    if (project?.technologies && project.technologies.length > 0) {
      await Promise.all(
        project.technologies.map((tech) => decrementTechnologyUsage(tech)),
      );
    }
  } catch (error) {
    console.error("[v0] Error deleting project:", error);
    throw new Error("Falha ao deletar projeto");
  }
}

export async function getProjectByIdAdmin(id: string): Promise<Project | null> {
  try {
    const docRef = doc(db, COLLECTIONS.PROJECTS, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data() as ProjectFirestoreData;

    const createdAt =
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : null;

    const updatedAt =
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate().toISOString()
        : null;

    const { createdAt: _c, updatedAt: _u, ...rest } = data;

    return {
      id: docSnap.id,
      ...rest,
      createdAt: createdAt as unknown as Timestamp,
      updatedAt: updatedAt as unknown as Timestamp,
    } as Project;
  } catch (error) {
    console.error("[v0] Error getting project by ID:", error);
    throw new Error("Falha ao buscar projeto");
  }
}

export { getProjectByIdAdmin as getProjectById };

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
}
