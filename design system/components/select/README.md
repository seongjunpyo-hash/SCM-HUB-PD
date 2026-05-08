# scm-select

셀렉트박스 트리거. 시각은 input 과 동일하나 우측 chevron + 클릭 시 popup 오픈.

> 실제 드롭다운 popup 은 Stage 7 의 popover 모듈 또는 호출처 책임. 이 모듈은 트리거 버튼/표시 영역만 담당.

## Sizes

| 클래스 | h | padding | font | 비고 |
|---|---|---|---|---|
| (기본 md) | 44 | 12 16 | 15/400 | 폼 페이지 |
| `scm-select--sm` | 36 | 8 12 | 14/400 | 인라인 |
| `scm-select--bu` | 40 | 8 12 | 14/400 | bulk upload modal |

## States (data-state)

| 값 | 설명 |
|---|---|
| `placeholder` | value 회색 톤 |
| `filled` | value 검정 |

## States (attribute)

- `aria-expanded="true"` — 열림 (border #000)
- `:hover` — border #000
- `disabled` 또는 `is-disabled` — 회색 톤

## Inner parts

| 클래스 | 설명 |
|---|---|
| `scm-select__value` | value text (ellipsis) |
| `scm-select__chev` | chevron down 16 |
| `scm-select__dot` | 앞 상태 도트 (옵션) |
| `scm-select__dot--accent / --success / --disabled` | 도트 색 |

## Props (React)

| prop | type |
|---|---|
| `value` | string |
| `placeholder` | string |
| `size` | `'sm' \| 'bu'` |
| `disabled` | boolean |
| `expanded` | boolean |
| `dotVariant` | `'accent' \| 'success' \| 'disabled'` |
| `onClick` | () => void |

## API (vanilla)

```js
SCM.select.mount(el, {
  value: '',
  placeholder: '선택하세요',
  size: 'sm',
  disabled: false,
  onClick: () => openMyPopup(),
});
```

## Used in (legacy → migration target)

| Legacy class | 사용처 | 마이그레이션 |
|---|---|---|
| `.form-select` | sku-register | `scm-select` |
| `.bu-select` | bulk upload modal | `scm-select scm-select--bu` |
| `.sd-select-mock` (+`.dot.is-active/is-success/is-disabled`) | sku-detail | `scm-select` + `scm-select__dot--<variant>` |
