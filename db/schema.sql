-- ============================================================
-- SCM HUB · 권한 시스템 스키마
-- ============================================================
-- 역할(role): super, admin, biz, internal
--   super    : 모든 계정 생성/삭제 가능
--   admin    : biz/internal 계정만 생성 가능, admin 삭제 불가
--   biz      : 현업, 권한 없음
--   internal : 내부, 권한 없음
-- ============================================================

-- 1. users — 계정 정보
CREATE TABLE IF NOT EXISTS users (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  email              TEXT    NOT NULL UNIQUE,
  name               TEXT,
  role               TEXT    NOT NULL CHECK (role IN ('super', 'admin', 'biz', 'internal', 'pm', 'dev', 'pd')),
  password_hash      TEXT,                          -- bcrypt hash. NULL until invite accepted.
  invite_token       TEXT    UNIQUE,                -- random 64-char hex. NULL after accepted.
  invite_expires_at  INTEGER,                       -- unix epoch (sec). NULL after accepted.
  created_by_user_id INTEGER,                       -- who invited/created this user.
  created_at         INTEGER NOT NULL DEFAULT (unixepoch()),
  last_login_at      INTEGER,
  is_active          INTEGER NOT NULL DEFAULT 1,    -- 0 = disabled, 1 = active
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_users_email        ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_invite_token ON users(invite_token);
CREATE INDEX IF NOT EXISTS idx_users_role         ON users(role);


-- 2. sessions — 로그인 세션
CREATE TABLE IF NOT EXISTS sessions (
  id          TEXT    PRIMARY KEY,                  -- random 64-char hex (cookie value)
  user_id     INTEGER NOT NULL,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  expires_at  INTEGER NOT NULL,                     -- unix epoch (sec)
  ip          TEXT,
  user_agent  TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id    ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);


-- 3. audit_log — 감사 로그 (누가 무엇을 했나)
CREATE TABLE IF NOT EXISTS audit_log (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_user_id   INTEGER,                          -- 행위자 (NULL = 익명/로그인 시도 등)
  target_user_id  INTEGER,                          -- 대상 사용자 (계정 관리 액션일 때)
  action          TEXT    NOT NULL,                 -- 'login', 'login_failed', 'logout',
                                                    -- 'invite_create', 'invite_accept',
                                                    -- 'user_disable', 'user_delete',
                                                    -- 'role_change'
  details         TEXT,                             -- JSON blob (자유 형식)
  ip              TEXT,
  user_agent      TEXT,
  created_at      INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (actor_user_id)  REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_actor      ON audit_log(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_target     ON audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action     ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_log(created_at);
