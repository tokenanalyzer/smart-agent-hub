# SAH Ecosystem — Project Handover Document

**Version:** v2.0.0  
**Handover Date:** June 1, 2026  
**Built by:** Adil Husain  
**Repository:** https://github.com/tokenanalyzer/smart-agent-hub

---

## 1. Complete Project Architecture

### Overview

SAH Ecosystem is a premium dark-theme SaaS showcase for 6 products. It follows a **contract-first** architecture: the OpenAPI spec is the single source of truth for the API; Zod validators and React Query hooks are generated from it automatically.

```
Browser
  └── React SPA (Vite, served at /)
        └── /api  ←──── Express 5 API (proxied by Replit reverse proxy)
                              └── PostgreSQL (Drizzle ORM)
                              └── Google Cloud Storage (presigned uploads)
```

### Frontend Framework

| Item | Detail |
|------|--------|
| Framework | React 19 + Vite 7 |
| Language | TypeScript 5.9 |
| Routing | Wouter (hash-less SPA routing) |
| Styling | Tailwind CSS v4 + Shadcn UI |
| Animations | Framer Motion |
| State/Data | TanStack React Query v5 |
| Forms | react-hook-form + Zod v4 |
| Icons | Lucide React + react-icons (Font Awesome) |
| Code splitting | `React.lazy()` + `Suspense` per route |
| Entry point | `artifacts/smart-agent-hub/src/main.tsx` |
| Build output | `artifacts/smart-agent-hub/dist/` |

### Backend Framework

| Item | Detail |
|------|--------|
| Runtime | Node.js 24 |
| Framework | Express 5 |
| Language | TypeScript 5.9 |
| Build | esbuild (CJS bundle) |
| Logging | Pino + pino-http |
| Validation | Zod v4 (generated from OpenAPI spec) |
| Entry point | `artifacts/api-server/src/index.ts` |
| Serves at | `/api` (proxied from port 8080) |

### Database

| Item | Detail |
|------|--------|
| Engine | PostgreSQL |
| ORM | Drizzle ORM |
| Schema source | `lib/db/src/schema/products.ts` |
| Client | `lib/db/src/db.ts` |
| Migrations | `drizzle-kit push` (no migration files — schema is pushed directly) |
| Seeding | `lib/db/src/seed.ts` — seeds 6 products if table is empty |

**Products table columns:**

| Column | Type | Notes |
|--------|------|-------|
| id | serial | Primary key |
| name | text | Not null |
| category | text | Not null |
| tagline | text | Not null |
| description | text | Not null |
| version | text | Not null |
| status | text | `Active` / `Beta` / `Coming Soon` |
| features | text[] | Array |
| logo_url | text | Object path (nullable) |
| website_url | text | Nullable |
| apk_url | text | Nullable |
| github_url | text | Nullable |
| telegram_url | text | Nullable |
| screenshot1_url–4_url | text | Object paths (nullable) |
| accent_color | text | Tailwind class e.g. `bg-violet-600` |
| published_state | text | `draft` / `published` / `archived` — default `published` |
| sort_order | integer | Default 0 |
| created_at | timestamptz | Auto-set |
| updated_at | timestamptz | Auto-updated via `$onUpdate` |

### Authentication

| Item | Detail |
|------|--------|
| Type | JWT (JSON Web Token) |
| Library | `jsonwebtoken` v9 |
| Token expiry | 8 hours |
| Signing secret | `SESSION_SECRET` env var |
| Credential check | `crypto.timingSafeEqual` (Node.js built-in — no bcrypt) |
| Credentials storage | Replit Secrets (`ADMIN_USERNAME`, `ADMIN_PASSWORD`) |
| Token transport | `Authorization: Bearer <token>` request header |
| Token storage | Browser `sessionStorage` key `sah_admin_token` |
| Auth lib | `artifacts/api-server/src/lib/auth.ts` |
| Middleware | `artifacts/api-server/src/middleware/requireAuth.ts` |

### Storage

