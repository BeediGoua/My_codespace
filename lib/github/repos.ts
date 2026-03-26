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