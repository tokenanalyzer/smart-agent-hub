# SAH Ecosystem — Backup Checklist

**Version:** v2.0.0  
**Last updated:** June 1, 2026

---

## What Needs to Be Backed Up

| Asset | Criticality | Method |
|-------|:-----------:|--------|
| PostgreSQL database (products table) | 🔴 Critical | pg_dump |
| Google Cloud Storage objects (logos, screenshots) | 🔴 Critical | GCS bucket export |
| GitHub repository (code) | 🟡 Important | Git push |
| Environment secrets | 🔴 Critical | Secure vault |
| Replit checkpoint history | 🟢 Nice to have | Automatic |

---

## 1. Database Backup

### Manual Backup (run in Shell tab)

```bash
# Set your DATABASE_URL if not already in env
# export DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Full database backup (schema + data)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Data-only backup (products table)
pg_dump --data-only --table=products $DATABASE_URL > products_$(date +%Y%m%d_%H%M%S).sql

# Verify backup was created
ls -lh *.sql
```

### Restore from Backup

```bash
# Restore full backup
psql $DATABASE_URL < backup_YYYYMMDD_HHMMSS.sql

# Restore data only (schema must already exist)
psql $DATABASE_URL < products_YYYYMMDD_HHMMSS.sql
```

### Backup Verification

After creating a backup, verify it:

```bash
# Check backup file is not empty
wc -l backup_YYYYMMDD.sql

# Quick check — should show the COPY command for products
grep "^COPY public.products" backup_YYYYMMDD.sql

# Count records in backup
grep -c "^[0-9]" products_YYYYMMDD.sql || echo "Check backup content manually"
```

### Recommended Backup Schedule

- [ ] **Before any schema change** — always backup before running `drizzle-kit push`
- [ ] **Weekly** — full pg_dump stored off-site
- [ ] **Before deployment** — backup before every production deploy
- [ ] **Monthly** — verify restore works on a test database

---

## 2. Media / Storage Backup (GCS)

All uploaded images (logos, screenshots) live in the GCS bucket configured via `DEFAULT_OBJECT_STORAGE_BUCKET_ID`.

### Option A — GCS Bucket Transfer (Recommended)

```bash
# Install gsutil (Google Cloud SDK)
# https://cloud.google.com/sdk/docs/install

# List all objects in the bucket
gsutil ls gs://YOUR_BUCKET_ID/objects/uploads/

# Download all uploads to local backup folder
gsutil -m cp -r gs://YOUR_BUCKET_ID/objects/uploads/ ./media_backup_$(date +%Y%m%d)/

# Verify download
ls -lh ./media_backup_$(date +%Y%m%d)/
```

### Option B — Replit Object Storage (if staying on Replit)

Replit Object Storage is managed by Replit. Backups are handled at the platform level. Export via the Replit CLI if needed.

### Media Backup Checklist

- [ ] List all object paths stored in the database:
  ```sql
  SELECT logo_url, screenshot1_url, screenshot2_url, screenshot3_url, screenshot4_url
  FROM products
  WHERE logo_url IS NOT NULL
     OR screenshot1_url IS NOT NULL;
  ```
- [ ] Confirm all referenced object paths exist in GCS
- [ ] Download backup copy of all objects
- [ ] Store backup in a separate location from the source bucket

---

## 3. Code / GitHub Backup

### Verify GitHub is Current

```bash
# Check local vs remote status
git --no-optional-locks log --oneline github/main..HEAD

# If output is empty, GitHub is up to date
# If output shows commits, push them:
bash .local/github-push.sh
```

### GitHub Backup Checklist

- [ ] All commits pushed to `github/main`
- [ ] Tag `v2.0.0` exists on GitHub:
  ```
  https://github.com/tokenanalyzer/smart-agent-hub/releases/tag/v2.0.0
  ```
- [ ] All branches pushed (currently only `main`)
- [ ] Repository is not set to Public accidentally (check GitHub → Settings → Danger Zone)

### Clone Backup (optional)

```bash
# Clone a fresh copy to verify integrity
git clone https://github.com/tokenanalyzer/smart-agent-hub.git sah-backup
cd sah-backup
git log --oneline -5
```

---

## 4. Environment Secrets Backup

**Never store secrets in plain text files or git.** Use a secure vault.

### Secrets to Back Up

| Secret | How to Back Up |
|--------|---------------|
| `SESSION_SECRET` | Copy to a password manager (e.g. 1Password, Bitwarden) |
| `ADMIN_USERNAME` | Copy to password manager |
| `ADMIN_PASSWORD` | Copy to password manager |
| `DATABASE_URL` | Copy to password manager (contains DB credentials) |
| GCS storage vars | Note the Replit integration config |
| GitHub PAT token | Stored in `.local/github-push.sh` — copy to password manager, set expiry reminder |

### Checklist

- [ ] All 7 required secrets copied to a secure password manager
- [ ] GitHub PAT expiry date noted and calendar reminder set
- [ ] New team members briefed on secret rotation process
- [ ] Old/rotated secrets invalidated (especially the old hardcoded password `sah-admin-2024` which is no longer valid)

---

## 5. Replit Checkpoint History

Replit automatically creates checkpoints on significant changes. These serve as point-in-time snapshots.

- [ ] Note the commit hash of the current stable version: `f11ef74`
- [ ] If something breaks, rollback is available via Replit → History → select checkpoint
- [ ] Critical checkpoints to remember:
  - `f11ef74` — v2.0.0 (current stable — auth + lifecycle)
  - `e9e4da2` — v1.0.0 stable (before auth)

---

## 6. Full Backup Procedure (Run Before Major Changes)

Follow this sequence:

```bash
# 1. Git — push all code to GitHub
bash .local/github-push.sh

# 2. Database — dump all data
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
echo "Database backup: OK"

# 3. Verify backup
wc -l *.sql | tail -1
echo "Backup verification: OK"

# 4. Optionally move backup off-Replit
# (copy to your local machine via Replit file download or scp)
```

---

## 7. Disaster Recovery

### Scenario: Database Lost

1. Create a new PostgreSQL instance
2. Set `DATABASE_URL` to the new connection string
3. Run `pnpm --filter @workspace/db run push` to recreate schema
4. Restore from backup: `psql $DATABASE_URL < products_YYYYMMDD.sql`
5. Restart the API server workflow

### Scenario: GCS Bucket Lost

1. Create a new GCS bucket
2. Update `DEFAULT_OBJECT_STORAGE_BUCKET_ID`, `PRIVATE_OBJECT_DIR`, `PUBLIC_OBJECT_SEARCH_PATHS`
3. Restore objects from local backup: `gsutil -m cp -r ./media_backup/ gs://NEW_BUCKET/`
4. Object paths in the DB remain the same — no DB changes needed
5. Restart the API server workflow

### Scenario: Admin Password Forgotten

1. Go to Replit → Secrets tab
2. Update `ADMIN_PASSWORD` to a new value
3. Restart the API server workflow (the new secret is loaded on start)
4. Log in with the new password

### Scenario: SESSION_SECRET Rotated

If `SESSION_SECRET` is changed, **all existing JWT tokens are immediately invalidated**. All admins must log in again. This is expected behavior.

1. Update `SESSION_SECRET` in Replit Secrets
2. Restart the API server workflow
3. Log in to admin panel again

---

## Backup Log

Use this table to track completed backups:

| Date | Type | File/Location | Performed by | Notes |
|------|------|---------------|-------------|-------|
| 2026-06-01 | Initial | github/main @ f11ef74 | Adil Husain | v2.0.0 release |
| | | | | |
| | | | | |
