# SCM Hub Simulation System — 아키텍처 설계 문서

> **버전:** Draft v1.0
> **작성일:** 2026-05-01
> **목적:** PRD(자연어 요구사항) → 와이어프레임/실사이트 → 사용자 검토 반복 → React 컴포넌트 패키지 핸드오프까지의 자동화 파이프라인을 정의한다.
> **선행 자산:** Stage 1~13 의 50+ `scm-*` 모듈, 5종 페이지 템플릿, 컴포넌트 인벤토리(`docs/component-inventory.md`), React export 가이드(`docs/react-export-guide.md`).

---

## 0. Executive Summary

SCM Hub 디자인 시스템은 50개 이상의 자가포함 모듈(`<name>.css/.js/.html/.jsx + README.md`)과 5종 페이지 템플릿이 이미 구축되어 있다. 시뮬레이션 시스템은 이 자산들을 **합성 재료(building block)** 로 삼아 PRD → 페이지 산출물까지의 자동화 파이프라인을 제공한다.

핵심 흐름은 6단계: **(1) PRD 입력 → (2) Parse(IR 추출) → (3) Infer(컴포넌트/템플릿 매핑) → (4) Render(HTML 조립) → (5) Edit(사용자 수정 반복) → (6) Export(JSX + zip 패키지)**.

**전략적 결정사항:**
- 권장 tooling: **Web UI** (1차) + **CLI** (CI/CD 보조). VS Code extension 은 후속 단계.
- Phase 1 MVP 는 **LLM 없이** 룰 기반 키워드 매칭 + 수동 컴포넌트 선택 만으로 동작 가능해야 함 → 빠른 검증.
- React 변환은 **이미 존재하는 `<name>.jsx` twin** 을 재사용 (1:1 매핑) → hallucination 위험 최소화.

---

## 1. 시스템 아키텍처

### 1.1 파이프라인 (단계별)

```
┌───────────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  PRD          │ →  │  Parser  │ →  │ Inferencer│ →  │ Renderer │ →  │  Editor  │ →  │ Exporter │
│ (md/yaml/txt) │     │  (AST/   │     │ (component│     │ (HTML 조립│     │ (반복 수정│     │ (JSX +   │
│               │     │  IR 생성)│     │  + 템플릿 │     │   + bind)│     │   루프)  │     │  zip)    │
└───────────────┘     └──────────┘     │   매핑)  │     └──────────┘     └──────────┘     └──────────┘
                                        └──────────┘
       │                  │                  │                │                │                │
       ▼                  ▼                  ▼                ▼                ▼                ▼
  raw text/md       PRD-IR (json)      PageManifest      HTML files      Patched HTML    React zip
                                       (json)           (preview)       (versioned)     (final)
```

### 1.2 각 단계의 입출력 포맷

| 단계 | 입력 | 출력 | 포맷 / 위치 |
|---|---|---|---|
| 1. Parse | `*.prd.md` 또는 `*.prd.yaml` | `prd-ir.json` (IR: Intermediate Representation) | `.simulator/runs/<runId>/prd-ir.json` |
| 2. Infer | `prd-ir.json` + `manifest/components.json` + `manifest/keywords.json` | `page-manifest.json` (컴포넌트 트리, props, 데이터 placeholder) | `.simulator/runs/<runId>/page-manifest.json` |
| 3. Render | `page-manifest.json` + `templates/<type>.html` + 모듈 마크업 | `index.html` (full page) + `mock-data.json` | `.simulator/runs/<runId>/preview/` |
| 4. Edit | `preview/index.html` + 사용자 명령(text or visual op) | `patch-N.json` + 갱신된 `index.html` | `.simulator/runs/<runId>/patches/` |
| 5. Export | 최종 `index.html` + `mock-data.json` | React 패키지 (zip) | `.simulator/runs/<runId>/export/<page>.zip` |

### 1.3 핵심 모듈

각 단계는 독립 실행 가능한 노드(node) — pipe 로 chaining.

