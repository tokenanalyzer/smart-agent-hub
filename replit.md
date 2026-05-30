# SAH Ecosystem

A premium, mobile-first SaaS showcase for 6 products built by Adil Husain. Dark theme, glassmorphism, Framer Motion animations.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at /api)
- `pnpm --filter @workspace/smart-agent-hub run dev` — run the frontend (Vite dev server)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Shadcn UI + Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Storage: GCS object storage via Replit Object Storage

## Where things live

- `artifacts/smart-agent-hub/` — React + Vite frontend
- `artifacts/api-server/` — Express API server
- `lib/db/` — Drizzle ORM schema and DB client (source of truth: `src/schema/products.ts`)
- `lib/api-zod/` — Generated Zod validators from OpenAPI spec
- `lib/api-client-react/` — Generated React Query hooks from OpenAPI spec
- `lib/api-spec/` — OpenAPI spec (`openapi.yaml`) — source of truth for API contracts

## Architecture decisions

- **Contract-first API**: OpenAPI spec → Orval → Zod validators + React Query hooks. Never write API clients manually.
- **api-zod index.ts**: Exports Zod schemas from `./generated/api` + TypeScript interfaces from `./generated/types` (with explicit named exports to avoid `RequestUploadUrlBody`/`RequestUploadUrlResponse` name collision).
- **Storage**: GCS presigned upload URL flow — frontend POSTs metadata to `/api/storage/uploads/request-url`, then PUTs file directly to GCS. Object paths stored in DB as `/objects/uploads/<uuid>`. Served via `/api/storage${objectPath}`.
- **Image display**: `storageUrl(objectPath)` helper in `src/lib/storage.ts` converts stored objectPath to display URL.
- **Admin auth**: Client-side session only (`sessionStorage` key `sah_admin_auth`, password `sah-admin-2024`). No server-side auth for admin.

## Product

6 products in the ecosystem:
1. **TokenAnalyzer** — Crypto Intelligence (Beta)
2. **GhostHub** — Developer Suite (Active)
3. **Nexa AI** — AI Assistant (Active)
4. **S.A.H Ultimate 8.7** — Productivity & Automation (Active)
5. **Prompt Pilot** — Prompt Engineering (Active)
6. **Post Agent** — Content Automation (Beta)

## User preferences

- Dark theme, glassmorphism aesthetic
- "SAH Ecosystem" branding, logo text "SAH", tagline "Build. Automate. Scale."
- Admin panel at `/admin` (hidden from nav), password: `sah-admin-2024`

## Founder / Contact

- **Name**: Adil Husain
- **WhatsApp**: +919967873413 (https://wa.me/919967873413)
- **Telegram**: @dil3413 (https://t.me/dil3413)
- **Twitter/X**: @Husain3413
- **GitHub**: tokenanalyzer (https://github.com/tokenanalyzer)
- **LinkedIn**: Adil Hussain (https://linkedin.com/in/adil-hussain)
- **Email**: adilcryptonews@gmail.com, adilhusain3176@gmail.com

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec change.
- `api-zod/src/index.ts` must explicitly re-export TypeScript types (not `export *`) to avoid name collisions with Zod schema constants of the same name (e.g., `RequestUploadUrlBody`).
- `req.params.id` in Express 5 is typed `string | string[]` — always cast with `String(req.params.id)` before parseInt.
- `useGetProduct` second arg `query` option requires `queryKey` in TS types — pass options `as any` to avoid TS error.
- Seed function (`seedProductsIfEmpty`) only seeds if table is empty. Clear with `DELETE FROM products` to force reseed.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
