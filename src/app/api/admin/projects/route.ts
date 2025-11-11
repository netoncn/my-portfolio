import { NextResponse } from "next/server";
import { createProject } from "@/lib/firebase/services/admin-projects";
import type { ProjectFormData } from "@/lib/firebase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const data: ProjectFormData = await request.json();

    const projectId = await createProject(data);

    return NextResponse.json({ id: projectId, success: true });
  } catch (error) {
    console.error("[API] Create project error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao criar projeto" },
      { status: 500 }
    );
  }
}