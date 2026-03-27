
type GitHubPostOptions = {
    accessToken: string;
    path: string;
    body: Record<string, unknown>;
};

export async function githubPost<T>({ accessToken, path, body }: GitHubPostOptions): Promise<T> {
    const response = await fetch(`https://api.github.com${path}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "github-login-mvp",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        let errorMsg = `Echec de requete POST GitHub.`;
        const errorCode = response.status;
        try {
            const errJson = await response.json();
            if (errJson && errJson.message) {
                errorMsg += ` ${errJson.message}`;
            } else {
                errorMsg += ` ${JSON.stringify(errJson)}`;
            }
        } catch {
            // ignore
        }
        const error = new Error(errorMsg);
        // @ts-expect-error: Needed to attach HTTP status code for error handling
        error.status = errorCode;
        throw error;
    }
    return response.json();
}
type GitHubRequestOptions = {
    accessToken: string;
    path: string;
};

export async function githubGet<T>({ accessToken, path }: GitHubRequestOptions): Promise<T> {
    const response = await fetch(`https://api.github.com${path}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "github-login-mvp",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Echec de requete GitHub.");
    }

    return response.json();
}