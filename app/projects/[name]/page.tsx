import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchGitHubRepos, GitHubRepo } from "@/lib/github";
import { requireAccessToken } from "@/lib/auth/session";

// Page dynamique pour afficher les détails d'un projet selon l'URL
export default async function Page({ params }: { params: Promise<{ name: string }> }) {
    // Récupère la liste des projets via l'API GitHub
    const accessToken = await requireAccessToken("/");
    let projects: GitHubRepo[] = [];
    try {
        projects = await fetchGitHubRepos(accessToken);
    } catch (e) {
        console.error("Erreur de récupération des projets :", e);
    }
    
    const { name } = await params;
    // Cherche le projet correspondant au paramètre d'URL
    const project = projects.find((p) => p.name === name || p.full_name === name);

    if (!project) {
        notFound();
    }

    return (
        <main style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
            <h1>{project.name}</h1>
            <p style={{ color: '#666', fontSize: 15 }}>{project.full_name}</p>
            <p style={{ color: '#888', fontSize: 15 }}>{project.description || "Aucune description."}</p>
            <div style={{ margin: '18px 0', display: 'flex', gap: 12 }}>
                <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="button-secondary" style={{ padding: '6px 12px' }}>
                    Voir sur GitHub
                </a>
                <Link href="/projects" className="button-secondary" style={{ padding: '6px 12px' }}>
                    Retour aux projets
                </Link>
            </div>
            <ul style={{ color: '#444', fontSize: 14, marginTop: 20 }}>
                <li>Langage : {project.language || "Non spécifié"}</li>
                <li>Visibilité : {project.private ? "Privé" : "Public"}</li>
                <li>Dernière mise à jour : {project.updated_at}</li>
            </ul>
        </main>
    );
}
