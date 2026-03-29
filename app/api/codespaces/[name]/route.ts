// app/api/codespaces/[name]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAccessToken } from "@/lib/auth/session";
import { getCodespaceByName } from "@/lib/github/codespaces";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) {
    const { name } = await params;
    try {
        const accessToken = await requireAccessToken();
        const data = await getCodespaceByName(accessToken, name);
        return NextResponse.json({ ok: true, data });
    } catch (err) {
        console.error(`[API Codespaces] Erreur lors de la récupération de ${name}:`, err);
        return NextResponse.json(
            { ok: false, error: err instanceof Error ? err.message : "Erreur" },
            { status: 500 }
        );
    }
}