# SCM Hub — Component Contracts

Contract-driven 디자인 시스템. JSON contract 가 single source of truth — Figma 변수, 컴포넌트 set, CSS, 가이드 문서 모두 contract 에서 파생됩니다.

기반: [nvillapiano/component-contracts-figma](https://github.com/nvillapiano/component-contracts-figma) (skill + W3C DTCG 토큰 컨벤션 차용)

---

## 디렉토리

```
component-contracts/
├── tokens/
│   ├── primitive/                # 원시 값 (별칭 없음, 단일 모드 'Value')
│   │   ├── color.tokens.json     # gray / blue / red / yellow / green / cyan / purple
│   │   ├── space.tokens.json     # space/50, /100, ... /2400
│   │   ├── shape.tokens.json     # radius/none, sm, md, lg, xl, full
│   │   ├── typography.tokens.json # fontFamily / fontWeight / fontSize / lineHeight
│   │   └── motion.tokens.json    # duration / easing
│   └── semantic/
│       └── semantic.tokens.json  # fg.* / bg.* / border.* / divider.* / focus.*
│                                 # 모든 값은 primitive 의 alias ({color.gray.900} 등)
├── contracts/
│   ├── button.contract.json      # SCM Action button (h36/h40/h44, 4 variant)
│   ├── filter-field.contract.json # 통합 필터칩 (single/multi/codeinput)
│   └── modal.contract.json       # confirm + info modal + callout
├── schema/
│   └── schema.json               # contract JSON Schema
├── .component-contracts.example  # 환경 설정 템플릿 (FIGMA_ACCESS_TOKEN 등)
└── .gitignore                    # .component-contracts 제외
```

---

## 사용 흐름

### 0) 환경 설정

```bash
cp .component-contracts.example .component-contracts
# Figma Personal Access Token 과 FILE_KEY 채우기
```

### 1) 토큰 → Figma 변수 컬렉션

Figma MCP 가 활성화된 환경(Cursor + Composer 2 / Claude with figma-use skill) 에서:

```
Read .component-contracts. Load cc-figma-tokens, figma-use, figma-generate-library skills.
Build Primitive + Semantic variable collections from ./tokens/.
```

→ Figma 파일에 두 변수 컬렉션 생성:
- `Primitives` (color/gray/0..900, space/50..2400, radius/none..full, fontSize/75..1300, fontWeight/regular..bold, lineHeight/100..150, duration/fast..slow)
- `Semantic` (fg.default / bg.low / border.accent / focus.outline ... 모두 Primitives 의 alias)

### 2) Contract → Figma 컴포넌트 셋

```
Read .component-contracts. Load cc-figma-component, cc-figma-tokens, figma-use, figma-generate-library skills.
The Primitive/Semantic collections already exist — do not recreate.
Build the Button Figma component set from contracts/button.contract.json.
```

→ variant 별 인스턴스 + 모든 fill/stroke/spacing 이 Semantic 변수로 자동 바인딩.

---

## SCM Hub 의 토큰 계층

### Primitive — `tokens/primitive/`

기존 `layer-desktop-tokens.json` 의 `primitive.color`, `radius`, `spacing`, `typography` 를 **W3C DTCG 포맷**(`$value` / `$type`) 으로 분리 변환한 결과입니다.

- `color.gray.0..900` (10단계) + gray-alpha (rgba)
- `color.blue.500` 등 brand color + alpha
- `color.red / yellow / green / cyan / purple / neutral` (status / category color)
- `space.50` (2px) ~ `space.2400` (96px)
- `radius.xxs..full`
- `fontSize.75..1300`, `fontWeight.regular..bold`, `lineHeight.100..150`
- `fontFamily.base` (Pretendard Variable)
- `duration.fast..slow` (모션 — 신규 추가)

### Semantic — `tokens/semantic/semantic.tokens.json`

`fg`, `bg`, `border`, `divider`, `focus` 의 의미 기반 alias. 컴포넌트는 **반드시** semantic 만 참조 (primitive 직접 참조 금지).

```jsonc
"fg": {
  "default":  { "$value": "{color.gray.900}", "$type": "color" },
  "accent":   { "$value": "{color.blue.500}", "$type": "color" },
  ...
},
"bg": {
  "default":         { "$value": "{color.gray.0}",   "$type": "color" },
  "accent-low":      { "$value": "{color.blue.alpha-500-10}", "$type": "color" },
  "critical-bright": { "$value": "{color.red.bg-light}", "$type": "color" },
  ...
}
```

---

## 작성한 contract 3종 — 무엇을 알 수 있나

| Contract | Variant | 핵심 prop | tokens 그룹 |
|----------|---------|-----------|-------------|
| `button` | primary / secondary / ghost / critical × sm/md/lg | `variant`, `size`, `iconStart`, `iconEnd`, `iconOnly`, `loading` | color, typography, spacing, border, motion |
| `filter-field` | single / multi / codeinput × empty/filled/open/disabled | `mode`, `value`, `options`, `applyOnSelect` | color, typography, spacing, border, motion |
| `modal` | confirm / info × default/destructive/with-callout | `mode`, `title`, `descHtml`, `callout`, `hideCancel` | color, typography, spacing, border, size, motion |

각 contract 는:
- `tokens` — semantic 토큰 매핑 (variant 별 자동 적용)
- `props` — 외부 인터페이스 (TS 타입과 동등)
- `states` — Figma component property 의 enum 변환 베이스
- `variants` — Figma variant 인스턴스 시드
- `composition.slots` — Figma node tree 의 의미 매핑 (textProp / booleanProp / instanceVariant 와의 연결)
- `behavior` + `accessibility` + `usage` — 가이드 문서 자동 생성용

---

## 다음 단계 (남은 컴포넌트)

이미 layer-desktop.css 에 정의된 컴포넌트들 — contract 화 우선순위:

1. **Table** (mp-table — sticky thead, frozen columns, cell selection)
2. **StatsBar** (mp-stats-row — count + actions + page-size)
3. **Toast** (toast-stack — variant=success/error/info, slide-in/out)
4. **InfoBanner** (mp-info-banner — collapsible, gray tone)
5. **DataListPage** (composite: page-head + filter-bar + stats + table)

각각 `contracts/<name>.contract.json` 추가하고 `schema/schema.json` 으로 검증.

---

## 마이그레이션 노트

기존 `layer-desktop-tokens.json` 은 **유지** (CSS 변수 / Tailwind preset 빌드 입력으로 계속 사용). component-contracts 는 그 위의 추상층 — Figma 와의 sync, 새 컴포넌트 생성 워크플로우, contract 기반 가이드 문서 자동화에 활용.

기존 / 새 시스템 매핑:
- `primitive.color.gray.900` → `{color.gray.900}` (DTCG)
- `semantic.fg.default` → `{fg.default}`
- 참조 표기: `{primitive.color.X}` 가 아닌 `{color.X}` (DTCG 표준).
