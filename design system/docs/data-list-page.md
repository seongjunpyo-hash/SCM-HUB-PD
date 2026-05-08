# Data-List Page Pattern

> SCM Hub `무탠 전개상품 관리` (Figma 86:10164) 에서 확정된 데이터 리스트 페이지 표준 템플릿.
> SKU 관리 · 발주 관리 · 매장 관리 같은 다른 데이터 리스트 화면도 이 템플릿을 그대로 사용.
>
> **개발자에게 즉시 전달 가능한 코드/spec 은 [`dev-handoff.md`](./dev-handoff.md) 참고. 본 문서는 디자인 의도/룰 설명용.**

## v2.26.0 — Sticky stack & frozen columns

데모 (`scm hub/sku-management.html`, `scm hub/index.html`) 에서 확정된 4가지 새 시스템:

### 1. Sticky scroll stack (GNB → filter → stats → thead)

```
┌──────────────────────────── topbar (z:20, top:0)              ⇣
│ Filter Bar  (z:12, top: var(--scm-sticky-gnb))                ⇣
│ Stats Row   (z:11, top: GNB + filter)                          ⇣
│ Thead       (z:9,  top: GNB + filter + stats, ::before 2px 검정 라인)
│ Body table tr… ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
```

```css
:root {
  --scm-sticky-gnb: 64px;
  --scm-sticky-filter: 52px;   /* JS 가 측정해서 갱신 */
  --scm-sticky-stats: 84px;    /* JS 가 측정해서 갱신 */
}
.mp-filter-bar { position:sticky; top:var(--scm-sticky-gnb); z-index:12; background:#fff; margin:0 -28px; padding:16px 28px; }
.mp-stats-row  { position:sticky; top:calc(var(--scm-sticky-gnb) + var(--scm-sticky-filter)); z-index:11; background:#fff; margin:0 -28px; padding:12px 28px 12px 30px; }
.mp-thead-sticky { position:sticky; top:calc(var(--scm-sticky-gnb) + var(--scm-sticky-filter) + var(--scm-sticky-stats)); z-index:9; background:#fff; }
.mp-thead-sticky::before { content:''; position:absolute; left:0; right:0; top:0; height:2px; background:var(--ld-fg); z-index:10; }
```

```js
import { setupStickyScrollStack } from '@/design-system/components';
setupStickyScrollStack({ filterSelector:'.mp-filter-bar', statsSelector:'.mp-stats-row' });
// ResizeObserver 로 두 단의 offsetHeight 변경을 감지해서 CSS 변수 자동 갱신.
```

### 2. Dual-table sticky thead (rowspan/colspan-safe)

CSS `position:sticky` 가 `<thead>` 에 rowspan/colspan + 가로 스크롤이 함께 있을 때 렌더 버그가 있어, **thead 만 별도 테이블로 분리** 해 sticky 컨테이너에 둠.

```html
<div class="mp-table-host">
  <div class="mp-thead-sticky">
    <div class="mp-thead-scroll"><!-- JS 가 thead-only 테이블을 여기로 이동 --></div>
  </div>
  <div class="mp-table-scroll">
    <table class="mp-table">
      <thead>...</thead>          <!-- init 시 위로 이동, body 만 남음 -->
      <tbody>...</tbody>
    </table>
  </div>
</div>
```

```js
import { setupStickyTable } from '@/design-system/components';
setupStickyTable(document.querySelector('.mp-table-scroll > .mp-table'));
// init 시:
//  1) 본문 첫 행 기준 컬럼 너비 측정 (정수 px round)
//  2) thead-only 테이블에 동일 colgroup + table-layout:fixed
//  3) origThead 통째로 이동 (clone 아님 — id/이벤트 보존)
//  4) 본문 가로 스크롤 → thead-scroll 가로 스크롤 동기화
```

`box-sizing:border-box` 를 모든 th/td 에 강제해 **border 가 컬럼 너비를 밀지 않도록** 보장 (sticky thead 와 본문 컬럼 align).

### 3. Frozen columns (가로 sticky)

```css
.mp-table .col-frozen-1,  .mp-table .col-frozen-2,  ...,  .mp-table .col-frozen-6 {
  position:sticky; background:#fff; z-index:5;
}
.mp-table .col-frozen-1 { left:0; }
.mp-table .col-frozen-2 { left:var(--frozen-l2, 40px); }
/* ... 6 까지 누적 */
.mp-table .col-frozen-6 { border-right:1px solid rgba(0,0,0,0.12); }   /* boundary line */
.mp-table .col-frozen-6 + th, .mp-table .col-frozen-6 + td { border-left:0; }  /* 이중선 방지 */
```

