# scm-info-banner

페이지 상단 안내 배너 (collapsible). 좌측 info icon + 제목 + 본문 + 우측 toggle.

## Anatomy

```
scm-info-banner (--full: max-width 제거)
├ scm-info-banner__icon (20×20)
├ scm-info-banner__body
│   ├ scm-info-banner__title (15/500)
│   └ scm-info-banner__text (14/400)  — is-collapsed 시 숨김
└ scm-info-banner__toggle (20×20 chevron, is-collapsed 시 회전)
```

## States

`.is-collapsed` — 본문 숨김 + chevron 180도 회전.

## Variants

| 클래스 | 효과 |
|---|---|
| (기본) | `max-width: 1200px` (폼 페이지) |
| `scm-info-banner--full` | max-width 제거 (다른 페이지) |

## Props (React)

| prop | type |
|---|---|
| `title` | string |
| `description` | string |
| `collapsed` | boolean (controlled) |
| `defaultCollapsed` | boolean (uncontrolled) |
| `onToggle` | `(next) => void` |
| `full` | boolean |
| `iconNode` | ReactNode (커스텀 아이콘) |

## API (vanilla)

```js
const ib = SCM.infoBanner.mount(el, { collapsed: false });
ib.toggle();
ib.collapse();
ib.expand();
```

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.mp-info-banner` (+ `__body`, `__title`, `__text`, `.toggle`, `.is-collapsed`) | sku-management, sku-register |
