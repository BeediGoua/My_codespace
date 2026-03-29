// app/workspace/[name]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type Codespace = {
    id: string;
    display_name: string;
    name: string;
    state: string;
    web_url: string;
};

export default function WorkspacePage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = React.use(params);
    const [codespace, setCodespace] = useState<Codespace | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [redirecting, setRedirecting] = useState(false);
    const handleAutoLaunch = React.useCallback((url: string) => {
        if (!redirecting) {
            setRedirecting(true);
            window.location.href = url;
        }
    }, [redirecting]);

    const fetchStatus = React.useCallback(async () => {
        try {
            const res = await fetch(`/api/codespaces/${name}`);
            const data = await res.json();
            if (!data.ok) throw new Error(data.error || "Erreur chargement");
            setCodespace(data.data);
            
            if (data.data.state === "Available" && data.data.web_url) {
                handleAutoLaunch(data.data.web_url);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur");
        } finally {
            setLoading(false);
        }
    }, [name, handleAutoLaunch]);

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, [fetchStatus]);

    if (loading && !codespace) return (
        <div style={{ padding: 60, textAlign: 'center', background: '#1e1e1e', height: '100vh', color: '#fff' }}>
            <div className="spinner" style={{ marginBottom: 20 }}>🔄</div>
            <h2>Initialisation de la connexion...</h2>
        </div>
    );

    if (error) return (
        <div style={{ padding: 40, textAlign: 'center', background: '#1e1e1e', height: '100vh', color: '#fff' }}>
            <h2 style={{ color: '#ff4d4d' }}>Erreur de connexion</h2>
            <p>{error}</p>
            <Link href="/projects" style={{ color: '#0066cc', textDecoration: 'underline', marginTop: 20, display: 'inline-block' }}>Retour aux projets</Link>
        </div>
    );

    const isAvailable = codespace?.state === "Available";

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#1e1e1e', color: '#fff', fontFamily: 'sans-serif' }}>
            <header style={{ padding: '12px 24px', background: '#2d2d2d', borderBottom: '1px solid #3d3d3d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Link href="/projects" style={{ color: '#ccc', textDecoration: 'none', fontSize: 13, background: '#444', padding: '6px 12px', borderRadius: 6 }}>
                        &larr; Projets
                    </Link>
                    <h1 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>{codespace?.display_name || codespace?.name}</h1>
                    <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 12, background: isAvailable ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                        {codespace?.state}
                    </span>
                </div>
                <div style={{ fontSize: 12, color: '#888' }}>
                    Codespace Launcher Security Bridge
                </div>
            </header>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 40 }}>
                {isAvailable ? (
                    <div style={{ maxWidth: 500 }}>
                        <div style={{ fontSize: 48, marginBottom: 24 }}>🚀</div>
                        <h2 style={{ fontSize: 24, marginBottom: 16 }}>Prêt à décoller !</h2>
                        <p style={{ color: '#aaa', lineHeight: 1.6, marginBottom: 32 }}>
                            GitHub bloque l&apos;affichage direct de VS Code dans une fenêtre tierce pour votre sécurité. 
                            Le workspace va s&apos;ouvrir dans un onglet dédié.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <a 
                                href={codespace?.web_url} 
                                className="button-primary" 
                                style={{ padding: '14px 28px', fontSize: 16, borderRadius: 8, background: '#007acc', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}
                            >
                                Ouvrir le Workspace maintenant
                            </a>
                            <p style={{ fontSize: 12, color: '#666' }}>
                                Si rien ne se passe, vérifiez que votre navigateur ne bloque pas les redirections.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div style={{ maxWidth: 500 }}>
                        <div style={{ fontSize: 48, marginBottom: 24, animation: 'pulse 2s infinite' }}>⏳</div>
                        <h2 style={{ fontSize: 24, marginBottom: 16 }}>Préparation du Workspace...</h2>
                        <p style={{ color: '#aaa', lineHeight: 1.6 }}>
                            État actuel : <strong style={{ color: '#f59e0b' }}>{codespace?.state}</strong>
                        </p>
                        <p style={{ color: '#666', marginTop: 24, fontSize: 14 }}>
                            Dès que la machine sera prête, vous serez automatiquement redirigé vers l&apos;interface VS Code.
                        </p>
                    </div>
                )}
            </main>

            <footer style={{ padding: '12px', background: '#1a1a1a', borderTop: '1px solid #333', fontSize: 12, color: '#555', textAlign: 'center' }}>
                &copy; 2026 Codespace Launcher &bull; Architecture OAuth &bull; GitHub REST API
            </footer>

            <style jsx>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