- **`@scm-sim/parser`** — PRD → IR 변환. Markdown 헤더/리스트/표를 AST 로 분해 후, 의도(intent)·페이지 유형·필드·도메인 키워드를 추출.
- **`@scm-sim/inferencer`** — IR → PageManifest. 키워드 사전 + 룰 기반 + (옵션) LLM 호출로 컴포넌트 매핑.
- **`@scm-sim/renderer`** — PageManifest → HTML. 템플릿 placeholder 치환 + 모듈 마크업 합성 + mock 데이터 생성.
- **`@scm-sim/editor`** — Diff/Patch 엔진. text prompt → DOM patch 또는 visual edit op → patch 변환.
- **`@scm-sim/exporter`** — HTML → React (.jsx). 페이지 단위 컴포넌트 + 모듈 import + mock data 분리 + zip 생성.
- **`@scm-sim/manifest`** — 매니페스트 관리(컴포넌트 메타, 키워드 사전, 페이지 매니페스트).

---

## 2. PRD 파싱 + 컴포넌트 추론

### 2.1 PRD 입력 형식

**둘 다 지원 (자유도 vs 정확도 트레이드오프).**

#### (A) 자연어 Markdown — 자유도 ↑, 정확도 중

```markdown
# SKU 매핑 관리 페이지

## 페이지 유형
데이터 리스트 페이지

## 주요 액션
- 신규 매핑 등록 (primary)
- 일괄 업로드

## 필터
- 브랜드, 시즌, 매핑 상태 (운영중/미매핑/대기)
- 검색어 입력

## 통계 카운트
- 전체 / 매핑완료 / 미매핑 / 선택됨

## 테이블 컬럼
- 체크박스, 브랜드, 시즌, SKU 코드, 매핑 상태, 등록일

## 도메인 칩
- 매핑 상태: 운영중(파랑) / 미매핑(회색) / 대기(주황)
```

#### (B) 구조화 YAML — 자유도 ↓, 정확도 ↑ (Phase 2+ 권장)

```yaml
page:
  id: sku-mapping
  title: SKU 매핑 관리
  type: data-list
  actions:
    - { label: 신규 매핑 등록, variant: primary }
    - { label: 일괄 업로드, variant: outline }
  filters:
    - { kind: select, label: 브랜드, multi: true }
    - { kind: select, label: 매핑 상태, options: [운영중, 미매핑, 대기] }
  stats: [전체, 매핑완료, 미매핑, 선택됨]
  table:
    columns:
      - { key: brand, label: 브랜드 }
      - { key: state, label: 매핑상태, render: scm-state-text }
```

`prd-ir.json` 은 두 입력을 동일한 IR 로 정규화한다.

```json
{
  "page": {
    "id": "sku-mapping",
    "title": "SKU 매핑 관리",
    "type": "data-list",
    "sections": [
      { "kind": "actions", "items": [...] },
      { "kind": "filters", "items": [...] },
      { "kind": "stats", "items": [...] },
      { "kind": "table", "columns": [...] }
    ],
    "domain": {
      "states": [
        { "label": "운영중", "color": "blue" },
        { "label": "미매핑", "color": "gray" },
        { "label": "대기", "color": "orange" }
      ]
    }
  }
}
```

### 2.2 추론 전략 — 하이브리드

```
┌──────────────────────────┐
│   PRD-IR                 │
└────────────┬─────────────┘
             ▼
   ┌─────────────────────┐
   │ 1. 룰 기반 매처     │  ← 80% 케이스 처리 (빠름, 결정적)
   │  - 페이지 유형 분류 │
   │  - 키워드 사전 매핑 │
   └──────────┬──────────┘
              ▼
   ┌─────────────────────┐
   │ 2. LLM 보조 추론    │  ← 룰 매칭 실패한 항목만 (Phase 2+)
   │  (Claude / GPT)     │
   └──────────┬──────────┘
              ▼
   ┌─────────────────────┐
   │ 3. 사용자 확인 UI   │  ← 항상 마지막 게이트
   │  (모호 항목 highlight)│
   └─────────────────────┘
```

