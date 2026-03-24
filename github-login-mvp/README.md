# GitHub Login MVP (Codespaces)

Ce projet implemente une connexion GitHub OAuth avec Next.js (App Router).
Le but est de se connecter avec GitHub, recuperer le profil utilisateur et proteger la page dashboard.

## Prerequis

- Un compte GitHub
- Un Codespace actif
- Node.js et npm disponibles

## 1) Installer et lancer le projet

1. Installer les dependances:

```bash
npm install
```

2. Lancer l'application:

```bash
npm run dev
```

3. Ouvrir l'onglet PORTS dans Codespaces:
- Barre en bas: PORTS
- Si absent: Ctrl+Shift+P puis `Ports: Focus on Ports View`

4. Recuperer l'URL du port 3000 (URL publique de l'app):
- Copier l'URL de la ligne `3000`
- Option tablette: mettre la visibilite du port en `Public`

Exemple de forme:

```text
https://<url-forwardee-port-3000>.app.github.dev
```

## 2) Creer l'OAuth App GitHub (obtenir les cles)

1. Aller sur la page GitHub OAuth Apps:
   - https://github.com/settings/developers
2. Cliquer sur `New OAuth App`.
3. Remplir:
   - Application name: `github-login-mvp-codespaces`
   - Homepage URL: `URL_DU_PORT_3000`
   - Authorization callback URL: `URL_DU_PORT_3000/api/auth/github/callback`
4. Valider puis copier:
   - `Client ID`
   - `Client Secret` (Generate a new client secret)

## 3) Ajouter les cles dans GitHub Settings (recommande)

Au lieu de stocker des secrets dans le repo, utilisez les Codespaces Secrets.

1. Aller dans GitHub Settings > Codespaces > Secrets
2. Creer ces secrets
3. Si GitHub refuse les noms avec `GITHUB`, vous pouvez utiliser les noms plus courts ci-dessous
3. Donner l'acces a ce repository
4. Redemarrer/recreer le Codespace pour charger les variables

Noms acceptes par le projet:

```text
GITHUB_CLIENT_ID ou CLIENT_ID
GITHUB_CLIENT_SECRET ou CLIENT_SECRET
NEXT_PUBLIC_APP_URL ou APP_URL
GITHUB_REDIRECT_URI ou REDIRECT_URI
```

Valeurs attendues:

```text
GITHUB_CLIENT_ID=<Client ID OAuth App>
GITHUB_CLIENT_SECRET=<Client Secret OAuth App>
NEXT_PUBLIC_APP_URL=https://<url-forwardee-port-3000>.app.github.dev
GITHUB_REDIRECT_URI=https://<url-forwardee-port-3000>.app.github.dev/api/auth/github/callback
```

Exemple si vous utilisez les noms courts:

```text
CLIENT_ID=<Client ID OAuth App>
CLIENT_SECRET=<Client Secret OAuth App>
APP_URL=https://<url-forwardee-port-3000>.app.github.dev
REDIRECT_URI=https://<url-forwardee-port-3000>.app.github.dev/api/auth/github/callback
```

Puis relancer l'app:

```bash
npm run dev
```

## 4) Tester l'application

1. Ouvrir l'URL publique de l'app
2. Cliquer `Se connecter avec GitHub`
3. Autoriser l'application GitHub
4. Verifier la redirection vers `/dashboard`
5. Verifier les infos utilisateur affichees
6. Tester `Se deconnecter`
7. Ouvrir `/api/me`:
   - connecte: `authenticated: true`
   - deconnecte: `401` et `authenticated: false`

## 5) Depannage rapide

- Erreur `redirect_uri_mismatch`:
  - verifier que callback GitHub et `GITHUB_REDIRECT_URI` sont strictement identiques
- Erreur variables manquantes:
   - verifier les 4 secrets Codespaces puis redemarrer le Codespace ou `npm run dev`
- Dashboard inaccessible:
  - verifier cookie session et refaire le login

## 6) Securite importante

- Ne jamais partager `GITHUB_CLIENT_SECRET`
- Si le secret fuit, le regenerer immediatement dans l'OAuth App
- En production, preferer une session serveur plutot que token brut en cookie

## Liens utiles

- New OAuth App: https://github.com/settings/applications/new
- Developer settings: https://github.com/settings/developers
- Docs OAuth Apps GitHub: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
- Port forwarding Codespaces: https://docs.github.com/en/codespaces/developing-in-a-codespace/forwarding-ports-in-your-codespace
- API GitHub /user: https://docs.github.com/en/rest/users/users#get-the-authenticated-user
