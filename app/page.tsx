import Link from "next/link";

export default function HomePage() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">CL</div>
          <div>
            <div className="brand-title">Codespace Launcher</div>
            <div className="brand-subtitle">GitHub en point d&apos;entree vers un workspace pret.</div>
          </div>
        </div>

        <div className="topbar-badges">
          <span className="tag">OAuth GitHub</span>
          <span className="tag">Mes projets</span>
        </div>
      </header>

      <section className="hero-shell">
        <div className="hero-panel">
          <div className="eyebrow">Produit en construction, base fonctionnelle validee</div>
          <h1 className="hero-title">Passe de l&apos;idee au workspace en quelques clics.</h1>
          <p className="hero-subtitle">
            Connecte GitHub, retrouve tes repositories, filtre les projets utiles et prepare la suite: creation rapide,
            ouverture dans Codespaces et reprise de travail depuis n&apos;importe quel appareil.
          </p>

          <div className="hero-actions">
            <a href="/api/auth/github/login" className="button-primary">
              Se connecter avec GitHub
            </a>
            <Link href="/projects" className="button-secondary">
              Voir l&apos;orientation produit
            </Link>
          </div>

          <div className="hero-list">
            <article className="feature-card">
              <h2 className="feature-card-title">Connexion propre</h2>
              <p>OAuth GitHub, session securisee, pages protegees et base technique stable.</p>
            </article>
            <article className="feature-card">
              <h2 className="feature-card-title">Projets visibles</h2>
              <p>Liste des repositories avec recherche, tri, filtres public/prive et forks.</p>
            </article>
            <article className="feature-card">
              <h2 className="feature-card-title">Suite logique</h2>
              <p>Creation de projet, reprise d&apos;environnement et orchestration Codespaces a venir.</p>
            </article>
          </div>
        </div>

        <aside className="preview-panel surface-panel">
          <div>
            <div className="section-title">Parcours utilisateur</div>
            <p className="section-note">
              Une interface claire, avec peu d&apos;etapes, pour guider un utilisateur de GitHub vers son environnement.
            </p>
          </div>

          <div className="preview-window">
            <div className="preview-bar">
              <div className="preview-dots">
                <span />
                <span />
                <span />
              </div>
              <span className="tag">Preview</span>
            </div>

            <div className="preview-stack">
              <div className="preview-item">
                <strong>1. Connexion GitHub</strong>
                <p className="section-note">Authentication simple et session persistante.</p>
              </div>
              <div className="preview-item">
                <strong>2. Dashboard personnel</strong>
                <p className="section-note">Profil, point d&apos;entree et actions prioritaires.</p>
              </div>
              <div className="preview-item">
                <strong>3. Mes projets</strong>
                <p className="section-note">Trouver vite le bon repository avant la prochaine etape produit.</p>
              </div>
            </div>
          </div>

          <div className="stat-grid">
            <article className="stat-card">
              <p className="stat-value">1</p>
              <div className="stat-label">auth GitHub en place</div>
            </article>
            <article className="stat-card">
              <p className="stat-value">2</p>
              <div className="stat-label">lecture des repos fonctionnelle</div>
            </article>
            <article className="stat-card">
              <p className="stat-value">3</p>
              <div className="stat-label">orchestration Codespaces visee</div>
            </article>
          </div>
        </aside>
      </section>
    </main>
  );
}
