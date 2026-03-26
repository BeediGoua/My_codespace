import { NextResponse } from "next/server";
import crypto from "crypto";
import { getOAuthEnv } from "@/lib/env";

export async function GET() {
  let clientId: string;
  let redirectUri: string;

  try {
    ({ clientId, redirectUri } = getOAuthEnv());
  } catch {
    return new NextResponse("Variables d'environnement manquantes.", {
      status: 500,
    });
  }

  const state = crypto.randomBytes(16).toString("hex");

  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", clientId);
  githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
  githubAuthUrl.searchParams.set("scope", "read:user user:email");
  githubAuthUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(githubAuthUrl.toString());

  response.cookies.set("github_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
