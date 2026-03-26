# Codespace Launcher

Application web Next.js qui sert de point d'entree vers GitHub et, a terme, vers GitHub Codespaces.

L'objectif produit est simple :

passer rapidement de l'idee d'un projet a un environnement pret a coder, sans friction inutile.

Aujourd'hui, le projet couvre deja :

- la connexion GitHub OAuth
- la session utilisateur via cookie HttpOnly
- un dashboard protege
- une page Mes projets qui liste les repositories GitHub
- recherche, filtres, tri et pagination sur les projets

Le projet n'est pas encore le produit final. C'est une base fonctionnelle solide pour aller vers :

- creation rapide de projet
- templates de demarrage
- lancement/reprise de Codespaces
- ouverture rapide d'un workspace depuis navigateur ou tablette

## Vision produit

Le probleme vise n'est pas seulement de se connecter a GitHub.

Le vrai sujet est de reduire la friction entre :

- une idee
- un repository GitHub
- un environnement de travail
- la reprise de ce travail depuis n'importe quel appareil

La cible finale est donc un launcher/orchestrateur GitHub + Codespaces, pas un simple MVP de login.

## Etat actuel

Fonctionnalites deja disponibles :

- login GitHub OAuth
- callback OAuth GitHub
- route de deconnexion
- route API `/api/me`
- route API `/api/repos`
- dashboard protege
- page `/projects` protegee
- recherche, filtre public/prive, filtre fork/non-fork, tri et pagination cote client

Fonctionnalites encore manquantes :

- creation de repository depuis l'application
- templates de projet
- creation ou reprise de Codespaces
- favoris, recents, statut d'environnement
- UX produit plus ambitieuse

## Stack

Technologies actuellement utilisees :

- Next.js 15
- React 19
- TypeScript
- Node.js
- npm
- GitHub OAuth
- GitHub REST API

Structure generale :

- `app/` : pages UI + routes API
- `lib/` : logique partagee (GitHub, env, session)
- `middleware.ts` : protection des routes privees
- `DOCS/` : documentation produit, technique, debug et architecture

## Prerequis

- un compte GitHub
- Node.js LTS installe (22.x ou 24.x recommande)
- npm disponible

Important :

- eviter Node 25.x sur ce projet
- si tu alternes entre local et Codespaces, utilise idealement 2 OAuth Apps distinctes

## Demarrage rapide en local

1. Installer les dependances

```bash
npm install
```

2. Configurer `.env.local`

```env
GITHUB_CLIENT_ID=TON_CLIENT_ID
GITHUB_CLIENT_SECRET=TON_CLIENT_SECRET
NEXT_PUBLIC_APP_URL=http://localhost:3000
GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/github/callback
```

3. Configurer l'OAuth App GitHub

- Homepage URL : `http://localhost:3000`
- Authorization callback URL : `http://localhost:3000/api/auth/github/callback`

4. Lancer l'application

```bash
npm run dev
```

5. Ouvrir

```text
http://localhost:3000
```

## Demarrage en Codespaces

1. Lancer l'application

```bash
npm install
npm run dev
```

2. Ouvrir l'onglet `PORTS`

3. Recuperer l'URL publique du port `3000`

Exemple :

```text
https://<url-forwardee-port-3000>.app.github.dev
```

4. Configurer l'OAuth App Codespaces avec cette URL

- Homepage URL : `URL_DU_PORT_3000`
- Authorization callback URL : `URL_DU_PORT_3000/api/auth/github/callback`

5. Configurer les secrets Codespaces avec les memes valeurs

```text
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
NEXT_PUBLIC_APP_URL
GITHUB_REDIRECT_URI
```

## Tester l'application

Parcours conseille :

1. Ouvrir `/`
2. Cliquer sur `Se connecter avec GitHub`
3. Verifier la redirection vers `/dashboard`
4. Verifier les informations utilisateur
5. Cliquer sur `Voir mes projets`
6. Tester recherche, filtres, tri et pagination sur `/projects`
7. Ouvrir `/api/me`
8. Ouvrir `/api/repos`

Comportement attendu :

- non connecte : routes protegees redirigees ou reponses `401`
- connecte : dashboard et projets accessibles

## Contrat API actuel

Les routes internes utilisent une forme commune.

Succes :

```json
{
   "ok": true,
   "authenticated": true,
   "data": {}
}
```

Erreur :

```json
{
   "ok": false,
   "authenticated": false,
   "error": {
      "code": "UNAUTHENTICATED",
      "message": "Aucune session active."
   }
}
```

## Ce que le projet prouve deja

Le projet montre deja qu'on sait :

- connecter proprement une application a GitHub
- gerer un flux OAuth minimal et fonctionnel
- proteger des pages applicatives
- organiser une base Next.js exploitable
- brancher une vraie lecture des repositories utilisateur

## Priorite suivante

La suite logique n'est plus l'authentification.

La prochaine etape produit est :

1. ajouter un vrai bouton `Nouveau projet`
2. creer un flux de creation de repository
3. preparer l'ouverture d'un projet dans Codespaces

## Depannage rapide

### `redirect_uri_mismatch`

Verifier que :

- la callback GitHub OAuth
- `GITHUB_REDIRECT_URI`

sont strictement identiques.

### 404 sur callback OAuth

Cause probable :

- URL Codespaces ancienne ou inactive

Correction :

- mettre a jour l'URL du port 3000 dans l'OAuth App
- mettre a jour `NEXT_PUBLIC_APP_URL` et `GITHUB_REDIRECT_URI`

### `next` non reconnu ou dependances cassees

Verifier :

- version Node LTS
- reinstallation propre avec `npm install`

### bug en mode `dev` avec Node 25

Correction :

- revenir sur Node 22.x ou 24.x

## Securite

- ne jamais partager `GITHUB_CLIENT_SECRET`
- regenerer le secret s'il a fuite
- en production, preferer une vraie session serveur opaque plutot qu'un token brut en cookie

## Documentation utile

- `DOCS/PROJECT_STATUS.md` : etat d'avancement produit
- `DOCS/ARCHITECTURE_LITE.md` : vue d'architecture simple
- `DOCS/ETAPES_REELLES_WINDOWS.md` : remise en etat environnement Windows
- `DOCS/GUIDE_TESTS_ET_DEBUG.md` : tests et debug
- `DOCS/OAUTH_LOCAL_CODESPACES.md` : strategie OAuth local/Codespaces
- `DOCS/TECHNO_TYPESCRIPT_NODE_NPM.md` : stack et explications detaillees

## Liens utiles

- GitHub OAuth Apps : https://github.com/settings/developers
- New OAuth App : https://github.com/settings/applications/new
- Docs OAuth Apps GitHub : https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
- Docs GitHub Codespaces : https://docs.github.com/en/codespaces
- API GitHub `/user` : https://docs.github.com/en/rest/users/users#get-the-authenticated-user
- API GitHub repositories : https://docs.github.com/en/rest/repos/repos#list-repositories-for-the-authenticated-user