**룰 우선** 이유: LLM은 hallucination 위험 + 속도 + 결정성 부족. 룰로 못 잡는 케이스만 LLM 으로 위임.

### 2.3 페이지 유형 식별

5종 템플릿 중 하나로 분류 (`templates/` 기준):

| 유형 | 트리거 키워드 | 템플릿 파일 |
|---|---|---|
| `data-list` | "리스트", "목록", "테이블", "관리", "조회" | `data-list-page.html` |
| `form` | "등록", "입력", "수정 폼", "작성" | `form-page.html` |
| `detail` | "상세", "디테일", "정보 페이지" | `detail-page.html` |
| `dashboard` | "대시보드", "KPI", "지표", "현황 요약" | `dashboard-page.html` |
| `nav-drawer` | "메뉴", "전체 네비게이션", "drawer" | `navigation-drawer.html` |

PRD 에 명시되어 있으면 그대로, 없으면 키워드 빈도로 추측. 모호하면 사용자 confirm.

### 2.4 컴포넌트 매핑 사전 (`manifest/keywords.json`)

```json
{
  "filter": ["scm-filter-bar", "scm-filter-chip", "scm-filter-select"],
  "검색": ["scm-search-btn"],
  "전체 필터": ["scm-filter-drawer"],
  "통계": ["scm-stats-bar", "scm-stat"],
  "카운트": ["scm-stat"],
  "테이블": ["scm-data-table"],
  "페이지네이션": ["scm-pager", "scm-pgsize-select"],
  "엑셀 다운로드": ["scm-download-btn"],
  "확인 모달": ["scm-confirm-modal"],
  "일괄 업로드": ["scm-bulk-upload-modal"],
  "토스트": ["scm-toast"],
  "체크박스": ["scm-checkbox"],
  "라디오": ["scm-radio"],
  "셀렉트": ["scm-select"],
  "입력": ["scm-input"],
  "버튼": ["scm-button"],
  "뒤로가기": ["scm-back-btn"],
  "탭": ["scm-tabs"],
  "카드": ["scm-card"],
  "info banner": ["scm-info-banner"],
  "KPI": ["scm-kpi-card"],
  "활동 내역": ["scm-activity-item"],
  "퀵 링크": ["scm-quick-link-card"]
}
```

### 2.5 도메인 chip 추론

PRD 의 "도메인 칩" / "상태" / "분류" 섹션에서 라벨 + 색을 추출 → 적절한 모듈 변형으로 매핑.

| 패턴 | 매핑 컴포넌트 | 변형 |
|---|---|---|
| "운영중", "활성" + 파랑 | `scm-state-text --accent` | — |
| "위험", "마감", "오류" + 빨강 | `scm-state-text --critical` | — |
| 전개 상태 (운영/미운영/부분) | `scm-deploy-pill` | `is-deployed` / `is-undeployed` / `is-partial` |
| 입고/발주/재발주 | `scm-kind-chip` | dynamic class |
| 입고대기/완료 | `scm-status-chip` | dynamic class |
| 초도/재발주/자동/수동 | `scm-tag` | `--blue` / `--gray` / `--green` |
| 플랫폼 (29CM/무신사 등) | `scm-platform-tag` | `data-color=blue/yellow/gray` |

키워드 매칭 실패 시 → LLM 에 색·의미 추론 요청 또는 사용자에게 매핑 confirm 다이얼로그 노출.

---

## 3. HTML 조립 (Renderer)

### 3.1 조립 절차

```
1. PageManifest 로드
2. 페이지 유형 → templates/<type>.html 복사
3. 템플릿 placeholder 스캔: {{TITLE}}, {{ACTIONS}}, {{FILTERS}}, ...
4. 각 placeholder 별로:
   a. PageManifest 의 해당 section 읽기
   b. 모듈의 canonical marker (<name>.html) 가져오기
   c. data-binding (props 치환)
   d. 결과 마크업 삽입
5. {{MODULE_CSS_LINKS}} / {{MODULE_JS_SCRIPTS}} 자동 생성 (사용된 모듈만)
6. mock data 생성 → <script> 인라인 또는 별도 파일
7. preview/index.html 출력
```

