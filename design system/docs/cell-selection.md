# Cell Selection — Excel-like

> v2.27.0 — SCM Hub 4개 데이터 리스트 페이지에서 확정된 spec.
> 단일 source of truth: [`components/scm-table/scm-table.js`](../components/scm-table/scm-table.js) `setupCellSelection()`

데이터 테이블의 본문 셀에 대해 Excel 같은 드래그 선택 / TSV 복사 / 헤더 더블클릭 컬럼 선택을 제공한다.

## 인터랙션

| 동작 | 효과 |
|---|---|
| 셀 클릭 | 단일 셀 선택 |
| 셀 드래그 | 직사각형 범위 선택 (mousedown + mouseover + mouseup) |
| 헤더 더블클릭 | 해당 컬럼 전체 선택 (`tableEl._selectColumn(c)`) |
| Cmd/Ctrl + C | 선택된 셀들을 TSV (탭 구분) 형식으로 클립보드 복사 |
| 표 외부 클릭 | 선택 해제 |
| 인터랙티브 요소 클릭 (`a, button, input, label, .mp-cb`) | 선택 해제 + 네이티브 동작 통과 |

## 시각 spec

| 요소 | 값 |
|---|---|
| 선택 셀 bg | `#EFF5FE` (white + 8% blue 미리 합성한 솔리드 — frozen 셀 비침 방지) |
| 선택 외곽 라인 | `#3B82F6` (Tailwind blue-500) |
| 라인 두께 | 2px (inset box-shadow) |
| 적용 위치 | 선택 영역의 **외곽 4변에만** (Excel-like) |
| active cell | 별도 라인 없음 — bg 만 |

## 클래스

```css
.mp-table.is-cell-selectable                    /* JS init 시 부여 */
.mp-table tbody td.cell-selected                /* 선택된 모든 셀 */
.mp-table tbody td.cell-selected.sel-top        /* 외곽 영역 상단 */
.mp-table tbody td.cell-selected.sel-right      /* 외곽 영역 우측 */
.mp-table tbody td.cell-selected.sel-bottom     /* 외곽 영역 하단 */
.mp-table tbody td.cell-selected.sel-left       /* 외곽 영역 좌측 */
.mp-table tbody td.cell-active                  /* mouseup 시 마지막 셀 */
```

## 라인 구현 (CSS 변수 토글)

```css
.mp-table tbody td.cell-selected {
  background: var(--scm-sel-bg) !important;
  --sel-t: 0; --sel-r: 0; --sel-b: 0; --sel-l: 0;
  box-shadow:
    inset 0 calc(var(--sel-t) * 2px) 0 0 var(--scm-sel-line),
    inset calc(var(--sel-r) * -2px) 0 0 0 var(--scm-sel-line),
    inset 0 calc(var(--sel-b) * -2px) 0 0 var(--scm-sel-line),
    inset calc(var(--sel-l) * 2px) 0 0 0 var(--scm-sel-line);
}
.mp-table tbody td.cell-selected.sel-top    { --sel-t: 1; }
.mp-table tbody td.cell-selected.sel-right  { --sel-r: 1; }
.mp-table tbody td.cell-selected.sel-bottom { --sel-b: 1; }
.mp-table tbody td.cell-selected.sel-left   { --sel-l: 1; }
```

## 제외되는 셀

선택 대상에서 제외되는 td:
- `.cb-col`, `.cb-col2` — 체크박스 셀
- `.col-spacer` — 우측 잉여 공간 흡수용

## TSV 복사

Cmd/Ctrl + C 시 `document.copy` 이벤트 핸들러가:
1. 선택된 셀들을 `byRow[rowIdx][colIdx]` 매트릭스로 정리
2. 각 셀의 `innerText` (input 셀이면 `.value`)
3. 행 단위로 `\t` 조인 + 개행 `\n`
4. 셀 값에 `\t \n "` 포함 시 따옴표 escape (`""` + 양 끝 `"`)
5. `clipboardData.setData('text/plain', tsv)` + `preventDefault()`

Excel·Google Sheets 에 그대로 붙여넣기 가능.

## API — 헤더 더블클릭 컬럼 선택

`setupCellSelection` 이 tableEl 에 `_selectColumn(c)` 함수를 노출한다:

```js
const tableEl = document.querySelector('.mp-table-scroll .mp-table');
tableEl._selectColumn(5); // 인덱스 5 컬럼 전체 선택
```

`setupTableInteractions` 의 헤더 더블클릭 핸들러가 이 API 를 호출.

## 사용

```js
import { setupCellSelection } from '/design-system/components/scm-table/scm-table.js';
setupCellSelection(document, { scrollSelector: '.mp-table-scroll' });
```

또는 `SCMTable.init()` 안에 일괄 포함되어 있음.

## 참고

- input 셀 (`er-input-cell`) 클릭 시: 해당 셀만 `cell-active` 표시 + input 편집 모드 (preventDefault 없이 통과)
- 텍스트 더블클릭으로 인한 native text selection 방지: `getSelection().removeAllRanges()`
- frozen 컬럼도 정상 선택 가능 — `position:sticky !important` 가 cell-selected 클래스에 의해 깨지지 않게 방어
