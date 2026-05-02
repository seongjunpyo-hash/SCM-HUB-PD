# Changelog

> MUSINSA LayerDesktop / SCM Hub Design System.
> 패치 히스토리는 최신 버전이 위로.

## v2.35.0 — 2026-05-01

Phase B Stage 8: stats / page-head 3개 추출 — 데이터 리스트 페이지 골격 완성.

### Added — Stage 8 Modules

- **`components/stat/`** — `scm-stat` (+ `__label`, `__num`) + state variants `--all/--deployed/--undeployed/--selected`. `scm-stat-divider` (3×3 점) 보조. 단일 카운트 라벨.
- **`components/stats-bar/`** — `scm-stats-bar` (+ `--sticky`) + `__left` / `__counts-wrap` / `__counts` / `__mini-actions` / `__right` / `__ts` / `__v-divider`. 좌측 카운트+미니액션, 우측 timestamp+download+pager+pgsize 슬롯. `--scm-sticky-stats` CSS 변수로 sticky top.
- **`components/page-head/`** — `scm-page-head` 4 variants: `--list` (title+actions 우), `--detail` / `--form` (back+title 좌), `--dashboard` (title+sub 좌, actions 우, align bottom). `--sticky` modifier 지원. `__title` / `__sub` / `__titles` / `__actions` 슬롯.

### Added — 카탈로그

- 28번 섹션 (`#scm-stage8`) — 3 컴포넌트 demo + spec
- nav "SCM Stage 8" 그룹 + 3 anchors
- 3 CSS link + 3 JS script

### Stats

- 3 모듈 × 5 파일 = 15개 파일 신규
- design-system/index.html: 3,381 → 3,500+ 줄

### 검증 (모두 PASS)

- 파일 15/15, JS/CSS/JSX 3/3 each, 카탈로그 경로 6/6, HTML 구조 정합

### Note

이로써 데이터 리스트 페이지의 **모든 골격 모듈** (filter-bar / stats-bar / page-head + table + cell 컴포넌트) 추출 완료. Stage 12 (페이지 슬림화 / 무탠 페이지 파일럿 리라이트) 진입 가능 상태.

---

## v2.34.0 — 2026-05-01

Phase B Stage 7: 필터 시스템 5개 추출 (가장 복잡한 단일 stage).

### Added — Stage 7 Modules

- **`components/filter-chip/`** — `scm-filter-chip` (h44 outlined) + `scm-filter-chip__count`. "전체 필터" 트리거.
- **`components/filter-select/`** — `scm-filter-select` (floating label 패턴) + `__label`, `__value`, `__chev`, `__req-dot`. data-state: placeholder / filled / active. aria-expanded → chev 회전. `scm-filter-group` 으로 인접 셀렉트 보더 통합.
- **`components/filter-popover/`** — `scm-filter-popover-root` + `scm-filter-popover` (`--codeinput` / `--list` / `--list-single` / `--multi`). 4가지 mode: codeinput (textarea + counter), list (search + 체크박스 다중), list-single (체크 SVG 단일), multi (혼합). `__body`, `__textarea`, `__counter`, `__search`, `__list-body`, `__item`, `__footer`, `__reset`, `__apply` sub. anchor 위치 자동 계산 + 외부 클릭 / ESC 닫기.
- **`components/filter-bar/`** — `scm-filter-bar` (sticky top, 풀폭 + margin -28). `scm-filter-overflow` (track + 좌우 fade gradient). `scm-filter-actions` (검색/초기화 슬롯). scroll/resize 시 fade opacity 자동 갱신.
- **`components/filter-drawer/`** — `scm-filter-drawer` "전체 필터" 좌측 슬라이드 드로어 (480w). top:64, left:`var(--scm-lnb-width)`. 3가지 section variant 지원: chip 단일/다중 / search+list 다중 / textarea 코드 입력. header / body (sections) / footer (reset + apply). `side-drawer` 와는 별도 모듈 (위치/방향 다름).

### Added — 카탈로그

- 27번 섹션 (`#scm-stage7`) — 5 컴포넌트 demo + spec
- nav "SCM Stage 7" 그룹 + 5 anchors
- 5 CSS link + 5 JS script + 데모 핸들러 (filter-drawer trigger)

