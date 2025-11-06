"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginButton } from "@/components/auth/login-button";
import { useAuth } from "@/contexts/auth-context";

export default function AdminLoginPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.push("/admin");
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/20 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Admin Login</h1>
          <p className="mt-2 text-muted-foreground">
            Acesso restrito ao administrador
          </p>
        </div>

        <div className="rounded-lg border bg-card p-8 shadow-lg">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold">Bem-vindo</h2>
              <p className="text-sm text-muted-foreground">
                Faça login com sua conta Google autorizada
              </p>
            </div>

            <LoginButton />

            <div className="text-center">
              <a
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Voltar para o portfólio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
