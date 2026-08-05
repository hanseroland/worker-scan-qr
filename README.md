# Worker Scan QR

Worker Scan QR est une API backend développée avec Node.js, TypeScript et Express pour gérer les employés, les entreprises, les lieux de travail, les codes QR et les événements de pointage.

## Présentation

Cette application permet de :
- gérer des entreprises et leurs utilisateurs ;
- créer et administrer des employés ;
- définir des locations/points de présence ;
- générer et valider des QR codes ;
- enregistrer des événements de pointage ;
- gérer l’authentification avec JWT, les invitations et les mots de passe.

## Stack technique

- Node.js
- TypeScript
- Express
- MySQL avec `mysql2`
- JWT pour l’authentification
- bcrypt pour le hashage des mots de passe
- multer pour l’upload de fichiers
- nodemailer pour les emails
- dotenv pour la configuration

## Architecture

Le projet suit une structure orientée domaine et cas d’utilisation avec :
- des entités et repositories dans le domaine ;
- des use cases dans `src/application/use-cases` ;
- des contrôleurs et routes dans `src/interfaces/http` ;
- des services d’infrastructure dans `src/infrastructure`.

## Prérequis

Avant de démarrer, assurez-vous d’avoir :
- Node.js installé
- MySQL en cours d’exécution
- un fichier `.env` configuré

## Installation

```bash
npm install
```

## Configuration de l’environnement

Créer un fichier `.env` à la racine du projet avec les variables suivantes :

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=worker_scan_qr

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email
EMAIL_PASS=your_password

QR_ROTATION_INTERVAL=30
QR_SECRET=your_qr_secret
```

## Lancer l’application

Mode développement :

```bash
npm run dev
```

Build de production :

```bash
npm run build
```

Démarrage du build :

```bash
npm start
```

Le serveur démarre par défaut sur le port `3000` ou sur la valeur définie dans `.env`.

## API

L’API est exposée sous le préfixe :

```text
/api/v1
```

Principaux modules disponibles :
- `/api/v1/auth`
- `/api/v1/companies`
- `/api/v1/employees`
- `/api/v1/locations`
- `/api/v1/users`
- `/api/v1/qrcodes`
- `/api/v1/pointage`
- `/api/v1/invitations`

## Scripts disponibles

```bash
npm run dev       # démarrage avec nodemon
npm run build     # compilation TypeScript
npm start         # lancement de la version compilée
npm run format    # formatage du code
npm run format:check
```

## Notes

- Le projet utilise une base de données MySQL et nécessite une structure de tables compatible avec les repositories fournis.
- Les fichiers d’upload et les services emails doivent être configurés selon votre environnement.
- Les tests ne sont pas encore configurés dans ce dépôt.

## Auteur

Projet backend réalisé pour la gestion de pointage via QR codes.
