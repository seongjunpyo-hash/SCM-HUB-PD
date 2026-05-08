# scm-search-btn

필터바 검색 버튼. h44, min-width 84.

`disabled` 가 기본 상태 (필터 입력 전). 입력되면 `disabled` 제거되어 검정 outlined 톤.

## States

| 상태 | 톤 |
|---|---|
| `:disabled` (기본) | 회색 배경 (rgba(138,138,138,0.10)), 회색 텍스트 |
| `:not(:disabled)` | 흰 배경, 검정 보더, 검정 텍스트 |

## Used in (legacy → migration target)

| Legacy class | 사용처 |
|---|---|
| `.mp-search-btn` | 4개 데이터리스트 페이지 필터바 |
