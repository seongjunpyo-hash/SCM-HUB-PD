-- ============================================================
-- Migration 002 — account creation requests
-- ============================================================
-- 로그인 화면에서 미가입 사용자가 "관리자에게 계정 생성 요청" 을 보낼 수
-- 있도록 별도 큐 테이블을 둔다. users 테이블에 직접 pending 행을 넣지
-- 않는 이유:
--   1) users 의 role NOT NULL CHECK 와 충돌 (요청 시점엔 role 미정).
--   2) 거절(rejected) 흔적도 감사 목적으로 보관해야 함.
--   3) email UNIQUE 제약과 충돌 — 같은 사람이 거절 후 재요청 가능해야 함.
--
-- Apply: wrangler d1 execute <DB_NAME> --file=db/migrations/002-account-requests.sql --remote
-- ============================================================

CREATE TABLE IF NOT EXISTS account_requests (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  email               TEXT    NOT NULL,
  name                TEXT,
  password_hash       TEXT    NOT NULL,
  status              TEXT    NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'approved', 'rejected')),
  reject_reason       TEXT,
  created_at          INTEGER NOT NULL DEFAULT (unixepoch()),
  decided_at          INTEGER,
  decided_by_user_id  INTEGER,
  approved_user_id    INTEGER,    -- 승인되어 생성된 users.id (FK)
  FOREIGN KEY (decided_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (approved_user_id)   REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_account_requests_status ON account_requests(status);
CREATE INDEX IF NOT EXISTS idx_account_requests_email  ON account_requests(email);
