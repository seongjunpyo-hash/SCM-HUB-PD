# scm-filter-select

필터바의 개별 셀렉트 칩. floating label 패턴.

## Anatomy

```
scm-filter-select (relative, h44, padding 12 16)
├ scm-filter-select__label (absolute, left 12, top -9, bg #fff)
│   └ scm-filter-select__req-dot (4×4 파랑, 옵션)
├ scm-filter-select__value (flex 1)
└ scm-filter-select__chev (16×16, transition rotate)
```

## States (data-state)

| 값 | label | value |
|---|---|---|
| `placeholder` | 숨김 (translateY 14, scale 0.92) | 회색 #8A8A8A weight 500 |
| `filled` | 위로 떠서 표시 (12/400) | 검정 weight 500 |
| `active` | 표시 | 검정 weight 400 |

## States (attribute)

- `aria-expanded="true"` — chev 180° 회전 + border #000
- `:focus` — border #000

## Group

```
scm-filter-group
└ scm-filter-select (인접 시 보더 통합)
```

`scm-filter-group` 내부의 인접한 `scm-filter-select` 가 expanded 또는 focus 일 때 우측 보더 투명 처리 — 이중 보더 방지.

## Props (React)

| prop | type |
|---|---|
| `label` | string |
| `value` | string |
| `required` | boolean |
| `expanded` | boolean |
| `state` | `'placeholder' \| 'filled' \| 'active'` (자동 추론) |
| `filterKey` | string (data-filter-key) |
| `onClick` | () => void |

## API (vanilla)

```js
const fs = SCM.filterSelect.mount(el, {
  placeholder: '스토어 전개 여부',
  onClick: () => openPopover(el),
});
fs.setValue('전개중');
fs.setExpanded(true);
```

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.mp-filter-select` (+ `.label`, `.value`, `.chev`, `.req-dot`, `[data-state]`, `[data-mp-filter]`) | 4 데이터리스트 페이지 필터바 |
| `.mp-filter-group` | sku-management 폼 필터 그룹 |
