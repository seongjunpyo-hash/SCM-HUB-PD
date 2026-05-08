# 컨벤션 가이드

> **이 문서를 따르면**: 토큰/컴포넌트를 추가/수정할 때 어디에 무엇을 어떤 이름으로 써야 하는지 헷갈리지 않게 됩니다.

---

## 1. 토큰 3계층 (Primitive → Semantic → Component)

| 계층 | 목적 | 예시 |
|---|---|---|
| **Primitive** | 절대 값. 색상의 raw scale, 픽셀 값. **컴포넌트 코드에서 직접 참조 금지**. | `gray-300`, `blue-500`, `12px` |
| **Semantic** | 의미. 페이지 단위에서 폭넓게 쓰임. | `fg-default`, `bg-accent`, `border-critical` |
| **Component** | 특정 컴포넌트의 특정 상태값. 다른 컴포넌트에서 빌려 쓰지 않음. | `btn-primary-bg-hover`, `tf-border-critical` |

**판단 트리**:

```
새 색/값을 어디에 추가하지?

  ┌─ "이 값을 다른 페이지에서도 같은 의미로 쓸 거다"
  │     → Semantic (예: bg-success-low)
  │
  ├─ "특정 컴포넌트의 특정 상태에서만 쓰는 값이다"
  │     → Component (예: drawer-overlay-bg)
  │
  └─ "팔레트 자체를 늘리는 거다"
        → Primitive 부터 추가, 그 다음 Semantic alias 만들기
```

---

## 2. 네이밍 규칙

### CSS 변수
- 모든 변수는 `--ld-` prefix
- kebab-case: `--ld-btn-primary-bg-hover`
- 계층 구분: `--ld-{component}-{variant}-{property}-{state}`

### CSS 클래스
- prefix `ld-`
- 컴포넌트: `.ld-{component}` (예: `.ld-btn`, `.ld-tf`, `.ld-modal`)
- variant: `.ld-{component}-{variant}` (예: `.ld-btn-primary`)
- size: `.ld-{component}-{size}` (예: `.ld-btn-md`)
- state: pseudo-class 또는 `[aria-*]` (예: `.ld-tf[aria-invalid="true"]`)

### JS 토큰 (layer-desktop-tokens.js)
- camelCase로 통일하는 것이 목표. **현재 mixed 상태**:
  - `bgLight`, `borderLight` ✅ camelCase
  - `'alpha-500-10'`, `'500-15'` ❌ 따옴표 + kebab
- 신규 추가는 **camelCase + 평면화** (`alpha500_10` 또는 `alpha500by10` 같은 식보다 의미 단어 우선)

### React 컴포넌트 props
- `variant` — 의미적 종류 (primary / accent / critical / success ...)
- `size` — 크기. **표준: `xs | sm | md | lg | xl`** (단일자 `s/m/l` 금지)
- `appearance` — 시각적 외형 (filled / outlined / ghost)
- `invalid: boolean` 또는 `validation: 'error' | 'success' | 'warning'`
- 레이아웃 prop: `fullWidth`, `placement`
- 상태 prop: `disabled`, `loading`, `open`
- 콜백: `onChange`, `onClick`, `onClose`, `onSelect`
- 모든 컴포넌트는 `className`, `...rest` 전파

> ⚠ **현재 일관성 이슈** — Tab(`s/m/l`), StatusTag(`xs/s/m`), IconButton(`xxs/xs/s/m/l/xl`)은 표준에서 벗어나 있음.
> `docs/consistency-audit.md` 참고.

---

## 3. 토큰 변경 워크플로

토큰 값을 바꾸려면 **반드시 4곳을 모두 수정** 합니다 (현재 수동 동기화):

1. `layer-desktop-tokens.json` — DTCG 형태 (의미 단위)
2. `layer-desktop-tokens.js` — JS export
3. `layer-desktop.css` — `--ld-*` CSS 변수
4. `tailwind-preset.js` — Tailwind theme 매핑 (필요한 경우)

> **권장**: `style-dictionary` 또는 `cobalt-ui`를 도입해 JSON → JS/CSS/Tailwind 자동 빌드하면 1곳만 수정하면 됩니다.

