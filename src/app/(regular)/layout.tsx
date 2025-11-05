import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/portfolio/footer"


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
    </>
  )
}
