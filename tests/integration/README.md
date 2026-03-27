# Dossier de tests d'intégration

Ce dossier contient les tests d'intégration pour les parcours et API critiques du projet.

## Structure proposée

- `integration/` : tests d'intégration (API, parcours utilisateur complet)
- `unit/` : tests unitaires (fonctions isolées)

## Tests à prioriser (à créer ici)

1. **Authentification GitHub OAuth**
   - Vérifier le login, le callback, la création de session
2. **Lecture des repositories GitHub**
   - Tester l'API `/api/repos` (authentifié, non authentifié)
3. **Création de repository**
   - Tester l'API `/api/projects/create` (succès, erreurs)
4. **Actions Codespaces**
   - Tester l'API `/api/codespaces` (succès, erreurs, permissions)
5. **Parcours utilisateur complet**
   - Login → dashboard → projets → création projet → ouverture Codespaces

Ajoute ici les tests d'intégration importants au fur et à mesure de l'évolution du projet.
