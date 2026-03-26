import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAccessToken(redirectTo = "/"): Promise<string> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("github_access_token")?.value;

    if (!accessToken) {
        redirect(redirectTo);
    }

    return accessToken;
}