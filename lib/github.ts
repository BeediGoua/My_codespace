export async function fetchGitHubUser(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "github-login-mvp",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Impossible de recuperer le profil GitHub.");
  }

  return response.json();
}
