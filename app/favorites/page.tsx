"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

// Type déjà utilisé dans projects-items.tsx
export type ProjectItemProps = {
    id: number | string;
    name: string;
    full_name?: string;
    description?: string | null;
    html_url: string;
    private: boolean;
    language?: string | null;
    updated_at: string;
};

type Favorite = {
    user: string;
    project: string;
    createdAt: string;
};

export default function FavoritesPage() {
    const user = "demo-user"; // À remplacer par l'utilisateur connecté
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [projects, setProjects] = useState<ProjectItemProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavoritesAndProjects = async () => {
            setLoading(true);
            const favRes = await fetch("/api/favorites");
            const favData = await favRes.json();
            const userFavs = favData.filter((f: Favorite) => f.user === user);
            setFavorites(userFavs);
            // Récupère tous les projets (API ou mock)
            const projRes = await fetch("/api/repos");
            const projData = await projRes.json();
            setProjects(projData.data?.repos || []);
            setLoading(false);
        };
        fetchFavoritesAndProjects();
    }, []);

    // Associe chaque favori à son projet
    const favProjects = favorites.map(fav =>
        projects.find(p => p.full_name === fav.project)
    ).filter(Boolean) as ProjectItemProps[];

    // Action pour retirer un favori
    const removeFavorite = async (projectFullName: string) => {
        await fetch("/api/favorites", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, project: projectFullName })
        });
        setFavorites(favorites.filter(f => f.project !== projectFullName));
    };

    // Action pour ouvrir Codespace (redirige vers la page codespace du projet)
    const openCodespace = (projectName: string) => {
        window.location.href = `/workspace/${projectName}`;
    };

    return (
        <main style={{ maxWidth: 800, margin: "40px auto", padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1>Mes Favoris</h1>
                <Link href="/projects" className="button-secondary" style={{ padding: '6px 12px' }}>
                    Retour aux projets
                </Link>
            </div>
            {loading ? (
                <p>Chargement...</p>
            ) : favProjects.length === 0 ? (
                <p>Aucun favori pour l&apos;instant.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {favProjects.map((project) => (
                        <li key={project.id} style={{ marginBottom: 24, padding: 20, borderRadius: 12, boxShadow: '0 2px 8px #0001', background: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{project.name}</h3>
                                    <p style={{ margin: '4px 0', color: '#666', fontSize: 13 }}>{project.full_name}</p>
                                    <p style={{ margin: '4px 0', color: '#888', fontSize: 13 }}>{project.description}</p>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="button-secondary" style={{ padding: '6px 12px' }}>
                                        GitHub
                                    </a>
                                    <a href={`/projects/${project.name}`} className="button-primary" style={{ padding: '6px 12px' }}>
                                        Voir projet
                                    </a>
                                    <button onClick={() => openCodespace(project.name)} className="button-secondary" style={{ padding: '6px 12px' }}>
                                        Ouvrir Codespace
                                    </button>
                                    <button onClick={() => removeFavorite(project.full_name || "")} className="button-secondary" style={{ padding: '6px 12px', color: '#c00' }}>
                                        Retirer des favoris
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