---

## 4. 컴포넌트 변경 워크플로

새 컴포넌트 추가 또는 기존 컴포넌트의 새 variant 추가 시:

1. **Figma 검증** — Figma 노드 ID를 컴포넌트 JSDoc 헤더에 기록
2. **CSS recipe 작성** — `layer-desktop.css` §11에 `.ld-{component}-*` 추가
3. **Component token 정의** — 필요한 새 색/사이즈는 §9에 `--ld-{component}-*` 추가
4. **JSON / JS 토큰 반영** — 위 §9에 추가한 token을 `tokens.json` + `tokens.js`에도 추가
5. **React 컴포넌트 작성** — `components/{Name}.jsx`
6. **Barrel export** — `components/index.js`에 한 줄 추가
7. **데모 추가** — `index.html`에 `<section>` 추가
8. **문서 업데이트** — `docs/components.md`의 props 표와 README 컴포넌트 인덱스에 추가

---

## 5. 코딩 스타일

### React 컴포넌트
- 함수 컴포넌트 + named export
- props는 destructuring으로 받고, 기본값을 인자에서 지정
- `useEffect`는 `if (!open) return;` 같은 early return 우선
- 외부 라이브러리 의존 최소화 (현재: React만 사용)

### CSS
- 컴포넌트 recipe는 `.ld-{component}` 베이스 + 변형 modifier 패턴
- transition은 짧게: `0.12s ease`가 표준
- `:focus-visible`로 outline (focus link)
- disabled 상태는 `:disabled, [disabled]` 모두 처리

### JSDoc 헤더 (모든 컴포넌트 파일 상단)
```js
/**
 * Layer Desktop — {ComponentName}
 * --------------------------------------------------------------
 * Figma node: {nodeId}
 *
 * variant: {a} | {b} | ...
 * size:    {a} | {b} | ...
 *
 * Usage:
 *   <ComponentName ... />
 */
```

---

## 6. 접근성 (Accessibility)

- **모든 인터랙티브 요소**: `aria-label` 또는 visible label
- **invalid 상태**: `aria-invalid="true"` (visual style은 attribute selector로)
- **modal/drawer**: `role="dialog"`, `aria-modal="true"`, focus trap, ESC로 닫기
- **tooltip**: `role="tooltip"` + `aria-describedby` 연결
- **focus outline**: 절대 `outline: none`만 두지 말 것. `var(--ld-focus-outline)` 사용

---

## 7. 버전 정책

- **Patch (2.17.x)** — 버그 수정, 토큰 값 미세 조정 (의미 변경 없음)
- **Minor (2.x.0)** — 신규 컴포넌트, 신규 variant, 호환되는 props 추가
- **Major (x.0.0)** — props/variant 이름 변경, 토큰 키 rename, breaking layout

---

## 8. 자주 묻는 질문

**Q. 새로운 색을 컴포넌트에 추가하고 싶은데, primitive에 없어요.**
A. 우선 디자이너와 합의해 primitive scale에 추가합니다. 단발성 hex는 component 토큰에 직접 박지 마세요. (현재 `tag.color.gray.fg = "#7e7e7e"` 같은 사례가 있는데 정리 대상입니다.)

**Q. 컴포넌트 안에서 다른 컴포넌트의 token을 써도 되나요?**
A. 안 됩니다. 그 값이 정말 공유되어야 한다면 semantic으로 승격하세요.

**Q. JS 토큰과 CSS 변수 중 어디서 가져와야 하나요?**
A. React/JS 코드는 className(`ld-*`) 사용을 우선합니다. 인라인 style이 꼭 필요하면 CSS 변수(`var(--ld-*)`)를 사용하세요. JS 토큰 객체는 동적 계산이 필요할 때만 씁니다.

**Q. Tailwind preset과 raw `--ld-*` 변수를 섞어 써도 되나요?**
A. 한 프로젝트 내에선 하나만 골라 쓰는 걸 권장합니다. 섞일 경우 디자인 디버깅이 어려워집니다.
