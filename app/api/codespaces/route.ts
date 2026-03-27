import { NextRequest, NextResponse } from "next/server";
import { requireAccessToken } from "@/lib/auth/session";
import { fetchRepoCodespaces } from "@/lib/github/codespaces";

export async function GET(req: NextRequest) {
    const accessToken = await requireAccessToken();
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    if (!owner || !repo) {
        return NextResponse.json({ ok: false, error: "owner et repo requis" }, { status: 400 });
    }

    try {
        const codespaces = await fetchRepoCodespaces(accessToken, owner, repo);
        return NextResponse.json({ ok: true, data: codespaces });
    } catch (e) {
        const message = e instanceof Error ? e.message : "Erreur API Codespaces";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}
