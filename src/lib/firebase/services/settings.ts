import {
  getDoc,
  setDoc,
  doc,
  serverTimestamp,
  type QueryDocumentSnapshot,
} from "firebase/firestore"
import { db } from "../config"
import type { PortfolioSettings, PortfolioSettingsInput } from "../types"
import { COLLECTIONS } from "../collections"
import { serializeTimestamp } from "../serializers"

const SETTINGS_DOC_ID = "main"
const settingsDocRef = doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID)

function mapDocToSettings(
  snapshot: QueryDocumentSnapshot,
): PortfolioSettings {
  const data = snapshot.data() as Omit<PortfolioSettings, "id">
  return {
    id: snapshot.id,
    ...data,
    createdAt: serializeTimestamp(snapshot.data().createdAt),
    updatedAt: serializeTimestamp(snapshot.data().updatedAt),
  }
}

export async function getPortfolioSettings(): Promise<PortfolioSettings | null> {
  try {
    const docSnap = await getDoc(settingsDocRef)

    if (!docSnap.exists()) {
      return null
    }

    return mapDocToSettings(docSnap as QueryDocumentSnapshot)
  } catch (error) {
    console.error("[settings] Error getting portfolio settings:", error)
    return null
  }
}

export const getSettings = getPortfolioSettings

export async function updatePortfolioSettings(
  data: PortfolioSettingsInput,
): Promise<void> {
  try {
    await setDoc(
      settingsDocRef,
      {
        ...data,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true },
    )
  } catch (error) {
    console.error("[settings] Error updating portfolio settings:", error)
    throw new Error("Falha ao atualizar configurações")
  }
}

export async function initializeDefaultSettings(): Promise<void> {
  try {
    const settings = await getPortfolioSettings()

    if (settings) return

    const defaultSettings: PortfolioSettingsInput = {
      name: "Nelson Christovam Neto",
      bio: {
        "en-US": "Full Stack Developer creating modern and functional digital experiences.",
        "pt-BR": "Desenvolvedor Full Stack criando experiências digitais modernas e funcionais.",
        "es-ES": "Desarrollador Full Stack creando experiencias digitales modernas y funcionales.",
      },
      role: {
        "en-US": "Full Stack Developer",
        "pt-BR": "Desenvolvedor Full Stack",
        "es-ES": "Desarrollador Full Stack",
      },
      email: "contact@example.com",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    }

    await updatePortfolioSettings(defaultSettings)
  } catch (error) {
    console.error("[settings] Error initializing default settings:", error)
  }
}
