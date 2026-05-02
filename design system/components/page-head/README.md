# scm-page-head

페이지 헤드. 4 variants 통합 — list / detail / form / dashboard.

## Variants

| 클래스 | 구조 | padding | 사용처 |
|---|---|---|---|
| `--list` | title 좌 / actions 우 | 24 0 0 | 데이터 리스트 (무탠 / SKU / 편집샵) |
| `--detail` | back-btn + title 좌 | 20 0 | 상세 페이지 |
| `--form` | back-btn + title 좌 | 20 0 | 폼 페이지 (SKU 등록) |
| `--dashboard` | title+sub 좌 / actions 우 (align bottom) | 32 0 20 | 대시보드 |

## Sub elements

- `scm-page-head__title` — 26/600 #000
- `scm-page-head__sub` — 15/400 #666 (대시보드만)
- `scm-page-head__titles` — title + sub 컨테이너 (대시보드만)
- `scm-page-head__actions` — 우측 액션 슬롯 (list / dashboard)

## Sticky

`scm-page-head--sticky` modifier 추가 시 `top: var(--scm-sticky-gnb, 64px)` sticky.

## Props (React)

| prop | type |
|---|---|
| `variant` | `'list' \| 'detail' \| 'form' \| 'dashboard'` |
| `sticky` | boolean |
| `title` | string |
| `subtitle` | string (dashboard) |
| `back` | ReactNode (BackButton) |
| `actions` | ReactNode |

## Used in (legacy → migration target)

| Legacy | variant | 사용처 |
|---|---|---|
| `.mp-page-head` (list 형) | `--list` | 무탠 / SKU / 편집샵 (4 페이지) |
| `.mp-page-head` (back+title 형) | `--form` | sku-register |
| `.sd-page-head` | `--detail` | sku-detail |
| `.db-page-head` | `--dashboard` | dashboard |
| `.mp-page-title` / `.sd-page-title` / `.db-page-title` | (모두 통합) | `scm-page-head__title` |
| `.mp-page-actions` | (list 의 actions 슬롯) | `scm-page-head__actions` |
| `.db-page-sub` | (dashboard 의 sub) | `scm-page-head__sub` |