```js
import { applyFrozenColumns } from '@/design-system/components';
applyFrozenColumns(tableEl, 6);
// 첫 6개 컬럼에 col-frozen-N 클래스 자동 부여 + 누적 left → --frozen-l1..6 셋팅.
// SKU 관리처럼 group-row 에 colspan 큰 그룹 셀이 frozen 영역을 가로지르면
// HTML 마크업에 직접 col-frozen-3 col-frozen-group 클래스를 명시 (split).
```

### 4. Excel-like cell selection (drag + Cmd/Ctrl+C TSV)

```js
import { setupCellSelection } from '@/design-system/components';
setupCellSelection(document.querySelector('.mp-table-scroll .mp-table'));
// mousedown on td (cb/spacer/anchor/button 제외) → 앵커 + 드래그 시작
// mouseover during drag → 범위 페인트 (.cell-selected bg, .cell-active outline)
// mouseup (document) → 끝
// 표 바깥 mousedown → 해제
// copy → TSV 빌드 (tab/newline/quote 가 들어간 셀은 RFC 4180 quote-escape)
```

### 5. SKU 다중값 셀: stacked sub-rows (per-UID 1:1)

```html
<td class="col-auto sku-stack-td">
  <div class="sku-stack">
    <div class="sub-row">UID-001</div>
    <div class="sub-row">UID-002</div>
    <div class="sub-row">UID-003</div>
  </div>
</td>
```

플랫폼/UID/옵션번호/상품옵션/기준카테고리 5개 컬럼이 한 행 안에서 같은 sub-row 인덱스로 정렬 (`height:100% + flex:1` 로 자동 분배).

### 6. Confirm modal infra (vanilla DOM API)

```html
<div class="mp-modal-backdrop" id="mp-modal-backdrop"></div>
<div class="mp-modal" id="mp-modal" role="dialog" aria-modal="true" aria-labelledby="mp-modal-title">
  <h3 id="mp-modal-title"></h3>
  <p class="desc" id="mp-modal-desc"></p>
  <div class="actions">
    <button id="mp-modal-cancel">취소</button>
    <button class="primary" id="mp-modal-confirm">진행</button>
  </div>
</div>
```

```js
import { openConfirmModal, closeConfirmModal } from '@/design-system/components';
openConfirmModal({
  title: '상품 매핑',
  descHtml: `선택하신 <strong class="accent">${n}건</strong>(매입)의 SKU를 매핑합니다.`,
  confirmLabel: '매핑',
  onConfirm: () => { /* ... */ },
});
// backdrop click + Escape 자동 닫힘.
```

---

## v2.23.0 — 컴포넌트화 완료

본 문서의 모든 패턴이 **CSS 레시피 + React 컴포넌트** 두 형태로 시스템화되었습니다.

| 영역 | CSS 클래스 | React 컴포넌트 |
|---|---|---|
| Page Head | `.ld-page-head` / `.ld-page-title` / `.ld-action-btn` | `<PageHead>`, `<PageTitle>`, `<PageActions>`, `<ActionButton>` |
| Filter Bar | `.ld-filter-bar` / `.ld-filter-chip` / `.ld-filter-select` / `.ld-filter-group` / `.ld-filter-input` / `.ld-filter-search-btn` | `<FilterBar>`, `<FilterChip>`, `<FilterSelect>`, `<FilterGroup>`, `<FilterInput>`, `<FilterSearchButton>` |
| Stats Bar | `.ld-stats-bar` (+ `-left/right`, `-counts-wrap`, `-counts`, `-mini-actions`) / `.ld-stat` / `.ld-mini-action` / `.pager` / `.pgsize` | `<StatsBar>`, `<Stat>`, `<MiniAction>`, `<DownloadButton>`, `<Pager>`, `<PageSize>` |
| Info Banner | `.ld-info-banner` (+ `-icon/body/title/text/toggle`) | `<InfoBanner>` |
| Data Table | `.ld-data-table-host` / `.ld-data-table-scroll` / `.ld-data-table` (+ `--grouped`) / `.ld-data-table-cb` / `.ld-data-table-link` / `.ld-data-table-empty` | `<DataTableHost>`, `<DataTableScroll>`, `<DataTable variant="default\|grouped">`, `<DataTableGroupRow>`, `<DataTableCell>`, `<DataTableCheckbox>`, `<DataTableEmpty>` |
| Empty State | `.ld-empty-state` (+ `-icon/text/title/desc`) | `<EmptyState>` |

