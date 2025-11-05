import { AuthGuard } from "@/components/auth/auth-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { SettingsForm } from "@/components/admin/settings-form"

export default function AdminSettingsPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Configurações do Portfólio</h1>
            <p className="text-muted-foreground">Configure suas informações pessoais e links de contato</p>
          </div>
          <SettingsForm />
        </main>
      </div>
    </AuthGuard>
  )
}
