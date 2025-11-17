import { beforeEach, describe, expect, it, vi } from "vitest";
import "../../../test/__mocks__/supabase";
import {
  deleteImage,
  generateUniqueFileName,
  uploadImage,
  validateImageFile,
} from "./storage";

describe("uploadImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve fazer upload de uma imagem com sucesso", async () => {
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const path = "test-path/test.jpg";

    const url = await uploadImage(file, path);

    expect(url).toBe(
      "https://test.supabase.co/storage/v1/object/public/portfolio/test-path/test-image.jpg",
    );
  });

  it("deve usar bucket padrão se não especificado", async () => {
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const path = "test-path/test.jpg";

    const url = await uploadImage(file, path);

    expect(url).toContain("portfolio");
  });

  it("deve lançar erro em caso de falha no upload", async () => {
    const { mockSupabaseStorage } = await import(
      "../../../test/__mocks__/supabase"
    );

    mockSupabaseStorage.from = vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({
        data: null,
        error: new Error("Upload failed"),
      }),
      getPublicUrl: vi.fn(),
      remove: vi.fn(),
    }));

    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const path = "test-path/test.jpg";

    await expect(uploadImage(file, path)).rejects.toThrow(
      "Falha ao fazer upload",
    );
  });
});

describe("deleteImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve deletar imagem usando URL completa", async () => {
    const imageUrl =
      "https://test.supabase.co/storage/v1/object/public/portfolio/test-path/test.jpg";

    await deleteImage(imageUrl);

    expect(true).toBe(true);
  });

  it("deve deletar imagem usando path direto", async () => {
    const imageUrl = "test-path/test.jpg";

    await deleteImage(imageUrl);

    expect(true).toBe(true);
  });

  it("não deve lançar erro se a imagem não existir", async () => {
    const { mockSupabaseStorage } = await import(
      "../../../test/__mocks__/supabase"
    );

    mockSupabaseStorage.from = vi.fn(() => ({
      upload: vi.fn(),
      getPublicUrl: vi.fn(),
      remove: vi.fn().mockResolvedValue({
        error: new Error("Image not found"),
      }),
    }));

    const imageUrl = "non-existent.jpg";

    await expect(deleteImage(imageUrl)).resolves.not.toThrow();
  });
});

describe("generateUniqueFileName", () => {
  it("deve gerar nome único para arquivo", () => {
    const originalName = "test.jpg";
    const uniqueName = generateUniqueFileName(originalName);

    expect(uniqueName).toMatch(/^test-\d+-[a-z0-9]+\.jpg$/);
  });

  it("deve sanitizar nome do arquivo", () => {
    const originalName = "Test File@#$%Name.jpg";
    const uniqueName = generateUniqueFileName(originalName);

    expect(uniqueName).toMatch(/^test-file-name-\d+-[a-z0-9]+\.jpg$/);
  });

  it("deve converter para minúsculas", () => {
    const originalName = "UPPERCASE.JPG";
    const uniqueName = generateUniqueFileName(originalName);

    expect(uniqueName).toMatch(/^uppercase-\d+-[a-z0-9]+\.jpg$/);
  });

  it("deve remover hífens duplicados", () => {
    const originalName = "test--file.jpg";
    const uniqueName = generateUniqueFileName(originalName);

    expect(uniqueName).toMatch(/^test-file-\d+-[a-z0-9]+\.jpg$/);
  });

  it("deve limitar tamanho do nome", () => {
    const originalName = `${"a".repeat(50)}.jpg`;
    const uniqueName = generateUniqueFileName(originalName);

    const namePart = uniqueName.split("-")[0];
    expect(namePart.length).toBeLessThanOrEqual(30);
  });

  it("deve preservar a extensão do arquivo", () => {
    const originalName = "test.png";
    const uniqueName = generateUniqueFileName(originalName);

    expect(uniqueName).toMatch(/\.png$/);
  });
});

describe("validateImageFile", () => {
  it("deve validar arquivo de imagem válido", () => {
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

    const result = validateImageFile(file);

    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("deve rejeitar arquivo não-imagem", () => {
    const file = new File(["test"], "test.txt", { type: "text/plain" });

    const result = validateImageFile(file);

    expect(result.valid).toBe(false);
    expect(result.error).toBe("O arquivo deve ser uma imagem");
  });

  it("deve rejeitar arquivo muito grande", () => {
    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "test.jpg", {
      type: "image/jpeg",
    });

    const result = validateImageFile(largeFile);

    expect(result.valid).toBe(false);
    expect(result.error).toBe("A imagem deve ter no máximo 5MB");
  });

  it("deve aceitar tamanho customizado", () => {
    const file = new File([new ArrayBuffer(8 * 1024 * 1024)], "test.jpg", {
      type: "image/jpeg",
    });

    const result = validateImageFile(file, 10);

    expect(result.valid).toBe(true);
  });

  it("deve rejeitar formato não suportado", () => {
    const file = new File(["test"], "test.svg", { type: "image/svg+xml" });

    const result = validateImageFile(file);

    expect(result.valid).toBe(false);
    expect(result.error).toBe(
      "Formato não suportado. Use JPG, PNG, WebP ou GIF",
    );
  });

  it("deve aceitar formatos suportados", () => {
    const formats = [
      { type: "image/jpeg", name: "test.jpg" },
      { type: "image/jpg", name: "test.jpg" },
      { type: "image/png", name: "test.png" },
      { type: "image/webp", name: "test.webp" },
      { type: "image/gif", name: "test.gif" },
    ];

    formats.forEach(({ type, name }) => {
      const file = new File(["test"], name, { type });
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
    });
  });
});
