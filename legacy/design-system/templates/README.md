# Templates

페이지 단위 골격 템플릿. 모듈을 조립한 표준 페이지 구조.

각 템플릿은 `{{PLACEHOLDER}}` 형태로 페이지별 데이터를 채울 위치를 표시.

## 5종 템플릿

| 파일 | 용도 | 사용처 |
|---|---|---|
| `data-list-page.html` | 데이터 리스트 | 무탠 / SKU 관리 / 편집샵 보충 요청·현황 |
| `detail-page.html` | 상세 (2-column aside + main) | sku-detail |
| `form-page.html` | 폼 (info-banner + form cards + sticky bottom bar) | sku-register |
| `dashboard-page.html` | 대시보드 (KPI grid + chart/list + quick links) | dashboard |
| `navigation-drawer.html` | LNB 풀 메뉴 드로어 | (모달 형태로 모든 페이지에서 호출) |

## 사용 흐름

1. 신규 페이지 작성 시: 적합한 템플릿 복사 (`scm hub/<page>.html`)
2. `{{PLACEHOLDER}}` 들을 페이지별 데이터로 치환
3. `{{MODULE_CSS_LINKS}}` / `{{MODULE_JS_SCRIPTS}}` 는 페이지에서 사용하는 모듈만 선택해서 import

## 시뮬레이션 시스템 흐름

```
PRD 입력
   ↓
페이지 타입 선택 (list/detail/form/dashboard)
   ↓
템플릿 복사 + placeholder 치환
   ↓
모듈 조립 (CSS/JS link)
   ↓
와이어프레임 / 실사이트 (HTML)
   ↓
사용자 수정 / 반복
   ↓
React export (Stage 13)
```

## Placeholder 컨벤션

| Placeholder | 의미 |
|---|---|
| `{{TITLE}}` | 페이지 타이틀 |
| `{{TOPBAR}}` | 상단 바 마크업 (페이지 별 — 일반적으로 logo + user) |
| `{{LNB}}` | 좌측 네비 마크업 |
| `{{ACTIONS}}` | 페이지 헤드 우측 액션 버튼들 |
| `{{FILTER_SELECTS}}` | 필터바의 개별 select 들 |
| `{{STATS_COUNTS}}` | stats bar 좌측 카운트들 |
| `{{TABLE_HEAD}}`, `{{TABLE_BODY}}` | 데이터 테이블 head/body |
| `{{MODULE_CSS_LINKS}}` | 사용 모듈 CSS link 들 |
| `{{MODULE_JS_SCRIPTS}}` | 사용 모듈 JS script 들 |
| `{{PAGE_SCRIPT}}` | 페이지 specific JavaScript |

## Note

현재 템플릿의 데이터 테이블은 `mp-table` (legacy) 클래스 사용. Stage 12 풀 마이그레이션 시 `scm-table-*` 로 일괄 리네임 예정.
