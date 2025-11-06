import type React from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getSettings } from "@/lib/firebase/services/settings";

export const revalidate = 3600;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <>
      <Header name={settings?.name} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
