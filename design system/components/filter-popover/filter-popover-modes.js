/* ============================================================
 * scm-filter-popover-modes — single / multi / codeinput dispatcher
 * ------------------------------------------------------------
 * 4개 데이터 리스트 페이지 (무탠 / SKU 관리 / 편집샵 보충 요청·현황)
 * 의 filter-bar 칩 클릭 시 모드별 popover 를 띄우는 공통 wiring.
 *
 * Modes:
 *   single        — 라디오 단일 선택 (시즌, 매입형태, 운영상태 등) — 즉시 적용 + close.
 *   multi         — 검색 + 체크박스 다중 (컬러, 브랜드, 스토어 등) — 적용 버튼.
 *   codeinput     — textarea 줄바꿈 입력 + counter — 적용 버튼.
 *   codeinput-tabs — 라디오로 입력 종류 전환 (예: SKU 조회 → SKU번호/SKU명).
 *
 * 글로벌 REGISTRY:
 *   필터 키별 mode/option 을 한 곳에서 정의 — 모든 페이지에서 동일하게 적용.
 *   새 페이지에서 같은 key 를 가진 chip 을 두면 자동으로 동일 mode 적용.
 *   페이지별 단일/멀티가 다를 수 없음 (캐노니컬 source of truth).
 *
 * Usage:
 *   SCM.filterPopoverModes.init({
 *     rootEl: document.getElementById('filter-popover-root'),  // 미존재 시 자동 생성
 *     filterBarEl: document.getElementById('filter-bar'),
 *     onSearch: () => {}, onReset: () => {},                    // (옵션)
 *   });
 *   // single / multi / codeinput / options 모두 REGISTRY 에서 자동 추출.
 *   // 페이지 고유 옵션 추가 시 init({ extraRegistry: { ... } }) 로 확장.
 * ============================================================ */

