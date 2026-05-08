# scm-pgsize-select

stats bar 우측 페이지 행 수 셀렉트. h36 / 114w. popup 우측 정렬.

## Anatomy

```
scm-pgsize-wrap (relative)
├ scm-pgsize (button)
│   ├ scm-pgsize__label
│   └ scm-pgsize__chev (chevron-down 16, 회전 transition 0.15s)
└ scm-pgsize-popup (ul, position absolute right 0, is-open 시 표시)
    └ li[role=option][aria-selected]
```

## Props (React)

| prop | type | default |
|---|---|---|
| `value` | number | `100` |
| `options` | number[] | `[20, 50, 100, 200]` |
| `formatter` | `(n) => string` | `n => n + '개씩'` |
| `onChange` | `(next) => void` | — |

## API (vanilla)

```js
SCM.pgsizeSelect.mount(wrap, {
  value: 100,
  options: [20, 50, 100, 200],
  onChange: (n) => loadWithSize(n),
});
```

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.pgsize-wrap` + `.pgsize` + `.pgsize-popup` | 4개 데이터리스트 페이지 stats bar 우측 |
