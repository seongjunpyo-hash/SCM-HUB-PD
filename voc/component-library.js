/* VOC 편집 탭 — 컴포넌트 라이브러리 (단일 source)
 *
 * 디자인 시스템 카탈로그(/design system/catalog/)에 등록된 컴포넌트 30종을
 * 아토믹 디자인 (Atom / Molecule / Organism) 으로 묶음. 모두 디자인 시스템
 * 클래스(scm-*) 를 사용 → 데모 페이지(SKU 관리 등) 에 그대로 삽입하면 동일한
 * 시각으로 렌더됨. 인라인 스타일은 layout 보정용으로만 최소 사용.
 *
 * CSS 의존:
 *   demo 페이지가 해당 컴포넌트의 CSS 를 로드하고 있어야 함.
 *   sku-management / otb-budget / test.html 등 대부분 페이지가 layer-desktop +
 *   button + filter-* + stats-bar + page-head + scm-table 를 이미 link 함.
 *
 * 각 항목 형식:
 *   { id, label, sub, level, type, html }
 */
(function (root) {
  'use strict';

  // ─── ATOMS (10) ──────────────────────────────────────────────
  // 디자인 시스템 atoms — 버튼 / 태그 / 칩 / 인풋 등 단일 요소.
  const ATOMS = [
    { id: 'btn-primary', label: 'Primary 버튼', sub: 'scm-button--primary', type: 'button',
      html: `<button type="button" class="scm-button scm-button--primary">기본 동작</button>` },
    { id: 'btn-secondary', label: 'Secondary 버튼', sub: 'scm-button', type: 'button',
      html: `<button type="button" class="scm-button">보조 동작</button>` },
    { id: 'btn-sm', label: '작은 버튼', sub: 'scm-button--sm', type: 'button',
      html: `<button type="button" class="scm-button scm-button--sm">수정</button>` },
    { id: 'tag-default', label: 'Tag', sub: 'scm-tag', type: 'custom',
      html: `<span class="scm-tag">옵션</span>` },
    { id: 'status-success', label: '상태 — 성공', sub: 'scm-status-chip--success', type: 'custom',
      html: `<span class="scm-status-chip scm-status-chip--success">매핑완료</span>` },
    { id: 'status-warn', label: '상태 — 대기', sub: 'scm-status-chip--warn', type: 'custom',
      html: `<span class="scm-status-chip scm-status-chip--warn">대기</span>` },
    { id: 'checkbox', label: '체크박스', sub: 'scm-checkbox', type: 'form',
      html: `<span class="scm-checkbox" role="checkbox" aria-checked="true"></span>` },
    { id: 'toggle', label: '토글 스위치', sub: 'scm-toggle', type: 'form',
      html: `<span class="scm-toggle" role="switch" aria-checked="true"><span class="scm-toggle-track"></span><span class="scm-toggle-knob"></span></span>` },
    { id: 'platform-tag', label: '플랫폼 태그', sub: 'scm-platform-tag', type: 'custom',
      html: `<span class="scm-platform-tag" data-color="blue">MUSINSA</span>` },
    { id: 'state-text', label: '상태 텍스트', sub: 'scm-state-text', type: 'custom',
      html: `<span class="scm-state-text scm-state-text--success">완료</span>` },
  ];

  // ─── MOLECULES (10) ───────────────────────────────────────────
  // 작은 조합 — 카드 / 배너 / 칩 / 폼 / 페이저.
  const MOLECULES = [
    { id: 'info-banner', label: '안내 배너', sub: 'scm-info-banner', level: 'molecule', type: 'banner',
      html: `<div class="scm-info-banner">
  <div class="scm-info-banner__body">
    <div class="scm-info-banner__title">안내 제목</div>
    <div class="scm-info-banner__text">사용자에게 전달할 내용을 입력하세요.</div>
  </div>
</div>` },
    { id: 'card-basic', label: '카드', sub: 'scm-card', level: 'molecule', type: 'card',
      html: `<article class="scm-card">
  <header class="scm-card-head"><h3 class="scm-card-title">카드 타이틀</h3><a class="scm-card-link" href="#">전체 보기 →</a></header>
  <div class="scm-card-body">카드 본문 영역. 임의의 컨텐츠 삽입.</div>
</article>` },
    { id: 'kpi-card', label: 'KPI 카드', sub: 'scm-kpi-card', level: 'molecule', type: 'kpi',
      html: `<div class="scm-kpi-card" style="max-width:280px;">
  <div class="scm-kpi-card__head">
    <span class="scm-kpi-card__label">진행중인 보충 요청</span>
  </div>
  <div class="scm-kpi-card__body">
    <div class="scm-kpi-card__value">1,284</div>
    <div class="scm-kpi-card__meta">
      <span class="scm-kpi-card__delta scm-kpi-card__delta--up">▲ 8%</span>
      <span class="scm-kpi-card__meta-text">vs 지난 주</span>
    </div>
  </div>
</div>` },
    { id: 'info-table', label: '정보 테이블', sub: 'scm-info-table', level: 'molecule', type: 'list',
      html: `<div class="scm-info-table">
  <div class="scm-info-row scm-info-row--quad">
    <div class="scm-info-cell-label">소유사</div><div class="scm-info-cell-value">무신사</div>
    <div class="scm-info-cell-label">스타일넘버</div><div class="scm-info-cell-value">12345263</div>
  </div>
  <div class="scm-info-row scm-info-row--quad">
    <div class="scm-info-cell-label">시즌</div><div class="scm-info-cell-value">26-FW</div>
    <div class="scm-info-cell-label">출시연도</div><div class="scm-info-cell-value">2026</div>
  </div>
</div>` },
    { id: 'form-row', label: '폼 줄', sub: 'scm-form-row', level: 'molecule', type: 'form',
      html: `<div class="scm-form-row">
  <label class="scm-form-label scm-form-label--w120">SKU 명 <span class="scm-form-row-req"></span></label>
  <div class="scm-form-control scm-form-control--w320"><input class="scm-input" placeholder="입력" /></div>
</div>` },
    { id: 'search-btn', label: '검색 버튼', sub: 'scm-search-btn', level: 'molecule', type: 'button',
      html: `<button type="button" class="scm-search-btn">검색</button>` },
    { id: 'mini-action-row', label: '미니 액션', sub: 'scm-mini-action', level: 'molecule', type: 'button',
      html: `<div style="display:flex;gap:6px;">
  <button type="button" class="scm-mini-action">SKU번호 복사</button>
  <button type="button" class="scm-mini-action scm-mini-action--primary">상품 매핑</button>
</div>` },
    { id: 'filter-chip-only', label: '필터 칩', sub: 'scm-filter-chip', level: 'molecule', type: 'custom',
      html: `<button class="scm-filter-chip" type="button"><svg viewBox="0 0 20 20"><use href="#ic-filter"/></svg><span>전체 필터</span><span class="scm-filter-chip__count">3</span></button>` },
    { id: 'filter-select-only', label: '필터 셀렉트', sub: 'scm-filter-select', level: 'molecule', type: 'custom',
      html: `<button class="scm-filter-select" type="button" data-state="filled"><span class="scm-filter-select__label">시즌</span><span class="scm-filter-select__value">26-SS</span><svg class="scm-filter-select__chev" viewBox="0 0 16 16"><path d="M3 5.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg></button>` },
    { id: 'pager', label: '페이저', sub: 'scm-pager', level: 'molecule', type: 'custom',
      html: `<span class="scm-pager">
  <strong class="scm-pager__current">1</strong>
  <span class="scm-pager__total">/ <span>12</span> 페이지</span>
  <button class="scm-pager-btn" type="button" aria-label="이전 페이지" disabled><svg viewBox="0 0 20 20"><use href="#ic-chevronLeft"/></svg></button>
  <button class="scm-pager-btn" type="button" aria-label="다음 페이지"><svg viewBox="0 0 20 20"><use href="#ic-chevronRight"/></svg></button>
</span>` },
  ];

  // ─── ORGANISMS (10) ───────────────────────────────────────────
  // 페이지 단위 섹션 — 페이지헤드 / 필터바 / 통계바 / 테이블 / 탭 / 상태 / 알림.
  const ORGANISMS = [
    { id: 'page-head', label: '페이지 헤드', sub: 'scm-page-head', level: 'organism', type: 'title',
      html: `<div class="scm-page-head scm-page-head--list">
  <h1 class="scm-page-head__title">제목을 입력하세요</h1>
  <div class="scm-page-head__actions">
    <button class="scm-button" type="button">보조 동작</button>
    <button class="scm-button scm-button--primary" type="button">기본 동작</button>
  </div>
</div>` },
    { id: 'filter-bar', label: '필터바', sub: 'scm-filter-bar', level: 'organism', type: 'filter',
      html: `<div class="scm-filter-bar">
  <button class="scm-filter-chip" type="button"><svg viewBox="0 0 20 20"><use href="#ic-filter"/></svg><span>전체 필터</span><span class="scm-filter-chip__count">0</span></button>
  <div class="scm-filter-overflow"><div class="scm-filter-overflow__track">
    <button class="scm-filter-select" type="button" data-state="placeholder"><span class="scm-filter-select__label">필터 1</span><span class="scm-filter-select__value">필터 1</span><svg class="scm-filter-select__chev" viewBox="0 0 16 16"><path d="M3 5.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg></button>
    <button class="scm-filter-select" type="button" data-state="placeholder"><span class="scm-filter-select__label">필터 2</span><span class="scm-filter-select__value">필터 2</span><svg class="scm-filter-select__chev" viewBox="0 0 16 16"><path d="M3 5.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg></button>
    <button class="scm-filter-select" type="button" data-state="placeholder"><span class="scm-filter-select__label">필터 3</span><span class="scm-filter-select__value">필터 3</span><svg class="scm-filter-select__chev" viewBox="0 0 16 16"><path d="M3 5.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg></button>
  </div></div>
  <div class="scm-filter-actions">
    <button class="scm-search-btn" type="button">검색</button>
    <button class="scm-filter-reset-btn" type="button"><svg viewBox="0 0 20 20"><use href="#ic-refresh"/></svg><span>초기화</span></button>
  </div>
</div>` },
    { id: 'stats-bar', label: '통계바', sub: 'scm-stats-bar', level: 'organism', type: 'table-action-bar',
      html: `<div class="scm-stats-bar">
  <div class="scm-stats-bar__left">
    <div class="scm-stats-bar__counts-wrap">
      <div class="scm-stats-bar__counts">
        <span class="scm-stat scm-stat--all"><span class="scm-stat__label">전체</span> <span class="scm-stat__num">12</span></span>
        <span class="scm-stat"><span class="scm-stat__label">전개중</span> <span class="scm-stat__num">8</span></span>
        <span class="scm-stat"><span class="scm-stat__label">미전개</span> <span class="scm-stat__num">4</span></span>
      </div>
    </div>
    <div class="scm-stats-bar__mini-actions">
      <button class="scm-mini-action" type="button">선택 항목 동작</button>
      <button class="scm-mini-action scm-mini-action--primary" type="button">기본 동작</button>
    </div>
  </div>
  <div class="scm-stats-bar__right">
    <button class="scm-download-btn" type="button"><svg viewBox="0 0 20 20"><use href="#ic-download"/></svg><span>전체 엑셀 다운로드</span></button>
    <span class="scm-stats-bar__v-divider"></span>
    <span class="scm-pager">
      <strong class="scm-pager__current">1</strong>
      <span class="scm-pager__total">/ <span>1</span> 페이지</span>
      <button class="scm-pager-btn" type="button" aria-label="이전 페이지" disabled><svg viewBox="0 0 20 20"><use href="#ic-chevronLeft"/></svg></button>
      <button class="scm-pager-btn" type="button" aria-label="다음 페이지" disabled><svg viewBox="0 0 20 20"><use href="#ic-chevronRight"/></svg></button>
    </span>
  </div>
</div>` },
    { id: 'mp-table', label: '데이터 테이블', sub: 'mp-table', level: 'organism', type: 'table',
      html: `<div class="mp-table-host">
  <div class="mp-table-scroll">
    <table class="mp-table">
      <thead>
        <tr>
          <th>SKU</th><th>스토어</th><th class="cell-numeric">수량</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>SSKJ12345</td><td>강남</td><td class="cell-numeric">120</td></tr>
        <tr><td>SSKJ12346</td><td>홍대</td><td class="cell-numeric">85</td></tr>
        <tr><td>SSKJ12347</td><td>성수</td><td class="cell-numeric">52</td></tr>
      </tbody>
    </table>
  </div>
</div>` },
    { id: 'tabs-bar', label: '탭', sub: 'scm-tabs', level: 'organism', type: 'custom',
      html: `<div class="scm-tabs" role="tablist">
  <button type="button" class="scm-tab is-active" role="tab" aria-selected="true">전체</button>
  <button type="button" class="scm-tab" role="tab" aria-selected="false">처리중</button>
  <button type="button" class="scm-tab" role="tab" aria-selected="false">완료</button>
</div>` },
    { id: 'empty-state', label: '빈 상태', sub: 'scm-empty-state', level: 'organism', type: 'card',
      html: `<div class="scm-empty-state" style="text-align:center;padding:48px 24px;">
  <p>표시할 항목이 없습니다.</p>
</div>` },
    { id: 'activity-item', label: '활동 항목', sub: 'scm-activity-item', level: 'organism', type: 'list',
      html: `<div class="scm-activity-item">
  <span class="scm-icon-box scm-icon-box--sm scm-icon-box--blue"><svg viewBox="0 0 20 20"><use href="#ic-package"/></svg></span>
  <div class="scm-activity-item__content">
    <div class="scm-activity-item__title">SKU 5000001 보충 요청 승인</div>
    <div class="scm-activity-item__desc">무신사 스탠다드 강남 외 3개 매장</div>
  </div>
  <span class="scm-activity-item__time">2분 전</span>
</div>` },
    { id: 'toast-success', label: '토스트 — 성공', sub: 'scm-toast--success', level: 'organism', type: 'banner',
      html: `<div class="scm-toast scm-toast--success" style="position:relative;animation:none;">
  <div class="scm-toast__main">
    <svg class="scm-toast__icon" aria-hidden="true"><use href="#ic-checkCircle-filled"/></svg>
    <div class="scm-toast__body">
      <div class="scm-toast__title">SKU번호 복사 완료</div>
      <div class="scm-toast__desc">5건이 클립보드에 복사되었습니다.</div>
    </div>
  </div>
  <button class="scm-toast__close" aria-label="닫기"><svg aria-hidden="true"><use href="#ic-close"/></svg></button>
</div>` },
    { id: 'quick-link-card', label: '퀵 링크 카드', sub: 'scm-quick-link-card', level: 'organism', type: 'card',
      html: `<a href="#" class="scm-quick-link-card" style="max-width:240px;">
  <span class="scm-icon-box scm-icon-box--blue"><svg viewBox="0 0 20 20"><use href="#ic-package"/></svg></span>
  <div class="scm-quick-link-card__title">편집샵 재고 보충 요청</div>
  <div class="scm-quick-link-card__desc">매장별 보충 SKU 일괄 요청</div>
</a>` },
    { id: 'bar-chart', label: '바 차트', sub: 'scm-bar-chart', level: 'organism', type: 'kpi',
      html: `<div class="scm-bar-chart" style="max-width:480px;">
  <div class="scm-bar-chart__bar" style="height:60%;"><span class="scm-bar-chart__bar-label">월</span></div>
  <div class="scm-bar-chart__bar" style="height:75%;"><span class="scm-bar-chart__bar-label">화</span></div>
  <div class="scm-bar-chart__bar scm-bar-chart__bar--light" style="height:45%;"><span class="scm-bar-chart__bar-label">수</span></div>
  <div class="scm-bar-chart__bar" style="height:80%;"><span class="scm-bar-chart__bar-label">목</span></div>
  <div class="scm-bar-chart__bar" style="height:55%;"><span class="scm-bar-chart__bar-label">금</span></div>
</div>` },
  ];

  // 레벨 라벨 부여
  ATOMS.forEach(u => { u.level = u.level || 'atom'; });
  MOLECULES.forEach(u => { u.level = u.level || 'molecule'; });
  ORGANISMS.forEach(u => { u.level = u.level || 'organism'; });

  const ALL_UNITS = [].concat(ATOMS, MOLECULES, ORGANISMS);

  root.SCM_VOC_LIB = {
    UNITS: ALL_UNITS,
    BY_LEVEL: { atom: ATOMS, molecule: MOLECULES, organism: ORGANISMS },
    LEVELS: [
      { key: 'atom',     label: 'Atoms',     hint: '기본 UI 요소 (버튼, 태그, 칩, 인풋, 토글)' },
      { key: 'molecule', label: 'Molecules', hint: '조합 컴포넌트 (배너, 카드, KPI, 폼, 페이저)' },
      { key: 'organism', label: 'Organisms', hint: '복합 섹션 (페이지헤드, 필터바, 통계바, 테이블)' },
    ],
  };
})(typeof window !== 'undefined' ? window : globalThis);
