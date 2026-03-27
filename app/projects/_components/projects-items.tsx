"use client";
import React, { useState } from "react";

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

type Codespace = {
    id: string;
    display_name: string;
    name: string;
    state: string;
    web_url: string;
    // Ajoute d'autres champs si besoin
};

export function ProjectsItems({ projects }: { projects: ProjectItemProps[] }) {
    const [codespacesMap, setCodespacesMap] = useState<Record<string, Codespace[]>>({});
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
    const [errorMap, setErrorMap] = useState<Record<string, string>>({});
    const [creatingMap, setCreatingMap] = useState<Record<string, boolean>>({});
    const [createErrorMap, setCreateErrorMap] = useState<Record<string, string>>({});

    // Rafraîchir la liste des Codespaces pour un repo
    async function refreshCodespaces(owner: string, repo: string, fullName: string) {
        setLoadingMap((prev) => ({ ...prev, [fullName]: true }));
        setErrorMap((prev) => ({ ...prev, [fullName]: "" }));
        try {
            const res = await fetch(`/api/codespaces?owner=${owner}&repo=${repo}`);
            const data = await res.json();
            if (!data.ok) throw new Error(data.error || "Erreur inconnue");
            setCodespacesMap((prev) => ({ ...prev, [fullName]: data.data }));
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setErrorMap((prev) => ({ ...prev, [fullName]: error.message || "Erreur Codespaces" }));
        } finally {
            setLoadingMap((prev) => ({ ...prev, [fullName]: false }));
        }
    }

    // Création d'un Codespace via l'API
    async function handleCreateCodespace(owner: string, repo: string, fullName: string) {
        setCreatingMap((prev) => ({ ...prev, [fullName]: true }));
        setCreateErrorMap((prev) => ({ ...prev, [fullName]: "" }));
        try {
            const res = await fetch("/api/codespaces/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ owner, repo })
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error || "Erreur création Codespace");
            // Succès : rafraîchir la liste
            await refreshCodespaces(owner, repo, fullName);
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setCreateErrorMap((prev) => ({ ...prev, [fullName]: error.message || "Erreur création Codespace" }));
        } finally {
            setCreatingMap((prev) => ({ ...prev, [fullName]: false }));
        }
    }
    return (
        <>
            {null}
            <ul className="repo-grid">
                {projects.map((project) => {
                    const codespacesUrl = project.full_name
                        ? `https://github.com/codespaces/new?repo=${project.full_name}`
                        : project.html_url.replace('github.com/', 'github.com/codespaces/new?repo=');
                    const codespaces = project.full_name ? codespacesMap[project.full_name] : undefined;
                    const loading = project.full_name ? loadingMap[project.full_name] : false;
                    const error = project.full_name ? errorMap[project.full_name] : "";
                    const creating = project.full_name ? creatingMap[project.full_name] : false;
                    const createError = project.full_name ? createErrorMap[project.full_name] : "";
                    return (
                        <li key={project.id} className="repo-card" style={{ marginBottom: 24, padding: 20, borderRadius: 12, boxShadow: '0 2px 8px #0001', background: '#fff' }}>
                            <div className="repo-card-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                <div>
                                    <h3 className="repo-title" style={{ margin: 0, fontSize: 20 }}>{project.name}</h3>
                                </div>
                                {project.full_name && (
                                    <button
                                        className="button-primary"
                                        style={{ minWidth: 120, opacity: creating ? 0.7 : 1 }}
                                        disabled={creating}
                                        title="Créer un Codespace via l'API GitHub"
                                        onClick={e => {
                                            e.preventDefault();
                                            const [owner, repo] = project.full_name!.split("/");
                                            handleCreateCodespace(owner, repo, project.full_name!);
                                        }}
                                    >
                                        {creating ? "Création..." : "Créer Codespace"}
                                    </button>
                                )}
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
                                            {codespaces.map((cs: Codespace) => (
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
                            {createError && (
                                <div style={{ color: "#c00", marginTop: 4 }}>{createError}</div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </>
    );
}