import { NextRequest, NextResponse } from "next/server";
import { getOAuthEnv } from "@/lib/env";

// Mode test: permet d'injecter un token de session de test pour les tests e2e
export async function GET(request: NextRequest) {
  let clientId: string;
  let clientSecret: string;

  try {
    ({ clientId, clientSecret } = getOAuthEnv(true));
  } catch {
    return new NextResponse("Variables d'environnement manquantes.", {
      status: 500,
    });
  }

  const { searchParams } = new URL(request.url);
  const origin = new URL(request.url).origin;
  const redirectUri =
    request.cookies.get("github_oauth_redirect_uri")?.value || `${origin}/api/auth/github/callback`;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const storedState = request.cookies.get("github_oauth_state")?.value;

  if (!code) {
    return new NextResponse("Code GitHub manquant.", { status: 400 });
  }

  if (!state || !storedState || state !== storedState) {
    return new NextResponse("State OAuth invalide.", { status: 400 });
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
    cache: "no-store",
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || !tokenData.access_token) {
    return new NextResponse(
      `Erreur lors de l'echange du code: ${JSON.stringify(tokenData)}`,
      { status: 400 }
    );
  }

  const response = NextResponse.redirect(`${origin}/dashboard`);

  response.cookies.set("github_access_token", tokenData.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  response.cookies.delete("github_oauth_state");
  response.cookies.delete("github_oauth_redirect_uri");

  return response;
}
