import { supabase } from "./config";

export async function uploadImage(
  file: File,
  path: string,
  bucket: string = "portfolio",
): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("[Storage] Upload error:", error);
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error("[Storage] Error uploading image:", error);
    console.error("[Storage] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error(
      error instanceof Error
        ? `Falha ao fazer upload: ${error.message}`
        : "Falha ao fazer upload da imagem",
    );
  }
}

export async function deleteImage(
  imageUrl: string,
  bucket: string = "portfolio",
): Promise<void> {
  try {
    let path: string;

    if (imageUrl.includes("/storage/v1/object/public/")) {
      const urlParts = imageUrl.split(`/storage/v1/object/public/${bucket}/`);
      if (urlParts.length > 1) {
        path = urlParts[1];
      } else {
        throw new Error("URL inválida do Supabase Storage");
      }
    } else {
      path = imageUrl;
    }

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error("[Storage] Error deleting image:", error);
    }
  } catch (error) {
    console.error("[Storage] Error deleting image:", error);
  }
}

export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 9);
  const extension = originalName.split(".").pop()?.toLowerCase() || "";
  const nameWithoutExt = originalName.replace(
    `.${originalName.split(".").pop()}`,
    "",
  );

  const sanitizedName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 30);

  return `${sanitizedName}-${timestamp}-${randomSuffix}.${extension}`;
}

export function validateImageFile(
  file: File,
  maxSizeMB: number = 5,
): { valid: boolean; error?: string } {
  if (!file.type.startsWith("image/")) {
    return {
      valid: false,
      error: "O arquivo deve ser uma imagem",
    };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `A imagem deve ter no máximo ${maxSizeMB}MB`,
    };
  }

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Formato não suportado. Use JPG, PNG, WebP ou GIF",
    };
  }

  return { valid: true };
}
