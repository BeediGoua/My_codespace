import { githubGet, githubPost, githubPut } from "./client";
import type { GitHubRepo } from "./types";

export async function createGitHubRepoFromTemplate(accessToken: string, templateOwner: string, templateRepo: string, { name, description, privateRepo }: { name: string; description?: string; privateRepo?: boolean; }) {
    try {
        const body = {
            name,
            description: description || "",
            private: !!privateRepo,
            include_all_branches: false
        };
        return await githubPost<GitHubRepo>({
            accessToken,
            path: `/repos/${templateOwner}/${templateRepo}/generate`,
            body,
        });
    } catch (e) {
        console.error("Template generation error:", e);
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(`Impossible de creer le repository depuis le template ${templateOwner}/${templateRepo}. Details: ${errorMessage}`);
    }
}

export async function pushFileToRepo(
    accessToken: string,
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string
) {
    // Content must be base64 encoded for GitHub API
    const contentBase64 = Buffer.from(content).toString("base64");
    
    try {
        return await githubPut({
            accessToken,
            path: `/repos/${owner}/${repo}/contents/${path}`,
            body: {
                message,
                content: contentBase64,
            },
        });
    } catch (e) {
        console.error("Erreur lors de l'ajout du fichier:", e);
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(`Impossible d'ajouter le fichier ${path}. Details: ${errorMessage}`);
    }
}

export async function createGitHubRepo(accessToken: string, { name, description, privateRepo }: { name: string; description?: string; privateRepo?: boolean; }) {
    try {
        const body = {
            name,
            description: description || "",
            private: !!privateRepo,
            auto_init: true,
        };
        return await githubPost<GitHubRepo>({
            accessToken,
            path: "/user/repos",
            body,
        });
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(`Impossible de creer le repository GitHub. Details: ${errorMessage}`);
    }
}

export async function fetchGitHubRepos(accessToken: string): Promise<GitHubRepo[]> {
    try {
        return await githubGet<GitHubRepo[]>({
            accessToken,
            path: "/user/repos?sort=updated&per_page=30",
        });
    } catch {
        throw new Error("Impossible de recuperer les repositories GitHub.");
    }
}