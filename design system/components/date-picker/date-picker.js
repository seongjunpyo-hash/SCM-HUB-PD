/* ============================================================
 * scm-date-picker — vanilla factory
 * ------------------------------------------------------------
 * Usage:
 *   var dp = SCM.datePicker.mount(el, {
 *     mode: 'range',                                  // 'single' | 'range' (default 'range')
 *     value: { start: '2025-03-06', end: '2025-03-12' },
 *     presets: [                                      // 좌측 프리셋 (기본값 제공)
 *       { id:'today', label:'오늘',      days: 0 },
 *       { id:'w1',    label:'최근 7일',    days: 7  },
 *       { id:'m1',    label:'최근 1개월',  months: 1 },
 *       { id:'m3',    label:'최근 3개월',  months: 3 },
 *       { id:'m6',    label:'최근 6개월',  months: 6 },
 *     ],
 *     selectedPresetId: 'w1',
 *     onChange: function (value, presetId) {},
 *   });
 *   dp.get();        // { start, end, presetId }
 *   dp.set({...});   // 외부에서 값 변경
 *   dp.reset();      // 디폴트 (선택된 프리셋) 로 리셋
 *
 * Date 표현은 ISO 'YYYY-MM-DD' 문자열 또는 Date 객체 모두 허용. 내부에선 Date 로 저장.
 * ============================================================ */

