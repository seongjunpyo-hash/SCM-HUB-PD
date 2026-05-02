# SCM Hub — Component Inventory

> **Phase A 산출물.** 7개 페이지 + LNB drawer 정독 기반 컴포넌트 인벤토리.
> Phase B(추출) 의 source of truth. 추출 진행 시 이 문서의 마이그레이션 트래커에 상태 갱신.
>
> 작성: 2026-05-01 · 기준 파일: `scm hub/*.html`

---

## 0. Executive Summary

- **조사 대상**: 7개 페이지 (`index.html`, `sku-management.html`, `editshop-restock-request.html`, `editshop-restock-status.html`, `sku-detail.html`, `sku-register.html`, `dashboard.html`) + `lnb-drawer.html`
- **컴포넌트 후보**: 약 90개 식별 → 진짜 공통(2+ 페이지) 약 35개
- **현재 prefix 혼란**: `ld-` (토큰, 유지) / `mp-`, `sd-(드로어)`, `bu-`, `af-`, `er-`, `sd-(detail)`, `reg-`, `db-`, `lnb-` (페이지·기능 단위 — 모두 deprecated)
- **타겟 prefix**: 새 공통 컴포넌트는 `scm-<name>` 으로 통일
- **출력 모듈 형태**: 각 컴포넌트가 `<name>.css` + `<name>.js` + `<name>.html` (canonical marker) + `<name>.jsx` (React twin) + `README.md` 의 5종 파일을 갖는 자가포함 모듈

---

## 1. 페이지 카탈로그

### 1.1 데이터 리스트 페이지 (4)

| # | 파일 | 화면명 | 라인수 | 인라인 prefix |
|---|---|---|---|---|
| L1 | `index.html` | 무탠 전개상품 관리 | ~3,700 | mp, bu, sd, toast |
| L2 | `sku-management.html` | SKU 관리 | ~2,500 | mp, bu, mp-info-banner |
| L3 | `editshop-restock-request.html` | 편집샵 보충 요청 | ~3,100 | mp, bu, er |
| L4 | `editshop-restock-status.html` | 편집샵 보충 현황 | ~3,300 | mp, er |

공통 골격: TopBar → LNB → PageHead → FilterBar → StatsRow → DataTable + (Modal/Popover/Drawer 오버레이)

### 1.2 상세 페이지 (1)

| # | 파일 | 화면명 | 라인수 | 인라인 prefix |
|---|---|---|---|---|
| D1 | `sku-detail.html` | SKU 상세 | 965 | sd (detail용 — 무탠의 sd-drawer 와 prefix 충돌) |

골격: TopBar → LNB → PageHead(back) → 2-Col(Aside 320px + Main flex) → 다중 Section + UID Cards

### 1.3 폼 페이지 (1)

| # | 파일 | 화면명 | 라인수 | 인라인 prefix |
|---|---|---|---|---|
| F1 | `sku-register.html` | SKU 등록 | 1,122 | mp, reg |

골격: TopBar → LNB → PageHead(back) → InfoBanner → FormCard(white) → FormCard(gray) → PendingSection → StickyBottomBar

### 1.4 대시보드 (1)

| # | 파일 | 화면명 | 라인수 | 인라인 prefix |
|---|---|---|---|---|
| B1 | `dashboard.html` | 대시보드 | 616 | db |

골격: TopBar → LNB → PageHead(+PeriodTabs) → KPI Grid(4) → 2-Col Card Section(Chart + List) → Quick Link Grid(4)

### 1.5 네비게이션 드로어 (1)

| # | 파일 | 화면명 | 라인수 | 인라인 prefix |
|---|---|---|---|---|
| N1 | `lnb-drawer.html` | LNB 확장 드로어 | 129 | lnb |

골격: Drawer Header → Profile Section → Nav Group(L1 + L2) → Action Bar → Backdrop

---

## 2. 컴포넌트 카탈로그

표 형식: **legacy 클래스** → **새 모듈명(`scm-*`)** | 사용처 | 변형/상태 | 우선순위 Tier

### Tier S — 페이지 골격 (모든 페이지)

| Legacy class | 새 모듈명 | 사용처 | 변형 / 상태 | 비고 |
|---|---|---|---|---|
| `.topbar` | `scm-topbar` | All | 64h | 로고 + Demo 태그 + 사용자 메뉴 |
| `.lnb`, `.lnb-l1`, `.lnb-l2` | `scm-lnb` | All | collapsed/expanded, is-active | 좌측 네비, sticky |
| `.lnb-tag` | `scm-lnb-tag` | All | --new / --wip | 메뉴 항목 배지 |
| `.lnb-drawer` | `scm-lnb-drawer` | N1 | hidden, profile-menu open | 풀 LNB 모달형 (전체 메뉴) |
| `.mp-page-head` / `.sd-page-head` / `.db-page-head` | `scm-page-head` | All | default / with-back / with-tabs | 4 변형 |
| `.mp-page-title` etc | `scm-page-title` | All | — | 22-26px h1 |
| `.mp-action-btn` | `scm-action-btn` | All | --primary, disabled | 헤더 우측 액션 |
| `.mp-back-btn` / `.sd-back-btn` | `scm-back-btn` | D1, F1 | hover | 36×36 arrow-left |
| `.toast-stack`, `.toast` | `scm-toast` | L1 (확장 예정) | --success / --info / --critical, is-leaving | 우상단 토스트 |
| `.mp-modal-backdrop` / `.bu-backdrop` / `.sd-backdrop` / `.mp-af-backdrop` | `scm-backdrop` | All overlays | is-open, hidden | z-index 통일 필요 |

