# SCM HUB PD — AI 어시스턴트 가이드

무신사 SCM Hub 의 디자인 시스템 + 데모 페이지 + VOC 협업 도구 + Cloudflare 백엔드를 담은 통합 워크스페이스.  
정적 HTML / 바닐라 JS 기반 (no SSR, no build step). 새 페이지 작업 전 이 문서 전체를 읽을 것.

> **🔥 데이터 리스트 페이지 (mp-table 사용 페이지) 를 만들거나 수정할 때**:
> 본 문서의 셸 아키텍처 + **[`design system/docs/data-list-page-gotchas.md`](./design%20system/docs/data-list-page-gotchas.md)**
> 의 공통 패턴/gotcha 를 **모두 적용** 한다.
>
> 2026-05 stock-movement / product-arrival-status 작업에서 확립된 룰 — mp-table column
> class 트랩, 2-row thead 패턴, frozen 컬럼 회피, iss-merged-cell rowspan 대체, drawer 안
> 테이블 sticky thead, cancel/notify 모달, 체크박스 3-state, 한글 wrap, 필터 drawer markup
> 등 모든 데이터 리스트 화면에 공통 적용되는 표준.

---

## 목차

1. [저장소 구조](#1-저장소-구조)
2. [로컬 개발 환경](#2-로컬-개발-환경)
3. [데모 페이지 셸 아키텍처](#3-데모-페이지-셸-아키텍처)
4. [루트 공통 스크립트](#4-루트-공통-스크립트)
5. [디자인 시스템 컴포넌트](#5-디자인-시스템-컴포넌트)
6. [Demo 페이지 목록](#6-demo-페이지-목록)
7. [VOC 협업 시스템](#7-voc-협업-시스템)
8. [Cloudflare 백엔드 (Functions + D1)](#8-cloudflare-백엔드-functions--d1)
9. [스크립트 / CI](#9-스크립트--ci)
10. [디자인 시스템 컨벤션](#10-디자인-시스템-컨벤션)
11. [새 페이지 추가 체크리스트](#11-새-페이지-추가-체크리스트)
12. [흔한 사고 패턴 — 방지](#12-흔한-사고-패턴--방지)

---

## 1. 저장소 구조

```
SCM-HUB-PD/
├── index.html                  # 진입점 (시뮬레이션 / 데모 / 핸드오프 / 스펙 4-카드)
├── login.html                  # 로그인 페이지
├── auth-gate.js                # 동기 인증 게이트 (모든 페이지 필수)
├── scm-shell.js                # 공통 스크립트 일괄 로더
├── scm-icons.js                # SVG 심볼 스프라이트 주입 (42개 아이콘)
├── dev-export.js               # 핸드오프 다운로드 / 버전 확정 버튼 (topbar inject)
├── notify-box.js               # 알림함 모달 시스템
├── profile-menu.js             # 프로필 드롭다운 (아바타 클릭)
├── tutorial.js                 # 첫 로그인 온보딩 코치마크 (5-step)
├── voc-config-sync.js          # VOC 메뉴 상태 D1 ↔ localStorage 동기화
├── _redirects                  # Cloudflare Pages URL 리다이렉트 규칙
├── package.json                # 루트. devDeps: wrangler
│
├── design system/              # scm-* 컴포넌트 모듈 (CSS/JS) + 토큰 + 시뮬레이터
│   ├── layer-desktop.css       # 디자인 토큰 CSS 변수 (§1-9) + 유틸리티 + 컴포넌트 레시피
│   ├── components/             # scm-* 컴포넌트 (67개 디렉토리 + 29개 React JSX)
│   ├── docs/                   # 상세 문서 (data-list-page-gotchas.md 등)
│   ├── icons/                  # SVG 아이콘 원본 (159개)
│   ├── catalog/                # 컴포넌트 카탈로그
│   ├── simulator/              # AI 와이어프레임 시뮬레이터
│   ├── prd-validate/           # PRD 검증 4-step wizard
│   └── cloudflare-worker/      # AI API 프록시 Worker (선택)
│
├── demo/                       # SCM Hub 실제 페이지 데모 (14개 HTML)
│   └── _blank.html             # 새 페이지 템플릿
│
├── voc/                        # VOC 협업 인터페이스 (메뉴 편집 / 코멘트 / 버전)
├── functions/                  # Cloudflare Pages Functions
│   ├── demo/[[path]].js        # /demo/* 라우트 핸들러
│   ├── demo/_known-assets.js   # 자동 생성 demo/ 파일 목록 화이트리스트
│   └── api/[[catchall]].js     # /api/* 백엔드 라우트
│
├── db/
│   ├── schema.sql              # D1 SQLite 스키마 (users/sessions/audit_log/menu_config)
│   └── migrations/             # 스키마 마이그레이션
│
├── scripts/                    # 유지보수 스크립트
│   ├── sync-demo-assets.js     # _known-assets.js 자동 갱신
│   ├── check-demo-fn.js        # demo function 분기 단위 테스트 (CI)
│   ├── check-voc-syntax.js     # VOC HTML syntax 검증 (CI)
│   └── smoke-test-demo-fn.js   # demo function 연기 테스트
│
├── admin/accounts.html         # 유저 관리 (super/admin 전용)
├── handoff/                    # 디자이너 ↔ 개발자 핸드오프 산출물
├── prod-ready/                 # 프로덕션 기준 스냅샷 (토큰 / 스타일)
├── pbo-design-system/          # 별도 npm 패키지 모노레포 (자체 CLAUDE.md 참고)
└── legacy/                     # 구 .legacy.html / 미사용 파일 보관
```

---

## 2. 로컬 개발 환경

```bash
# 정적 서버 (빌드 불필요)
python3 -m http.server 8080
# 또는 design system/시뮬레이터-실행.command 더블클릭

# 진입점
http://localhost:8080/
http://localhost:8080/demo/dashboard.html
http://localhost:8080/design system/
```

**로컬 인증:** `auth-gate.js` 가 `localhost` / `127.0.0.1` / `file://` 감지 시 자동으로  
`window.SCM_USER = { id: 'local', email: 'local@dev', name: '로컬', role: 'super' }` 주입.  
별도 로그인 없이 모든 데모 페이지 검수 가능.

**Cloudflare 배포:** Wrangler (`devDependencies: wrangler ^4.87.0`). AI 키(`sk-ant-...`)는
절대 commit 금지 — 클라이언트 BYOK 또는 Cloudflare Worker secret 으로만 관리.

---

## 3. 데모 페이지 셸 아키텍처

모든 `/demo/*.html` 페이지는 아래 구조를 따른다 (정적 HTML, no SSR).

```html
<head>
  <script src="/auth-gate.js"></script>          <!-- 동기 (인증 게이트 + LNB FOUC 복원) -->
  <script src="/scm-shell.js" defer></script>   <!-- 공통 스크립트 일괄 로드 -->
  <link rel="stylesheet" href="../design system/components/lnb/lnb.css" />     <!-- 필수 -->
  <link rel="stylesheet" href="../design system/components/topbar/topbar.css" />
  <link rel="stylesheet" href="../design system/components/.../*.css" />  <!-- 필요한 것만 -->
  <style>/* 페이지 전용 인라인 스타일 */</style>
</head>
<body>
  <script src="/scm-icons.js"></script>          <!-- body 첫 줄, 동기 (SVG 스프라이트) -->

  <header class="scm-topbar" role="banner"></header>           <!-- 빈 placeholder -->
  <div class="app">
    <nav class="scm-lnb" data-active="페이지키" aria-label="주메뉴"></nav>  <!-- 빈 placeholder -->
    <main>
      <!-- 페이지 콘텐츠 -->
    </main>
  </div>

  <!-- 컴포넌트 JS — body 하단에 로드 -->
  <script src="../design system/components/scm-table/scm-table.js"></script>
  <script src="../design system/components/.../*.js"></script>

  <script>
  (function () {
    'use strict';
    // lnb.js / topbar.js 가 DOMContentLoaded 시 자동 mount — 별도 mount 호출 불필요.
    // data-active 속성에서 active 키를 읽어 메뉴 활성화.

    if (window.SCMTable) SCMTable.init({ root: document });
    // ... 페이지 로직
  })();
  </script>
</body>
```

### 중요 규칙

- `lnb.js` / `topbar.js` 는 `DOMContentLoaded` 시 **자동 mount** → 별도 `SCM.lnb.mount()` 호출 불필요.
- LNB 활성 메뉴: `<nav class="scm-lnb" data-active="페이지키">` 에 key 명시.
- `lnb.css` 는 shell 레이아웃 룰 + sticky 토큰(`--scm-lnb-width`, `--scm-sticky-gnb`) 포함 → **필수** 로드.

---

## 4. 루트 공통 스크립트

### `auth-gate.js` (동기 로드)
- `/api/auth/me` 호출 → 미인증 시 `/login.html` 리다이렉트.
- `window.SCM_USER` 에 `{ id, email, name, role }` 저장.
- `scm:auth-ready` 이벤트 발생 (페이지 로직 의존점).
- LNB FOUC 방지: `localStorage['scm-lnb-open'] === '1'` 이면 `<html>` 에 `.is-lnb-open` 부여.
- 역할 기반 접근 제어: `ROLE_RULES` 배열로 경로별 허용 역할 명시. 위반 시 `/demo/dashboard` 리다이렉트.

### `scm-shell.js` (defer)
모든 데모 페이지 공통 스크립트를 한 줄로 일괄 로드. 내부 `SCRIPTS` 배열:
- `voc-config-sync.js` — VOC 메뉴 D1 ↔ localStorage 동기화
- `voc/added-dom-builders.js` — VOC 추가 DOM 빌더
- `voc/comment-overlay.js` — 코멘트 오버레이
- `dev-export.js` — 핸드오프 다운로드 / 버전 확정 버튼
- `profile-menu.js` — 프로필 드롭다운
- `notify-box.js` — 알림함 모달

새 공통 스크립트 추가 시 → `scm-shell.js` 의 `SCRIPTS` 배열에 한 줄 추가만 하면 모든 페이지에 반영.

### `scm-icons.js` (body 첫 줄, 동기)
42개 `ic-*` SVG 심볼을 `<svg><defs>...</defs></svg>` 스프라이트로 body 에 inject.  
`<use href="#ic-close">` 같은 참조가 파싱 전에 스프라이트를 찾을 수 있도록 동기 로드 필수.  
`window.SCM.icons.list()` 로 아이콘 목록 조회 가능 (VOC 아이콘 피커 사용).

### `dev-export.js`
topbar 에 2개 버튼 inject:
1. **핸드오프 다운로드** — 버전 확정된 경우에만 활성.
2. **최종 확정 토글** — super role 전용.

### `notify-box.js`
알림함 모달 (640px, 3컬럼: 처리일시 | 내용 | 처리자). 알림 상태 머신:
- `progress > 0` → 파란 "진행중 X/Y"
- `complete > 0, progress = 0` → 초록 "완료 N"

### `profile-menu.js`
topbar 아바타 클릭 → 드롭다운 (로그아웃 / 프로필 편집 / 설정).

### `tutorial.js`
첫 로그인 5-step 온보딩 코치마크. `localStorage['scm:tutorial:seen:<userId>:v1']` 로 1회 표시.

### `voc-config-sync.js`
VOC 메뉴 상태 (순서/숨김/삭제/버전) 를 D1 (`/api/voc/menu-config`) ↔ localStorage 동기화.  
super role 만 `/api/voc/menu-config` POST 가능.

---

## 5. 디자인 시스템 컴포넌트

모든 컴포넌트는 `design system/components/` 하위에 자가포함 (CSS + 선택적 JS). React JSX 버전도 일부 존재.

### 컴포넌트 사용 패턴

```html
<!-- CSS link (head) -->
<link rel="stylesheet" href="../design system/components/{component}/{component}.css" />

<!-- JS (body 하단, 필요 시) -->
<script src="../design system/components/{component}/{component}.js"></script>
```

### 주요 컴포넌트 카테고리

| 카테고리 | 컴포넌트 디렉토리 | 설명 |
|---|---|---|
| **셸** | `lnb/`, `topbar/` | LNB (좌측 네비) + GNB (상단 바). `CANONICAL_LNB_HTML` / `CANONICAL_TOPBAR_HTML` 단일 상수로 관리 |
| **데이터 테이블** | `scm-table/` | frozen 컬럼, sticky thead, 셀 선택, 정렬, 필터. `SCMTable.init()` / `SCMTable.rebuild()` |
| **테이블 서브** | `scm-table/table-sort.js`, `column-more-menu.js`, `column-filter-popover.js`, `table-selection.js` | 정렬 / 컬럼 더보기 메뉴 / 컬럼별 필터 팝오버 / 체크박스 선택 |
| **필터** | `filter-bar/`, `filter-drawer/`, `filter-popover/`, `filter-select/`, `filter-chip/`, `filter-reset-btn/` | 칩 기반 필터바 + 전체 필터 drawer + 컬럼별 팝오버 |
| **모달/Drawer** | `side-drawer/`, `confirm-modal/`, `bulk-upload-modal/`, `backdrop/` | 우측 슬라이드 drawer + 확인 다이얼로그 |
| **폼 요소** | `input/`, `input-cell/`, `select/`, `checkbox/`, `radio/`, `date-picker/`, `toggle/` | 인풋 컨트롤. `aria-invalid`, `aria-checked` attribute-selector 기반 |
| **스탯/카드** | `stats-bar/`, `stat/`, `card/`, `kpi-card/`, `pending-stats/`, `forecast-chip/` | 대시보드 지표. `scm-stats-bar--sticky` 로 sticky 사용 |
| **상태 칩** | `status-chip/`, `kind-chip/`, `state-text/` | 상태 뱃지 (done/processing/waiting/cancel/moving 5종) |
| **레이아웃** | `page-head/`, `page-section/`, `detail-stack/`, `sticky-bottom-bar/` | 페이지 구조. sticky 하단 액션바 |
| **페이지네이션** | `pager/`, `pgsize-select/` | 페이지 네비게이션 + 페이지당 항목 수 선택 |
| **기타** | `empty-state/`, `info-table/`, `tabs/`, `button/`, `tooltip/`, `tag/`, `toast/`, `bar-chart/`, `code-link/`, `mini-action/`, `barcode-card/`, `collapsible-card/` | 부가 UI |

### `scm-table` 핵심 API

```js
// 페이지 로드 시
SCMTable.init({ root: document });             // frozen 컬럼 + sticky thead 초기화
SCM.tableSort.mount({ tableSelector: '.mp-table-scroll .mp-table' });
SCM.columnMoreMenu.mount({ tableSelector: '...' });
SCM.columnFilterPopover.mount({ tableSelector: '...' });
SCM.filterPopoverModes.init({ filterBarEl, extraRegistry, onSearch, onReset });

// 동적 행 추가 후 재초기화 (rebuild() 버그 있음 — 아래 참고)
// → data-list-page-gotchas.md §8 의 manualRebuild() 패턴 사용
```

> ⚠️ `SCMTable.rebuild()` 는 `stickyInner.innerHTML = ''` 로 thead 파괴 버그 있음.  
> 동적 구조 변경 후 재초기화 시 `data-list-page-gotchas.md §8` 의 수동 reinit 패턴 사용.

### 테이블 마크업 구조

```html
<div class="mp-table-host">
  <div class="mp-thead-sticky">
    <div class="mp-thead-scroll"></div>  <!-- SCMTable.init 이 thead 여기로 이동 -->
  </div>
  <div class="mp-table-scroll">
    <table class="mp-table" id="my-table" data-scm-frozen="3">
      <!-- data-scm-frozen: frozen 컬럼 수 -->
      <thead>...</thead>
      <tbody>...</tbody>
    </table>
  </div>
</div>
```

### 디자인 토큰 (`layer-desktop.css`)

총 2002줄. 섹션 구조:

| 섹션 | 라인 | 내용 |
|---|---|---|
| §1–2 | 24–173 | Primitive (gray/blue/red/yellow/green/cyan/purple) + Semantic (fg/bg/border/focus) |
| §3–8 | 174–291 | Typography / Spacing / Radius / Icon / Shadow / Z-index |
| §9 | 292–586 | Component 토큰 (`--ld-btn-*`, `--ld-tf-*`, ...) |
| §10 | 590–627 | Utility 클래스 (`.ld-text-*`, `.ld-root`) |
| §11 | 630–2002 | Component recipe (`.ld-btn`, `.ld-tf`, `.ld-modal`, ...) |

CSS 변수 prefix: `--ld-*` (Layer Desktop). 클래스 prefix: `.ld-*`.  
SCM 전용 추가 토큰은 `--scm-*` prefix 사용 (예: `--scm-lnb-width`, `--scm-sticky-gnb`).

---

## 6. Demo 페이지 목록

| 파일 | 페이지명 | 비고 |
|---|---|---|
| `dashboard.html` | 대시보드 | KPI 카드, 차트 |
| `sku-management.html` | SKU 관리 | 2-row thead, frozen 컬럼, 필터, drawer. ~1900줄 |
| `stock-movement.html` | 재고이동 | split header, iss-merged-cell, cancel/notify 모달, 카드 가로 스크롤 |
| `product-arrival-status.html` | 위탁 상품 입고 현황 | rowspan 대체(iss-merged-cell), side drawer |
| `editshop-restock-request.html` | 편집샵 재고 보충 요청 | 데이터 리스트 + 폼 |
| `editshop-restock-status.html` | 편집샵 재고 보충 현황 | 상태 표시 중심 |
| `otb-budget.html` | 예산(OTB) 관리 | 예산 컨트롤 |
| `otb-adjustment-request.html` | 예산 조정 요청 | 폼 중심 |
| `otb-adjustment-list.html` | 조정요청목록 | 단순 리스트 |
| `sku-detail.html` | SKU 상세 | 정보 + 테이블 |
| `sku-register.html` | SKU 등록 | 폼 중심 |
| `index.html` | 무탠 전개상품 관리 (Pilot) | 파일럿 데이터 리스트 |
| `wireframe.html` | 적용된 와이어프레임 | 와이어프레임 데모 |
| `_blank.html` | (신규 페이지 템플릿) | 새 페이지 시작점 |

**참조 페이지:** 복잡한 패턴은 아래에서 찾아볼 것.

| 패턴 | 참조 페이지 |
|---|---|
| 2-row thead split header + colspan 토글 | `stock-movement.html` (`#stm-moveno-head`) |
| `iss-merged-cell` 빈셀 rowspan 대체 | `product-arrival-status.html` (`rowToDetailHtml`) |
| Cancel modal + Notify modal + 상태 머신 | `stock-movement.html`, `product-arrival-status.html` |
| Side drawer + `data-scm-skip-init` 테이블 | 두 페이지 모두 (`#pd-drawer`, `#stm-drawer`) |
| 가로 스크롤 + 더 보기 버튼 (cards) | `stock-movement.html` (`#stm-drawer-cards-more`) |
| 수동 reinit (rebuild bug 우회) | `stock-movement.html` 펼치기 토글 handler |
| 한글 어절 wrap | `stock-movement.html` (`.stm-reason-title`, `.stm-sku-name`) |

---

## 7. VOC 협업 시스템

`voc/index.html` — 디자이너/PD/개발자 협업 인터페이스 (~500KB).

### 기능
- **메뉴 편집모드** — super/admin 이 LNB 메뉴 순서/숨김/삭제 조작 + 버전 관리
- **코멘트 오버레이** — 페이지 위에 말풍선 코멘트 추가
- **버전 관리** — 핸드오프 버전 생성 / 확정 / 비교
- **컬럼 편집** — 각 데이터 테이블 컬럼의 sort/filter 노출 여부 편집

### LNB 메뉴 데이터 source of truth
`design system/components/lnb/lnb.js` 의 `CANONICAL_LNB_HTML`.  
VOC 의 `MENU` 배열도 별도로 `voc/index.html` 안에 선언 — **두 곳을 모두 수정** 해야 메뉴가 맞음.

### VOC 편집모드 CSS 스코프 규칙
`dev-export.applyActiveVersionMinimal` 의 hide 룰은 반드시 `main` scope 안으로 한정.  
`lnb` / `topbar` 까지 hide 되는 회귀 방지.

---

## 8. Cloudflare 백엔드 (Functions + D1)

### Functions

| 파일 | 라우트 | 역할 |
|---|---|---|
| `functions/demo/[[path]].js` | `/demo/*` | demo HTML 서빙, 캐노니컬 URL 처리 |
| `functions/api/[[catchall]].js` | `/api/*` | 인증 / VOC / 알림 API |

### D1 데이터베이스 스키마 (`db/schema.sql`)

| 테이블 | 목적 |
|---|---|
| `users` | 계정 정보. role: `super|admin|biz|pm|dev|pd`. 초대 토큰 기반 가입 |
| `sessions` | 로그인 세션 (64자 hex ID, `expires_at` unix epoch) |
| `audit_log` | 액션 로그 (login/logout/role_change/user_delete 등) |
| `menu_config` | VOC 메뉴 상태 (순서/숨김/삭제/버전). D1 source of truth |

### `functions/demo/_known-assets.js`

`demo/` 파일 목록 화이트리스트 (자동 생성).  
**새 데모 파일 추가/삭제 시 반드시 실행:**

```bash
node scripts/sync-demo-assets.js
```

실행 안 하면 CI(`check-demo-fn.yml`) 에서 빌드 실패.

---

## 9. 스크립트 / CI

### 유지보수 스크립트

| 스크립트 | 역할 |
|---|---|
| `node scripts/sync-demo-assets.js` | `_known-assets.js` 를 `demo/` 실제 파일 목록으로 갱신 |
| `node scripts/sync-demo-assets.js --check` | 갱신 없이 일치 여부만 검증 (CI 용) |
| `node scripts/check-demo-fn.js` | demo function 분기 단위 테스트 |
| `node scripts/check-voc-syntax.js` | VOC HTML + main IIFE syntax 검증 |
| `node scripts/smoke-test-demo-fn.js` | demo function 연기 테스트 |

### GitHub Actions Workflows

**`check-demo-fn.yml`** — `functions/demo/**` 또는 `demo/**` 변경 시 실행:
1. `_known-assets.js` ↔ `demo/` 파일 목록 일치 검증
2. demo function 분기 단위 테스트 (PR #144 회귀 패턴 재현 포함)

**`voc-syntax-check.yml`** — `voc/index.html`, `dev-export.js`, `lnb.js` 등 변경 시 실행:
1. `</script>` 리터럴 포함 여부 검사
2. main IIFE syntax 검증

---

## 10. 디자인 시스템 컨벤션

> 전체 내용: [`design system/CONVENTIONS.md`](./design%20system/CONVENTIONS.md)

### 토큰 3계층 (절대 섞지 말 것)

```
Primitive  → 절대값 raw scale (예: gray-300, 12px). 컴포넌트에서 직접 참조 금지.
Semantic   → 의미 기반, 페이지 단위 (예: fg-default, bg-accent, border-critical)
Component  → 특정 컴포넌트 특정 상태 전용 (예: btn-primary-bg-hover). 타 컴포넌트 사용 금지.
```

### 네이밍

- CSS 변수: `--ld-{component}-{variant}-{property}-{state}` (kebab-case)
- CSS 클래스: `.ld-{component}` / `.ld-{component}-{variant}` (prefix `ld-`)
- React props size: **`xs | sm | md | lg | xl`** 표준 (`s/m/l` 단일자 금지)
- SCM 전용 토큰: `--scm-*` prefix

### 토큰 변경 시 4곳 동시 수정 (현재 수동)

1. `design system/layer-desktop-tokens.json` (DTCG source of truth)
2. `design system/layer-desktop-tokens.js` (JS export)
3. `design system/layer-desktop.css` (CSS 변수)
4. `design system/tailwind-preset.js` (Tailwind theme, 필요한 경우)

### 컴포넌트 변경 워크플로 (신규/variant 추가)

1. Figma 검증 → JSDoc 에 노드 ID 기록
2. `layer-desktop.css §11` 에 `.ld-{component}-*` CSS recipe 추가
3. `layer-desktop.css §9` 에 `--ld-{component}-*` 토큰 추가
4. JSON + JS 토큰에도 동기화
5. `components/{Name}.jsx` React 컴포넌트 작성
6. `components/index.js` barrel export 추가
7. `design system/index.html` 데모 section 추가
8. `docs/components.md` props 표 업데이트

### 접근성 필수 사항

- 모든 인터랙티브 요소: `aria-label` 또는 visible label
- invalid 상태: `aria-invalid="true"` (스타일은 attribute selector 로)
- modal/drawer: `role="dialog"`, `aria-modal="true"`, focus trap, ESC 닫기
- focus outline: `var(--ld-focus-outline)` 사용. `outline: none` 단독 금지

---

## 11. 새 페이지 추가 체크리스트

> 데이터 리스트 페이지(mp-table 사용)는 아래에 추가로  
> [`design system/docs/data-list-page-gotchas.md`](./design%20system/docs/data-list-page-gotchas.md) §12 체크리스트도 모두 적용.

### 모든 데모 페이지 공통

- [ ] `<script src="/auth-gate.js"></script>` — `<head>` 에 동기 로드 (FOUC 복원도 여기서 처리)
- [ ] `<script src="/scm-shell.js" defer></script>` — 공통 스크립트 일괄 로드
- [ ] `<link rel="stylesheet" href="../design system/components/lnb/lnb.css" />` — **필수** (shell 레이아웃 + sticky 토큰)
- [ ] 사용하는 컴포넌트 CSS 만 개별 link (불필요한 CSS 포함 금지)
- [ ] `<script src="/scm-icons.js"></script>` — body 시작 직후, 동기 (SVG 스프라이트)
- [ ] `<header class="scm-topbar" role="banner"></header>` — body 상단 placeholder
- [ ] `<nav class="scm-lnb" data-active="페이지키" aria-label="주메뉴"></nav>` — main 앞 placeholder
- [ ] `<div class="app">` 으로 `.scm-lnb` + `<main>` 감싸기
- [ ] LNB 메뉴 등록 — `lnb.js` 의 `CANONICAL_LNB_HTML` 안 적절한 L1 그룹 L2 list 에 추가:
  ```html
  <a class="scm-lnb-l2" href="새페이지.html" data-key="페이지키">메뉴명</a>
  ```
- [ ] VOC 협업 노출 필요 시 `voc/index.html` 의 `MENU` 배열에도 추가
- [ ] `node scripts/sync-demo-assets.js` 실행 → `functions/demo/_known-assets.js` 갱신

### 데이터 리스트 페이지 추가 (mp-table)

- [ ] `data-list-page-gotchas.md §12` 의 12.1–12.7 체크리스트 전체 적용
- [ ] column class 트랩 확인 (§1): `col-medium` 260px 캡, `col-large` 320px lock, `col-auto` nowrap
- [ ] 한글 wrap 처리 (§2): `word-break: keep-all; overflow-wrap: break-word`
- [ ] 2-row thead 사용 시 3가지 트랩 확인 (§3): doubled 라인 / sticky-left 회귀 / thead 이동 후 selector 깨짐
- [ ] rowspan 필요 시 → `iss-merged-cell` 패턴으로 대체 (§4)
- [ ] 체크박스 3-state MutationObserver 구현 (§7)
- [ ] drawer 안 테이블: `data-scm-skip-init="true"` + 수동 sticky thead (§8)
- [ ] 컬럼 더보기 아이콘: 모든 leaf `<th>` 에 `.sort-ic` + `.th-icons > .filter-ic + .more-ic` (§11)
- [ ] thead 마지막 데이터 컬럼 우측 `border-right: 1px solid #EBEBEB` (§12.7)

---

## 12. 흔한 사고 패턴 — 방지

### 셸 아키텍처 관련

1. **공통 스크립트 누락** (예: `profile-menu.js` 빠뜨림 → 프로필 모달 미동작)
   - 해결: `scm-shell.js` 한 줄로 일괄 로드. 개별 스크립트 태그 쓰지 말 것.

2. **LNB / topbar 마크업 페이지 간 어긋남** (예: 한 페이지만 OTB 메뉴가 다른 그룹)
   - 해결: `lnb.js` / `topbar.js` 의 단일 상수 수정 → 모든 페이지에 자동 반영.

3. **SCM.lnb.mount() / SCM.topbar.mount() 수동 호출**
   - 해결: `lnb.js` / `topbar.js` 가 DOMContentLoaded 시 자동 mount. 명시 호출 불필요.

4. **`_known-assets.js` 갱신 누락** → CI 빌드 실패
   - 해결: 새 demo HTML 추가/삭제 시 항상 `node scripts/sync-demo-assets.js` 실행.

### scm-table 관련

5. **`SCMTable.rebuild()` 호출** → thead 파괴 버그
   - 해결: `data-list-page-gotchas.md §8` 의 `manualRebuild()` 패턴 사용.

6. **페이지 스코프 CSS selector 에 `#table-id thead th` 패턴 사용**
   - 해결: `setupStickyThead` 가 thead 를 clone 컨테이너로 이동 → table id ancestor 매치 안 됨.
   - **셀 클래스 / ID 로 직접 타겟해야 안전.** (`data-list-page-gotchas.md §3 트랩3`)

7. **drawer 안 테이블에 SCMTable.init 적용** → race condition / rebuild 버그
   - 해결: drawer 테이블에 `data-scm-skip-init="true"` + 수동 sticky thead CSS.

8. **VOC 편집모드 hide CSS 가 LNB / topbar 까지 가림**
   - 해결: `dev-export.applyActiveVersionMinimal` hide 룰을 `main` scope 안으로 한정.

### 토큰 / CSS 관련

9. **`col-medium` 에 260px 초과 폭 기대**
   - 해결: `col-auto` + 페이지 스코프에서 명시 `width/min-width/max-width`.

10. **한글 텍스트 셀이 wrap 안 됨**
    - 해결: `col-auto` 기본이 `white-space: nowrap` → 페이지 스코프에서 `white-space: normal` + `word-break: keep-all` 명시.

11. **inline-flex 컨테이너 안 텍스트 wrap 안 됨**
    - 해결: `display: inline-flex` → `display: flex` (block) 로 변경.

---

## 관련 문서

| 문서 | 위치 | 내용 |
|---|---|---|
| Data-list Gotchas | [`design system/docs/data-list-page-gotchas.md`](./design%20system/docs/data-list-page-gotchas.md) | mp-table 패턴/함정 13종 |
| Data-list 기본 스펙 | [`design system/docs/data-list-page.md`](./design%20system/docs/data-list-page.md) | sticky stack / dual-table / frozen / cell-selection |
| 컴포넌트 API | [`design system/docs/components.md`](./design%20system/docs/components.md) | React 컴포넌트 props 레퍼런스 |
| 디자인 토큰 | [`design system/docs/tokens.md`](./design%20system/docs/tokens.md) | 토큰 레퍼런스 |
| 컨벤션 | [`design system/CONVENTIONS.md`](./design%20system/CONVENTIONS.md) | 네이밍 / 워크플로 / 접근성 |
| 폴더 구조 | [`design system/STRUCTURE.md`](./design%20system/STRUCTURE.md) | 파일 구조 설명 |
| PBO 디자인 시스템 | [`pbo-design-system/CLAUDE.md`](./pbo-design-system/CLAUDE.md) | npm 패키지 모노레포 (별도 운영) |