(function (root) {
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // ============================================================
  // 글로벌 필터 레지스트리 — 4개 데이터 리스트 페이지 + 신규 페이지 공통.
  // 이 정의가 단일 source of truth. 같은 key 의 chip 은 어느 페이지에 있든 동일하게 동작.
  // ============================================================
  var REGISTRY = {
    // ---------- single (라디오 단일 선택, 즉시 적용) ----------
    season:       { mode: 'multi', options: [
      { id:'all', label:'전체',  selected:true },
      { id:'s1',  label:'26-SS', selected:false },
      { id:'s2',  label:'26-FW', selected:false },
    ]},
    deploy:       { mode: 'single', options: [
      { id:'all', label:'전체',   selected:true },
      { id:'d1',  label:'전개중', selected:false },
      { id:'d2',  label:'미전개', selected:false },
    ]},
    // 매입형태는 '전체' 옵션 없음 — 매입 또는 위탁 둘 중 하나. 매입이 공통 디폴트.
    purchaseType: { mode: 'single', options: [
      { id:'p1',  label:'매입', selected:true  },
      { id:'p2',  label:'위탁', selected:false },
    ]},
    manufacture:  { mode: 'single', options: [
      { id:'all', label:'전체',       selected:true },
      { id:'m1',  label:'완제품 매입', selected:false },
      { id:'m2',  label:'자체제작',   selected:false },
    ]},
    platform:     { mode: 'single', options: [
      { id:'all', label:'전체',     selected:true },
      { id:'pl1', label:'MUSINSA', selected:false },
      { id:'pl2', label:'29CM',    selected:false },
    ]},
    opStatus:     { mode: 'single', options: [
      { id:'all', label:'전체',   selected:true },
      { id:'o1',  label:'운영중', selected:false },
      { id:'o2',  label:'중지',   selected:false },
    ]},
    mapStatus:    { mode: 'single', options: [
      { id:'all', label:'전체',     selected:true },
      { id:'ms1', label:'매핑완료', selected:false },
      { id:'ms2', label:'미매핑',   selected:false },
    ]},
    hanger:       { mode: 'single', options: [
      { id:'all', label:'전체',   selected:true },
      { id:'h1',  label:'사용',   selected:false },
      { id:'h2',  label:'미사용', selected:false },
    ]},
    firstInbound: { mode: 'single', options: [
      { id:'all', label:'전체',   selected:true },
      { id:'f1',  label:'초도',   selected:false },
      { id:'f2',  label:'재발주', selected:false },
    ]},
    // 보충 대상 구분 — 두 옵션. '전체' 없음. 디폴트 미선택 (placeholder).
    restockKind:  { mode: 'single', options: [
      { id:'r1',  label:'보충대상', selected:false },
      { id:'r2',  label:'비대상',   selected:false },
    ]},
    status:       { mode: 'single', options: [
      { id:'all', label:'전체',     selected:true },
      { id:'st1', label:'처리중',   selected:false },
      { id:'st2', label:'입고대기', selected:false },
      { id:'st3', label:'완료',     selected:false },
      { id:'st4', label:'취소',     selected:false },
    ]},

    // ---------- multi (검색 + 체크박스 다중, 적용 버튼) ----------
    color:    { mode: 'multi', options: [
      { id:'all', label:'전체',         selected:true },
      { id:'c1',  label:'미디엄 인디고', selected:false },
      { id:'c2',  label:'워시드 블랙',   selected:false },
      { id:'c3',  label:'딥 인디고',     selected:false },
      { id:'c4',  label:'크림',          selected:false },
      { id:'c5',  label:'블랙',          selected:false },
      { id:'c6',  label:'그레이',        selected:false },
      { id:'c7',  label:'레드',          selected:false },
      { id:'c8',  label:'블루',          selected:false },
    ]},
    category: { mode: 'multi', options: [
      { id:'all',  label:'전체',  selected:true },
      { id:'cat1', label:'상의 > 니트/스웨터 > 크루넥 니트', selected:false },
      { id:'cat2', label:'신발 > 스포츠화 > 러닝화',         selected:false },
      { id:'cat3', label:'아우터', selected:false },
      { id:'cat4', label:'팬츠',   selected:false },
    ]},
    brand:    { mode: 'multi', options: [
      { id:'all', label:'전체',           selected:true },
      { id:'b1',  label:'라이즈앤빌로우', selected:false },
      { id:'b2',  label:'NIKE',          selected:false },
      { id:'b3',  label:'MUSINSA',       selected:false },
      { id:'b4',  label:'MUSINSA STANDARD', selected:false },
      { id:'b5',  label:'아크테릭스',     selected:false },
      { id:'b6',  label:'이지(YEEZY)',    selected:false },
    ]},
    store:    { mode: 'multi', options: [
      { id:'all', label:'전체',   selected:true },
      { id:'st1', label:'강남점', selected:false },
      { id:'st2', label:'홍대점', selected:false },
      { id:'st3', label:'성수점', selected:false },
      { id:'st4', label:'명동점', selected:false },
    ]},
    md:       { mode: 'multi', options: [
      { id:'all', label:'전체',   selected:true },
      { id:'md1', label:'홍길동', selected:false },
      { id:'md2', label:'박지수', selected:false },
    ]},

    // ---------- codeinput (textarea 줄바꿈 입력) ----------
    style:          { mode: 'codeinput' },   // 대표스타일
    uid:            { mode: 'codeinput' },   // UID
    sku:            { mode: 'codeinput' },   // SKU번호 (단일 입력 칩)
    barcode:        { mode: 'codeinput' },   // 바코드
    styleNumber:    { mode: 'codeinput' },   // 스타일넘버
    skuLookupValue: { mode: 'codeinput' },   // SKU 조회 — 값 입력 (SKU 조회 type 옆 chip)

    // ---------- single (SKU 조회 type 선택 — SKU번호 / SKU명) ----------
    skuLookup:   { mode: 'single', options: [
      { id: 'sku-num',  label: 'SKU번호', selected: true },
      { id: 'sku-name', label: 'SKU명',   selected: false },
    ]},
  };

  function init(config) {
    if (!config) return null;
    config = config || {};
    var filterBarEl = config.filterBarEl;
    if (!filterBarEl) return null;
    // 페이지 고유 추가 옵션 (있으면 REGISTRY 에 머지)
    var registry = Object.assign({}, REGISTRY, config.extraRegistry || {});

    // REGISTRY → 모드별 키 / options 자동 추출
    var singleKeys = [];
    var codeinputKeys = [];
    var codeinputTabs = {};
    var options = {};
    Object.keys(registry).forEach(function (k) {
      var def = registry[k];
      if (def.mode === 'single')   { singleKeys.push(k); options[k] = JSON.parse(JSON.stringify(def.options || [])); }
      else if (def.mode === 'multi') { options[k] = JSON.parse(JSON.stringify(def.options || [])); }
      else if (def.mode === 'codeinput') { codeinputKeys.push(k); }
      else if (def.mode === 'codeinput-tabs') { codeinputTabs[k] = def.tabs || []; }
    });

    var onApply = typeof config.onApply === 'function' ? config.onApply : null;
    var codeMax = config.codeMax || 1000;
    // searchBtn / resetBtn — 명시 X 시 filterBarEl 안에서 자동 탐색
    var searchBtn = config.searchBtn || filterBarEl.querySelector('.scm-search-btn');
    var resetBtn = config.resetBtn || filterBarEl.querySelector('.scm-filter-reset-btn');
    var onSearch = typeof config.onSearch === 'function' ? config.onSearch : null;
    var onReset = typeof config.onReset === 'function' ? config.onReset : null;
    // 페이지 별 디폴트 filter 값 (예: SKU 관리 매입형태=매입). 이 값은 'applied filter' 로 카운트되지 않아
    // 초기화 버튼 visibility 판단 시 무시됨.
    var defaultFilters = Object.assign({}, config.defaultFilters || {});
    // single 모드의 non-'all' selected 옵션을 글로벌 디폴트로 자동 등록 (예: REGISTRY purchaseType.매입)
    Object.keys(options).forEach(function (k) {
      var def = registry[k];
      if (!def || def.mode !== 'single') return;
      var sel = (options[k] || []).find(function (it) { return it.selected && it.id !== 'all'; });
      if (sel && !defaultFilters.hasOwnProperty(k)) defaultFilters[k] = sel.label;
    });

    // popover root 자동 생성
    var rootEl = config.rootEl;
    if (!rootEl) {
      rootEl = document.createElement('div');
      rootEl.className = 'scm-filter-popover-root';
      rootEl.setAttribute('role', 'dialog');
      rootEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(rootEl);
    }

    // SCM.filterPopover 가 로드되어 있어야 함
    var fp = (root.SCM && root.SCM.filterPopover)
      ? root.SCM.filterPopover.mount(rootEl, {
          onClose: function () {
            filterBarEl.querySelectorAll('.scm-filter-select[aria-expanded="true"]').forEach(function (b) {
              b.setAttribute('aria-expanded', 'false');
            });
            openFor = null;
          }
        })
      : null;
    if (!fp) {
      console.warn('[filter-popover-modes] SCM.filterPopover not loaded');
      return null;
    }

    var openFor = null;
    var codeValues = {};                                   // { key: 'a\nb\nc' }
    var codeTabSel = {};                                   // { key: tabId } — codeinput-tabs 모드의 현재 탭
    var listValues = JSON.parse(JSON.stringify(options));

    // ----- 검색/초기화 dirty tracking -----
    function snapshot() {
      return JSON.stringify({ list: listValues, code: codeValues });
    }
    var appliedSnap = snapshot();   // 마지막 검색 적용 시점의 상태

    function hasAppliedFilters() {
      // filled chip 중 'data-default="true"' (디폴트 값) 은 '사용자 필터' 가 아니므로 카운트 제외
      var filledChips = filterBarEl.querySelectorAll('.scm-filter-select[data-state="filled"]');
      for (var i = 0; i < filledChips.length; i++) {
        if (filledChips[i].getAttribute('data-default') !== 'true') return true;
      }
      return false;
    }
    function isDirty() { return snapshot() !== appliedSnap; }

    // "전체 필터" chip 의 카운트 갱신
    //  - 필수 필터(req-dot 가 있음): 채워져 있으면 무조건 카운트
    //  - 일반 필터: state=filled && 값이 '전체' 가 아님 && 페이지 디폴트가 아님 → 카운트
    //  - 0 인 경우 카운트 배지 숨김
    function refreshChipCount() {
      var chip = filterBarEl.querySelector('.scm-filter-chip');
      if (!chip) return;
      var countEl = chip.querySelector('.scm-filter-chip__count');
      if (!countEl) return;

      var count = 0;
      filterBarEl.querySelectorAll('.scm-filter-select').forEach(function (btn) {
        var state = btn.getAttribute('data-state');
        if (state !== 'filled') return;
        var isRequired = !!btn.querySelector('.scm-filter-select__req-dot, .req-dot');
        if (isRequired) { count++; return; }
        var isDefault = btn.getAttribute('data-default') === 'true';
        if (isDefault) return;
        var valueEl = btn.querySelector('.scm-filter-select__value');
        var value = valueEl ? valueEl.textContent.trim() : '';
        if (value === '전체') return;
        count++;
      });

      if (count === 0) {
        countEl.style.display = 'none';
      } else {
        countEl.style.display = '';
        countEl.textContent = String(count);
      }
    }

    function refreshActionBtns() {
      if (searchBtn) {
        // 검색: 마지막 적용 시점 대비 변경이 있을 때만 활성
        if (isDirty()) searchBtn.removeAttribute('disabled');
        else           searchBtn.setAttribute('disabled', '');
      }
      // drawer 의 '검색 적용' 버튼 — 사용자 필터가 1개도 없으면 비활성
      var drawerEl0 = document.getElementById('filter-drawer');
      if (drawerEl0) {
        var applyBtn = drawerEl0.querySelector('.scm-filter-drawer__apply');
        if (applyBtn) {
          if (hasAppliedFilters()) applyBtn.removeAttribute('disabled');
          else                     applyBtn.setAttribute('disabled', '');
        }
      }
      if (resetBtn) {
        // 초기화: filled chip 이 1개 이상 있으면 visible (legacy CSS spec — [hidden] 으로 숨김)
        if (hasAppliedFilters()) resetBtn.removeAttribute('hidden');
        else                     resetBtn.setAttribute('hidden', '');
      }
      refreshChipCount();
    }
    if (searchBtn) {
      searchBtn.addEventListener('click', function () {
        if (searchBtn.hasAttribute('disabled')) return;
        appliedSnap = snapshot();
        if (onSearch) onSearch();
        refreshActionBtns();
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (resetBtn.hasAttribute('disabled')) return;
        // 모든 filled chip 을 placeholder 로 + listValues / codeValues 초기화
        listValues = JSON.parse(JSON.stringify(options));
        codeValues = {};
        codeTabSel = {};
        filterBarEl.querySelectorAll('.scm-filter-select').forEach(function (b) {
          var k = b.getAttribute('data-mp-filter');
          if (k) setFilterValueDirect(k, '');
        });
        // defaultFilters 다시 적용 (data-default 마킹 + 라벨 동기화) — 페이지에서 별도 처리 불필요
        Object.keys(defaultFilters).forEach(function (k) {
          setFilterValueDirect(k, defaultFilters[k], true);
        });
        appliedSnap = snapshot();
        if (onReset) onReset();
        refreshActionBtns();
      });
    }

    // isSystemApply=true 일 때만 디폴트 값과 일치하면 data-default 마킹.
    // 사용자가 직접 디폴트 값을 골랐을 때는 data-default 를 찍지 않아서 초기화 버튼이 정상 노출됨.
    function setFilterValueDirect(key, displayText, isSystemApply) {
      var btn = filterBarEl.querySelector('.scm-filter-select[data-mp-filter="' + key + '"]');
      if (!btn) return;
      var valueEl = btn.querySelector('.scm-filter-select__value');
      if (!valueEl) return;
      if (!btn.hasAttribute('data-pop-default')) {
        btn.setAttribute('data-pop-default', valueEl.textContent);
      }
      if (displayText) {
        btn.setAttribute('data-state', 'filled');
        valueEl.textContent = displayText;
        if (isSystemApply && defaultFilters[key] === displayText) {
          btn.setAttribute('data-default', 'true');
        } else {
          btn.removeAttribute('data-default');
        }
      } else {
        btn.setAttribute('data-state', 'placeholder');
        valueEl.textContent = btn.getAttribute('data-pop-default') || valueEl.textContent;
        btn.removeAttribute('data-default');
      }
    }
    function setFilterValue(key, displayText) {
      setFilterValueDirect(key, displayText);
      if (onApply) onApply(key, displayText);
      refreshActionBtns();
    }

    // ----- codeinput-tabs mode (한 칩 안에서 입력 종류를 라디오로 전환) -----
    // 예: SKU 조회 → SKU번호 / SKU명 두 가지 입력 종류, 각각 별도 codeValue 저장.
    // 적용 버튼 없음 — 입력 즉시 chip 반영. footer 는 초기화만.
    function renderCodeInputTabs(key) {
      var tabs = codeinputTabs[key] || [];
      if (!tabs.length) { renderCodeInput(key); return; }
      var curTab = codeTabSel[key] || tabs[0].id;
      var sub = key + ':' + curTab;
      var value = codeValues[sub] || '';
      var countLines = function (s) { return s ? s.split('\n').map(function(l){return l.trim();}).filter(Boolean).length : 0; };
      rootEl.innerHTML =
        '<div class="scm-filter-popover scm-filter-popover--codeinput">' +
          '<div class="scm-filter-popover__tabs" role="radiogroup">' +
            tabs.map(function (t) {
              return '<label class="scm-filter-popover__tab' + (t.id === curTab ? ' is-active' : '') + '">' +
                       '<input type="radio" name="fp-tab" value="' + t.id + '"' + (t.id === curTab ? ' checked' : '') + '/>' +
                       '<span>' + escapeHtml(t.label) + '</span>' +
                     '</label>';
            }).join('') +
          '</div>' +
          '<div class="scm-filter-popover__body">' +
            '<div class="scm-filter-popover__textarea">' +
              '<textarea data-pop-input placeholder="' + escapeHtml(tabs.find(function(t){return t.id===curTab;}).label) + ' 줄바꿈으로 구분해 입력"></textarea>' +
            '</div>' +
            '<div class="scm-filter-popover__counter">' +
              '<strong data-pop-count>' + countLines(value) + '</strong>&nbsp;<span class="total">/ ' + codeMax.toLocaleString() + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="scm-filter-popover__footer">' +
            '<button type="button" class="scm-filter-popover__reset" data-pop-reset>초기화</button>' +
          '</div>' +
        '</div>';
      var ta = rootEl.querySelector('[data-pop-input]');
      var counter = rootEl.querySelector('[data-pop-count]');
      ta.value = value;
      var tabLabel = (tabs.find(function(t){return t.id===curTab;}) || {}).label || '';
      function commit() {
        var lines = ta.value.split('\n').map(function(l){return l.trim();}).filter(Boolean);
        if (lines.length > codeMax) ta.value = lines.slice(0, codeMax).join('\n');
        codeValues[sub] = ta.value;
        var valid = ta.value.split('\n').map(function(l){return l.trim();}).filter(Boolean);
        counter.textContent = valid.length;
        // 즉시 chip 반영
        if (valid.length === 0)      setFilterValue(key, '');
        else if (valid.length === 1) setFilterValue(key, tabLabel + ': ' + valid[0]);
        else                         setFilterValue(key, tabLabel + ': ' + valid[0] + ' 외 ' + (valid.length - 1));
      }
      ta.addEventListener('input', commit);
      // 탭 라디오 전환 — 현재 textarea 내용은 codeValues[sub] 에 보존, 새 탭으로 재렌더
      rootEl.querySelectorAll('input[name="fp-tab"]').forEach(function (rd) {
        rd.addEventListener('change', function () {
          codeValues[sub] = ta.value;
          codeTabSel[key] = rd.value;
          renderCodeInputTabs(key);
        });
      });
      rootEl.querySelector('[data-pop-reset]').addEventListener('click', function () {
        ta.value = '';
        codeValues[sub] = '';
        counter.textContent = '0';
        setFilterValue(key, '');
      });
      setTimeout(function () { ta.focus(); }, 0);
    }

    // ----- codeinput mode -----
    // 적용 버튼 없음 — 입력 즉시 chip 반영. footer 는 초기화만.
    function renderCodeInput(key) {
      var value = codeValues[key] || '';
      var countLines = function (s) { return s ? s.split('\n').map(function(l){return l.trim();}).filter(Boolean).length : 0; };
      rootEl.innerHTML =
        '<div class="scm-filter-popover scm-filter-popover--codeinput">' +
          '<div class="scm-filter-popover__body">' +
            '<div class="scm-filter-popover__textarea">' +
              '<textarea data-pop-input placeholder="코드를 줄바꿈으로 구분해 입력"></textarea>' +
            '</div>' +
            '<div class="scm-filter-popover__counter">' +
              '<strong data-pop-count>' + countLines(value) + '</strong>&nbsp;<span class="total">/ ' + codeMax.toLocaleString() + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="scm-filter-popover__footer">' +
            '<button type="button" class="scm-filter-popover__reset" data-pop-reset>초기화</button>' +
          '</div>' +
        '</div>';
      var ta = rootEl.querySelector('[data-pop-input]');
      var counter = rootEl.querySelector('[data-pop-count]');
      ta.value = value;
      function commit() {
        var lines = ta.value.split('\n').map(function(l){return l.trim();}).filter(Boolean);
        if (lines.length > codeMax) ta.value = lines.slice(0, codeMax).join('\n');
        codeValues[key] = ta.value;
        var valid = ta.value.split('\n').map(function(l){return l.trim();}).filter(Boolean);
        counter.textContent = valid.length;
        // 즉시 chip 반영
        if (valid.length === 0)      setFilterValue(key, '');
        else if (valid.length === 1) setFilterValue(key, valid[0]);
        else                         setFilterValue(key, valid[0] + ' 외 ' + (valid.length - 1));
      }
      ta.addEventListener('input', commit);
      rootEl.querySelector('[data-pop-reset]').addEventListener('click', function () {
        ta.value = '';
        codeValues[key] = '';
        counter.textContent = '0';
        setFilterValue(key, '');
      });
      setTimeout(function () { ta.focus(); }, 0);
    }

    // ----- single mode -----
    function renderSingle(key) {
      var items = listValues[key] || [];
      rootEl.innerHTML =
        '<div class="scm-filter-popover scm-filter-popover--list-single">' +
          '<div class="scm-filter-popover__list-body" data-pop-list></div>' +
        '</div>';
      var body = rootEl.querySelector('[data-pop-list]');
      body.innerHTML = items.map(function (it) {
        var dis = it.disabled ? ' is-disabled" aria-disabled="true' : '';
        return '<div class="scm-filter-popover__item-row">' +
                 '<div class="scm-filter-popover__item scm-filter-popover__item--single' + dis + '" data-id="' + it.id + '"' + (it.selected ? ' data-selected="true"' : '') + '>' +
                   '<span class="label">' + escapeHtml(it.label) + '</span>' +
                   (it.selected
                     ? '<svg class="check" viewBox="0 0 16 16"><path d="M3.45 7.3l3.28 3.28L12.55 4.85" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
                     : '') +
                 '</div>' +
               '</div>';
      }).join('');
      body.addEventListener('click', function (e) {
        var it = e.target.closest('.scm-filter-popover__item');
        if (!it) return;
        if (it.classList.contains('is-disabled')) return;     // disabled 옵션은 무시
        var id = it.getAttribute('data-id');
        listValues[key] = items.map(function (x) { return Object.assign({}, x, { selected: x.id === id }); });
        var sel = listValues[key].find(function (x) { return x.selected; });
        if (!sel || sel.id === 'all') setFilterValue(key, '');
        else setFilterValue(key, sel.label);
        fp.close();
      });
    }

    // ----- multi mode (목록 선택 / 직접 입력 토글) — 어제 버전 -----
    // 상단 라디오로 list ↔ codeinput 전환. 적용 버튼 없음 — 선택/입력 즉시 chip 반영.
    // footer 는 초기화만.
    var multiPaneMode = {};   // { key: 'list' | 'code' }

    function commitMulti(key) {
      // 활성 pane 기준으로 chip 라벨 갱신 — 즉시 반영
      var pm = multiPaneMode[key] || 'list';
      if (pm === 'code') {
        var lines = (codeValues[key] || '').split('\n').map(function(l){return l.trim();}).filter(Boolean);
        if (lines.length === 0)      setFilterValue(key, '');
        else if (lines.length === 1) setFilterValue(key, lines[0]);
        else                         setFilterValue(key, lines[0] + ' 외 ' + (lines.length - 1));
      } else {
        var items = listValues[key] || [];
        var sel = items.filter(function (x) { return x.selected && x.id !== 'all'; });
        if (sel.length === 0)      setFilterValue(key, '');
        else if (sel.length === 1) setFilterValue(key, sel[0].label);
        else                       setFilterValue(key, sel[0].label + ' 외 ' + (sel.length - 1));
      }
    }

    function renderMulti(key, query) {
      var paneMode = multiPaneMode[key] || 'list';
      // 매번 wrapper 를 새로 빌드 — 다른 key 의 multi 칩으로 전환 시 stale closure (이전 key 참조) 방지.
      rootEl.innerHTML =
        '<div class="scm-filter-popover scm-filter-popover--multi" data-mode-host="1">' +
          '<div class="scm-filter-popover__tabs" role="radiogroup">' +
            '<label class="scm-filter-popover__tab' + (paneMode === 'list' ? ' is-active' : '') + '">' +
              '<input type="radio" name="multi-pane" value="list"' + (paneMode === 'list' ? ' checked' : '') + '/>' +
              '<span>목록 선택</span>' +
            '</label>' +
            '<label class="scm-filter-popover__tab' + (paneMode === 'code' ? ' is-active' : '') + '">' +
              '<input type="radio" name="multi-pane" value="code"' + (paneMode === 'code' ? ' checked' : '') + '/>' +
              '<span>직접 입력</span>' +
            '</label>' +
          '</div>' +
          '<div data-pop-content></div>' +
          '<div class="scm-filter-popover__footer">' +
            '<button type="button" class="scm-filter-popover__reset" data-pop-reset>초기화</button>' +
          '</div>' +
        '</div>';
      rootEl.setAttribute('data-pop-mode', paneMode === 'code' ? 'code' : 'list');
      rootEl.querySelectorAll('input[name="multi-pane"]').forEach(function (rd) {
        rd.addEventListener('change', function () {
          multiPaneMode[key] = rd.value;
          rootEl.querySelectorAll('.scm-filter-popover__tab').forEach(function (lbl) {
            var act = lbl.querySelector('input').value === rd.value;
            if (act) lbl.classList.add('is-active'); else lbl.classList.remove('is-active');
          });
          rootEl.setAttribute('data-pop-mode', rd.value === 'code' ? 'code' : 'list');
          renderMultiPane(key, '');
          commitMulti(key);
        });
      });
      rootEl.querySelector('[data-pop-reset]').addEventListener('click', function () {
        // 항상 현재 listValues 의 최신 옵션으로 reset (registry 기본값 = id:'all' selected)
        var current = listValues[key] || [];
        listValues[key] = current.map(function (x) { return Object.assign({}, x, { selected: x.id === 'all' }); });
        codeValues[key] = '';
        renderMultiPane(key, '');
        setFilterValue(key, '');
      });
      renderMultiPane(key, query);
    }

    function renderMultiPane(key, query) {
      var items = listValues[key] || [];
      var content = rootEl.querySelector('[data-pop-content]');
      if (!content) return;
      var paneMode = multiPaneMode[key] || 'list';

      if (paneMode === 'code') {
        var value = codeValues[key] || '';
        var countLines = function (s) { return s ? s.split('\n').map(function(l){return l.trim();}).filter(Boolean).length : 0; };
        content.innerHTML =
          '<div class="scm-filter-popover__body">' +
            '<div class="scm-filter-popover__textarea">' +
              '<textarea data-pop-input placeholder="값을 줄바꿈으로 구분해 입력"></textarea>' +
            '</div>' +
            '<div class="scm-filter-popover__counter">' +
              '<strong data-pop-count>' + countLines(value) + '</strong>&nbsp;<span class="total">/ ' + codeMax.toLocaleString() + '</span>' +
            '</div>' +
          '</div>';
        var ta = content.querySelector('textarea');
        var counter = content.querySelector('[data-pop-count]');
        ta.value = value;
        ta.addEventListener('input', function () {
          var lines = ta.value.split('\n').map(function(l){return l.trim();}).filter(Boolean);
          if (lines.length > codeMax) ta.value = lines.slice(0, codeMax).join('\n');
          codeValues[key] = ta.value;
          var valid = ta.value.split('\n').map(function(l){return l.trim();}).filter(Boolean);
          counter.textContent = valid.length;
          // 즉시 chip 반영
          commitMulti(key);
        });
        setTimeout(function () { ta.focus(); }, 0);
        return;
      }

      // list pane — 어제 legacy 버전: 검색 + 2단 (검색결과 / 선택됨) 좌우 분리
      var q = (query || '').trim().toLowerCase();
      var filtered = q ? items.filter(function (it) { return it.label.toLowerCase().includes(q); }) : items;
      // '선택됨' 컬럼 — 'all' 제외, 검색 무관 모든 selected 노출 (legacy 동일)
      var selected = items.filter(function (it) { return it.selected && it.id !== 'all'; });

      function rowHtml(it) {
        return '<div class="opt-row" data-pop-toggle="' + it.id + '"' + (it.selected ? ' data-selected="true"' : '') + '>' +
                 '<span class="pop-cb"></span>' +
                 '<span class="label">' + escapeHtml(it.label) + '</span>' +
               '</div>';
      }
      function selRowHtml(it) {
        return '<div class="opt-row opt-row--sel" data-pop-toggle="' + it.id + '">' +
                 '<span class="label">' + escapeHtml(it.label) + '</span>' +
                 '<svg class="ic-check" viewBox="0 0 20 20" aria-hidden="true">' +
                   '<path d="M4.5 10.5L8 14L15.5 6.5" stroke="currentColor" stroke-width="1.14" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
                 '</svg>' +
               '</div>';
      }

      content.innerHTML =
        '<div class="scm-filter-popover__multi-search">' +
          '<div class="scm-filter-popover__multi-search-row">' +
            '<svg class="ic-search" viewBox="0 0 20 20" aria-hidden="true">' +
              '<circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.6" fill="none"/>' +
              '<path d="M14 14l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
            '</svg>' +
            '<input type="text" placeholder="검색" data-pop-search value="' + escapeHtml(query || '') + '"/>' +
            (query
              ? '<svg class="ic-clear" viewBox="0 0 20 20" data-pop-clear><path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>'
              : '') +
          '</div>' +
        '</div>' +
        '<div class="scm-filter-popover__multi-2col">' +
          '<div class="col">' +
            '<div class="col-inner">' +
              '<div class="col-label">검색결과 (' + filtered.length.toLocaleString() + ')</div>' +
              (filtered.length
                ? filtered.map(rowHtml).join('')
                : '<div class="col-empty">검색 결과가 없습니다.</div>') +
            '</div>' +
          '</div>' +
          (selected.length
            ? '<div class="col-divider"></div>' +
              '<div class="col">' +
                '<div class="col-inner">' +
                  '<div class="col-label">선택됨 (' + selected.length.toLocaleString() + ')</div>' +
                  selected.map(selRowHtml).join('') +
                '</div>' +
              '</div>'
            : '') +
        '</div>';

      var inp = content.querySelector('[data-pop-search]');
      if (inp) {
        inp.addEventListener('input', function () { renderMultiPane(key, inp.value); });
        var clr = content.querySelector('[data-pop-clear]');
        if (clr) clr.addEventListener('click', function () { renderMultiPane(key, ''); });
        if (!query) setTimeout(function () { inp.focus(); }, 0);
      }

      content.querySelectorAll('[data-pop-toggle]').forEach(function (row) {
        row.addEventListener('click', function (e) {
          e.stopPropagation();
          var id = row.getAttribute('data-pop-toggle');
          var target = listValues[key].find(function (it) { return it.id === id; });
          if (!target) return;
          if (target.id === 'all') {
            listValues[key].forEach(function (it) { it.selected = it.id === 'all'; });
          } else {
            target.selected = !target.selected;
            var allOpt = listValues[key].find(function (it) { return it.id === 'all'; });
            if (allOpt) allOpt.selected = false;
            var anyOther = listValues[key].some(function (it) { return it.id !== 'all' && it.selected; });
            if (!anyOther && allOpt) allOpt.selected = true;
          }
          renderMultiPane(key, query);
          commitMulti(key);
        });
      });
    }

    function openPopover(key, anchorBtn) {
      if (openFor === key) { fp.close(); return; }
      openFor = key;
      // VOC override — when the VOC edit pane sets a filter chip's type
      // (`data-voc-filter-type`), it wins over the registry-defined mode.
      // Lets reviewers preview a chip as single / multi / code without
      // touching the demo registry. Falls through to the registry path
      // when the attribute isn't set or its value is unknown.
      var override = anchorBtn && anchorBtn.dataset && anchorBtn.dataset.vocFilterType;
      if (override === 'code') {
        renderCodeInput(key);
        fp.openAt(anchorBtn, 'code');
      } else if (override === 'single') {
        renderSingle(key);
        fp.openAt(anchorBtn, 'single');
      } else if (override === 'multi') {
        renderMulti(key, '');
        fp.openAt(anchorBtn, 'list');
      } else if (codeinputTabs[key]) {
        renderCodeInputTabs(key);
        fp.openAt(anchorBtn, 'code');
      } else if (codeinputKeys.indexOf(key) !== -1) {
        renderCodeInput(key);
        fp.openAt(anchorBtn, 'code');
      } else if (singleKeys.indexOf(key) !== -1) {
        renderSingle(key);
        fp.openAt(anchorBtn, 'single');
      } else if (options[key]) {
        renderMulti(key, '');
        fp.openAt(anchorBtn, 'list');
      } else {
        // 정의 없음 — 토스트 또는 무동작
        if (root.SCM && root.SCM.toast) {
          root.SCM.toast.show({ variant: 'info', title: '필터 정의 없음', desc: key });
        }
        openFor = null;
        return;
      }
      anchorBtn.setAttribute('aria-expanded', 'true');
      // popover 최소 폭 = 트리거 chip 폭 (사용자 요구사항: 칩 width 가 popover min-width)
      requestAnimationFrame(function () {
        var pop = rootEl.querySelector('.scm-filter-popover');
        if (!pop) return;
        var w = anchorBtn.getBoundingClientRect().width;
        pop.style.minWidth = Math.ceil(w) + 'px';
        // 우측 넘침 보정 — minWidth 적용 후 다시 계산
        var rect = anchorBtn.getBoundingClientRect();
        var popRect = pop.getBoundingClientRect();
        if (rect.left + popRect.width > window.innerWidth - 8) {
          rootEl.style.left = (window.innerWidth - popRect.width - 8) + 'px';
        }
      });
    }

    filterBarEl.addEventListener('click', function (e) {
      // 전체 필터 (filter-drawer-open) 버튼은 popover 가 가로채지 않도록 명시적 skip
      if (e.target.closest('#filter-drawer-open')) return;
      var sel = e.target.closest('.scm-filter-select');
      if (!sel) return;
      // 비활성 chip 은 popover 안 열림
      if (sel.hasAttribute('disabled') || sel.classList.contains('is-disabled')) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      var key = sel.getAttribute('data-mp-filter');
      if (!key) return;
      openPopover(key, sel);
    });

    // ============================================================
    // 전체 필터 drawer auto-build — 필터바의 chip 키를 읽어 drawer body 를 동적 렌더
    // popover/chip 과 listValues / codeValues 를 공유하므로 drawer 변경 시 chip 즉시 반영
    // 글로벌 필터 타이틀 매핑 — drawer/section 표시용 (chip 에 __label 이 없는 경우 fallback)
    var FILTER_TITLES = {
      season: '시즌',
      deploy: '스토어 전개 여부',
      purchaseType: '매입형태',
      manufacture: '제조구분',
      platform: '플랫폼',
      opStatus: '운영상태',
      mapStatus: '매핑상태',
      hanger: '행거 사용 여부',
      firstInbound: '초도/재발주',
      restockKind: '보충 대상 구분',
      status: '상태',
      color: '컬러',
      category: '카테고리',
      brand: '브랜드',
      store: '스토어',
      md: '담당 MD',
      style: '대표스타일',
      uid: 'UID',
      sku: 'SKU번호',
      barcode: '바코드',
      styleNumber: '스타일넘버',
      skuLookup: 'SKU 조회',
      skuLookupValue: 'SKU 조회 값',
    };

    // ============================================================
    function buildDrawer(drawerEl) {
      if (!drawerEl) return;
      var bodyEl = drawerEl.querySelector('.scm-filter-drawer__body');
      if (!bodyEl) return;
      // 필터바의 chip 들을 순회하며 각 키별 section 생성
      var chips = filterBarEl.querySelectorAll('.scm-filter-select[data-mp-filter]');
      var sections = [];
      var seenKeys = {};
      chips.forEach(function (chip) {
        var key = chip.getAttribute('data-mp-filter');
        if (!key || seenKeys[key]) return;
        seenKeys[key] = true;
        // 우선순위: FILTER_TITLES 매핑 > chip __label > 기본 placeholder __value > key
        var labelEl = chip.querySelector('.scm-filter-select__label');
        var valueEl = chip.querySelector('.scm-filter-select__value');
        var titleText = FILTER_TITLES[key]
          || (labelEl ? labelEl.textContent.trim()
              : (valueEl && chip.getAttribute('data-state') === 'placeholder'
                  ? valueEl.textContent.trim()
                  : key));
        var html = renderDrawerSection(key, titleText);
        if (html) sections.push(html);
      });
      bodyEl.innerHTML = sections.join('');
      // 섹션 인터랙션 wiring
      wireDrawerSections(bodyEl);
    }

    function renderDrawerSection(key, title) {
      var countLines = function (s) { return s ? s.split('\n').map(function(l){return l.trim();}).filter(Boolean).length : 0; };
      // codeinput-tabs (skuLookup 등) → 헤더(타이틀+counter) + tabs + textarea
      if (codeinputTabs[key]) {
        var tabs = codeinputTabs[key];
        var curTab = codeTabSel[key] || tabs[0].id;
        var sub = key + ':' + curTab;
        var value = codeValues[sub] || '';
        return '<section class="scm-filter-drawer__section" data-section-key="' + key + '">' +
                 '<div class="scm-filter-drawer__section-head">' +
                   '<h3>' + escapeHtml(title) + '</h3>' +
                   '<div class="scm-filter-drawer__counter">' +
                     '<strong data-drawer-count>' + countLines(value) + '</strong>&nbsp;<span class="total">/ ' + codeMax.toLocaleString() + '</span>' +
                   '</div>' +
                 '</div>' +
                 '<div class="scm-filter-popover__tabs" role="radiogroup" data-drawer-tabs>' +
                   tabs.map(function (t) {
                     return '<label class="scm-filter-popover__tab' + (t.id === curTab ? ' is-active' : '') + '">' +
                              '<input type="radio" name="drawer-tab-' + key + '" value="' + t.id + '"' + (t.id === curTab ? ' checked' : '') + '/>' +
                              '<span>' + escapeHtml(t.label) + '</span>' +
                            '</label>';
                   }).join('') +
                 '</div>' +
                 '<textarea class="scm-filter-drawer__textarea" data-drawer-input placeholder="' + escapeHtml(tabs.find(function(t){return t.id===curTab;}).label) + ' 줄바꿈으로 구분해 입력">' + escapeHtml(value) + '</textarea>' +
               '</section>';
      }
      // codeinput → 헤더(타이틀+counter) + textarea
      if (codeinputKeys.indexOf(key) !== -1) {
        var v = codeValues[key] || '';
        return '<section class="scm-filter-drawer__section" data-section-key="' + key + '">' +
                 '<div class="scm-filter-drawer__section-head">' +
                   '<h3>' + escapeHtml(title) + '</h3>' +
                   '<div class="scm-filter-drawer__counter">' +
                     '<strong data-drawer-count>' + countLines(v) + '</strong>&nbsp;<span class="total">/ ' + codeMax.toLocaleString() + '</span>' +
                   '</div>' +
                 '</div>' +
                 '<textarea class="scm-filter-drawer__textarea" data-drawer-input placeholder="' + escapeHtml(title) + ' 줄바꿈으로 구분해 입력">' + escapeHtml(v) + '</textarea>' +
               '</section>';
      }
      // single → chips (라디오 단일)
      if (singleKeys.indexOf(key) !== -1 && options[key]) {
        var items = listValues[key] || [];
        return '<section class="scm-filter-drawer__section" data-section-key="' + key + '">' +
                 '<h3>' + escapeHtml(title) + '</h3>' +
                 '<div class="scm-filter-drawer__chips" data-drawer-chips data-mode="single">' +
                   items.map(function (it) {
                     var dis = it.disabled ? ' disabled aria-disabled="true"' : '';
                     return '<button class="scm-filter-drawer__chip" type="button" data-drawer-id="' + it.id + '"' + (it.selected ? ' data-selected="true"' : '') + dis + '>' + escapeHtml(it.label) + '</button>';
                   }).join('') +
                 '</div>' +
               '</section>';
      }
      // multi → 검색 + 2단 (검색결과 / 선택됨) — popover multi 와 동일 패턴
      if (options[key]) {
        var mItems = listValues[key] || [];
        var selectedItems = mItems.filter(function (x) { return x.selected && x.id !== 'all'; });
        return '<section class="scm-filter-drawer__section" data-section-key="' + key + '">' +
                 '<h3>' + escapeHtml(title) + '</h3>' +
                 '<div class="scm-filter-drawer__multi-search">' +
                   '<div class="scm-filter-drawer__multi-search-row">' +
                     '<svg class="ic-search" viewBox="0 0 20 20" aria-hidden="true">' +
                       '<circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.6" fill="none"/>' +
                       '<path d="M14 14l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
                     '</svg>' +
                     '<input type="text" placeholder="검색" data-drawer-search/>' +
                   '</div>' +
                 '</div>' +
                 '<div class="scm-filter-drawer__multi-2col" data-drawer-2col>' +
                   '<div class="col">' +
                     '<div class="col-inner" data-drawer-results>' +
                       '<div class="col-label">검색결과 (' + mItems.length.toLocaleString() + ')</div>' +
                       mItems.map(function (it) {
                         return '<div class="opt-row" data-drawer-id="' + it.id + '"' + (it.selected ? ' data-selected="true"' : '') + '>' +
                                  '<span class="pop-cb"></span>' +
                                  '<span class="label">' + escapeHtml(it.label) + '</span>' +
                                '</div>';
                       }).join('') +
                     '</div>' +
                   '</div>' +
                   (selectedItems.length
                     ? '<div class="col-divider"></div>' +
                       '<div class="col">' +
                         '<div class="col-inner" data-drawer-selected>' +
                           '<div class="col-label-row">' +
                             '<span class="col-label">선택됨 (' + selectedItems.length.toLocaleString() + ')</span>' +
                             '<button type="button" class="col-reset" data-drawer-reset-selected>초기화</button>' +
                           '</div>' +
                           selectedItems.map(function (it) {
                             return '<div class="opt-row opt-row--sel" data-drawer-id="' + it.id + '">' +
                                      '<span class="label">' + escapeHtml(it.label) + '</span>' +
                                      '<svg class="ic-check" viewBox="0 0 20 20" aria-hidden="true">' +
                                        '<path d="M4.5 10.5L8 14L15.5 6.5" stroke="currentColor" stroke-width="1.14" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
                                      '</svg>' +
                                    '</div>';
                           }).join('') +
                         '</div>' +
                       '</div>'
                     : '') +
                 '</div>' +
               '</section>';
      }
      // 정의 없음
      return '';
    }

    function wireDrawerSections(bodyEl) {
      bodyEl.querySelectorAll('.scm-filter-drawer__section').forEach(function (section) {
        var key = section.getAttribute('data-section-key');
        if (!key) return;

        // single mode chips
        var singleChips = section.querySelector('[data-drawer-chips][data-mode="single"]');
        if (singleChips) {
          singleChips.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-drawer-id]');
            if (!btn) return;
            if (btn.disabled || btn.getAttribute('aria-disabled') === 'true') return;  // disabled 옵션은 무시
            var id = btn.getAttribute('data-drawer-id');
            // 단일 선택 — 클릭한 항목만 selected
            (listValues[key] || []).forEach(function (it) { it.selected = (it.id === id); });
            // 시각 갱신
            singleChips.querySelectorAll('.scm-filter-drawer__chip').forEach(function (b) {
              if (b.getAttribute('data-drawer-id') === id) b.setAttribute('data-selected', 'true');
              else b.removeAttribute('data-selected');
            });
            // chip 라벨 즉시 반영
            var sel = (listValues[key] || []).find(function (x) { return x.selected && x.id !== 'all'; });
            setFilterValue(key, sel ? sel.label : '');
          });
          return;
        }

        // multi mode 2-col (검색 + 검색결과 / 선택됨)
        var multi2col = section.querySelector('[data-drawer-2col]');
        if (multi2col) {
          var searchInp = section.querySelector('[data-drawer-search]');

          function commitMultiDrawer() {
            var items = listValues[key] || [];
            var sel = items.filter(function (x) { return x.selected && x.id !== 'all'; });
            if (sel.length === 0)      setFilterValue(key, '');
            else if (sel.length === 1) setFilterValue(key, sel[0].label);
            else                       setFilterValue(key, sel[0].label + ' 외 ' + (sel.length - 1));
          }

          function rerender2col(query) {
            var items = listValues[key] || [];
            var q = (query || '').trim().toLowerCase();
            var visible = q ? items.filter(function (it) { return it.label.toLowerCase().includes(q); }) : items;
            var selected = items.filter(function (x) { return x.selected && x.id !== 'all'; });
            multi2col.innerHTML =
              '<div class="col">' +
                '<div class="col-inner" data-drawer-results>' +
                  '<div class="col-label">검색결과 (' + visible.length.toLocaleString() + ')</div>' +
                  (visible.length
                    ? visible.map(function (it) {
                        return '<div class="opt-row" data-drawer-id="' + it.id + '"' + (it.selected ? ' data-selected="true"' : '') + '>' +
                                 '<span class="pop-cb"></span>' +
                                 '<span class="label">' + escapeHtml(it.label) + '</span>' +
                               '</div>';
                      }).join('')
                    : '<div class="col-empty">검색 결과가 없습니다.</div>') +
                '</div>' +
              '</div>' +
              (selected.length
                ? '<div class="col-divider"></div>' +
                  '<div class="col">' +
                    '<div class="col-inner" data-drawer-selected>' +
                      '<div class="col-label-row">' +
                        '<span class="col-label">선택됨 (' + selected.length.toLocaleString() + ')</span>' +
                        '<button type="button" class="col-reset" data-drawer-reset-selected>초기화</button>' +
                      '</div>' +
                      selected.map(function (it) {
                        return '<div class="opt-row opt-row--sel" data-drawer-id="' + it.id + '">' +
                                 '<span class="label">' + escapeHtml(it.label) + '</span>' +
                                 '<svg class="ic-check" viewBox="0 0 20 20" aria-hidden="true">' +
                                   '<path d="M4.5 10.5L8 14L15.5 6.5" stroke="currentColor" stroke-width="1.14" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
                                 '</svg>' +
                               '</div>';
                      }).join('') +
                    '</div>' +
                  '</div>'
                : '');
            attachRowHandlers();
            attachResetHandler();
          }

          function attachResetHandler() {
            var resetBtn = multi2col.querySelector('[data-drawer-reset-selected]');
            if (!resetBtn) return;
            resetBtn.addEventListener('click', function (e) {
              e.stopPropagation();
              var items = listValues[key] || [];
              items.forEach(function (it) { it.selected = (it.id === 'all'); });
              commitMultiDrawer();
              rerender2col(searchInp ? searchInp.value : '');
            });
          }

          function attachRowHandlers() {
            multi2col.querySelectorAll('[data-drawer-id]').forEach(function (row) {
              row.addEventListener('click', function (e) {
                e.stopPropagation();
                var id = row.getAttribute('data-drawer-id');
                var items = listValues[key] || [];
                if (id === 'all') {
                  items.forEach(function (it) { it.selected = (it.id === 'all'); });
                } else {
                  var target = items.find(function (it) { return it.id === id; });
                  if (target) target.selected = !target.selected;
                  var allOpt = items.find(function (it) { return it.id === 'all'; });
                  if (allOpt) allOpt.selected = false;
                  if (!items.some(function (it) { return it.selected; })) {
                    if (allOpt) allOpt.selected = true;
                  }
                }
                rerender2col(searchInp ? searchInp.value : '');
                commitMultiDrawer();
              });
            });
          }

          if (searchInp) {
            searchInp.addEventListener('input', function () { rerender2col(searchInp.value); });
          }
          attachRowHandlers();
          attachResetHandler();
          return;
        }

        // codeinput / codeinput-tabs — textarea
        var ta = section.querySelector('[data-drawer-input]');
        if (ta) {
          var counterEl = section.querySelector('[data-drawer-count]');
          function updateCounter() {
            if (!counterEl) return;
            var n = ta.value.split('\n').map(function (l) { return l.trim(); }).filter(Boolean).length;
            counterEl.textContent = String(n);
          }
          // codeinput-tabs 전환 처리
          var tabsRow = section.querySelector('[data-drawer-tabs]');
          if (tabsRow) {
            tabsRow.querySelectorAll('input[type="radio"]').forEach(function (rd) {
              rd.addEventListener('change', function () {
                // 이전 탭 값 저장
                var prevTab = codeTabSel[key] || codeinputTabs[key][0].id;
                codeValues[key + ':' + prevTab] = ta.value;
                codeTabSel[key] = rd.value;
                // 새 탭 값 로드
                var sub = key + ':' + rd.value;
                ta.value = codeValues[sub] || '';
                updateCounter();
                // tab 시각 갱신
                tabsRow.querySelectorAll('.scm-filter-popover__tab').forEach(function (lbl) {
                  if (lbl.querySelector('input').value === rd.value) lbl.classList.add('is-active');
                  else lbl.classList.remove('is-active');
                });
                // chip 즉시 반영
                commitDrawerCode(key);
              });
            });
          }
          ta.addEventListener('input', function () {
            var lines = ta.value.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
            if (lines.length > codeMax) ta.value = lines.slice(0, codeMax).join('\n');
            updateCounter();
            // 저장
            if (codeinputTabs[key]) {
              var sub = key + ':' + (codeTabSel[key] || codeinputTabs[key][0].id);
              codeValues[sub] = ta.value;
            } else {
              codeValues[key] = ta.value;
            }
            commitDrawerCode(key);
          });
        }
      });
    }

    function commitDrawerCode(key) {
      var lines, tabLabel;
      if (codeinputTabs[key]) {
        var tab = codeTabSel[key] || codeinputTabs[key][0].id;
        var sub = key + ':' + tab;
        lines = (codeValues[sub] || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
        var t = codeinputTabs[key].find(function (x) { return x.id === tab; });
        tabLabel = t ? t.label : '';
        if (lines.length === 0)      setFilterValue(key, '');
        else if (lines.length === 1) setFilterValue(key, tabLabel + ': ' + lines[0]);
        else                         setFilterValue(key, tabLabel + ': ' + lines[0] + ' 외 ' + (lines.length - 1));
      } else {
        lines = (codeValues[key] || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
        if (lines.length === 0)      setFilterValue(key, '');
        else if (lines.length === 1) setFilterValue(key, lines[0]);
        else                         setFilterValue(key, lines[0] + ' 외 ' + (lines.length - 1));
      }
    }

    // drawer 가 페이지에 있으면 자동 빌드 (init 시 한 번)
    var drawerEl = document.getElementById('filter-drawer');
    if (drawerEl) {
      buildDrawer(drawerEl);
      // drawer 가 열릴 때마다 chip 으로 변경된 최신 listValues / codeValues 반영해서 재빌드
      var drawerOpenBtn = document.getElementById('filter-drawer-open');
      if (drawerOpenBtn) {
        drawerOpenBtn.addEventListener('click', function () {
          buildDrawer(drawerEl);
        }, true);  // capture phase — 페이지의 fd.open 보다 먼저 실행
      }
      // drawer footer wiring
      var resetBtnDrawer = drawerEl.querySelector('.scm-filter-drawer__reset');
      var applyBtnDrawer = drawerEl.querySelector('.scm-filter-drawer__apply');
      if (resetBtnDrawer) {
        resetBtnDrawer.addEventListener('click', function () {
          // 모든 필터 초기화 — 페이지의 reset btn 과 동일 동작
          Object.keys(listValues).forEach(function (k) {
            (listValues[k] || []).forEach(function (it) { it.selected = (it.id === 'all'); });
          });
          Object.keys(codeValues).forEach(function (k) { codeValues[k] = ''; });
          // chip 들 placeholder 복원
          filterBarEl.querySelectorAll('.scm-filter-select[data-mp-filter]').forEach(function (chip) {
            var k = chip.getAttribute('data-mp-filter');
            setFilterValueDirect(k, '');
          });
          // defaultFilters 다시 적용 (data-default 마킹 + 라벨 동기화)
          Object.keys(defaultFilters).forEach(function (k) {
            setFilterValueDirect(k, defaultFilters[k], true);
          });
          appliedSnap = snapshot();
          if (onReset) onReset();
          refreshActionBtns();
          // drawer 다시 빌드 (시각 갱신)
          buildDrawer(drawerEl);
          // drawer 닫기 — 적용 버튼과 동일 패턴
          var drawer = document.getElementById('filter-drawer');
          var backdrop = document.getElementById('fd-backdrop');
          if (drawer && drawer.classList) drawer.classList.remove('is-open');
          if (backdrop) backdrop.setAttribute('hidden', '');
          if (drawer) drawer.setAttribute('hidden', '');
        });
      }
      if (applyBtnDrawer) {
        applyBtnDrawer.addEventListener('click', function () {
          if (applyBtnDrawer.hasAttribute('disabled')) return;     // 비활성 시 무시
          appliedSnap = snapshot();
          if (onSearch) onSearch();
          refreshActionBtns();
          // drawer 닫기 — 페이지의 SCM.filterDrawer 인스턴스가 close 처리하도록 backdrop 클릭 이벤트 발생 시킴
          // 또는 drawer 의 hidden 처리
          var drawer = document.getElementById('filter-drawer');
          var backdrop = document.getElementById('fd-backdrop');
          if (drawer) drawer.removeAttribute('open');
          if (drawer && drawer.classList) drawer.classList.remove('is-open');
          if (backdrop) backdrop.setAttribute('hidden', '');
          if (drawer) drawer.setAttribute('hidden', '');
        });
      }
    }

    // defaultFilters 자동 적용 — chip 의 data-default 마킹 + 라벨 동기화 (페이지에서 직접 호출 안 해도 init 시 처리)
    Object.keys(defaultFilters).forEach(function (k) {
      setFilterValueDirect(k, defaultFilters[k], true);
    });
    appliedSnap = snapshot();    // 디폴트 적용 후 스냅샷 갱신 — 디폴트 변경 없는 한 search disabled
    // 초기 검색/초기화 버튼 상태 — 초기 적용된 필터 없으니 검색 disabled, 초기화 hidden.
    refreshActionBtns();

    return {
      open: openPopover,
      close: function () { fp.close(); },
      setFilterValue: setFilterValue,
      refreshActionBtns: refreshActionBtns,
      // 외부에서 현재 선택 상태 조회
      getValues: function () {
        return {
          list: JSON.parse(JSON.stringify(listValues)),
          code: Object.assign({}, codeValues)
        };
      },
      // 특정 옵션을 disabled 로 토글 (의존성 — 예: 위탁 선택 시 자체제작 비활성)
      setOptionDisabled: function (key, optionId, disabled) {
        var arr = listValues[key];
        if (!arr) return;
        arr.forEach(function (it) {
          if (it.id === optionId) it.disabled = !!disabled;
        });
        // 비활성 옵션이 현재 선택돼 있으면 — 'all' 로 reset
        if (disabled) {
          var cur = arr.find(function (x) { return x.selected; });
          if (cur && cur.id === optionId) {
            arr.forEach(function (it) { it.selected = (it.id === 'all'); });
            setFilterValue(key, '');
          }
        }
        // drawer 가 빌드돼 있다면 다시 그려서 disabled 상태 즉시 반영
        if (drawerEl) buildDrawer(drawerEl);
      },
      // 외부에서 drawer body 강제 재빌드
      rebuildDrawer: function () {
        if (drawerEl) buildDrawer(drawerEl);
      },
      // 실제 데이터 필터링용 — 활성화된 필터만 반환
      // 반환 형태:
      //   single/multi keys → { season: ['26-SS', '26-FW'], color: ['미디엄 인디고'] }
      //   codeinput keys    → { sku: ['10669591', '10669592'] }
      //   codeinput-tabs    → { skuLookup: { tab: 'number', lines: ['10669591'] } }
      // 미선택/전체/빈 입력은 객체에서 제외 — 페이지에서 활성 필터만 처리하도록.
      getActiveFilters: function () {
        var active = {};
        // single/multi — listValues
        Object.keys(listValues).forEach(function (k) {
          var sel = (listValues[k] || []).filter(function (x) { return x.selected && x.id !== 'all'; });
          if (sel.length > 0) active[k] = sel.map(function (x) { return x.label; });
        });
        // codeinput / codeinput-tabs — codeValues
        Object.keys(codeValues).forEach(function (k) {
          var raw = codeValues[k] || '';
          var lines = raw.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
          if (lines.length === 0) return;
          // codeinput-tabs: key 가 'baseKey:tabId' 형식
          var idx = k.indexOf(':');
          if (idx !== -1) {
            var baseKey = k.substring(0, idx);
            var tabId = k.substring(idx + 1);
            // 현재 선택된 탭의 코드만 활성으로 간주 (다른 탭의 잔여 입력은 무시)
            if (codeTabSel[baseKey] === tabId) {
              active[baseKey] = { tab: tabId, lines: lines };
            }
          } else {
            active[k] = lines;
          }
        });
        return active;
      }
    };
  }

  root.SCM = root.SCM || {};
  root.SCM.filterPopoverModes = { init: init, REGISTRY: REGISTRY };
})(typeof window !== 'undefined' ? window : globalThis);
