# scm-input

텍스트 입력 필드. 폼 / 모달 / 필터 등에서 공용.

## Sizes

| 클래스 | h | padding | font |
|---|---|---|---|
| (기본 md) | 44 | 12 16 | 15/400 |
| `scm-input--sm` | 36 | 8 12 | 14/400 |

## States

- `:focus` — `border:#000`
- `:disabled` — 회색 톤, cursor not-allowed

## Wrap (counter / overlay)

| 클래스 | 설명 |
|---|---|
| `scm-input-wrap` | relative wrapper (overlay 부착) |
| `scm-input-wrap--with-counter` | input 우측에 64px padding 확보 |
| `scm-input-counter` | 우측 안쪽 char counter (`12 / 30`) |

## Props (React)

`Input` 은 `<input>` 의 모든 prop 통과 + `size` (sm) variant.

`InputWithCounter` — `maxLength` 와 함께 사용. controlled / uncontrolled 둘 다 지원.

## API (vanilla)

```js
SCM.input.mount(inputEl, {
  size: 'sm',
  maxLength: 30,
  counter: document.getElementById('my-counter'),
});
```

## Used in (legacy → migration target)

| Legacy class | 사용처 | 마이그레이션 |
|---|---|---|
| `.form-input` | sku-register | `scm-input` |
| `.form-input-wrap` + `.char-count` | sku-register | `scm-input-wrap--with-counter` + `scm-input-counter` |
| `.sd-input-mock` (sku-detail) | 시각만 (readonly), 별도 검토 | TBD — `scm-input` 의 readonly 변형으로 흡수 가능 |
| `.er-input` (restock-request) | 셀 안 인라인 입력 | `scm-input--sm` |
