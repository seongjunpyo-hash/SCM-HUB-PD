# scm-sizeset-btn

"사이즈 개별 설정" 셀 안 outlined 버튼. "전개 N/M" 형식 카운트 표시.

## Anatomy

```
scm-sizeset-btn (h36 outlined)
├ <span> 라벨 ("전개")
└ scm-sizeset-btn__num
    ├ <em> 강조 숫자 (used, 파랑 600)
    ├ <span class="divider">/</span> (회색)
    └ <span class="total">N</span> (회색)
```

## Props (React)

| prop | type |
|---|---|
| `used` | number |
| `total` | number |
| `label` | string (default `'전개'`) |
| `disabled` | boolean |
| `onClick` | () => void |

## API (vanilla)

```js
SCM.sizesetBtn.mount(el, {
  used: 5, total: 9,
  onClick: () => SCM.sizeDrawer.open(...),
});
```

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.mp-sizeset` (+ `.num em` / `.divider` / `.total`) | 무탠 / SKU 관리 / restock-status (사이즈 개별 설정 셀) |
