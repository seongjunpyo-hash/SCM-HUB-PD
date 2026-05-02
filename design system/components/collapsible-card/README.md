# scm-collapsible-card

확장/축소 카드. head 클릭으로 토글.

## Anatomy

```
scm-collapsible-card (또는 .is-collapsed)
├ scm-collapsible-card__head (cursor: pointer, border-bottom)
│   ├ scm-collapsible-card__head-left (flex 1)
│   └ scm-collapsible-card__toggle
│       ├ svg.minus (펼친 상태)
│       └ svg.plus  (접힌 상태)
└ scm-collapsible-card__body  — is-collapsed 시 display: none
```

마크업에 minus/plus 두 SVG 모두 두면 CSS 가 `is-collapsed` 에 따라 알아서 전환.

## Props (React)

| prop | type |
|---|---|
| `head` | ReactNode |
| `defaultCollapsed` | boolean |
| `collapsed` | boolean (controlled) |
| `onToggle` | `(next) => void` |

## API (vanilla)

```js
const cc = SCM.collapsibleCard.mount(el, {
  collapsed: false,
  onToggle: (isCollapsed) => {},
});
cc.toggle(); cc.expand(); cc.collapse();
```

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.sd-uid-card` + `.sd-uid-card-head` (+ `.left`, `.toggle` + `svg.minus/plus`) + `.sd-uid-card-body` + `.is-collapsed` | sku-detail UID 섹션 |
