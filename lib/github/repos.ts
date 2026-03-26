import { githubPost } from "./client";
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
    } catch {
        throw new Error("Impossible de creer le repository GitHub.");
    }
}
import { githubGet } from "./client";
import type { GitHubRepo } from "./types";

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