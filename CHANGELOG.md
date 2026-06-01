# Changelog

All notable changes to the SAH Ecosystem are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [2.0.0] — 2026-06-01

### Security

- Removed hardcoded client-side password (`sah-admin-2024`)
- Implemented server-side JWT authentication (`POST /api/auth/login`)
- Admin credentials now stored as Replit Secrets (`ADMIN_USERNAME`, `ADMIN_PASSWORD`)
- All mutating routes (`POST`, `PUT`, `PATCH`, `DELETE`) protected by `requireAuth` middleware
- Storage upload endpoint also auth-protected
- `crypto.timingSafeEqual` used for credential comparison (timing-safe)
- JWT signed with `SESSION_SECRET`, 8h expiry

### Added

- `POST /api/auth/login` — returns signed JWT on valid credentials
- `GET /api/auth/verify` — validates current bearer token
- `GET /api/admin/products` — lists all products regardless of lifecycle state (admin only)
- `PATCH /api/products/:id/lifecycle` — changes product state (draft / published / archived)
- `publishedState` column on `products` table (default `published` for existing rows)
- Admin login form: username + password (server-side validation)
- Lifecycle action buttons in admin panel: Publish, Unpublish, Archive, Restore
- State badge per product row (Draft / Published / Archived)
- Stats bar shows: Total · Published · Draft · Archived counts
- `artifacts/api-server/src/lib/auth.ts` — JWT sign/verify logic
- `artifacts/api-server/src/middleware/requireAuth.ts` — Bearer token middleware
- `artifacts/api-server/src/routes/auth.ts` — Auth endpoints

### Changed

- `GET /api/products` now returns only `published` products (public filtering)
- New products created via admin default to `draft` state
- Admin dashboard uses `useAdminListProducts` hook (sees all states)
- `setAuthTokenGetter` wired at app startup to inject JWT into all generated hooks
- Stats bar updated: 4 counters (Total, Published, Draft, Archived) instead of 3
- `RELEASE.md` updated to v2.0.0

### Dependencies

- `jsonwebtoken` added to `@workspace/api-server`

---

## [1.0.0] — 2026-05-30

### Initial Production Release

#### Added — Frontend (React + Vite)

- **Home page** — Hero section with animated SAH logo, live product stats from API, featured product cards, founder section (Adil Husain), mission statement, CTA strip
- **Products page** (`/products`) — Full product grid with real-time search and category filter tabs; data fetched from PostgreSQL via API
- **Product Detail page** (`/products/:id`) — Product hero with logo/badge/version, screenshot gallery with lightbox/carousel, features grid, action buttons (Telegram, Website, APK, GitHub)
- **About page** (`/about`) — Founder profile, bio, specializations, ecosystem stats, social links
- **Help page** (`/help`) — 7 contact cards: WhatsApp (+919967873413), Telegram (@dil3413), 2 emails, GitHub, LinkedIn, X/Twitter — all clickable with external link icons
- **Updates page** (`/updates`) — Changelog timeline and roadmap entries
- **Admin panel** (`/admin`) — Password-gated (client-side session), hidden from nav
  - Full CRUD for products (create, read, update, delete)
  - GCS image upload: product logo + up to 4 screenshots
  - Fields: name, category, status, version, tagline, description, features, website URL, Telegram URL, APK URL, GitHub URL, sort order
  - Slide-in drawer form with react-hook-form + Zod validation
  - Toast notifications for all actions
- **Custom 404 page** — Dark-themed, SAH branded, back-to-home button
- **Responsive navbar** — SAH logo, desktop nav links, mobile hamburger menu
- **Footer** — SAH branding, product links, social links (Telegram, GitHub, Twitter/X)

#### Added — API (Express 5 + PostgreSQL)

- `GET /api/healthz` — Health check endpoint
- `GET /api/products` — List all products (sorted by sort_order)
- `POST /api/products` — Create product with full field set
- `GET /api/products/:id` — Get single product by ID
- `PUT /api/products/:id` — Update product
- `DELETE /api/products/:id` — Delete product
- `POST /api/storage/uploads/request-url` — Request presigned GCS upload URL
- `GET /api/storage/objects/*` — Serve stored objects from GCS

#### Added — Database (PostgreSQL + Drizzle ORM)

- `products` table: id, name, category, tagline, description, version, status, features (array), website_url, telegram_url, apk_url, github_url, logo_url, screenshot_urls (array), sort_order, created_at, updated_at
- Database seeder — auto-seeds 6 products on first run if table is empty

#### Added — Storage (GCS via Replit Object Storage)

- Presigned upload URL flow — client uploads directly to GCS, server stores object path in DB
- Object paths stored as `/objects/uploads/<uuid>` in DB
- Served at `/api/storage/objects/uploads/<uuid>`
- ACL helpers for public/private object access

#### Added — API Contracts (OpenAPI → Orval codegen)

- OpenAPI spec (`lib/api-spec/openapi.yaml`) — single source of truth for all API contracts
- Generated Zod validators (`lib/api-zod`) — used for server-side request/response validation
- Generated React Query hooks (`lib/api-client-react`) — used in frontend for all API calls

#### Added — Performance

- Code splitting with `React.lazy()` + `Suspense` — 15+ async chunks; main JS bundle: **151 KB gzipped**
- CSS bundle: **21 KB gzipped**
- Query stale time: 30 seconds with 1 retry

#### Added — Branding & SEO

- Purple (#7C3AED) SAH logo SVG favicon
- Open Graph image (`/public/opengraph.jpg`)
- Meta tags: title, description, keywords, author, Open Graph, Twitter Card
- `robots.txt` — allows all crawlers

#### Stack

- **Frontend**: React 19, Vite 7, TypeScript 5.9, Tailwind CSS, Shadcn UI, Framer Motion, Wouter, TanStack Query
- **Backend**: Express 5, Node.js 24, Pino logger
- **Database**: PostgreSQL, Drizzle ORM, drizzle-zod
- **Validation**: Zod v4
- **Storage**: GCS via Replit Object Storage
- **Build**: esbuild (API), Vite (frontend)
- **Monorepo**: pnpm workspaces

#### Products Included

| # | Product | Category | Status | Version |
|---|---------|----------|--------|---------|
| 1 | TokenAnalyzer | Crypto Intelligence | Beta | v1.8.3 |
| 2 | GhostHub | Developer Suite | Active | v2.4.1 |
| 3 | Nexa AI | AI Assistant | Active | v3.1.0 |
| 4 | S.A.H Ultimate 8.7 | Productivity & Automation | Active | v8.7.0 |
| 5 | Prompt Pilot | Prompt Engineering | Active | v2.0.0 |
| 6 | Post Agent | Content Automation | Beta | v1.2.0 |

---

## Roadmap

### [1.1.0] — Planned Q3 2026
- Unified Dashboard across all 6 products
- Cross-product analytics
- Unified notification center

### [1.2.0] — Planned Q4 2026
- Native iOS and Android companion app
- Biometric authentication
- Offline mode support

### [2.0.0] — Planned Q1 2027
- Public REST API platform for all products
- Developer portal and documentation site
- Webhook marketplace
