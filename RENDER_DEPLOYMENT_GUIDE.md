# SAH Ecosystem — Render Deployment Guide

**Version:** v2.0.0  
**Target Platform:** Render (render.com)  
**Deployment model:** API (Web Service) + Frontend (Static Site) + PostgreSQL (Managed DB)  
**Estimated time:** 2–4 hours (first-time setup)

---

## Contents

1. [Prerequisites](#1-prerequisites)
2. [Architecture on Render](#2-architecture-on-render)
3. [Environment Variables Reference](#3-environment-variables-reference)
4. [Phase 1 — Deploy the API Service](#4-phase-1--deploy-the-api-service)
5. [Phase 2 — Deploy the Frontend](#5-phase-2--deploy-the-frontend)
6. [Database Migration](#6-database-migration)
7. [Storage Limitation & Fix](#7-storage-limitation--fix)
8. [Build & Start Command Reference](#8-build--start-command-reference)
9. [Verified Build Output Paths](#9-verified-build-output-paths)
10. [Troubleshooting](#10-troubleshooting)
11. [Cold Start Warning](#11-cold-start-warning)
12. [Free Tier Limits](#12-free-tier-limits)

---

## 1. Prerequisites

- Render account — [render.com](https://render.com) (free tier is sufficient)
- GitHub repository connected to Render — `https://github.com/tokenanalyzer/smart-agent-hub`
- No local tooling required — Render builds everything in the cloud

---

## 2. Architecture on Render

```
Browser
  ├── https://sah-frontend.onrender.com/           → Render Static Site (Vite SPA)
  └── https://sah-frontend.onrender.com/api/*      → Render CDN proxy → sah-api.onrender.com
                                                            ↓
                                                   Render Web Service (Express 5)
                                                            ↓
                                                   Render PostgreSQL (sah-db)
```

**Why two services?** The frontend makes relative `/api/...` calls. Render's static site `routes` config proxies these calls to the API service, replicating the Replit reverse proxy behaviour without any code changes.

**What WON'T work out of the box:** Image uploads (logos/screenshots) use a Replit-internal auth sidecar (`127.0.0.1:1106`) that does not exist on Render. See [Section 7](#7-storage-limitation--fix).

---

## 3. Environment Variables Reference

### API Service (`sah-api`)

| Variable | Required | Source | Description |
|----------|:--------:|--------|-------------|
| `NODE_ENV` | ✅ | `render.yaml` → `production` | Runtime mode |
| `NODE_VERSION` | ✅ | `render.yaml` → `24.13.0` | Pins Node.js version |
| `PORT` | ✅ | **Auto-injected by Render** | Do NOT set manually |
| `SESSION_SECRET` | ✅ | `render.yaml` → `generateValue: true` | JWT signing key — auto-generated |
| `ADMIN_USERNAME` | ✅ | **Set manually in dashboard** | Admin login username |
| `ADMIN_PASSWORD` | ✅ | **Set manually in dashboard** | Admin login password |
| `DATABASE_URL` | ✅ | `render.yaml` → from `sah-db` | Auto-injected from the managed database |
| `DEFAULT_OBJECT_STORAGE_BUCKET_ID` | ⚠️ | **Set manually** | GCS bucket — affects image upload only |
| `PRIVATE_OBJECT_DIR` | ⚠️ | **Set manually** | GCS path — affects image upload only |
| `PUBLIC_OBJECT_SEARCH_PATHS` | ⚠️ | **Set manually** | GCS path — affects image upload only |

> ⚠️ Storage vars are needed by the code at startup but only affect image upload/serve. Set them to any non-empty string to prevent startup errors while you implement the storage fix (see Section 7).

### Frontend Static Site (`sah-frontend`)

| Variable | Required | Set In | Description |
|----------|:--------:|--------|-------------|
| `PORT` | ✅ | Build command | Vite requires this at build time — hardcoded to `3000` in build command |
| `BASE_PATH` | ✅ | Build command | Vite requires this at build time — hardcoded to `/` in build command |

No runtime env vars needed — the frontend is a static build.

---

## 4. Phase 1 — Deploy the API Service

> Deploy the API first. You need its URL to configure the frontend proxy.

### Option A — Render Blueprint (Recommended)

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**
2. Connect your GitHub repo: `tokenanalyzer/smart-agent-hub`
3. Render detects `render.yaml` automatically
4. Click **Apply** — Render creates:
   - `sah-db` PostgreSQL database
   - `sah-api` Web Service
   - `sah-frontend` Static Site

5. **BEFORE the frontend builds**, update `render.yaml`:
   - Find `REPLACE_WITH_API_URL`
   - Replace with your API URL (shown in Render dashboard, e.g. `https://sah-api.onrender.com`)
   - Commit and push the change

### Option B — Manual Setup (Web Service)

1. **New** → **Web Service** → connect repo
2. Fill in:
   | Field | Value |
   |-------|-------|
   | **Name** | `sah-api` |
   | **Region** | Oregon (or closest to you) |
   | **Branch** | `main` |
   | **Runtime** | Node |
   | **Build Command** | *(see Section 8)* |
   | **Start Command** | `node --enable-source-maps artifacts/api-server/dist/index.mjs` |
   | **Plan** | Free |

3. Add environment variables (Environment tab):
   - `NODE_ENV` = `production`
   - `NODE_VERSION` = `24.13.0`
   - `SESSION_SECRET` = *(generate a random 64-char string)*
   - `ADMIN_USERNAME` = *(your choice)*
   - `ADMIN_PASSWORD` = *(strong password)*
   - `DATABASE_URL` = *(from the database you create in step 4)*
   - `DEFAULT_OBJECT_STORAGE_BUCKET_ID` = `placeholder`
   - `PRIVATE_OBJECT_DIR` = `placeholder`
   - `PUBLIC_OBJECT_SEARCH_PATHS` = `placeholder`

4. **New** → **PostgreSQL**:
   | Field | Value |
   |-------|-------|
   | **Name** | `sah-db` |
   | **Database Name** | `sah_ecosystem` |
   | **Plan** | Free |

5. Copy the Internal Database URL from the database → paste as `DATABASE_URL` on the API service

6. Click **Create Web Service** → wait for build and deploy (~5–8 min)

7. Visit `https://sah-api.onrender.com/api/healthz` → should return `{"status":"ok"}`

---

## 5. Phase 2 — Deploy the Frontend

> Must be done after Phase 1 — you need the API URL.

### Update the proxy URL in render.yaml

1. Open `render.yaml` in the repo
2. Replace `REPLACE_WITH_API_URL` with your actual API URL:
   ```yaml
   routes:
     - type: rewrite
       source: /api/*
       destination: https://sah-api.onrender.com/api/*   # ← your actual URL
   ```
3. Commit and push to GitHub

### Option A — Blueprint (auto-created above)

After updating `render.yaml` and pushing:
1. Render auto-deploys both services from the updated blueprint
2. Wait for the static site build (~3–5 min)

### Option B — Manual Setup (Static Site)

1. **New** → **Static Site** → connect repo
2. Fill in:
   | Field | Value |
   |-------|-------|
   | **Name** | `sah-frontend` |
   | **Branch** | `main` |
   | **Build Command** | *(see Section 8)* |
   | **Publish Directory** | `artifacts/smart-agent-hub/dist/public` |

3. **Redirects/Rewrites** tab → add rules:
   | Source | Destination | Action |
   |--------|------------|--------|
   | `/api/*` | `https://sah-api.onrender.com/api/*` | Rewrite |
   | `/*` | `/index.html` | Rewrite |

4. Click **Create Static Site**

### Verify the frontend

- Visit your static site URL → home page loads
- Visit `/admin` → login form appears
- Log in → admin panel shows products (fetched via the proxied API)
- Visit `/products` → published products appear

---

## 6. Database Migration

### How it works

The `render.yaml` build command for the API service includes:
```bash
DATABASE_URL=$DATABASE_URL pnpm --filter @workspace/db run push-force
```

This runs `drizzle-kit push --force` during every build, applying any schema changes to the Render PostgreSQL database before the server starts. **No manual SQL or migration files are needed.**

### First deploy schema check

After the first successful deploy, verify the schema was applied:

1. In Render dashboard → `sah-db` → **Connect** → **PSQL Command**
2. Run:
   ```sql
   \dt
   -- Should show: products table

   \d products
   -- Should show all columns including published_state
   ```

### Migrate data from Replit PostgreSQL

If you want to carry your existing product data from Replit to Render:

**Step 1: Export from Replit** (run in Replit Shell tab)
```bash
pg_dump $DATABASE_URL --data-only --table=products > products_export.sql
```

**Step 2: Download the file**
- Replit → Files panel → right-click `products_export.sql` → Download

**Step 3: Import to Render**
```bash
# Get the External Database URL from Render dashboard → sah-db → Info
export RENDER_DB_URL="postgresql://user:password@host:5432/sah_ecosystem"

psql $RENDER_DB_URL < products_export.sql
```

**Step 4: Verify**
```sql
SELECT id, name, published_state FROM products ORDER BY id;
```

### Reseed from scratch (optional)

If you want fresh seed data instead of migrating, the API server auto-seeds on first start if the products table is empty. Delete existing rows to trigger a reseed:

```sql
DELETE FROM products;
-- Restart the API service → 6 default products are inserted automatically
```

---

## 7. Storage Limitation & Fix

### The Problem

`artifacts/api-server/src/lib/objectStorage.ts` authenticates with Google Cloud Storage using a Replit-internal token endpoint:

```typescript
const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
// This only exists inside Replit containers — not on Render
```

On Render this endpoint does not exist, so:
- ✅ Everything works: products, admin login, lifecycle, public site, auth
- ❌ Broken: logo uploads, screenshot uploads, serving uploaded images

### The Fix (one-time code change)

Replace the Replit-specific credentials in `objectStorage.ts` with a standard GCS service account:

**Step 1:** Create a GCS service account in [Google Cloud Console](https://console.cloud.google.com):
- Go to **IAM & Admin** → **Service Accounts** → **Create**
- Grant role: **Storage Object Admin**
- Create a JSON key → download it

**Step 2:** In Render dashboard → `sah-api` → **Environment**:
```
GCS_SERVICE_ACCOUNT_JSON = <paste the entire JSON key file content>
GCS_BUCKET_NAME = <your GCS bucket name>
```

**Step 3:** In `artifacts/api-server/src/lib/objectStorage.ts`, replace:
```typescript
const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

export const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    ...
  },
});
```

With:
```typescript
const credentials = JSON.parse(process.env.GCS_SERVICE_ACCOUNT_JSON!);

export const objectStorageClient = new Storage({
  credentials,
  projectId: credentials.project_id,
});
```

**Step 4:** Update the bucket name reference to read from `process.env.GCS_BUCKET_NAME`.

This is the only code change required for full feature parity with Replit.

### Alternative: Cloudinary (no GCS required)

If you prefer not to manage a GCS bucket, [Cloudinary](https://cloudinary.com) has a free tier (25 GB storage, 25 GB bandwidth/month). Replace `objectStorage.ts` with Cloudinary's Node.js SDK. This requires a more involved refactor of the upload flow.

---

## 8. Build & Start Command Reference

### API Service — Build Command

```bash
npm install -g pnpm@10 &&
pnpm install --frozen-lockfile &&
pnpm run typecheck:libs &&
DATABASE_URL=$DATABASE_URL pnpm --filter @workspace/db run push-force &&
pnpm --filter @workspace/api-server run build
```

**What each step does:**
| Step | Purpose |
|------|---------|
| `npm install -g pnpm@10` | Install pnpm (Render doesn't pre-install it) |
| `pnpm install --frozen-lockfile` | Install all workspace deps from lockfile |
| `pnpm run typecheck:libs` | Build composite lib packages (`lib/db`, `lib/api-zod`, etc.) |
| `pnpm --filter @workspace/db run push-force` | Apply DB schema (runs `drizzle-kit push --force`) |
| `pnpm --filter @workspace/api-server run build` | Compile API with esbuild → `artifacts/api-server/dist/index.mjs` |

### API Service — Start Command

```bash
node --enable-source-maps artifacts/api-server/dist/index.mjs
```

- `--enable-source-maps`: maps runtime errors to original TypeScript line numbers
- Render auto-injects `PORT` — the server reads `process.env.PORT`
- `NODE_ENV=production` is set via env vars

### Frontend — Build Command

```bash
npm install -g pnpm@10 &&
pnpm install --frozen-lockfile &&
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/smart-agent-hub run build
```

**Why `PORT=3000 BASE_PATH=/`?**  
`vite.config.ts` throws if these env vars are not set (they are required at build time even for a production build). `3000` is an unused placeholder during build — it does not affect the static output.

### Frontend — Publish Directory

```
artifacts/smart-agent-hub/dist/public
```

> ⚠️ Note `dist/public`, NOT `dist/`. The Vite config explicitly sets `outDir` to `dist/public`. Using `dist/` will result in a 404 on every page.

---

## 9. Verified Build Output Paths

| Artifact | Output Path | Notes |
|----------|------------|-------|
| API server bundle | `artifacts/api-server/dist/index.mjs` | ESM format, source-mapped |
| API server source map | `artifacts/api-server/dist/index.mjs.map` | Linked source map |
| Frontend SPA | `artifacts/smart-agent-hub/dist/public/` | Vite production build |
| Frontend entry | `artifacts/smart-agent-hub/dist/public/index.html` | SPA shell |
| Frontend assets | `artifacts/smart-agent-hub/dist/public/assets/` | Hashed JS/CSS bundles |

---

## 10. Troubleshooting

### Build fails: `pnpm: command not found`

The Render build environment doesn't have pnpm by default. Confirm the build command starts with:
```bash
npm install -g pnpm@10 &&
```

### Build fails: `PORT environment variable is required`

The Vite config enforces PORT at build time. Confirm the frontend build command includes:
```bash
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/smart-agent-hub run build
```

### Build fails: `Cannot find module '@workspace/db'`

The composite lib packages must be built before the API server. Confirm `pnpm run typecheck:libs` runs before `pnpm --filter @workspace/api-server run build`.

### API returns 502 / service not found

1. Check Render logs → Events tab on the `sah-api` service
2. Common cause: PORT is not provided. Render auto-injects it — verify the start command does not hardcode a port.
3. Check `SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` are all set — the server starts before auth is needed, but missing env vars surface early.

### Frontend `/api/*` calls return 404

The static site proxy rewrite rule is not set. In `render.yaml`, verify:
```yaml
routes:
  - type: rewrite
    source: /api/*
    destination: https://sah-api.onrender.com/api/*   # ← must be your real API URL
```

### Admin login works but product images are broken

Expected — this is the storage limitation described in Section 7. The `/api/storage/...` routes fail because the Replit sidecar isn't present on Render. Apply the fix in Section 7 to restore image support.

### Database: `relation "products" does not exist`

The schema push failed during build. Check the API service build logs for a `drizzle-kit push` error. Most common cause: `DATABASE_URL` was not available during build. Verify the `fromDatabase` link in `render.yaml` or that `DATABASE_URL` is set in the environment.

### Free tier service is sleeping (30s cold start)

Expected behaviour on Render free tier. The service spins down after 15 minutes of inactivity. First request after idle takes ~25–35 seconds. This does not affect the static site (CDN always available). Upgrade to the Starter plan ($7/month) to eliminate cold starts.

---

## 11. Cold Start Warning

Render's free tier Web Services **spin down after 15 minutes of inactivity**. The first request after a sleep period causes a cold start of approximately 25–35 seconds.

**Impact:**
- First visit to `/admin` or any API call after idle → noticeable delay
- Subsequent requests within the active window → normal speed
- Static site (frontend) is always instant — it runs on Render's CDN

**Options to avoid cold starts:**
- Upgrade API service to Starter plan ($7/month) — no spin-down
- Use an external pinger (cron-job.org, UptimeRobot free tier) to ping `/api/healthz` every 14 minutes — keeps the service awake (against Render's ToS on free tier, use at your own risk)
- Self-host on a VPS (DigitalOcean $6/month Droplet) for always-on hosting

---

## 12. Free Tier Limits

| Resource | Free Limit | SAH Ecosystem Usage |
|----------|-----------|---------------------|
| Web Service compute | 750 hrs/month | ~31 days — enough for 1 service |
| Static Site bandwidth | Unlimited | ✅ No concern |
| PostgreSQL storage | 1 GB | ✅ 6 products ≈ < 1 MB |
| PostgreSQL connections | 97 | ✅ Well within |
| PostgreSQL retention | 90 days then paid | ⚠️ Plan to upgrade or migrate |
| Build minutes | 500/month | ✅ ~5 min/build |
| Services count | Unlimited on free | ✅ |

> The PostgreSQL free tier expires after **90 days**. Before day 90, either upgrade to the $7/month Starter plan or export your data and migrate to a free external provider (Neon, Supabase — both have permanent free PostgreSQL tiers).

---

## Quick Reference Card

```
Repository:     https://github.com/tokenanalyzer/smart-agent-hub
Branch:         main
API service:    sah-api      → https://sah-api.onrender.com
Frontend:       sah-frontend → https://sah-frontend.onrender.com
Database:       sah-db (Render PostgreSQL, free, Oregon)
Health check:   https://sah-api.onrender.com/api/healthz

Build — API:    npm install -g pnpm@10 && pnpm install --frozen-lockfile &&
                pnpm run typecheck:libs &&
                DATABASE_URL=$DATABASE_URL pnpm --filter @workspace/db run push-force &&
                pnpm --filter @workspace/api-server run build

Start — API:    node --enable-source-maps artifacts/api-server/dist/index.mjs

Build — FE:     npm install -g pnpm@10 && pnpm install --frozen-lockfile &&
                PORT=3000 BASE_PATH=/ pnpm --filter @workspace/smart-agent-hub run build

Publish dir:    artifacts/smart-agent-hub/dist/public   ← not dist/!
```
