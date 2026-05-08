# scm-filter-bar

데이터 리스트 페이지 상단 sticky 필터 바. 좌측 전체필터칩 + 가로 스크롤 셀렉트 + 우측 액션.

## Anatomy

```
scm-filter-bar (sticky top, padding 16 28, margin 0 -28 → 풀폭)
├ scm-filter-chip (좌측, 항상 보임)
├ scm-filter-overflow (relative, flex 0 1)
│   ├ scm-filter-overflow__track (overflow-x scroll, scrollbar 숨김)
│   │   └ scm-filter-select × N
│   ├ scm-filter-overflow__fade--left (좌측 fade, scrollLeft > 0 시 opacity 1)
│   └ scm-filter-overflow__fade--right (우측 fade, scroll-end 미도달 시 opacity 1)
└ scm-filter-actions (우측, gap 4)
    ├ scm-search-btn
    └ scm-filter-reset-btn
```

## Required CSS variables

`--scm-sticky-gnb` — 상단 GNB 높이 (보통 64px). 페이지 또는 layer-desktop.css 에서 정의.

## API (vanilla)

```js
SCM.filterBar.mount(el);   // fade gradient 자동 동기화 부착
```

scroll / resize 시 좌우 fade opacity 자동 갱신.

## Props (React)

| prop | type |
|---|---|
| `filterChip` | ReactNode (`<FilterChip>`) |
| `selects` | ReactNode (여러 `<FilterSelect>`) |
| `actions` | ReactNode (`<SearchButton>` + `<FilterResetButton>`) |

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.mp-filter-bar` | 4 데이터리스트 페이지 |
| `.mp-filter-overflow` + `__track` + `__fade--left/right` | 동일 |
| `.mp-filter-actions` | 동일 |