### Stats

- 5 모듈 × 5 파일 = 25개 파일 신규
- 모듈 합계 2,043 줄 (가장 큰 stage)
- design-system/index.html: 3,156 → 3,381 줄 (+225)

### 검증 (모두 PASS)

- 파일 25/25, JS/CSS/JSX 5/5 each, 카탈로그 경로 10/10, HTML 구조 정합

### Migration notes

- `scm-filter-popover` 의 4 modes 는 시각·구조가 매우 달라서 단일 모듈에 통합. mode 별로 sub-render. 호출처에서 `mode` 만 지정하면 적절한 마크업 렌더.
- `scm-filter-bar` 와 `scm-filter-drawer` 둘 다 `--scm-lnb-width` 또는 `--scm-sticky-gnb` CSS 변수 의존. `layer-desktop.css` 또는 페이지에서 정의 필요 (현재는 fallback `56px` / `64px` 적용).
- `scm-filter-drawer` 와 `scm-side-drawer` 는 형제 모듈 — 위치(좌/우), 시작점(top 64 / top 0), z-index 정책이 달라 분리 유지.

---

## v2.33.0 — 2026-05-01

Phase B Stage 6: 모달 / 드로어 오버레이 3개 추출.

### Added — Stage 6 Modules

- **`components/confirm-modal/`** — `scm-confirm-modal` 확인 모달 (취소/실행). 360–420w centered, padding 24. 자체 backdrop. 글로벌 `SCM.confirmModal.open({title, descHtml, onConfirm, onCancel})`. `descHtml` 으로 `<strong class="accent">` 강조 지원. ESC / backdrop click → onCancel + close.
- **`components/side-drawer/`** — `scm-side-drawer` generic 우측 슬라이드 드로어. sizes `--sm` (480) / `--md` (640) / `--lg` (848). head / body / footer 슬롯. transform translateX 애니메이션 0.25s. backdrop 클릭 / 닫기 버튼 자동 close. `SCM.sideDrawer.mount(drawer, { backdrop, onClose })`.
- **`components/bulk-upload-modal/`** — `scm-bulk-upload-modal` 1024w 큰 모달. header/body/footer 구조. body 내부에 sub: `scm-bu-warning` (collapsible 주의사항, `--list li.is-critical` 지원), `scm-bu-type-section` (업로드 유형 + 템플릿), `scm-bu-history-table` (status-pill `data-state` 3가지 + result-group success/fail + result-dl 버튼). 외부 모듈 활용: `scm-radio scm-radio--sm` / `scm-select scm-select--bu` / `scm-button` / `scm-button--primary` (Stage 2 통합).

### Added — 카탈로그

- 26번 섹션 (`#scm-stage6`) — 3 컴포넌트 demo + spec
- nav "SCM Stage 6" 그룹 + 3 anchors
- 3 CSS link + 3 JS script + 데모 핸들러 (3개 모두 trigger 버튼 + 자동 mount)

### Stats

- 3 모듈 × 5 파일 = 15개 파일 신규
- 모듈 합계 1,444 줄
- design-system/index.html: 2,940 → 3,156 줄 (+216)

### 검증 (모두 PASS)

- 파일 15/15, JS/CSS/JSX 3/3 each, 카탈로그 경로 6/6, HTML 구조 정합

### Migration notes

- `bu-radio` / `bu-select` / `bu-btn-*` 클래스는 `scm-bulk-upload-modal` 안에 더 이상 정의되지 않음 — Stage 2 의 공통 모듈로 대체. 이전 페이지에서 마이그레이션 시 마크업도 `scm-radio scm-radio--sm` / `scm-select scm-select--bu` / `scm-button` 으로 교체 필요.
- `scm-confirm-modal` 과 `scm-bulk-upload-modal` 모두 `scm-backdrop` 모듈 안 쓰고 자체 backdrop 보유 — z-index 충돌 회피 (각각 80/81, 90/91 사용). modal 정책 통일 시 추후 검토.
- `scm-side-drawer` 는 generic — `mp-af-drawer` (좌측 슬라이드, top:64) 는 별도 모듈 (Stage 7 `scm-filter-drawer`) 로 추출 예정.

