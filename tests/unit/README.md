# Tests unitaires

> Ce dossier contient les tests unitaires des fonctions utilitaires, helpers, et logique métier isolée.

## Fichiers présents
- `projects-query.test.ts` : test la logique de tri/filtrage des projets
- `formatDate.test.ts` : test un helper de formatage de date

## Lancer les tests unitaires

1. Démarrer le serveur Next.js en mode test (optionnel) :
   ```bash
   TEST_MODE=1 npm run dev
   ```
2. Ouvrir un autre terminal et lancer :
   ```bash
   npx jest tests/unit
   ```

> Les tests unitaires ne dépendent pas d'API externe et sont très rapides.

## Améliorations futures

- **CI/CD** : Intégrer les tests dans un pipeline GitHub Actions pour automatiser l'exécution à chaque push/PR.
- **Coverage** : Ajouter la génération de rapports de couverture (ex : `jest --coverage`) et fixer un seuil minimal.
- **Tests réels GitHub** : Ajouter des tests d'intégration/e2e qui interagissent avec l'API GitHub réelle (avec tokens de test et cleanup automatique).
- **Badges** : Afficher les badges de build, coverage, etc. dans le README principal.
- **Linting/formatting** : Ajouter des vérifications automatiques (ex : ESLint, Prettier) dans le pipeline.
