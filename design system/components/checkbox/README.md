# scm-checkbox

16×16 SVG 기반 체크박스. `<input type="checkbox">` 가 아니라 `role="checkbox"` + `aria-checked` 속성으로 상태 표현. div/span 기반이라 cell·row 선택 등 자유롭게 부착 가능.

## Files

- `checkbox.css` · `checkbox.js` · `checkbox.html` · `checkbox.jsx` · `README.md`

## States

| 속성 | 설명 |
|---|---|
| `aria-checked="false"` | 해제 |
| `aria-checked="true"` | 체크 (검정 배경 + 흰 ✓) |
| `aria-checked="mixed"` | indeterminate — 일부만 선택 (대시) |
| `is-disabled` 또는 `aria-disabled="true"` | 비활성 |

## Accessibility

- `role="checkbox"` 필수
- `tabindex="0"` 으로 키보드 포커스
- Space / Enter 로 토글
- `aria-label` 또는 `aria-labelledby` 권장

## API (vanilla)

```js
const cb = SCM.checkbox.mount(el, {
  checked: false,
  disabled: false,
  onChange: (checked) => console.log(checked),  // boolean | 'mixed'
});
cb.get();            // boolean | 'mixed'
cb.set(true);
cb.set('mixed');
cb.toggle();
cb.setDisabled(true);
cb.destroy();
```

## Props (React)

| prop | type | default |
|---|---|---|
| `checked` | `boolean \| 'mixed'` | `false` |
| `disabled` | `boolean` | `false` |
| `onChange` | `(next: boolean) => void` | — |
| `ariaLabel` | `string` | `'선택'` |

## Used in (legacy → migration target)

| Legacy class | 사용처 | 마이그레이션 |
|---|---|---|
| `.mp-cb` | 4개 데이터 리스트 페이지 (전체 선택, row 선택, sd-drawer 행 선택) | `scm-checkbox` |
| `.sd-cb-all`, `.sd-row-cb` | size detail drawer | `scm-checkbox` |
| `.mini-cb.--ok / .--ng` (sku-register pending stats) | 별도 검토 — 실제는 결과표시 아이콘에 가까움. `scm-checkbox` 와 분리 가능 | TBD |

## Notes

기존 `.mp-cb` 는 `[aria-checked="true"]::after { content:none; }` 같은 후속 처리 로직이 일부 있었음. `scm-checkbox` 는 SVG 배경만으로 모든 상태를 처리해서 더 단순.
