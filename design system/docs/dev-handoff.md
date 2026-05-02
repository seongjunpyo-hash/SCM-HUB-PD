# SCM Hub — Developer Hand-off Guide

> 이 문서 한 장으로 SCM Hub 의 데이터 리스트 페이지(무탠 전개상품 관리 / SKU 관리 / 매장 관리 등) 를 처음부터 끝까지 구현할 수 있도록 정리.
> Figma dev export → 바로 적용된 픽셀 값 그대로.

데모: `scm hub/index.html`, `scm hub/sku-management.html`

> **v2.23.0 — 컴포넌트화 완료.** React 프로젝트는 `import { DataTable, FilterBar, StatsBar, InfoBanner, EmptyState, PageHead, ActionButton, ... } from '@/design-system/components'` 한 줄로 사용 가능. 컴포넌트 API + JSX 예시는 [`components.md` § Data List Page Components](./components.md#data-list-page-components-v2230).
>
> 본 문서는 그대로 **HTML/CSS 픽셀 spec** 으로 유지 — 데모(static HTML) 는 `mp-*` 프리픽스, 디자인 시스템 정식 클래스는 동일 spec 의 `ld-*` 프리픽스(`layer-desktop.css` §`Data Table`, §`Page Head`, §`Filter Bar`, §`Stats Bar`, §`Info Banner`, §`Empty State`).

---

## 0. Quick Start

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1440">
  <title>SCM-Hub · {페이지명}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
  <link rel="stylesheet" href="../design-system/layer-desktop.css">
</head>
<body>
  <!-- 1. 아이콘 sprite (페이지에 1번) -->
  <svg width="0" height="0" style="position:absolute"><defs>
    <symbol id="ic-home"  viewBox="0 0 20 20"><path d="..." stroke="currentColor" fill="none"/></symbol>
    <!-- ... 사용하는 PBO 아이콘들 -->
  </defs></svg>

  <!-- 2. Topbar (GNB) — 64px 풀폭 -->
  <header class="topbar">…</header>

  <!-- 3. App grid (LNB + main) -->
  <div class="app">
    <nav class="lnb">…</nav>
    <div>
      <main class="page">…</main>
    </div>
  </div>
</body>
</html>
```

---

## 1. 토큰 (Tokens)

### 색상

```css
:root {
  /* Foreground */
  --color-fg:           #000000;        /* 본문 텍스트 */
  --color-fg-low:       #666666;        /* 보조 텍스트 (/, 9 등) */
  --color-fg-lower:     #8A8A8A;        /* 라벨, placeholder */
  --color-fg-lowest:    #CCCCCC;        /* disabled, 정렬 화살표 */
  --color-fg-disabled:  rgba(0,0,0,0.20); /* disabled 강조 */
  --color-fg-accent:    #245EFF;        /* 강조 (숫자, 링크, dot) */

  /* Background */
  --color-bg:           #FFFFFF;
  --color-bg-low:       rgba(138,138,138,0.10);  /* hover, disabled bg */
  --color-bg-tinted:    rgba(0,0,0,0.05);        /* chip, 시즌 태그 bg */
  --color-bg-progress:  #E2F1FF;        /* 전개중 pill bg */

  /* Border (3단계) */
  --color-border-strong: #000000;       /* 검정 outlined 버튼, 테이블 상단 */
  --color-border:        #E0E0E0;       /* default, 그룹 경계 */
  --color-divider:       #EBEBEB;       /* in-group 행, 컬럼 디바이더 */
  --color-divider-light: #EFEFEF;       /* 일부 셀의 미세한 divider */
  --color-border-disabled: #EBEBEB;     /* disabled 버튼 */
}
```

### 타이포

```css
:root {
  --font-base: 'Pretendard', -apple-system, sans-serif;
}
```

| 용도              | size | weight | line-height | 비고 |
|-------------------|------|--------|-------------|------|
| 페이지 타이틀     | 26   | 600    | 36.4        | h1 |
| 본문 (셀, 메뉴)   | 15   | 400    | 20.4        | default body |
| 본문 강조 (값)    | 15   | 500    | 20.4        | 선택값 |
| 본문 숫자 강조    | 15   | 600    | 20.4        | "500" "490" |
| 작은 텍스트       | 14   | 500    | 19.6        | 칩, 헤더, 미니 액션 |
| 작은 텍스트 강조  | 14   | 600    | 19.6        | "5/9" 의 5 |
| 라벨/플로팅       | 12   | 400    | 18          | floating label |

### 간격 / radius

| 토큰              | 값 | 사용 |
|-------------------|----|------|
| radius-button     | 4  | **모든 버튼** |
| radius-tag        | 4  | 모든 태그/칩 |
| radius-cb         | 2  | 체크박스 |
| radius-circle     | 9999 (50%) | 아바타, dot, ghost button |

---

## 2. App Shell

### 1440px 최소 해상도 가드

```css
html, body { margin:0; padding:0; }
body { min-width: 1440px; display:flex; flex-direction:column; min-height:100vh; }

.app {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);  /* 1fr 만 쓰면 grid 자식이 컨텐츠로 부풀어 액션바 잘림 */
  flex: 1;
  min-width: 1440px;
}
.app > * { min-width: 0; }   /* grid 자식 기본 min-width:auto 무력화 */
```

### Topbar (GNB) — height 64

```html
<header class="topbar">
  <div class="topbar-left">
    <button class="menu-btn"><svg class="ic ic-menu"><use href="#ic-menu"/></svg></button>
    <a class="logo" href="#"><svg viewBox="0 0 96 18"><use href="#logo-scm-hub"/></svg></a>
  </div>
  <div class="topbar-right">
    <span class="avatar-text">홍</span>
    <div class="name-group">
      <span class="name">
        <span class="first">홍길동</span>
        <span class="nim">님</span>
      </span>
      <span class="chev"><svg><use href="#ic-chevronDown"/></svg></span>
    </div>
  </div>
