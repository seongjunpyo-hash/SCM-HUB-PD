# scm-pager

stats bar 우측 페이저. "1 / 99 페이지" + ‹ ›.

## Anatomy

```
scm-pager
├ scm-pager__current     현재 페이지 (15/500 검정 tabular)
├ scm-pager__total       "/ 99 페이지" (15/400 회색)
├ scm-pager-btn[aria-label="이전 페이지"]   36×36 ghost, disabled at page 1
└ scm-pager-btn[aria-label="다음 페이지"]   36×36 ghost, disabled at last page
```

## Props (React)

| prop | type | default |
|---|---|---|
| `current` | number | `1` |
| `total` | number | `1` |
| `onChange` | `(next: number) => void` | — |

## API (vanilla)

```js
SCM.pager.mount(el, {
  current: 1, total: 99,
  onChange: (n) => loadPage(n),
});
```

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.mp-stats-right .pager` + `.pbtn` + `<strong>` + `.num-total` | 4개 데이터리스트 페이지 stats bar 우측 |
