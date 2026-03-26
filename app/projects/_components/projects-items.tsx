import type { GitHubRepo } from "@/lib/github";

type ProjectsItemsProps = {
    repos: GitHubRepo[];
};

export default function ProjectsItems({ repos }: ProjectsItemsProps) {
    return (
        <ul className="repo-grid">
            {repos.map((repo) => (
                <li key={repo.id} className="repo-card">
                    <div className="repo-card-head">
                        <div>
                            <h3 className="repo-title">
                                <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo-link">
                                    {repo.full_name}
                                </a>
                            </h3>
                            <div className="repo-meta">MAJ: {new Date(repo.updated_at).toLocaleString("fr-FR")}</div>
                        </div>

                        <div className="repo-badges">
                            <span className={`badge ${repo.private ? "badge-private" : "badge-public"}`}>
                                {repo.private ? "Prive" : "Public"}
                            </span>
                            <span className={`badge ${repo.fork ? "badge-fork" : "badge-source"}`}>
                                {repo.fork ? "Fork" : "Source"}
                            </span>
                        </div>
                    </div>

                    <p className="repo-description">{repo.description || "Aucune description fournie pour ce repository."}</p>

                    <div className="repo-card-footer">
                        <span className="toolbar-note">Pret pour une action future: ouverture, creation rapide, Codespaces.</span>
                        <a href={repo.html_url} target="_blank" rel="noreferrer" className="button-secondary">
                            Ouvrir sur GitHub
                        </a>
                    </div>
                </li>
            ))}
        </ul>
    );
}