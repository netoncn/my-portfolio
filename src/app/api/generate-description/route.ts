import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface GenerateDescriptionRequest {
  title: string
  category: string
  technologies: string[]
  type: "short" | "long",
  previousText?: string | undefined
  githubUrl?: string | undefined
}

export async function POST(req: Request) {
  try {
    const { title, category, technologies, type, previousText, githubUrl }: GenerateDescriptionRequest = await req.json()

    if (!title || !category || !technologies || !type) {
      return Response.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    const prompt =
      type === "short"
        ? `Escreva uma descrição curta e impactante (2-3 frases) para um projeto de portfólio chamado "${title}".
         Uma possível descrição anterior é: ${previousText ? `"${previousText}"` : "Nenhuma descrição anterior fornecida."}
         
         Categoria: ${category}
         Tecnologias: ${technologies.join(", ")}
         
         A descrição deve:
         - Ser concisa e profissional
         - Destacar o propósito do projeto
         - Mencionar as principais tecnologias
         - Estar em português brasileiro
         - Ter no máximo 150 caracteres`
        : `Escreva uma descrição detalhada (3-4 parágrafos) para um projeto de portfólio chamado "${title}".
          Uma possível descrição anterior é: ${previousText ? `"${previousText}"` : "Nenhuma descrição anterior fornecida."}
          Se o projeto tiver um repositório GitHub, considere acessa-lo e analisá-lo para maior contexto: ${githubUrl ? githubUrl : "Nenhum repositório GitHub fornecido."}
         
         Categoria: ${category}
         Tecnologias: ${technologies.join(", ")}
         
         A descrição deve incluir:
         - Visão geral do projeto e seu propósito
         - Principais funcionalidades e características
         - Tecnologias utilizadas e por que foram escolhidas
         - Desafios técnicos superados ou aprendizados
         - Estar em português brasileiro
         - Ser profissional mas acessível`

    const { text } = await generateText({
      model: openai("gpt-4.1"),
      prompt,
      temperature: 0.7,
    })

    return Response.json({ description: text.trim() })
  } catch (error) {
    console.error("[v0] Generate description error:", error)
    return Response.json({ error: "Erro ao gerar descrição" }, { status: 500 })
  }
}
