# Data-List Page — 공통 패턴 / Gotchas

> 2026-05 stock-movement + product-arrival-status 페이지 작업에서 확립된 패턴 모음.
> **새 데이터 리스트 페이지를 만들거나 기존 페이지를 수정할 때 이 문서의 룰을 모두 적용해야 한다.**
>
> 이 문서는 [`data-list-page.md`](./data-list-page.md) 의 sticky stack / dual-table thead /
> frozen / cell-selection 4대 시스템에 더해, 실제 데모 페이지 구현 시 반복적으로 만나는
> 함정 (gotcha) 과 해결 패턴을 정리. CLAUDE.md 가 이 문서를 참조한다.

---

## 1. `.mp-table` column class — 언제 어떤 걸 쓰는가

| class | 적용된 폭 | white-space | wrap-needed | 사용처 |
|---|---|---|---|---|
| `col-auto`   | 측정된 자연 폭 (1%) | **`nowrap` (기본)** | 강제 wrap 시 페이지 스코프에서 override | 짧은 코드 / 상태 칩 / 수치 셀 |
| `col-small`  | min 100 / 1% | normal | OK | 거의 안 씀 |
| `col-medium` | **88-260px 강제 캡** (SCMTable.init class-based 보정) | normal | OK | 카테고리 / 옵션 같은 단순 chip 셀 |
| `col-large`  | **320px 강제** (SCMTable.init class-based 보정) | normal | `cell-clamp` 와 같이 쓰면 2줄 wrap | SKU명 / 상품명 |
| `col-spacer` | 100% (남는 가로 공간 흡수) | — | — | 테이블 맨 우측 마지막 셀 |

### ⚠️ 트랩

1. **`col-medium` 은 260px 를 절대 못 넘는다.** SCMTable.init 의 `setupStickyThead` 가
   `Math.min(colWidths[i], COL_MEDIUM_MAX)` 로 강제 캡. 300px / 320px 폭이 필요한 컬럼에
   `col-medium` 쓰면 텍스트가 잘림.
   - 해결: `col-auto` + 페이지 스코프에서 `width: 300px; min/max-width: 300px; white-space: normal` 명시.

2. **`col-auto` 의 `white-space: nowrap`.** 긴 텍스트 셀에 `col-auto` 쓰면 wrap 안 됨.
   페이지 스코프에서 `white-space: normal` 명시 필요.

3. **`col-large` 는 320px 로 lock.** 300 / 350 같이 다른 값을 원하면 `col-large` 쓰면 안 됨.
   `col-auto` + 명시 width 사용.

### 폭 고정이 필요한 컬럼 표준 패턴

```css
.mp-table th.{custom-class},
.mp-table td.{custom-class} {
  width: {N}px;
  min-width: {N}px;
  max-width: {N}px;
  white-space: normal;     /* col-auto 의 nowrap override */
}
```

```html
<th class="col-auto {custom-class}">컬럼명</th>
<td class="col-auto {custom-class}">...</td>
```

---

## 2. 한글 셀 콘텐츠 wrap 표준

긴 한글 텍스트 (SKU 명 / 이동 사유 / 메모 등) 가 셀 폭을 초과할 때:

```css
.{cell-content-class} {
  word-break: keep-all;       /* 한글 어절 단위 wrap (스페이스 기준) */
  overflow-wrap: break-word;  /* 영문 긴 토큰 fallback (break opportunity 없을 때) */
}
```

### `display: inline-flex` 가 wrap 막는 함정

타이틀 + 워닝 아이콘처럼 가로 배치한 inline 컨테이너가 wrap 안 되는 경우:

```css
/* ❌ inline-flex 는 content 폭으로 자동 셀 폭 무시 */
.stm-reason-title { display: inline-flex; ... }

/* ✅ flex (block) 로 바꿔야 부모 td 폭 인지 + wrap */
.stm-reason-title { display: flex; align-items: flex-start; gap: 4px; ... }
```

---

## 3. 2-row thead — Group-row + Leaf-row 구성

### 표준 패턴

