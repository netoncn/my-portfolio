import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { LanguageSwitcher } from "./language-switcher"
import Image from "next/image"
import { getSettings } from "@/lib/firebase/services/settings"

export async function Header() {
  const settings = await getSettings()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <Link href="/" className="font-bold text-xl flex items-center gap-4">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
          {settings?.name || "Portfolio"}
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
