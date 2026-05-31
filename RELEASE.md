# SAH Ecosystem — Release Documentation

## Version: v1.0.0

**Release Date:** May 30, 2026  
**Branch:** main  
**Built by:** Adil Husain

---

## Features

### Core Ecosystem

| Product | Category | Status | Version |
|---------|----------|--------|---------|
| TokenAnalyzer | Crypto Intelligence | Beta | v1.8.3 |
| GhostHub | Developer Suite | Active | v2.4.1 |
| Nexa AI | AI Assistant | Active | v3.1.0 |
| S.A.H Ultimate 8.7 | Productivity & Automation | Active | v8.7.0 |
| Prompt Pilot | Prompt Engineering | Active | v2.0.0 |
| Post Agent | Content Automation | Beta | v1.2.0 |

### Public Pages

- **Home** (`/`) — Hero, stats, featured products, founder section, mission, CTA
- **Products** (`/products`) — Full product grid with search, category filter, live DB data
- **Product Detail** (`/products/:id`) — Logo, screenshots gallery with lightbox, features, action buttons
- **About** (`/about`) — Founder profile (Adil Husain), specializations, stats, social links
- **Help** (`/help`) — 7 contact cards: WhatsApp, Telegram, 2 emails, GitHub, LinkedIn, X/Twitter
- **Updates** (`/updates`) — Changelog and roadmap
- **404** — Dark-themed not-found page

### Admin Panel

- **URL:** `/admin`
- **Password:** `sah-admin-2024`
- **Auth:** Client-side session (sessionStorage)
- **Features:**
  - Full CRUD for all products (create, read, update, delete)
  - Image upload: product logo + 4 screenshots each (GCS presigned upload)
  - Telegram URL field per product
  - Drag-to-reorder via sort order controls
  - Slide-in drawer form with live preview
  - Toast notifications for all actions

### Storage & Media

- GCS object storage via Replit Object Storage
- Presigned upload URL flow (client uploads directly to GCS)
- Object paths stored in DB as `/objects/uploads/<uuid>`
- Served at `/api/storage/objects/uploads/<uuid>`

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/healthz` | Health check |
| GET | `/api/products` | List all products |
| POST | `/api/products` | Create product (admin) |
| GET | `/api/products/:id` | Get product by ID |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |
| POST | `/api/storage/uploads/request-url` | Get presigned upload URL |
| GET | `/api/storage/objects/*` | Serve stored objects |

---

## Project Structure

```
artifacts/
  api-server/         Express 5 + PostgreSQL API (port 8080, proxied at /api)
  smart-agent-hub/    React + Vite + Tailwind CSS frontend (proxied at /)
  mockup-sandbox/     Canvas/design component preview server

lib/
  db/                 Drizzle ORM schema + PostgreSQL client
  api-spec/           OpenAPI spec (source of truth for all contracts)
  api-zod/            Generated Zod validators (from Orval)
  api-client-react/   Generated React Query hooks (from Orval)
```

## Stack

- **Frontend:** React 19 + Vite 7 + TypeScript + Tailwind CSS + Shadcn UI + Framer Motion
- **Backend:** Express 5 + Node.js 24
- **Database:** PostgreSQL + Drizzle ORM
- **Validation:** Zod v4 + drizzle-zod
- **API Contracts:** OpenAPI → Orval (Zod + React Query codegen)
- **Storage:** GCS via Replit Object Storage
- **Build:** esbuild (API) + Vite (frontend)

## SEO

- Title: `SAH Ecosystem — Build. Automate. Scale.`
- Description: One platform, six products. AI applications, automation systems, developer tools.
- Twitter card, Open Graph, author `@Husain3413`
- Favicon: Purple (#7C3AED) "SAH" logo SVG

## Performance

- Code-split routing with `React.lazy()` + `Suspense`
- Production bundle: ~205 KB gzipped
- API stale time: 30 seconds with 1 retry

## Contact

- **Founder:** Adil Husain
- **WhatsApp:** +919967873413
- **Telegram:** @dil3413
- **Twitter/X:** @Husain3413
- **GitHub:** github.com/tokenanalyzer
- **Email:** adilcryptonews@gmail.com
