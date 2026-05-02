# scm-form-row

폼 한 줄 (label + control). 폼 페이지의 모든 입력 필드 한 줄.

## Anatomy

```
scm-form-row
├ scm-form-label (--w60 / --w120 / --w140)
│   └ scm-form-row-req (필수 도트, 4×4 파랑)
└ scm-form-control (--w320 / --w360 / --full)
    └ <input class="scm-input" /> 또는 select / radio-group
```

## Label widths

| 클래스 | px |
|---|---|
| (기본) | 가변 |
| `--w60` | 60 |
| `--w120` | 120 |
| `--w140` | 140 |

## Control widths

| 클래스 | px |
|---|---|
| (기본) | 가변 (`min-width:0`) |
| `--w320` | 320 fixed |
| `--w360` | 360 fixed |
| `--full` | flex 1 |

## React

```jsx
<FormRow>
  <FormLabel width={140} required>상품 코드</FormLabel>
  <FormControl width={320}>
    <Input placeholder="..." />
  </FormControl>
</FormRow>
```

## Used in (legacy → migration target)

| Legacy class | 사용처 | 마이그레이션 |
|---|---|---|
| `.form-row` | sku-register | `scm-form-row` |
| `.form-label`, `.form-label--w60/120/140` | sku-register | `scm-form-label`, `scm-form-label--w*` |
| `.form-label .req-dot` | sku-register | `scm-form-row-req` |
| `.form-control`, `.form-control--w320/360/full` | sku-register | `scm-form-control`, `scm-form-control--w*` / `--full` |
