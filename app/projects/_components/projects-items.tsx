"use client";
import React from "react";

export type ProjectItemProps = {
                    <div className="project-meta">
    import React from "react";

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
        return (
            <ul className="repo-grid">
                {projects.map((project) => {
                    // Fallback for Codespaces URL if not present
                    const codespacesUrl = project.full_name
                        ? `https://github.com/codespaces/new?repo=${project.full_name}`
                        : project.html_url.replace('github.com/', 'github.com/codespaces/new?repo=');
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
                        </li>
                    );
                })}
            </ul>
        );
    }