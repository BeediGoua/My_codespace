import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubUser } from "@/lib/github";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("github_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const user = await fetchGitHubUser(accessToken);

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch {
    return NextResponse.json(
      { authenticated: false, error: "Token invalide ou expire." },
      { status: 401 }
    );
  }
}