```html
<thead>
  <tr class="group-row">
    <!-- frozen 영역 — 대부분 rowspan=2 로 leaf 까지 점유 -->
    <th class="cb-col col-frozen-1" rowspan="2">…</th>
    <th class="col-auto col-frozen-2" rowspan="2">…</th>
    <th class="col-{auto|medium|large} col-frozen-3 col-frozen-last" rowspan="2">…</th>

    <!-- 그룹 컬럼 — colspan 으로 row2 leaf 여러 개 cover (선택적) -->
    <th colspan="N">그룹 라벨 또는 split header</th>

    <!-- 나머지 단일 컬럼 — rowspan=2 -->
    <th class="col-auto …" rowspan="2">…</th>
    …
    <th class="col-spacer" data-empty="true" rowspan="2" aria-hidden="true"></th>
  </tr>
  <tr>
    <!-- row2 leaves — row1 의 colspan 그룹 셀 아래 위치하는 leaf 만 -->
    <th class="col-auto …">…</th>
    …
  </tr>
</thead>
```

### ⚠️ 트랩 1 — row2 첫 leaf 의 좌측 doubled 라인

row1 의 `col-frozen-last` 가 rowspan=2 로 row2 까지 점유하면, row2 의 첫 leaf 셀은
base CSS 의 `.col-frozen-last + :not(col-frozen) { border-left: 0 }` 룰이 안 닿아서
좌측 보더가 frozen 우측 보더와 겹쳐 이중선처럼 보임.

```css
/* 페이지 스코프 — row2 첫 leaf 의 좌측 보더 제거 */
.mp-table thead tr:not(.group-row) th.{first-leaf-class} { border-left: 0; }
```

### ⚠️ 트랩 2 — group-row 의 non-frozen non-empty 셀이 sticky-left 로 강제됨

base `scm-table.css` line 651:
```css
.mp-table thead .group-row th:not([class*="col-frozen"]):not([data-empty="true"]) {
  position: sticky;
  left: var(--frozen-l-end, 0);
  z-index: 4;
}
```

sku-management 의 "기본 정보" / "상품 정보" 같은 **그룹 라벨** 을 가로 스크롤 중에도
frozen 영역 우측에 sticky 로 붙여 라벨이 항상 보이게 하는 룰. 그런데 그룹 라벨이
아닌 split-header 그룹 셀 (예: 이동번호 + 펼치기 버튼) 에도 매치돼서 헤더가 본문과
따로 노는 회귀 발생.

```css
/* 페이지 스코프 — 해당 셀만 sticky 비활성화. ID 직접 타겟 (thead 가 sticky clone 으로 옮겨가도 매치) */
#{my-split-head-id} {
  position: static;
  z-index: auto;
}
```

### ⚠️ 트랩 3 — 페이지 스코프 셀렉터 시 thead 위치

`setupStickyThead` 는 `cloneTable.appendChild(origThead)` 로 thead 를 **이동** (clone 아님).
따라서 `#stm-table thead ...` 같이 table id 를 selector 의 ancestor 로 둔 룰은 init 후
매치 안 됨. **셀 자체의 class / id 로 직접 타겟해야 안전.**

```css
/* ❌ thead 가 sticky clone 컨테이너로 옮겨가면 매치 안 됨 */
#my-table thead th.stm-c-moveno { … }

/* ✅ 셀 클래스로 직접 타겟 */
.mp-table thead tr:not(.group-row) th.stm-c-moveno { … }
```

---

## 4. tbody Row Grouping — `iss-merged-cell` 패턴

같은 등록(reg) 번호의 inner item 들을 시각적으로 merge 할 때, **real HTML `rowspan`
은 쓰지 말 것.** SCMTable.init 의 frozen-class 자동 재할당이 child index 기반이라
rowspan 으로 빈 셀이 있는 tr 에서 좌표가 어긋남.

### 대신 — every-tr-all-leaves + `iss-merged-cell` 클래스

