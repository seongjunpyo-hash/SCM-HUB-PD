# scm-deploy-popover

`scm-deploy-pill` 의 chevron 클릭 시 뜨는 단순 옵션 popover (전개중 / 미전개).

## Anatomy

```
scm-deploy-popover (position fixed, is-open 시 표시)
└ ul > li[data-deploy-opt][data-current]
    "data-current=true" 시 회색 배경 + 우측 체크 SVG
```

## API (vanilla)

```js
SCM.deployPopover.open({
  anchorEl: cellEl,
  options: [
    { state: 'deployed', label: '전개중' },
    { state: 'undeployed', label: '미전개' },
  ],
  current: 'deployed',
  onSelect: (state) => updateRow(state),
});
SCM.deployPopover.close();
```

외부 클릭, ESC 키 모두 close.

## Props (React)

| prop | type |
|---|---|
| `open` | boolean |
| `options` | `[{ state, label }]` |
| `current` | string |
| `position` | `{ top, left, minWidth }` |
| `onSelect` | `(state) => void` |

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.mp-deploy-popover` (+ `.is-open`, li `[data-deploy-opt]`, `[data-current]`) | 4개 데이터리스트 페이지 (deploy 셀 chev 클릭 시) |
