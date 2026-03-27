import { githubGet } from "./client";

export async function fetchRepoCodespaces(accessToken: string, owner: string, repo: string) {
    const res = await githubGet<any>({
        accessToken,
        path: `/repos/${owner}/${repo}/codespaces`,
    });
    return res;
}