```js
function rowsToHtml(rows) {
  return rows.map(r => r.items.map((it, idx) => {
    const isFirst = idx === 0;
    const oCls = isFirst ? '' : ' iss-merged-cell';
    // outer 컬럼 — first 만 콘텐츠, 나머지 row 는 빈문자열
    const regCnt = isFirst ? `<div>${r.regNo}</div>` : '';
    return `<tr>
      <td class="… col-frozen-1${oCls}">${regCnt}</td>
      …
    </tr>`;
  }).join('')).join('');
}
```

```css
/* sub-row 의 outer 빈셀 — border-top:0 로 first row outer 셀과 시각 merge.
   frozen 셀은 sticky 라 뒤 셀 비침 방지 위해 SOLID white 명시. */
#{my-tbody-id} td.iss-merged-cell {
  border-top: 0;
  background: #fff;
}
#{my-tbody-id} tr:hover td.iss-merged-cell {
  background: var(--ld-bg-low, #FAFBFC);
}
```

---

## 5. Status Chip — 상태별 variant 매핑

| 상태 | variant | 색 |
|---|---|---|
| 입고완료 | `scm-status-chip--done` | green `#1EA514` |
| 출고완료 | `scm-status-chip--processing` | blue `#245EFF` |
| 출고대기 / 입고대기 | `scm-status-chip--waiting` | gray `#666` |
| 출고취소 / 입고취소 | `scm-status-chip--cancel` | red `#F31110` |
| (이동중 등 보라톤) | `scm-status-chip--moving` | purple `#981AFF` |

```html
<span class="scm-status-chip scm-status-chip--{variant}">상태 텍스트</span>
```

---

## 6. 필터바 — Joined Chip Group

출발지 / 도착지 처럼 인접한 두 chip 을 segmented pair 로 연결할 때:

```html
<span class="scm-filter-group">
  <button class="scm-filter-select">출발지</button>
  <button class="scm-filter-select">도착지</button>
</span>
```

`scm-filter-select.css` 의 base `.scm-filter-group` 은 `inline-flex` 만 정의. radius
zeroing + first/last child rounding 은 **페이지 스코프에서 opt-in 필요**:

```css
.scm-filter-group > * { border-radius: 0 !important; }
.scm-filter-group > *:first-child {
  border-top-left-radius: 4px !important;
  border-bottom-left-radius: 4px !important;
}
.scm-filter-group > *:last-child {
  border-top-right-radius: 4px !important;
  border-bottom-right-radius: 4px !important;
}
.scm-filter-group > *:not(:last-child) { border-right-width: 0 !important; }
```

### 필요한 markup — `전체 필터` drawer 동작

페이지에 다음 3개 markup 이 모두 있어야 `SCM.filterPopoverModes.init` 후 정상 동작:

```html
<!-- 1. popover root (single/multi/codeinput/datepicker 공용 anchor) -->
<div class="scm-filter-popover-root" id="filter-popover-root" role="dialog" aria-hidden="true"></div>

<!-- 2. drawer backdrop -->
<div class="scm-filter-drawer-backdrop" id="fd-backdrop" hidden></div>

<!-- 3. drawer 본체 — 본문은 init 시 EXTRA_REGISTRY 기반 자동 생성 -->
<aside class="scm-filter-drawer" id="filter-drawer" hidden role="dialog" aria-label="전체 필터">
  <header class="scm-filter-drawer__header">
    <h2>전체 필터</h2>
    <button class="scm-filter-drawer__close" type="button" aria-label="닫기">
      <svg viewBox="0 0 20 20"><use href="#ic-close"/></svg>
    </button>
  </header>
  <div class="scm-filter-drawer__body"></div>
  <footer class="scm-filter-drawer__footer">
    <button class="scm-filter-drawer__reset" type="button">
      <svg viewBox="0 0 20 20"><use href="#ic-refresh"/></svg>
      <span>전체 초기화</span>
    </button>
    <button class="scm-filter-drawer__apply" type="button">검색 적용</button>
  </footer>
</aside>
```

---

## 7. 체크박스 — 3-state 동기화

