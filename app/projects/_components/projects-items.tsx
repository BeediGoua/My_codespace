"use client";
import React, { useEffect, useState } from "react";

export type ProjectItemProps = {
    id: number | string;
    name: string;
    full_name?: string;
    description?: string | null;
    html_url: string;
    private: boolean;
    language?: string;
    updated_at: string;
};

export function ProjectsItems({ projects }: { projects: ProjectItemProps[] }) {
    // State to store codespaces for each repo (keyed by full_name)
    const [codespacesMap, setCodespacesMap] = useState<Record<string, any[]>>({});
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
    const [errorMap, setErrorMap] = useState<Record<string, string>>({});

    useEffect(() => {
        // Fetch codespaces for all projects in parallel
        projects.forEach((project) => {
            if (!project.full_name) return;
            setLoadingMap((prev) => ({ ...prev, [project.full_name!]: true }));
            fetch(`/api/codespaces?owner=${encodeURIComponent(project.full_name.split("/")[0])}&repo=${encodeURIComponent(project.name)}`)
                .then(async (res) => {
                    if (!res.ok) throw new Error("API Codespaces");
                    const data = await res.json();
                    if (data.ok) {
                        setCodespacesMap((prev) => ({ ...prev, [project.full_name!]: data.data.codespaces || [] }));
                        setErrorMap((prev) => ({ ...prev, [project.full_name!]: "" }));
                    } else {
                        setErrorMap((prev) => ({ ...prev, [project.full_name!]: data.error || "Erreur API Codespaces" }));
                    }
                })
                .catch(() => {
                    setErrorMap((prev) => ({ ...prev, [project.full_name!]: "Erreur API Codespaces" }));
                })
                .finally(() => {
                    setLoadingMap((prev) => ({ ...prev, [project.full_name!]: false }));
                });
        });
    }, [projects]);

    return (
        <ul className="repo-grid">
            {projects.map((project) => {
                const codespacesUrl = project.full_name
                    ? `https://github.com/codespaces/new?repo=${project.full_name}`
                    : project.html_url.replace('github.com/', 'github.com/codespaces/new?repo=');
                const codespaces = project.full_name ? codespacesMap[project.full_name] : undefined;
                const loading = project.full_name ? loadingMap[project.full_name] : false;
                const error = project.full_name ? errorMap[project.full_name] : "";
                return (
                    <li key={project.id} className="repo-card">
                        <div className="repo-card-head">
                            <div>
                                <h3 className="repo-title">{project.name}</h3>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <a
                                    href={project.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="button-secondary"
                                    title="Voir sur GitHub"
                                >
                                    <span role="img" aria-label="GitHub">🔗</span> GitHub
                                </a>
                                <a
                                    href={codespacesUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="button-primary"
                                    title="Ouvrir dans Codespaces"
                                >
                                    <span role="img" aria-label="Codespaces">🟢</span> Codespaces
                                </a>
                            </div>
                        </div>
                        <div className="project-meta">
                            <span className="project-visibility">
                                {project.private ? "Privé" : "Public"}
                            </span>
                            {project.language && (
                                <span className="project-language">{project.language}</span>
                            )}
                            <span className="project-updated">
                                Modifié le {new Date(project.updated_at).toLocaleDateString()}
                            </span>
                        </div>
                        {project.description && (
                            <div className="project-description">{project.description || "Aucune description fournie pour ce repository."}</div>
                        )}
                        {/* Codespaces section */}
                        {project.full_name && (
                            <div className="codespaces-list" style={{ marginTop: 8 }}>
                                <strong>Codespaces existants :</strong>
                                {loading && <span style={{ marginLeft: 8 }}>Chargement...</span>}
                                {error && !loading && (
                                    <span style={{ color: "#c00", marginLeft: 8 }}>{error}</span>
                                )}
                                {!loading && !error && codespaces && codespaces.length === 0 && (
                                    <span style={{ marginLeft: 8 }}>Aucun Codespace</span>
                                )}
                                {!loading && !error && codespaces && codespaces.length > 0 && (
                                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                                        {codespaces.map((cs: any) => (
                                            <li key={cs.id}>
                                                <span>{cs.display_name || cs.name || cs.id}</span>
                                                {cs.state && (
                                                    <span style={{ marginLeft: 8, fontStyle: "italic" }}>({cs.state})</span>
                                                )}
                                                {cs.web_url && (
                                                    <a
                                                        href={cs.web_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ marginLeft: 8 }}
                                                    >
                                                        Ouvrir
                                                    </a>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}