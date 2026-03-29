type OAuthEnv = {
  clientId: string;
  redirectUri: string;
  appUrl: string;
};

type OAuthEnvWithSecret = OAuthEnv & {
  clientSecret: string;
};

function getFirstDefined(names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name];
    if (value) {
      return value;
    }
  }
  return undefined;
}

export function getOAuthEnv(requireSecret: true): OAuthEnvWithSecret;
export function getOAuthEnv(requireSecret?: false): OAuthEnv;
export function getOAuthEnv(requireSecret = false): OAuthEnv | OAuthEnvWithSecret {
  const clientId = getFirstDefined(["GITHUB_CLIENT_ID", "CLIENT_ID"]);
  const clientSecret = getFirstDefined(["GITHUB_CLIENT_SECRET", "CLIENT_SECRET"]);
  const redirectUri = getFirstDefined(["GITHUB_REDIRECT_URI", "REDIRECT_URI"]);
  const appUrl = getFirstDefined(["NEXT_PUBLIC_APP_URL", "APP_URL"]);

  if (!clientId || !redirectUri || !appUrl || (requireSecret && !clientSecret)) {
    const missing = [];
    if (!clientId) missing.push("CLIENT_ID");
    if (!redirectUri) missing.push("REDIRECT_URI");
    if (!appUrl) missing.push("APP_URL");
    if (requireSecret && !clientSecret) missing.push("CLIENT_SECRET");
    console.error("[getOAuthEnv] Variables manquantes:", missing.join(", "));
    throw new Error("Variables d'environnement manquantes.");
  }

  if (requireSecret) {
    return {
      clientId,
      clientSecret,
      redirectUri,
      appUrl,
    };
  }

  return {
    clientId,
    redirectUri,
    appUrl,
  };
}