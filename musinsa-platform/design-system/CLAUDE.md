# design-system — 컴포넌트 작성 규칙

이 문서는 `design-system/core/components/*` 의 컴포넌트 작성 원칙. layer 토큰 작성은 `layers/*/tokens.css` 의 상단 주석 참고.

## 파일 구조

각 컴포넌트는 디렉토리 + 3 파일:

```
core/components/<name>/
├── <name>.css     — 스타일 (BEM, 토큰 변수만 사용, hex 금지)
├── <name>.html    — canonical markers (페이지에 복사해서 쓸 정답 마크업)
└── <name>.js      — SCM.<name>.mount(el, opts) 패턴 (선택적)
```

## 작성 규칙

1. **BEM 네이밍**: `.scm-<name>`, `.scm-<name>__<part>`, `.scm-<name>--<variant>`
2. **토큰 변수만**: `color: var(--fg-accent, #245EFF)` (fallback 으로 hex). 컴포넌트 CSS 에 raw hex 직접 사용 금지 — 단, 토큰 정의 (`layers/*/tokens.css`) 안에서만 허용.
3. **No build**: vanilla CSS/JS. 전처리기/번들러 사용 금지.
4. **canonical markers**: `<name>.html` 에 가능한 모든 variant × state 의 마크업을 카탈로그 형태로. 페이지에서 복사 + 붙여넣기 그대로 동작 가능해야.
5. **JS helper 선택적**: 행동 없는 컴포넌트 (Tag, Typography 등) 는 .js 생략 OK. 행동 있는 컴포넌트 (Button, Toggle 등) 는 `SCM.<name>.mount(el, opts)` 시그니처.
6. **상태는 attribute / class**: `aria-checked`, `aria-disabled`, `data-state`, `.is-active`. JS 가 상태 추적 안 함 (DOM 이 진실).

## Conductor 통합

각 컴포넌트의 root element 는 page-head 등 *반복 단위* 가 아닌 한 `data-conductor-key` 부여 가능해야 한다. Conductor 의 dev-export 가 `data-conductor-key` 를 hook 으로 사용.

`<name>.html` 의 canonical markers 에 `data-conductor-key="..."` 를 직접 박지는 말 것 — 페이지에서 자동 stamp 또는 manual 부여.

## Layer 시스템

```
core/components/button/button.css       ← color: var(--button-primary-bg, #000);
                                          (raw hex 는 fallback 만)
layers/layer/tokens.css                 ← --button-primary-bg: #242424;
layers/phase/tokens.css                 ← --button-primary-bg: #1A1A1A;
layers/flow/tokens.css                  ← --button-primary-bg: #0070F3;
```

페이지가 어떤 layer tokens.css 를 import 하느냐에 따라 동일 button 이 다른 색.

## 새 컴포넌트 추가 체크리스트

- [ ] `core/components/<name>/` 디렉토리 + 3 파일 생성
- [ ] BEM 네이밍 일관성 확인
- [ ] 사용한 토큰 변수가 모든 layer (layer/phase/flow) tokens.css 에 정의돼 있는지
- [ ] 카탈로그 페이지 (TBD) 에 자동 노출 확인
- [ ] 도메인 1개 이상에서 실사용 PoC

## 흔한 사고 패턴 — 방지

1. **layer 토큰을 컴포넌트가 직접 import** — `button.css` 가 `@import 'layers/layer/tokens.css'`. 해결: 페이지에서 import, 컴포넌트는 변수만 참조.
2. **fallback 없는 var()** — `color: var(--fg-accent)` (fallback 없음). layer 미import 시 무색. 해결: 항상 fallback 박기.
3. **specialized 컴포넌트가 core 에** — 특정 도메인만 쓰는 컴포넌트가 `core/` 에 들어옴. 해결: `domains/<name>/components/` 로.
