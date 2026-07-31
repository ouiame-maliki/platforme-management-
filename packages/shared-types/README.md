# Shared Types

This package contains the shared Zod schemas and TypeScript types used in the Virtual AI Manager project.

The goal is to have the same data models shared between all project modules to keep the API contracts consistent.

## Structure

- `src/schemas` : Zod validation schemas
- `src/types` : TypeScript types generated from Zod schemas
- `src/index.ts` : exports all schemas and types

## Build

```bash
npx tsc
```

## Notes

This package is shared between all project lots and can be linked locally using:

```bash
npm link
```