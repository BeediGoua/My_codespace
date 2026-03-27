# Tests d'intégration

> Ce dossier contient les tests d'intégration des routes API (projets, codespaces, etc.) avec mock des dépendances externes.

## Fichiers présents
- `api.codespaces.test.ts` : test l'API de listing des Codespaces (mock)
- `api.codespaces.error.test.ts` : test les erreurs de l'API Codespaces
- `api.projects.create.test.ts` : test la création de projet (mock)
- `api.repos.test.ts` : test l'API de listing des repos

## Lancer les tests d'intégration

1. Démarrer le serveur Next.js en mode test :
   ```bash
   TEST_MODE=1 npm run dev
   ```
2. Ouvrir un autre terminal et lancer :
   ```bash
   npx jest tests/integration
   ```

> Les tests d'intégration utilisent des mocks pour GitHub et OAuth, ils sont rapides et isolés.

## Améliorations futures

- **CI/CD** : Intégrer ces tests dans un pipeline GitHub Actions pour automatiser à chaque push/PR.
- **Coverage** : Générer un rapport de couverture (ex : `jest --coverage`) et fixer un seuil minimal.
- **Tests réels GitHub** : Ajouter des tests d'intégration qui utilisent l'API GitHub réelle (avec tokens de test et nettoyage automatique).
- **Badges** : Ajouter des badges de build, coverage, etc. dans le README principal.
- **Tests de charge** : Ajouter des tests de performance/charge sur les endpoints critiques.
