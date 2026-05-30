---
name: api-zod export conflict
description: Zod schema constants and TypeScript interfaces share the same names in orval output; star-exporting both from index.ts causes TS duplicate export errors.
---

## Rule
In `lib/api-zod/src/index.ts`, never `export * from "./generated/types"` alongside `export * from "./generated/api"`. Use explicit named `export type { ... }` for the TypeScript interfaces, excluding any names that also exist as Zod schema constants.

## Why
Orval generates both a Zod schema constant (`export const RequestUploadUrlBody = zod.object(...)` in `api.ts`) and a TypeScript interface (`export interface RequestUploadUrlBody` in `types/requestUploadUrlBody.ts`) with identical names. Star-exporting both causes TS2308 "Module has already exported a member" errors.

## How to apply
When running codegen adds new endpoints, check if `types/index.ts` exports match names in `api.ts`. Fix: keep `export * from "./generated/api"` and use `export type { ApiProduct, DeletedResponse, ErrorResponse, HealthStatus, ProductInput, ProductUpdate }` (omitting conflicting names).
