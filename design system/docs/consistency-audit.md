# 일관성 감사 (Consistency Audit)

> 2026-04-29 기준. 코드는 그대로 두고 **발견된 차이점만** 정리한 문서입니다.
> 수정 권장안은 각 항목의 **Recommend** 블록에 있습니다.
> 우선순위: 🔴 critical · 🟡 warning · 🟢 nice-to-have

---

## A. `size` prop 네이밍 불일치 🔴

| 컴포넌트 | 현재 size 값 | 표준 부합? |
|---|---|---|
| Button | `xs / sm / md / lg / xl` | ✅ 표준 |
| TextField | `sm / md / lg` | ✅ 표준 (subset) |
| Select | `xs / sm / md / lg` | ✅ 표준 (subset) |
| Tabs (Tab) | **`s / m / l`** | ❌ 단일자 |
| StatusTag | **`xs / s / m`** | ❌ 단일자 mix |
| LabelTag | **`xs / s / m`** | ❌ 단일자 mix |
| IconButton | **`xxs / xs / s / m / l / xl`** | ❌ 단일자 mix |
| Drawer (width preset) | **`s / sm / md / l / lg / xl`** | ❌ 단/이중자 alias 혼용 |

**Recommend**:
- 표준 = `xs / sm / md / lg / xl`. 모든 컴포넌트에서 통일.
- Tab은 `sm / md / lg`로, StatusTag/LabelTag/IconButton도 `xs / sm / md`로 통일.
- Drawer의 width preset은 alias를 정리해 `sm / md / lg / xl`만 남기기.
- 마이그레이션은 v3.0.0의 breaking change로 묶어 한 번에 처리하는 것이 안전합니다.

---

## B. Tag variant 네이밍 — JSON ↔ JS ↔ JSX 차이 🔴

| Source | progress 변형 키 |
|---|---|
| `tokens.json` `component.status-tag` | `progress-primary` / `progress-secondary` / `progress-tertiary` |
| `tokens.js` `statusTag` | `progress1` / `progress2` / `progress3` |
| `Tag.jsx` `STATUS_VARIANTS` | `progress1` / `progress2` / `progress3` |
| `layer-desktop.css` 클래스 | `.ld-status-tag-progress-1` / `-2` / `-3` |

**Recommend**: 의미 우선 → `primary / secondary / tertiary` (JSON) 채택, 나머지를 일치시킴.
- JS: `statusTag.progressPrimary` (camelCase)
- JSX prop: `<StatusTag variant="progress-primary">` 또는 `progressPrimary`
- CSS: `.ld-status-tag-progress-primary`

---

## C. 토큰 JS export — JSON과 누락/불일치 🟡

`layer-desktop-tokens.js`가 JSON에 비해 누락한 항목:

### Color · semantic
| 누락 | JSON에 있음 |
|---|---|
| `color.border.low / strong / disabled / neutral` | ✓ |
| `color.border.{success-low / warning-low / critical-low}` | ✓ |
| `color.bg.inset` | ✓ |

### Component tokens
| 컴포넌트 | JS에 누락된 키 |
|---|---|
| `button.primary` | `bgPressed` |
| `button.accent` | `bgPressed`, `bgDisabled`, `bgOutlined`, `bgOutlinedHover`, `bgGhostHover`, `borderDisabled`, `fgDisabled` |
| `button.negative` | `bgPressed`, `bgDisabled`, `bgOutlined`, `bgGhostHover`, `borderDisabled`, `fgDisabled` |
| `button.tertiary` | 전체 누락 |
| `iconButton.size` | 전체 누락 |
| `textButton` | 전체 누락 |
| `textArea` | 전체 누락 |
| `optionList` | 전체 누락 |
| `tab` (line/text/box 상세) | 전체 누락 |
| `tooltip` (container/content/arrow/placement) | variant만 있음 |
| `tableHeader.bgSubtle` | 누락 |
| `pageHeader` (collapsedHeight, title typography, meta typography) | 일부만 |
| `nav` (envBgHover만 있고 envBg는 OK, divider-dark, item-bg-active-dark, icon-button-* 누락) | |
| `drawer` (size, widthMode, slots, header/footer-height, padding 등) | overlayBg만 있음 |
| `thumbnail` | 전체 누락 |
| `switch.{trackHoverChecked, trackCheckedDisabled, thumbCheckedDisabled}` 등 | 일부 누락 |
| `control.{bgCheckedPressed, bgPressed}` | 일부 누락 |