### Tier 1 — 데이터 리스트 페이지 골격 (L1~L4)

| Legacy class | 새 모듈명 | 사용처 | 변형 / 상태 | 비고 |
|---|---|---|---|---|
| `.mp-filter-bar` | `scm-filter-bar` | L1~L4 | overflow-fade | 가로 스크롤 + fade gradient |
| `.mp-filter-chip` | `scm-filter-chip` | L1~L4 | with-count, --all | "전체 필터" 칩 |
| `.mp-filter-select` | `scm-filter-select` | L1~L4 | placeholder / filled / active, aria-expanded | 개별 필터 칩 |
| `.mp-filter-overflow`, `.mp-filter-track` | (`scm-filter-bar` 내부 슬롯) | L1~L4 | scrollbar-hidden | |
| `.mp-search-btn` | `scm-search-btn` | L1~L4 | disabled / enabled / outline | |
| `.mp-filter-reset-btn` | `scm-filter-reset-btn` | L1~L4 | hidden / visible | |
| `.mp-filter-popover-root`, `.mp-filter-popover` | `scm-filter-popover` | L1~L4 | --codeinput / --list / --list-single / --multi | 4가지 모드 — 모드별 마크업 슬롯 |
| `.mp-filter-popover-search` | (`scm-filter-popover` 내부) | — | has-q | |
| `.mp-filter-popover-item` | (`scm-filter-popover` 내부) | — | data-selected | |
| `.mp-af-drawer` | `scm-filter-drawer` | L1~L4 | hidden, is-open | "전체 필터" 좌측 드로어 480w |
| `.mp-af-section`, `.mp-af-chip`, `.mp-af-row`, `.mp-af-textarea` | (`scm-filter-drawer` 내부) | — | data-selected | 섹션 변형: chip / multi / textarea |
| `.mp-stats-row`, `.mp-stats-left`, `.mp-stats-right` | `scm-stats-bar` | L1~L4 | sticky | 좌측 카운트 + 미니액션, 우측 툴바 |
| `.mp-stat` | `scm-stat` | L1~L3 | --all / --deployed / --undeployed / --selected | 카운트 + 라벨 |
| `.mp-stats-counts` divider | (`scm-stats-bar` 내부) | — | — | 3×3 점 divider |
| `.mp-mini-action`, `.mp-mini-popup` | `scm-mini-action` | L1~L4 | aria-expanded, disabled, --primary | 드롭다운형 미니버튼 |
| `.mp-pager` + `.pbtn` | `scm-pager` | L1~L4 | disabled | "1 / 99 페이지" + ‹ › |
| `.mp-pgsize` | `scm-pgsize-select` | L1~L4 | aria-expanded | 20/50/100/200 |
| `.download` | `scm-download-btn` | L1~L4 | — | 다운로드 outlined 버튼 |
| `.mp-table-host`, `.mp-thead-sticky`, `.mp-table` | `scm-data-table` (이미 부분 추출됨: `components/scm-table/`) | L1~L4 | --grouped (2단 thead) / default | sticky thead + frozen cols + cell selection. **재사용** |
| `.mp-empty-hint` | `scm-empty-hint` | L1~L4 | hidden | "조건에 맞는 항목 없음" |

### Tier 2 — 데이터 리스트 셀 인라인 (대부분 L1~L4)

| Legacy class | 새 모듈명 | 사용처 | 변형 / 상태 | 비고 |
|---|---|---|---|---|
| `.mp-cb` | `scm-checkbox` | All forms/lists | aria-checked, indeterminate | 16×16 SVG |
| `.mp-color-chip` | `scm-color-chip` | L1, L2 | — | 컬러 태그 |
| `.tag` (mp-season 내부) | `scm-tag` | L1, L4 | default | 시즌/일반 태그 |
| `.mp-deploy` (.pill + dot) | `scm-deploy-pill` | L1, L2, L3 | is-deployed / is-undeployed / is-partial | 전개 상태 + chevron |
| `.mp-sizeset` | `scm-sizeset-btn` | L1, L2, L4 | — | "전개 N/M" 버튼 |
| `.mp-link.mp-uid-trigger` / `.mp-code-trigger` | `scm-code-link` | L1~L4 | data-code-type | 클릭 시 code-popover 트리거 |
| `.mp-code-popover` (+ backdrop) | `scm-code-popover` | L1~L4 | is-open | UID/SKU/바코드 묶음 보기 |
| `.mp-deploy-popover` | `scm-deploy-popover` | L1, L3, L4 | is-open | 셀 chevron 클릭 시 옵션 |
| `.cell-clamp` | (utility class) | All tables | — | 텍스트 줄임 |

### Tier 3 — 모달 / 드로어 / 오버레이

