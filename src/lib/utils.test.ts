import { describe, expect, it } from "vitest";
import { cn, generateSlug } from "./utils";

describe("cn", () => {
  it("deve mesclar classes do Tailwind corretamente", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });

  it("deve lidar com classes condicionais", () => {
    const result = cn("px-2", false && "py-1", "text-red-500");
    expect(result).toBe("px-2 text-red-500");
  });

  it("deve lidar com objetos de classes", () => {
    const result = cn("px-2", { "py-1": true, "text-blue-500": false });
    expect(result).toBe("px-2 py-1");
  });

  it("deve lidar com arrays de classes", () => {
    const result = cn(["px-2", "py-1"], "text-red-500");
    expect(result).toBe("px-2 py-1 text-red-500");
  });

  it("deve retornar string vazia para entrada vazia", () => {
    const result = cn();
    expect(result).toBe("");
  });
});

describe("generateSlug", () => {
  it("deve converter texto para slug", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("deve remover acentos", () => {
    expect(generateSlug("Olá Mundo")).toBe("ola-mundo");
    expect(generateSlug("José García")).toBe("jose-garcia");
    expect(generateSlug("Ação Reação")).toBe("acao-reacao");
  });

  it("deve remover caracteres especiais", () => {
    expect(generateSlug("Hello@World!")).toBe("helloworld");
    expect(generateSlug("Test#123$456")).toBe("test123456");
  });

  it("deve substituir espaços por hífens", () => {
    expect(generateSlug("Multiple   Spaces")).toBe("multiple-spaces");
    expect(generateSlug("  Leading and trailing  ")).toBe(
      "leading-and-trailing",
    );
  });

  it("deve remover hífens duplicados", () => {
    expect(generateSlug("Hello--World")).toBe("hello-world");
    expect(generateSlug("Test---Slug")).toBe("test-slug");
  });

  it("deve lidar com texto vazio", () => {
    expect(generateSlug("")).toBe("");
  });

  it("deve lidar com apenas caracteres especiais", () => {
    expect(generateSlug("@#$%")).toBe("");
  });

  it("deve lidar com números", () => {
    expect(generateSlug("Test 123")).toBe("test-123");
    expect(generateSlug("2023 Update")).toBe("2023-update");
  });

  it("deve converter para minúsculas", () => {
    expect(generateSlug("HELLO WORLD")).toBe("hello-world");
    expect(generateSlug("MiXeD CaSe")).toBe("mixed-case");
  });

  it("deve lidar com caracteres Unicode", () => {
    expect(generateSlug("Привет мир")).toBe("");
    expect(generateSlug("你好世界")).toBe("");
  });
});