(function (root) {
  var DOW = ['일','월','화','수','목','금','토'];
  var DEFAULT_PRESETS = [
    { id:'today', label:'오늘',     days: 0 },
    { id:'w1',    label:'최근 7일',   days: 7  },
    { id:'m1',    label:'최근 1개월', months: 1 },
    { id:'m3',    label:'최근 3개월', months: 3 },
    { id:'m6',    label:'최근 6개월', months: 6 },
  ];

  function toDate(v) {
    if (!v) return null;
    if (v instanceof Date) return new Date(v.getFullYear(), v.getMonth(), v.getDate());
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v));
    if (m) return new Date(parseInt(m[1],10), parseInt(m[2],10)-1, parseInt(m[3],10));
    var d = new Date(v);
    return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function fmtISO(d) {
    if (!d) return '';
    var y = d.getFullYear(), m = d.getMonth()+1, dd = d.getDate();
    return y + '-' + (m<10?'0':'') + m + '-' + (dd<10?'0':'') + dd;
  }
  function sameDay(a, b) {
    if (!a || !b) return false;
    return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
  }
  function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()+n); }
  function addMonths(d, n) {
    var y = d.getFullYear(), m = d.getMonth() + n, dd = d.getDate();
    var t = new Date(y, m, 1);
    var lastDay = new Date(t.getFullYear(), t.getMonth()+1, 0).getDate();
    return new Date(t.getFullYear(), t.getMonth(), Math.min(dd, lastDay));
  }
  function computePresetRange(p) {
    var today = startOfDay(new Date());
    if (p.id === 'today' || p.days === 0) {
      return { start: today, end: today };
    }
    if (p.days != null) {
      // "최근 N일" — 오늘 기준 (오늘 - (N-1)) ~ 오늘
      return { start: addDays(today, -(p.days - 1)), end: today };
    }
    if (p.months != null) {
      // "최근 N개월" — N개월 전 같은 일 ~ 오늘
      return { start: addMonths(today, -p.months), end: today };
    }
    return null;
  }

  /* --- HTML 빌더들 (string concat → innerHTML) --- */
  function buildPresetsHtml(presets, selectedId) {
    var inner = presets.map(function (p) {
      var cls = 'scm-date-picker__preset' + (p.id === selectedId ? ' is-selected' : '');
      return '<button type="button" class="' + cls + '" data-preset-id="' + p.id + '">' + p.label + '</button>';
    }).join('');
    return '<div class="scm-date-picker__presets-inner">' + inner + '</div>';
  }
  function buildHeadHtml(year, month) {
    return ''
      + '<div class="scm-date-picker__title-group">'
      +   '<button type="button" class="scm-date-picker__month-btn" data-month-toggle>'
      +     '<span class="scm-date-picker__year">' + year + '년</span>'
      +     '<span class="scm-date-picker__month" style="margin-left:8px;">' + (month+1) + '월</span>'
      +     '<svg class="scm-date-picker__chev" viewBox="0 0 16 16" aria-hidden="true" style="margin-left:0;">'
      +       '<path d="M3 6L8 11L13 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
      +     '</svg>'
      +   '</button>'
      + '</div>'
      + '<button type="button" class="scm-date-picker__nav-btn" data-nav="prev" aria-label="이전 달">'
      +   '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 16L6.7 10.21C6.59 10.09 6.59 9.9 6.7 9.79L12.5 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
      + '</button>'
      + '<button type="button" class="scm-date-picker__nav-btn" data-nav="next" aria-label="다음 달">'
      +   '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 16L13.29 10.21C13.41 10.09 13.41 9.9 13.29 9.79L7.5 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
      + '</button>';
  }
  function buildDowRowHtml() {
    var html = '<div class="scm-date-picker__dow-row">';
    for (var i=0;i<7;i++) html += '<div class="scm-date-picker__dow">' + DOW[i] + '</div>';
    html += '</div>';
    return html;
  }
  /* day grid 빌더 — 셀 사이에 separator(.scm-date-picker__day-sep) 를 넣어
     in-range 시 #F5F5F5 가 끊김 없이 이어지게. 한 week 의 구조:
       [day][sep][day][sep][day][sep][day][sep][day][sep][day][sep][day]
     (7 day + 6 sep) */
  function buildWeeksHtml(weeks, today, sel) {
    var html = '';
    weeks.forEach(function (week) {
      html += '<div class="scm-date-picker__week">';
      for (var i=0;i<7;i++) {
        var d = week[i];
        var classes = ['scm-date-picker__day'];
        var isInCurMonth = d.inMonth;
        if (!isInCurMonth) classes.push('is-other');
        if (sameDay(d.date, today)) classes.push('is-today');

        var isStart = sel.start && sameDay(d.date, sel.start);
        var isEnd   = sel.end   && sameDay(d.date, sel.end);
        var inRange = sel.start && sel.end && d.date >= sel.start && d.date <= sel.end;

        if (isStart) classes.push('is-range-start');
        if (isEnd) classes.push('is-range-end');
        if (isStart || isEnd) classes.push('is-selected');
        else if (inRange) classes.push('is-in-range');

        var iso = fmtISO(d.date);
        html += '<div class="scm-date-picker__day-wrap">'
              + '<button type="button" class="' + classes.join(' ') + '" data-date="' + iso + '">'
              + d.date.getDate()
              + '</button>'
              + '</div>';
        if (i < 6) {
          // 인접 두 셀 모두 range (또는 start/end with 다음이 in-range) → separator 도 채움
          var nxt = week[i+1];
          var thisIn = (sel.start && sel.end) && d.date >= sel.start && d.date <= sel.end;
          var nxtIn  = (sel.start && sel.end) && nxt.date >= sel.start && nxt.date <= sel.end;
          var sepCls = 'scm-date-picker__day-sep' + ((thisIn && nxtIn) ? ' is-in-range' : '');
          html += '<div class="' + sepCls + '"></div>';
        }
      }
      html += '</div>';
    });
    return html;
  }

  function buildMonthWeeks(year, month) {
    // month 기준 6 weeks (42 cells). 첫 셀 = 그 달 1일이 속한 주의 일요일.
    var first = new Date(year, month, 1);
    var dow = first.getDay();             // 0 = Sun
    var startCell = addDays(first, -dow);
    var weeks = [];
    for (var w=0; w<6; w++) {
      var row = [];
      for (var d=0; d<7; d++) {
        var date = addDays(startCell, w*7 + d);
        row.push({ date: date, inMonth: date.getMonth() === month });
      }
      weeks.push(row);
    }
    return weeks;
  }

  function mount(el, opts) {
    if (!el) return null;
    if (el.__scmDatePicker) return el.__scmDatePicker;
    var options = opts || {};

    var mode = options.mode === 'single' ? 'single' : 'range';
    var presets = (options.presets || DEFAULT_PRESETS).slice();
    var selectedPresetId = options.selectedPresetId || null;

    // 초기 value 결정 — 외부에서 명시되면 그대로, 아니면 selectedPresetId 기준 자동 계산
    var sel = { start: null, end: null };
    if (options.value) {
      sel.start = toDate(options.value.start);
      sel.end   = toDate(options.value.end);
      if (!sel.end) sel.end = sel.start;
    } else if (selectedPresetId) {
      var p = presets.find(function (it) { return it.id === selectedPresetId; });
      if (p) {
        var r = computePresetRange(p);
        if (r) { sel.start = r.start; sel.end = r.end; }
      }
    }
    // viewMonth — sel.end 또는 오늘 기준
    var viewBase = sel.end || sel.start || startOfDay(new Date());
    var viewYear = viewBase.getFullYear();
    var viewMonth = viewBase.getMonth();
    var rangePicking = null;   // range 모드에서 첫 클릭 후 두 번째 기다리는 상태 (start Date)

    el.classList.add('scm-date-picker');
    el.setAttribute('data-mode', mode);

    function fire() {
      if (typeof options.onChange === 'function') {
        options.onChange({
          start: sel.start ? fmtISO(sel.start) : '',
          end:   sel.end   ? fmtISO(sel.end)   : '',
          presetId: selectedPresetId,
        });
      }
    }

    function render() {
      var today = startOfDay(new Date());
      var weeks = buildMonthWeeks(viewYear, viewMonth);
      el.innerHTML = ''
        + '<div class="scm-date-picker__presets">'
        +   buildPresetsHtml(presets, selectedPresetId)
        + '</div>'
        + '<div class="scm-date-picker__cal">'
        +   '<div class="scm-date-picker__head">' + buildHeadHtml(viewYear, viewMonth) + '</div>'
        +   '<div class="scm-date-picker__grid">'
        +     buildDowRowHtml()
        +     buildWeeksHtml(weeks, today, sel)
        +   '</div>'
        + '</div>';
    }

    function setSelectionFromPreset(p) {
      var r = computePresetRange(p);
      if (!r) return;
      sel.start = r.start;
      sel.end = r.end;
      selectedPresetId = p.id;
      // view 도 end 의 월로 이동
      viewYear = r.end.getFullYear();
      viewMonth = r.end.getMonth();
      rangePicking = null;
      render();
      fire();
    }

    function onDayClick(iso) {
      var d = toDate(iso);
      if (!d) return;
      // 다른 달 셀 클릭 시 view 이동
      if (d.getMonth() !== viewMonth || d.getFullYear() !== viewYear) {
        viewYear = d.getFullYear();
        viewMonth = d.getMonth();
      }
      if (mode === 'single') {
        sel.start = d; sel.end = d;
        selectedPresetId = null;
      } else {
        // range — 첫 클릭 = start, 두 번째 = end (start 보다 이전이면 swap)
        if (!rangePicking) {
          rangePicking = d;
          sel.start = d;
          sel.end = d;
        } else {
          var s = rangePicking;
          if (d < s) { sel.start = d; sel.end = s; }
          else       { sel.start = s; sel.end = d; }
          rangePicking = null;
        }
        selectedPresetId = null;   // 수동 선택 시 프리셋 active 해제
      }
      render();
      fire();
    }

    el.addEventListener('click', function (e) {
      var preset = e.target.closest('.scm-date-picker__preset');
      if (preset) {
        var pid = preset.getAttribute('data-preset-id');
        var p = presets.find(function (it) { return it.id === pid; });
        if (p) setSelectionFromPreset(p);
        return;
      }
      var nav = e.target.closest('[data-nav]');
      if (nav) {
        var dir = nav.getAttribute('data-nav');
        if (dir === 'prev') {
          if (viewMonth === 0) { viewMonth = 11; viewYear--; }
          else viewMonth--;
        } else if (dir === 'next') {
          if (viewMonth === 11) { viewMonth = 0; viewYear++; }
          else viewMonth++;
        }
        render();
        return;
      }
      var day = e.target.closest('.scm-date-picker__day');
      if (day) {
        if (day.classList.contains('is-disabled')) return;
        var iso = day.getAttribute('data-date');
        if (iso) onDayClick(iso);
      }
    });

    render();

    var api = {
      el: el,
      get: function () {
        return {
          start: sel.start ? fmtISO(sel.start) : '',
          end:   sel.end   ? fmtISO(sel.end)   : '',
          presetId: selectedPresetId,
        };
      },
      set: function (v) {
        v = v || {};
        sel.start = toDate(v.start);
        sel.end   = toDate(v.end) || sel.start;
        selectedPresetId = v.presetId || null;
        if (sel.end) { viewYear = sel.end.getFullYear(); viewMonth = sel.end.getMonth(); }
        rangePicking = null;
        render();
        fire();
        return api;
      },
      reset: function () {
        if (options.selectedPresetId) {
          var p = presets.find(function (it) { return it.id === options.selectedPresetId; });
          if (p) { setSelectionFromPreset(p); return api; }
        }
        sel.start = null; sel.end = null; selectedPresetId = null; rangePicking = null;
        render(); fire();
        return api;
      },
      destroy: function () { el.innerHTML = ''; delete el.__scmDatePicker; },
    };
    el.__scmDatePicker = api;
    return api;
  }

  root.SCM = root.SCM || {};
  root.SCM.datePicker = { mount: mount, DEFAULT_PRESETS: DEFAULT_PRESETS };
})(typeof window !== 'undefined' ? window : globalThis);
