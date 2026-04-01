import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getOAuthEnv } from "@/lib/env";

export async function GET(request: NextRequest) {
  let clientId: string;

  try {
    ({ clientId } = getOAuthEnv());
  } catch {
    return new NextResponse("Variables d'environnement manquantes.", {
      status: 500,
    });
  }

  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/github/callback`;

  const state = crypto.randomBytes(16).toString("hex");

  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", clientId);
  githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
  githubAuthUrl.searchParams.set("scope", "read:user user:email codespace");
  githubAuthUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(githubAuthUrl.toString());

  response.cookies.set("github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  response.cookies.set("github_oauth_redirect_uri", redirectUri, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
