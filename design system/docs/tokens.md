# 디자인 토큰 레퍼런스

> 이 문서는 `layer-desktop-tokens.json` (source of truth) 기준의 사람이 읽기 쉬운 레퍼런스입니다.
> 새 토큰을 추가하거나 값을 바꿀 때는 [`../CONVENTIONS.md`](../CONVENTIONS.md) §3 워크플로 참고.

## 계층 구조

```
primitive  ─→  semantic  ─→  component
  (값)         (의미)         (사용처)
```

---

## 1. Primitive

### Color · Gray scale (10단계)
| Token | Hex | 용도 |
|---|---|---|
| `gray.0`   | `#ffffff` | 페이지 배경 / 카드 배경 |
| `gray.100` | `#f5f5f5` | secondary 버튼 bg, hover bg |
| `gray.200` | `#ebebeb` | divider, border-low |
| `gray.300` | `#e0e0e0` | input border (default) |
| `gray.400` | `#cccccc` | switch track, placeholder |
| `gray.500` | `#8a8a8a` | fg-lower, icon-button-fg |
| `gray.600` | `#666666` | fg-low (보조 텍스트) |
| `gray.700` | `#616161` | (예약) |
| `gray.800` | `#1a1a1a` | fg-neutral, tooltip-black bg |
| `gray.900` | `#000000` | fg-default |

### Color · Gray Alpha
- `900-20/40/60/80` — overlay, disabled fg
- `500-5/10/15/20/30` — subtle hover/pressed bg
- `0-10/15/20` — dark theme의 light overlay

