import { NextResponse } from "next/server";
import { updatePortfolioSettings } from "@/lib/firebase/services/settings";
import type { PortfolioSettingsInput } from "@/lib/firebase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  try {
    const data: PortfolioSettingsInput = await request.json();

    await updatePortfolioSettings(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Update settings error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao atualizar configurações" },
      { status: 500 }
    );
  }
}