---

## v2.32.0 — 2026-05-01

Phase B Stage 5: 데이터 리스트 셀 인라인 5개 추출.

### Added — Stage 5 Modules

- **`components/code-link/`** — `scm-code-link` (15/400 underlined #000) + `scm-code-link__extra` ("외 N" 보조). `mp-link` + `mp-uid-trigger` + `mp-code-trigger` 통합. `data-code-type` attr 로 타입 식별.
- **`components/code-popover/`** — UID/SKU/바코드/스타일넘버 묶음 보기. 자체 backdrop 포함 (외부 의존 없음). 글로벌 `SCM.codePopover.open({title, items, anchorEl, copyLabel, onCopy})` / `.close()` API. ESC 키 + backdrop 클릭 + 닫기 버튼 모두 dismiss.
- **`components/deploy-pill/`** — `scm-deploy-pill` (+ pill / dot / chev) + state variants (`--deployed/--undeployed/--partial`). `scm-deploy-cell` 도우미 클래스 (테이블 td 에 부착) — cursor pointer + hover 배경 + `is-open` 시 chev 회전.
- **`components/deploy-popover/`** — `scm-deploy-popover` 단순 옵션 리스트. 글로벌 `SCM.deployPopover.open({anchorEl, options, current, onSelect})`. `data-current="true"` 시 회색 배경 + 우측 체크 SVG (CSS 만으로 표시).
- **`components/sizeset-btn/`** — h36 outlined "전개 N/M" 카운트 버튼. 강조 숫자 (em #245EFF 600) + 회색 divider/total. `mp-sizeset` 흡수.

### Added — 카탈로그

- 25번 섹션 (`#scm-stage5`) — 5 컴포넌트 demo + spec
- nav "SCM Stage 5" 그룹 + 5 anchors
- 5 CSS link + 5 JS script + 데모 핸들러 (code-popover trigger 자동 부착)

### Stats

- 5 모듈 × 5 파일 = 25개 파일 신규
- 모듈 합계 1,213 줄
- design-system/index.html: 2,805 → 2,940 줄 (+135)

### 검증 (모두 PASS)

- 파일 25/25, JS/CSS/JSX 5/5 each, 카탈로그 경로 10/10, HTML 구조 정합

### Migration notes

- `scm-code-popover` 와 `scm-deploy-popover` 는 둘 다 글로벌 싱글톤 + 자체 backdrop. 페이지에서 마크업 안 두고 `SCM.codePopover.open(...)` 호출만으로 표시 가능. 외부 의존 (별도 backdrop / overlay 모듈) 없음.
- `scm-deploy-pill` 의 `pointer-events: none` 트릭 유지 — pill 자체는 클릭 비활성, chev 만 인터랙션. 셀(td) 전체가 클릭 영역으로 동작.
- `scm-deploy-popover` 의 현재 상태 체크 SVG 는 inline data URL 로 CSS 안에 박힘 → 별도 sprite 의존 없음.

---

## v2.31.0 — 2026-05-01

Phase B Stage 4: 컨테이너 / 정보 표시 5개 추출.

### Added — Stage 4 Modules

- **`components/card/`** — `scm-card` (+ `--gray`) + head/title/body/section/divider/link 보조. `db-card` + `reg-card` + `reg-card-section` + `reg-card-divider` 통합. body `--flush`, title `--lg`, section `--padded`.
- **`components/info-table/`** — `scm-info-table` (+ `--no-bottom`) + `scm-info-row` (+ `--quad`) + `scm-info-cell-label` (+ `--top`) + `scm-info-cell-value` (+ `--padded` / `--flex-between`). label width 134, max-width 926.
- **`components/info-banner/`** — `scm-info-banner` (+ `--full`) + icon/body/title/text/toggle 부속. `is-collapsed` 시 본문 숨김 + chevron 회전.
- **`components/tabs/`** — `scm-tabs` (`--underline` / `--pill` variants) + `scm-tab` (`is-active`). 두 시각 통합. `data-key` 기반.
- **`components/collapsible-card/`** — `scm-collapsible-card` (+ head/head-left/toggle/body) + `is-collapsed` 상태. 마크업의 minus/plus svg 가 CSS 로 자동 전환.

### Added — 카탈로그

- 24번 섹션 (`#scm-stage4`) — 5 컴포넌트 demo + spec
- nav "SCM Stage 4" 그룹 + 5 anchors
- 5 CSS link + 5 JS script + 데모 핸들러 (info-banner, tabs ×2, collapsible-card 자동 mount)

### Stats

- 5 모듈 × 5 파일 = 25개 파일 신규
- 모듈 합계 1,304 줄
- design-system/index.html: 2,641 → 2,805 줄 (+164)

### 검증 (모두 PASS)

- 파일 25/25, JS/CSS/JSX 5/5 each, 카탈로그 경로 10/10, HTML 구조 정합

### Migration notes

- `scm-tabs` 가 underline / pill 두 패턴 통합. legacy `sd-section-tabs` 와 `db-period-tabs` 가 시각만 다른 동일 컴포넌트였음을 확인 → variant 로 통합.
- `scm-card` 는 두 가지 사용 패턴 (head/body 형 + title-lg/section/divider 형) 을 동일 모듈로 처리. 폼 카드는 head 없이 title-lg 바로 사용 가능.
- `scm-collapsible-card` 의 minus/plus 토글은 마크업에 둘 다 두고 CSS 가 `is-collapsed` 클래스로 표시 전환. JS 는 클래스 토글만.

---

## v2.30.0 — 2026-05-01

Phase B Stage 3: 작은 합성 컴포넌트 5개 추출.

### Added — Stage 3 Modules

- **`components/form-row/`** — `scm-form-row` + `scm-form-label` + `scm-form-row-req` + `scm-form-control`. label widths: `--w60/--w120/--w140`. control widths: `--w320/--w360/--full`. `form-row` + `form-label` + `form-control` + `req-dot` 통합.
- **`components/pager/`** — `scm-pager` + `scm-pager__current` + `scm-pager__total` + `scm-pager-btn`. 36×36 ghost 화살표, disabled 자동 처리. `mp-stats-right .pager` 흡수.
- **`components/pgsize-select/`** — `scm-pgsize-wrap` + `scm-pgsize` + `scm-pgsize-popup`. h36 114w + popup (right-aligned). 자체 popup 관리, document click 감지로 외부 클릭 닫기.
- **`components/mini-action/`** — `scm-mini-wrap` + `scm-mini-action` + `scm-mini-popup`. 단순 버튼 / 드롭다운형 양쪽 지원. variants: 기본 outlined / `--primary` (solid black). `mp-mini-wrap` + `mp-mini-action` + `mp-mini-popup` 흡수.
- **`components/page-section/`** — `scm-page-section` + `scm-page-section-head` + `scm-page-section-title` + `scm-page-section-link` + `scm-page-section-body`. dashboard 의 `db-section*` 흡수, `sd-section*` 흡수 후보.

### Added — 카탈로그

- 23번 섹션 (`#scm-stage3`) 추가 — 5 atom × demo + spec
- nav 그룹 + 5 anchors + 5 CSS link + 5 JS script + 데모 핸들러 (pgsize, mini-action mount)

### Stats

- 5 모듈 × 5 파일 = 25개 파일 신규
- 모듈 합계 1,273 줄
- design-system/index.html: 2,501 → 2,641 줄 (+140)

### 검증 (모두 PASS)

- 파일 존재 25/25, JS/CSS/JSX syntax 5/5 each, 카탈로그 경로 10/10, HTML 구조 정합

### Migration notes

- `pgsize-select` 와 `mini-action` 둘 다 popup 자체 관리 → 추후 Stage 7 의 generic popover 모듈이 나와도 이 두 모듈은 자가포함 유지 가능 (의존 최소화)
- `scm-mini-action` 은 단순 버튼 (`onClick`) 과 드롭다운 (`items` + `onSelect`) 양쪽 마크업/API 지원 — 1개 모듈로 두 케이스 흡수

---

## v2.29.0 — 2026-05-01

Phase B Stage 2: 폼 원자 / 작은 버튼 8개 추출.

### Added — Stage 2 Modules (의존: tokens 만)

- **`components/button/`** — `scm-button`. 모든 액션 버튼의 베이스. variants: 기본 outlined / `--primary` / `--ghost`. sizes: `--sm` (h36) / md (h44) / `--lg` (h52). `--block`. disabled. `mp-action-btn`, `mp-action-btn--primary`, `btn-primary-disabled`, `btn-outline-disabled`, `sd-btn-outline`, `reg-bottom-bar .btn` 흡수.
- **`components/input/`** — `scm-input`. h44/h36, focus border #000, disabled 회색. `scm-input-wrap--with-counter` + `scm-input-counter` 보조.
- **`components/select/`** — `scm-select`. 트리거 (popup 은 Stage 7 별도). `data-state="placeholder|filled"`, sizes (sm/bu), 도트 prefix 옵션. `form-select` + `bu-select` + `sd-select-mock` 통합.
- **`components/radio/`** — `scm-radio` + `scm-radio-dot`. `form-radio` + `bu-radio` 통합. group: `scm-radio-group` (기본 / `--sm` / `--2col`).
- **`components/back-btn/`** — `scm-back-btn`. 36×36 ghost. `sd-back-btn` + `mp-back-btn` 통합.
- **`components/search-btn/`** — `scm-search-btn`. h44 필터바 검색. disabled-default + 활성 시 검정 outlined.
- **`components/filter-reset-btn/`** — `scm-filter-reset-btn`. h44 ghost + 회전 화살표 svg.
- **`components/download-btn/`** — `scm-download-btn`. h36 outlined + download icon.

### Added — 카탈로그

- `design-system/index.html` 22번 섹션 (`#scm-stage2`) 추가
- 좌측 nav 에 "SCM Stage 2" 그룹 + 8 anchors
- 8 CSS link + 8 JS script 추가

### Stats

- 8 모듈 × 5 파일 = 40개 파일 신규
- 모듈 합계 1,668 줄
- design-system/index.html: 2,306 → 2,501 줄 (+195)

### 검증 (모두 PASS)

- 파일 존재 (40/40), JS/CSS/JSX syntax (8/8 each), 카탈로그 경로 (16/16), HTML 구조 정합

### Migration notes

- 기존 `mp-action-btn--primary` → `scm-button scm-button--primary`
- 기존 `form-radio` (input gradient) 와 `bu-radio` (input + .dot) 두 패턴 → `scm-radio` (input + `.scm-radio-dot`) 단일 통합
- `sd-back-btn` / `mp-back-btn` prefix 충돌 → `scm-back-btn` 통합
- `scm-search-btn` 의 `:not(:disabled)` 톤은 `border:1px solid #000` 으로 통일 (기존 페이지마다 약간 차이 있던 것 일관화)

---

## v2.28.0 — 2026-05-01

SCM 시뮬레이션 시스템 (PRD → wireframe → React export) 을 위한 컴포넌트 시스템화 시작. Phase A 인벤토리 + Phase B Stage 1 atom 12개 추출.

### Added — Phase A: 컴포넌트 인벤토리

- `docs/component-inventory.md` — 7개 페이지 (메인 4 + 보조 3) + LNB drawer 정독 기반 인벤토리. ~63개 공통 컴포넌트 후보를 13개 stage 로 그룹핑한 의존 그래프.

### Added — Phase B Stage 1: Atoms (의존 없는 12개 모듈)

각 모듈은 `components/<name>/` 안에 `<name>.css / .js / .html / .jsx / README.md` 5개 파일로 자가포함.

- **`components/backdrop/`** — `scm-backdrop`. 모달/드로어/팝오버 backdrop. variants: 기본 / `--transparent`. CSS var `--scm-backdrop-z` 로 z-index 오버라이드.
- **`components/icon-box/`** — `scm-icon-box`. 36×36 (또는 32×32 sm) 컬러 아이콘 박스. variants: 기본 / `--blue` / `--green` / `--orange` / `--red`. KPI 카드, activity list 등에서 사용.
- **`components/checkbox/`** — `scm-checkbox`. 16×16 SVG 기반 체크박스. `aria-checked="false/true/mixed"` 로 상태 표현. div/span 기반 (input 사용 안 함).
- **`components/tag/`** — `scm-tag`. h28 인라인 태그. variants: 기본 / `--blue` / `--green` / `--gray`. `scm-tag-stack` 컨테이너 포함.
- **`components/color-chip/`** — `scm-color-chip`. 컬러명 표시 칩 (데이터 리스트 셀 인라인).
- **`components/state-text/`** — `scm-state-text`. 본문 톤 인라인 상태 텍스트. variants: 기본 / `--accent` (파랑) / `--critical` (빨강).
- **`components/platform-tag/`** — `scm-platform-tag`. 플랫폼 배지. `data-color` = blue / yellow / gray.
- **`components/toggle/`** — `scm-toggle`. 36×20 (또는 32×20 sm) On/Off 토글. input 기반 / div 기반 둘 다 지원. `scm-toggle-cell`, `scm-toggle-label` 포함.
- **`components/empty-hint/`** — `scm-empty-hint`. 작은 빈 상태 텍스트 (테이블 영역).
- **`components/empty-state/`** — `scm-empty-state`. 큰 빈 상태 (아이콘 + 제목 + 설명). icon-color variants: 기본 (오렌지) / `--blue` / `--green` / `--gray` / `--red`.
- **`components/toast/`** — `scm-toast`. 우상단 토스트 시스템. variants: `--success` / `--info` / `--critical`. 슬라이드 인/아웃, 자동 dismiss. `SCM.toast.show({ variant, title, desc, duration })` 글로벌 API.
- **`components/section-count/`** — `scm-section-count`. 섹션 제목 옆 카운트 강조.

### Added — 카탈로그 통합

- `design-system/index.html` 의 좌측 nav 에 "SCM Atoms (Stage 1)" 그룹 추가 (12개 anchor)
- `<head>` 에 12개 모듈 CSS link 추가
- 페이지 끝부분에 21번 섹션 (`#scm-atoms`) 추가 — 각 atom 별 live demo + marker HTML + variants + source 표시
- 페이지 끝부분에 12개 모듈 JS 스크립트 + 데모 핸들러 추가

### Conventions (확정)

- 폴더: `components/<name>/`, prefix 없음
- CSS 클래스: `scm-<name>` / `scm-<name>-<part>` (BEM 의 `__` 대신 대시)
- 시각 변형: `--variant`, 동적 상태: `is-<state>`
- JS 네임스페이스: `window.SCM.<name>.mount(el, opts)` factory
- React twin: 동일 className / DOM 구조, default export, hooks-only
- 토큰 (`ld-*`) 만 유지, 페이지 prefix (`mp-`, `sd-`, `bu-`, `af-`, `er-`, `db-`, `reg-`, `lnb-`) 모두 deprecated → 추후 stage 별로 마이그레이션

### Notes

- Stage 1 은 atom 추출 단계 — 페이지에 실제 적용 (사용처 교체) 은 Stage 12 마이그레이션에서.
- `scm-toast` 는 현재 무탠 페이지에만 정의되어 있던 토스트 시스템을 모든 페이지로 확산 가능하게 모듈화.

---

## v2.27.0 — 2026-04-30

SCM Table 자가포함 컴포넌트 추출 + 카테고리·옵션·SKU명 컬럼 폭 spec 통일.

### Added — `components/scm-table/` 신규 모듈

자가포함 (CSS + JS + README) — 다른 프로젝트에 폴더만 복사하면 동일 동작 재현.

- **`scm-table.css`** — 테이블 전체 패턴 단일 정의:
  - 컬럼 폭 시스템 (col-auto / col-small / col-medium / col-large / col-spacer)
  - cell-clamp (1줄, max 260) / cell-clamp-2 (2줄 wrap, 강제 260)
  - frozen 컬럼 (col-frozen-1~N + `--frozen-l1..N`)
  - sticky thead 듀얼 테이블
  - 셀 선택 (외곽 4변 라인 + 옅은 블루 bg)
  - resize 핸들 (8px, hover 시 블루 라인, 2단 thead 시 row1 영역 확장)
  - 2단 thead group-row
  - sub-row stack
- **`scm-table.js`** — 4개 모듈:
  - `buildLeafHeaders(thead)` — 1단/2단 thead 모두 colspan/rowspan 펼쳐 leaf 배열 (body td idx 와 1:1)
  - `setupStickyThead(root, opts)` — 듀얼 테이블 분리 + colgroup 동기화 + 클래스 기반 폭 보정
  - `setupTableInteractions(root, opts)` — 헤더 더블클릭 컬럼 선택 + resize 핸들 + reorder
  - `setupCellSelection(root, opts)` — Excel-like 드래그 + Cmd+C TSV + `_selectColumn(c)` API
  - `SCMTable.init(opts)` — 일괄 초기화
- **`README.md`** — 전체 spec + 사용법

### Changed — 컬럼 폭 통일 spec (4개 페이지 일괄)

| 클래스 | min | 초기 | max |
|---|---|---|---|
| col-auto | min-content | content | — |
| col-small | 100 | auto | 160 (cell-clamp) |
| col-medium | **100** | **auto** | **260** (cell-clamp / wrapper) |
| col-medium + cell-clamp-2 | 260 (강제) | 260 (강제) | 260 (강제) |
| col-large | 100 | **360** (JS 강제) | resize 자유 |
| col-spacer | — | 100% | — |

resize 핸들 최소: **100px** 일관.

### Added — `cell-clamp-2` (2줄 wrap)

긴 식별자 (공급사명(ID) 등) 용. JS 가 측정 시 body td 안에 `.cell-clamp-2` 가 있으면 col 을 **강제 260** 으로 — auto-layout 이 짧은 콘텐츠로 인해 작아지는 것 방지.

### Added — 헤더 더블클릭 → 컬럼 전체 선택

`setupCellSelection` 이 `tableEl._selectColumn(c)` API 노출. `setupTableInteractions` 의 dblclick 핸들러가 호출.

### Changed — 셀 선택 컬러

- bg `rgba(80,140,220,0.10)` → `rgba(59,130,246,0.08)` (옅은 블루)
- line `#6892C8` → `#3B82F6` (Tailwind blue-500)

### Changed — 본문 셀 2줄 기본

- `white-space:nowrap; text-overflow:ellipsis` 제거
- `white-space:normal; word-break:keep-all; overflow:hidden`
- 행 높이 68 → 76 (2줄 line-height × 2 + padding 32 ≈ 73 이상 확보)
- 숫자/ID 류 (`cell-numeric`, `sku-num`, `cb-col`, `cb-col2`, `col-no`) 는 nowrap 유지

### Fixed — `index.html` colspan=2 cb-header 매핑 버그

`buildLeafHeaders` 가 단일 row thead 에서도 colspan 을 펼치도록 수정 → leaf 인덱스가 body td 인덱스와 1:1 매핑. 이전엔 col-large 360 강제가 엉뚱한 컬럼(사이즈 개별 설정)에 적용되던 버그.

### Fixed — resize 핸들 2단 thead 보강

row2 leaf 셀 핸들에 `is-row2` 클래스 → top:-44px 로 row1 영역(group-row 높이)까지 확장. 사용자가 thead 어느 위치에서든 컬럼 boundary 잡을 수 있음.

### Fixed — resize 시 다른 컬럼 압축 방지

drag 중 cloneTable / origTable 의 width / minWidth 도 동시 update → 한 컬럼 늘려도 다른 컬럼이 압축되지 않음.

### Updated

- `layer-desktop.css` `.ld-data-table` 룰 — col-medium / col-medium + cell-clamp-2 spec 추가
- `docs/table-columns.md` — v2.27.0 spec 으로 재작성
- `docs/cell-selection.md` — 신규 (Excel-like 셀 선택 / TSV 복사 / 헤더 더블클릭)


## v2.26.0 — 2026-04-30

데이터 리스트 페이지 (SKU 관리 / 무탠 전개상품 관리) 에서 확정된 sticky/frozen/dual-table 시스템 일괄 동기화.

### Added — Sticky scroll stack
- CSS 변수 `--scm-sticky-gnb` / `--scm-sticky-filter` / `--scm-sticky-stats` 도입.
- `.mp-filter-bar` (z:12) / `.mp-stats-row` (z:11) sticky 룰. 페이지 좌우 padding(28) 을 음수 margin 으로 캔슬해서 sticky 시 좌우 끝까지 흰 배경.
- 신규 유틸 `setupStickyScrollStack({ filterSelector, statsSelector })` — ResizeObserver 로 단 높이 자동 갱신.

### Added — Dual-table sticky thead
- `.mp-thead-sticky` + `.mp-thead-scroll` 패턴 (CSS sticky-on-thead 의 rowspan/colspan 렌더 버그 회피).
- `::before` 2px 검정 구분선 (z:10, frozen 셀 z:5 보다 위).
- 신규 유틸 `setupStickyTable(tableEl, options)` — thead 분리 이동 + colgroup 동기화 + 가로 스크롤 sync.
- 모든 th/td 에 `box-sizing:border-box` 강제 (border 가 컬럼 너비 안 밀게).

### Added — Frozen columns
- `.col-frozen-1..6` 가로 sticky + `var(--frozen-l1..6)` 누적 left.
- col-frozen-6 우측 1px boundary line + 다음 셀 `border-left:0` (이중선 방지).
- group-row 의 frozen split 룰 (`.col-frozen-group + th { border-left:0 }`).
- 신규 유틸 `applyFrozenColumns(tableEl, frozenCount)`.

### Added — Excel-like cell selection
- `.is-cell-selectable`, `.cell-selected`, `.cell-active` 룰.
- 신규 유틸 `setupCellSelection(tableEl)` — drag → 범위, mouseup → 끝, 외부 클릭 해제, copy → TSV (RFC 4180 quote-escape).

### Added — Multi-select 팝오버 (Figma 리디자인)
- `.mp-filter-popover--multi` + `.mp-af-mode-row` (목록선택/직접입력 라디오) + `.mp-af-2col` (검색결과/선택됨).
- 선택됨 컬럼 light-blue bg `#F0F7FF` (hover `#E2F1FF`) + 우측 ✓ 마크 (체크박스 X).
- `<FilterPopoverMulti>` 컴포넌트 추가. 직접입력 textarea 는 `ta.value` 직접 셋팅 + `setSelectionRange` 로 cursor 점프 방지.

### Added — Confirm modal infra
- `.mp-modal` / `.mp-modal-backdrop` 룰 + `<strong class="accent">` 강조.
- vanilla API `openConfirmModal({ title, descHtml, onConfirm, confirmLabel })` / `closeConfirmModal()`.
- backdrop click + Escape 자동 닫힘.

### Added — SKU 다중값 셀 (sub-row stack)
- `.sku-stack-td` / `.sku-stack` / `.sub-row` 룰 (per-UID 1:1 매핑, height:100% + flex:1).

### Changed — SKU 테이블 구조
- 30 열 레이아웃 (cb + No + 8 + 6 + 4 + 3 + 2 + 4 + spacer), frozen=6.
- 그룹 헤더 split: `colspan="4" col-frozen-3 col-frozen-group` + 빈 `colspan="4"` (frozen 경계 침범 방지).
- Body td borders → `border-left` (thead 와 align). 무탠 (index.html) 은 `border-right` 유지.

### Added — 신규 컴포넌트 export
- `StickyTable` / `setupStickyTable`
- `FrozenColumns` / `applyFrozenColumns`
- `CellSelection` / `setupCellSelection`
- `setupStickyScrollStack` / `useStickyScrollStack`
- `FilterPopoverMulti`
- `openConfirmModal` / `closeConfirmModal`

### Docs
- `docs/data-list-page.md` — "v2.26.0 Sticky stack & frozen columns" 섹션.
- `docs/components.md` — StickyTable / FrozenColumns / CellSelection / setupStickyScrollStack / FilterPopoverMulti / Confirm modal entries.
- `docs/table-columns.md` — SKU 관리 30 col 레이아웃 + frozen split 룰.
- `docs/tokens.md` — `--scm-sticky-*` / `--frozen-l1..6` + frozen 색상 토큰.