</header>
```

```css
.topbar { background:#fff; border-bottom:1px solid #E5E5E5; box-shadow:0 1px 1px rgba(0,0,0,.08); padding:0 12px 0 0; height:64px; display:flex; align-items:center; flex-shrink:0; min-width:1440px; position:sticky; top:0; z-index:20; }
.topbar .topbar-left { width:188px; height:64px; padding:0 24px 0 4px; display:flex; align-items:center; gap:24px; flex-shrink:0; }
.topbar .menu-btn { width:48px; height:48px; border-radius:4px; background:transparent; border:0; padding:0; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#000; }
.topbar .menu-btn:hover { background:var(--color-bg-low); }
.topbar .menu-btn svg { width:24px; height:24px; }
.topbar .logo { display:inline-flex; align-items:center; height:18px; width:96px; color:#000; }
.topbar .logo svg { width:100%; height:100%; }
.topbar .topbar-right { margin-left:auto; padding:8px 12px; display:flex; align-items:center; gap:8px; cursor:pointer; }
.topbar .topbar-right .avatar-text { width:32px; height:32px; border-radius:50%; background:#EEEEEE; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:500; color:#000; }
.topbar .topbar-right .name-group { display:flex; align-items:center; gap:4px; }
.topbar .topbar-right .name-group .name { display:flex; align-items:center; gap:2px; }
.topbar .topbar-right .name-group .name .first { font-size:15px; font-weight:500; line-height:20.4px; color:#000; }
.topbar .topbar-right .name-group .name .nim   { font-size:14px; font-weight:500; line-height:17.64px; color:#000; }
.topbar .topbar-right .name-group .chev svg { width:20px; height:20px; }
```

### LNB — width 56, sticky from top:64

```html
<nav class="lnb">
  <div class="lnb-item is-active"><span class="strip"></span><button class="icon"><svg><use href="#ic-home"/></svg></button></div>
  <div class="lnb-item"><span class="strip"></span><button class="icon"><svg><use href="#ic-store"/></svg></button></div>
  <!-- 6개까지 -->
</nav>
```

```css
.lnb { background:#fff; border-right:1px solid #E0E0E0; display:flex; flex-direction:column; align-items:flex-start; padding:16px 0; gap:8px; position:sticky; top:64px; height:calc(100vh - 64px); }
.lnb-item { align-self:stretch; display:flex; align-items:center; gap:1px; }
.lnb-item .strip { width:3px; height:48px; background:transparent; flex-shrink:0; }
.lnb-item.is-active .strip { background:#000; }
.lnb-item .icon { width:48px; height:48px; padding:12px; border:0; background:transparent; cursor:pointer; color:#000; display:flex; align-items:center; justify-content:center; }
.lnb-item .icon:hover { background:var(--color-bg-low); border-radius:4px; }
.lnb-item .icon svg { width:24px; height:24px; stroke-width:1.4; }
```

---

## 3. Page Header

```html
<div class="mp-page-head">
  <h1 class="mp-page-title">무탠 전개상품 관리</h1>
  <div class="mp-page-actions">
    <button class="mp-action-btn">
      <span>일괄 업로드</span>
      <span class="v-div" aria-hidden="true"></span>
      <span class="progress-group">
        <span class="progress-label">진행중</span>
        <span class="progress-num">2</span>
      </span>
    </button>
  </div>
</div>
```

```css
.mp-page-head { display:flex; align-items:center; justify-content:space-between; padding:20px 0 16px; gap:12px; flex-wrap:wrap; }
.mp-page-title { margin:0; font-size:26px; font-weight:600; line-height:36.4px; color:#000; }

/* Action button — h44, 검정 outlined, 일괄 업로드 + divider + 진행중 N */
.mp-action-btn { display:inline-flex; align-items:center; gap:6px; height:44px; min-width:80px; padding:12px; font-size:15px; font-weight:500; line-height:20.4px; border-radius:4px; border:1px solid #000; background:#fff; color:#000; cursor:pointer; }
.mp-action-btn .v-div { width:1px; height:16px; background:#EBEBEB; }
.mp-action-btn .progress-group { display:inline-flex; align-items:center; gap:2px; }
.mp-action-btn .progress-label { color:#245EFF; font-weight:500; }
.mp-action-btn .progress-num   { color:#245EFF; font-weight:600; }
```

---

## 4. Filter Bar (Floating Label)

핵심: 라벨이 인풋 보더 위에 떠있는 패턴. 필수 표시는 **빨간 별표 X, 파란 4×4 점 O**.

```html
<div class="mp-filter-bar">
  <button class="mp-filter-chip" type="button">
    <svg class="ic ic-funnel"><use href="#ic-funnel"/></svg>
    <span>전체 필터</span>
    <span class="num">1</span>
  </button>

  <button class="mp-filter-select" type="button" data-state="active">
    <span class="label">시즌<span class="req-dot"></span></span>
    <span class="value">전체</span>
    <svg class="chev"><use href="#ic-chevronDown"/></svg>
  </button>

  <button class="mp-filter-select" type="button" data-state="filled">
    <span class="label">대표스타일</span>
    <span class="value">MMJTS6Z19 외 499</span>
    <svg class="chev"><use href="#ic-chevronDown"/></svg>
  </button>

  <button class="mp-filter-select" type="button" data-state="placeholder">
    <span class="value">컬러</span>
    <svg class="chev"><use href="#ic-chevronDown"/></svg>
  </button>

  <button class="mp-search-btn" type="button" disabled>검색</button>
</div>
```

```css
.mp-filter-bar { display:flex; flex-wrap:wrap; gap:8px; align-items:center; padding:0 0 16px; }

/* 전체 필터 chip */
.mp-filter-chip { height:44px; min-width:56px; padding:12px; background:#fff; border:1px solid #E0E0E0; border-radius:4px; display:inline-flex; align-items:center; gap:4px; font-size:15px; font-weight:500; line-height:20.4px; color:#000; cursor:pointer; }
.mp-filter-chip svg { width:20px; height:20px; }
.mp-filter-chip .num { color:#245EFF; font-weight:600; }

/* 셀렉트 — floating label 패턴 */
.mp-filter-select { position:relative; min-width:120px; padding:12px 16px; background:#fff; border:1px solid #E0E0E0; border-radius:4px; display:inline-flex; align-items:center; gap:8px; font-size:15px; font-weight:400; line-height:20.4px; color:#000; cursor:pointer; text-align:left; }
.mp-filter-select .label { position:absolute; left:12px; top:-9px; height:18px; padding:0 4px; background:#fff; font-size:12px; font-weight:400; line-height:18px; color:#8A8A8A; display:flex; align-items:flex-start; gap:2px; }
.mp-filter-select .label .req-dot { width:4px; height:4px; background:#245EFF; border-radius:50%; margin-top:2px; }
.mp-filter-select .value { min-width:64px; flex:1; }
.mp-filter-select .chev { width:20px; height:20px; }

/* 상태 */
.mp-filter-select[data-state="active"]      .value { font-weight:400; color:#000; }
.mp-filter-select[data-state="filled"]      .value { font-weight:500; color:#000; }
.mp-filter-select[data-state="placeholder"] .value { font-weight:500; color:#8A8A8A; }
.mp-filter-select[data-state="placeholder"] .chev  { width:16px; height:16px; }
.mp-filter-select:focus, .mp-filter-select[aria-expanded="true"] { border-color:#000; outline:none; }

/* 검색 버튼 — disabled 톤 */
.mp-search-btn { height:44px; min-width:84px; padding:12px; background:rgba(138,138,138,0.10); border:1px solid #EBEBEB; border-radius:4px; font-size:15px; font-weight:500; line-height:20.4px; color:rgba(0,0,0,0.20); cursor:not-allowed; display:inline-flex; align-items:center; justify-content:center; }
```

---

## 5. Stats Bar (중첩 flex 구조)

```html
<div class="mp-stats-row">
  <div class="mp-stats-left">
    <div class="mp-stats-counts-wrap">
      <div class="mp-stats-counts">
        <span class="mp-stat mp-stat--all">전체 <span class="num">500</span></span>
        <span class="mp-stat-divider"></span>
        <span class="mp-stat mp-stat--deployed">
          <svg class="ic ic-checkCircle" style="color:#245EFF"><use href="#ic-checkCircle"/></svg>
          전개중 <span class="num">490</span>
        </span>
        <span class="mp-stat-divider"></span>
        <span class="mp-stat mp-stat--undeployed">
          <svg class="ic ic-eyeClosed" style="color:#8A8A8A"><use href="#ic-eyeClosed"/></svg>
          미전개 <span class="num">10</span>
        </span>
      </div>
      <span class="v-divider"></span>
    </div>
    <div class="mp-stats-mini-actions">
      <span class="mp-mini-wrap">
        <button class="mp-mini-action">코드 복사 <svg class="ic ic-chevronDown"><use href="#ic-chevronDown"/></svg></button>
        <ul class="mp-mini-popup" role="listbox">
          <li>대표스타일 복사 (500)</li><li>SKU번호 복사 (500)</li><li>바코드 복사 (500)</li>
        </ul>
      </span>
      <span class="mp-mini-wrap">
        <button class="mp-mini-action" disabled>전개 여부 변경 <svg class="ic ic-chevronDown"><use href="#ic-chevronDown"/></svg></button>
        <ul class="mp-mini-popup" role="listbox">
          <li class="is-current"><span class="accent">'전개중'</span>(으)로 변경</li>
          <li>'미전개'(으)로 변경</li>
        </ul>
      </span>
    </div>
  </div>

  <div class="mp-stats-right">
    <span class="ts">25.10.24 12:00 업데이트</span>
    <span class="v-divider"></span>
    <button class="download"><svg class="ic ic-download"><use href="#ic-download"/></svg> 전체 엑셀 다운로드</button>
    <span class="v-divider"></span>
    <span class="pager">
      <strong>1</strong> <span class="num-total">/ <span>1</span> 페이지</span>
      <button class="pbtn" disabled><svg class="ic ic-chevronLeft"><use href="#ic-chevronLeft"/></svg></button>
      <button class="pbtn"><svg class="ic ic-chevronRight"><use href="#ic-chevronRight"/></svg></button>
    </span>
    <span class="pgsize-wrap">
      <button class="pgsize"><span>100개씩</span><svg class="ic ic-chevronDown"><use href="#ic-chevronDown"/></svg></button>
      <ul class="pgsize-popup">
        <li aria-selected="true" data-value="100">100개씩</li>
        <li data-value="300">300개씩</li>
        <li data-value="500">500개씩</li>
        <li data-value="1000">1000개씩</li>
      </ul>
    </span>
  </div>
</div>
```

```css
.mp-stats-row { display:flex; align-items:center; gap:28px; padding:12px 0 12px 2px; height:60px; flex-wrap:wrap; }
.mp-stats-left { flex:1; min-width:0; height:36px; display:flex; align-items:center; gap:16px; }
.mp-stats-counts-wrap { display:flex; align-items:center; gap:4px; }
.mp-stats-counts { display:flex; align-items:center; gap:16px; }
.mp-stats-mini-actions { display:flex; align-items:center; gap:8px; }

.mp-stat { display:inline-flex; align-items:center; gap:4px; height:36px; padding:8px; font-size:15px; line-height:20.4px; color:#000; }
.mp-stat--all { padding:8px 8px 8px 0; }
.mp-stat .label { font-weight:500; }
.mp-stat .num { font-weight:600; }
.mp-stat--deployed   .num { color:#245EFF; }
.mp-stat--undeployed .num { color:#666; }
.mp-stat svg.ic { width:20px; height:20px; }
.mp-stat-divider { width:3px; height:3px; border-radius:50%; background:#CCCCCC; }

.v-divider { width:1px; height:16px; background:#EBEBEB; }

/* 미니 액션 */
.mp-mini-action { display:inline-flex; align-items:center; gap:2px; height:36px; min-width:48px; padding:8px 12px; font-size:14px; font-weight:500; border:1px solid #E0E0E0; border-radius:4px; background:#fff; color:#000; cursor:pointer; }
.mp-mini-action svg { width:16px; height:16px; }
.mp-mini-action[disabled] { background:rgba(138,138,138,0.10); border-color:#EBEBEB; color:rgba(0,0,0,0.20); cursor:not-allowed; }

/* 미니 액션 드롭다운 */
.mp-mini-wrap { position:relative; }
.mp-mini-popup { position:absolute; top:calc(100% + 4px); left:0; background:#fff; border:1px solid #E0E0E0; border-radius:4px; box-shadow:0 8px 24px rgba(0,0,0,.12); list-style:none; margin:0; padding:4px 0; min-width:180px; display:none; z-index:30; }
.mp-mini-popup.is-open { display:block; }
.mp-mini-popup li { padding:8px 14px; font-size:13px; cursor:pointer; }
.mp-mini-popup li:hover { background:var(--color-bg-low); }
.mp-mini-popup li.is-current { color:#245EFF; font-weight:700; }

/* 우측 툴바 */
.mp-stats-right { margin-left:auto; display:flex; align-items:center; gap:12px; }
.mp-stats-right .ts { color:#8A8A8A; font-size:15px; font-weight:400; }
.mp-stats-right .download { display:inline-flex; align-items:center; gap:2px; height:36px; min-width:64px; padding:8px 12px; border:1px solid #E0E0E0; border-radius:4px; background:#fff; color:#000; font-size:14px; font-weight:500; cursor:pointer; }
.mp-stats-right .download svg { width:20px; height:20px; }
.mp-stats-right .pager { display:inline-flex; align-items:center; gap:8px; }
.mp-stats-right .pager strong { color:#000; font-size:15px; font-weight:500; }
.mp-stats-right .pager .num-total { color:#666; font-size:15px; font-weight:400; }
.mp-stats-right .pager .pbtn { width:36px; height:36px; padding:8px; border:0; border-radius:4px; background:transparent; cursor:pointer; }
.mp-stats-right .pager .pbtn svg { width:20px; height:20px; }
.mp-stats-right .pager .pbtn:disabled { color:rgba(0,0,0,0.20); cursor:not-allowed; }
.mp-stats-right .pager .pbtn:disabled svg { stroke-width:2; }
.mp-stats-right .pgsize { display:inline-flex; align-items:center; justify-content:space-between; width:114px; padding:8px 12px; border:1px solid #E0E0E0; border-radius:4px; background:#fff; font-size:14px; cursor:pointer; }
.mp-stats-right .pgsize svg { width:20px; height:20px; }
```

---

## 6. Table

```html
<div class="mp-table-host">
  <div class="mp-table-scroll">
    <table class="mp-table">
      <thead>
        <tr>
          <th class="cb-header" colspan="2">
            <span class="mp-cb"></span>
            <span class="cb-header-label">전체</span>
          </th>
          <th class="col-auto">대표스타일 <svg class="sort"><use href="#ic-arrowUpDown"/></svg></th>
          <th class="col-auto">컬러 <svg class="sort"><use href="#ic-arrowUpDown"/></svg></th>
          <th class="col-auto">스토어 전개 여부 <svg class="sort"><use href="#ic-arrowUpDown"/></svg></th>
          <th class="col-auto" data-pad="full">사이즈 개별 설정</th>
          <th class="col-large" data-pad="full"><div class="cell-clamp">스타일명</div></th>
          <th class="col-auto">출시연도</th>
          <th class="col-medium"><div class="cell-clamp">시즌</div></th>
          <th class="col-medium"><div class="cell-clamp">카테고리</div></th>
          <th class="col-auto">UID <svg class="sort"><use href="#ic-arrowUpDown"/></svg></th>
          <th class="col-auto">SKU번호</th>
          <th class="col-auto">바코드</th>
          <th class="col-auto" data-pad="full">스타일넘버</th>
          <th class="col-auto">처리일시</th>
          <th class="col-auto">처리자</th>
          <th class="col-spacer" aria-hidden="true"></th>
        </tr>
      </thead>
      <tbody>
        <!-- group=true 행: cb-col 에 체크박스 보임 -->
        <tr data-group="true">
          <td class="cb-col"><span class="mp-cb"></span></td>
          <td class="cb-col2"><span class="mp-cb"></span></td>
          <td class="col-auto mp-rep">MMJTS6Z19</td>
          <td class="col-auto"><span class="mp-color-chip">미디엄 인디고</span></td>
          <td class="col-auto">
            <div class="mp-deploy is-deployed">
              <span class="pill"><span class="dot"></span>전개중</span>
              <button class="chev-btn"><svg class="ic ic-chevronDown"><use href="#ic-chevronDown"/></svg></button>
            </div>
          </td>
          <td class="col-auto">
            <button class="mp-sizeset">전개 <span class="num"><em>5</em><span class="divider">/</span><span class="total">9</span></span></button>
          </td>
          <td class="col-large"><div class="cell-clamp">[시티 레저] 벨티드 데님 파라슈트 팬츠</div></td>
          <td class="col-auto">2023</td>
          <td class="col-auto"><div class="mp-season"><span class="tag">26-SS</span><span class="tag">26-FW</span></div></td>
          <td class="col-medium"><div class="cell-clamp">상의 &gt; 니트/스웨터 &gt; 크루넥 니트</div></td>
          <td class="col-auto"><a class="mp-link mp-uid-trigger">383827</a></td>
          <td class="col-auto"><a class="mp-link mp-code-trigger" data-code-type="sku">S000001 외 6</a></td>
          <td class="col-auto"><a class="mp-link mp-code-trigger" data-code-type="barcode">881K/13029/EFGH 외 6</a></td>
          <td class="col-auto"><a class="mp-link mp-code-trigger" data-code-type="styleNo">MMJTS6Z19-BK 외 6</a></td>
          <td class="col-auto">2025.10.01 10:00:00</td>
          <td class="col-auto">juji@musinsa.com</td>
          <td class="col-spacer" aria-hidden="true"></td>
        </tr>
        <!-- group=false 행: cb-col 비어있음 -->
        <tr data-group="false">
          <td class="cb-col"></td>
          <td class="cb-col2"><span class="mp-cb"></span></td>
          <!-- ... 나머지 셀 -->
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### 컬럼 width 토큰

| 클래스        | 동작                            | 사용 |
|---------------|---------------------------------|------|
| `.col-auto`   | 값에 딱 맞춰 shrink (nowrap)     | 대부분의 컬럼 |
| `.col-small`  | min 88, max 160                | 짧은 라벨 |
| `.col-medium` | min 88, **max 260** + wrap      | 카테고리 |
| `.col-large`  | **fixed 360** + wrap             | 스타일명 |
| `.col-spacer` | width 100% (잉여 흡수, padding 0) | 마지막 |
| `.cb-col`     | width 48, padding 16             | 상품 단위 |
| `.cb-col2`    | width 48, padding 16             | SKU 단위 |
| `.cb-header`  | width 96, colspan 2              | 헤더 |

### 표 CSS

```css
.mp-table-host { position:relative; border-top:2px solid #000; min-width:0; max-width:100%; background:#fff; }
.mp-table-scroll { overflow-x:auto; min-width:0; max-width:100%; }
.mp-table { width:100%; border-collapse:separate; border-spacing:0; font-size:13px; color:#000; }

/* HEADER — sticky, h54, 14/500 */
.mp-table thead th {
  position:sticky; top:0; z-index:1;
  background:#fff;
  font-size:14px; font-weight:500; line-height:19.6px; color:#000;
  height:54px; padding:16px 8px 16px 16px; text-align:left;
  border-bottom:1px solid #E0E0E0;
  border-right:1px solid #EBEBEB;
  white-space:nowrap;
}
.mp-table thead th[data-pad="full"] { padding:16px; }  /* 사이즈/스타일명/스타일넘버 */
.mp-table thead th:last-child { border-right:0; }
.mp-table thead th .sort { width:16px; height:16px; color:#CCCCCC; margin-left:4px; vertical-align:middle; }

/* HEADER — cb-header (colspan=2, 전체 라벨) */
.mp-table th.cb-header { width:96px; padding:16px; }
.mp-table th.cb-header .mp-cb { margin-right:8px; }
.mp-table th.cb-header .cb-header-label { font-size:14px; font-weight:500; vertical-align:middle; }

/* BODY — h68 min 60, padding 16, 15/400, 좌측 상단 정렬 */
.mp-table tbody td {
  padding:16px; height:68px; min-height:60px;
  border-top:1px solid #EBEBEB;        /* in-group divider */
  border-right:1px solid #EBEBEB;
  white-space:nowrap; vertical-align:top; text-align:left;
  font-size:15px; font-weight:400; line-height:20.4px; color:#000;
}
.mp-table tbody tr[data-group="true"] td { border-top-color:#E0E0E0; }  /* group divider */
.mp-table tbody tr:first-child td { border-top:0; }                      /* thead 가 담당 */
.mp-table tbody tr:last-child td { border-bottom:1px solid #E0E0E0; }    /* 표 끝 라인 */
.mp-table tbody td:last-child { border-right:0; }
.mp-table tbody tr:hover td { background:#FAFBFC; }

/* cb-col — 그룹 컬럼 시각화: body 내에서는 가로 라인 없음 */
.mp-table tbody td.cb-col { border-top:1px solid #fff !important; }
.mp-table tbody tr[data-group="true"] td.cb-col { border-top-color:#fff !important; }
.mp-table td.cb-col, .mp-table td.cb-col2 { width:48px; padding:16px; }

/* 컬럼 width 토큰 */
.mp-table th.col-auto,   .mp-table td.col-auto   { width:1%; white-space:nowrap; }
.mp-table th.col-small,  .mp-table td.col-small  { width:1%; min-width:88px; }
.mp-table th.col-medium, .mp-table td.col-medium { width:1%; min-width:88px; }
.mp-table th.col-large,  .mp-table td.col-large  { width:360px; min-width:360px; max-width:360px; }
.mp-table th.col-spacer, .mp-table td.col-spacer { width:100%; padding:0; }

/* Inner clamp — 셀 폭 강제 */
.mp-table .col-medium > .cell-clamp { display:block; max-width:260px; word-break:keep-all; line-height:1.4; }
.mp-table .col-large  > .cell-clamp { display:block; max-width:360px; word-break:keep-all; line-height:1.4; }
```

### 셀 컴포넌트

```css
/* 대표스타일 — 굵게 */
.mp-rep { font-weight:500; color:#000; }

/* 컬러 chip / 시즌 태그 — 동일 스타일 */
.mp-color-chip,
.mp-season .tag {
  display:inline-flex; align-items:center; height:28px; padding:0 8px;
  background:rgba(0,0,0,0.05); border-radius:4px;
  font-size:14px; font-weight:500; line-height:19.6px; color:#000;
}
.mp-season { display:inline-flex; gap:4px; }

/* 전개 pill + chev split */
.mp-deploy { display:flex; align-items:center; justify-content:space-between; gap:4px; width:100%; }
.mp-deploy .pill { display:inline-flex; align-items:center; gap:6px; height:28px; padding:4px 8px; border-radius:4px; font-size:14px; font-weight:500; line-height:19.6px; }
.mp-deploy .pill .dot { width:8px; height:8px; border-radius:50%; }
.mp-deploy.is-deployed   .pill { background:#E2F1FF; color:#245EFF; }
.mp-deploy.is-deployed   .pill .dot { background:#245EFF; }
.mp-deploy.is-undeployed .pill { background:rgba(138,138,138,0.10); color:#666; }
.mp-deploy.is-undeployed .pill .dot { background:#999; }
.mp-deploy.is-partial    .pill { background:#FEF3E2; color:#B7791F; }
.mp-deploy.is-partial    .pill .dot { background:#D97706; }
.mp-deploy .chev-btn { width:20px; height:20px; border:0; background:transparent; color:#8A8A8A; cursor:pointer; padding:0; }

/* 사이즈 button (전개 X/Y) */
.mp-sizeset { display:inline-flex; align-items:center; gap:4px; height:36px; min-width:64px; padding:8px 12px; border:1px solid #E0E0E0; border-radius:4px; background:#fff; font-size:14px; font-weight:500; line-height:19.6px; color:#000; cursor:pointer; }
.mp-sizeset .num { display:inline-flex; align-items:center; gap:2px; }
.mp-sizeset .num em       { color:#245EFF; font-style:normal; font-weight:600; }
.mp-sizeset .num .divider { color:#666; font-weight:400; }
.mp-sizeset .num .total   { color:#666; font-weight:400; }

/* 링크 셀 (UID / SKU / 바코드 / 스타일넘버) */
.mp-link { color:#000; text-decoration:underline; cursor:pointer; font-size:15px; font-weight:400; }

/* 체크박스 16×16 */
.mp-cb { display:inline-block; width:16px; height:16px; border:1px solid #CCCCCC; border-radius:2px; background:#fff; cursor:pointer; vertical-align:middle; box-sizing:border-box; }
.mp-cb[aria-checked="true"] { background:#245EFF; border-color:#245EFF; position:relative; }
.mp-cb[aria-checked="true"]::after { content:""; position:absolute; left:4px; top:1px; width:5px; height:9px; border:solid #fff; border-width:0 2px 2px 0; transform:rotate(45deg); }
```

---

## 7. 토스트 / 모달 / 팝오버 (재사용 패턴)

### Toast (snackBar)

```js
function showToast({ variant='info', title, desc, duration=3000 }) {
  // success(초록 ✓) / info(파란 ✓) / critical(빨간 ⚠)
}
```

위치: 하단 중앙, 검정 #1A1A1A bg, 화이트 텍스트, 좌측 컬러 아이콘, 우측 X 닫기.

### Code Verification Popover

UID/SKU번호/바코드/스타일넘버 셀 링크 클릭 → 묶인 코드 목록 popover.

```html
<!-- 셀 안 -->
<a class="mp-link mp-code-trigger" data-code-type="sku">S000001 외 6</a>

<!-- 페이지 한 곳에 -->
<div class="mp-code-popover" id="mp-code-popover">
  <h4 id="mp-code-title">SKU번호 확인</h4>
  <ul id="mp-code-list"></ul>
  <div class="actions">
    <button id="mp-code-copy">SKU번호 복사 (N)</button>
    <button class="primary" id="mp-code-close">닫기</button>
  </div>
</div>
```

복사 버튼 → 클립보드 복사 + info 토스트. Esc / 외부클릭 / 닫기로 종료.

### Confirmation Modal

단건/일괄 변경 확인.

```js
openConfirmModal({
  title: 'n건 스토어 전개 여부 변경',
  descHtml: `선택하신 상품의 스토어 전개 여부를 <strong class="accent">'전개중'</strong>(으)로 일괄 변경합니다.<br/>계속 진행하시겠습니까?`,
  confirmLabel: '변경',
  onConfirm: () => { /* API call */ showToast({variant:'success', ...}); }
});
```

---

## 8. 페이지네이션 동작

```js
const state = { page: 1, pageSize: 100 };

function applyFilters() {
  const filtered = ROWS.filter(/* ... */);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / state.pageSize));
  if (state.page > totalPages) state.page = 1;
  const start = (state.page - 1) * state.pageSize;
  const pageRows = filtered.slice(start, start + state.pageSize);

  // 렌더 + 페이지 인디케이터 + ‹/› disabled 동기화
  prevBtn.disabled = state.page <= 1;
  nextBtn.disabled = state.page >= totalPages;
}

// 페이지 사이즈 변경 → page 1로 리셋
pgsizeOption.click → state.pageSize = 100|300|500|1000; state.page = 1; applyFilters();
```

---

## 9. 새 데이터 리스트 페이지 만들 때 — 체크리스트

- [ ] **App shell**: body min-width 1440, `.app` grid `56px minmax(0,1fr)`, `.app > * { min-width:0 }`
- [ ] **Topbar**: 64h sticky, 햄버거 + 로고 + 사용자
- [ ] **LNB**: 56w sticky from top:64, 3px active indicator + 48×48 button
- [ ] **PBOAssets icons**: SVG sprite + `<use href>` 패턴 (유니코드 ▾ 금지)
- [ ] **모든 버튼 radius 4**
- [ ] **페이지 헤더**: 26/600 타이틀 + outlined 검정 보더 액션 버튼
- [ ] **필터**: floating label, 필수 = 파란 4×4 점, focus 만 보더 검정
- [ ] **통계바**: 중첩 flex 구조 (counts 16, counts/v-divider 4, mini-actions 8, 좌우 28)
- [ ] **테이블**: 상단 굵은 검정 라인, 행 h68 padding 16, 15/400, group/in-group 디바이더 색 분리(#E0E0E0/#EBEBEB)
- [ ] **컬럼 width**: Auto/Medium/Large/Spacer + cell-clamp inner div
- [ ] **셀 정렬**: 좌측 상단 (숫자는 우측 상단 `.cell-numeric`)
- [ ] **그룹 시각화**: `data-group="true"` 행에서 cb-col 체크박스 표시 + 그룹 경계 진한 라인
- [ ] **인라인 셀**: 컬러 chip / 전개 pill+chev / 사이즈 button / 링크
- [ ] **토스트**: success/info/critical 3 variant
- [ ] **모달/팝오버**: confirmModal, codePopover 패턴 재사용
- [ ] **페이지네이션**: 양 끝 disabled, 사이즈 변경 시 page 1 리셋

---

## 10. 폴더 구조 권장

```
project/
├ design-system/             # ⬅ 본 폴더 (디자인 시스템)
│   ├ docs/
│   │   ├ dev-handoff.md     # 이 문서
│   │   ├ data-list-page.md
│   │   ├ table-columns.md
│   │   ├ icons.md
│   │   ├ breakpoints.md
│   │   └ tokens.md
│   ├ components/            # React 컴포넌트
│   ├ layer-desktop.css      # 전체 토큰 + 컴포넌트 CSS
│   └ README.md
│
├ scm hub/                   # 무탠 / 매장 등 SCM Hub 제품
│   ├ index.html             # 무탠 전개상품 관리 (참고용 정상 동작 데모)
│   ├ sku-management.html    # SKU 관리
│   └ icons/basic/*.svg      # PBOAssets 아이콘
│
└ ...
```

새 화면 만들 때:
1. `scm hub/index.html` 을 템플릿으로 복사
2. 페이지 타이틀, 필터, 컬럼만 교체
3. 데이터 fetch 부분만 백엔드 API 로 바꿔치기

→ 새 화면 = 1~2시간 안에 픽셀 정합 + 기능 완성.