base `checkbox.css` 는 `aria-checked="mixed"` 로 indeterminate (대시 `-`) 자동 렌더.
하지만 `aria-checked` 를 직접 토글하는 페이지는 **MutationObserver 로 cb-all 상태 sync**
명시 필요:

```js
const observer = new MutationObserver(refreshHeaderCb);
observer.observe(tbodyEl, { attributes: true, subtree: true, attributeFilter: ['aria-checked'] });

function refreshHeaderCb() {
  const all = tbodyEl.querySelectorAll('.scm-checkbox');
  const checked = tbodyEl.querySelectorAll('.scm-checkbox[aria-checked="true"]').length;
  const cbAll = document.getElementById('header-cb-all');
  if (!cbAll || all.length === 0) return;
  const next = checked === 0 ? 'false' : checked === all.length ? 'true' : 'mixed';
  if (cbAll.getAttribute('aria-checked') !== next) cbAll.setAttribute('aria-checked', next);
}
```

헤더 cb-all 클릭 시 mixed 상태에서는 → `true` (전체 선택) 로 가는 게 표준 UX:
```js
const cur = cbAll.getAttribute('aria-checked') === 'true';   // 'mixed' 도 cur=false
const next = cur ? 'false' : 'true';                          // mixed → true (전체 선택)
```

---

## 8. Side Drawer 안의 mp-table

### 표준 — `data-scm-skip-init="true"` + 자체 sticky thead

drawer 안의 테이블은 **SCMTable.init 에 통째로 skip 시키고** 페이지 스코프에서
직접 처리. 이유: SCMTable.init 의 `setupStickyThead` 가 thead 를 이동시킨 후
drawer 가 닫혔다 열릴 때 race condition / rebuild() 버그.

```html
<div class="mp-table-host {page}-drawer__table-host">
  <div class="mp-table-scroll">
    <table class="mp-table" id="{page}-drawer-table" data-scm-skip-init="true">
      <colgroup>
        <col class="col-frozen-1" style="width:54px"/>
        <col class="col-frozen-2" style="width:320px"/>
        …
      </colgroup>
      <thead><tr>…</tr></thead>
      <tbody>…</tbody>
    </table>
  </div>
</div>
```

```css
/* drawer 안 mp-table — table-layout: fixed 로 colgroup 폭 강제.
   base .mp-table { width:100% } 가 컨테이너 폭으로 stretch 시키는 회귀 차단. */
#{my-drawer} .{drawer}-table-host .mp-table {
  table-layout: fixed;
  width: {sum_of_colgroup_widths}px;
  min-width: {sum_of_colgroup_widths}px;
}

/* drawer 안 thead sticky — thead 자체에 sticky 적용 (frozen <th> 의 양방향 sticky
   조합 버그 회피). */
#{my-drawer} .{drawer}-table-host .mp-table-scroll > .mp-table > thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
}
#{my-drawer} .{drawer}-table-host .mp-table-scroll thead th { background: #fff; }
/* frozen th 의 z-index 는 thead z=10 안에서 z=2 로 비-frozen th 위에 stack */
#{my-drawer} .{drawer}-table-host .mp-table-scroll thead th.col-frozen-1,
#{my-drawer} .{drawer}-table-host .mp-table-scroll thead th.col-frozen-2,
… {
  z-index: 2;
}

/* drawer 안 mp-table 의 본문 셀 — wrap 보장 */
#{my-drawer} .{drawer}-table-host .mp-table tbody td { white-space: normal; }

/* frozen offset CSS 변수 — table-host scope */
#{my-drawer} .{drawer}-table-host {
  --frozen-l1: 0;
  --frozen-l2: {col1_w}px;
  --frozen-l3: {col1+col2}px;
  …
}
```

### Drawer 폭 — 반응형 (`min(content, 80vw)`)

```css
#{my-drawer} {
  /* 와이드 모니터: drawer = content 폭 (스크롤 없음) / 좁은 모니터: drawer = 80vw (테이블 스크롤) */
  width: min({content_max_px}, 80vw);
  max-width: none;
}
```

