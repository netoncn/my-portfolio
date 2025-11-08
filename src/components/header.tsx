"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { smooth } from "@/lib/animations";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

const HeaderContent = memo(function HeaderContent({ name }: { name?: string }) {
  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={smooth}
    >
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <Link href="/" className="font-bold flex items-center gap-4">
          <Image src="/logo.png" alt="Logo" width={32} height={32} priority />
          {name || "Portfolio"}
        </Link>

        <div className="flex items-center md:gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
});

export function Header({ name }: { name?: string }) {
  return <HeaderContent name={name} />;
}
