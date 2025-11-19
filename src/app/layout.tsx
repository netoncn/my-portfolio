import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { I18nProvider } from "@/i18n/client";
import { PostHogPageView, PostHogProvider } from "@/providers/posthog-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";

const SpeedInsights = dynamic(() =>
  import("@vercel/speed-insights/next").then((mod) => ({
    default: mod.SpeedInsights,
  })),
);
const Analytics = dynamic(() =>
  import("@vercel/analytics/next").then((mod) => ({
    default: mod.Analytics,
  })),
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  fallback: ["Courier New", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.SITE_URL || "https://netoncn.com.br",
  ),
  title: {
    default: "Nelson Christovam Neto - Desenvolvedor Full Stack",
    template: "%s | Nelson Christovam Neto",
  },
  description:
    "Portfolio de Nelson Christovam Neto - Desenvolvedor Full Stack criando experiências digitais modernas e funcionais com React, Next.js, TypeScript e Firebase.",
  keywords: [
    "nelson christovam neto",
    "desenvolvedor full stack",
    "portfolio",
    "react",
    "nextjs",
    "typescript",
    "firebase",
    "web development",
    "desenvolvedor",
    "programador",
    "freelancer",
    "projetos",
    "freelance",
    "freelancing",
    "cto",
    "aplicações web",
    "desenvolvimento de software",
  ],
  authors: [{ name: "Nelson Christovam Neto" }],
  creator: "Nelson Christovam Neto",
  publisher: "Nelson Christovam Neto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Portfolio",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <link
          rel="dns-prefetch"
          href="https://identitytoolkit.googleapis.com"
        />
        {process.env.NEXT_PUBLIC_POSTHOG_HOST && (
          <link
            rel="dns-prefetch"
            href={process.env.NEXT_PUBLIC_POSTHOG_HOST}
          />
        )}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          body { margin: 0; }
          .loading-placeholder {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--background);
          }
        `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <I18nProvider>
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </I18nProvider>
          </ThemeProvider>
          <SpeedInsights />
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
  );
}
