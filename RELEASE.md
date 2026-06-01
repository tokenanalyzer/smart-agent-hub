# SAH Ecosystem — Release Documentation

## Version: v2.0.0

**Release Date:** June 1, 2026  
**Branch:** main  
**Built by:** Adil Husain

---

## What's New in v2.0.0

### 1. Secure Admin Authentication

The hardcoded client-side password has been replaced with proper server-side JWT authentication.

- **Login endpoint:** `POST /api/auth/login` — accepts `username` + `password`, returns a signed JWT (8h expiry)
- **Token verify:** `GET /api/auth/verify` — validates the current token
- **Credentials:** Stored as Replit Secrets (`ADMIN_USERNAME`, `ADMIN_PASSWORD`) — never in code
- **Token signing:** `SESSION_SECRET` env var (already set)
- **Protection:** All mutating routes (`POST`, `PUT`, `PATCH`, `DELETE`) now require a valid `Authorization: Bearer <token>` header
- **Storage uploads:** Also auth-protected
- **Timing-safe comparison:** `crypto.timingSafeEqual` used for credential verification (no bcrypt needed)
- **Frontend:** JWT stored in `sessionStorage`; injected automatically via `setAuthTokenGetter` hook in `custom-fetch.ts`

### 2. Product Lifecycle Management

Products now have a `publishedState` column with three states:

| State | Visible to public | Visible to admin |
|-------|:-----------------:|:----------------:|
| `draft` | No | Yes |
| `published` | Yes | Yes |
| `archived` | No | Yes |

- **New products** default to `draft` — never accidentally go live
- **Existing products** kept as `published` (backward-compatible DB migration)
- **New route:** `PATCH /api/products/:id/lifecycle` — change state (admin only)
- **New route:** `GET /api/admin/products` — list all products regardless of state (admin only)
- **Public route:** `GET /api/products` — now filters to `published` only

### 3. Admin Panel Improvements

- **Username + password login form** (replaces single-password field)
- **Lifecycle action buttons** per product row (hover to reveal):
  - **Publish** — make visible on the public site
  - **Unpublish** — revert to draft (hides from public)
  - **Archive** — retire the product
  - **Restore** — bring archived product back to draft
- **State badge** per product — Draft / Published / Archived shown inline
- **Stats bar** now shows: Total · Published · Draft · Archived counts
- **Admin list** uses `/api/admin/products` — sees all products regardless of state

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| GET | `/api/healthz` | — | Health check |
| POST | `/api/auth/login` | — | Admin login → JWT |
| GET | `/api/auth/verify` | ✓ | Verify token |
| GET | `/api/products` | — | List **published** products (public) |
| POST | `/api/products` | ✓ | Create product (defaults to `draft`) |
| GET | `/api/admin/products` | ✓ | List **all** products (admin) |
| GET | `/api/products/:id` | — | Get product by ID |
| PUT | `/api/products/:id` | ✓ | Update product |
| PATCH | `/api/products/:id/lifecycle` | ✓ | Change lifecycle state |
| DELETE | `/api/products/:id` | ✓ | Delete product |
| POST | `/api/storage/uploads/request-url` | ✓ | Get presigned GCS upload URL |
| GET | `/api/storage/objects/*` | — | Serve stored objects |

---

## Features (Full)

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
- **Products** (`/products`) — Full product grid with search, category filter, live DB data (published only)
- **Product Detail** (`/products/:id`) — Logo, screenshots gallery with lightbox, features, action buttons
- **About** (`/about`) — Founder profile (Adil Husain), specializations, stats, social links
- **Help** (`/help`) — 7 contact cards: WhatsApp, Telegram, 2 emails, GitHub, LinkedIn, X/Twitter
- **Updates** (`/updates`) — Changelog and roadmap
- **404** — Dark-themed not-found page

### Admin Panel

- **URL:** `/admin` (hidden from nav)
- **Auth:** Server-side JWT (`ADMIN_USERNAME` + `ADMIN_PASSWORD` secrets)
- **Session duration:** 8 hours
- **Features:**
  - Full CRUD for all products (create, read, update, delete)
  - Product lifecycle management (Draft / Published / Archived)
  - Image upload: product logo + 4 screenshots each (GCS presigned upload)
  - Telegram URL field per product
  - Sort order controls
  - Slide-in drawer form
  - Toast notifications for all actions

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

artifacts/api-server/src/
  lib/auth.ts         JWT sign/verify + timing-safe credential check
  middleware/         requireAuth.ts — Bearer token middleware
  routes/auth.ts      POST /auth/login, GET /auth/verify
  routes/products.ts  Public + admin product routes
  routes/storage.ts   GCS presigned upload (auth-protected)
```

## Stack

- **Frontend:** React 19 + Vite 7 + TypeScript + Tailwind CSS + Shadcn UI + Framer Motion
- **Backend:** Express 5 + Node.js 24
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** JWT (`jsonwebtoken`) + `crypto.timingSafeEqual`
- **Validation:** Zod v4 + drizzle-zod
- **API Contracts:** OpenAPI → Orval (Zod + React Query codegen)
- **Storage:** GCS via Replit Object Storage
- **Build:** esbuild (API) + Vite (frontend)

## Admin Workflow

1. Go to `/admin`
2. Enter your username and password (set via Replit Secrets)
3. JWT is issued and stored in `sessionStorage` for 8 hours
4. All API mutations automatically include `Authorization: Bearer <token>`
5. New products are created as **Draft** — you must explicitly Publish them
6. Use the lifecycle buttons (hover a product row) to Publish / Unpublish / Archive / Restore
7. Click Logout to clear the session

## Contact

- **Founder:** Adil Husain
- **WhatsApp:** +919967873413
- **Telegram:** @dil3413
- **Twitter/X:** @Husain3413
- **GitHub:** github.com/tokenanalyzer
- **Email:** adilcryptonews@gmail.com
