# scm-stats-bar

데이터 리스트 페이지의 stats bar. filter-bar 아래 sticky 위치.

## Anatomy

```
scm-stats-bar (--sticky 옵션, 풀폭 sticky)
├ scm-stats-bar__left (flex 1)
│   ├ scm-stats-bar__counts-wrap
│   │   └ scm-stats-bar__counts
│   │       └ scm-stat × N + scm-stat-divider
│   └ scm-stats-bar__mini-actions
│       └ scm-mini-action × N
└ scm-stats-bar__right (margin-left auto)
    ├ scm-stats-bar__ts (timestamp)
    ├ scm-download-btn
    ├ scm-stats-bar__v-divider
    ├ scm-pager
    └ scm-pgsize-wrap (pgsize-select)
```

## Required CSS variables

- `--scm-sticky-gnb` — 상단 GNB 높이 (보통 64)
- `--scm-sticky-stats` — stats bar sticky top 값 (기본: GNB + 76 = filter-bar 높이만큼). 페이지마다 다를 수 있음

## Sticky

`scm-stats-bar--sticky` modifier 추가 시 sticky 동작. `top` 은 `--scm-sticky-stats` 변수.

## Props (React)

| prop | type |
|---|---|
| `sticky` | boolean |
| `countsContent` | ReactNode (stats + dividers) |
| `miniActions` | ReactNode |
| `rightContent` | ReactNode (timestamp / download / pager / pgsize) |

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.mp-stats-row` (+ `.mp-stats-left`, `.mp-stats-counts-wrap`, `.mp-stats-counts`, `.mp-stats-mini-actions`, `.mp-stats-right`, `.ts`, `.v-divider`) | 4 데이터리스트 페이지 |
