// app/api/codespaces/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAccessToken } from "@/lib/auth/session";
import { fetchRepoCodespaces } from "@/lib/github/codespaces";


export async function GET(req: NextRequest) {
    let accessToken: string;

    try {
        accessToken = await requireAccessToken();
    } catch (err) {
        console.error("[API Codespaces] Auth manquante ou invalide", err as unknown);
        return NextResponse.json(
            {
                ok: false,
                error: "Authentification GitHub requise pour Codespaces.",
                code: 401,
            },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    if (!owner || !repo) {
        return NextResponse.json(
            { ok: false, error: "owner et repo requis", code: 400 },
            { status: 400 }
        );
    }

    try {
        const codespaces = await fetchRepoCodespaces(accessToken, owner, repo);
        return NextResponse.json({ ok: true, data: codespaces }, { status: 200 });
    } catch (e: unknown) {
        let code = 500;
        let message = "Erreur API Codespaces";

        if (e instanceof Error) {
            message = e.message;
            const maybeStatus = (e as Error & { status?: number }).status;
            if (typeof maybeStatus === "number") {
                code = maybeStatus;
            }
        }

        console.error(`[API Codespaces] Erreur pour ${owner}/${repo}:`, message);

        return NextResponse.json(
            { ok: false, error: message, code },
            { status: code }
        );
    }
}