`content_max_px` = sum of colgroup widths + drawer body padding. 보통 1700-1800.

### `SCMTable.rebuild()` 버그 우회 — 동적 구조 변경 후 재init

`scm-table.js` 의 `rebuildOneTable` 은 `stickyInner.innerHTML = ''` 로 thead 까지
파괴하는 버그가 있어 사용 불가. **수동 reinit 패턴**:

```js
function manualRebuild(tableId) {
  const tbl = document.getElementById(tableId);
  const host = tbl && tbl.closest('.mp-table-host');
  if (!tbl || !host) return;
  const stickyInner = host.querySelector('.mp-thead-sticky .mp-thead-scroll');
  // 1) sticky 안에 옮겨진 thead 를 origTable 로 복귀
  if (stickyInner) {
    const stickyThead = stickyInner.querySelector('thead');
    if (stickyThead) {
      const tbody = tbl.querySelector('tbody');
      if (tbody) tbl.insertBefore(stickyThead, tbody);
      else       tbl.appendChild(stickyThead);
    }
    stickyInner.innerHTML = '';
  }
  // 2) 이전 setup 이 추가한 colgroup 제거
  const cg = tbl.querySelector(':scope > colgroup');
  if (cg) cg.remove();
  // 3) inline style 클리어
  tbl.style.tableLayout = '';
  tbl.style.width = '';
  tbl.style.minWidth = '';
  // 4) init flag 리셋 + init 재호출
  tbl.dataset.scmInited = '';
  if (window.SCMTable) window.SCMTable.init({ root: document });
}
```

---

## 9. 카드 가로 스크롤 + 더 보기 버튼

카드 / 정보 블록이 가로로 나열되어 viewport 폭 초과 시:

```html
<div class="cards-wrap" id="cards-wrap">
  <div class="cards" id="cards">
    <div class="card">…</div>
    <div class="card">…</div>
    …
  </div>
  <div class="cards-fade" aria-hidden="true"></div>
  <button class="cards-more" type="button" aria-label="카드 더 보기">
    <svg viewBox="0 0 16 16"><path d="M6 3l5 5-5 5" …/></svg>
  </button>
</div>
```

```css
.cards-wrap { position: relative; }
.cards {
  display: flex; flex-wrap: nowrap; gap: 12px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;          /* Firefox */
  -ms-overflow-style: none;       /* IE / Edge */
}
.cards::-webkit-scrollbar { display: none; }
.cards-more {
  position: absolute; top: 50%; right: 8px;
  transform: translateY(-50%);
  width: 36px; height: 36px;
  background: #fff; border: 1px solid #E0E0E0; border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  display: none; cursor: pointer; z-index: 2;
}
.cards-wrap.has-overflow .cards-more { display: inline-flex; }
.cards-more.is-end svg { transform: rotate(180deg); }
.cards-fade {
  position: absolute; top: 0; right: 24px; bottom: 0;
  width: 56px;
  background: linear-gradient(to right, rgba(255,255,255,0), #fff 80%);
  pointer-events: none; display: none;
}
.cards-wrap.has-overflow:not(.is-end) .cards-fade { display: block; }
```

```js
function syncOverflowState() {
  const overflow = cards.scrollWidth > cards.clientWidth + 1;
  wrap.classList.toggle('has-overflow', overflow);
  const atEnd = cards.scrollLeft + cards.clientWidth >= cards.scrollWidth - 1;
  wrap.classList.toggle('is-end', atEnd);
}
cards.addEventListener('scroll', syncOverflowState, { passive: true });
window.addEventListener('resize', syncOverflowState);

moreBtn.addEventListener('click', () => {
  const atEnd = wrap.classList.contains('is-end');
  if (atEnd) cards.scrollTo({ left: 0, behavior: 'smooth' });
  else       cards.scrollBy({ left: 280, behavior: 'smooth' });
});
```

---

## 10. Cancel Modal + Notify Modal — 표준 패턴

### Cancel Confirm Modal (360px)