| Legacy class | 새 모듈명 | 사용처 | 변형 / 상태 | 비고 |
|---|---|---|---|---|
| `.mp-modal` | `scm-confirm-modal` | L1~L4 | is-open | 확인 모달 (취소/변경) |
| `.bu-modal` | `scm-bulk-upload-modal` | L1, L2, L3 | is-open | 1024w, warning + type-select + history 섹션 |
| `.bu-warning` | (`scm-bulk-upload-modal` 내부) | — | is-collapsed | 주의사항 배너 |
| `.bu-radio` | `scm-form-radio` (공통화 가능) | bu-modal, F1 | aria-disabled | |
| `.bu-select` | `scm-form-select` (공통화 가능) | bu-modal, F1 | aria-expanded | |
| `.bu-history-table` | (`scm-bulk-upload-modal` 내부) | — | — | 업로드 이력 테이블 |
| `.bu-status-pill` | (`scm-bulk-upload-modal` 내부) | — | data-state=processing/done/partial | |
| `.sd-drawer` (size detail) | `scm-side-drawer` (generic) | L1 (size-detail), 확장 가능 | hidden, is-open | 우측 슬라이드 드로어 848w |

### Tier 4 — 상세/폼/대시보드 공통 컨테이너

| Legacy class | 새 모듈명 | 사용처 | 변형 / 상태 | 비고 |
|---|---|---|---|---|
| `.db-card`, `.reg-card`, `.sd-section` | `scm-card` | D1, F1, B1 | --white / --gray | 카드 컨테이너 (head + body) |
| `.db-card-head`, `.db-card-title`, `.sd-section-title` | `scm-card-head` | D1, F1, B1 | with-link | 카드 헤더 |
| `.sd-section-count` | `scm-section-count` | D1 | — | 섹션 옆 카운트 배지 |
| `.sd-section-tabs`, `.db-period-tabs` | `scm-tabs` | D1, B1 | --underline (sd) / --pill (db period) | 2가지 변형 |
| `.sd-info-table`, `.sd-aside-table` | `scm-info-table` | D1 | --quad (4-col) / default (2-col) | label(134w) + value flex |
| `.mp-info-banner` | `scm-info-banner` | L2, F1 | is-collapsed | 회색 배경 안내 배너 |

### Tier 5 — 폼 페이지 컴포넌트 (F1 + 부분 L1~L4 BulkUpload)

| Legacy class | 새 모듈명 | 사용처 | 변형 / 상태 | 비고 |
|---|---|---|---|---|
| `.form-row`, `.form-label`, `.form-control` | `scm-form-row` | F1 (확장 예정: bu-modal) | label width: --w60 / --w120 / --w140 | label + control |
| `.req-dot` | (`scm-form-row` 내부) | F1 | — | 4×4 파란 점 |
| `.form-input`, `.form-input-wrap`, `.char-count` | `scm-input` | F1, BU | disabled, focus, with-counter | |
| `.form-select` | `scm-select` | F1, BU | placeholder/filled, disabled | (sd-select-mock도 흡수) |
| `.form-radio`, `.form-radio-group`, `.form-radio-2col` | `scm-radio` | F1, BU | checked, disabled | 단일/2열 그룹 |
| `.option-indent` | `scm-option-indent` | F1 | — | padding 24l + border-left 2px (조건부 하위) |
| `.option-row-controls` | (`scm-form-row` slot) | F1 | — | 한 줄에 여러 입력 |
| `.option-btn` | `scm-form-row-btn` | F1 | --add, disabled | 옵션행 액션 버튼 |
| `.reg-action-row` | `scm-form-action-row` | F1 | spacer 변형 | |
| `.btn-primary-disabled`, `.btn-outline-disabled` | `scm-button` | F1 | --primary / --outline, disabled | (mp-action-btn 흡수) |
| `.reg-pending-stats` | `scm-pending-stats` | F1 | --ok / --ng | 통계 + 미니체크박스 + 미니액션 |
| `.reg-pending-empty` | `scm-empty-state` | F1 | --table (확장: list, dashboard) | icon + title + desc |
| `.reg-bottom-bar` | `scm-sticky-bottom-bar` | F1 | — | fixed bottom + backdrop blur |
| `.sd-toggle-mock` (detail) | `scm-toggle` | D1, L1(sd-drawer) | is-on | On/Off 토글 |

### Tier 6 — 대시보드 전용

| Legacy class | 새 모듈명 | 사용처 | 변형 / 상태 | 비고 |
|---|---|---|---|---|
| `.db-kpi-card` | `scm-kpi-card` | B1 | with-delta | 지표 카드 |
| `.db-kpi-icon-box` | `scm-icon-box` | B1 | --blue / --green / --orange / --red | 36×36 아이콘 배지 |
| `.db-kpi-delta` | `scm-delta` | B1 | --up / --down | 화살표 + % |
| `.db-list-item`, `.db-list-icon`, `.db-list-content`, `.db-list-time` | `scm-activity-item` | B1 (확장: 활동/알림) | icon variants | icon + content + time |
| `.db-quick-card` | `scm-quick-link-card` | B1 | hover-blue | a 태그, icon-box + title + desc |
| `.db-chart`, `.db-chart-bar` | `scm-bar-chart` (mock) | B1 | is-light | 단순 막대 (실제는 차트 lib 도입 가능) |
| `.db-section`, `.db-section-head` | `scm-page-section` | B1 (확장: 모든 페이지 가능) | — | margin-top 32 + head |

### Tier 7 — 상세 페이지 전용

