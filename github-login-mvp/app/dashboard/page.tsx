import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchGitHubUser } from "@/lib/github";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("github_access_token")?.value;

  if (!accessToken) {
    redirect("/");
  }

  let user;

  try {
    user = await fetchGitHubUser(accessToken);
  } catch {
    redirect("/");
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Dashboard</h1>
      <p>Connexion reussie.</p>

      <div style={{ marginTop: "1rem" }}>
        <p>
          <strong>Login :</strong> {user.login}
        </p>
        <p>
          <strong>Nom :</strong> {user.name || "Non renseigne"}
        </p>
        <p>
          <strong>URL GitHub :</strong> {user.html_url}
        </p>
      </div>

      <form action="/api/auth/logout" method="post" style={{ marginTop: "1rem" }}>
        <button
          type="submit"
          style={{
            padding: "0.7rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "white",
            cursor: "pointer",
          }}
        >
          Se deconnecter
        </button>
      </form>
    </main>
  );
}
