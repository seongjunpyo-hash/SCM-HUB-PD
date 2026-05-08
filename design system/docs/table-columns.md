# Table — Column Width & Row Height

> v2.27.0 — SCM Hub 4개 데이터 리스트 페이지(SKU 관리 / 무탠 전개상품 / 편집샵 보충 요청 / 편집샵 보충 현황)에서 확정된 공통 spec.
> 단일 source of truth: [`components/scm-table/`](../components/scm-table/) (자가포함 컴포넌트)

LayerDesktop 데이터 테이블의 컬럼 폭은 다음 5가지 토큰 + 1개 wrap 변형으로 관리됩니다.

## 컬럼 width 토큰

| 토큰 | 동작 | 최소 | 초기 | 최대 | wrap | 사용 예 |
|---|---|---|---|---|---|---|
| **Auto** | 콘텐츠 max-content + 패딩 | min-content | content | — | nowrap | 대표스타일·컬러·UID·SKU번호·바코드·날짜 등 |
| **Small** | auto, max 160 | 100px | auto | 160px (cell-clamp) | 한 줄 | 짧은 라벨용 |
| **Medium** | **auto, max 260** | **100px** | **auto** | **260px** (cell-clamp) | **한 줄** | **카테고리·표준 카테고리·기준 카테고리·옵션** 공통 |
| **Medium + cell-clamp-2** | **2줄 wrap, 항상 260** | 260 (강제) | 260 (강제) | 260 (강제) | **2줄** | 긴 식별자 (공급사명(ID) 등) |
| **Large** | 360 (JS 강제) + resize 자유 | 100px | 360px | resize 자유 | 자연 wrap | **SKU명·상품명·스타일명** |
| **Spacer** | 100% — 우측 잉여 공간 흡수 | — | — | — | — | 항상 마지막 컬럼 |

## Row height

- **Min 68px** · 그 이후로는 **auto** (콘텐츠가 길면 늘어남)
- 본문 셀 기본 2줄 (white-space:normal + word-break:keep-all)
- 숫자/ID 류는 nowrap 유지: `cell-numeric`, `sku-num`, `cb-col`, `cb-col2`, `col-no` 등

## 핵심 패턴

### 1. 카테고리·옵션 — `col-medium > .cell-clamp` (한 줄)

```html
<th class="col-medium"><div class="cell-clamp">카테고리</div></th>
…
<td class="col-medium"><div class="cell-clamp">신발 > 운동화</div></td>
```

- 콘텐츠 폭만큼 auto 확장 (~짧으면 100, ~길면 260 까지)
- 한 줄 유지 (white-space:nowrap)
- 260 초과 시 잘림 (overflow:hidden, **ellipsis 없음**)

### 2. 옵션 chip — `col-medium > .er-opt-chips` (또는 `.sku-opt-stack`)

```html
<td class="col-medium">
  <div class="er-opt-chips">
    <span class="chip">블랙</span>
    <span class="chip">XL</span>
  </div>
</td>
```

- flex nowrap, max-width 260
- 칩 개수만큼 자연 폭, 260 초과 시 클립

### 3. 긴 ID — `col-medium > .cell-clamp-2` (2줄 wrap, 강제 260)

```html
<th class="col-medium"><div class="cell-clamp">공급사명(ID)</div></th>
<td class="col-medium"><div class="cell-clamp-2">Adidas_korea/(MX) 0382023</div></td>
```

- 항상 column 폭 260 (JS 가 강제)
- 2줄까지 wrap (max-height: calc(1.4em × 2))
- 초과 시 잘림 (overflow:hidden + overflow-wrap:anywhere)
- 영문 긴 식별자도 break 가능

### 4. 상품명 — `col-large > .cell-clamp`

```html
<th class="col-large"><div class="cell-clamp">SKU명</div></th>
<td class="col-large"><div class="er-name"><span class="er-thumb"></span><span class="cell-clamp er-name-text">…</span></div></td>
```

- JS 가 측정 시 360 최소 보정 (word-break 로 인한 auto-shrink 방지)
- resize 핸들로 100~∞ 자유 조절
- cell-clamp 는 max-width:100% (부모 fit)

### 5. multi-row sub-row stack (sku-management 의 기준 카테고리 / 상품 옵션)

```html
<td class="col-medium sku-stack-td">
  <div class="sku-stack">
    <div class="sub-row">신발 > 운동화</div>
    <div class="sub-row">의류 > 상의</div>
  </div>
</td>
```

- `.sku-stack-td { padding: 0 }` — sub-row 가 자체 padding 가짐
- `.sku-stack > .sub-row` 에 nowrap + overflow:hidden + max-width:260 (col-medium 일치)

## CSS 토큰 (구현)

```css
/* td/th 레벨 */
.mp-table th.col-auto,   .mp-table td.col-auto   { width:1%; white-space:nowrap; min-width:min-content; }
.mp-table th.col-small,  .mp-table td.col-small  { width:1%; min-width:100px; }
.mp-table th.col-medium, .mp-table td.col-medium { width:1%; min-width:100px; }
.mp-table th.col-large,  .mp-table td.col-large  { width:360px; min-width:100px; }
.mp-table th.col-spacer, .mp-table td.col-spacer { width:100%; padding:0; }

/* inner clamp */
.mp-table .col-medium > .cell-clamp   { display:inline-block; max-width:260px; white-space:nowrap; overflow:hidden; word-break:keep-all; line-height:1.4; vertical-align:top; }
.mp-table .col-medium > .cell-clamp-2 { display:inline-block; max-width:260px; white-space:normal; word-break:keep-all; overflow-wrap:anywhere; overflow:hidden; line-height:1.4; max-height:calc(1.4em*2); vertical-align:top; }
.mp-table .col-large  > .cell-clamp   { display:block; max-width:100%; word-break:keep-all; line-height:1.4; }
```

## JS 측정 단계 보정

`setupStickyThead` 가 첫 body row td 를 측정한 후 클래스 기반 보정:

```js
leafs.forEach((th, i) => {
  if (th.classList.contains('col-large')) {
    colWidths[i] = Math.max(colWidths[i], 360);            // word-break 로 좁아짐 방지
  } else if (th.classList.contains('col-medium')) {
    const td = firstBodyRow.children[i];
    if (td.querySelector(':scope > .cell-clamp-2')) {
      colWidths[i] = 260;                                   // 2줄 wrap 셀은 강제 260
    } else {
      colWidths[i] = Math.max(100, Math.min(colWidths[i], 260));
    }
  }
});
```

## resize 핸들 spec

- 우측 가장자리 8px (right:-4px, width:8px) 영역
- hover 시 가운데 2px 블루(#3B82F6) 라인 표시
- 드래그 시 col 폭 변경 + 테이블 총 폭 동시 update (다른 컬럼 압축 방지)
- 최소 100px
- 2단 thead 의 row2 leaf 핸들은 `is-row2` 클래스 → top:-44px 로 row1 영역까지 확장

## 참고 / 관련 문서

- [`components/scm-table/`](../components/scm-table/) — 실제 구현 (자가포함 모듈)
- [`docs/cell-selection.md`](./cell-selection.md) — Excel-like 셀 선택 / TSV 복사 / 헤더 더블클릭
- [`docs/data-list-page.md`](./data-list-page.md) — 데이터 리스트 페이지 표준 템플릿