| Item | Detail |
|------|--------|
| Provider | Google Cloud Storage (via Replit Object Storage) |
| Library | `@google-cloud/storage` v7 |
| Upload flow | Presigned URL — client POSTs metadata → server returns GCS signed URL → client PUTs file directly to GCS |
| Object paths | Stored as `/objects/uploads/<uuid>` in the DB |
| Serving | `GET /api/storage/objects/*` proxies from GCS |
| Max file size | 5 MB (enforced client-side) |
| Allowed types | Image only (`image/*`) |
| Storage lib | `artifacts/api-server/src/lib/objectStorage.ts` |
| ACL lib | `artifacts/api-server/src/lib/objectAcl.ts` |

### API Structure

The API follows a **contract-first** pattern:

```
lib/api-spec/openapi.yaml          ← Source of truth (edit here)
       │
       └── pnpm --filter @workspace/api-spec run codegen
                   │
                   ├── lib/api-zod/src/generated/      ← Zod validators (server uses)
                   └── lib/api-client-react/src/generated/  ← React Query hooks (frontend uses)
```

**Never write API clients or Zod schemas manually.** Always:
1. Edit `lib/api-spec/openapi.yaml`
2. Run `pnpm --filter @workspace/api-spec run codegen`
3. Use the generated code

---

## 2. Environment Variables

### Required (Mandatory)

| Variable | Purpose | Where to set |
|----------|---------|-------------|
| `SESSION_SECRET` | JWT signing secret — must be long and random | Replit Secrets |
| `ADMIN_USERNAME` | Admin login username | Replit Secrets |
| `ADMIN_PASSWORD` | Admin login password | Replit Secrets |
| `DATABASE_URL` | PostgreSQL connection string | Auto-provided by Replit PostgreSQL |
| `DEFAULT_OBJECT_STORAGE_BUCKET_ID` | GCS bucket identifier | Auto-provided by Replit Object Storage |
| `PRIVATE_OBJECT_DIR` | Private GCS path prefix | Auto-provided by Replit Object Storage |
| `PUBLIC_OBJECT_SEARCH_PATHS` | Public GCS search paths | Auto-provided by Replit Object Storage |

### Optional

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `8080` | API server port (Replit sets this automatically per workflow) |
| `NODE_ENV` | `development` | Set to `production` in deployed environments |

### Notes

- `DATABASE_URL`, `DEFAULT_OBJECT_STORAGE_BUCKET_ID`, `PRIVATE_OBJECT_DIR`, and `PUBLIC_OBJECT_SEARCH_PATHS` are **automatically injected by Replit** when you add the PostgreSQL and Object Storage integrations.
- On external platforms (Vercel, Railway, etc.) you must provision these services yourself and set all variables manually.
- **Never hardcode secrets** — the codebase contains zero hardcoded credentials.

---

## 3. Deployment Guide

### A. Replit Deployments (Recommended — Zero Config)

This is the native deployment target. Everything is pre-wired.

1. Open Replit → **Deploy** tab → **Reserved VM** or **Autoscale**
2. Verify all secrets are set (Secrets tab)
3. Click **Deploy**
4. Replit builds and serves both the frontend (Vite) and API (Express) via the reverse proxy
5. Your app is live at `https://<your-repl>.replit.app`

**What Replit handles automatically:**
- TLS/HTTPS
- Reverse proxy routing (`/api` → Express, `/` → Vite SPA)
- Environment injection (DATABASE_URL, storage vars)
- Health checks

---

### B. Self-Hosted / VPS (Railway, Render, DigitalOcean)

**Prerequisites:** PostgreSQL instance, GCS bucket (or S3-compatible), Node.js 24

**Build steps:**

```bash
# Install dependencies
pnpm install

# Build the API server
pnpm --filter @workspace/api-server run build
# Output: artifacts/api-server/dist/index.cjs

# Build the frontend
pnpm --filter @workspace/smart-agent-hub run build
# Output: artifacts/smart-agent-hub/dist/
```

**Run:**

```bash
# API server (serves /api)
NODE_ENV=production PORT=8080 node artifacts/api-server/dist/index.cjs

# Frontend — serve the dist/ folder with any static host (nginx, serve, Caddy)
# Example with `serve`:
npx serve artifacts/smart-agent-hub/dist -s -l 3000
```

**Nginx config example** (reverse proxy):

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        root /path/to/artifacts/smart-agent-hub/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

**Environment variables to set on the host:**

