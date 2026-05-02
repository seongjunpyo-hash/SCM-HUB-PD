# scm-code-link

데이터 리스트 셀의 underlined link. UID / SKU / 바코드 / 스타일넘버 trigger.

15/400 #000 underlined.

## Marker

```html
<a class="scm-code-link" data-code-type="uid">383827</a>
<a class="scm-code-link" data-code-type="sku">S000001 외 6</a>
```

## Sub

`scm-code-link__extra` — "외 N" 같은 부가 텍스트.

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.mp-link` (+ `.mp-uid-trigger` / `.mp-code-trigger`) | 4개 데이터리스트 페이지 셀 (UID/SKU/바코드/스타일넘버) |
| `.sd-sku-link` (sku-detail) | 동일 — `scm-code-link` 사용 가능 |
