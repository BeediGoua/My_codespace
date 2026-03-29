import { NextRequest, NextResponse } from "next/server";
import { requireAccessToken } from "@/lib/auth/session";
import { createGitHubRepo, pushFileToRepo } from "@/lib/github/repos";

const DEVCONTAINERS: Record<string, string> = {
    nextjs: JSON.stringify({
        name: "Projet Next.js",
        image: "mcr.microsoft.com/devcontainers/typescript-node:18",
        forwardPorts: [3000]
    }, null, 2),
    python: JSON.stringify({
        name: "Projet Python",
        image: "mcr.microsoft.com/devcontainers/python:1-3.11-bullseye",
        customizations: {
            vscode: { extensions: ["ms-python.python"] }
        }
    }, null, 2),
    datascience: JSON.stringify({
        name: "Data Science Environnement",
        image: "mcr.microsoft.com/devcontainers/anaconda:0-3",
        customizations: {
            vscode: { extensions: ["ms-python.python", "ms-toolsai.jupyter"] }
        }
    }, null, 2)
};

const TEST_MODE = process.env.TEST_MODE === "1";

export async function POST(req: NextRequest) {
    const accessToken = await requireAccessToken();
    const body = await req.json();
    const { name, description, private: privateRepo } = body;
    if (!name || typeof name !== "string" || name.length < 2) {
        return NextResponse.json({ ok: false, error: "Nom de repository invalide." }, { status: 400 });
    }
    const { type } = body;
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
        // 1. On cree le repository vide classiquement
        const repo = await createGitHubRepo(accessToken, { name, description, privateRepo });
        
        // 2. Si un type specifique est choisi, on pousse le devcontainer adapt‚
        if (type && DEVCONTAINERS[type]) {
            // Repos.full_name is in "owner/repo" format
            const owner = repo.full_name.split("/")[0];
            const repoName = repo.name;
            
            await pushFileToRepo(
                accessToken,
                owner,
                repoName,
                ".devcontainer/devcontainer.json",
                DEVCONTAINERS[type],
                "🚀 Init codespaces configuration via Launcher"
            );
        }
        
        return NextResponse.json({ ok: true, data: repo });
    } catch (e) {
        const message = e instanceof Error ? e.message : "Erreur creation repo";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}
