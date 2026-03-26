import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubUser } from "@/lib/github";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("github_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        ok: false,
        authenticated: false,
        error: {
          code: "UNAUTHENTICATED",
          message: "Aucune session active.",
        },
      },
      { status: 401 }
    );
  }

  try {
    const user = await fetchGitHubUser(accessToken);

    return NextResponse.json({
      ok: true,
      authenticated: true,
      data: { user },
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        authenticated: false,
        error: {
          code: "INVALID_TOKEN",
          message: "Token invalide ou expire.",
        },
      },
      { status: 401 }
    );
  }
}
