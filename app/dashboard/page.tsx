import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchGitHubUser } from "@/lib/github";
import { requireAccessToken } from "@/lib/auth/session";

export default async function DashboardPage() {
  const accessToken = await requireAccessToken("/");

  let user;

  try {
    user = await fetchGitHubUser(accessToken);
  } catch {
    redirect("/");
  }

  return (
    <main className="page-shell">
      <section className="page-header">
        <div>
          <div className="eyebrow">Session active</div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            La connexion GitHub est validee. Ce dashboard sert de point d&apos;entree vers tes projets et vers les futures
            actions produit: creer, reprendre et ouvrir un environnement.
          </p>
        </div>

        <div className="page-header-actions">
          <Link href="/projects" className="button-primary">
            Voir mes projets
          </Link>
          <form action="/api/auth/logout" method="post">
            <button type="submit" className="logout-button">
              Se deconnecter
            </button>
          </form>
        </div>
      </section>

      <section className="profile-card">
        <div className="profile-head">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={`Avatar GitHub de ${user.login}`}
              className="avatar"
              width={88}
              height={88}
            />
          ) : (
            <div className="avatar-fallback">{user.login.slice(0, 2).toUpperCase()}</div>
          )}

          <div>
            <p className="status-pill status-live">Connexion reussie</p>
            <h2 className="profile-name">{user.name || user.login}</h2>
            <p className="muted">@{user.login}</p>
            <a href={user.html_url} target="_blank" rel="noreferrer" className="profile-link">
              Voir le profil GitHub
            </a>
          </div>
        </div>
      </section>

      <section className="stat-grid" style={{ marginTop: "18px" }}>
        <article className="stat-card">
          <p className="stat-value">{user.public_repos}</p>
          <div className="stat-label">repositories publics visibles</div>
        </article>
        <article className="stat-card">
          <p className="stat-value">{user.followers}</p>
          <div className="stat-label">followers GitHub</div>
        </article>
        <article className="stat-card">
          <p className="stat-value">OK</p>
          <div className="stat-label">etat de session serveur</div>
        </article>
      </section>

      <section className="quick-actions" style={{ marginTop: "18px" }}>
        <article className="section-card">
          <h2 className="section-title">Prochaine action utile</h2>
          <p className="section-note">
            Le produit a maintenant depasse le simple login. La suite logique consiste a explorer les repositories et a
            preparer l&apos;ouverture ou la creation de projet.
          </p>
          <div className="button-row" style={{ marginTop: "16px" }}>
            <Link href="/projects" className="button-primary">
              Explorer mes projets
            </Link>
          </div>
        </article>

        <article className="section-card">
          <h2 className="section-title">Ce que cette page confirme</h2>
          <p className="section-note">
            Auth GitHub, lecture du profil, session cookie et protection des routes sont en place. La base technique est
            donc assez solide pour attaquer la suite du produit.
          </p>
        </article>
      </section>
    </main>
  );
}
