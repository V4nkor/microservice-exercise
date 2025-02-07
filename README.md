# Exercice de microservices avec NodeJS et Docker

## Description

Ceci est un exercice simple de microservices utilisant NodeJS et Docker. Le projet est divisé en quatres services : `school`, `student`, `auth` et `gateway`.

Le service `school` utilise Postgres comme base de données tout comme `auth`, le service `student` utilise MongoDB.

Le service `school` utilise le port `3000` par défaut, le service `student` utilise le port `3010` par défaut, le service `auth` utilise le port `3020` par défaut et le service `gateway` utilise le port `3050` par défaut.

Consul est utilisé pour la découverte de services et le load balancing.

PM2 est utilisé pour gérer le lancement des processus des services et de gérer les multiples instances des services (avec PORTS incrémentaux).

Le frontend est une simple application VueJS qui devais utiliser les services `school` et `student` pour afficher les données.
Sauf qu'il est non finis, buggé et non utilisé dans le fichier docker-compose.yml et j'ai arrêté de travailler dessus très tôt dans le projet.

## Objectifs / Exercices

- Créer un service `school` avec une base de données Postgres
  - [x] Créer des routes pour les écoles
  - [x] Communication avec la BDD
- Créer un service `student` avec une base de données MongoDB
  - [x] Créer des routes pour les étudiants
  - [x] Communication avec la BDD
  - [x] Ajouter une communication avec le service `school` pour afficher les écoles selon le schoolId de l'étudiant
- Utiliser Consul :
  - [x] Service discovery
  - [wip] Load balancing
  - [wip] Gateway API
- Créer un service d'Authentification :
  - [x] Ajouter une vérification de credentials avec génération de token JWT
  - [A tester avec le gateway] Ajouter une vérification de token JWT via une route
- Créer un ""Gateway API"" :
  - [wip] Créer un service qui utilise Consul pour rediriger les requêtes vers les services `school` et `student` en vérifiant les tokens JWT
  - [wip] Ajouter un semi sytème de ""load balancing""" qui utilise Consul
  - [wip] Ajouter la route pour rediriger vers l'authentification

## Comment lancer le projet

- Clonez le dépôt
- Assurez-vous d'avoir Docker et Docker Compose installés sur votre machine
- Assurez vous d'installer Consul sur votre machine : [Page installation](https://developer.hashicorp.com/consul/install#release-information)
- Lancez consul avec la commande suivante : `consul agent -dev` dans un premier terminal
- Vous pourrez accéder à l'interface web de Consul à l'adresse suivante : `http://localhost:8500`
- Installez `nvm` pour gérer les versions de NodeJS
  
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

- Utilisez `nvm install` pour utiliser la version de NodeJS spécifiée dans le fichier `.nvmrc`
- Installez `pnpm` globalement avec la commande suivante : `npm install -g pnpm`
- Faites `pnpm -r install` dans le dossier racine pour installer les dépendances de tout les services
- Dans un deuxième terminal, exécutez `docker-compose up` dans le dossier racine ou `pnpm start:docker` dans le répertoire racine pour lancer les trois BDD
- Installez pm2 globalement avec pnpm avec la commande suivante : `pnpm install -g pm2`
- Dans un troisième terminal, exécutez `pnpm pm2:start` dans le dossier racine pour lancer les services
- Les trois services devraient être disponibles :
  - School (deux instances) :
    - Via `http://localhost:3000` et `http://localhost:3001`
  - Student (deux instances) :
    - Via `http://localhost:3010` et `http://localhost:3011`
  - Auth :
    - Via `http://localhost:3020`
  - Gateway API :
    - Via `http://localhost:3050`
- Le tableau de bord web de Consul devrait être disponible à `http://localhost:8500`
- Le WIP gateway API devrait être disponible à `http://localhost:3050`

Vous pourrez envoyer les requêtes HTTP aux services directemment pour les tester sans vérification JWT, ou bien passer par le ""gateway API""" afin de tester le ""load balancing""" qui utilise consul avec la vérification de token JWT.

Voici les identifiants par défaut pour l'authentification :

- `mmorgat`: `password`
