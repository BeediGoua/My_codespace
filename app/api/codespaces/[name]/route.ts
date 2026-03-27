// app/api/codespaces/[name]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAccessToken } from "@/lib/auth/session";
import { getCodespaceByName } from "@/lib/github/codespaces";

const TEST_MODE = process.env.TEST_MODE === "1";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ name: string }> }
) {
  let accessToken: string;

  try {
    accessToken = await requireAccessToken();
  } catch (err) {
    console.error("[API Codespaces][detail] Auth manquante ou invalide", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Authentification GitHub requise pour Codespaces.",
        code: 401,
      },
      { status: 401 }
    );
  }

  const { name } = await context.params;

  if (!name) {
    return NextResponse.json(
      { ok: false, error: "name requis", code: 400 },
      { status: 400 }
    );
  }

  if (TEST_MODE) {
    return NextResponse.json({
      ok: true,
      data: {
        id: "cs-mock-123",
        display_name: "Codespace de test",
        name,
        state: "Available",
        web_url: "https://github.com/codespaces/test-user/demo",
      },
    });
  }

  try {
    const codespace = await getCodespaceByName(accessToken, name);
    return NextResponse.json({ ok: true, data: codespace }, { status: 200 });
  } catch (e: unknown) {
    let message = "Erreur lecture Codespace";
    let status = 500;

    if (e instanceof Error) {
      message = e.message;
      const maybeStatus = (e as Error & { status?: number }).status;
      if (typeof maybeStatus === "number") {
        status = maybeStatus;
      }
    }

    console.error(`[API Codespaces][detail] ${name} :`, message);

    return NextResponse.json(
      { ok: false, error: message, code: status },
      { status }
    );
  }
}