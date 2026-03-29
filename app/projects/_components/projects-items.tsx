"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";

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
};

export function ProjectsItems({ projects }: { projects: ProjectItemProps[] }) {
    const [codespacesMap, setCodespacesMap] = useState<Record<string, Codespace[]>>({});
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
    const [errorMap, setErrorMap] = useState<Record<string, string>>({});
    const [creatingMap, setCreatingMap] = useState<Record<string, boolean>>({});
    const [createErrorMap, setCreateErrorMap] = useState<Record<string, string>>({});
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

    const fetchedOnce = useRef<Record<string, boolean>>({});

    const fetchRepoCodespaces = useCallback(async (fullName: string) => {
        const [owner, repo] = fullName.split("/");
        setLoadingMap((prev) => ({ ...prev, [fullName]: true }));
        try {
            const res = await fetch(`/api/codespaces?owner=${owner}&repo=${repo}`);
            const data = await res.json();
            if (!data.ok) throw new Error(data.error || "Erreur chargement");
            setCodespacesMap((prev) => ({ ...prev, [fullName]: data.data.codespaces || [] }));
            setErrorMap((prev) => ({ ...prev, [fullName]: "" }));
        } catch (err) {
            setErrorMap((prev) => ({ ...prev, [fullName]: err instanceof Error ? err.message : "Erreur" }));
        } finally {
            setLoadingMap((prev) => ({ ...prev, [fullName]: false }));
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        projects.forEach((p) => {
            if (p.full_name && !fetchedOnce.current[p.full_name]) {
                fetchRepoCodespaces(p.full_name);
                fetchedOnce.current[p.full_name] = true;
            }
        });
    }, [projects, fetchRepoCodespaces]);

    // Polling for transitional states
    useEffect(() => {
        const interval = setInterval(() => {
            Object.keys(codespacesMap).forEach((fullName) => {
                const list = codespacesMap[fullName];
                const hasTransition = list.some(cs => ["Provisioning", "Starting", "ShuttingDown"].includes(cs.state));
                if (hasTransition) {
                    fetchRepoCodespaces(fullName);
                }
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [codespacesMap, fetchRepoCodespaces]);

    async function handleCreateCodespace(repositoryId: number, fullName: string) {
        setCreatingMap((prev) => ({ ...prev, [fullName]: true }));
        setCreateErrorMap((prev) => ({ ...prev, [fullName]: "" }));
        try {
            const res = await fetch("/api/codespaces/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repositoryId })
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error || "Erreur lors de la création");
            
            // Recharger et surveiller
            await fetchRepoCodespaces(fullName);
        } catch (err) {
            setCreateErrorMap((prev) => ({ ...prev, [fullName]: err instanceof Error ? err.message : "Erreur" }));
        } finally {
            setCreatingMap((prev) => ({ ...prev, [fullName]: false }));
        }
    }

    async function handleAction(fullName: string, codespaceName: string, action: 'start' | 'stop' | 'delete') {
        const key = `${fullName}-${codespaceName}-${action}`;
        setActionLoading(prev => ({ ...prev, [key]: true }));
        try {
            const method = action === 'delete' ? 'DELETE' : 'POST';
            const res = await fetch(`/api/codespaces/${codespaceName}/${action}`, { method });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error || `Erreur ${action}`);
            await fetchRepoCodespaces(fullName);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erreur action");
        } finally {
            setActionLoading(prev => ({ ...prev, [key]: false }));
        }
    }

    return (
        <ul className="repo-grid">
            {projects.map((project) => {
                const fullName = project.full_name || "";
                const codespaces = codespacesMap[fullName] || [];
                const loading = loadingMap[fullName] || false;
                const error = errorMap[fullName] || "";
                const creating = creatingMap[fullName] || false;
                const createError = createErrorMap[fullName] || "";

                return (
                    <li key={project.id} className="repo-card" style={{ marginBottom: 24, padding: 20, borderRadius: 12, boxShadow: '0 2px 8px #0001', background: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                            <div>
                                <h3 className="repo-title" style={{ margin: 0, fontSize: 20 }}>{project.name}</h3>
                                {fullName && <p style={{ margin: '4px 0', color: '#666', fontSize: 13 }}>{fullName}</p>}
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="button-secondary" style={{ padding: '6px 12px' }}>
                                    GitHub
                                </a>
                                {fullName && (
                                    <button
                                        className="button-primary"
                                        style={{ minWidth: 120 }}
                                        disabled={creating}
                                        onClick={() => handleCreateCodespace(Number(project.id), fullName)}
                                    >
                                        {creating ? "Création..." : "Nouveau Codespace"}
                                    </button>
                                )}
                            </div>
                        </div>

                        {fullName && (
                            <div className="codespaces-section" style={{ marginTop: 20, borderTop: '1px solid #eee', paddingTop: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <h4 style={{ margin: 0, fontSize: 15, color: '#333' }}>Workspaces actifs</h4>
                                    {loading && <span style={{ fontSize: 12, color: '#999' }}>Mise à jour...</span>}
                                </div>

                                {error && <div style={{ color: '#c00', fontSize: 12, marginBottom: 8 }}>{error}</div>}
                                {createError && <div style={{ color: '#c00', fontSize: 12, marginBottom: 8 }}>{createError}</div>}

                                {codespaces.length === 0 && !loading && (
                                    <p style={{ margin: 0, color: '#999', fontSize: 13, fontStyle: 'italic' }}>Aucun Codespace pour ce projet.</p>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {codespaces.map((cs) => {
                                        const isStable = cs.state === "Available";
                                        const isOff = cs.state === "Shutdown";
                                        
                                        return (
                                            <div key={cs.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f9fafb', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: 14 }}>{cs.display_name || cs.name}</div>
                                                    <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: isStable ? '#10b981' : (isOff ? '#9ca3af' : '#f59e0b') }}></span>
                                                        {cs.state}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    {isStable && cs.web_url && (
                                                        <a href={`/workspace/${cs.name}`} className="button-primary" style={{ padding: '4px 10px', fontSize: 12 }}>
                                                            Ouvrir
                                                        </a>
                                                    )}
                                                    {isStable && (
                                                        <button 
                                                            onClick={() => handleAction(fullName, cs.name, 'stop')}
                                                            disabled={actionLoading[`${fullName}-${cs.name}-stop`]}
                                                            className="button-secondary" 
                                                            style={{ padding: '4px 10px', fontSize: 12 }}
                                                        >
                                                            Arrêter
                                                        </button>
                                                    )}
                                                    {isOff && (
                                                        <button 
                                                            onClick={() => handleAction(fullName, cs.name, 'start')}
                                                            disabled={actionLoading[`${fullName}-${cs.name}-start`]}
                                                            className="button-primary" 
                                                            style={{ padding: '4px 10px', fontSize: 12, background: '#444' }}
                                                        >
                                                            Démarrer
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => { if(confirm('Supprimer ce Codespace ?')) handleAction(fullName, cs.name, 'delete') }}
                                                        disabled={actionLoading[`${fullName}-${cs.name}-delete`]}
                                                        className="button-secondary" 
                                                        style={{ padding: '4px 10px', fontSize: 12, color: '#c00' }}
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}