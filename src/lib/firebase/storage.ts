import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "./config";

export async function uploadImage(
  file: File,
  path: string,
): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("[Storage] Error uploading image:", error);
    throw new Error("Falha ao fazer upload da imagem");
  }
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const pathMatch = url.match(/\/o\/(.+?)\?/);
    if (!pathMatch) return;

    const path = decodeURIComponent(pathMatch[1]);
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("[Storage] Error deleting image:", error);
  }
}