| Legacy class | 새 모듈명 | 사용처 | 변형 / 상태 | 비고 |
|---|---|---|---|---|
| `.sd-uid-card` (detail) | `scm-collapsible-card` | D1 (확장 가능) | is-collapsed | minus/plus 토글 |
| `.sd-platform-tag` | `scm-platform-tag` | D1 | data-color=blue/yellow/gray | 플랫폼 배지 |
| `.sd-barcode-card`, `.sd-barcode-add` | `scm-barcode-card` | D1 | with-chip | 바코드 정보 카드 |
| `.sd-cover` | (이미지 슬롯) | D1 | — | 320×384 커버 |
| `.sd-tags` | (`scm-tag` 의 stack) | D1 | — | 옵션 태그 묶음 |
| `.sd-state-text` | `scm-state-text` | D1 | --accent / --critical | 파랑/빨강 텍스트 |
| `.sd-aside`, `.sd-body` | (template `detail-page`) | D1 | — | 2-column 페이지 레이아웃 |

### Tier 8 — 페이지 도메인 특화

| Legacy class | 새 모듈명 | 사용처 | 변형 / 상태 | 비고 |
|---|---|---|---|---|
| `.er-date-card`, `.er-date-row` | `scm-date-card-row` | L3 | --multi / default | 날짜 정보 3-카드 |
| `.er-forecast-chip` | `scm-forecast-chip` | L3 | dynamic class | 판매예측치 칩 |
| `.er-kind-chip` | `scm-kind-chip` | L3 | dynamic class | 입고/발주/재발주 칩 |
| `.er-status-chip` | `scm-status-chip` | L4 | dynamic class | 상태 칩 (입고대기/완료) |
| `.er-tag` | `scm-tag` (variants 추가) | L4 | --blue / --gray / --green | 초도/재발주/자동/수동 |
| `.er-name` | `scm-product-name` | L3, L4 | with-thumbnail | 좌 썸네일 + 텍스트 |
| `.er-input-cell`, `.er-max-btn` | `scm-input-cell` | L3 | with-max-btn | 셀 안 인라인 입력 |
| `.er-num-accent`, `.er-num-success` | (utility colors) | L3, L4 | — | 강조 숫자 |
| `.er-promo`, `.er-popup-info`, `.er-center-info` | `scm-detail-stack` | L3, L4 | — | 메타 텍스트 묶음 |

---

## 3. 의존 그래프

추출 순서를 정하기 위한 의존 관계. 화살표는 "A 가 B 에 의존" = B 가 먼저 필요.

```
[tokens (ld-*)]               ← 이미 있음
  ↓
[scm-backdrop]
  ↓
[scm-icon-box] [scm-checkbox] [scm-tag] [scm-color-chip] [scm-state-text] [scm-platform-tag] [scm-toggle]
  ↓
[scm-button] [scm-input] [scm-select] [scm-radio]
  ↓
[scm-form-row]
  ↓
[scm-empty-hint] [scm-empty-state] [scm-toast]
  ↓
[scm-pager] [scm-pgsize-select] [scm-download-btn] [scm-search-btn] [scm-filter-reset-btn] [scm-back-btn] [scm-action-btn]
  ↓
[scm-mini-action] (= button + popup)
  ↓
[scm-card] [scm-section-count] [scm-page-section]
  ↓
[scm-info-table] [scm-info-banner] [scm-tabs]
  ↓
[scm-code-popover] [scm-deploy-popover] [scm-deploy-pill] [scm-sizeset-btn] [scm-code-link]
  ↓
[scm-confirm-modal] [scm-side-drawer] [scm-bulk-upload-modal]
  ↓
[scm-filter-chip] [scm-filter-select] [scm-filter-popover]
  ↓
[scm-filter-bar] [scm-filter-drawer]
  ↓
[scm-stat] → [scm-stats-bar]
  ↓
[scm-page-head] (변형 4종)
  ↓
[scm-data-table] (= 기존 scm-table 모듈, 마이그레이션 필요)
  ↓
[scm-kpi-card] [scm-activity-item] [scm-quick-link-card] [scm-collapsible-card] [scm-barcode-card]
  ↓
[scm-pending-stats] [scm-form-action-row] [scm-sticky-bottom-bar]
  ↓
[scm-product-name] [scm-input-cell] [scm-date-card-row] [scm-forecast-chip] [scm-kind-chip] [scm-status-chip]
  ↓
[Page Templates: data-list, detail, form, dashboard, navigation-drawer]
```

병렬 가능: 같은 row 의 컴포넌트들은 서로 독립이므로 병렬 추출 가능.

---

## 4. 추출 우선순위 (Phase B 작업 순서)

총 **약 50개** 모듈. 순차 작업이 아닌 의존 그래프에 따른 단계(stage)별 진행:

### Stage 0 — 인프라 (이미 일부 존재)
- [✓] `ld-` 토큰 / 베이스 (`layer-desktop.css`)
- [✓] `scm-table` 모듈 (`components/scm-table/`) — 단, 클래스명을 `mp-*` → `scm-*` 로 마이그레이션 필요

### Stage 1 — Atoms (의존 없음)
1. `scm-backdrop`
2. `scm-icon-box` (KPI/리스트 공용)
3. `scm-checkbox`
4. `scm-tag` (variants: --blue / --gray / --green / 시즌)
5. `scm-color-chip`
6. `scm-state-text`
7. `scm-platform-tag`
8. `scm-toggle`
9. `scm-empty-hint`
10. `scm-empty-state`
11. `scm-toast`
12. `scm-section-count`

