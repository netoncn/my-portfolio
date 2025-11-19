import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface GenerateDescriptionRequest {
  title: string;
  category: string;
  technologies: string[];
  type: "short" | "long";
  previousText?: {
    "pt-BR"?: string;
    "en-US"?: string;
    "es-ES"?: string;
  };
  githubUrl?: string | undefined;
}

interface MultilingualDescription {
  "pt-BR": string;
  "en-US": string;
  "es-ES": string;
}

export async function POST(req: Request) {
  try {
    const {
      title,
      category,
      technologies,
      type,
      previousText,
      githubUrl,
    }: GenerateDescriptionRequest = await req.json();

    if (!title || !category || !technologies || !type) {
      return Response.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 },
      );
    }

    const [ptBR, enUS, esES] = await Promise.all([
      generateText({
        model: openai("gpt-4.1"),
        prompt:
          type === "short"
            ? `Escreva uma descrição curta e impactante (2-3 frases) para um projeto de portfólio chamado "${title}".
               ${previousText?.["pt-BR"] ? `Uma possível descrição anterior é: "${previousText["pt-BR"]}"` : "Nenhuma descrição anterior fornecida."}

               Categoria: ${category}
               Tecnologias: ${technologies.join(", ")}

               A descrição deve:
               - Ser concisa e profissional
               - Destacar o propósito do projeto
               - Mencionar as principais tecnologias
               - Estar em português brasileiro
               - Ter no máximo 150 caracteres`
            : `Escreva uma descrição detalhada (3-4 parágrafos) para um projeto de portfólio chamado "${title}".
               ${previousText?.["pt-BR"] ? `Uma possível descrição anterior é: "${previousText["pt-BR"]}"` : "Nenhuma descrição anterior fornecida."}
               ${githubUrl ? `Se o projeto tiver um repositório GitHub, considere acessá-lo e analisá-lo para maior contexto: ${githubUrl}` : "Nenhum repositório GitHub fornecido."}

               Categoria: ${category}
               Tecnologias: ${technologies.join(", ")}

               A descrição deve incluir:
               - Visão geral do projeto e seu propósito
               - Principais funcionalidades e características
               - Tecnologias utilizadas e por que foram escolhidas
               - Desafios técnicos superados ou aprendizados
               - Estar em português brasileiro
               - Ser profissional mas acessível`,
        temperature: 0.7,
      }),

      generateText({
        model: openai("gpt-4.1"),
        prompt:
          type === "short"
            ? `Write a short and impactful description (2-3 sentences) for a portfolio project called "${title}".
               ${previousText?.["en-US"] ? `A possible previous description is: "${previousText["en-US"]}"` : "No previous description provided."}

               Category: ${category}
               Technologies: ${technologies.join(", ")}

               The description should:
               - Be concise and professional
               - Highlight the project's purpose
               - Mention the main technologies
               - Be in English
               - Have a maximum of 150 characters`
            : `Write a detailed description (3-4 paragraphs) for a portfolio project called "${title}".
               ${previousText?.["en-US"] ? `A possible previous description is: "${previousText["en-US"]}"` : "No previous description provided."}
               ${githubUrl ? `If the project has a GitHub repository, consider accessing and analyzing it for more context: ${githubUrl}` : "No GitHub repository provided."}

               Category: ${category}
               Technologies: ${technologies.join(", ")}

               The description should include:
               - Project overview and its purpose
               - Main features and characteristics
               - Technologies used and why they were chosen
               - Technical challenges overcome or learnings
               - Be in English
               - Be professional but accessible`,
        temperature: 0.7,
      }),

      generateText({
        model: openai("gpt-4.1"),
        prompt:
          type === "short"
            ? `Escribe una descripción corta e impactante (2-3 frases) para un proyecto de portafolio llamado "${title}".
               ${previousText?.["es-ES"] ? `Una posible descripción anterior es: "${previousText["es-ES"]}"` : "Ninguna descripción anterior proporcionada."}

               Categoría: ${category}
               Tecnologías: ${technologies.join(", ")}

               La descripción debe:
               - Ser concisa y profesional
               - Destacar el propósito del proyecto
               - Mencionar las principales tecnologías
               - Estar en español
               - Tener un máximo de 150 caracteres`
            : `Escribe una descripción detallada (3-4 párrafos) para un proyecto de portafolio llamado "${title}".
               ${previousText?.["es-ES"] ? `Una posible descripción anterior es: "${previousText["es-ES"]}"` : "Ninguna descripción anterior proporcionada."}
               ${githubUrl ? `Si el proyecto tiene un repositorio de GitHub, considera acceder y analizarlo para más contexto: ${githubUrl}` : "Ningún repositorio de GitHub proporcionado."}

               Categoría: ${category}
               Tecnologías: ${technologies.join(", ")}

               La descripción debe incluir:
               - Visión general del proyecto y su propósito
               - Principales funcionalidades y características
               - Tecnologías utilizadas y por qué fueron elegidas
               - Desafíos técnicos superados o aprendizajes
               - Estar en español
               - Ser profesional pero accesible`,
        temperature: 0.7,
      }),
    ]);

    const descriptions: MultilingualDescription = {
      "pt-BR": ptBR.text.trim(),
      "en-US": enUS.text.trim(),
      "es-ES": esES.text.trim(),
    };

    return Response.json({ descriptions });
  } catch (error) {
    console.error("[v0] Generate description error:", error);
    return Response.json({ error: "Erro ao gerar descrição" }, { status: 500 });
  }
}
