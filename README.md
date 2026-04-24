# Codespace Launcher

**Passez de l’idée à un environnement prêt à coder sur GitHub, sans friction.**

---

## Présentation

Codespace Launcher est une application web Next.js qui simplifie la création, la gestion et l’ouverture de projets GitHub et Codespaces, depuis n’importe quel appareil (PC, tablette, navigateur).

Le but : permettre à tout utilisateur de créer un projet, de le configurer, puis de l’ouvrir ou le reprendre dans un environnement cloud prêt à coder, en quelques clics.

---

## Fonctionnalités principales

- Connexion sécurisée via GitHub OAuth
- Dashboard utilisateur protégé
- Liste interactive de vos repositories GitHub
- Recherche, filtres, tri et pagination sur vos projets
- Création rapide de repository GitHub (formulaire intégré)
- Actions rapides : ouvrir sur GitHub, ouvrir/créer/reprendre dans Codespaces
- Génération automatique de structure de projet selon le type choisi 
- Suivi de l’état d’environnement 
- Interface responsive adaptée tablette/mobile 

---

## Schéma fonctionnel

```mermaid
flowchart TD
    A[Idée de projet] --> B[Création du repository GitHub]
    B --> C[Choix du template (Next.js, Python, Data Science...)]
    C --> D[Génération de la structure de base]
    D --> E[Ouverture ou création d’un Codespace]
    E --> F[Environnement prêt à coder]
    F --> G[Reprise du travail sur tout appareil]
```

---

## Démarrage rapide

### Prérequis
- Un compte GitHub
- Node.js LTS (22.x ou 24.x recommandé)
- npm

### Installation

```bash
git clone https://github.com/<owner>/<repo>.git
cd <repo>
npm install
cp .env.local.example .env.local
# Renseigne tes secrets GitHub dans .env.local
npm run lint
npm run build
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

### Configuration OAuth
- Crée une OAuth App sur GitHub ([docs](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app))
- Renseigne les variables dans `.env.local` :
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`
  - `NEXT_PUBLIC_APP_URL`
  - `GITHUB_REDIRECT_URI`

---

## Utilisation

1. Clique sur “Se connecter avec GitHub”
2. Explore le dashboard et la page “Mes projets”
3. Crée un nouveau projet, teste les actions Codespaces
4. Reprends ou crée un Codespace pour chaque projet
5. Profite d’un environnement cloud prêt à coder

---

## Documentation

- [Guide débutant](DOCS/GUIDE_DEBUTANT_PROJET.md)
- [Statut du projet](DOCS/PROJECT_STATUS.md)
- [Architecture](DOCS/ARCHITECTURE_LITE.md)
- [Debug & tests](DOCS/GUIDE_TESTS_ET_DEBUG.md)
- [OAuth local/Codespaces](DOCS/OAUTH_LOCAL_CODESPACES.md)

---

## Roadmap (vision finale)

1. Orchestration Codespaces (API, état, reprise)
2. Génération automatique de structure selon le type de projet
3. UX mobile/tablette optimisée
4. Sécurité renforcée (GitHub App, session serveur)
5. Ajout de fichiers, notebooks, favoris, historique

---

## Stack technique

- Next.js 15
- React 19
- TypeScript
- Node.js
- GitHub OAuth & REST API

Structure :
- `app/` : pages UI + routes API
- `lib/` : logique partagée (GitHub, env, session)
- `middleware.ts` : protection des routes privées
- `DOCS/` : documentation produit, technique, debug et architecture

---

## Sécurité

- Ne jamais partager `GITHUB_CLIENT_SECRET`
- Regénérer le secret s’il a fuité
- En production, préférer une vraie session serveur opaque plutôt qu’un token brut en cookie

---

## Contribuer

Les contributions sont les bienvenues !
- Forkez le projet
- Ouvrez une issue ou une pull request
- Proposez des idées ou des améliorations

---

## Licence

MIT

---

## Liens utiles

- [GitHub OAuth Apps](https://github.com/settings/developers)
- [Créer une OAuth App](https://github.com/settings/applications/new)
- [Docs OAuth Apps GitHub](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
- [Docs GitHub Codespaces](https://docs.github.com/en/codespaces)
- [API GitHub `/user`](https://docs.github.com/en/rest/users/users#get-the-authenticated-user)
- [API GitHub repositories](https://docs.github.com/en/rest/repos/repos#list-repositories-for-the-authenticated-user)

---

> Ce projet est en développement actif. Forkez, testez, proposez des idées !