```
SESSION_SECRET=<long-random-string>
ADMIN_USERNAME=<your-username>
ADMIN_PASSWORD=<your-password>
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DEFAULT_OBJECT_STORAGE_BUCKET_ID=<gcs-bucket-id>
PRIVATE_OBJECT_DIR=<private-path>
PUBLIC_OBJECT_SEARCH_PATHS=<public-paths>
NODE_ENV=production
PORT=8080
```

---

### C. Vercel (Frontend Only)

Vercel can host the **frontend SPA only**. The API must be hosted separately (Railway, Render, etc.).

1. Connect GitHub repo to Vercel
2. Set **Root Directory** to `artifacts/smart-agent-hub`
3. Set **Build Command**: `pnpm --filter @workspace/smart-agent-hub run build`
4. Set **Output Directory**: `dist`
5. Add env var: `VITE_API_BASE_URL=https://your-api-host.com` (if API is on a different domain)
6. Update `customFetch.ts` or Vite proxy to point to the external API

> **Note:** Vercel does NOT support the Express API server. You cannot deploy the full stack to Vercel with this architecture. Use Replit Deployments or a VPS for full-stack hosting.

---

### D. Firebase Hosting (Frontend Only)

Same limitation as Vercel — frontend SPA only.

```bash
# Build frontend
pnpm --filter @workspace/smart-agent-hub run build

# Install Firebase CLI
npm install -g firebase-tools
firebase login

# Initialize (if not already)
firebase init hosting
# Public directory: artifacts/smart-agent-hub/dist
# Single-page app: Yes

# Deploy
firebase deploy --only hosting
```

`firebase.json`:

```json
{
  "hosting": {
    "public": "artifacts/smart-agent-hub/dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

---

## 4. Database Migration Guide

### PostgreSQL Setup

The project uses **Drizzle ORM with `drizzle-kit push`** — there are no SQL migration files. The schema is applied directly from TypeScript source.

```bash
# 1. Set DATABASE_URL environment variable
export DATABASE_URL="postgresql://user:password@host:5432/database_name"

# 2. Push schema to database (creates/alters tables)
pnpm --filter @workspace/db run push

