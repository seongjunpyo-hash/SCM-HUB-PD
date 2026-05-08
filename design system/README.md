# MUSINSA LayerDesktop · Design System

> **Version** 2.27.0
> **Source of truth** [Figma · LayerDesktop](https://figma.com/design/nm6vlOA9stZAf03Q1LvsHa/LayerDesktop)
> **Scope** PBO 공통 디자인 시스템 (Layer for Desktop)

MUSINSA SCM HUB 등 PBO 데스크탑 제품을 위한 공통 컴포넌트/토큰 라이브러리입니다.
Pretendard 폰트 기반, `--ld-*` CSS 변수 네임스페이스를 사용합니다.

---

## Quickstart

### CSS만 사용 (HTML / 정적 페이지)

```html
<!-- Pretendard -->
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />

<!-- LayerDesktop -->
<link rel="stylesheet" href="./layer-desktop.css" />

<body class="ld-root">
  <button class="ld-btn ld-btn-md ld-btn-primary">확인</button>
</body>
```

### React 컴포넌트

```jsx
import {
  Button, TextField, Select, Tabs, Tab, Modal, Drawer,
  StatusTag, Banner, Tooltip, Checkbox, Switch,
  PageHeader, Nav, WorkspaceTabs, Field, FormCard, Table,
} from './design-system/components';

<Button variant="accent">자세히</Button>
<StatusTag variant="success">완료</StatusTag>
```

### Tailwind 사용

```js
// tailwind.config.js
import layerDesktopPreset from './design-system/tailwind-preset.js';

export default {
  presets: [layerDesktopPreset],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
};
```

### JS / TS에서 토큰 import

```js
import { color, spacing, radius, button } from './design-system/layer-desktop-tokens.js';

const styles = { color: color.fg.accent, padding: spacing[400], borderRadius: radius.md };
```

---

## 무엇이 들어 있나

| 영역 | 위치 | 설명 |
|---|---|---|
| **Tokens (DTCG JSON)** | `layer-desktop-tokens.json` | Source of truth. primitive / semantic / component 3계층 |
| **Tokens (JS export)** | `layer-desktop-tokens.js` | JSON에서 파생된 JS/TS 객체 |
| **Tokens (CSS vars)** | `layer-desktop.css` (§1–9) | 모든 토큰을 `--ld-*` CSS 변수로 노출 |
| **Utility classes** | `layer-desktop.css` (§10) | `.ld-text-*`, `.ld-root` 등 |
| **Component recipes (CSS)** | `layer-desktop.css` (§11) | `.ld-btn`, `.ld-tf`, `.ld-modal` 등 |
| **Tailwind preset** | `tailwind-preset.js` | 토큰을 Tailwind theme으로 매핑 |
| **React 컴포넌트** | `components/*.jsx` | 15개 컴포넌트 (아래 인덱스 참고) |
| **Showcase / 데모** | `index.html` | 모든 컴포넌트의 실사용 예시 |
| **문서** | `STRUCTURE.md`, `CONVENTIONS.md`, `docs/*.md` | 구조, 네이밍 규칙, 토큰/컴포넌트 레퍼런스 |

---

## 컴포넌트 인덱스

| 컴포넌트 | export | 카테고리 | 상태 |
|---|---|---|---|
| **Button** | `Button`, `IconButton`, `TextButton` | Action | ✅ |
| **TextField** | `TextField`, `SearchField`, `TextArea` | Input | ✅ |
| **Select** | `Select`, `OptionList` | Input | ✅ |
| **Checkbox / Radio / Switch** | `Checkbox`, `CheckboxGroup`, `Radio`, `RadioGroup`, `Switch` | Input | ✅ |
| **Tag** | `StatusTag`, `LabelTag`, `FilterTag`, `RemovableTag` | Display | ⚠ variant 네이밍 통일 필요 |
| **Tooltip** | `Tooltip` | Overlay | ✅ |
| **Modal / Dialog** | `Modal`, `Dialog` | Overlay | ✅ |
| **Drawer** | `Drawer` | Overlay | ✅ |
| **Banner** | `Banner` | Feedback | ✅ |
| **Tabs** | `Tabs`, `Tab` | Navigation | ⚠ size `s/m/l` ← 다른 컴포넌트와 다름 |
| **PageHeader** | `PageHeader` | Layout | ✅ |
| **Nav (LNB)** | `Nav` | Layout | ✅ |
| **WorkspaceTabs** | `WorkspaceTabs` | Layout | ✅ |
| **Form** | `Field`, `FormCard`, `FormRow` | Layout | ✅ |
| **Table** | `Table` (+ NumericCell, DateCell, StatusTextCell, TrailingCell) | Data | ✅ |
| **DataTable** | `DataTable`, `DataTableHost`, `DataTableScroll`, `DataTableGroupRow`, `DataTableCell`, `DataTableCheckbox`, `DataTableEmpty` | Data | ✅ v2.23 |
| **PageHead** | `PageHead`, `PageTitle`, `PageActions`, `ActionButton` | Layout | ✅ v2.23 |
| **FilterBar** | `FilterBar`, `FilterChip`, `FilterSelect`, `FilterGroup`, `FilterInput`, `FilterSearchButton` | Input | ✅ v2.23 |
| **FilterField** | `FilterField` (single/multi/codeinput) + `FilterFieldGroup` (joined) — 셀렉트+팝오버+모든 동작 통합 | Input | ✅ v2.24 |
| **AllFilterDrawer** | `AllFilterDrawer` — 전체 필터 chip 클릭 시 좌측 슬라이드 드로어 (LNB 뒤에서 미끄러짐, 딤드 X, 그림자만) | Overlay | ✅ v2.25 |
| **Toast** | `ToastStack` + `useToast` 훅 — 우측 상단 슬라이드 인/아웃 토스트 (success/info/critical) | Feedback | ✅ v2.25 |
| **StatsBar** | `StatsBar`, `Stat`, `MiniAction`, `DownloadButton`, `Pager`, `PageSize` | Layout | ✅ v2.23 |
| **InfoBanner** | `InfoBanner` (gray 변형) | Feedback | ✅ v2.23 |
| **EmptyState** | `EmptyState` | Feedback | ✅ v2.23 |
| **SCM Table** | `components/scm-table/` (자가포함 CSS+JS+README) — 컬럼 폭/cell-clamp/sticky thead/셀 선택/resize 핸들 일괄 | Data | ✅ v2.27 |
| **Icons** | `.ic .ic-<name>` (CSS mask, PBOAssets) | Display | 📄 [docs/icons.md](./docs/icons.md) |

> ⚠ 표시는 `docs/consistency-audit.md`에 정리한 일관성 이슈가 있는 컴포넌트입니다.

---

## 다음으로 볼 문서

- 📁 [`STRUCTURE.md`](./STRUCTURE.md) — 폴더/파일 구조 가이드
- 📐 [`CONVENTIONS.md`](./CONVENTIONS.md) — 네이밍 규칙, 토큰 계층, 새 토큰/컴포넌트 추가 기준
- 🎨 [`docs/tokens.md`](./docs/tokens.md) — 디자인 토큰 전체 레퍼런스
- 🧱 [`docs/components.md`](./docs/components.md) — 컴포넌트 API 레퍼런스
- 🚀 [`docs/dev-handoff.md`](./docs/dev-handoff.md) — **개발자용 즉시 작업 가이드** (Figma dev export 기반 픽셀값 + 복붙 가능한 CSS/HTML/JS)
- 📐 [`docs/breakpoints.md`](./docs/breakpoints.md) — 최소 해상도(1440px) · 가로 스크롤 가드
- 🔣 [`docs/icons.md`](./docs/icons.md) — 아이콘 사용법 (PBOAssets · SVG sprite)
- 📊 [`docs/table-columns.md`](./docs/table-columns.md) — 테이블 컬럼 width(Auto/Small/Medium/Large/Spacer) · cell-clamp / cell-clamp-2 · row 높이
- ✂ [`docs/cell-selection.md`](./docs/cell-selection.md) — Excel-like 셀 선택 / TSV 복사 / 헤더 더블클릭 컬럼 선택
- 📦 [`components/scm-table/README.md`](./components/scm-table/README.md) — **SCM Table 자가포함 컴포넌트** (다른 프로젝트에 폴더 복사하면 그대로 동작)
- 📋 [`docs/data-list-page.md`](./docs/data-list-page.md) — 데이터 리스트 페이지 표준 템플릿 (헤더·필터바·통계바·툴바·페이지네이션·셀 컴포넌트)
- 🔍 [`docs/consistency-audit.md`](./docs/consistency-audit.md) — 발견된 일관성 이슈 + 권장 수정안

---

## 버전

- **2.27.0** (2026-04-30) — **SCM Table 자가포함 컴포넌트 추출** + 카테고리·옵션·SKU명 컬럼 폭 spec 통일. 신규 `components/scm-table/` (CSS+JS+README) — 다른 프로젝트에 폴더 복사하면 동일 동작 재현. cell-clamp-2 (2줄 wrap, 강제 260) 도입. col-medium spec: min 100 / auto / max 260 (4 페이지 일관). col-large 360 JS 강제 (word-break shrink 방지). 헤더 더블클릭 → 컬럼 전체 선택. 셀 선택 컬러 → blue (#3B82F6 + bg rgba(59,130,246,0.08)). 본문 셀 2줄 기본 (white-space:normal, 행 높이 76). 신규 docs: `docs/cell-selection.md`. 자세한 내용은 [CHANGELOG](./CHANGELOG.md).
- **2.25.0** (2026-04-29) — **데이터 리스트 페이지 시스템 일괄 토큰화/정리**. 신규 토큰: `--ld-scm-gnb-h:64`, `--ld-scm-lnb-w:56`, `--ld-scm-min-width:1440`, `--ld-af-drawer-width:480`, `--ld-toast-top:80`, `--ld-toast-right:24`, motion 토큰(`--ld-duration-fast/base/slow`, `--ld-transition-base/slow`), 내부 stacking 레이어(`--ld-scm-z-content/backdrop/drawer/lnb/topbar`). 신규 CSS 레시피: `.ld-af-drawer` (전체 필터 패널 + multi 검색 + chip/list/textarea), `.ld-toast-stack` (right-top slide-in/out), `.ld-code-popover` (좌측 정렬 모달). 신규 React 컴포넌트: `<AllFilterDrawer>` (controlled, sections prop), `<ToastStack>` + `useToast()` 훅.
- **2.24.0** (2026-04-29) — **FilterField 통합 컴포넌트** 추가. 데모(무탠/SKU)에서 확정한 모든 필터 동작 — floating-label 모션, 단일/다중/코드입력 모드, "전체"(id='all') 자동 처리, joined-group 활성 보더, 외부닫기/Esc, 단일선택 popover 가로 = 버튼 가로, 엑셀 paste, "[첫값] 외 N-1" 표시 — 을 한 컴포넌트로 사용 가능. `<FilterField mode="single|multi|codeinput" label="..." options={...} onChange={...}/>` + `<FilterFieldGroup>`. CSS: floating-label transition + joined-group active 보더 추가.
- **2.23.0** (2026-04-29) — **데이터 리스트 페이지 컴포넌트화 일괄 반영**. 새 React 컴포넌트 6세트: `DataTable` (단일/그룹 thead 변형), `PageHead`+`ActionButton`, `FilterBar`+floating-label `FilterSelect`+`FilterGroup`+`FilterInput`+`FilterSearchButton`, `StatsBar`+`Stat`+`MiniAction`+`Pager`+`PageSize`+`DownloadButton`, `InfoBanner` (gray), `EmptyState`. 새 CSS 레시피 (`layer-desktop.css` 끝 §`Data Table` / §`Page Head` / §`Filter Bar` / §`Stats Bar` / §`Info Banner` / §`Empty State`). 기존 `Table`/`PageHeader` 는 보존 — 데이터 리스트 페이지에는 새 `DataTable`/`PageHead` 사용.
- **2.22.0** (2026-04-29) — **Figma dev export 픽셀 정합** 일괄 적용 + 개발자 hand-off 문서. 새 문서 [`docs/dev-handoff.md`](./docs/dev-handoff.md). Topbar 64h 풀폭 / LNB 6 메뉴 with 3px active strip / Page title 26/600 / Action button 검정 outlined "일괄 업로드 \| 진행중 N" 단일 / Filter 44h floating label 패턴, 필수 = 파란 4×4 점 / Stats bar 중첩 flex (counts 16, divider 4, mini-actions 8, sections 28) / Table h54 header + h68 row, 그룹/in-group 디바이더 색 분리(#E0E0E0/#EBEBEB) / 컬러 chip / 시즌 태그 / 전개 pill+chev split / 사이즈 button 36h / 토스트(success/info/critical) / 코드 popover 4종 / 확인 모달 / 페이지네이션 동작 / 페이지 사이즈 dropdown.
- **2.21.0** (2026-04-29) — 데이터 리스트 페이지 표준 템플릿 정식화. 새 문서 [`docs/data-list-page.md`](./docs/data-list-page.md).
- **2.20.1** (2026-04-29) — Breakpoint: Grid `min-width:0` 가드 추가. `grid-template-columns: 56px minmax(0, 1fr)` + `.app > * { min-width:0 }` + 스크롤 컨테이너 `max-width:100%`. 콘텐츠가 그리드 컬럼을 부풀려 액션바가 잘리는 문제 해결. `docs/breakpoints.md` 업데이트.
- **2.20.0** (2026-04-29) — Breakpoint: 최소 해상도 **1440px** 가드 정식화. body / .app 에 `min-width:1440px`, 그 아래는 가로 스크롤. 새 문서 `docs/breakpoints.md`.
- **2.19.0** (2026-04-29) — Table: 컬럼 width 4종(Auto/Small/Medium/Large) + Spacer 룰 정식화. Row min-height 52px. Inner-clamp 패턴으로 max-width 강제. 새 문서 `docs/table-columns.md`.
- **2.18.0** (2026-04-29) — Icons: PBOAssets `basic/ic-*` 통합 가이드 추가 (`docs/icons.md`). CSS mask + `currentColor` 패턴.
- **2.17.0** (2026-04-29) — 문서/구조 정리, 일관성 audit 추가