```html
<div class="cancel-modal-backdrop" id="cancel-modal-backdrop" hidden></div>
<div class="cancel-modal" id="cancel-modal" hidden role="dialog" aria-labelledby="cancel-modal-title">
  <h3 class="cancel-modal__title" id="cancel-modal-title">{action} 를 진행하시겠습니까?</h3>
  <p class="cancel-modal__desc">{action} 는 즉시 반영되지 않고 순차적으로 처리됩니다. 처리 완료 시 좌측 메뉴 알림으로 결과를 안내해 드립니다.</p>
  <div class="cancel-modal__reason">
    <div class="cancel-modal__reason-label-row">
      <label class="cancel-modal__reason-label" for="cancel-reason-input">취소사유</label>
      <span class="cancel-modal__reason-req" aria-hidden="true"></span>
    </div>
    <div class="cancel-modal__reason-box">
      <textarea id="cancel-reason-input" class="cancel-modal__reason-input" maxlength="50" placeholder="취소 사유를 입력해 주세요" rows="2"></textarea>
    </div>
    <div class="cancel-modal__reason-counter"><strong id="cancel-reason-count">0</strong>/50</div>
  </div>
  <div class="cancel-modal__footer">
    <button type="button" class="cancel-modal__btn-cancel" id="cancel-modal-cancel">취소</button>
    <button type="button" class="cancel-modal__btn-confirm" id="cancel-modal-confirm" disabled>확인</button>
  </div>
</div>
```

CSS 는 `stock-movement.html` / `product-arrival-status.html` 의 `.iss-cancel-modal*` /
`.stm-cancel-modal*` 셋 참고 (동일 spec). 핵심:
- width 360 / box-shadow 0 10px 15px 8px rgba(0,0,0,0.05) / border-radius 6
- 사유 textarea 50자 제한 + 카운터 + 사유 비어있으면 확인 버튼 disabled
- 확인 후 `onConfirm(reason)` 콜백으로 사유 전달

### Notify Modal (640px) — 알림함

```html
<div class="notify-modal-backdrop" id="notify-modal-backdrop" hidden></div>
<div class="notify-modal" id="notify-modal" hidden role="dialog" aria-labelledby="notify-modal-title">
  <header class="notify-modal__head">
    <h2 class="notify-modal__title" id="notify-modal-title">알림함</h2>
  </header>
  <div class="notify-modal__body">
    <div class="notify-table" id="notify-modal-tbody"></div>
  </div>
  <footer class="notify-modal__footer">
    <button class="notify-modal__close-btn" type="button" id="notify-modal-close-btn">닫기</button>
  </footer>
</div>
```

각 row 는 `처리일시 | 내용 | 처리자` 3컬럼. 내용 컬럼은 "{N}건 {action} {성공/실패}" +
참조번호 + "확인하기" CTA.

### 알림함 버튼 상태 머신

```js
const state = { progress: 0, complete: 0 };
function refreshNotifyBtn() {
  // progress > 0          → "진행중 X/Y"  (blue)   Y = complete (분모 누적)
  // progress 0, complete>0 → "완료 N"      (green)
  // 둘 다 0                → divider / status 둘 다 hidden
}
function bumpProgress(n) { state.progress += n; refreshNotifyBtn(); }
function completeNotify(k) {
  state.progress -= k;
  state.complete += k;
  refreshNotifyBtn();
}
// 데모 transition — N건 진행 시 5초 후 절반 완료, 10초 후 전체 완료
function scheduleTransition(n) {
  const half = Math.ceil(n / 2);
  setTimeout(() => completeNotify(half), 5000);
  setTimeout(() => completeNotify(n - half), 10000);
}
```

---

## 11. 컬럼 더 보기 메뉴 (`more-ic`) — 편집모드 컨트롤

각 leaf `<th>` 에 다음 3개 SVG 아이콘이 inline 으로 있어야 `SCM.tableSort` /
`SCM.columnFilterPopover` / `SCM.columnMoreMenu` 가 동작 + VOC 편집모드에서
컬럼별 정렬/필터 토글 가능.