### 3.2 모듈 마크업 합성

각 모듈은 `<name>.html` 에 **canonical marker** 를 가지고 있음 — render 시 그대로 복제 + props 치환.

예: `scm-stat` 의 canonical marker.

```html
<!-- canonical: scm-stat -->
<div class="scm-stat scm-stat--{{variant}}">
  <span class="scm-stat__label">{{label}}</span>
  <span class="scm-stat__count">{{count}}</span>
</div>
```

PageManifest 의 stats 섹션:

```json
{
  "stats": [
    { "label": "전체", "count": 1234, "variant": "all" },
    { "label": "매핑완료", "count": 980, "variant": "deployed" },
    { "label": "미매핑", "count": 254, "variant": "undeployed" },
    { "label": "선택됨", "count": 0, "variant": "selected" }
  ]
}
```

→ 마커 4번 복제 + 변수 치환.

### 3.3 데이터 바인딩

- **Phase 1**: 모든 동적 값 = placeholder 또는 자동 mock (Faker.js 같은 라이브러리).
- **Phase 2**: PRD 에 sample data 명시 가능 (`samples:` 섹션).
- **Phase 3**: real API schema 연결 옵션 (OpenAPI spec 입력).

### 3.4 페이지 단위 통합

전 페이지 공통: TopBar + LNB + main 구조. Renderer 가 자동 주입하되, 사용자가 LNB 구조를 PRD 에 명시하면 우선.

---

## 4. 사용자 반복 수정 (Editor)

### 4.1 수정 명령 인터페이스 — 둘 다 지원

#### (A) 텍스트 프롬프트 (1차)

```
> 통계 카운트 "선택됨" 을 빨간 색으로 강조
> 테이블에 "최근 수정자" 컬럼 추가
> 신규 등록 버튼을 outline 으로 변경
> 필터에 날짜 범위 추가
> "매핑완료" 라벨을 "운영중" 으로 변경
```

→ LLM 또는 룰 기반 NL→Patch 변환 → DOM AST patch 적용.

#### (B) 시각 편집 (Phase 5)

브라우저 preview 에서 컴포넌트 클릭 → 인라인 메뉴(variant 변경 / 라벨 수정 / 삭제 / 복제 / props 편집).

### 4.2 Diff / Patch 메커니즘

```
현재 HTML  ─┐
            ├──→  AST (cheerio/jsdom)  ──→  Patch ops 적용  ──→  새 HTML
새 명령   ──┘                            (insert/replace/delete/setAttr)
```

Patch 포맷 (JSON Patch 변형):

```json
[
  { "op": "replace", "selector": ".scm-stat[data-variant='selected']", "attr": "class", "value": "scm-stat scm-stat--critical" },
  { "op": "insert", "selector": ".scm-stats-bar__counts", "html": "<span>...</span>", "where": "append" }
]
```

각 patch 는 별도 파일(`patches/patch-N.json`)로 보관 → 버전 트래킹 + undo/redo.

### 4.3 컴포넌트 단위 교체 / 변형 / 상태

룰:
- **교체**: marker `<!-- canonical: scm-X -->` 영역을 다른 모듈 마커로 swap.
- **변형**: variant 클래스 토글 (예: `--primary` ↔ `--outline`).
- **상태**: aria-* 또는 data-* 속성 토글.

### 4.4 Undo / Redo

`patches/` 디렉토리 = append-only 시퀀스. Undo = 마지막 patch 의 inverse 적용. Redo = redo stack 에서 push.

```
runs/<runId>/
  preview/index.html         ← 현재 상태
  patches/
    0001-init.json           ← 최초 render
    0002-add-column.json
    0003-change-variant.json
    HEAD                     ← 현재 patch idx
```

---

## 5. React 변환 (Exporter)

### 5.1 HTML → JSX 변환 규칙