JSX 사용 예시는 [`docs/components.md` § Data List Page Components](./components.md#data-list-page-components-v2230). 픽셀 단위 spec/CSS 복붙은 [`docs/dev-handoff.md`](./dev-handoff.md).

## 최종 픽셀 spec (v2.23.0 — Figma dev export 기반)

| 영역 | 핵심 값 |
|---|---|
| **Topbar (GNB)** | h64, 풀폭, 좌측 188(메뉴 48 + gap 24 + 로고 96), 우측 아바타(32 #EEE) + "홍길동(15/500) 님(14/500)" + ▾(20×20) |
| **LNB** | w56, 6 아이템, padding 16/0, gap 8, item = 3px strip + 48×48 button + 24×24 icon, sticky from top:64 |
| **Page title** | 26/600/lh36.4 #000 |
| **Page action btn** | 단일 통합 버튼 h44, **검정 1px outlined**, "일괄 업로드 \| 진행중 N" (N은 #245EFF) |
| **Filter chip** | h44 padding 12, gap 4, 15/500 + 카운트 15/600 #245EFF |
| **Filter select** | floating label 패턴, padding 12 16, 라벨 12/400 #8A8A8A, 필수 = 파란 4×4 점 (별표 X), focus 만 보더 검정 |
| **검색 button** | h44 disabled 톤 (bg `rgba(138,138,138,0.10)`, border #EBEBEB, color `rgba(0,0,0,0.20)`) |
| **Stats bar** | h60, padding 12 0 12 2, gap 28 (좌우 섹션) |
| **Stats counts** | 15/500 라벨 + 15/600 숫자 (전체=#000, 전개중=#245EFF, 미전개=#666). 카운트 사이 3×3 #CCC 점, 카운트 그룹과 미니액션 사이 1×16 #EBEBEB v-divider |
| **Mini actions** | "코드 복사" / "전개 여부 변경" h36 padding 8 12, font 14/500. disabled 톤은 동일 disabled 컬러 |
| **Right toolbar** | timestamp 15/400 #8A8A8A · v-divider · 다운로드 h36 outlined · v-divider · pager · pgsize 114px |
| **Pager** | "1" 15/500 #000 + "/ 99 페이지" 15/400 #666. ‹ › 36×36 ghost (no border), disabled 시 stroke 2px #CCC |
| **Pgsize select** | width 114, padding 8 12, font 14/400, 옵션 [100,300,500,1000] |
| **Table top** | 2px solid #000 (강한 상단 라인) |
| **Table header** | h54, padding 16/8/16/16 (default), 16(all) 일부 (사이즈/스타일명/스타일넘버), font 14/500 #000, sticky, border-bottom #E0E0E0 |
| **Table row** | h68 min 60, padding 16, font 15/400, vertical-align top |
| **Row divider** | group 행 위 = #E0E0E0 (살짝 진함, 그룹 경계), in-group 행 위 = #EBEBEB (연함). 첫 행은 thead가 담당. 마지막 행 아래 #E0E0E0 닫는 라인. |
| **Column divider** | #EBEBEB |
| **cb-col 그룹 시각화** | body 내 cb-col 의 가로 보더는 항상 #fff (투명) — 그룹 컬럼이 한 칸처럼 연속 |
| **Sort 가능 컬럼** | 4개: 대표스타일 / 컬러 / 스토어 전개 여부 / UID. 아이콘 16×16 #CCC |
| **컬러 chip / 시즌 태그** | 동일 스타일: h28 padding 0 8 bg `rgba(0,0,0,0.05)` radius 4 / 14/500 #000 |
| **전개 pill** | h28 padding 4 8 bg #E2F1FF / fg+dot #245EFF / 8×8 dot / 14/500. 셀 우측 끝에 별도 chevron 20×20 #8A8A8A |
| **사이즈 button** | h36 padding 8 12 outlined #E0E0E0 / "전개 N/M" — N은 14/600 #245EFF, "/M"은 14/400 #666. sizeAll 시 "전체 전개" plain 14/500 #000 |
| **링크 셀** | 15/400 underlined #000 (UID/SKU/바코드/스타일넘버) |
| **체크박스** | 16×16, 1px #CCC, radius 2, checked = #245EFF + white check |

## 페이지 구조

```
┌─ App (LNB 56 + 1fr) ─────────────────────────────────────────┐
│ LNB │ Topbar (logo + user)                                  │
│ 56  │ Page Header (title 28/700 + actions)                  │
│     │ Filter Bar (label-above-input, * required)            │
│     │ Stats Bar (counts + mini actions | right toolbar)     │
│     │ Table (top thick black + columns + spacer)            │
└─────┴────────────────────────────────────────────────────────┘
```

- 레이아웃은 [`docs/breakpoints.md`](./breakpoints.md) 의 1440px 가드 + Grid `min-width:0` 를 따름
- 모든 버튼 라운드는 [`docs/tokens.md`](./tokens.md) 의 `--ld-radius-xs` (4px)
- 모든 아이콘은 PBOAssets sprite + `currentColor` ([`docs/icons.md`](./icons.md))

---

## 1. Topbar

```html
<header class="topbar">
  <a class="logo" href="/" aria-label="홈"><svg><use href="#logo-scm-hub"/></svg></a>
  <div class="user">
    <span class="avatar">홍</span>
    <span>홍길동 님</span>
    <svg class="ic ic-chevronDown ic--10"><use href="#ic-chevronDown"/></svg>
  </div>
</header>
```

- 높이 56px, 좌우 패딩 24
- 로고: SVG sprite, 96×18, `currentColor`
- 우측 사용자: 아바타 24×24 (50%, `#F08770` 코랄 + 흰 한자), 텍스트 13/regular, ▾ 10px

LNB 의 햄버거 ≡ 는 LNB 최상단 첫 칸에 둠 (Topbar 가 아님). 이번 화면에서는 LNB > 메뉴 + 6 아이콘 구조.

---

## 2. Page Header

```html
<div class="mp-page-head">
  <h1 class="mp-page-title">무탠 전개상품 관리</h1>
  <div class="mp-page-actions">
    <button class="mp-action-btn">일괄 업로드</button>
    <button class="mp-action-btn">
      <svg class="ic ic-clockCircle ic--16"><use href="#ic-clockCircle"/></svg>
      진행중 <span class="num">2</span>
    </button>
  </div>
</div>
```

- 타이틀: `28px / 700 / -0.02em`, 좌측
- 우측 액션 버튼: 32h 4r `--ld-border` 보더, `font-size:13/regular`, 아이콘 + 텍스트 + 숫자(accent 컬러)
- 패딩: `padding: 20px 0 16px`

---

## 3. Filter Bar — Label-above-input

```html
<div class="mp-filter-bar">
  <button class="ld-tag-filter">
    <svg class="ic ic-funnel ic--14"></svg>
    전체 필터 <strong class="num">1</strong>
  </button>

  <div class="mp-filter-field">
    <label>시즌<span class="req">*</span></label>
    <button class="ld-select is-active">
      <span class="ld-select-value">전체</span>
      <svg class="ld-select-chevron ic ic-chevronDown ic--14"></svg>
    </button>
  </div>

  <!-- ... 다른 필터 칩들 ... -->

  <button class="mp-search-btn">검색</button>
</div>
```

룰:
- **필터 칩 (전체 필터)**: 좌측에 위치, funnel 아이콘 + 라벨 + 숫자 (active accent 컬러)
- **셀렉트 필드**: 라벨이 인풋 위에 작게 (`11px / 500 / fg-low`), 필수는 빨간 `*`
- **셀렉트 인풋**: 36h 4r, padding `0 12`, font 13
- **상태**:
  - default: 보더 `--ld-border` 회색
  - **선택된 값 있음 (`.is-active`)**: 보더는 그대로 회색, **값 텍스트만 검정 + weight 500**
  - **포커스 / 열림 (`:focus`, `[aria-expanded="true"]`)**: 보더 `--ld-border-strong` 검정
  - placeholder 텍스트는 `fg-low` 회색
- **검색 버튼**: 36h 4r, `bg-low` 배경 + `fg-lower` 텍스트 (비활성 톤)
- chevron 은 PBOAssets `ic-chevronDown` 14px (유니코드 ▾ 사용 금지)
- gap 8, flex-wrap 허용

---

## 4. Stats Bar — Counts + Mini Actions + Right Toolbar

```html
<div class="mp-stats-row">
  <span class="mp-stat mp-stat--all">전체 <span class="num">500</span></span>
  <span class="mp-stat-divider"></span>
  <span class="mp-stat mp-stat--deployed">
    <svg class="ic ic-checkCircle ic--14" style="color:var(--ld-fg-accent)"></svg>
    전개중 <span class="num">490</span>
  </span>
  <span class="mp-stat mp-stat--undeployed">
    <svg class="ic ic-eyeClosed ic--14" style="color:var(--ld-fg-low)"></svg>
    미전개 <span class="num">10</span>
  </span>

  <button class="mp-mini-action">코드 복사 <svg class="ic ic-chevronDown ic--14"></svg></button>
  <button class="mp-mini-action" disabled>전개 여부 변경 <svg class="ic ic-chevronDown ic--14"></svg></button>

  <div class="mp-stats-right">
    <span class="ts">25.10.24 12:00 업데이트</span>
    <button class="download">
      <svg class="ic ic-download ic--16"></svg> 전체 엑셀 다운로드
    </button>
    <span class="v-divider"></span>
    <span class="pager">
      <strong>1</strong>
      <span class="num-total">/ <span>1</span> 페이지</span>
      <button class="pbtn" aria-label="이전 페이지" disabled><svg class="ic ic-chevronLeft"></svg></button>
      <button class="pbtn" aria-label="다음 페이지"><svg class="ic ic-chevronRight"></svg></button>
    </span>
    <span class="pgsize-wrap">
      <button class="pgsize"><span>100개씩</span><svg class="ic ic-chevronDown ic--14"></svg></button>
      <ul class="pgsize-popup" role="listbox">
        <li role="option" aria-selected="true"  data-value="100">100개씩</li>
        <li role="option" data-value="300">300개씩</li>
        <li role="option" data-value="500">500개씩</li>
        <li role="option" data-value="1000">1000개씩</li>
      </ul>
    </span>
  </div>
</div>
```

룰:
- 좌측 영역: 통계 + 미니 액션 / 우측 영역: 메타 + 툴바 (`margin-left: auto`)
- **통계** (전체/전개중/미전개): 13/regular, 숫자만 700. 아이콘은 PBOAssets `ic-checkCircle`(전개중, accent), `ic-eyeClosed`(미전개, fg-low)
- **미니 액션** (코드 복사 / 전개 여부 변경): 30h 4r `--ld-border`, 13/regular, 우측 chevron 작게. disabled 시 `fg-disabled`
- **타임스탬프**: 13/regular, `fg-low`
- **다운로드 버튼**: 36h 4r `--ld-border`, 14/500, 아이콘 16px + 텍스트
- **세로 디바이더**: 1×16, `--ld-border` 그레이
- **페이지 인디케이터**: "1" 진한 검정/700, "/ N 페이지" 회색
- **페이지 이동 버튼**: 32×32 보더 없음, 호버 시만 `bg-low` 배경
  - **disabled 룰**: 첫 페이지에서 `<` disabled, 마지막 페이지에서 `>` disabled
- **페이지 사이즈 셀렉트**: 36h 4r, `min-width:108`, 좌측 라벨 / 우측 chevron
  - 클릭 → 4개 옵션 (100/300/500/1000) 드롭다운
  - default 선택 = 100 (accent 컬러 + bold)
  - 외부 클릭 / Esc → 닫힘
  - 옵션 클릭 → 라벨 갱신 + 페이지 1로 리셋

이 영역에는 위·아래 보더 없음 (이전엔 border-top 으로 필터바와 구분했으나 제거).

---

## 5. Table

테이블 자체 룰은 [`docs/table-columns.md`](./table-columns.md) 참고. 페이지에서 적용한 확정 룰만 요약:

- **외곽**: 상단 `2px solid --ld-fg` (굵은 검정) **만**. 좌/우/하단 보더 없음. radius 0.
- **헤더 배경**: 흰색 (`--ld-bg`). 회색 배경 사용 금지.
- **컬럼 width**: Auto / Small / Medium(260) / Large(360) / Spacer (마지막)
- **Row min-height**: 52px, 콘텐츠 길면 auto 로 늘어남
- **셀 정렬**: 기본 좌측 상단, 숫자(수량·가격) 우측 상단 (`.cell-numeric`)
- **세로 줄**: 모든 셀에 `border-right` (마지막 컬럼 제외)
- **체크박스 컬럼 2개**: 1열=상품 단위(대표스타일), 2열=SKU 옵션 단위. 모든 행에 양쪽 표시.

### 셀 안의 인라인 컴포넌트

#### Pill + Chevron Split (스토어 전개 여부)

```html
<div class="mp-deploy is-deployed">
  <span class="pill"><span class="dot"></span>전개중</span>
  <button class="chev-btn"><svg class="ic ic-chevronDown"></svg></button>
</div>
```

- pill: 24h, padding 0 10, **radius 4** (알약 999 아님), font 12/500
- 컬러:
  - `is-deployed` → `#E8EEFF` 배경 / `#1A56DB` 텍스트·dot
  - `is-undeployed` → `#F1F2F4` 배경 / `#6B7280` 텍스트
  - `is-partial` → `#FEF3E2` 배경 / `#B7791F` 텍스트
- 분리된 chev 버튼: 24×24 4r 보더, 별도 ▾

#### 사이즈 개별 설정 버튼

```html
<button class="mp-sizeset"><span class="num">전개 <em>5</em>/<span class="total">9</span></span></button>
```

- 28h 4r 보더, font 12. "전개" 라벨 + 사용수(검정 700) / 전체수(회색)
- 전체 설정시 "전체 전개"로 표시

#### 링크 셀 (UID / SKU번호 / 바코드 / 스타일넘버)

```html
<a class="mp-link">383827</a>
<a class="mp-link">S000001 외 6</a>
```

- `text-decoration: underline`, 검정 (accent 아님), `cursor:pointer`
- "외 N" 같은 묶음 표기 가능

---

## 6. UID 팝오버 (연결된 UID번호 확인)

UID 셀의 링크를 클릭하면 묶인 UID 목록을 보여주는 팝오버.

```html
<div class="mp-uid-backdrop"></div>
<div class="mp-uid-popover" role="dialog">
  <h4>연결된 UID번호 확인</h4>
  <ul><li>383829</li><li>384892</li></ul>
  <div class="actions">
    <button>UID 복사 (<span>2</span>)</button>
    <button class="primary">닫기</button>
  </div>
</div>
```

- position: fixed (클릭한 링크 바로 아래 위치)
- 220×auto, 4r 8 그림자, padding 14 16
- 외부 클릭 / 닫기 / Esc → 닫힘
- "UID 복사" 클릭 → 클립보드로 줄바꿈 복사

---

## 7. 페이지네이션 동작

- `state.page`, `state.pageSize` 상태 관리
- `applyFilters()` 안에서 페이지 슬라이스: `filtered.slice((page-1)*size, page*size)`
- `totalPages = Math.ceil(total / pageSize)` 동적 계산
- 페이지 이동 버튼:
  - `<` 클릭 → page-- (page > 1 일 때만)
  - `>` 클릭 → page++ (page < totalPages 일 때만)
  - 매번 `disabled` 동기화
- 페이지 사이즈 변경 시 → page 1 로 리셋

---

## 8. 셀렉트 popover 패턴 (재사용)

페이지 사이즈 셀렉트(100개씩) 같이 "버튼 + 옵션 리스트" 패턴은 다음 룰을 공유한다.

```css
.select-wrap { position: relative; }
.select-popup { position: absolute; top: calc(100% + 4px); right: 0; ... display: none; z-index: 30; }
.select-popup.is-open { display: block; }
.select-popup li { padding: 8px 14px; cursor: pointer; }
.select-popup li[aria-selected="true"] { color: var(--ld-fg-accent); font-weight: 600; }
```

JS:
- 버튼 클릭 → 팝업 토글, `aria-expanded` 동기화
- 옵션 클릭 → 라벨 갱신, `aria-selected` 옮기고 닫힘
- 외부 클릭 / Esc → 닫힘

---

## 체크리스트 — 새 데이터 리스트 페이지 만들 때

- [ ] body `min-width: 1440px` + `.app { grid-template-columns: 56px minmax(0, 1fr); }` + `.app > * { min-width: 0; }`
- [ ] PBOAssets 아이콘은 sprite + `<use>` 패턴 (유니코드 ▾ 금지)
- [ ] 모든 버튼 radius 4px
- [ ] 페이지 헤더: 28/700 타이틀 + 우측 액션 (32h 4r)
- [ ] 필터: label-above-input, * 필수 표시, is-active 는 텍스트만 검정, focus 만 보더 검정
- [ ] 통계 + 미니 액션 + 우측 툴바(타임스탬프/다운로드/디바이더/페이저/페이지사이즈)
- [ ] 페이지네이션: 실제 동작 + 양 끝에서 disabled
- [ ] 페이지 사이즈: 100/300/500/1000, 100 default
- [ ] 테이블: 상단 굵은 검정 라인만, 컬럼 width 토큰 (Auto/Medium/Large/Spacer), 행 min-height 52
- [ ] 셀 정렬 좌측 상단 (숫자는 우측 상단)
- [ ] 인라인 셀 컴포넌트(pill+chev / sizeset / link) 재사용
