# Tests end-to-end (e2e)

> Ce dossier contient les tests e2e Playwright simulant un parcours utilisateur complet (mock OAuth, mock API GitHub).

## Fichiers présents
- `main-flow.spec.ts` : test e2e principal (mock complet)
- `main-flow-mock.spec.ts` : variante du test principal
- `dashboard.spec.ts` : test la navigation dashboard
- `home.spec.ts` : test la page d'accueil
- `codespaces-ui.spec.ts` : test l'affichage des Codespaces
- `create-project.spec.ts` : test la création de projet via l'UI
- `helpers/` : helpers Playwright pour injection de session, etc.

## Lancer les tests e2e

1. Démarrer le serveur Next.js en mode test :
   ```bash
   TEST_MODE=1 npm run dev
   ```
2. Ouvrir un autre terminal et lancer :
   ```bash
   npx playwright test tests/e2e
   ```

> Les tests e2e utilisent des mocks pour GitHub et OAuth, ce qui permet des tests rapides et isolés.

## Améliorations futures

- **CI/CD** : Exécuter les tests e2e dans GitHub Actions (headless, containers).
- **Coverage UI** : Ajouter la couverture de code front-end (Playwright + Istanbul).
- **Tests réels GitHub** : Ajouter des scénarios e2e avec authentification et API GitHub réelle (tokens de test, nettoyage automatique).
- **Tests multi-navigateurs** : Étendre les tests à d'autres navigateurs (Firefox, WebKit).
- **Tests accessibilité** : Ajouter des tests d'accessibilité automatisés (axe, pa11y).
- **Badges** : Afficher les badges de build, coverage, etc. dans le README principal.
