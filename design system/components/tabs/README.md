# scm-tabs

탭. 두 가지 시각 variant 통합.

## Variants

| 클래스 | 시각 | 사용처 |
|---|---|---|
| `scm-tabs--underline` | 하단 검정 보더 강조, 18/600 | sku-detail 섹션 탭 (사용/미사용) |
| `scm-tabs--pill` | 라운드 배경 위 white pill, 14/500 | dashboard period 탭 |

## Anatomy

```
scm-tabs (--underline 또는 --pill)
└ scm-tab[data-key]
    ├ (underline) scm-tab__label + scm-tab__count
    └ (pill) 단순 텍스트
```

## States

`.is-active` — 활성 탭.

## Props (React)

| prop | type |
|---|---|
| `variant` | `'underline' \| 'pill'` |
| `items` | `[{ key, label, count? }]` |
| `value` | string |
| `onChange` | `(key) => void` |

## API (vanilla)

```js
const t = SCM.tabs.mount(el, {
  variant: 'underline',
  onChange: (key) => switchView(key),
});
t.activate('used');
t.get();   // 'used'
```

마크업의 `<button>` 에 `data-key` 속성 필요.

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.sd-section-tabs` + `.sd-section-tab` (+ `.is-active`, `.label`, `.count`) | sku-detail | `scm-tabs--underline` |
| `.db-period-tabs` + `.db-period-tab` (+ `.is-active`) | dashboard | `scm-tabs--pill` |
