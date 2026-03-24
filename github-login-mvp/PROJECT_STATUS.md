# Vision Produit et Etat d'Avancement

## 1. Ce que nous voulons construire

Nous voulons construire une application web simple qui sert de porte d'entree vers GitHub et Codespaces.

L'objectif n'est pas de recreer un IDE, mais de reduire la friction entre :
- l'idee d'un projet
- la creation du repository
- la preparation de la structure de travail
- l'ouverture d'un environnement pret a coder

L'utilisateur doit pouvoir, depuis tablette ou ordinateur :
- se connecter avec GitHub
- voir ses projets existants
- creer un nouveau projet rapidement
- choisir un type de projet (Python, Data Science, Next.js)
- preparer automatiquement une structure de base
- ajouter facilement des fichiers, scripts, notebooks ou datasets
- lancer ou reprendre un Codespace
- voir l'etat de son environnement
- acceder directement a son workspace dans le navigateur

En resume, le produit doit permettre de passer rapidement de l'idee a un environnement operationnel sans configuration complexe.

## 2. Ce qui est deja fait

Aujourd'hui, le projet couvre la base d'authentification et d'acces.

### Fonctionnalites deja implementees

- Connexion GitHub OAuth
- Callback OAuth GitHub
- Session utilisateur via cookie HttpOnly
- Lecture du profil GitHub authentifie
- Dashboard protege apres connexion
- Route de deconnexion
- Support des secrets Codespaces
- Documentation de configuration et lancement

### Ce que cela prouve deja

Le projet montre deja que nous savons :
- connecter une application a GitHub proprement
- gerer un flux OAuth minimal
- proteger des pages applicatives
- structurer une base Next.js exploitable
- preparer le projet pour un usage Codespaces

## 3. Ce qui n'est pas encore fait

Le coeur du produit n'est pas encore implemente.

### Fonctionnalites manquantes

- afficher la liste des repositories de l'utilisateur
- creer un repository depuis l'application
- proposer des templates de projet
- generer une structure initiale de projet
- ajouter des fichiers ou datasets depuis l'interface
- creer un notebook ou un script automatiquement
- lancer un Codespace pour un projet
- reprendre un Codespace existant
- afficher l'etat d'un environnement (actif, arrete, en creation)
- gerer favoris et historique
- fournir une vraie interface produit orientee tablette

## 4. Ou nous en sommes exactement

Nous sommes au stade :

### Etape 1 - Base d'identite GitHub
- statut : terminee

Ce qui existe :
- login GitHub
- session
- dashboard utilisateur
- base technique Next.js

### Etape 2 - Recuperation des projets GitHub
- statut : non commencee

Ce qu'il faut faire :
- appeler l'API GitHub pour lister les repositories
- afficher une page "Mes projets"
- permettre d'ouvrir un projet existant

### Etape 3 - Creation rapide de projet
- statut : non commencee

Ce qu'il faut faire :
- formulaire de creation
- choix du type de projet
- creation du repository
- generation d'une structure initiale

### Etape 4 - Orchestration Codespaces
- statut : non commencee

Ce qu'il faut faire :
- creer ou demarrer un Codespace
- retrouver un Codespace existant
- afficher l'etat du Codespace
- ouvrir le workspace directement

### Etape 5 - Experience produit complete
- statut : non commencee

Ce qu'il faut faire :
- ajout de fichiers et datasets
- creation rapide de notebooks/scripts
- favoris
- historique
- meilleure UX mobile/tablette

## 5. Ce que fait concretement l'application actuelle

Aujourd'hui, l'application permet :

1. de se connecter avec GitHub
2. de creer une session securisee
3. d'afficher un dashboard protege
4. de recuperer le profil GitHub de l'utilisateur
5. de se deconnecter

Donc actuellement, l'application est une fondation d'authentification, pas encore le produit complet de gestion et d'orchestration de projets.

## 6. Ce que doit etre la prochaine etape

La prochaine etape la plus intelligente est de construire la page "Mes projets".

### Priorite recommandee

1. Recuperer les repositories GitHub de l'utilisateur
2. Afficher une liste simple des projets
3. Ajouter un bouton "Nouveau projet"
4. Ajouter un bouton "Ouvrir dans Codespaces"
5. Commencer a suivre l'etat d'un environnement

Pourquoi c'est la bonne suite :
- elle transforme un simple login en vrai debut de produit
- elle colle directement a la promesse utilisateur
- elle cree la base des prochaines fonctionnalites

## 7. Resume simple

### Ce que nous voulons
Une application simple pour creer, reprendre et ouvrir rapidement des projets GitHub/Codespaces.

### Ce qui est fait
La connexion GitHub et la base technique du produit.

### Ce qui manque
Toute la logique de gestion des projets et des environnements.

### Prochaine marche logique
Lister les projets GitHub, creer un projet, puis lancer/reprendre un Codespace.

## 8. Vision finale

Le produit final doit permettre a un utilisateur de :
- arriver sur une interface simple
- choisir ou creer un projet
- preparer automatiquement un environnement adapte
- ouvrir son workspace sans friction
- reprendre son travail depuis n'importe quel appareil

Le vrai objectif produit est :

passer de l'idee a un environnement de travail pret a coder en quelques clics.
