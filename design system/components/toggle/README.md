# scm-toggle

On/Off 토글 스위치. input 기반 / div 기반 둘 다 지원.

## Sizes

| 클래스 | 크기 |
|---|---|
| (기본) | 36×20 |
| `scm-toggle--sm` | 32×20 |

## States

| 클래스 / 속성 | 설명 |
|---|---|
| `input:checked` 또는 `is-on` | On |
| `is-disabled` | 비활성 |

## Markers

**A. Input 기반** — 실제 폼 인풋 (label/input/track/knob 4요소)
**B. Div 기반** — 시각만 (track/knob 2요소, JS 로 토글)

## API (vanilla)

```js
const t = SCM.toggle.mount(el, {
  checked: true,
  size: 'sm',
  onChange: (on) => console.log(on),
});
t.set(true);
t.toggle();
t.setDisabled(true);
```

## Props (React)

| prop | type | default |
|---|---|---|
| `checked` | boolean | `false` |
| `disabled` | boolean | `false` |
| `size` | `'sm'` | — |
| `onChange` | `(next: boolean) => void` | — |

`ToggleCell` 컴포넌트도 함께 export — 토글 + 라벨 셀.

## Used in (legacy → migration target)

| Legacy class | 사용처 | 마이그레이션 |
|---|---|---|
| `.sd-toggle` (+`.sd-track`, `.sd-thumb-knob`) | size detail drawer (`index.html`) | input 기반 marker A |
| `.sd-toggle-mock` (+`.bg`, `.knob`) | sku-detail (행거 사용 여부 mock) | div 기반 marker B |
| `.sd-toggle-cell`, `.sd-toggle-label` (+`.is-off`) | size detail drawer | `scm-toggle-cell`, `scm-toggle-label` |
