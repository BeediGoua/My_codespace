import { NextRequest, NextResponse } from "next/server";
import { requireAccessToken } from "@/lib/auth/session";
import { createGitHubRepo } from "@/lib/github/repos";

const TEST_MODE = process.env.TEST_MODE === "1";

const accessToken = await requireAccessToken();
const body = await req.json();
const { name, description, private: privateRepo } = body;
if (!name || typeof name !== "string" || name.length < 2) {
    return NextResponse.json({ ok: false, error: "Nom de repository invalide." }, { status: 400 });
}
if (TEST_MODE) {
    // Mock: retourne un faux repo
    return NextResponse.json({
        ok: true,
        data: {
            id: 123456,
            name,
            full_name: `test-user/${name}`,
            html_url: `https://github.com/test-user/${name}`,
            private: !!privateRepo,
            fork: false,
            description: description || null,
            updated_at: new Date().toISOString(),
        },
    });
}
try {
    const repo = await createGitHubRepo(accessToken, { name, description, privateRepo });
    return NextResponse.json({ ok: true, data: repo });
} catch (e) {
    const message = e instanceof Error ? e.message : "Erreur creation repo";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
}
}
