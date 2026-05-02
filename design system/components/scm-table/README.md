# SCM Table

SCM HUB 의 데이터 리스트 페이지(SKU 관리 / 무탠 전개상품 / 편집샵 보충 요청 / 편집샵 보충 현황) 4개 화면의 공통 테이블 컴포넌트. 자가 포함되어 있어 `scm-table.css` + `scm-table.js` 만 import 하면 동일한 동작 / 외관이 재현된다.

## 구성 파일

- `scm-table.css` — 모든 컬럼 폭 / cell-clamp / sticky thead / 셀 선택 / resize 핸들 / 2단 thead group-row 스펙
- `scm-table.js` — sticky thead 분리, resize 핸들, 컬럼 reorder, 헤더 더블클릭 컬럼 선택, Excel-like 드래그 선택, Cmd+C TSV 복사
- `README.md` — 본 문서

## 사용

### HTML 구조

```html
<head>
  <link rel="stylesheet" href="/design-system/components/scm-table/scm-table.css" />
</head>
<body>
  <div class="mp-thead-sticky"><div class="mp-thead-scroll"></div></div>
  <div class="mp-table-scroll">
    <table class="mp-table">
      <thead>
        <tr>
          <th class="cb-header col-frozen-1">…</th>
          <th class="col-auto col-frozen-2">바코드No</th>
          <th class="col-auto col-frozen-3">스토어명</th>
          <th class="col-medium"><div class="cell-clamp">카테고리</div></th>
          <th class="col-medium">옵션</th>
          <th class="col-large"><div class="cell-clamp">SKU명</div></th>
          <th class="col-medium"><div class="cell-clamp">공급사명(ID)</div></th>
          <th class="col-spacer"></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="cb-col col-frozen-1">…</td>
          <td class="col-auto col-frozen-2">50K42345</td>
          <td class="col-auto col-frozen-3">스토어 A</td>
          <td class="col-medium"><div class="cell-clamp">신발 > 운동화</div></td>
          <td class="col-medium"><div class="er-opt-chips">…</div></td>
          <td class="col-large"><div class="cell-clamp">…</div></td>
          <td class="col-medium"><div class="cell-clamp-2">Adidas_korea/(MX)0382023</div></td>
          <td class="col-spacer"></td>
        </tr>
      </tbody>
    </table>
  </div>

  <script type="module">
    import { SCMTable } from '/design-system/components/scm-table/scm-table.js';
    SCMTable.init({ frozenCount: 3 }); // frozen 컬럼 개수
  </script>
</body>
```

### 또는 script 태그로

```html
<script src="/design-system/components/scm-table/scm-table.js"></script>
<script>
  SCMTable.init({ frozenCount: 3 });
</script>
```

## 컬럼 폭 시스템

| 클래스 | 최소 | 초기 | 최대 | 콘텐츠 wrap |
|---|---|---|---|---|
| `col-auto` | min-content | content | — | nowrap |
| `col-small` | 100 | auto | (cell-clamp 160) | 한 줄 |
| `col-medium` | **100** | **auto** | **260** | **한 줄** (cell-clamp) |
| `col-medium` + `cell-clamp-2` | **260** (강제) | **260** (강제) | **260** | **2줄** wrap |
| `col-large` | 100 | **360** (강제) | resize 자유 | 자연 wrap |
| `col-spacer` | — | 100% (남는 공간) | — | — |

resize 핸들 최소: **100px** (일관)

### 카테고리·옵션 공통 가이드 (col-medium)

- **카테고리·표준 카테고리·기준 카테고리·옵션** 모두 `col-medium` + `cell-clamp` 사용 → 한 줄, max 260, 초과 시 잘림
- **공급사명(ID) 등 긴 식별자** → `col-medium` + `cell-clamp-2` 사용 → 2줄 wrap, 항상 260 폭
- **chip stack** (옵션 칩) → `er-opt-chips` 또는 `sku-opt-stack` wrapper (max 260, flex nowrap)
- **multi-row sub-row stack** (sku-management 의 기준 카테고리 / 상품 옵션) → `sku-stack > .sub-row` (max 260, nowrap)

## 인터랙션

### 1. Sticky thead (듀얼 테이블)
브라우저의 `position:sticky` on table-row 렌더 버그 회피용. JS 가 init 시 본문 thead 를 `.mp-thead-sticky .mp-thead-scroll` 컨테이너로 이동하고 colgroup 으로 본문과 너비 동기화.

### 2. Frozen 컬럼
`col-frozen-1`, `col-frozen-2`, … 클래스 부여. JS 가 누적 `--frozen-l1..N` left offset 을 `:root` 에 set. `position:sticky !important` 로 어떤 클래스도 sticky 를 깨지 못하게 방어.

### 3. resize 핸들
헤더 우측 가장자리 8px hover area. 드래그 시 col 폭 변경 + 테이블 총 폭도 같이 update (다른 컬럼 압축 방지).

2단 thead 의 row2 leaf 셀의 핸들은 `is-row2` 클래스로 row1 영역까지 위로 확장되어 사용자가 thead 어느 높이에서든 컬럼 boundary 잡을 수 있음.

### 4. 헤더 더블클릭 → 컬럼 전체 선택
헤더를 더블클릭하면 그 컬럼의 모든 셀이 선택됨. Cmd+C 로 컬럼 전체 TSV 복사 가능.

### 5. Excel-like 셀 드래그 선택
mousedown + 드래그로 범위 선택. 외곽 4변에 옅은 블루(#3B82F6) 라인 + bg `rgba(59,130,246,0.08)`. Cmd/Ctrl+C 로 TSV 형식으로 클립보드 복사.

### 6. 헤더 reorder (1단 thead 만)
HTML5 drag/drop API. frozen 컬럼은 reorder 제외. 2단 thead 는 그룹 경계 보존을 위해 reorder 비활성화.

## 옵션

```js
SCMTable.init({
  root: document,                                  // 기본: document
  frozenCount: 3,                                  // 좌측 sticky 컬럼 개수
  scrollSelector: '.mp-table-scroll',              // 본문 스크롤 컨테이너
  stickySelector: '.mp-thead-sticky .mp-thead-scroll', // sticky thead 컨테이너
});
```

## 확장 / 서브 모듈

`scm-table.js` 는 일괄 init 외에도 개별 함수를 export 하므로 필요한 부분만 사용 가능:

```js
import { setupStickyThead, setupTableInteractions, setupCellSelection } from '.../scm-table.js';
setupStickyThead(document, { frozenCount: 6 });
setupTableInteractions(document, { frozenCount: 6 });
setupCellSelection(document);
```

`buildLeafHeaders(thead)` 도 export — 1단/2단 thead 의 leaf header 배열(body td idx 와 1:1 매핑)을 얻을 수 있음.

## 의존성

- 없음 (vanilla JS, ES2017+, modern CSS)
- `:has()`, `:scope` selector 사용 (Chrome 105+, Safari 15.4+, Firefox 121+)
- `position:sticky`, `box-shadow inset` 활용

## CHANGELOG

- v1.0 — 초기 추출. 4개 SCM HUB 페이지에서 동일 동작 보장.
