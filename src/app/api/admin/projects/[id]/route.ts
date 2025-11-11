import { NextResponse } from "next/server";
import { deleteProject, updateProject } from "@/lib/firebase/services/admin-projects";
import type { ProjectFormData } from "@/lib/firebase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data: Partial<ProjectFormData> = await request.json();
    
    await updateProject(id, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Update project error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao atualizar projeto" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    await deleteProject(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Delete project error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao deletar projeto" },
      { status: 500 }
    );
  }
}