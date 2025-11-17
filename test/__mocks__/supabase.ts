import { vi } from "vitest";

export const mockSupabaseStorage = {
  from: vi.fn(() => ({
    upload: vi.fn().mockResolvedValue({
      data: { path: "test-path/test-image.jpg" },
      error: null,
    }),
    getPublicUrl: vi.fn(() => ({
      data: {
        publicUrl:
          "https://test.supabase.co/storage/v1/object/public/portfolio/test-path/test-image.jpg",
      },
    })),
    remove: vi.fn().mockResolvedValue({ error: null }),
  })),
};

export const mockSupabase = {
  storage: mockSupabaseStorage,
};

vi.mock("@/lib/supabase/config", () => ({
  supabase: mockSupabase,
}));