### Stage 2 — Form 원자 / 작은 버튼들
13. `scm-button` (variants: --primary / --outline, size: --md / --lg, disabled)
14. `scm-input` (with-counter)
15. `scm-select` (placeholder / filled)
16. `scm-radio` (group, 2-col)
17. `scm-back-btn`
18. `scm-action-btn` ← 사실상 `scm-button` 의 변형. 흡수 검토
19. `scm-search-btn`
20. `scm-filter-reset-btn`
21. `scm-download-btn`

### Stage 3 — 작은 composites
22. `scm-form-row` (= label + control)
23. `scm-pager`
24. `scm-pgsize-select`
25. `scm-mini-action` (= button + popup)
26. `scm-page-section`

### Stage 4 — 컨테이너 / 카드
27. `scm-card` (white/gray)
28. `scm-info-table` (2/4-col)
29. `scm-info-banner` (collapsible)
30. `scm-tabs` (--underline / --pill)
31. `scm-collapsible-card`

### Stage 5 — 셀 인라인 / 코드 popover
32. `scm-code-link`
33. `scm-code-popover`
34. `scm-deploy-pill`
35. `scm-deploy-popover`
36. `scm-sizeset-btn`

### Stage 6 — 오버레이 (모달 / 드로어)
37. `scm-confirm-modal`
38. `scm-side-drawer` (generic)
39. `scm-bulk-upload-modal`

### Stage 7 — 필터 시스템 (서로 결합)
40. `scm-filter-chip`
41. `scm-filter-select`
42. `scm-filter-popover` (4 modes)
43. `scm-filter-bar`
44. `scm-filter-drawer`

### Stage 8 — Stats / Page Head
45. `scm-stat`
46. `scm-stats-bar`
47. `scm-page-head` (4 variants: list / detail / form / dashboard)

### Stage 9 — `scm-table` 마이그레이션
48. `scm-data-table` (= 기존 scm-table 의 클래스 리네임 + 정리)

### Stage 10 — 도메인 / 페이지 특화
49. `scm-kpi-card`
50. `scm-activity-item`
51. `scm-quick-link-card`
52. `scm-bar-chart` (mock)
53. `scm-barcode-card`
54. `scm-pending-stats`
55. `scm-form-action-row`
56. `scm-sticky-bottom-bar`
57. `scm-product-name`
58. `scm-input-cell`
59. `scm-date-card-row`
60. `scm-forecast-chip`
61. `scm-kind-chip`
62. `scm-status-chip`
63. `scm-detail-stack`

### Stage 11 — 페이지 템플릿
64. `templates/data-list-page.html`
65. `templates/detail-page.html`
66. `templates/form-page.html`
67. `templates/dashboard-page.html`
68. `templates/navigation-drawer.html`

### Stage 12 — 페이지 슬림화
- L1~L4, D1, F1, B1, N1 페이지를 모듈 사용 형태로 리라이트
- 인라인 `<style>` / `<script>` 제거 → 모듈 import 만 남김

### Stage 13 — React export 파이프라인
- 각 모듈의 `<name>.jsx` 가 모두 갖춰진 시점에 HTML→JSX 변환 스크립트 작성
- 페이지 템플릿도 JSX 페이지로 변환

---

## 5. 네이밍 / 파일 컨벤션

### 5.1 클래스 네이밍

- 공통 컴포넌트: `scm-<name>` (예: `scm-modal`, `scm-filter-popover`)
- 컴포넌트 내부 요소: `scm-<name>__<part>` (BEM-like) 또는 `scm-<name>-<part>` 중 하나로 통일
  - **결정**: `scm-<name>-<part>` (대시 일관성 우선, BEM `__` 보다 코드/HTML 가독성 좋음)
  - 예: `scm-card`, `scm-card-head`, `scm-card-body`, `scm-card-title`
- 변형(variant): `scm-<name>--<variant>` 또는 modifier class `is-<state>`
  - 시각적 변형: `--variant` (예: `scm-button--primary`, `scm-card--gray`)
  - 동적 상태: `is-` (예: `is-open`, `is-active`, `is-disabled`)
- 토큰 변수: `--ld-` 유지 (LayerDesktop 베이스)
- 컴포넌트 로컬 변수: `--scm-<name>-<key>` (예: `--scm-modal-radius`)

### 5.2 파일 구조

```
design-system/
  layer-desktop.css           ← 토큰 / 베이스 (기존)
  index.html                  ← 컴포넌트 카탈로그 (확장 예정)
  
  components/
    <name>/
      <name>.css              ← 자가포함 스타일
      <name>.js               ← factory: window.SCM.<name>.mount(el, opts)
      <name>.html             ← canonical marker (복붙용)
      <name>.jsx              ← React twin
      README.md               ← spec / props / states / 사용처
      demo.html               ← (선택) iframe 격리 데모
  
  templates/
    data-list-page.html
    detail-page.html
    form-page.html
    dashboard-page.html
    navigation-drawer.html
  
  docs/
    component-inventory.md    ← 본 문서
    dev-handoff.md            ← (기존)
    data-list-page.md         ← (기존)
    components.md             ← (기존, 신규 모듈로 갱신 예정)
    table-columns.md          ← (기존)
    tokens.md                 ← (기존)
    icons.md                  ← (기존)
```

### 5.3 JS 컨벤션

