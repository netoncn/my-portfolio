import { Suspense } from "react";
import { ContactSection } from "@/components/portfolio/contact-section";
import { HeroSection } from "@/components/portfolio/hero-section";
import { ProjectsGrid } from "@/components/portfolio/projects-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublishedProjects } from "@/lib/firebase/services/projects";
import { getSettings } from "@/lib/firebase/services/settings";

export const revalidate = 3600; // ISR: Revalidate every hour

function ProjectsLoadingSkeleton() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto space-y-12">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function ProjectsSection() {
  const projects = await getPublishedProjects();
  return <ProjectsGrid projects={projects} />;
}

async function HeroWithSettings() {
  const settings = await getSettings();
  return <HeroSection settings={settings} />;
}

async function ContactWithSettings() {
  const settings = await getSettings();
  return <ContactSection settings={settings} />;
}

export default async function HomePage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-[90vh] flex items-center justify-center">
            <Skeleton className="h-96 w-full max-w-4xl" />
          </div>
        }
      >
        <HeroWithSettings />
      </Suspense>

      <Suspense fallback={<ProjectsLoadingSkeleton />}>
        <ProjectsSection />
      </Suspense>

      <Suspense
        fallback={
          <section className="py-20 px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <Skeleton className="h-10 w-64 mx-auto" />
              <Skeleton className="h-6 w-96 mx-auto" />
              <div className="flex gap-4 justify-center">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </section>
        }
      >
        <ContactWithSettings />
      </Suspense>
    </>
  );
}
