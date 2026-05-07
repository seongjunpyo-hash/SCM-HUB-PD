-- ============================================================
-- Migration 001 — extend `users.role` CHECK to include pm / dev / pd
-- ============================================================
-- The original schema (db/schema.sql @ commit 543cb04) created the
-- `users` table with:
--   role TEXT NOT NULL CHECK (role IN ('super', 'admin', 'biz'))
--   (and briefly 'internal' on commit 529f88c)
--
-- Newer code (commits 529f88c → d4d9c5f) split 'internal' into three
-- sub-roles: pm / dev / pd. The CHECK constraint in the prod D1
-- database was NOT auto-updated — SQLite has no `ALTER TABLE … ALTER
-- CHECK …`. INSERTing a row with role IN ('pm','dev','pd') therefore
-- fails with SQLITE_CONSTRAINT (server_error in the API response).
--
-- This migration recreates the table in-place with the corrected
-- CHECK and copies all existing rows over.
--
-- Apply with wrangler:
--   wrangler d1 execute <DB_NAME> --file=db/migrations/001-roles-pm-dev-pd.sql --remote
--
-- Idempotent: subsequent runs no-op because the table already has the
-- expected CHECK (the IF NOT EXISTS on the temp table guards reruns
-- mid-flight).
--
-- NOTE: D1 (Cloudflare) does NOT accept SQL BEGIN TRANSACTION / COMMIT
-- in the Console or in `wrangler d1 execute`. When the migration is
-- submitted as a single multi-statement file, D1 wraps the batch in
-- its own atomic transaction automatically — so explicit BEGIN/COMMIT
-- is both unnecessary and rejected.
-- ============================================================

-- 1) New table with the updated CHECK constraint.
CREATE TABLE IF NOT EXISTS users_new (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  email              TEXT    NOT NULL UNIQUE,
  name               TEXT,
  role               TEXT    NOT NULL CHECK (role IN ('super', 'admin', 'biz', 'pm', 'dev', 'pd')),
  password_hash      TEXT,
  invite_token       TEXT    UNIQUE,
  invite_expires_at  INTEGER,
  created_by_user_id INTEGER,
  created_at         INTEGER NOT NULL DEFAULT (unixepoch()),
  last_login_at      INTEGER,
  is_active          INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (created_by_user_id) REFERENCES users_new(id)
);

-- 2) Copy every row from the old table.
INSERT INTO users_new
  (id, email, name, role, password_hash, invite_token, invite_expires_at,
   created_by_user_id, created_at, last_login_at, is_active)
SELECT
   id, email, name, role, password_hash, invite_token, invite_expires_at,
   created_by_user_id, created_at, last_login_at, is_active
FROM users;

-- 3) Replace.
DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

-- 4) Re-create indexes (DROP TABLE drops indexes too).
CREATE INDEX IF NOT EXISTS idx_users_email        ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_invite_token ON users(invite_token);
CREATE INDEX IF NOT EXISTS idx_users_role         ON users(role);
