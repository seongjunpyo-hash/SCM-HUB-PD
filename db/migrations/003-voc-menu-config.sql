-- ============================================================
-- VOC menu / page config 영구 저장 (D1)
-- ============================================================
-- 이전엔 모든 voc 설정 (신규 메뉴 / 메뉴 순서 / 미노출 / 영구 삭제 / 페이지
-- 버전 / 편집 데이터) 이 브라우저 localStorage 에만 저장돼서:
--   - Clear site data 한 번에 전부 사라짐
--   - 시크릿 창 닫으면 사라짐
--   - 다른 브라우저 / 기기 / 사용자 사이 공유 안 됨
-- 핵심 super 작업물 (메뉴 구조 / 페이지 편집) 이 휘발성 저장 → 사고.
--
-- 본 테이블 + /api/voc/menu-config 엔드포인트로 서버 영구 저장 + 다중
-- 클라이언트 동기. localStorage 는 캐시 / 오프라인 fallback 으로만.
--
-- 적용:
--   wrangler d1 execute scm-hub-pd-db --remote \
--     --file=db/migrations/003-voc-menu-config.sql

CREATE TABLE IF NOT EXISTS menu_config (
  config_key      TEXT    PRIMARY KEY,           -- 예: 'newpages', 'menu-order', 'menu-hidden',
                                                 --     'menu-deleted', 'versions', 'edit'
  config_value    TEXT    NOT NULL,              -- JSON 문자열 (그대로 직렬화)
  updated_at      INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_by      TEXT                           -- super 사용자 email (감사용)
);

CREATE INDEX IF NOT EXISTS idx_menu_config_updated_at ON menu_config(updated_at);
