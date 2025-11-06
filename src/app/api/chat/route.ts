import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getPublishedProjects } from "@/lib/firebase/services/projects";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `Você é um assistente virtual do portfólio de Neton, um desenvolvedor Full Stack.

Seu papel é ajudar visitantes a conhecer melhor o trabalho e as habilidades do desenvolvedor.

Diretrizes:
- Seja amigável, profissional e conciso
- Responda em português brasileiro
- Foque nos projetos e habilidades técnicas
- Se não souber algo específico, seja honesto
- Incentive os visitantes a explorar os projetos
- Não invente informações que não estão nos dados dos projetos

Quando perguntado sobre projetos, use as informações fornecidas no contexto.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Get published projects for context
    const projects = await getPublishedProjects();

    const projectsContext = projects.map((p) => ({
      title: p.title,
      description: p.shortDescription,
      category: p.category,
      technologies: p.technologies,
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
    }));

    const contextMessage = `
Projetos disponíveis no portfólio:
${JSON.stringify(projectsContext, null, 2)}

Total de projetos: ${projects.length}
Categorias: ${[...new Set(projects.map((p) => p.category))].join(", ")}
Tecnologias principais: ${[...new Set(projects.flatMap((p) => p.technologies))].slice(0, 10).join(", ")}
`;

    const result = streamText({
      model: openai("gpt-4.1"),
      system: SYSTEM_PROMPT + "\n\n" + contextMessage,
      messages,
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[v0] Chat API error:", error);
    return new Response("Erro ao processar mensagem", { status: 500 });
  }
}