`docs/react-export-guide.md` 에 정의된 규칙을 그대로 적용:

| HTML | JSX |
|---|---|
| `class=` | `className=` |
| `for=` | `htmlFor=` |
| `tabindex=` | `tabIndex=` |
| `onclick=` | `onClick=` |
| void 태그 (`<input>`) | self-closing (`<input />`) |
| 인라인 `style="..."` | `style={{ ... }}` 객체 |

### 5.2 컴포넌트별 JSX twin 활용

각 모듈은 `<name>.jsx` 를 이미 가지고 있음. Exporter 는 **마커 영역을 JSX import + tag** 로 치환:

```html
<!-- canonical: scm-button --><button class="scm-button scm-button--primary">저장</button>
```

→

```jsx
import Button from '@design-system/button/button.jsx';

<Button variant="primary">저장</Button>
```

### 5.3 페이지 단위 React 컴포넌트 생성

규칙:
- 페이지 유형 + ID → 파일명: `pages/SkuMapping.jsx` (PascalCase).
- 페이지 내 인라인 `<script>` → useState/useEffect 로 변환.
- LNB / TopBar 는 layout 컴포넌트로 추출 (`<AppShell>...</AppShell>`).

```jsx
// pages/SkuMapping.jsx
import { useState } from 'react';
import AppShell from '@/layouts/AppShell';
import FilterBar from '@design-system/filter-bar/filter-bar.jsx';
import StatsBar from '@design-system/stats-bar/stats-bar.jsx';
import DataTable from '@design-system/scm-table/scm-table.jsx';
import { ROWS, FILTERS } from './sku-mapping.data';

export default function SkuMapping() {
  const [rows, setRows] = useState(ROWS);
  const [selected, setSelected] = useState([]);
  return (
    <AppShell title="SKU 매핑 관리">
      <FilterBar filters={FILTERS} />
      <StatsBar stats={[
        { label: '전체', count: rows.length, variant: 'all' },
        { label: '선택됨', count: selected.length, variant: 'selected' }
      ]}/>
      <DataTable rows={rows} onSelect={setSelected} />
    </AppShell>
  );
}
```

### 5.4 Mock data 분리

Render 단계에서 생성된 mock → `<page>.data.js` constants 파일로 분리.

```js
// pages/sku-mapping.data.js
export const ROWS = [
  { id: 1, brand: 'A', season: '24SS', state: '운영중' },
  // ...
];
export const FILTERS = [...];
```

### 5.5 Export 산출물 (zip)

```
sku-mapping-2026-05-01.zip
├ package.json              ← React 18+, vite, @design-system/* alias
├ vite.config.js
├ index.html
├ src/
│  ├ main.jsx
│  ├ App.jsx                ← <SkuMapping />
│  ├ layouts/
│  │  └ AppShell.jsx
│  ├ pages/
│  │  ├ SkuMapping.jsx
│  │  └ sku-mapping.data.js
│  └ design-system/         ← 사용된 모듈만 복사
│     ├ button/
│     ├ filter-bar/
│     ├ stats-bar/
│     ├ scm-table/
│     └ tokens/layer-desktop.css
├ README.md                 ← 통합 가이드 (개발팀용)
└ MANIFEST.json             ← 어떤 PRD 로 만들었는지 / 모듈 버전
```

---

## 6. 메타데이터 / 매니페스트

시스템 전체 메타데이터는 `design-system/manifest/` 아래에 보관.

### 6.1 컴포넌트 메타 (`manifest/components.json`)

각 모듈의 props / variants / states 명세. JSX twin 의 PropTypes 에서 자동 생성 가능.

```json
{
  "scm-button": {
    "path": "components/button",
    "props": {
      "variant": { "type": "enum", "values": ["primary", "outline"], "default": "primary" },
      "disabled": { "type": "boolean", "default": false },
      "children": { "type": "node" }
    },
    "states": ["hover", "focus", "disabled"],
    "marker": "<!-- canonical: scm-button -->",
    "deps": ["tokens/layer-desktop.css"]
  },
  "scm-filter-bar": { /* ... */ }
}
```