**Recommend**:
- JSON을 source of truth로 삼고, JS는 JSON에서 자동 빌드 (style-dictionary 도입).
- 도입 전이라면 다음 patch에서 위 누락분을 JS에 보강.

---

## D. JS 토큰 네이밍 mixed 🟡

`tokens.js`가 camelCase / kebab quoted를 섞어 씁니다.

```js
// camelCase (다수)
primitive.blue.bgLight
primitive.red.borderLight

// kebab + 따옴표 (소수)
primitive.blue['alpha-500-10']
primitive.grayAlpha['500-15']
primitive.gray['0']  // 숫자키
```

**Recommend**:
- 모두 camelCase로 통일: `alpha500_10` 보다는 의미 단어 사용 (`alphaFaint`, `alphaBold`) 검토.
- 단, 숫자 scale (`gray.500`)은 그대로 두는 것이 합리적.
- 이 변경은 import 코드를 깨므로 v3.0.0 breaking change에 묶기.

---

## E. CSS 모놀리식 파일 (2002줄) 🟢

`layer-desktop.css`에 토큰 + utility + recipes가 모두 들어 있어 파일이 큽니다.

**Recommend** (`STRUCTURE.md` §향후 권장 리팩토링과 동일):
```
styles/
├── tokens.css        (§1–9)
├── base.css          (§10)
└── components.css    (§11)
```
+ `layer-desktop.css`는 위 3종을 `@import` 하는 barrel로 변환 → 외부 link href 그대로 유지.

---

## F. `index.html` 단일 파일 데모 (1736줄) 🟢

모든 컴포넌트 데모가 한 페이지에 있어 탐색 비용이 큽니다.

**Recommend**:
- 컴포넌트별 별도 HTML로 분리: `examples/button.html`, `examples/forms.html`, ...
- 또는 React + Vite로 옮겨 라우팅 기반 살아있는 카탈로그 구축 (Storybook 도입 선택지).

---

## G. 기타 마이크로 이슈 🟢

1. **Tag color 토큰의 raw hex** — `tokens.json`의 `tag.color.gray.fg = "#7e7e7e"`, `tag.color.blue.bg = "#e9efff"` 등 primitive 참조가 아닌 literal hex가 박혀 있음. primitive scale로 정규화 필요.
2. **Drawer `size.fixed` 자기 참조** — `"fixed": "var(--ld-drawer-width-m)"` 형태로, 다른 토큰을 raw CSS string으로 참조 → CSS 모드일 때만 의미가 있어 JS 측에서 혼란.
3. **PageHeader가 default export 단독 사용** — 다른 컴포넌트는 named export만. PageHeader도 named만 노출하도록 통일 권장.
4. **`button.primary.bg-hover` = `rgba(0,0,0,0.8)`** — `gray-alpha.900-80`을 참조해야 하는데 raw rgba. tokens.json 정리 시 reference로 변경.
5. **`tag.removable.bg-filled-hover` = `rgba(138,138,138,0.3)`** — 마찬가지로 `gray-alpha.500-30` 참조로 정규화.
6. **CSS 변수 alias 혼재** — `--ld-bg` (no suffix) 와 `--ld-fg` (no suffix)는 default를 가리키는데, 다른 곳은 `-default` 를 명시. 둘 중 하나로 통일.
7. **icon-button size `xxs/xs`가 모두 16px** — 동일 값이라 두 토큰을 둘 이유가 없음. 디자이너 의도 확인 후 하나 제거 또는 의미 차이 명시.

---

## 권장 마이그레이션 로드맵

| 단계 | 변경 | 영향 | 버전 |
|---|---|---|---|
| 1 | 문서/구조 정리 (이 PR) | 없음 | 2.17.0 |
| 2 | JS 토큰 누락분 보강 (C) | additive only | 2.18.0 |
| 3 | CSS 분할 (E) | barrel 유지로 무영향 | 2.18.0 |
| 4 | tag color literal → primitive 참조 (G.1, G.4, G.5) | 시각적 동일, 토큰 키 동일 | 2.19.0 |
| 5 | size prop 통일 (A) + Tag variant 통일 (B) + JS 토큰 키 camelCase 통일 (D) | breaking | 3.0.0 |
| 6 | example 분할 (F) | 무영향 (디렉토리만) | 3.0.0 |
