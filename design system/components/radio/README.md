# scm-radio

라디오 버튼. `form-radio` (sku-register) + `bu-radio` (bulk upload) 두 패턴을 통합한 단일 모듈.

## Marker

```html
<label class="scm-radio">
  <input type="radio" name="..." value="..." />
  <span class="scm-radio-dot"></span>
  <span>라벨</span>
</label>
```

`<input>` 은 시각적으로 숨김 (`width:0; height:0; opacity:0`). `.scm-radio-dot` 가 시각 요소.

## Sizes

| 클래스 | gap | font |
|---|---|---|
| (기본) | 8 | 15/400 |
| `scm-radio--sm` | 6 | 14/400 |

## States

| 상태 | 결과 |
|---|---|
| `input:checked` | dot 검정 + 흰 안쪽 점 (8×8) |
| `input:disabled` 또는 `[aria-disabled="true"]` | 회색 톤, cursor not-allowed |

## Group

| 클래스 | 레이아웃 |
|---|---|
| `scm-radio-group` | inline-flex, gap 32 |
| `scm-radio-group--sm` | gap 12 (modal 톤) |
| `scm-radio-group--2col` | wrap, gap 12 100, max-width 1200 |

## React

```jsx
<RadioGroup>
  <Radio name="g" value="1" defaultChecked>옵션 1</Radio>
  <Radio name="g" value="2">옵션 2</Radio>
</RadioGroup>

<RadioGroup size="sm" layout="2col">
  <Radio name="g2" value="a">A</Radio>
  <Radio name="g2" value="b">B</Radio>
</RadioGroup>
```

## API (vanilla)

```js
const g = SCM.radio.group(groupEl, {
  size: 'sm',
  layout: '2col',
  onChange: (value, input) => console.log(value),
});
g.getValue();
g.setValue('option-2');
```

## Used in (legacy → migration target)

| Legacy class | 사용처 | 마이그레이션 |
|---|---|---|
| `.form-radio`, `.form-radio-group` | sku-register | `scm-radio`, `scm-radio-group` |
| `.form-radio-2col` | sku-register | `scm-radio-group--2col` |
| `.bu-radio`, `.bu-radio-group` | bulk upload modal | `scm-radio scm-radio--sm`, `scm-radio-group scm-radio-group--sm` |

기존에 두 모듈로 갈렸던 라디오를 단일 모듈로 통합. 기능 손실 없음.