- 전역 네임스페이스: `window.SCM`
- 각 모듈: `window.SCM.<name> = { mount(el, opts), unmount(el), ... }`
- 마운트는 idempotent (같은 element 에 여러 번 호출해도 안전)
- 이벤트는 element 에 `addEventListener` 로 직접 → JSX 변환 시 props 매핑 쉬움
- 외부 의존 없음 (vanilla, DOM API only)
- ESM export 도 추가하여 향후 빌드 시스템 도입 대비:
  ```js
  export const Modal = { mount, unmount };
  if (typeof window !== 'undefined') {
    window.SCM = window.SCM || {};
    window.SCM.modal = Modal;
  }
  ```

### 5.4 JSX twin 컨벤션

- 동일 DOM 구조, 동일 className, 동일 data-attr
- 외부 props 는 marker HTML 의 data-attr 또는 명시적 slot 과 1:1 매핑
- Hooks 만 사용 (class component 금지)
- default export
- 예시:
  ```jsx
  // components/modal/modal.jsx
  export default function Modal({ open, title, children, onCancel, onConfirm }) {
    return (
      <>
        <div className={`scm-backdrop ${open ? 'is-open' : ''}`} onClick={onCancel} />
        <div className={`scm-modal ${open ? 'is-open' : ''}`} role="dialog" aria-labelledby="m-title">
          <h3 id="m-title">{title}</h3>
          <div className="scm-modal-body">{children}</div>
          <div className="scm-modal-actions">
            <button onClick={onCancel}>취소</button>
            <button className="primary" onClick={onConfirm}>변경</button>
          </div>
        </div>
      </>
    );
  }
  ```

### 5.5 카탈로그 (`design-system/index.html`)

각 컴포넌트마다 한 섹션:

```
<section id="component-modal">
  <h2>scm-modal</h2>
  <p class="desc">확인 모달 — 단건/일괄 처리 확인용.</p>
  
  <h3>Live Demo</h3>
  <div class="demo">
    <button onclick="window.SCM.modal.open({ title: '...', desc: '...' })">Open</button>
  </div>
  
  <h3>Marker HTML</h3>
  <pre class="code">...</pre>
  
  <h3>Variants / States</h3>
  <table>...</table>
  
  <h3>Source</h3>
  <a href="components/modal/">components/modal/</a>
  
  <h3>Used in</h3>
  <ul>
    <li>scm hub/index.html</li>
    <li>scm hub/sku-management.html</li>
    ...
  </ul>
</section>
```

---

## 6. 마이그레이션 상태 트래커

진행 상태를 한 표에서 추적. 추출 PR 마다 갱신.

