# scm-filter-drawer

"전체 필터" 좌측 드로어 (480w). filter-bar 의 chip 클릭 시 표시.

`scm-side-drawer` 와는 다른 위치/방향이라 별도 모듈:
- 좌측에서 슬라이드 인 (`translateX(-100%)`)
- `top: 64` (topbar 아래 시작)
- `left: var(--scm-lnb-width)` (LNB 옆에 붙음)
- `z-index: 12`

## Anatomy

```
scm-filter-drawer-backdrop (transparent, top:64 left:LNB-width)
scm-filter-drawer (480w, 슬라이드)
├ scm-filter-drawer__header (h64)
│   ├ <h2>
│   └ scm-filter-drawer__close
├ scm-filter-drawer__body (overflow-y, padding 24, gap 24)
│   └ scm-filter-drawer__section × N
│       ├ <h3> (+ req-dot)
│       └ section-specific:
│           - scm-filter-drawer__chips > scm-filter-drawer__chip[data-selected]
│           - scm-filter-drawer__search + scm-filter-drawer__list (다중 체크박스)
│           - scm-filter-drawer__textarea + scm-filter-drawer__counter
└ scm-filter-drawer__footer
    ├ scm-filter-drawer__reset
    └ scm-filter-drawer__apply
```

## Required CSS variable

`--scm-lnb-width` — LNB 폭 (보통 56px collapsed / 260px expanded). 페이지 또는 layer-desktop.css 에서 정의.

## Section variants

1. **Chip 단일/다중 선택**: `scm-filter-drawer__chips > scm-filter-drawer__chip[data-selected]`
2. **다중 선택 with 검색**: `scm-filter-drawer__search` + `scm-filter-drawer__list > scm-filter-drawer__row[data-selected]`
3. **코드 다중 입력**: `scm-filter-drawer__textarea` + `scm-filter-drawer__counter`

## API (vanilla)

```js
const fd = SCM.filterDrawer.mount(drawerEl, {
  backdrop: backdropEl,
  onClose: () => {},
});
fd.open();
fd.close();
```

backdrop / 닫기 버튼 / ESC → close.

## Props (React)

| prop | type |
|---|---|
| `open` | boolean |
| `onClose` | () => void |
| `title` | string |
| `children` | ReactNode (sections) |
| `footer` | ReactNode |

`<FilterDrawerSection title required>` 헬퍼도 함께 export.

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.mp-af-backdrop` + `.mp-af-drawer` (+ header/close/body/section/chip/search/list/row/textarea/counter/footer/reset-btn/apply-btn) | 4 데이터리스트 페이지 "전체 필터" 드로어 |
