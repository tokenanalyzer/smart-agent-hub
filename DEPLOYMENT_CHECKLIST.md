# SAH Ecosystem — Deployment Checklist

**Version:** v2.0.0  
**Last updated:** June 1, 2026

Use this checklist before every production deployment. Check each item before proceeding to the next section.

---

## Phase 1 — Code Quality

- [ ] `pnpm run typecheck` passes with **0 errors**
- [ ] No `console.log` statements in server code (use `req.log` or `logger`)
- [ ] No hardcoded secrets, passwords, or tokens in any file
- [ ] All new API endpoints are defined in `lib/api-spec/openapi.yaml` first
- [ ] `pnpm --filter @workspace/api-spec run codegen` has been run after any OpenAPI spec change
- [ ] Generated files (`lib/api-zod/`, `lib/api-client-react/`) are committed

---

## Phase 2 — Environment Variables

Verify all required secrets are set in the target environment:

- [ ] `SESSION_SECRET` — long random string (min 32 chars), unique per environment
- [ ] `ADMIN_USERNAME` — admin login username
- [ ] `ADMIN_PASSWORD` — admin login password (strong, unique)
- [ ] `DATABASE_URL` — PostgreSQL connection string
- [ ] `DEFAULT_OBJECT_STORAGE_BUCKET_ID` — GCS bucket ID
- [ ] `PRIVATE_OBJECT_DIR` — GCS private directory path
- [ ] `PUBLIC_OBJECT_SEARCH_PATHS` — GCS public search paths

> On Replit: PostgreSQL and Object Storage vars are auto-injected via integrations.  
> On external hosts: set all 7 manually in your host's secrets manager.

---

## Phase 3 — Database

- [ ] PostgreSQL instance is running and reachable
- [ ] `DATABASE_URL` connection string is correct
- [ ] `pnpm --filter @workspace/db run push` has been run (schema is up to date)
- [ ] `products` table exists with all columns including `published_state`
- [ ] Seed data is present (or products have been added via admin panel)

**Quick schema verification:**
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
```

Expected columns: `id`, `name`, `category`, `tagline`, `description`, `version`, `status`, `features`, `logo_url`, `website_url`, `apk_url`, `github_url`, `telegram_url`, `screenshot1_url` through `screenshot4_url`, `accent_color`, `published_state`, `sort_order`, `created_at`, `updated_at`

---

## Phase 4 — Build Verification

- [ ] API server build: `pnpm --filter @workspace/api-server run build` → produces `dist/index.cjs`
- [ ] Frontend build: `pnpm --filter @workspace/smart-agent-hub run build` → produces `dist/`
- [ ] No build errors or warnings for missing modules

---

## Phase 5 — API Health Check

After deployment, verify the API is running:

- [ ] `GET /api/healthz` returns `{"status":"ok"}` with HTTP 200
- [ ] `GET /api/products` returns an array (may be empty) with HTTP 200
- [ ] `POST /api/products` without token returns HTTP 401
- [ ] `DELETE /api/products/1` without token returns HTTP 401
- [ ] `POST /api/auth/login` with wrong credentials returns HTTP 401
- [ ] `POST /api/auth/login` with correct credentials returns `{token: "..."}`
- [ ] `GET /api/admin/products` with valid token returns HTTP 200

---

## Phase 6 — Frontend Verification

- [ ] Home page loads and displays product count (or 0 if no published products)
- [ ] Products page loads without errors
- [ ] `/admin` shows the login form (username + password fields)
- [ ] Admin login works with correct credentials
- [ ] Admin panel shows all products (including draft/archived)
- [ ] Lifecycle buttons appear on hover (Publish, Archive, etc.)
- [ ] Creating a product defaults to `draft` state
- [ ] Publishing a product makes it visible on `/products`

---

## Phase 7 — Storage Verification

- [ ] Image upload works in admin panel (logo upload field)
- [ ] Uploaded image appears in the product list
- [ ] `GET /api/storage/objects/*` serves uploaded files
- [ ] File size limit (5 MB) is enforced client-side

---

## Phase 8 — Security Verification

- [ ] Old password `sah-admin-2024` does NOT work (verify login rejects it)
- [ ] Wrong username/password → "Invalid credentials" error
- [ ] No admin actions possible without JWT (all return 401)
- [ ] Admin token expires after 8 hours (JWT expiry)
- [ ] Logout clears session token

---

## Phase 9 — Git & Version Control

- [ ] Working tree is clean: `git --no-optional-locks status` shows "nothing to commit"
- [ ] All changes are committed
- [ ] `git --no-optional-locks log --oneline -3` shows expected commits
- [ ] Version tag exists: `git --no-optional-locks tag | grep v2.0.0`
- [ ] GitHub is up to date: local HEAD matches `github/main`

**To push to GitHub** (run in Shell tab):
```bash
bash .local/github-push.sh
```

---

## Phase 10 — Replit Deployment (if applicable)

- [ ] All workflows are running (api-server, smart-agent-hub)
- [ ] No error messages in workflow logs
- [ ] Preview pane shows the live site
- [ ] Click **Deploy** in Replit → confirm deployment is successful
- [ ] Visit the `.replit.app` URL and verify home page loads
- [ ] Test admin login on the deployed URL
- [ ] Test product lifecycle on the deployed URL

---

## Sign-off

| Check | Status | Notes |
|-------|--------|-------|
| Typecheck | | |
| All env vars set | | |
| DB schema pushed | | |
| API health OK | | |
| Admin login works | | |
| GitHub up to date | | |
| Deployed URL working | | |

**Deployed by:** _______________  
**Date:** _______________  
**Version:** v2.0.0  