| Stage | 모듈 | 상태 | 의존 | 비고 |
|---|---|---|---|---|
| 0 | ld-tokens | ✓ 존재 | — | layer-desktop.css |
| 0 | scm-table | △ 부분 (legacy mp- 클래스) | tokens | components/scm-table/ — 클래스 리네임 필요 |
| 1 | scm-backdrop | ✓ 추출 (2026-05-01) | — | components/backdrop/ |
| 1 | scm-icon-box | ✓ 추출 (2026-05-01) | — | components/icon-box/ |
| 1 | scm-checkbox | ✓ 추출 (2026-05-01) | — | components/checkbox/ |
| 1 | scm-tag | ✓ 추출 (2026-05-01) | — | components/tag/ — variants 통합: 시즌 / restock |
| 1 | scm-color-chip | ✓ 추출 (2026-05-01) | — | components/color-chip/ |
| 1 | scm-state-text | ✓ 추출 (2026-05-01) | — | components/state-text/ |
| 1 | scm-platform-tag | ✓ 추출 (2026-05-01) | — | components/platform-tag/ |
| 1 | scm-toggle | ✓ 추출 (2026-05-01) | — | components/toggle/ |
| 1 | scm-empty-hint | ✓ 추출 (2026-05-01) | — | components/empty-hint/ |
| 1 | scm-empty-state | ✓ 추출 (2026-05-01) | — | components/empty-state/ |
| 1 | scm-toast | ✓ 추출 (2026-05-01) | — | components/toast/ — 모든 페이지 확산 필요 |
| 1 | scm-section-count | ✓ 추출 (2026-05-01) | — | components/section-count/ |
| 2 | scm-button | ✓ 추출 (2026-05-01) | — | components/button/ — mp-action-btn 흡수, primary/ghost variants, sm/md/lg sizes |
| 2 | scm-input | ✓ 추출 (2026-05-01) | — | components/input/ — counter wrap 포함 |
| 2 | scm-select | ✓ 추출 (2026-05-01) | — | components/select/ — sd-select-mock + bu-select 흡수, dot prefix 옵션 |
| 2 | scm-radio | ✓ 추출 (2026-05-01) | — | components/radio/ — form-radio + bu-radio 통합 |
| 2 | scm-back-btn | ✓ 추출 (2026-05-01) | — | components/back-btn/ — sd-back-btn + mp-back-btn 통합 |
| 2 | scm-search-btn | ✓ 추출 (2026-05-01) | — | components/search-btn/ — disabled-default 패턴 |
| 2 | scm-filter-reset-btn | ✓ 추출 (2026-05-01) | — | components/filter-reset-btn/ |
| 2 | scm-download-btn | ✓ 추출 (2026-05-01) | — | components/download-btn/ |
| 3 | scm-form-row | ✓ 추출 (2026-05-01) | — | components/form-row/ — label widths (60/120/140) + control widths (320/360/full) |
| 3 | scm-pager | ✓ 추출 (2026-05-01) | — | components/pager/ — 현재/전체 + ‹ › 36×36 ghost |
| 3 | scm-pgsize-select | ✓ 추출 (2026-05-01) | — | components/pgsize-select/ — h36 114w + popup. 자체 popup 관리 |
| 3 | scm-mini-action | ✓ 추출 (2026-05-01) | — | components/mini-action/ — 단순 버튼 / 드롭다운형 양쪽 지원, --primary variant |
| 3 | scm-page-section | ✓ 추출 (2026-05-01) | — | components/page-section/ — head + title + 우측 link 슬롯 |
| 4 | scm-card | ✓ 추출 (2026-05-01) | — | components/card/ — db-card + reg-card 통합. white/gray, head/title/body/section/divider/link |
| 4 | scm-info-table | ✓ 추출 (2026-05-01) | — | components/info-table/ — sd-info-table 흡수. 2/4-col (`--quad`) |
| 4 | scm-info-banner | ✓ 추출 (2026-05-01) | — | components/info-banner/ — mp-info-banner 흡수. collapsible, --full |
| 4 | scm-tabs | ✓ 추출 (2026-05-01) | — | components/tabs/ — sd-section-tabs(`--underline`) + db-period-tabs(`--pill`) 통합 |
| 4 | scm-collapsible-card | ✓ 추출 (2026-05-01) | — | components/collapsible-card/ — sd-uid-card 흡수, minus/plus 자동 전환 |
| 5 | scm-code-link | ✓ 추출 (2026-05-01) | — | components/code-link/ — mp-link / mp-uid-trigger / mp-code-trigger 흡수, __extra 보조 |
| 5 | scm-code-popover | ✓ 추출 (2026-05-01) | — | components/code-popover/ — 자체 backdrop 포함 (외부 의존 없음). 글로벌 SCM.codePopover.open/close API |
| 5 | scm-deploy-pill | ✓ 추출 (2026-05-01) | — | components/deploy-pill/ — pill+chev split, --deployed/--undeployed/--partial. scm-deploy-cell 도우미 포함 |
| 5 | scm-deploy-popover | ✓ 추출 (2026-05-01) | — | components/deploy-popover/ — 글로벌 SCM.deployPopover.open/close. data-current 체크 표시 |
| 5 | scm-sizeset-btn | ✓ 추출 (2026-05-01) | — | components/sizeset-btn/ — h36 outlined "전개 N/M" |
| 6 | scm-confirm-modal | ✓ 추출 (2026-05-01) | — | components/confirm-modal/ — 자체 backdrop 포함, 글로벌 SCM.confirmModal.open/close, descHtml 지원 |
| 6 | scm-side-drawer | ✓ 추출 (2026-05-01) | — | components/side-drawer/ — generic 우측 드로어, sm/md/lg sizes, head/body/footer 슬롯 |
| 6 | scm-bulk-upload-modal | ✓ 추출 (2026-05-01) | scm-radio, scm-select, scm-button | components/bulk-upload-modal/ — 1024w 큰 모달, warning + type-section + history-table 자체 sub 포함. radio/select/button 은 외부 모듈 활용 |
| 7 | scm-filter-chip | ✓ 추출 (2026-05-01) | — | components/filter-chip/ — h44 outlined, count 표시 |
| 7 | scm-filter-select | ✓ 추출 (2026-05-01) | — | components/filter-select/ — floating label, data-state placeholder/filled/active, scm-filter-group 보조 |
| 7 | scm-filter-popover | ✓ 추출 (2026-05-01) | — | components/filter-popover/ — 4 modes (codeinput/list/list-single/multi), search row + footer (reset+apply) |
| 7 | scm-filter-bar | ✓ 추출 (2026-05-01) | scm-filter-chip, scm-filter-select | components/filter-bar/ — sticky + 가로 스크롤 + 좌우 fade gradient |
| 7 | scm-filter-drawer | ✓ 추출 (2026-05-01) | — | components/filter-drawer/ — 좌측 480w 슬라이드, top:64 + left:LNB-width, header/sections/footer. side-drawer 와는 별도 (위치/방향) |
| 8 | scm-stat | ✓ 추출 (2026-05-01) | — | components/stat/ — variants --all/--deployed/--undeployed/--selected, scm-stat-divider 포함 |
| 8 | scm-stats-bar | ✓ 추출 (2026-05-01) | scm-stat | components/stats-bar/ — left (counts + mini-actions) + right (ts/download/pager/pgsize) 슬롯, --sticky |
| 8 | scm-page-head | ✓ 추출 (2026-05-01) | — | components/page-head/ — 4 variants: --list / --detail / --form / --dashboard |
| 9 | scm-data-table | TODO | tokens | scm-table 리네임 |
| 10 | scm-kpi-card | TODO | scm-card, scm-icon-box | |
| 10 | scm-activity-item | TODO | scm-icon-box | |
| 10 | scm-quick-link-card | TODO | scm-card, scm-icon-box | |
| 10 | scm-bar-chart | TODO | — | mock |
| 10 | scm-barcode-card | TODO | scm-card | |
| 10 | scm-pending-stats | TODO | scm-checkbox, scm-mini-action | |
| 10 | scm-form-action-row | TODO | scm-button | |
| 10 | scm-sticky-bottom-bar | TODO | scm-button | |
| 10 | scm-product-name | TODO | — | |
| 10 | scm-input-cell | TODO | scm-input | |
| 10 | scm-date-card-row | TODO | — | |
| 10 | scm-forecast-chip | TODO | scm-tag | |
| 10 | scm-kind-chip | TODO | scm-tag | |
| 10 | scm-status-chip | TODO | scm-tag | |
| 10 | scm-detail-stack | TODO | — | |
| 11 | template/data-list-page | TODO | Stages 1~9 | |
| 11 | template/detail-page | TODO | Stages 1~7, 10 | |
| 11 | template/form-page | TODO | Stages 1~6, 10 | |
| 11 | template/dashboard-page | TODO | Stages 1~4, 10 | |
| 11 | template/navigation-drawer | TODO | scm-side-drawer | |