# 3. (Optional) Seed initial product data
# The seed runs automatically on first API server start if the products table is empty.
# To force reseed: DELETE FROM products; then restart the API.
```

### Required Schema

The push command creates this table automatically from `lib/db/src/schema/products.ts`. No manual SQL required.

```sql
-- This is what drizzle-kit push creates — for reference only
CREATE TABLE products (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  category        TEXT NOT NULL,
  tagline         TEXT NOT NULL,
  description     TEXT NOT NULL,
  version         TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'Active',
  features        TEXT[] NOT NULL DEFAULT '{}',
  logo_url        TEXT,
  website_url     TEXT,
  apk_url         TEXT,
  github_url      TEXT,
  telegram_url    TEXT,
  screenshot1_url TEXT,
  screenshot2_url TEXT,
  screenshot3_url TEXT,
  screenshot4_url TEXT,
  accent_color    TEXT NOT NULL DEFAULT 'bg-violet-600',
  published_state TEXT NOT NULL DEFAULT 'published',
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Drizzle Commands

```bash
# Push schema changes (dev + production)
pnpm --filter @workspace/db run push

# Open Drizzle Studio (GUI for the database)
pnpm --filter @workspace/db run studio

# Generate migration files (not currently used, but available)
pnpm --filter @workspace/db run generate

# Full typecheck of the db package
pnpm --filter @workspace/db run typecheck
```

### Migrating to a New Database

```bash
# 1. Export data from old DB
pg_dump --data-only --table=products $OLD_DATABASE_URL > products_backup.sql

# 2. Point DATABASE_URL to new DB

# 3. Push schema
pnpm --filter @workspace/db run push

# 4. Import data
psql $NEW_DATABASE_URL < products_backup.sql
```

---

## 5. Complete Route List

### Frontend Routes (React / Wouter SPA)

| Route | Component | Description | Auth Required |
|-------|-----------|-------------|:-------------:|
| `/` | `pages/home.tsx` | Hero, stats, featured products, founder, CTA | No |
| `/products` | `pages/products.tsx` | Full product grid, search, category filter | No |
| `/products/:id` | `pages/product-detail.tsx` | Product detail, screenshots, features, action links | No |
| `/about` | `pages/about.tsx` | Founder profile, bio, social links | No |
| `/help` | `pages/help.tsx` | 7 contact cards (WhatsApp, Telegram, email, GitHub, LinkedIn, X) | No |
| `/updates` | `pages/updates.tsx` | Changelog and roadmap | No |
| `/admin` | `pages/admin.tsx` | Admin panel — login gate + full product CRUD | JWT (client) |
| `*` | `pages/not-found.tsx` | 404 dark-themed page | No |

> All routes are code-split with `React.lazy()` for performance.

### API Routes (Express 5)

All routes are prefixed `/api`. The reverse proxy routes `/api/*` to the Express server on port 8080.

#### Auth

| Method | Path | Auth | Description | Request Body | Response |
|--------|------|:----:|-------------|-------------|----------|
| `POST` | `/api/auth/login` | — | Admin login | `{username, password}` | `{token}` |
| `GET` | `/api/auth/verify` | ✓ | Verify JWT | — | `{valid: true}` |

#### Products (Public)

| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| `GET` | `/api/products` | — | List **published** products only |
| `GET` | `/api/products/:id` | — | Get any product by ID |

#### Products (Admin)

| Method | Path | Auth | Description | Request Body |
|--------|------|:----:|-------------|-------------|
| `GET` | `/api/admin/products` | ✓ | List **all** products (all states) | — |
| `POST` | `/api/products` | ✓ | Create product (defaults to `draft`) | `ProductInput` |
| `PUT` | `/api/products/:id` | ✓ | Update product fields | `ProductUpdate` |
| `PATCH` | `/api/products/:id/lifecycle` | ✓ | Change lifecycle state | `{state: "draft"|"published"|"archived"}` |
| `DELETE` | `/api/products/:id` | ✓ | Delete product permanently | — |

#### Storage

| Method | Path | Auth | Description | Request Body |
|--------|------|:----:|-------------|-------------|
| `POST` | `/api/storage/uploads/request-url` | ✓ | Request GCS presigned upload URL | `{name, size, contentType}` |
| `GET` | `/api/storage/objects/*` | — | Serve stored objects from GCS | — |
| `GET` | `/api/storage/public-objects/*` | — | Serve public assets | — |

#### Health

| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| `GET` | `/api/healthz` | — | Health check → `{status: "ok"}` |

---

## 6. Admin System Documentation

### Login Flow

```
User visits /admin
    │
    ├── Token in sessionStorage?
    │       Yes → Show AdminDashboard
    │       No  → Show LoginScreen
    │
    └── LoginScreen
            User enters username + password
            → POST /api/auth/login
                    │
                    ├── Invalid → 401 "Invalid credentials" → show error
                    └── Valid   → 200 {token}
                                        → store in sessionStorage["sah_admin_token"]
                                        → setAuthTokenGetter registered
                                        → show AdminDashboard
```

### JWT Auth Flow

```
1. Login  →  server generates JWT
               payload: { role: "admin" }
               signed with: SESSION_SECRET
               expiry: 8 hours

2. Client stores token in sessionStorage["sah_admin_token"]

3. Every API call via generated hooks:
   custom-fetch.ts calls authTokenGetter()
   → reads sessionStorage["sah_admin_token"]
   → adds header: Authorization: Bearer <token>

4. Server middleware (requireAuth):
   - Reads Authorization header
   - Verifies token with jwt.verify(token, SESSION_SECRET)
   - Valid  → next()
   - Invalid/expired → 401 Unauthorized

5. Logout:
   - sessionStorage.removeItem("sah_admin_token")
   - setAuthTokenGetter reset
   - LoginScreen shown
```

### Product Lifecycle Flow

```
Create product (POST /api/products)
    └── publishedState = "draft"   ← always starts here

Admin actions on a product:
    draft     → [Publish]    → published   (visible on public site)
    published → [Unpublish]  → draft       (hidden from public)
    published → [Archive]    → archived    (retired, hidden)
    archived  → [Restore]    → draft       (back to draft for review)
    draft     → [Archive]    → archived    (direct archive without publishing)
```

### Draft / Published / Archived Logic

| State | Public `GET /api/products` | Admin `GET /api/admin/products` | Admin actions available |
|-------|:--------------------------:|:-------------------------------:|------------------------|
| `draft` | ❌ Hidden | ✅ Visible | Publish, Archive |
| `published` | ✅ Visible | ✅ Visible | Unpublish, Archive |
| `archived` | ❌ Hidden | ✅ Visible | Restore (→ draft) |

**Key rules:**
- New products always start as `draft` — they never accidentally go live
- Only `published` products appear on the public website and in the hero stats
- `archived` is a soft-delete — the product is preserved in the DB and can be restored
- Hard delete (`DELETE /api/products/:id`) permanently removes the product

---

## 7. Storage Documentation

### Upload Flow (Presigned URL)

```
Admin selects an image file
    │
    ├── Client validates: image/*, max 5 MB
    │
    └── POST /api/storage/uploads/request-url
            body: { name, size, contentType }
            header: Authorization: Bearer <token>
                    │
                    └── Server generates GCS presigned URL
                            response: { uploadURL, objectPath }
                                │
                                └── Client PUTs file directly to GCS (uploadURL)
                                        (bypasses our server — no bandwidth cost)
                                                │
                                                └── objectPath saved to DB
                                                    e.g. /objects/uploads/<uuid>
```

### Logo Upload

- Field in admin form: "Product Logo"
- Stored in DB as `logo_url` (object path)
- Displayed via `storageUrl(objectPath)` → `GET /api/storage/objects/uploads/<uuid>`
- Max: 1 logo per product
- Recommended size: 128×128px or 256×256px square

### Screenshot Uploads

- 4 screenshot fields: `screenshot1_url` through `screenshot4_url`
- Labels: Overview, Dashboard, Settings, Mobile
- Same upload flow as logo
- Displayed in product detail page with lightbox/carousel
- Recommended size: 1280×720px (16:9) or 390×844px (mobile)

### Storage Provider Configuration

The storage system uses Replit Object Storage which wraps Google Cloud Storage. Three env vars control it:

| Variable | Purpose |
|----------|---------|
| `DEFAULT_OBJECT_STORAGE_BUCKET_ID` | GCS bucket to store uploads in |
| `PRIVATE_OBJECT_DIR` | Path prefix for private objects |
| `PUBLIC_OBJECT_SEARCH_PATHS` | Comma-separated paths for public object search |

On Replit: these are auto-injected when the Object Storage integration is added.  
On external hosts: you must provision a GCS bucket and set these manually, or refactor `objectStorage.ts` to use S3/another provider.

### Storage URL Helper

```typescript
// lib: artifacts/smart-agent-hub/src/lib/storage.ts
storageUrl(objectPath)
// Input:  "/objects/uploads/abc123"
// Output: "/api/storage/objects/uploads/abc123"
// Input:  null | undefined | ""
// Output: null (safe to use in <img src={storageUrl(x) ?? undefined}>)
```

---

## 8. Production Readiness Report

### Security Status ✅

| Check | Status | Notes |
|-------|:------:|-------|
| Hardcoded credentials removed | ✅ | Password was in source code in v1.0.0 — fully removed in v2.0.0 |
| Server-side authentication | ✅ | JWT verified on every protected request |
| Timing-safe credential comparison | ✅ | `crypto.timingSafeEqual` prevents timing attacks |
| Auth-protected mutations | ✅ | All POST/PUT/PATCH/DELETE require valid JWT |
| Auth-protected storage uploads | ✅ | Presigned URL endpoint requires JWT |
| Secrets in env vars | ✅ | All 7 required secrets are in Replit Secrets |
| Input validation | ✅ | Zod validates all request bodies (generated from OpenAPI) |
| CORS | ✅ | Express `cors()` middleware enabled |
| SQL injection | ✅ | Drizzle ORM uses parameterized queries |
| No secrets in git history | ✅ | `.gitignore` covers `.env*`, `.local/` |

### TypeScript

| Check | Status |
|-------|:------:|
| `pnpm run typecheck` | ✅ 0 errors |
| All packages: api-server, smart-agent-hub, mockup-sandbox, scripts | ✅ Clean |

### Known Limitations

1. **Single admin only** — there is one shared username/password. Multi-admin support with individual accounts is not implemented (by design for Phase 2).
2. **No token refresh** — JWT expires after 8 hours. Admin must log in again. No silent refresh.
3. **No rate limiting** — the login endpoint has no brute-force protection (e.g. rate-limit after N failed attempts). Acceptable for a personal admin panel behind a secret URL.
4. **Storage is Replit-specific** — `objectStorage.ts` uses Replit's Object Storage wrapper. Migrating to another host requires replacing this with a standard GCS/S3 SDK.
5. **No HTTPS enforcement server-side** — TLS is handled by Replit's proxy in production. On self-hosted deployments, enforce HTTPS at the reverse proxy layer.
6. **`drizzle-kit push` not `migrate`** — The project uses schema push, not migration files. This is fine for a single-developer project but means there is no rollback history for schema changes.

### Remaining Improvements (Roadmap)

| Item | Priority | Notes |
|------|----------|-------|
| Login rate limiting | Medium | Add `express-rate-limit` to `POST /auth/login` |
| JWT refresh token | Low | Extend session without re-login |
| Image optimization | Low | Compress images on upload (sharp) |
| Analytics dashboard | Low | Product view counts, visitor stats |
| Multi-admin support | Low | Per-user accounts with role-based access |
| Audit log | Low | Track who changed what and when |
| S3/external storage | Medium | Needed when leaving Replit platform |

---

## 9. Key Files Reference

```
Root
├── pnpm-workspace.yaml          Workspace config + catalog pins
├── tsconfig.base.json           Shared TypeScript config
├── CHANGELOG.md                 Version history
├── RELEASE.md                   Release documentation
├── PROJECT_HANDOVER.md          This file
├── DEPLOYMENT_CHECKLIST.md      Pre-deployment checks
├── BACKUP_CHECKLIST.md          Backup procedures
│
lib/
├── api-spec/openapi.yaml        ← API source of truth (edit this)
├── api-zod/src/                 Generated Zod validators
├── api-client-react/src/        Generated React Query hooks
│   └── custom-fetch.ts          Fetch wrapper with auth token injection
└── db/src/
    ├── schema/products.ts       DB schema (source of truth)
    ├── db.ts                    Drizzle client
    └── seed.ts                  Initial product seed data
│
artifacts/api-server/src/
├── app.ts                       Express app setup
├── index.ts                     Server entry point
├── lib/
│   ├── auth.ts                  JWT sign/verify + credential check
│   ├── logger.ts                Pino logger singleton
│   ├── objectStorage.ts         GCS upload/serve wrapper
│   └── objectAcl.ts             Object access control
├── middleware/
│   └── requireAuth.ts           Bearer token middleware
└── routes/
    ├── auth.ts                  /auth/login, /auth/verify
    ├── products.ts              All product routes
    ├── storage.ts               Upload + serve routes
    └── health.ts                /healthz
│
artifacts/smart-agent-hub/src/
├── App.tsx                      Router + providers
├── main.tsx                     App entry point
├── pages/
│   ├── home.tsx                 Landing page
│   ├── products.tsx             Product grid
│   ├── product-detail.tsx       Product detail
│   ├── about.tsx                Founder page
│   ├── help.tsx                 Contact page
│   ├── updates.tsx              Changelog page
│   ├── admin.tsx                Admin panel
│   └── not-found.tsx            404 page
├── components/
│   ├── layout/Navbar.tsx        Navigation bar
│   └── layout/Footer.tsx        Footer
└── lib/
    └── storage.ts               storageUrl() helper
```

---

## 10. Contact / Founder

| | |
|--|--|
| **Name** | Adil Husain |
| **WhatsApp** | +919967873413 — https://wa.me/919967873413 |
| **Telegram** | @dil3413 — https://t.me/dil3413 |
| **Twitter/X** | @Husain3413 |
| **GitHub** | tokenanalyzer — https://github.com/tokenanalyzer |
| **LinkedIn** | https://linkedin.com/in/adil-hussain |
| **Email** | adilcryptonews@gmail.com / adilhusain3176@gmail.com |
