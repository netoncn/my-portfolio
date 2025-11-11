import { COLLECTIONS } from "../collections";
import { adminDb } from "../admin";
import type { Project, ProjectFormData, ProjectStatus } from "../types";
import {
  decrementTechnologyUsage,
  incrementTechnologyUsage,
} from "./technologies";

import { FieldValue, Timestamp } from "firebase-admin/firestore";

type ProjectFirestoreData = Omit<Project, "id" | "createdAt" | "updatedAt"> & {
  createdAt?: any;
  updatedAt?: any;
};

export async function getAllProjects(
  status?: ProjectStatus,
): Promise<Project[]> {
  try {
    let query = adminDb
      .collection(COLLECTIONS.PROJECTS)
      .orderBy("order", "asc")
      .orderBy("createdAt", "desc");

    if (typeof status !== "undefined") {
      query = query.where("status", "==", status) as any;
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => {
      const data = doc.data() as ProjectFirestoreData;

      const createdAt = data.createdAt?.toDate?.()?.toISOString() ?? null;
      const updatedAt = data.updatedAt?.toDate?.()?.toISOString() ?? null;

      const { createdAt: _c, updatedAt: _u, ...rest } = data;

      return {
        id: doc.id,
        ...rest,
        createdAt: createdAt as any,
        updatedAt: updatedAt as any,
      } as Project;
    });
  } catch (error) {
    console.error("[admin] Error getting all projects:", error);
    throw new Error("Falha ao buscar projetos");
  }
}

export async function createProject(data: ProjectFormData): Promise<string> {
  try {
    const docRef = await adminDb.collection(COLLECTIONS.PROJECTS).add({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    if (data.technologies && data.technologies.length > 0) {
      await Promise.all(
        data.technologies.map((tech) => incrementTechnologyUsage(tech)),
      );
    }

    return docRef.id;
  } catch (error) {
    console.error("[admin] Error creating project:", error);
    throw new Error("Falha ao criar projeto");
  }
}

export async function updateProject(
  id: string,
  data: Partial<ProjectFormData>,
): Promise<void> {
  try {
    const oldProject = await getProjectByIdAdmin(id);

    const sanitizedData: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined) {
        sanitizedData[key] = value;
      } else {
        if (key === "githubUrl" || key === "liveUrl" || key === "thumbnailUrl") {
          sanitizedData[key] = "";
        }
      }
    }

    const docRef = adminDb.collection(COLLECTIONS.PROJECTS).doc(id);
    
    await docRef.update({
      ...sanitizedData,
      updatedAt: FieldValue.serverTimestamp(),
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
    console.error("[admin] Error updating project:", error);
    throw new Error("Falha ao atualizar projeto");
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const project = await getProjectByIdAdmin(id);

    const docRef = adminDb.collection(COLLECTIONS.PROJECTS).doc(id);
    await docRef.delete();

    if (project?.technologies && project.technologies.length > 0) {
      await Promise.all(
        project.technologies.map((tech) => decrementTechnologyUsage(tech)),
      );
    }
  } catch (error) {
    console.error("[admin] Error deleting project:", error);
    throw new Error("Falha ao deletar projeto");
  }
}

export async function getProjectByIdAdmin(id: string): Promise<Project | null> {
  try {
    const docRef = adminDb.collection(COLLECTIONS.PROJECTS).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null;
    }

    const data = docSnap.data() as ProjectFirestoreData;

    const createdAt = data.createdAt?.toDate?.()?.toISOString() ?? null;
    const updatedAt = data.updatedAt?.toDate?.()?.toISOString() ?? null;

    const { createdAt: _c, updatedAt: _u, ...rest } = data;

    return {
      id: docSnap.id,
      ...rest,
      createdAt: createdAt as any,
      updatedAt: updatedAt as any,
    } as Project;
  } catch (error) {
    console.error("[admin] Error getting project by ID:", error);
    throw new Error("Falha ao buscar projeto");
  }
}

export { getProjectByIdAdmin as getProjectById };