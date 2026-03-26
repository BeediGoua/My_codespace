"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProjectPage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("nextjs");
    const [privateRepo, setPrivateRepo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const res = await fetch("/api/projects/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description, type, private: privateRepo }),
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error || "Erreur creation repository");
            setSuccess(true);
            setTimeout(() => router.push("/projects"), 1200);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur inconnue";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="page-shell">
            <section className="page-header">
                <div>
                    <div className="eyebrow">Nouveau projet</div>
                    <h1 className="page-title">Creer un nouveau repository GitHub</h1>
                    <p className="page-subtitle">
                        Remplis le formulaire pour generer un nouveau projet sur ton compte GitHub. Cette etape va preparer la base pour un environnement pret a coder.
                    </p>
                </div>
                <div className="page-header-actions">
                    <Link href="/projects" className="button-secondary">
                        Retour projets
                    </Link>
                </div>
            </section>

            <section className="section-card" style={{ maxWidth: 480, margin: "0 auto" }}>
                <h2 className="section-title">Formulaire de creation</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="repo-name">Nom du repository</label>
                        <input
                            id="repo-name"
                            name="repo-name"
                            type="text"
                            className="form-input"
                            placeholder="ex: mon-nouveau-projet"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="repo-desc">Description (optionnel)</label>
                        <input
                            id="repo-desc"
                            name="repo-desc"
                            type="text"
                            className="form-input"
                            placeholder="Description du projet"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="repo-type">Type de projet</label>
                        <select
                            id="repo-type"
                            name="repo-type"
                            className="form-input"
                            value={type}
                            onChange={e => setType(e.target.value)}
                            disabled={loading}
                        >
                            <option value="nextjs">Next.js</option>
                            <option value="python">Python</option>
                            <option value="datascience">Data Science</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="private"
                                checked={privateRepo}
                                onChange={e => setPrivateRepo(e.target.checked)}
                                disabled={loading}
                            /> Rendre le repository prive
                        </label>
                    </div>

                    <button type="submit" className="button-primary" style={{ marginTop: 16 }} disabled={loading}>
                        {loading ? "Creation..." : "Creer le projet"}
                    </button>
                </form>
                {error && <div className="form-error" style={{ marginTop: 12 }}>{error}</div>}
                {success && <div className="form-success" style={{ marginTop: 12 }}>Repository cree ! Redirection...</div>}
            </section>
        </main>
    );
}