```html
<th class="col-{auto|medium|large} {custom}">
  컬럼명
  <svg class="sort-ic" viewBox="0 0 16 16"><use href="#ic-arrowUpDown"/></svg>
  <span class="th-icons">
    <svg class="filter-ic" viewBox="0 0 20 20"><use href="#ic-funnel"/></svg>
    <svg class="more-ic" viewBox="0 0 16 16"><use href="#ic-more-vertical"/></svg>
  </span>
</th>
```

- `.sort-ic` — 기본 visible (회색 ↕). 클릭 → asc / desc / default 토글 (파랑 ↕).
- `.filter-ic` — 기본 visible (회색 깔때기). 클릭 → 컬럼별 popover.
- `.more-ic` — 기본 hidden (`display: none`). VOC 편집모드에서 visible. 클릭 →
  정렬/고정/숨김 액션 메뉴.

VOC 편집모드의 `applyActiveVersionMinimal` 이 페이지 inline 아이콘을 일괄 hide 후
`showSort` / `showFilter` 에 등록된 selector 만 selective 노출.

---

## 12. 페이지 등록 체크리스트 — 모든 데이터 리스트 페이지

새 `/demo/{slug}.html` 페이지를 만들 때 다음을 모두 적용:

### 12.1. 페이지 아키텍처 (CLAUDE.md 의 체크리스트와 동일)
- [ ] `<script src="/auth-gate.js">` 동기 로드
- [ ] `<script src="/scm-shell.js" defer>` 추가
- [ ] design system CSS 필요한 것 모두 link (lnb.css 필수)
- [ ] `<script src="/scm-icons.js">` body 시작 직후
- [ ] `<header class="scm-topbar" role="banner"></header>` placeholder
- [ ] `<nav class="scm-lnb" data-active="{key}">` placeholder
- [ ] `lnb.js` 의 `CANONICAL_LNB_HTML` 에 메뉴 등록
- [ ] `functions/demo/_known-assets.js` 에 파일명 추가
   - **반드시** `node scripts/sync-demo-assets.js` 실행해서 자동 갱신.

### 12.2. 데이터 리스트 표준 마크업
- [ ] `<div class="scm-page-head scm-page-head--list">` 페이지 헤더
- [ ] `<div class="scm-filter-bar" id="filter-bar">` 필터바
- [ ] `<div class="scm-stats-bar scm-stats-bar--sticky">` 스탯바
- [ ] `<div class="mp-table-host"><div class="mp-thead-sticky"><div class="mp-thead-scroll"></div></div><div class="mp-table-scroll"><table class="mp-table" data-scm-frozen="N">…</table></div></div>` 메인 테이블
- [ ] `<div class="scm-filter-popover-root" id="filter-popover-root">` (필터 popover anchor)
- [ ] `<div class="scm-filter-drawer-backdrop" id="fd-backdrop" hidden>` (전체 필터 drawer)
- [ ] `<aside class="scm-filter-drawer" id="filter-drawer" hidden>` (전체 필터 drawer)

### 12.3. 인터랙션 모듈 mount
페이지 하단에 명시 import:
- [ ] `scm-table/scm-table.js` — sticky thead / frozen / cell-select
- [ ] `scm-table/table-sort.js` — 정렬
- [ ] `scm-table/column-more-menu.js` — 컬럼 더 보기
- [ ] `scm-table/column-filter-popover.js` — 컬럼 필터
- [ ] `scm-table/table-selection.js` — 체크박스 선택
- [ ] `filter-popover/filter-popover.js` + `filter-popover-modes.js`
- [ ] `filter-bar/filter-bar.js` + `filter-drawer/filter-drawer.js`
- [ ] `side-drawer/side-drawer.js` (상세 drawer 쓰면)
- [ ] `code-popover/code-popover.js` (코드 link 쓰면)