### 6.2 키워드 매핑 사전 (`manifest/keywords.json`)

§ 2.4 참조. 자연어 → 컴포넌트 ID. 한국어 + 영어 별칭 모두 포함.

### 6.3 페이지 매니페스트 (`runs/<runId>/page-manifest.json`)

```json
{
  "id": "sku-mapping",
  "title": "SKU 매핑 관리",
  "type": "data-list",
  "tree": [
    { "component": "scm-page-head", "props": { "title": "SKU 매핑 관리" } },
    { "component": "scm-filter-bar", "props": { ... } },
    { "component": "scm-stats-bar", "props": { ... } },
    { "component": "scm-data-table", "props": { ... } }
  ],
  "data": {
    "rows": "$mock.tableRows",
    "filters": "$mock.filterOptions"
  },
  "routing": { "path": "/sku/mapping", "lnb": "sku" }
}
```

### 6.4 출력 산출물 매니페스트 (`MANIFEST.json` in zip)

생성 출처(PRD 파일 hash, 시뮬레이터 버전), 사용 모듈 버전, 변환 시각, 추론 신뢰도(어느 항목이 LLM 으로 결정됐는지).

---

## 7. Tooling 옵션 비교

### 7.1 옵션별 트레이드오프

| 옵션 | 장점 | 단점 | 적합 단계 |
|---|---|---|---|
| **CLI** (`scm-sim init/build/export`) | 자동화 / CI 친화 / 빠른 iteration | UI 검토가 별도 / 비기술자 진입장벽 | Phase 1 MVP, CI/CD |
| **VS Code extension** | 코드와 preview 동시 / 익숙한 환경 | 제작 비용 ↑ / VS Code 사용자만 | Phase 4+ |
| **Web UI** | 비기술자 접근 가능 / 프롬프트 + preview + 다운로드 통합 | 호스팅 / 인증 / 상태 관리 ↑ | Phase 1~5 (메인 UX) |

### 7.2 권장

- **Phase 1**: **CLI 만** 으로 출발. 노드 스크립트 5개 (`parse / infer / render / patch / export`). MVP 검증 빠름.
- **Phase 2~3**: CLI 위에 얇은 **Web UI** wrapper (Next.js + 동일 노드 모듈 호출). prompt textarea + iframe preview + 다운로드 버튼.
- **Phase 4+**: 시각 편집 / 협업 기능을 Web UI 에 추가.
- **VS Code extension**: 후순위 (개발자 대상이라면 CLI 로 충분).

```
                ┌──────────────────────────────┐
                │  공통 코어 (@scm-sim/*)       │
                │  parser / inferencer / ...    │
                └──────┬─────────────┬──────────┘
                       │             │
                ┌──────▼──────┐  ┌───▼────────┐
                │ CLI         │  │ Web UI     │
                │ (Phase 1)   │  │ (Phase 2~) │
                └─────────────┘  └────────────┘
```

---

## 8. 단계별 구현 로드맵

### Phase 1 — MVP (2~3 주)

목표: PRD 마크다운 → 작동 가능한 HTML 페이지를 한 번에 생성.

**작업 항목:**
1. `manifest/components.json` / `manifest/keywords.json` 작성 (컴포넌트 인벤토리에서 추출).
2. `@scm-sim/parser` — Markdown → IR (룰 기반 헤더/리스트/표 파싱).
3. `@scm-sim/inferencer` — 룰 기반 키워드 매칭만 (LLM 미사용).
4. `@scm-sim/renderer` — 템플릿 placeholder 치환 + 모듈 마커 합성.
5. CLI: `scm-sim build <prd.md> --out <dir>`.
6. 검증: 기존 7개 페이지를 PRD 로 역기술 → render 결과가 원본과 ≥80% 시각 일치하는지 확인.

**산출물:** Phase 1 CLI + 키워드 사전 + Phase 1 sample PRD 5개.

