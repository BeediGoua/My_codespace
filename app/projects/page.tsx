import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchGitHubRepos } from "@/lib/github";
import { requireAccessToken } from "@/lib/auth/session";
import ProjectsList from "./projects-list";

export default async function ProjectsPage() {
    const accessToken = await requireAccessToken("/");

    let repos;

    try {
        repos = await fetchGitHubRepos(accessToken);
    } catch {
        redirect("/dashboard");
    }

    return (
        <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
            <h1>Mes projets GitHub</h1>
            <p>Repositories recents (tries par date de mise a jour).</p>

            <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link
                    href="/dashboard"
                    style={{
                        display: "inline-block",
                        padding: "0.65rem 0.9rem",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        color: "black",
                        textDecoration: "none",
                    }}
                >
                    Retour dashboard
                </Link>
            </div>

            {repos.length === 0 ? <p style={{ marginTop: "1rem" }}>Aucun repository trouve.</p> : <ProjectsList repos={repos} />}
        </main>
    );
}