import { z } from "zod"

export const projectCategorySchema = z.enum(["web", "mobile", "desktop", "api", "library", "other"])

export const projectStatusSchema = z.enum(["draft", "published", "archived"])

export const projectFormSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres").max(100),
  slug: z
    .string()
    .min(3, "Slug deve ter no mínimo 3 caracteres")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres").max(500),
  longDescription: z.string().optional(),
  category: projectCategorySchema,
  status: projectStatusSchema,
  technologies: z.array(z.string()).min(1, "Adicione pelo menos uma tecnologia"),
  githubUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  liveUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  thumbnailUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  images: z.array(z.string().url()).optional(),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
})

export type ProjectFormInput = z.infer<typeof projectFormSchema>
