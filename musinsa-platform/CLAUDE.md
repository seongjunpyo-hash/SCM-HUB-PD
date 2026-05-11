# musinsa-platform — 플랫폼 전역 아키텍처

이 문서는 platform 전역 규칙. 도메인별 규칙은 `domains/<name>/CLAUDE.md` 참고.

## 핵심 원칙

1. **정적 시스템 — build 없음.** HTML/CSS/JS 파일 그대로 서비스. React/Vue/번들러 도입 금지.
2. **공통 자원은 단일 source of truth.** hub 의 auth-gate / scm-shell / design-system 의 토큰 모두 한 곳.
3. **디자인 시스템은 별 도메인에서 CDN.** `https://ds.musinsa.com` 에서 로드, 모든 도메인이 그 URL 의 CSS/JS 사용.
4. **권한은 서버에서.** Supabase RLS 가 진짜 검증. client `if (role)` 은 UX 용도.
5. **도메인 간 격리.** 한 도메인의 specialized 컴포넌트가 다른 도메인 침범 금지. 공유될 거면 `design-system/core` 로.

## 페이지 구조 (정적 HTML)

```html
<head>
  <script src="/hub/auth-gate.js"></script>           ← 동기 (Supabase 인증 게이트)
  <script src="https://ds.musinsa.com/scm-shell.js" defer></script>
  <link rel="stylesheet" href="https://ds.musinsa.com/layers/<layer>/tokens.css" />
  <link rel="stylesheet" href="https://ds.musinsa.com/core/components/.../*.css" /> × N
  <style>...</style>                                  ← 페이지 전용 인라인
</head>
<body>
  <header class="scm-topbar" role="banner"></header>
  <div class="app">
    <nav class="scm-lnb" data-active="X" aria-label="주메뉴"></nav>
    <main>...page content...</main>
  </div>
  <script src="https://ds.musinsa.com/core/components/.../*.js"></script> × N
</body>
```

## Layer 선택

페이지 `<head>` 에 정확히 1개 layer tokens.css 만 import:

```html
<!-- scm-hub 페이지 -->
<link rel="stylesheet" href="https://ds.musinsa.com/layers/layer/tokens.css" />

<!-- scm-portal / o4o 페이지 -->
<link rel="stylesheet" href="https://ds.musinsa.com/layers/phase/tokens.css" />

<!-- logistics 페이지 -->
<link rel="stylesheet" href="https://ds.musinsa.com/layers/flow/tokens.css" />
```

같은 `scm-button` 마크업이 어느 layer 토큰 import 했냐에 따라 다른 시각.

## 인증 + 권한

### 흐름

1. 페이지 로드 → `auth-gate.js` 가 `supabase.auth.getUser()` 호출
2. 미인증 → `/hub/login.html?next=...` 리다이렉트
3. 인증 → `user_domains` 테이블 조회 → 본인 권한 있는 도메인이면 통과
4. `window.SCM_USER = { id, email, role, domain }` 전역 노출
5. `scm:auth-ready` 이벤트 dispatch

### 역할 체계

| 역할 | 권한 |
|---|---|
| `super` | 모든 도메인 read/write + 관리 |
| `admin` | 본인 도메인 read/write |
| `member` | 본인 도메인 read + 본인 작성 comment write |
| `viewer` | 본인 도메인 read 만 |

## VOC 편집 시스템 (voc-core)

도메인 공통. 페이지의 각 element 에 `data-voc-key` 부여 → 사용자가 라벨/숨김/추가 편집 → `voc_versions` 테이블에 snapshot 저장 → 페이지 로드 시 dev-export 가 적용.

`design-system/core/components/*/[name].html` 의 canonical markers 에 `data-voc-key` 부여 규칙을 박아둘 것 (자동 stamp 또는 수동).

## 흔한 사고 패턴 — 방지

1. **도메인 specialized 가 core 침범** — `domains/<a>/components/` 의 컴포넌트를 다른 도메인이 import. 해결: 공유될 거면 `design-system/core` 로 승격하는 PR.
2. **토큰 우회 — hex 직접 사용** — 컴포넌트 CSS 에 `color: #245EFF` 같이 hex 직접. 해결: 토큰 변수만 (`var(--fg-accent, fallback)`).
3. **layer 토큰을 core 가 import** — `core/components/button/button.css` 가 layer 의 토큰 파일 import. 해결: core 는 CSS variable 만 사용, 정의는 layer 가 페이지에서 선언.
4. **인증 client-side only** — `if (role === 'admin')` 만으로 권한 제어. 해결: Supabase RLS 정책으로 server-enforce.
5. **VOC 데이터를 localStorage** — SCM-HUB-PD 초기 패턴. 해결: 모두 Supabase 테이블.

## 도메인 추가 체크리스트

새 도메인 만들 때:

- [ ] `domains/<name>/` 디렉토리 생성 + 자체 `CLAUDE.md` (도메인 한정 원칙)
- [ ] `supabase/migrations/` 에 `insert into domains values ('<name>', ..., '<layer>');` 추가
- [ ] `hub/index.html` 의 도메인 카드 목록에 추가
- [ ] 사용할 layer 결정 — 기존 (layer/phase/flow) 중 또는 신규
- [ ] 첫 페이지 1개 작성 (`legacy/<name>/` 의 fixture 참고)
- [ ] `auth-gate.js` 의 path prefix 권한 규칙에 도메인 추가
- [ ] CI deploy 확인

## 페이지 추가 체크리스트 (도메인 내)

- [ ] `<script src="/hub/auth-gate.js"></script>` 동기
- [ ] layer tokens.css link
- [ ] `<header class="scm-topbar">` placeholder
- [ ] `<nav class="scm-lnb" data-active="...">` placeholder
- [ ] `core/components/...` 중 사용할 것만 CSS/JS import
- [ ] LNB 메뉴 등록 (해당 도메인의 lnb.js 의 메뉴 데이터 수정)
- [ ] 권한 필요 시 ROLE_RULES 에 path 추가
