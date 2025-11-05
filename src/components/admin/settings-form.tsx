"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { getPortfolioSettings, updatePortfolioSettings } from "@/lib/firebase/services/settings"
import type { PortfolioSettingsInput, MultilingualText } from "@/lib/firebase/types"

const LANGUAGES = [
  { code: "pt-BR", label: "Português" },
  { code: "en-US", label: "English" },
  { code: "es-ES", label: "Español" },
] as const

export function SettingsForm() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [photoUrl, setPhotoUrl] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [github, setGithub] = useState("")
  const [linkedin, setLinkedin] = useState("")

  const [bio, setBio] = useState<MultilingualText>({
    "en-US": "",
    "pt-BR": "",
    "es-ES": "",
  })

  const [role, setRole] = useState<MultilingualText>({
    "en-US": "",
    "pt-BR": "",
    "es-ES": "",
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const settings = await getPortfolioSettings()

      if (settings) {
        setPhotoUrl(settings.photo || "")
        setName(settings.name || "")
        setEmail(settings.email || "")
        setGithub(settings.github || "")
        setLinkedin(settings.linkedin || "")
        setBio(settings.bio)
        setRole(settings.role)
      }
    } catch (error) {
      toast.error("Erro ao carregar configurações")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // TODO: Implement actual file upload to Firebase Storage or Vercel Blob
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
      toast.info("Upload de imagem será implementado com Firebase Storage")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!name || !email) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    // Validate multilingual fields
    const bioEmpty = Object.values(bio).some((v) => !v.trim())
    const roleEmpty = Object.values(role).some((v) => !v.trim())

    if (bioEmpty || roleEmpty) {
      toast.error("Preencha a bio e cargo em todos os idiomas")
      return
    }

    try {
      setSaving(true)

      const data: PortfolioSettingsInput = {
        photo: photoUrl || undefined,
        name,
        email,
        github: github,
        linkedin: linkedin,
        bio,
        role,
      }

      await updatePortfolioSettings(data)
      toast.success("Configurações salvas com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar configurações")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Foto de Perfil</CardTitle>
          <CardDescription>Sua foto será exibida no hero section</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            {photoUrl ? (
              <div className="relative">
                <img
                  src={photoUrl || "/placeholder.svg"}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={() => setPhotoUrl("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div>
              <Input type="file" accept="image/*" onChange={handlePhotoUpload} className="max-w-xs" />
              <p className="text-sm text-muted-foreground mt-2">Recomendado: 400x400px, formato JPG ou PNG</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email de Contato *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Multilingual Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Cargo / Título</CardTitle>
          <CardDescription>Seu cargo ou título profissional em cada idioma</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pt-BR">
            <TabsList className="grid w-full grid-cols-3">
              {LANGUAGES.map((lang) => (
                <TabsTrigger key={lang.code} value={lang.code}>
                  {lang.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {LANGUAGES.map((lang) => (
              <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                <div>
                  <Label htmlFor={`role-${lang.code}`}>Cargo ({lang.label}) *</Label>
                  <Input
                    id={`role-${lang.code}`}
                    value={role[lang.code]}
                    onChange={(e) => setRole({ ...role, [lang.code]: e.target.value })}
                    placeholder="Ex: Desenvolvedor Full Stack"
                    required
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bio / Descrição</CardTitle>
          <CardDescription>Uma breve descrição sobre você em cada idioma</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pt-BR">
            <TabsList className="grid w-full grid-cols-3">
              {LANGUAGES.map((lang) => (
                <TabsTrigger key={lang.code} value={lang.code}>
                  {lang.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {LANGUAGES.map((lang) => (
              <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                <div>
                  <Label htmlFor={`bio-${lang.code}`}>Bio ({lang.label}) *</Label>
                  <Textarea
                    id={`bio-${lang.code}`}
                    value={bio[lang.code]}
                    onChange={(e) => setBio({ ...bio, [lang.code]: e.target.value })}
                    placeholder="Conte um pouco sobre você..."
                    rows={4}
                    required
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Links Sociais</CardTitle>
          <CardDescription>Seus perfis em redes sociais e profissionais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/seu-usuario"
            />
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/seu-usuario"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={loadSettings} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Configurações"
          )}
        </Button>
      </div>
    </form>
  )
}
