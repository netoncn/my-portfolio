"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface AIDescriptionGeneratorProps {
  title: string
  category: string
  technologies: string[]
  type: "short" | "long"
  text?: string | undefined
  githubUrl?: string | undefined
  onGenerated: (description: string) => void
}

export function AIDescriptionGenerator({
  title,
  category,
  technologies,
  type,
  text,
  githubUrl,
  onGenerated,
}: AIDescriptionGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error("Título necessário", {
        description: "Preencha o título do projeto primeiro",
      })
      return
    }

    if (technologies.length === 0) {
      toast.error("Tecnologias necessárias", {
        description: "Adicione pelo menos uma tecnologia",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, technologies, type, text, githubUrl }),
      })

      if (!response.ok) {
        throw new Error("Falha ao gerar descrição")
      }

      const { description } = await response.json()
      onGenerated(description)

      toast.success("Descrição gerada", {
        description: "A IA criou uma descrição para você",
      })
    } catch (error) {
      toast.error("Erro ao gerar", {
        description: error instanceof Error ? error.message : "Erro desconhecido",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleGenerate} disabled={isGenerating}>
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Gerando...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Gerar com IA
        </>
      )}
    </Button>
  )
}
