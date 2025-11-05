import { z } from "zod"

export const multilingualTextSchema = z.object({
  "en-US": z.string().min(1, "English text is required"),
  "pt-BR": z.string().min(1, "Portuguese text is required"),
  "es-ES": z.string().min(1, "Spanish text is required"),
})

export const projectCategorySchema = z.enum(["web", "mobile", "desktop", "api", "library", "other"])

export const projectStatusSchema = z.enum(["draft", "published", "archived"])

export const projectFormSchema = z.object({
  title: multilingualTextSchema,
  slug: z
    .string()
    .min(3, "Slug deve ter no mínimo 3 caracteres")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
  shortDescription: multilingualTextSchema,
  longDescription: multilingualTextSchema,
  category: projectCategorySchema,
  status: projectStatusSchema,
  technologies: z.array(z.string()).min(1, "Adicione pelo menos uma tecnologia"),
  githubUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  liveUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  hasSourceCode: z.boolean().default(true),
  thumbnailUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  images: z.array(z.string().url()).optional(),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  metaTitle: multilingualTextSchema.optional(),
  metaDescription: multilingualTextSchema.optional(),
})

export const technologyFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(50),
  slug: z
    .string()
    .min(2, "Slug deve ter no mínimo 2 caracteres")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
  category: z.string().optional(),
  icon: z.string().optional(),
})

export const portfolioSettingsSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  photo: z.string().url("URL inválida").optional().or(z.literal("")),
  bio: multilingualTextSchema,
  role: multilingualTextSchema,
  email: z.string().email("Email inválido"),
  github: z.string().url("URL inválida"),
  linkedin: z.string().url("URL inválida"),
  customLinks: z
    .array(
      z.object({
        url: z.string().url("URL inválida"),
        label: multilingualTextSchema,
      }),
    )
    .optional(),
  metaTitle: multilingualTextSchema.optional(),
  metaDescription: multilingualTextSchema.optional(),
})

export type ProjectFormInput = z.infer<typeof projectFormSchema>
export type TechnologyFormInput = z.infer<typeof technologyFormSchema>
export type PortfolioSettingsInput = z.infer<typeof portfolioSettingsSchema>
