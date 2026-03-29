// app/api/codespaces/create/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAccessToken } from "@/lib/auth/session";
import { createRepoCodespace } from "@/lib/github/codespaces";

export async function POST(req: NextRequest) {
  let accessToken: string;

  try {
    accessToken = await requireAccessToken();
  } catch (err) {
    console.error("[API Codespaces][create] Auth manquante ou invalide", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Authentification GitHub requise pour Codespaces.",
        code: 401,
      },
      { status: 401 }
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Body JSON invalide", code: 400 },
      { status: 400 }
    );
  }

  const { repositoryId, ...params } = body;

  if (!repositoryId || (typeof repositoryId !== "number" && typeof repositoryId !== "string")) {
    return NextResponse.json(
      { ok: false, error: "repositoryId requis", code: 400 },
      { status: 400 }
    );
  }

  const repoIdNum = typeof repositoryId === "string" ? parseInt(repositoryId, 10) : repositoryId;

  try {
    const codespace = await createRepoCodespace(accessToken, repoIdNum, {
      location:
        typeof params.location === "string" ? params.location : undefined,
      machine_type:
        typeof params.machine_type === "string"
          ? params.machine_type
          : undefined,
      devcontainer_path:
        typeof params.devcontainer_path === "string"
          ? params.devcontainer_path
          : undefined,
      idle_timeout_minutes:
        typeof params.idle_timeout_minutes === "number"
          ? params.idle_timeout_minutes
          : undefined,
      display_name:
        typeof params.display_name === "string"
          ? params.display_name
          : undefined,
      retention_period_minutes:
        typeof params.retention_period_minutes === "number"
          ? params.retention_period_minutes
          : undefined,
      ref: typeof params.ref === "string" ? params.ref : undefined,
    });

    return NextResponse.json({ ok: true, data: codespace }, { status: 201 });
  } catch (e: unknown) {
    let message = "Erreur creation Codespace";
    let status = 500;

    if (e instanceof Error) {
      message = e.message;
      const maybeStatus = (e as Error & { status?: number }).status;
      if (typeof maybeStatus === "number") {
        status = maybeStatus;
      }
    }

    console.error(`[API Codespaces][create] ${repositoryId} :`, message);

    return NextResponse.json(
      { ok: false, error: message, code: status },
      { status }
    );
  }
}