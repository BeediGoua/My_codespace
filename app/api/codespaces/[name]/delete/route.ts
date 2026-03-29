// app/api/codespaces/[name]/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAccessToken } from "@/lib/auth/session";
import { deleteRepoCodespace } from "@/lib/github/codespaces";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  try {
    const accessToken = await requireAccessToken();
    await deleteRepoCodespace(accessToken, name);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[API Codespaces] Erreur lors de la suppression de ${name}:`, err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Erreur" },
      { status: 500 }
    );
  }
}
