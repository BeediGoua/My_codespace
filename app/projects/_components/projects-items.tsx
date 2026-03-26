import type { GitHubRepo } from "@/lib/github";

type ProjectsItemsProps = {
    repos: GitHubRepo[];
};

export default function ProjectsItems({ repos }: ProjectsItemsProps) {
    return (
        <ul style={{ marginTop: "0.6rem", paddingLeft: "1.25rem" }}>
            {repos.map((repo) => (
                <li key={repo.id} style={{ marginBottom: "0.9rem" }}>
                    <a href={repo.html_url} target="_blank" rel="noreferrer">
                        {repo.full_name}
                    </a>
                    <div style={{ fontSize: "0.9rem", color: "#555" }}>
                        {repo.private ? "Prive" : "Public"} - {repo.fork ? "Fork" : "Source"} - MAJ: {new Date(repo.updated_at).toLocaleString("fr-FR")}
                    </div>
                    {repo.description ? <div style={{ fontSize: "0.95rem" }}>{repo.description}</div> : null}
                </li>
            ))}
        </ul>
    );
}