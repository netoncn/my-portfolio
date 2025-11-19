import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const title = searchParams.get("title") || "Nelson Christovam Neto";
    const description =
      searchParams.get("description") || "Desenvolvedor Full Stack";
    const type = searchParams.get("type") || "default";

    const isDark = type !== "light";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
            padding: "80px",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isDark
                ? "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15), transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15), transparent 50%)"
                : "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1), transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1), transparent 50%)",
              zIndex: 0,
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: isDark ? "#ffffff" : "#0a0a0a",
                lineHeight: 1.1,
                maxWidth: "900px",
                letterSpacing: "-0.03em",
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontSize: 36,
                color: isDark ? "#a1a1aa" : "#71717a",
                maxWidth: "800px",
                lineHeight: 1.4,
              }}
            >
              {description}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: isDark ? "#ffffff" : "#0a0a0a",
                }}
              >
                netoncn.com.br
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: isDark ? "#71717a" : "#a1a1aa",
                }}
              >
                Portfolio & Projetos
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error("[og] Error generating OG image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
