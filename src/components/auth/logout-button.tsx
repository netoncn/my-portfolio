"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/firebase/auth"
import { toast } from "sonner"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
}

export function LogoutButton({ variant = "ghost", size = "default" }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut()
      toast.success("Logout realizado com sucesso!", {
        description: "Até logo!",
      })
      router.push("/")
    } catch (error) {
      console.error("[v0] Logout error:", error)
      toast.error("Erro ao fazer logout", {
        description: "Ocorreu um erro ao tentar sair.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleLogout} disabled={loading} variant={variant} size={size}>
      <LogOut className="mr-2 h-4 w-4" />
      {loading ? "Saindo..." : "Sair"}
    </Button>
  )
}
