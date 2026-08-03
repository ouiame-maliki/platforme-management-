# Migration initiale - Prisma

## Objectif

Création du schéma de base de données avec Prisma pour le projet Virtual AI Manager.

## Commande utilisée

```bash
npx prisma migrate dev --name init
```

## Résultat

La migration initiale a été générée et appliquée avec succès.

Le dossier suivant a été créé :

```text
prisma/migrations/20260801224539_init/
└── migration.sql
```

## Tables créées

- Company
- Site
- Direction
- Department
- Team
- Employee
- JobDescription
- Objective
- Mission
- KpiDefinition
- KpiValue

## Contraintes implémentées

- Clés primaires (`@id`)
- Relations (`@relation`)
- Clés étrangères
- Index (`@@index`)
- Champs d'audit :
  - createdAt
  - updatedAt
  - deletedAt
  - version

## Données de test

Un fichier `prisma/seed.ts` a été créé afin d'insérer des données de démonstration.

Les données prévues sont :

- 1 Company
- 3 Directions
- 3 Departments
- 3 Teams
- 10 Employees