### Phase 2 — LLM 보조 추론 (2~4 주)

- 룰 매칭 실패 케이스를 Claude API 로 위임.
- PRD 자유도 ↑ (덜 구조화된 텍스트도 처리).
- LLM 응답을 manifest schema 로 강제 (function calling / JSON mode).
- LLM 의 추론 결과는 항상 사용자 confirm 게이트를 통과해야 적용.

### Phase 3 — 반복 수정 (3~4 주)

- `@scm-sim/editor` 의 NL→Patch 변환 (LLM).
- Patch 적용 + version history (`patches/`).
- Undo / redo CLI 명령.
- 간단한 Web UI (텍스트 prompt + iframe preview).

### Phase 4 — React 자동 변환 + 패키지 (2~3 주)

- `@scm-sim/exporter` 완성 (HTML → JSX, useState 추출, layout 분리, mock data 분리).
- zip 패키지 생성 + README 자동 생성.
- 시각 회귀 테스트 (Playwright): HTML preview vs React 빌드 결과 비교.

### Phase 5 — 시각 편집 / 협업 (4+ 주)

- Web UI 에서 컴포넌트 클릭 → 인라인 메뉴.
- Multi-user 협업 (CRDT 또는 server-side lock).
- 페이지 라이브러리 / 템플릿 공유.

---

## 9. 위험 / 제약

| 위험 | 영향 | 완화책 |
|---|---|---|
| **LLM hallucination** (잘못된 컴포넌트 추론) | 잘못된 페이지 생성 → 사용자 신뢰 저하 | 룰 우선 + LLM 응답 schema 강제 + 항상 사용자 confirm 게이트 |
| **디자인 시스템 spec 변경** 시 동기화 누락 | 구버전 마커로 export → 빌드 깨짐 | `manifest/components.json` 을 모듈 추출 시 자동 갱신하는 CI step. zip MANIFEST 에 모듈 버전 hash 기록 |
| **페이지 패턴 변형 한계** (5종 템플릿 외) | 신규 패턴 시 수동 작업 | 템플릿 추가 가이드 문서화. 사용자가 base 템플릿 선택 + 커스텀 영역 추가 가능 |
| **React 변환 정확도** (특히 동적 동작) | useState / 이벤트 / 라우팅 변환 누락 | JSX twin 을 1:1 매핑 (이미 검증됨). 동적 동작은 별도 hook 패턴 가이드 |
| **mock 데이터 의존** | 실 데이터 연결 시 schema 충돌 | OpenAPI spec 입력 옵션 (Phase 3+). mock generator 도 schema 기반 |
| **Patch 충돌** (사용자가 동시 다중 수정) | 상태 불일치 | append-only patch + linear history. 충돌 시 사용자에게 수동 머지 |

---

## 10. 성공 지표

| 지표 | 목표 (Phase 1) | 목표 (Phase 4) |
|---|---|---|
| **PRD → 작동 페이지 생성 시간** | 5 분 이내 | 30 초 이내 |
| **사용자 수정 반복 횟수** (PRD 1건당) | 평균 ≤ 10 회 | 평균 ≤ 3 회 |
| **React 변환 후 즉시 빌드 가능률** | ≥ 70% | ≥ 95% |
| **시각 회귀 일치율** (HTML preview vs React 결과) | ≥ 80% | ≥ 98% |
| **개발팀 핸드오프 만족도** (5점 만점) | ≥ 3.5 | ≥ 4.5 |
| **컴포넌트 추론 정확도** (룰 기반) | ≥ 80% (단순 PRD) | ≥ 90% (혼합) |
| **LLM 추론 정확도** (Phase 2+) | n/a | ≥ 85% (자유 PRD) |

---

## 11. 부록 A — 디렉토리 구조 제안

