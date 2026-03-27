import { NextRequest, NextResponse } from "next/server";
import { requireAccessToken } from "@/lib/auth/session";
import { fetchRepoCodespaces } from "@/lib/github/codespaces";

const TEST_MODE = process.env.TEST_MODE === "1";

const accessToken = await requireAccessToken();
const { searchParams } = new URL(req.url);
const owner = searchParams.get("owner");
const repo = searchParams.get("repo");

if (!owner || !repo) {
    return NextResponse.json({ ok: false, error: "owner et repo requis" }, { status: 400 });
}

if (TEST_MODE) {
    // Mock: retourne un faux codespace
    return NextResponse.json({
        ok: true,
        data: {
            codespaces: [
                {
                    id: "cs-123",
                    display_name: "Codespace de test",
                    name: "codespace-test",
                    state: "available",
                    web_url: `https://github.com/codespaces/test-user/${repo}`,
                },
            ],
        },
    });
}
try {
    const codespaces = await fetchRepoCodespaces(accessToken, owner, repo);
    return NextResponse.json({ ok: true, data: codespaces });
} catch (e) {
    const message = e instanceof Error ? e.message : "Erreur API Codespaces";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
}
}
