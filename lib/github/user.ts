import { githubGet } from "./client";
import type { GitHubUser } from "./types";

export async function fetchGitHubUser(accessToken: string): Promise<GitHubUser> {
    try {
        return await githubGet<GitHubUser>({ accessToken, path: "/user" });
    } catch {
        throw new Error("Impossible de recuperer le profil GitHub.");
    }
}