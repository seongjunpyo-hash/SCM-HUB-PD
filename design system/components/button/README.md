# scm-button

베이스 버튼. 페이지 헤드 액션 / 모달 푸터 / 폼 액션 / stats bar 등 모든 곳의 버튼.

## Variants

| 클래스 | 톤 |
|---|---|
| (기본) | Outlined — `border:1px #000`, `bg:#fff`, `color:#000` |
| `scm-button--primary` | Solid — `bg:#000`, `color:#fff` |
| `scm-button--ghost` | `bg:transparent`, `border:0` |

## Sizes

| 클래스 | h | min-width | padding | font |
|---|---|---|---|---|
| `scm-button--sm` | 36 | 64 | 8 12 | 14/500 |
| (기본 md) | 44 | 80 | 12 | 15/500 |
| `scm-button--lg` | 52 | 120 | 14 20 | 16/500 |

## Modifiers

`scm-button--block` — `width: 100%`.

## States

`:disabled` 또는 `[disabled]` — 회색 톤. cursor: not-allowed.

## Internal helpers

페이지 헤드 액션 버튼의 진행 카운터 부분:
- `scm-button__v-divider` — 1×16 세로 구분선
- `scm-button__progress` — 진행 그룹 컨테이너
- `scm-button__progress-label` — 라벨 텍스트 (파랑 500)
- `scm-button__progress-num` — 숫자 (파랑 600 tabular)

## Props (React)

| prop | type |
|---|---|
| `variant` | `'primary' \| 'ghost'` |
| `size` | `'sm' \| 'lg'` |
| `block` | boolean |
| `disabled` | boolean |
| `type` | string (default `'button'`) |
| `children` | ReactNode |

## API (vanilla)

```js
SCM.button.mount(el, {
  variant: 'primary',
  size: 'sm',
  block: false,
  disabled: false,
  onClick: () => {},
});
```

## Used in (legacy → migration target)

| Legacy class | 사용처 | 마이그레이션 |
|---|---|---|
| `.mp-action-btn` | 모든 페이지 헤드 | `scm-button` |
| `.mp-action-btn--primary` | 무탠 / SKU 페이지 헤드, sd-drawer 저장 | `scm-button scm-button--primary` |
| `.btn-primary-disabled` | sku-register 액션 row | `scm-button scm-button--primary` (disabled) |
| `.btn-outline-disabled` | sku-register 취소 | `scm-button` (disabled) |
| `.sd-btn-outline` (h36) | sku-detail outline 버튼 | `scm-button scm-button--sm` |
| `.reg-bottom-bar .btn` (h52) | sku-register 하단바 | `scm-button scm-button--lg` |
| `.option-btn` | sku-register 옵션 행 | `scm-button` (custom) |
