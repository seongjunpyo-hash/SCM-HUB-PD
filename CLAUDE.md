# SCM HUB PD — 데모 페이지 아키텍처

이 문서는 `/demo/*.html` 페이지의 공통 셸(GNB / LNB / 공통 스크립트) 아키텍처를 설명한다.
새 페이지를 만들거나 기존 페이지를 수정할 때 참고.

> **🔥 데이터 리스트 페이지 (mp-table 사용 페이지) 를 만들거나 수정할 때**:
> 본 문서의 셸 아키텍처 + **[`design system/docs/data-list-page-gotchas.md`](./design%20system/docs/data-list-page-gotchas.md)**
> 의 공통 패턴/gotcha 를 **모두 적용** 한다.
>
> 2026-05 stock-movement / product-arrival-status 작업에서 확립된 룰 — mp-table column
> class 트랩, 2-row thead 패턴, frozen 컬럼 회피, iss-merged-cell rowspan 대체, drawer 안
> 테이블 sticky thead, cancel/notify 모달, 체크박스 3-state, 한글 wrap, 필터 drawer markup
> 등 모든 데이터 리스트 화면에 공통 적용되는 표준.

## 페이지 구조 (정적 HTML, no SSR)

```
<head>
  <script src="/auth-gate.js"></script>           ← 동기 (인증 게이트)
  <script src="/scm-shell.js" defer></script>    ← 공통 스크립트 일괄 로드
  <link rel="stylesheet" href="../design system/components/.../*.css" /> × N  ← 디자인 시스템 CSS
  <style>...</style>                              ← 페이지 전용 인라인 스타일
</head>
<body>
  <header class="scm-topbar" role="banner"></header>           ← 빈 placeholder (topbar.js 가 inject)
  <div class="app">
    <nav class="scm-lnb" data-active="X" aria-label="주메뉴"></nav>  ← 빈 placeholder (lnb.js 가 inject)
    <main>...page content...</main>
  </div>

  <script src="../design system/components/lnb/lnb.js"></script>
  <script src="../design system/components/topbar/topbar.js"></script>
  <script src="../design system/components/.../*.js"></script> × N

  <script>
  (function () {
    'use strict';
    // SCM.lnb.mount / SCM.topbar.mount → placeholder 안에 canonical 마크업 inject
    if (window.SCM && SCM.lnb)    SCM.lnb.mount(document.querySelector('.scm-lnb'), { active: 'X' });
    if (window.SCM && SCM.topbar) SCM.topbar.mount(document.querySelector('.scm-topbar'));
    // ... 페이지 로직
  })();
  </script>
</body>
```

## 공통 자원 — 단일 source of truth

| 자원 | 위치 | 페이지에서 어떻게 |
|---|---|---|
| 인증 / 라우팅 / 튜토리얼 트리거 / FOUC LNB 복원 | `/auth-gate.js` | `<script src="/auth-gate.js">` (동기) |
| 코멘트 / dev-export / 프로필 메뉴 | `/scm-shell.js` 가 일괄 로드 | `<script src="/scm-shell.js" defer>` (1줄) |
| SVG 심볼 스프라이트 (모든 `<use href="#ic-*">`) | `/scm-icons.js` 가 sprite union 주입 | `<script src="/scm-icons.js">` (body 첫 줄, 동기) |
| LNB 마크업 + 메뉴 데이터 | `lnb.js` 의 `CANONICAL_LNB_HTML` (+ `SCM.lnb.getMenu()` 자동 파싱) | 빈 `<nav class="scm-lnb">` placeholder. `mount()` 가 자동 inject. VOC 도 `SCM.lnb.getMenu()` 로 same source 사용 |
| topbar 마크업 | `topbar.js` 의 `CANONICAL_TOPBAR_HTML` | 빈 `<header class="scm-topbar">` placeholder |
| 공통 sticky 토큰 (`--scm-lnb-width` / `--scm-sticky-gnb`) + body/.app/main shell 룰 | `lnb.css` 상단 `:root` + shell 블록 | `lnb.css` 가 자동 로드되므로 페이지에서 별도 작업 X |

### 새 메뉴 항목 추가 / LNB 위치 변경

`lnb.js` 의 `CANONICAL_LNB_HTML` 한 곳만 수정 → 모든 데모 페이지에 자동 반영.

### 새 공통 스크립트 추가

`scm-shell.js` 의 `SCRIPTS` 배열에 한 줄만 추가 → 모든 데모 페이지에서 로드.

## 흔한 사고 패턴 — 방지

이 아키텍처가 막아주는 사고들:

1. **공통 스크립트 한 줄 빠뜨림** (예: `profile-menu.js` 누락 → 프로필 모달 안 됨)
   - 해결: 모든 페이지가 `scm-shell.js` 한 줄로 일괄 로드.

2. **LNB / topbar 마크업 페이지 간 어긋남** (예: 한 페이지만 OTB 메뉴가 다른 그룹)
   - 해결: 마크업이 `lnb.js` / `topbar.js` 의 단일 상수에서 옴.

3. **VOC 편집모드 hide CSS 가 LNB 메뉴까지 가림**
   - 해결: `dev-export.applyActiveVersionMinimal` 의 hide 룰을 `main` scope 안으로 한정.

## 페이지 추가 체크리스트

새 데모 페이지 만들 때:

- [ ] `<script src="/auth-gate.js"></script>` 동기 로드 (LNB FOUC 복원도 여기서 처리되므로 별도 inline script 불필요)
- [ ] `<script src="/scm-shell.js" defer></script>` 추가
- [ ] design system CSS 중 본인이 쓰는 것만 `<link rel="stylesheet">` (lnb.css 는 필수 — shell 룰 + sticky 토큰 포함)
- [ ] body 시작 직후 `<script src="/scm-icons.js"></script>` (SVG 스프라이트 주입 — `<use href="#ic-*">` 사용 시 필수)
- [ ] body 시작 부분에 `<header class="scm-topbar" role="banner"></header>` placeholder
- [ ] body main 영역 앞에 `<nav class="scm-lnb" data-active="페이지키" aria-label="주메뉴"></nav>` placeholder
- [ ] LNB / topbar mount 호출 **불필요** — `lnb.js` / `topbar.js` 가 DOMContentLoaded 시 자동 mount (data-active 속성에서 active 키 읽음)
- [ ] LNB 에 메뉴 등록 — `lnb.js` 의 `CANONICAL_LNB_HTML` 안 적절한 L1 그룹의 L2 list 에 새 `<a class="scm-lnb-l2" href="새페이지.html" data-key="페이지키">...</a>` 추가
- [ ] VOC 협업 화면에도 노출하려면 `voc/index.html` 의 `MENU` 배열에도 추가
- [ ] `functions/demo/_known-assets.js` 에 새 파일명 추가 (`node scripts/sync-demo-assets.js` 실행)
- [ ] **데이터 리스트 페이지면** [`data-list-page-gotchas.md`](./design%20system/docs/data-list-page-gotchas.md) 의 체크리스트 §12 까지 모두 적용 (mp-table column class / 2-row thead / 체크박스 3-state / cancel·notify 모달 / 한글 wrap / 컬럼 sort·filter·more 아이콘 등)
