import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Cleanup após cada teste
afterEach(() => {
  cleanup();
});

// Mock de variáveis de ambiente
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "test-api-key";
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "test.firebaseapp.com";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "test-project";
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "123456789";
process.env.NEXT_PUBLIC_FIREBASE_APP_ID = "test-app-id";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
process.env.NEXT_PUBLIC_ADMIN_EMAIL = "admin@test.com";

// Mock do Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock do next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "pt-BR",
}));

// Mock do analytics
vi.mock("@/lib/analytics", () => ({
  default: {
    admin: {
      projectCreated: vi.fn(),
      projectUpdated: vi.fn(),
      projectDeleted: vi.fn(),
      settingsUpdated: vi.fn(),
    },
  },
}));