상태 표기:
- `TODO` — 미시작
- `WIP` — 작업 중
- `△ 부분` — 일부 존재 / 마이그레이션 필요
- `✓ 추출 (날짜)` — 모듈 파일 5종 + 카탈로그 등록 완료. 페이지 사용처 교체는 별도 (Stage 12).
- `✓ 존재` — 처음부터 존재

---

## 7. Phase B 진행 권장 사항

1. **한 Stage 씩, 한 PR 씩** 진행. PR 사이즈 작게 유지.
2. 각 Stage 끝에 모든 페이지 회귀 테스트:
   - 각 페이지를 실제 브라우저로 렌더 → 시각 비교
   - 콘솔 에러 없는지 확인
   - 인터랙션 동작 확인 (모달 열림/닫힘, 필터 적용 등)
3. **Stage 1~2 (atoms)** 부터 시작 권장. 의존이 없어서 안전하고, 모든 후속 컴포넌트의 기반.
4. **Stage 9 (scm-table)** 은 가장 큰 위험. 4개 페이지 모두 의존. 별도 마이그레이션 plan 필요할 수 있음.
5. 각 모듈 추출 시:
   - `components/<name>/` 5개 파일 생성
   - `design-system/index.html` 카탈로그에 섹션 추가
   - 한 페이지(소비처 1)부터 실제 교체 → 시각 회귀
   - OK 면 나머지 페이지로 확산
   - 모든 페이지에서 인라인 코드 제거
   - inventory 트래커 상태 갱신

---

## Appendix A. Legacy prefix → New prefix 매핑

| Legacy prefix | 의미 | 새 prefix | 비고 |
|---|---|---|---|
| `ld-*` | LayerDesktop 토큰/베이스 | `ld-*` 유지 | 변동 없음 |
| `mp-*` | "Management Page" (페이지 prefix) | `scm-*` | 모든 mp- 클래스 마이그레이션 |
| `bu-*` | Bulk Upload modal | `scm-bulk-upload-modal-*` (모듈 내부) | 모듈로 캡슐화 |
| `sd-*` (size detail drawer) | 사이즈 개별 설정 | `scm-side-drawer` + `scm-data-table` 인스턴스 | sd-toggle/sd-stats 등 분해 |
| `sd-*` (sku-detail) | SKU 상세 페이지 | `scm-*` 또는 template 슬롯 | sd 이름 충돌 — 해소 필요 |
| `af-*`, `mp-af-*` | All Filter drawer | `scm-filter-drawer-*` (모듈 내부) | |
| `er-*` | EditshopRestock | `scm-*` (도메인 칩들) + 페이지 도메인 코드 | |
| `db-*` | Dashboard | `scm-kpi-card`, `scm-activity-item`, ... | 분해 |
| `reg-*` | Register page | `scm-*` (form 시스템) | 분해 |
| `lnb-*` | Left Nav | `scm-lnb-*` | prefix 만 통일 |
| `bu-*`, `mp-modal`, `mp-deploy` 등 mixed | (다양) | 컴포넌트별 모듈로 분리 | |

---

## Appendix B. 식별된 인접 이슈

조사 중 발견된 비-인벤토리 이슈들. 별도 처리 필요:

1. **`sd-` prefix 충돌**: `index.html` 의 size-detail drawer (`sd-drawer`) 와 `sku-detail.html` 의 페이지 컴포넌트들 (`sd-page-head`, `sd-section`, `sd-info-table`, ...) 이 같은 prefix 사용. 마이그레이션 시 분리 필요.
2. **`scm-table` 모듈의 클래스명**: 모듈 폴더명은 `scm-table` 이지만 내부 클래스는 `mp-table-*`. 자기 모순 — 클래스 리네임 필요.
3. **`form-radio` 와 `bu-radio` 중복**: bulk upload modal 에서 `bu-radio` 정의, register 페이지에서 `form-radio` 정의. 거의 동일 — 통합 필요.
4. **`form-select` 와 `sd-select-mock`**: 둘 다 비슷한 시각의 셀렉트 mock. 통합 가능.
5. **`page-head` 의 4 variants**: 데이터 리스트(액션 우측) / 상세(back+title) / 폼(back+title) / 대시보드(title+sub+period-tabs). variants 로 처리 vs 별도 컴포넌트로 분리 — Stage 8 진입 시 결정.
6. **Toast 시스템 사용도**: 현재 index.html 에만 정의되어 있으나 다른 페이지에서도 호출 가능해야 함 (확인/저장 후 피드백). 추출 시 모든 페이지로 전파 필요.
7. **iconography**: SVG sprite (`#ic-*`) 가 페이지마다 인라인. `icons-sprite.svg.html` 파일 별도 존재 — 카탈로그화 / 모듈화 검토.

---

*문서 끝.*
