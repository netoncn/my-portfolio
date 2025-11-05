"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Home, Plus, Settings } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { signOutUser } from "@/lib/firebase/auth"
import { toast } from "sonner"

export function AdminHeader() {
  const router = useRouter()
  const { user } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOutUser()
      toast.success("Logout realizado", {
        description: "Você saiu com sucesso",
      })
      router.push("/admin/login")
    } catch (error) {
      toast.error("Erro ao sair", {
        description: error instanceof Error ? error.message : "Erro desconhecido",
      })
    }
  }

  return (
    <header className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-xl font-bold">
              Admin
            </Link>
            <nav className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Ver Site
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/admin/projects/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Projeto
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Link>
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