```
design-system/
├ components/                ← 기존 50+ 모듈
├ templates/                 ← 기존 5종 페이지 템플릿
├ docs/
│  ├ component-inventory.md
│  ├ react-export-guide.md
│  └ simulation-system.md   ← 본 문서
├ manifest/                  ← 신규 (Phase 1)
│  ├ components.json
│  ├ keywords.json
│  └ templates.json
└ tools/                     ← 신규
   ├ scm-sim/                ← Node 패키지
   │  ├ parser/
   │  ├ inferencer/
   │  ├ renderer/
   │  ├ editor/
   │  ├ exporter/
   │  └ cli.js               ← scm-sim CLI 진입점
   └ ui/                     ← Phase 2+ Web UI (Next.js)
```

런타임 작업공간은 별도:

```
.simulator/
└ runs/
   └ <runId>/                ← 한 번의 PRD 처리 단위
      ├ prd.md (또는 .yaml)
      ├ prd-ir.json
      ├ page-manifest.json
      ├ preview/
      │  ├ index.html
      │  ├ mock-data.json
      │  └ assets/
      ├ patches/
      │  ├ 0001-init.json
      │  ├ 0002-*.json
      │  └ HEAD
      └ export/
         └ <page>-<date>.zip
```

---

## 12. 부록 B — Phase 1 샘플 PRD → 페이지 흐름

**입력 (`sample.prd.md`):**

```markdown
# SKU 매핑 관리

## 페이지 유형
데이터 리스트 페이지

## 액션
- 신규 매핑 등록 (primary)

## 필터
- 브랜드, 시즌, 매핑 상태

## 통계
- 전체 / 매핑완료 / 미매핑

## 테이블 컬럼
- 체크박스, 브랜드, SKU, 매핑 상태, 등록일
```

**Parse:**

```
prd-ir.json:
{
  "page": { "id": "sku-mapping", "type": "data-list", "title": "SKU 매핑 관리",
    "sections": [
      { "kind": "actions", "items": [{ "label": "신규 매핑 등록", "variant": "primary" }] },
      { "kind": "filters", "items": ["브랜드", "시즌", "매핑 상태"] },
      { "kind": "stats", "items": ["전체", "매핑완료", "미매핑"] },
      { "kind": "table", "columns": [...] }
    ] } }
```

**Infer:**

```
page-manifest.json:
{ "tree": [
  { "component": "scm-page-head", "props": { "title": "...", "actions": [{ "component": "scm-button", "variant": "primary", "label": "신규 매핑 등록" }] } },
  { "component": "scm-filter-bar", "props": { "filters": [
    { "component": "scm-filter-select", "label": "브랜드" }, ... ] } },
  { "component": "scm-stats-bar", "props": { "stats": [
    { "component": "scm-stat", "variant": "all", "label": "전체" }, ... ] } },
  { "component": "scm-data-table", "props": { "columns": [...] } }
] }
```

**Render:**

`templates/data-list-page.html` 복사 + placeholder 치환 → `preview/index.html`.

**Edit (예시 명령):**

```
> "선택됨" 카운트 추가하고 변형은 selected 로
```

→ patch 0002 적용 → preview 갱신.

**Export:**

`pages/SkuMapping.jsx` + `sku-mapping.data.js` + 사용 모듈 + zip.

---

## 13. 다음 단계 (즉시 액션)

1. **Manifest 작성**: `manifest/components.json` 및 `manifest/keywords.json` 초안. `docs/component-inventory.md` 의 표를 JSON 으로 변환.
2. **Phase 1 PoC 스크립트**: `tools/scm-sim/cli.js` 단일 파일에 parse/infer/render/export 의 minimal 구현. PRD 1건 → HTML 1개 생성.
3. **검증 페이지 선정**: 기존 7개 마이그레이션 페이지 중 가장 단순한 것(예: `dashboard.html` 또는 `sku-detail.html`) 을 PRD 로 역기술 → render 결과 비교.
4. **시각 회귀 도구 결정**: Playwright vs jest-image-snapshot — Phase 1 검증용.

---

> **본 문서는 살아있는 문서입니다.** Phase 진행 시 발견되는 제약 / 추가 패턴 / 신규 모듈은 본 문서에 반영하고 버전 갱신.
