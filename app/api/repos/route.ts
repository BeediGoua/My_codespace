import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubRepos } from "@/lib/github";

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
        const repos = await fetchGitHubRepos(accessToken);

        return NextResponse.json({
            ok: true,
            authenticated: true,
            data: { repos },
        });
    } catch {
        return NextResponse.json(
            {
                ok: false,
                authenticated: false,
                error: {
                    code: "UPSTREAM_ERROR",
                    message: "Impossible de recuperer les repositories.",
                },
            },
            { status: 401 }
        );
    }
}