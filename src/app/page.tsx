import { HeroSection } from "@/components/portfolio/hero-section"
import { ProjectsGrid } from "@/components/portfolio/projects-grid"
import { ContactSection } from "@/components/portfolio/contact-section"
import { Footer } from "@/components/portfolio/footer"
// import { ChatWidget } from "@/components/portfolio/chat-widget"
import { getPublishedProjects } from "@/lib/firebase/services/projects"

export const revalidate = 3600 // Revalidate every hour (ISR)

export default async function HomePage() {
  const projects = await getPublishedProjects()

  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProjectsGrid projects={projects} />
      <ContactSection />
      <Footer />
      {/* <ChatWidget /> */}
    </main>
  )
}
