// app/api/codespaces/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAccessToken } from "@/lib/auth/session";
import { fetchRepoCodespaces } from "@/lib/github/codespaces";

const TEST_MODE = process.env.TEST_MODE === "1";

export async function GET(req: NextRequest) {
  let accessToken: string;

  try {
    accessToken = await requireAccessToken();
  } catch (err) {
    console.error("[API Codespaces] Auth manquante ou invalide", err);
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

  if (TEST_MODE) {
    return NextResponse.json({
      ok: true,
      data: {
        total_count: 1,
        codespaces: [
          {
            id: "cs-123",
            display_name: "Codespace de test",
            name: "codespace-test",
            state: "Available",
            web_url: `https://github.com/codespaces/test-user/${repo}`,
            repository: {
              name: repo,
              full_name: `${owner}/${repo}`,
              owner: { login: owner },
            },
          },
        ],
      },
    });
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