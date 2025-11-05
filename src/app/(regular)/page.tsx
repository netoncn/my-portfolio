import { HeroSection } from "@/components/portfolio/hero-section"
import { ProjectsGrid } from "@/components/portfolio/projects-grid"
import { ContactSection } from "@/components/portfolio/contact-section"
// import { ChatWidget } from "@/components/portfolio/chat-widget"
import { getPublishedProjects } from "@/lib/firebase/services/projects"
import { getSettings } from "@/lib/firebase/services/settings"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export const revalidate = 3600 // Revalidate every hour (ISR)

export default async function HomePage() {
  const projects = await getPublishedProjects()
  const settings = await getSettings()

  return (
    <>
      <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-md" />}>
        <HeroSection settings={settings} />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-md" />}>
        <ProjectsGrid projects={projects} />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-md" />}>
        <ContactSection settings={settings} />
      </Suspense>
      {/* <ChatWidget /> */}
    </>
  )
}
