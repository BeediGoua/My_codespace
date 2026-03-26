import { NextRequest, NextResponse } from "next/server";
import { requireAccessToken } from "@/lib/auth/session";
import { createGitHubRepo } from "@/lib/github/repos";

export async function POST(req: NextRequest) {
    const accessToken = await requireAccessToken();
    const body = await req.json();
    const { name, description, private: privateRepo } = body;
    if (!name || typeof name !== "string" || name.length < 2) {
        return NextResponse.json({ ok: false, error: "Nom de repository invalide." }, { status: 400 });
    }
    try {
        const repo = await createGitHubRepo(accessToken, { name, description, privateRepo });
        return NextResponse.json({ ok: true, data: repo });
    } catch (e) {
        const message = e instanceof Error ? e.message : "Erreur creation repo";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}
