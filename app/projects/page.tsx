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

    const publicCount = repos.filter((repo) => !repo.private).length;
    const privateCount = repos.filter((repo) => repo.private).length;
    const forkCount = repos.filter((repo) => repo.fork).length;

    return (
        <main className="page-shell">
            <section className="page-header">
                <div>
                    <div className="eyebrow">Mes projets GitHub</div>
                    <h1 className="page-title">Choisir le bon repository avant la prochaine action.</h1>
                    <p className="page-subtitle">
                        Cette page est le premier vrai hub produit: tu peux retrouver tes repositories recents, les
                        filtrer rapidement et preparer la suite du parcours, comme la creation de projet ou l&apos;ouverture
                        dans Codespaces.
                    </p>
                </div>

                <div className="page-header-actions">
                    <Link href="/projects/create" className="button-primary">
                        + Nouveau projet
                    </Link>
                    <Link href="/favorites" className="button-secondary">
                        Voir mes favoris
                    </Link>
                    <Link href="/dashboard" className="button-secondary">
                        Retour dashboard
                    </Link>
                    <span className="tag">{repos.length} projets charges</span>
                </div>
            </section>

            <section className="project-summary-grid">
                <article className="stat-card">
                    <p className="stat-value">{repos.length}</p>
                    <div className="stat-label">repositories recuperes</div>
                </article>
                <article className="stat-card">
                    <p className="stat-value">{publicCount}</p>
                    <div className="stat-label">publics</div>
                </article>
                <article className="stat-card">
                    <p className="stat-value">{privateCount}</p>
                    <div className="stat-label">prives</div>
                </article>
                <article className="stat-card">
                    <p className="stat-value">{forkCount}</p>
                    <div className="stat-label">forks</div>
                </article>
            </section>

            {repos.length === 0 ? (
                <section className="section-card" style={{ marginTop: "18px" }}>
                    <h2 className="section-title">Aucun repository trouve</h2>
                    <p className="empty-state">
                        Aucun projet n&apos;a ete remonte par l&apos;API GitHub pour cette session. Verifie le compte connecte ou
                        cree ton premier repository avant de continuer.
                    </p>
                </section>
            ) : (
                <ProjectsList repos={repos} />
            )}
        </main>
    );
}