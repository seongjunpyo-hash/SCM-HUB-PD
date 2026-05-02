# scm-filter-chip

"전체 필터" 칩. 필터바 좌측 끝. 클릭 시 전체 필터 드로어 (`scm-filter-drawer`) 트리거.

## Anatomy

```
scm-filter-chip (h44 outlined)
├ <svg> 필터 아이콘 (20×20)
├ <span> "전체 필터"
└ scm-filter-chip__count  (#245EFF 600 tabular, 활성 필터 카운트)
```

## Props (React)

| prop | type |
|---|---|
| `count` | number (0 또는 undefined 면 숨김) |
| `label` | string (기본 `'전체 필터'`) |
| `onClick` | () => void |

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.mp-filter-chip` (+ `.num`) | 4 데이터리스트 페이지 필터바 |
