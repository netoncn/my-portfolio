import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  type QueryDocumentSnapshot, // Added setDoc import
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "../collections";
import { db } from "../config";
import type { Technology, TechnologyFormData } from "../types";

function mapDocToTechnology(document: QueryDocumentSnapshot): Technology {
  const data = document.data() as Omit<Technology, "id">;
  return {
    id: document.id,
    ...data,
  };
}

export async function getAllTechnologies(): Promise<Technology[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.TECHNOLOGIES),
      orderBy("usageCount", "desc"),
      orderBy("name", "asc"),
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(mapDocToTechnology);
  } catch (error) {
    console.error("[v0] Error getting technologies:", error);
    return [];
  }
}

export async function getMostUsedTechnologies(
  limit = 10,
): Promise<Technology[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.TECHNOLOGIES),
      where("usageCount", ">", 0),
      orderBy("usageCount", "desc"),
      orderBy("name", "asc"),
    );

    const querySnapshot = await getDocs(q);
    const technologies = querySnapshot.docs.map(mapDocToTechnology);

    return technologies.slice(0, limit);
  } catch (error) {
    console.error("[v0] Error getting most used technologies:", error);
    return [];
  }
}

export async function getTechnologyById(
  id: string,
): Promise<Technology | null> {
  try {
    const docRef = doc(db, COLLECTIONS.TECHNOLOGIES, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return mapDocToTechnology(docSnap as QueryDocumentSnapshot);
  } catch (error) {
    console.error("[v0] Error getting technology:", error);
    return null;
  }
}

export async function createTechnology(
  data: TechnologyFormData,
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.TECHNOLOGIES), {
      ...data,
      usageCount: 0,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("[v0] Error creating technology:", error);
    throw new Error("Falha ao criar tecnologia");
  }
}

export async function updateTechnology(
  id: string,
  data: Partial<TechnologyFormData>,
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.TECHNOLOGIES, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("[v0] Error updating technology:", error);
    throw new Error("Falha ao atualizar tecnologia");
  }
}

export async function deleteTechnology(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.TECHNOLOGIES, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("[v0] Error deleting technology:", error);
    throw new Error("Falha ao deletar tecnologia");
  }
}

export async function incrementTechnologyUsage(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.TECHNOLOGIES, id);
    await setDoc(
      docRef,
      {
        usageCount: increment(1),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("[technologies] Error incrementing technology usage:", error);
  }
}

export async function decrementTechnologyUsage(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.TECHNOLOGIES, id);
    await setDoc(
      docRef,
      {
        usageCount: increment(-1),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("[technologies] Error decrementing technology usage:", error);
  }
}

export function generateTechnologySlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