페이지 IIFE 안에서:
```js
if (window.SCMTable) window.SCMTable.init({ root: document });
if (SCM.tableSort) SCM.tableSort.mount({ tableSelector: '.mp-table-scroll .mp-table' });
if (SCM.columnMoreMenu) SCM.columnMoreMenu.mount({ tableSelector: '.mp-table-scroll .mp-table' });
if (SCM.columnFilterPopover) SCM.columnFilterPopover.mount({ tableSelector: '.mp-table-scroll .mp-table' });
if (SCM.filterPopoverModes) SCM.filterPopoverModes.init({ filterBarEl, extraRegistry, onSearch, onReset });
```

### 12.4. 표준 인터랙션 — 모든 데이터 리스트 페이지 공통
- [ ] **체크박스 선택** — body 클릭 시 aria-checked 토글 (선택적으로 SCM.tableSelection 사용)
- [ ] **헤더 cb-all 3-state sync** — MutationObserver 로 0/일부/전체 → false/mixed/true
- [ ] **mini-action 활성/비활성** — 선택 0 이면 disabled, 선택 ≥1 이면 enabled
- [ ] **stats-bar morph** — "전체 N" ↔ "선택됨 X / N" (.scm-stat--all / .scm-stat--selected)
- [ ] **mini-action 클릭** → cancel-modal 오픈 → 사유 입력 → 확인 → 상태 전환 + 토스트 + 알림함 progress 증가
- [ ] **알림함 버튼 클릭** → notify-modal 오픈, 처리 history 표시
- [ ] **알림함 상태 머신** — progress > 0 → 파란 "진행중 X/Y", complete > 0 → 초록 "완료 N"
- [ ] **상세 drawer** (필요 시) — 코드 link 클릭 → 우측 side-drawer 오픈, 헤더 + 카드 row + 상세 테이블

### 12.5. 셀 내 콘텐츠 wrap (긴 한글)
- [ ] 폭 고정 컬럼: `col-auto` + 명시 width + `white-space: normal`
- [ ] 내부 텍스트 div: `word-break: keep-all; overflow-wrap: break-word; min-width: 0` (flex 안)

### 12.6. 컬럼 정렬 / 필터 / 더 보기 아이콘
- [ ] 모든 데이터 leaf `<th>` 에 `.sort-ic` + `.th-icons > .filter-ic + .more-ic` inline 추가
- [ ] 체크박스 / spacer / 그룹 헤더 셀은 아이콘 X

### 12.7. 마지막 데이터 컬럼 우측 라인
- [ ] thead 의 마지막 데이터 컬럼 우측에 `border-right: 1px solid #EBEBEB` 명시
  - 이유: mp-table 은 column divider 를 `border-LEFT` 로 그리는데 col-spacer 는
    border-left 없음 → 헤더 우측 경계가 안 보임. body 셀은 X (thead 만).

---

## 13. 디버그 — Stock-movement / Product-arrival-status 어디서 보면 되는가

| 패턴 | 참조 페이지 |
|---|---|
| 2-row thead split header + colspan 토글 | `stock-movement.html` 의 `#stm-moveno-head` + 펼치기 토글 |
| `iss-merged-cell` 빈셀 rowspan 대체 | `Product-Arrival-Status.html` 의 `rowToDetailHtml` |
| Cancel modal + Notify modal + 상태 머신 | 두 페이지 모두 (`.iss-cancel-modal*` / `.stm-cancel-modal*`) |
| Side drawer with data-scm-skip-init 테이블 | 두 페이지 모두 (`#pd-drawer`, `#stm-drawer`) |
| 가로 스크롤 + 더 보기 button (cards) | `stock-movement.html` 의 `#stm-drawer-cards-more` |
| 수동 reinit 우회 (rebuild bug) | `stock-movement.html` 의 펼치기 토글 handler |
| 한글 어절 wrap | `stock-movement.html` 의 `.stm-reason-title`, `.stm-sku-name` |

---

## 변경 이력

| 날짜 | 작업 | 추가된 패턴 |
|---|---|---|
| 2026-05-13 | stock-movement.html 신규 + product-arrival-status.html 정비 | 1-13 모두 (이 문서 자체) |
