# scm-info-table

정보 표 (label + value rows). 상세 페이지에서 키/값 정보 표시.

## Anatomy

```
scm-info-table (max-width 926px, top/bottom border)
└ scm-info-row (또는 --quad)
    ├ scm-info-cell-label (134w, bg #F5F5F5)
    └ scm-info-cell-value (flex 1, padding 12 14)
```

## Layouts

| Row class | 셀 구성 |
|---|---|
| (기본) | label(134) + value(flex) |
| `scm-info-row--quad` | label(134) + value(flex) + label(134) + value(flex) |

## Variants / Modifiers

| 클래스 | 효과 |
|---|---|
| `scm-info-table--no-bottom` | 하단 보더 제거 |
| `scm-info-cell-label--top` | label vertical align top (multi-line value) |
| `scm-info-cell-value--padded` | padding 16 14 |
| `scm-info-cell-value--flex-between` | space-between alignment |

## Helper

| 클래스 | 효과 |
|---|---|
| `scm-info-secondary` | 부가 텍스트 (#8A8A8A) |

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.sd-info-table` (+ `--no-bottom`, `--quad`) | sku-detail.html |
| `.sd-aside-row` | sku-detail.html aside (별도 검토 — `scm-info-table` variant 추가 또는 별 컴포넌트) |
