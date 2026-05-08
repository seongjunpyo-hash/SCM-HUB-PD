# scm-mini-action

stats bar 의 미니 액션 버튼. h36 outlined, 우측 chevron, 클릭 시 popup 드롭다운. variants: 기본 / `--primary`.

## Anatomy

```
scm-mini-wrap (relative, optional — popup 있을 때)
├ scm-mini-action (button)
│   ├ label text
│   └ <svg> chevron (16, transition rotate 0.15s)
└ scm-mini-popup (ul, absolute, is-open 시 표시)
    └ li[data-key]
        ├ "is-current"
        └ "<span class='accent'>...</span>" 등
```

## Variants

| 클래스 | 톤 |
|---|---|
| (기본) | outlined (border #E0E0E0, bg #fff) |
| `scm-mini-action--primary` | solid (bg #000, color #fff) |

## States

- `[aria-expanded="true"]` — chevron 회전
- `:disabled` 또는 `[disabled]` — 회색 톤

## Props (React)

| prop | type | 설명 |
|---|---|---|
| `label` | string | 버튼 텍스트 |
| `variant` | `'primary'` | |
| `items` | `[{key,label,current?,html?}]` | 있으면 드롭다운, 없으면 단순 버튼 |
| `disabled` | boolean | |
| `onSelect` | `(key) => void` | items 옵션 클릭 시 |
| `onClick` | `() => void` | items 없을 때 사용 |

## API (vanilla)

```js
SCM.miniAction.mount(wrap, {
  variant: 'primary',
  onSelect: (key) => { ... },
});
```

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.mp-mini-wrap` + `.mp-mini-action` + `.mp-mini-popup` | 4개 데이터리스트 페이지 stats bar (코드 복사 / 전개 여부 변경 / 일괄 설정 등) |
| `.mp-mini-action--primary` | SKU 관리 일괄 설정 |
| `.reg-pending-stats .mini-action` | sku-register 등록 대기 stats | (별도 흡수 검토 — `scm-mini-action` 으로 가능) |