### Color · Brand Hue (각 hue마다 동일 패턴)
| Hue | 주요 값 | 용도 |
|---|---|---|
| **Blue (Accent)** | 100/200/300/**400/500** + bgLight + alpha | Primary action, link, focus |
| **Red (Critical)** | 400/**500**/600 + bright + bgLight/bgBright + alpha | 에러, 위험, 필수 |
| **Yellow (Warning)** | 400/**500**/600 + orange + bgLight/bgOrange + alpha | 주의, 검수 필요 |
| **Green (Success)** | 400/**500** + bgLight/bgBright + alpha | 완료, 성공 |
| **Cyan** | **500** + skyblue + bgLight/bgSky | progress secondary, 정보 |
| **Purple** | **500/600** + bright + bgLight/bgBright | env tag, progress tertiary |

> **표시 굵게**된 값이 메인 톤. `bgLight`는 배경용 (5~10% 톤다운).

### Spacing scale (numeric)
`50(2px) · 100(4) · 150(6) · 200(8) · 250(10) · 300(12) · 400(16) · 500(20) · 600(24) · 800(32) · 900(36) · 1000(40) · 1500(60) · 1800(72) · 2000(80) · 2400(96)`

### Padding scale (functional alias)
`xxs(2) · xs(4) · s(6) · m(8) · l(10) · xl(12) · xxl(16) · 3xl(20) · 4xl(24) · 5xl(32)`

### Radius
`none · xxs(2) · xs(4) · sm(6) · md(8) · lg(12) · xl(20) · full(9999)`

### Icon size / stroke
- size: `xxs/xs/s = 16px · m = 20 · l = 24 · xl = 28`
- stroke: `light = 1 · regular = 1.4 · bold = 2`

### Shadow
| Token | Value | 용도 |
|---|---|---|
| `cursor` | `0 1px 2px 0 rgba(0,0,0,.4)` | 드래그 ghost |
| `tooltip` | `0 2px 8px 0 rgba(0,0,0,.16)` | tooltip, popover-sm |
| `popover` | `0 4px 16px 0 rgba(0,0,0,.12)` | dropdown, popover |
| `modal` | `0 8px 32px 0 rgba(0,0,0,.16)` | modal, dialog |

### Z-index
`base=0 · header=100 · drawer=200 · modal=300 · tooltip=400 · toast=500`

---

## 2. Semantic

### `fg.*` — 전경색 (텍스트 / 아이콘)
| Token | → Primitive | 용도 |
|---|---|---|
| `fg.default` | `gray.900` | 본문 |
| `fg.low` | `gray.600` | 보조 텍스트 |
| `fg.lower` | `gray.500` | placeholder, meta |
| `fg.lowest` | `gray.400` | 더 흐릿한 보조 |
| `fg.disabled` | `gray-alpha.900-20` | disabled 텍스트 |
| `fg.on-contrast` | `gray.0` | 어두운 bg 위 텍스트 |
| `fg.inverse` | `gray.0` | 다크 모드 |
| `fg.neutral` | `gray.800` | 강한 neutral |
| `fg.accent` | `blue.500` | 링크, 강조 |
| `fg.success` | `green.500` | |
| `fg.warning` | `yellow.500` | |
| `fg.critical` | `red.500` | |

### `bg.*` — 배경색
- 기본: `default`(gray.0), `low`(gray.100), `inset`, `contrast`(gray.900)
- 상태: `accent / success / warning / critical` × 3 단계 (filled / `-low` / `-bright`)
- 특수: `disabled`, `transparent`(60% 검정), `neutral`, `neutral-low`

### `border.*` / `divider.*` / `focus.*`
- `border.default` = gray.300, `border.low` = gray.200, `border.strong` = gray.900
- 상태색: `border.{accent|success|warning|critical}` (+ `-low` 약한 톤)
- `border.width = 1px`, `border.bold-width = 2px`
- `divider.default = gray.200`, `divider.low = gray-alpha 500-10`
- `focus.outline = blue.500`, `focus.outline-bg = blue alpha 20%`

---

## 3. Typography

### Font family
- `base`: Pretendard Variable + 시스템 폴백 (한국어 우선)
- `mono`: IBM Plex Mono → Roboto Mono → Noto Sans Mono

### Weight
`regular = 400 · medium = 500 · semibold = 600 · bold = 700`

### Size scale (numeric)
| Token | px | 용도 |
|---|---|---|
| 75   | 12 | helper-s |
| 100  | 13 | text-s |
| 125  | 14 | text-m (body) |
| 150  | 15 | text-l |
| 200  | 16 | text-xl |
| 250  | 18 | title-s |
| 300  | 20 | (table header 등) |
| 350  | 22 | title-m |
| 450  | 26 | title-l |
| 550  | 30 | title-xl |
| 1300 | 60 | display |

### Preset (font-size + weight + line-height 조합)
- `text-xs / text-s / text-m / text-l / text-xl` — 각 4 weight (regular/medium/semibold)
- `title-s/m/l/xl-semibold`, `title-s-medium`, `title-l-medium`
- `page-header-title` (24/600/1.5)
- `helper-m` (14/400/1.4), `helper-s` (13/400/1.2)

---

## 4. Component tokens (요약)

| 컴포넌트 | 주요 토큰 그룹 | 비고 |
|---|---|---|
| `button` | primary / accent / secondary / negative + size(xs–xl) + radius | tertiary는 fg만 정의됨 |
| `text-button` | primary / secondary / accent / negative (fg states) | |
| `icon-button` | size(xxs/xs/s/m/l/xl) | size 네이밍 비표준 |
| `text-field` | bg/border 5상태 + size(sm/md/lg) | radius 4px |
| `text-area` | text-field와 동일 패턴 | |
| `select` | text-field와 동일 + bg-count | |
| `option-list` | bg + 5단계 item 상태 | |
| `control` (checkbox/radio) | bg/bg-checked/disabled + indicator + border | |
| `switch` | track + thumb (각 4상태) | |
| `tab` | line / text / box (각 hover/pressed) | size 네이밍 비표준 (s/m/l) |
| `tag` | filter + removable + color(7종) | color 네이밍이 primitive와 일치 |
| `label-tag` | fg + bg(gray/blue/green/red/yellow) + size(xs/s/m) | size 비표준 |
| `status-tag` | default / progress-1~3 / success / warning / critical + size(xs/s/m) | **JSX는 `progress1/2/3`로 다름** |
| `banner` | info / warning / critical (bg + border + icon-fg) | |
| `tooltip` | container + content + arrow + variant(black/white) + 13 placement | |
| `table-header` | bg + bg-subtle | |
| `page-header` | fg/bg/separator/divider + collapsed-height + title/meta typography | |
| `nav` | width 2종 + bg/fg + item states + env-selector | |
| `workspace-tabs` | min/max-width + bg/fg + tab states | |
| `drawer` | overlay + width-mode(fixed/fluid) + size + slots + props | |
| `thumbnail` | s(48×58) / m(72×86) | |

> 전체 키와 값은 `layer-desktop-tokens.json` 참고.

---

## SCM Hub Layout Tokens (v2.25.0)

데이터 리스트 페이지(무탠 전개상품 관리 / SKU 관리 등)의 표준 레이아웃 토큰.

| 토큰 | 값 | 설명 |
|---|---|---|
| `--ld-scm-gnb-h` | 64px | Topbar 높이 |
| `--ld-scm-lnb-w` | 56px | LNB 너비 |
| `--ld-scm-min-width` | 1440px | 최소 가로 해상도 |
| `--ld-scm-page-pad-x` | 28px | 페이지 좌우 패딩 |

### Internal stacking 레이어 (sticky GNB/LNB + 슬라이드 드로어)
| 토큰 | 값 | 용도 |
|---|---|---|
| `--ld-scm-z-content` | 1 | 본문 |
| `--ld-scm-z-backdrop` | 10 | All-Filter 백드롭 (투명 클릭 캐처) |
| `--ld-scm-z-drawer` | 12 | All-Filter 드로어 (LNB 뒤로) |
| `--ld-scm-z-lnb` | 15 | LNB |
| `--ld-scm-z-topbar` | 20 | Topbar (항상 최상단) |

### Motion
| 토큰 | 값 | 용도 |
|---|---|---|
| `--ld-duration-fast` | .12s | 짧은 호버 |
| `--ld-duration-base` | .18s | floating-label, 입력 포커스 |
| `--ld-duration-slow` | .25s | 드로어 슬라이드, 토스트 인/아웃 |
| `--ld-transition-base` | `.18s ease` | |
| `--ld-transition-slow` | `.25s ease` | |

### All-Filter Drawer
| 토큰 | 값 |
|---|---|
| `--ld-af-drawer-width` | 480px |
| `--ld-af-drawer-shadow` | `24px 0 48px rgba(0,0,0,.16), 4px 0 8px rgba(0,0,0,.08)` |

### Filter Popover
| 토큰 | 값 |
|---|---|
| `--ld-filter-popover-codeinput-w` | 280px |
| `--ld-filter-popover-codeinput-h` | 292px |
| `--ld-filter-popover-list-w` | 260px |
| `--ld-filter-popover-list-max-h` | 300px |
| `--ld-filter-popover-shadow` | `0 10px 15px 8px rgba(0,0,0,0.05)` |

### Filter Bar
| 토큰 | 값 |
|---|---|
| `--ld-filter-arrow-size` | 32px |
| `--ld-filter-bar-height` | 44px |
| `--ld-filter-fade-w` | 16px |

### Toast
| 토큰 | 값 |
|---|---|
| `--ld-toast-top` | 80px (GNB + 16) |
| `--ld-toast-right` | 24px |
| `--ld-toast-min-width` | 360px |
| `--ld-toast-max-width` | 520px |

### Sticky scroll stack (v2.26)

데이터 리스트 페이지에서 GNB → filter → stats → thead 가 차곡차곡 sticky 로 쌓이도록 각 단의 높이를 변수로 노출. JS(`setupStickyScrollStack`) 가 ResizeObserver 로 filter/stats 의 offsetHeight 를 측정해 자동 갱신.

| 토큰 | 기본값 | 출처 |
|---|---|---|
| `--scm-sticky-gnb` | 64px | layer-desktop.css 정적 정의 (topbar 고정 높이) |
| `--scm-sticky-filter` | 52px | JS 가 `.mp-filter-bar` 의 offsetHeight 로 갱신 |
| `--scm-sticky-stats` | 84px | JS 가 `.mp-stats-row` 의 offsetHeight 로 갱신 |

### Frozen columns (v2.26)

가로 고정 컬럼의 누적 left offset. JS(`applyFrozenColumns`) 가 본문 첫 행의 너비를 측정해 셋팅. fallback 값은 SKU 관리 데모 기준.

| 토큰 | fallback | 의미 |
|---|---|---|
| `--frozen-l1` | 0 | 1번째 frozen 컬럼 left (cb) |
| `--frozen-l2` | 40px | 2번째 (No) |
| `--frozen-l3` | 88px | 3번째 (SKU번호) |
| `--frozen-l4` | 200px | 4번째 (바코드) |
| `--frozen-l5` | 360px | 5번째 (운영상태) |
| `--frozen-l6` | 460px | 6번째 (매핑상태) |

frozen 색상 토큰:

| 토큰 | 값 | 용도 |
|---|---|---|
| frozen 셀 bg | `#fff` | 스크롤 영역과 시각 분리 |
| frozen boundary line | `rgba(0,0,0,0.12)` | col-frozen-6 우측 1px |
| cell-selected bg | `rgba(36,94,255,0.08)` | Excel-like 드래그 선택 영역 |
| cell-active outline | `#245EFF` 2px | anchor 위치 강조 |
| opt-row--sel bg | `#F0F7FF` (hover `#E2F1FF`) | multi 팝오버 "선택됨" 컬럼 |
