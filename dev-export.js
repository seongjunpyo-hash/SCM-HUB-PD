/* ============================================================
 * SCM HUB · Dev Export
 * ------------------------------------------------------------
 * GNB 우측 프로필 앞에 두 개의 버튼을 주입:
 *   1) 📥 개발자 다운로드 — 모두에게 보이지만 '화면 확정' 상태에서만 활성
 *   2) ✓ 작업완료 / ↩ 확정 해제 — 최고 관리자(super)만 보이는 토글
 *
 * 활성화된 다운로드 버튼을 누르면 현재 데모 화면의 main 콘텐츠
 * (GNB / LNB 제외) 를
 *   • React 컴포넌트 파일 (.jsx)  — HTML→JSX 기본 변환
 *   • 스펙 문서 (.md)             — 의존성 / 컴포넌트 / TODO
 * 두 파일로 만들어 다운로드한다.
 *
 * 화면 확정 상태는 localStorage('scm:dev-export:confirmed:v1') 에 저장,
 * 다른 탭과는 storage 이벤트로 동기화.
 * ============================================================ */
(function () {
  'use strict';
  if (window.__SCM_DEV_EXPORT__) return;
  window.__SCM_DEV_EXPORT__ = true;

  const Z = 100000;
  const CONFIRMED_KEY = 'scm:dev-export:confirmed:v1';

  // ---------- state ----------
  let myRole = null;
  let confirmed = loadConfirmed();

  function loadConfirmed() {
    try {
      const raw = localStorage.getItem(CONFIRMED_KEY);
      const obj = raw ? JSON.parse(raw) : {};
      return obj && typeof obj === 'object' ? obj : {};
    } catch { return {}; }
  }
  function saveConfirmed() {
    try { localStorage.setItem(CONFIRMED_KEY, JSON.stringify(confirmed)); }
    catch (e) { console.warn('[dev-export] save failed', e); }
  }
  function pageKey() { return location.pathname; }
  function isConfirmed() { return !!confirmed[pageKey()]; }
  function confirmPage(by) {
    confirmed[pageKey()] = { by: by || null, at: Date.now() };
    saveConfirmed();
    refresh();
  }
  function revertPage() {
    delete confirmed[pageKey()];
    saveConfirmed();
    refresh();
  }

  // ---------- helpers ----------
  function pageSlug() {
    const last = (location.pathname.split('/').pop() || '').replace(/\.html?$/i, '');
    return last || 'page';
  }
  function pascal(s) {
    return String(s)
      .replace(/[^A-Za-z0-9]+/g, ' ')
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('');
  }
  function pageTitle() {
    const h = document.querySelector('main h1, .scm-page-head__title, h1');
    if (h && h.textContent.trim()) return h.textContent.trim();
    return (document.title || '').split(/[·|]/)[0].trim() || pageSlug();
  }
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  }

  // ---------- HTML → JSX ----------
  const ATTR_RENAME = {
    'class': 'className',
    'for': 'htmlFor',
    'tabindex': 'tabIndex',
    'autofocus': 'autoFocus',
    'autoplay': 'autoPlay',
    'autocomplete': 'autoComplete',
    'readonly': 'readOnly',
    'maxlength': 'maxLength',
    'minlength': 'minLength',
    'novalidate': 'noValidate',
    'colspan': 'colSpan',
    'rowspan': 'rowSpan',
    'crossorigin': 'crossOrigin',
    'srcset': 'srcSet',
    'usemap': 'useMap',
    'datetime': 'dateTime',
    'enctype': 'encType',
    'formaction': 'formAction',
    'spellcheck': 'spellCheck',
    'frameborder': 'frameBorder',
    'allowfullscreen': 'allowFullScreen',
    'contenteditable': 'contentEditable',
    'inputmode': 'inputMode',
    'itemprop': 'itemProp',
    'itemscope': 'itemScope',
    'itemtype': 'itemType',
    'srcdoc': 'srcDoc',
  };
  const VOID_TAGS = new Set([
    'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr',
  ]);

  function styleStringToObject(css) {
    const parts = String(css).split(';').filter((s) => s.trim());
    const pairs = [];
    parts.forEach((p) => {
      const i = p.indexOf(':');
      if (i < 0) return;
      const rawKey = p.slice(0, i).trim();
      const val = p.slice(i + 1).trim().replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      if (!rawKey) return;
      if (rawKey.startsWith('--')) { pairs.push(`'${rawKey}': '${val}'`); return; }
      const camel = rawKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      pairs.push(`${camel}: '${val}'`);
    });
    return `{${pairs.join(', ')}}`;
  }

  function nodeToJsx(node, indent) {
    indent = indent || 0;
    const pad = '  '.repeat(indent);
    if (node.nodeType === 3) {
      const t = node.nodeValue.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
      if (/^\s*$/.test(t)) return '';
      return pad + t.trim() + '\n';
    }
    if (node.nodeType === 8) return pad + '{/*' + node.nodeValue + '*/}\n';
    if (node.nodeType !== 1) return '';

    if (node.classList && (
      node.classList.contains('scm-dev-export-btn') ||
      node.classList.contains('scm-dev-export-action-btn') ||
      node.classList.contains('scm-dev-export-group') ||
      node.classList.contains('scm-dev-export-modal') ||
      node.classList.contains('scm-dev-export-backdrop') ||
      node.classList.contains('scm-voc-pin-layer') ||
      node.classList.contains('scm-voc-fab') ||
      node.classList.contains('scm-voc-popover') ||
      node.classList.contains('scm-voc-toast') ||
      node.classList.contains('scm-voc-pin')
    )) return '';
    if (node.id && /^scm-voc-/.test(node.id)) return '';

    const tag = node.tagName.toLowerCase();
    const attrs = [];
    for (let i = 0; i < node.attributes.length; i++) {
      const a = node.attributes[i];
      const name = a.name.toLowerCase();
      if (name.startsWith('on')) continue;
      if (name === 'style') {
        attrs.push(`style={${styleStringToObject(a.value)}}`);
        continue;
      }
      const k = ATTR_RENAME[name] || name;
      const v = a.value
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '&quot;')
        .replace(/\{/g, '&#123;')
        .replace(/\}/g, '&#125;');
      if (v === '' && /^(disabled|hidden|checked|selected|required|readonly|autofocus|multiple|open)$/.test(name)) {
        attrs.push(k);
      } else {
        attrs.push(`${k}="${v}"`);
      }
    }
    const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';

    if (VOID_TAGS.has(tag)) return pad + `<${tag}${attrStr} />\n`;

    let children = '';
    node.childNodes.forEach((c) => { children += nodeToJsx(c, indent + 1); });
    if (!children) return pad + `<${tag}${attrStr}></${tag}>\n`;
    return pad + `<${tag}${attrStr}>\n${children}${pad}</${tag}>\n`;
  }

  // ---------- inventory ----------
  function listExternalAssets() {
    const out = { css: [], js: [] };
    document.querySelectorAll('head link[rel="stylesheet"][href]').forEach((el) => {
      const href = el.getAttribute('href');
      if (!href) return;
      if (/cdn\.jsdelivr\.net/.test(href)) return;
      out.css.push(href);
    });
    const skipJs = /(^|\/)(auth-gate|dev-export)\.js$|^\/voc\/comment-overlay\.js$|cdn\.jsdelivr\.net/;
    document.querySelectorAll('head script[src], body script[src]').forEach((el) => {
      const src = el.getAttribute('src');
      if (!src || skipJs.test(src)) return;
      out.js.push(src);
    });
    return out;
  }
  function inventoryScmComponents(root) {
    const set = new Set();
    root.querySelectorAll('[class]').forEach((el) => {
      el.classList.forEach((c) => {
        if (c.startsWith('scm-')) set.add(c.replace(/^scm-/, '').split('__')[0].split('--')[0]);
      });
    });
    return [...set].sort();
  }
  function headingTree(root) {
    return [...root.querySelectorAll('h1, h2, h3, h4')].map((h) => {
      const lvl = parseInt(h.tagName.slice(1), 10);
      return '  '.repeat(lvl - 1) + '- ' + h.textContent.trim().replace(/\s+/g, ' ');
    });
  }
  function findContentRoot() {
    return document.querySelector('main')
        || document.querySelector('.app > div:not(.scm-lnb):not(.scm-topbar)')
        || document.body;
  }

  // ---------- file generation ----------
  function generateJsx() {
    const root = findContentRoot();
    const slug = pageSlug();
    const Component = pascal(slug) + 'Page';
    const title = pageTitle();
    const assets = listExternalAssets();
    const date = new Date().toISOString().slice(0, 10);
    const meta = confirmed[pageKey()] || {};
    const jsxBody = nodeToJsx(root, 2).trimEnd();
    const cssNote = assets.css.length ? assets.css.map((p) => '//   - ' + p).join('\n') : '//   (none)';
    const jsNote  = assets.js.length  ? assets.js.map((p)  => '//   - ' + p).join('\n') : '//   (none)';

    return `// ${Component}.jsx
// Auto-exported on ${date} from /demo/${slug}.html
// 화면: ${title}
// 화면 확정: ${meta.by ? meta.by + ' (' + new Date(meta.at).toISOString().slice(0,16).replace('T',' ') + ')' : '미확정'}
//
// 개발 인계 (반드시 처리):
//   1) GNB / LNB 제외된 main 영역만 추출됐습니다. 앱 셸은 별도 컴포넌트로 통합하세요.
//   2) 디자인 시스템 CSS 의존성 — 기존 데모 head 에서 로드되던 파일들:
${cssNote}
//   3) 데모 head 에서 로드되던 JS 모듈 (테이블/필터/모달 등):
${jsNote}
//   4) 인라인 onClick 같은 이벤트 핸들러는 자동으로 제거되었습니다.
//   5) 데이터 fetch / 상태 관리 / 폼 핸들러를 직접 연결해주세요.
//   6) 권한별 분기 (super / admin / biz / pm / dev / pd) 도 잊지 마세요.
//
import React from 'react';

export default function ${Component}() {
  // TODO: useState / useQuery / useEffect 등으로 데이터 연결
  return (
${jsxBody}
  );
}
`;
  }

  function generateSpec() {
    const root = findContentRoot();
    const slug = pageSlug();
    const title = pageTitle();
    const date = new Date().toISOString().slice(0, 10);
    const assets = listExternalAssets();
    const components = inventoryScmComponents(root);
    const headings = headingTree(root);
    const meta = confirmed[pageKey()] || {};

    const lines = [];
    lines.push(`# ${title}`);
    lines.push('');
    lines.push(`> Auto-exported **${date}** from \`/demo/${slug}.html\`.`);
    lines.push(`> 데모 화면을 그대로 React 컴포넌트로 가져갈 수 있도록 추출한 정적 마크업과 메타데이터입니다.`);
    lines.push('');
    lines.push('## 개요');
    lines.push(`- **화면명**: ${title}`);
    lines.push(`- **데모 경로**: \`/demo/${slug}.html\``);
    lines.push(`- **추출 범위**: \`<main>\` 콘텐츠만 (GNB / LNB 는 공통 셸이므로 제외)`);
    lines.push(`- **함께 다운로드된 파일**: \`${pascal(slug)}Page.jsx\``);
    if (meta.by) {
      lines.push(`- **화면 확정자**: ${meta.by}`);
      lines.push(`- **확정 일시**: ${new Date(meta.at).toISOString().slice(0, 16).replace('T', ' ')} UTC`);
    }
    lines.push('');
    lines.push('## 외부 의존성');
    lines.push('### CSS');
    if (assets.css.length) assets.css.forEach((p) => lines.push('- `' + p + '`'));
    else lines.push('- (none)');
    lines.push('### JS 모듈');
    if (assets.js.length) assets.js.forEach((p) => lines.push('- `' + p + '`'));
    else lines.push('- (none)');
    lines.push('');
    lines.push('## 사용된 SCM 디자인 시스템 컴포넌트');
    if (components.length) components.forEach((c) => lines.push('- `scm-' + c + '`'));
    else lines.push('- (감지된 scm-* 컴포넌트 없음)');
    lines.push('');
    lines.push('## 컴포넌트 헤딩 트리');
    if (headings.length) headings.forEach((h) => lines.push(h));
    else lines.push('- (no headings)');
    lines.push('');
    lines.push('## 개발 인계 체크리스트');
    [
      '디자인 시스템 CSS 를 React 프로젝트로 이전 (CSS 모듈 / Tailwind / styled-components 중 결정)',
      '데이터 fetch — 어떤 API 엔드포인트가 필요한지 정의',
      '상태 관리 — 전역 (zustand/redux/context) vs 로컬 (useState) 결정',
      '이벤트 핸들러 (`onClick`, `onChange`, `onSubmit`) 와이어업 (자동 추출에서 제거됨)',
      '폼 검증 / 제출 로직',
      '권한별 분기 — `super` / `admin` / `biz` / `pm` / `dev` / `pd`',
      '에러 / 로딩 / empty 상태 UI',
      '디자인 토큰 (`layer-desktop.css`) 또는 동등 토큰 시스템 import',
      '접근성 (aria-* 속성, 포커스 트랩, 키보드 내비게이션) 보강',
      '다국어 (i18n) 가 필요한 경우 텍스트 외부화',
    ].forEach((t) => lines.push('- [ ] ' + t));
    lines.push('');
    lines.push('## 비고');
    lines.push('- HTML→JSX 변환은 기본 attribute renaming + 인라인 style 객체화 + void 태그 self-close 만 처리합니다.');
    lines.push('- 인라인 `on*` 이벤트 핸들러는 자동으로 제거됐습니다 (React 에서 다시 정의 필요).');
    lines.push('- 데모의 `<main>` 외부에 살던 모달 / drawer / popover 가 있다면 별도로 옮겨야 할 수 있습니다.');
    lines.push('');

    return lines.join('\n');
  }

  // ============================================================
  // Handoff package — delta-focused builders
  // ------------------------------------------------------------
  // The shipped React component (`<Page>.jsx`) + spec are built from
  // the demo's full markup, but for live screens what the dev team
  // actually needs is the DELTA: which columns/filters were hidden,
  // reordered, retyped, what was added, and the comment thread that
  // explains why. The builders below produce that delta from
  // `state.versions[page].activeId.applied` (the snapshot saved by
  // the VOC editor) plus `scm:voc:comments:v1` for the thread.
  // ============================================================
  const VOC_COMMENTS_KEY = 'scm:voc:comments:v1';
  function _loadComments() {
    try { const raw = localStorage.getItem(VOC_COMMENTS_KEY); return raw ? (JSON.parse(raw) || []) : []; }
    catch { return []; }
  }
  // Resolve a voc-key based selector to the human-readable label of
  // the cell it points to. Falls back to the raw selector if the
  // cell isn't in the live DOM (e.g. the user hid + saved it before
  // we ran the standalone stamp pass).
  function _resolveSelectorLabel(sel) {
    try {
      const el = document.querySelector(sel);
      if (!el) return sel;
      const t = (el.textContent || '').trim().replace(/\s+/g, ' ');
      return t || sel;
    } catch { return sel; }
  }
  function _activeVersionForExport() {
    const versions = _loadVersions();
    const ver = _verEntryFor(versions, location.pathname);
    if (!ver || !ver.activeId) return { ver: null, active: null };
    const active = (ver.list || []).find((v) => v.id === ver.activeId) || null;
    return { ver, active };
  }
  // Display label like the VOC editor's selector: position-based
  // DEMO_V<N> based on createdAt-asc order. Independent of stored
  // labels so the numbering survives deletes.
  function _displayLabelMap(ver) {
    const out = {};
    if (!ver || !ver.list) return out;
    const sorted = ver.list.slice().sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    sorted.forEach((v, i) => { out[v.id] = 'DEMO_V' + (i + 1); });
    return out;
  }
  function _isFilterSel(s)    { return /^\[data-voc-key="flt-/.test(s) || /^#voc-added-filter-/.test(s); }
  function _isColSel(s)       { return /^\[data-voc-key="(col|grp)-/.test(s) || /^#voc-added-col-/.test(s); }
  function _isComponentSel(s) { return !_isFilterSel(s) && !_isColSel(s); }
  function _camelLabel(s) {
    const parts = String(s || '').replace(/[^A-Za-z0-9가-힣]/g, ' ').trim().split(/\s+/);
    if (!parts.length) return 'item';
    return parts.map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
  }

  // ----- changes.json -----
  function generateChangesJson() {
    const { ver, active } = _activeVersionForExport();
    const meta = confirmed[pageKey()] || {};
    const labelMap = _displayLabelMap(ver);
    const out = {
      _description: '협업(VOC) 도구가 운영 코드에 적용할 변경 사항 명세. 이 페이지는 신규가 아닐 수 있으며 운영 코드의 컬럼/필터 식별자는 본 셀렉터와 다를 수 있다는 점에 유의하세요. column-map.template.json 으로 매핑을 채우면 자동화에 사용할 수 있습니다.',
      page: {
        path: location.pathname,
        normalizedKey: _normalizePageKey(location.pathname),
        title: pageTitle(),
        slug: pageSlug(),
      },
      version: active ? {
        id: active.id,
        displayLabel: labelMap[active.id] || active.label || null,
        createdAt: active.createdAt || null,
        updatedAt: active.updatedAt || null,
      } : null,
      confirmed: meta.confirmed === true ? {
        by: meta.by || null,
        at: meta.at || null,
      } : null,
      applied: (active && active.applied) || {},
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(out, null, 2);
  }

  // ----- changes.md -----
  function generateChangesMd() {
    const { ver, active } = _activeVersionForExport();
    const a = (active && active.applied) || {};
    const labelMap = _displayLabelMap(ver);
    const lines = [];
    lines.push('# 변경 사항 — ' + pageTitle());
    lines.push('');
    lines.push('이 문서는 협업(VOC) 도구에서 확정한 변경 사항을 **운영 중인 화면에 적용**하기 위한 변경 명세입니다. 데모 코드 자체를 그대로 가져가는 게 아니라, 아래 항목들을 운영 코드의 동등한 위치에 반영해주세요.');
    lines.push('');
    lines.push('- 페이지: `' + location.pathname + '`');
    if (active) {
      lines.push('- 버전: ' + (labelMap[active.id] || active.id));
      if (active.createdAt) lines.push('- 작성: ' + new Date(active.createdAt).toISOString());
    } else {
      lines.push('- 버전: (저장된 활성 버전 없음 — 변경 사항이 비어있을 수 있음)');
    }
    lines.push('- 추출: ' + new Date().toISOString());
    lines.push('');

    const hidden = a.hidden || [];
    const hiddenCols = hidden.filter(_isColSel);
    const hiddenFilters = hidden.filter(_isFilterSel);
    const hiddenComponents = hidden.filter(_isComponentSel);

    let hasAny = false;
    if (hiddenCols.length) {
      hasAny = true;
      lines.push('## 숨김 컬럼');
      hiddenCols.forEach((s) => lines.push('- ' + _resolveSelectorLabel(s) + '  `' + s + '`'));
      lines.push('');
    }
    if (hiddenFilters.length) {
      hasAny = true;
      lines.push('## 숨김 필터');
      hiddenFilters.forEach((s) => lines.push('- ' + _resolveSelectorLabel(s) + '  `' + s + '`'));
      lines.push('');
    }
    if (hiddenComponents.length) {
      hasAny = true;
      lines.push('## 숨김 컴포넌트');
      hiddenComponents.forEach((s) => lines.push('- `' + s + '`'));
      lines.push('');
    }
    if (Array.isArray(a.columnOrder) && a.columnOrder.length) {
      hasAny = true;
      lines.push('## 컬럼 순서 (좌→우)');
      a.columnOrder.forEach((s, i) => lines.push((i + 1) + '. ' + _resolveSelectorLabel(s) + '  `' + s + '`'));
      lines.push('');
    }
    if (a.columnLeafOrder && Object.keys(a.columnLeafOrder).length) {
      hasAny = true;
      lines.push('## 그룹 내 leaf 순서 (2단 thead)');
      Object.entries(a.columnLeafOrder).forEach(([groupSel, leaves]) => {
        if (!Array.isArray(leaves) || !leaves.length) return;
        lines.push('- 그룹 ' + _resolveSelectorLabel(groupSel) + '  `' + groupSel + '`');
        leaves.forEach((ls, i) => lines.push('  ' + (i + 1) + '. ' + _resolveSelectorLabel(ls) + '  `' + ls + '`'));
      });
      lines.push('');
    }
    if (Array.isArray(a.filterOrder) && a.filterOrder.length) {
      hasAny = true;
      lines.push('## 필터 순서 (좌→우)');
      a.filterOrder.forEach((s, i) => lines.push((i + 1) + '. ' + _resolveSelectorLabel(s) + '  `' + s + '`'));
      lines.push('');
    }
    if (a.frozenCount != null) {
      hasAny = true;
      lines.push('## 마지막 고정 컬럼');
      lines.push('- 고정 leaf 수 (cb 포함, 1-based 경계값): **' + a.frozenCount + '**');
      lines.push('');
    }
    if (a.filterTypes && Object.keys(a.filterTypes).length) {
      hasAny = true;
      lines.push('## 필터 입력 타입 변경');
      Object.entries(a.filterTypes).forEach(([sel, type]) => {
        lines.push('- ' + _resolveSelectorLabel(sel) + ' → **' + type + '**  `' + sel + '`');
      });
      lines.push('');
    }
    const addedFilters = (a.added && a.added.filters) || [];
    const addedCols    = (a.added && a.added.columns) || [];
    if (addedFilters.length) {
      hasAny = true;
      lines.push('## 추가 필터');
      addedFilters.forEach((f) => lines.push('- **' + f.label + '** (' + (f.type || 'single') + ')  `#voc-added-filter-' + f.id + '`'));
      lines.push('');
    }
    if (addedCols.length) {
      hasAny = true;
      lines.push('## 추가 컬럼');
      addedCols.forEach((c) => lines.push('- **' + c.label + '**  `#voc-added-col-' + c.id + '`'));
      lines.push('');
    }
    const showSort = a.showSort || [];
    const showFilter = a.showFilter || [];
    if (showSort.length || showFilter.length) {
      hasAny = true;
      lines.push('## 헤더 아이콘 (정렬/필터)');
      if (showSort.length) {
        lines.push('정렬 활성:');
        showSort.forEach((s) => lines.push('- ' + _resolveSelectorLabel(s) + '  `' + s + '`'));
      }
      if (showFilter.length) {
        lines.push('필터 활성:');
        showFilter.forEach((s) => lines.push('- ' + _resolveSelectorLabel(s) + '  `' + s + '`'));
      }
      lines.push('');
    }
    if (!hasAny) {
      lines.push('> 이번 핸드오프에 반영할 변경 사항이 없습니다.');
      lines.push('');
    }

    lines.push('---');
    lines.push('');
    lines.push('## 식별자 매핑 안내');
    lines.push('');
    lines.push('이 문서의 셀렉터(`[data-voc-key="col-N"]`, `[data-voc-key="grp-N"]`)는 협업 도구가 페이지를 스캔할 때 자동으로 부여한 **위치 기반 키**입니다. 운영 코드의 컬럼 식별자(필드명, key 등)와는 다를 가능성이 높습니다.');
    lines.push('');
    lines.push('- 옵션으로 함께 다운로드한 `column-map.template.json` 에서 `voc-key → 운영 컬럼 식별자` 매핑을 채우면 자동화 스크립트에 활용할 수 있습니다.');
    lines.push('- 신규로 추가된 컬럼/필터(`#voc-added-*`)는 운영 코드에는 존재하지 않으므로 직접 추가해야 합니다. `added-snippet.tsx`(옵션) 참고.');
    lines.push('');
    return lines.join('\n');
  }

  // ----- acceptance.md -----
  function generateAcceptanceMd() {
    const { active } = _activeVersionForExport();
    const a = (active && active.applied) || {};
    const lines = [];
    lines.push('# 수용 기준 — ' + pageTitle());
    lines.push('');
    lines.push('운영 코드에 변경을 반영한 후, 아래 모든 항목이 만족되어야 합니다. PR 본문/리뷰 체크리스트로 그대로 사용하세요.');
    lines.push('');
    const items = [];
    (a.hidden || []).filter(_isColSel).forEach((s) => items.push((_resolveSelectorLabel(s) || '컬럼') + ' 컬럼이 화면에 노출되지 않는다'));
    (a.hidden || []).filter(_isFilterSel).forEach((s) => items.push((_resolveSelectorLabel(s) || '필터') + ' 필터가 화면에 노출되지 않는다'));
    (a.hidden || []).filter(_isComponentSel).forEach((s) => items.push('컴포넌트 `' + s + '` 가 화면에 노출되지 않는다'));
    ((a.added && a.added.filters) || []).forEach((f) => items.push('"' + f.label + '" 필터가 ' + (f.type || 'single') + ' 타입으로 노출된다'));
    ((a.added && a.added.columns) || []).forEach((c) => items.push('"' + c.label + '" 컬럼이 테이블에 추가된다'));
    if (Array.isArray(a.columnOrder) && a.columnOrder.length) items.push('테이블 컬럼 순서가 changes.md 의 명시 순서와 일치한다');
    if (Array.isArray(a.filterOrder) && a.filterOrder.length) items.push('필터 순서가 changes.md 의 명시 순서와 일치한다');
    if (a.frozenCount != null) items.push('마지막 고정 컬럼 boundary 가 leaf ' + a.frozenCount + ' 위치에 있다 (cb 포함, 1-based)');
    Object.entries(a.filterTypes || {}).forEach(([sel, type]) => items.push((_resolveSelectorLabel(sel) || '필터') + ' 필터의 입력 타입이 ' + type + ' 이다'));
    (a.showSort || []).forEach((s) => items.push((_resolveSelectorLabel(s) || '컬럼') + ' 헤더의 정렬 아이콘이 노출된다'));
    (a.showFilter || []).forEach((s) => items.push((_resolveSelectorLabel(s) || '컬럼') + ' 헤더의 필터 아이콘이 노출된다'));
    if (!items.length) {
      lines.push('> 수용 기준 없음 (이번 핸드오프에 변경 사항이 없습니다).');
    } else {
      items.forEach((t) => lines.push('- [ ] ' + t));
    }
    lines.push('');
    return lines.join('\n');
  }

  // ----- voc-thread.md -----
  function generateVocThreadMd() {
    const all = _loadComments();
    const path = location.pathname;
    const np = _normalizePageKey(path);
    // Match comments saved under any of the path variants (VOC iframe vs
    // standalone differs in trailing-slash / .html — see _verEntryFor).
    const candidates = new Set([path, np, path + '.html', path + 'index', path + 'index.html']);
    const onPage = (all || []).filter((c) => candidates.has(c.page));
    const lines = [];
    lines.push('# VOC 코멘트 이력 — ' + pageTitle());
    lines.push('');
    lines.push('이 페이지에서 협업 중 남겨진 코멘트입니다. 각 변경 결정의 근거를 추적할 수 있습니다.');
    lines.push('');
    if (!onPage.length) {
      lines.push('> 등록된 코멘트가 없습니다.');
      return lines.join('\n');
    }
    onPage.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    onPage.forEach((c, i) => {
      const head = (c.title || (c.body || '코멘트').slice(0, 40)).replace(/\s+/g, ' ').trim();
      const status = c.status === 'resolved' ? ' (해결됨)' : '';
      lines.push('## ' + (i + 1) + '. ' + head + status);
      lines.push('');
      const author = (c.author && (c.author.name || c.author.email)) || '익명';
      const role = c.author && c.author.role ? ' · ' + c.author.role : '';
      lines.push('- 작성: ' + author + role);
      lines.push('- 시간: ' + (c.createdAt ? new Date(c.createdAt).toISOString() : '-'));
      if (c.versionId) lines.push('- 버전: ' + c.versionId);
      if (c.target)    lines.push('- 위치: `' + c.target + '`');
      lines.push('');
      lines.push((c.body || '(내용 없음)'));
      lines.push('');
      if (Array.isArray(c.replies) && c.replies.length) {
        c.replies.forEach((r) => {
          const ra = (r.author && (r.author.name || r.author.email)) || '익명';
          const rt = r.createdAt ? new Date(r.createdAt).toISOString() : '-';
          lines.push('> **' + ra + '** — ' + rt);
          lines.push('>');
          (r.body || '').split('\n').forEach((ln) => lines.push('> ' + ln));
          lines.push('');
        });
      }
    });
    return lines.join('\n');
  }

  // ----- column-map.template.json -----
  function generateColumnMapTemplate() {
    // Walk the live thead and emit a scaffold mapping voc-key → real
    // operational field. The dev fills `fieldName` per their codebase.
    // _stampVocKeysOnTable should have run by now (init's apply pass).
    const cells = document.querySelectorAll('.mp-table thead th[data-voc-key]');
    const map = {};
    cells.forEach((cell) => {
      const k = cell.dataset.vocKey;
      const label = (cell.textContent || '').trim().replace(/\s+/g, ' ');
      if (!map[k]) map[k] = { label, fieldName: '', notes: '' };
    });
    return JSON.stringify({
      _description: 'voc-key 기반 셀렉터를 운영 코드의 컬럼 식별자(필드명/key)로 매핑합니다. 각 항목의 fieldName 을 채우면 changes.json 을 자동 변환에 사용할 수 있습니다.',
      page: location.pathname,
      generatedAt: new Date().toISOString(),
      columns: map,
    }, null, 2);
  }

  // ----- added-snippet.tsx -----
  function generateAddedSnippet() {
    const { active } = _activeVersionForExport();
    const a = (active && active.applied) || {};
    const addedFilters = (a.added && a.added.filters) || [];
    const addedCols    = (a.added && a.added.columns) || [];
    const lines = [];
    lines.push('// Auto-generated narrow snippet — only ADDED items.');
    lines.push('// 운영 코드에 새로 추가해야 하는 필터/컬럼만 React 친화 형태로 변환합니다.');
    lines.push('// 기존 컬럼/필터의 숨김·순서·타입 변경은 changes.md 를 보고 직접 수정하세요.');
    lines.push('');
    if (!addedFilters.length && !addedCols.length) {
      lines.push('// 이번 핸드오프에는 신규 추가된 필터/컬럼이 없습니다.');
      return lines.join('\n');
    }
    if (addedFilters.length) {
      lines.push('// === 신규 필터 정의 ===');
      lines.push('export const addedFilters = [');
      addedFilters.forEach((f) => {
        lines.push('  {');
        lines.push('    id: ' + JSON.stringify(f.id) + ',');
        lines.push('    label: ' + JSON.stringify(f.label) + ',');
        lines.push('    type: ' + JSON.stringify(f.type || 'single') + ',  // single | multi | code');
        lines.push('    // TODO: 옵션 목록 / 데이터 소스 연결');
        lines.push('  },');
      });
      lines.push('];');
      lines.push('');
    }
    if (addedCols.length) {
      lines.push('// === 신규 컬럼 정의 ===');
      lines.push('export const addedColumns = [');
      addedCols.forEach((c) => {
        lines.push('  {');
        lines.push('    id: ' + JSON.stringify(c.id) + ',');
        lines.push('    accessor: ' + JSON.stringify(_camelLabel(c.label)) + ',  // TODO: 실제 데이터 키로 교체');
        lines.push('    header: ' + JSON.stringify(c.label) + ',');
        lines.push('    // TODO: cell renderer / sort / width');
        lines.push('  },');
      });
      lines.push('];');
      lines.push('');
    }
    return lines.join('\n');
  }

  function triggerDownload(name, content, mime) {
    const blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(() => {
      try { document.body.removeChild(a); } catch (_) {}
      URL.revokeObjectURL(url);
    }, 200);
  }
  // Ordered file catalog used by the modal + downloader. `kind` groups
  // the files visually; `defaultChecked` controls the initial selection.
  function _handoffFileCatalog() {
    const slug = pageSlug();
    const Comp = pascal(slug) + 'Page';
    return [
      // --- delta (default checked) ---
      { id: 'changes-json', kind: 'delta',  name: 'changes.json',     mime: 'application/json',         label: '변경 명세 (JSON)',     desc: '기계 판독 가능한 applied 스냅샷 — 자동화/검증용', defaultChecked: true,  build: generateChangesJson },
      { id: 'changes-md',   kind: 'delta',  name: 'changes.md',       mime: 'text/markdown',            label: '변경 요약 (MD)',       desc: '사람이 읽는 변경 내역 — PR 본문에 그대로 사용 가능',  defaultChecked: true,  build: generateChangesMd },
      { id: 'acceptance',   kind: 'delta',  name: 'acceptance.md',    mime: 'text/markdown',            label: '수용 기준',           desc: '적용 후 확인 체크리스트',                              defaultChecked: true,  build: generateAcceptanceMd },
      { id: 'voc-thread',   kind: 'delta',  name: 'voc-thread.md',    mime: 'text/markdown',            label: 'VOC 코멘트 이력',      desc: '결정 근거 추적 — 작성자/시간/답글 포함',                defaultChecked: true,  build: generateVocThreadMd },
      // --- helpers (optional) ---
      { id: 'column-map',   kind: 'helper', name: 'column-map.template.json', mime: 'application/json', label: '컬럼 매핑 템플릿',     desc: 'voc-key ↔ 운영 코드 필드명 매핑 스캐폴드',                defaultChecked: false, build: generateColumnMapTemplate },
      { id: 'added-snippet',kind: 'helper', name: 'added-snippet.tsx', mime: 'text/plain',              label: '추가 항목 스니펫',     desc: '신규 필터/컬럼만 좁은 범위로 React 형태 변환',           defaultChecked: false, build: generateAddedSnippet },
      // --- legacy (full demo conversion, reference only) ---
      { id: 'legacy-jsx',   kind: 'legacy', name: Comp + '.jsx',       mime: 'text/jsx',                label: '데모 전체 React 변환', desc: '데모 main 영역 전체 (참조용 — 운영 코드와 구조 다를 수 있음)', defaultChecked: false, build: generateJsx },
      { id: 'legacy-spec',  kind: 'legacy', name: slug + '.spec.md',   mime: 'text/markdown',           label: '데모 스펙',           desc: '의존성 / 컴포넌트 / TODO 체크리스트 (참조용)',          defaultChecked: false, build: generateSpec },
    ];
  }
  function doDownload(selectedIds) {
    if (!isConfirmed()) return;
    const catalog = _handoffFileCatalog();
    const picked = selectedIds && selectedIds.length
      ? catalog.filter((f) => selectedIds.includes(f.id))
      : catalog.filter((f) => f.defaultChecked);
    if (!picked.length) return;
    // Stagger the download triggers — Chrome / Firefox throttle clustered
    // a.click() calls; 250ms gap is the minimum that consistently lets
    // every file land in the user's downloads folder.
    picked.forEach((f, i) => {
      setTimeout(() => {
        try { triggerDownload(f.name, f.build(), f.mime + ';charset=utf-8'); }
        catch (e) { console.warn('[scm-handoff]', f.id, 'failed', e); }
      }, i * 250);
    });
  }

  // ---------- modal (download confirm) ----------
  function openModal() {
    if (!isConfirmed()) return;
    if (document.querySelector('.scm-dev-export-backdrop')) return;
    const slug = pageSlug();
    const title = pageTitle();
    const meta = confirmed[pageKey()] || {};
    const catalog = _handoffFileCatalog();
    const groupHeads = {
      delta:  { label: '변경 적용 (운영 코드 반영용)',     hint: '이번 핸드오프의 핵심 — 기본 선택' },
      helper: { label: '보조 도구',                         hint: '필요 시 함께 받기' },
      legacy: { label: '데모 참조 (전체 변환)',             hint: '데모 코드 자체가 필요할 때만' },
    };
    const renderGroup = (kind) => {
      const items = catalog.filter((f) => f.kind === kind);
      if (!items.length) return '';
      const head = groupHeads[kind];
      return `
        <div class="scm-dev-export-modal__group" data-group="${kind}">
          <div class="scm-dev-export-modal__group-head">
            <span class="scm-dev-export-modal__group-title">${escapeHtml(head.label)}</span>
            <span class="scm-dev-export-modal__group-hint">${escapeHtml(head.hint)}</span>
          </div>
          ${items.map((f) => `
            <label class="scm-dev-export-modal__pick">
              <input type="checkbox" data-pick="${f.id}" ${f.defaultChecked ? 'checked' : ''} />
              <div class="scm-dev-export-modal__pick-body">
                <div class="scm-dev-export-modal__pick-row">
                  <span class="scm-dev-export-modal__pick-label">${escapeHtml(f.label)}</span>
                  <code class="scm-dev-export-modal__pick-name">${escapeHtml(f.name)}</code>
                </div>
                <div class="scm-dev-export-modal__pick-desc">${escapeHtml(f.desc)}</div>
              </div>
            </label>
          `).join('')}
        </div>`;
    };

    const bd = document.createElement('div');
    bd.className = 'scm-dev-export-backdrop';
    bd.innerHTML = `
      <div class="scm-dev-export-modal" role="dialog" aria-label="개발자 다운로드">
        <header class="scm-dev-export-modal__head">
          <div class="scm-dev-export-modal__titles">
            <strong>개발자 핸드오프 다운로드</strong>
            <small>${escapeHtml(title)} · /demo/${escapeHtml(slug)}.html</small>
          </div>
          <button class="scm-dev-export-modal__close" type="button" aria-label="닫기">×</button>
        </header>
        <div class="scm-dev-export-modal__body">
          <div class="scm-dev-export-modal__pill scm-dev-export-modal__pill--ok">
            ✓ 화면 확정${meta.by ? ' · ' + escapeHtml(meta.by) : ''}
          </div>
          <p class="scm-dev-export-modal__lede">
            <b>운영 중인 화면에 변경분을 적용</b>하기 위한 핸드오프 패키지입니다. 기본 4종은 변경 사항을 정확히 전달하고, 나머지는 필요할 때만 체크해서 받으세요.
          </p>
          ${renderGroup('delta')}
          ${renderGroup('helper')}
          ${renderGroup('legacy')}
          <p class="scm-dev-export-modal__warn">
            ⚠ 셀렉터(<code>data-voc-key</code>)는 데모 위치 기반 키이며, 운영 코드의 컬럼 식별자(필드명/key)와 다를 수 있습니다. <code>column-map.template.json</code> 으로 매핑을 채우면 자동화 적용이 가능합니다.
          </p>
        </div>
        <footer class="scm-dev-export-modal__foot">
          <button class="scm-dev-export-btn-ghost"   type="button" data-act="cancel">취소</button>
          <button class="scm-dev-export-btn-primary" type="button" data-act="download">📥 선택 파일 다운로드</button>
        </footer>
      </div>
    `;
    document.body.appendChild(bd);
    const close = () => { try { document.body.removeChild(bd); } catch (_) {} };
    bd.addEventListener('click', (e) => { if (e.target === bd) close(); });
    bd.querySelector('.scm-dev-export-modal__close').addEventListener('click', close);
    bd.querySelector('[data-act="cancel"]').addEventListener('click', close);

    // Download-button enable state — disabled when nothing checked.
    const dlBtn = bd.querySelector('[data-act="download"]');
    const refresh = () => {
      const checked = bd.querySelectorAll('[data-pick]:checked');
      dlBtn.disabled = checked.length === 0;
    };
    bd.addEventListener('change', (e) => {
      if (e.target && e.target.matches('[data-pick]')) refresh();
    });
    refresh();

    dlBtn.addEventListener('click', () => {
      const ids = [...bd.querySelectorAll('[data-pick]:checked')].map((el) => el.dataset.pick);
      if (!ids.length) return;
      doDownload(ids);
      close();
    });
    document.addEventListener('keydown', function escClose(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escClose); }
    });
  }

  // ---------- styles ----------
  function injectStyles() {
    if (document.getElementById('scm-dev-export-style')) return;
    const s = document.createElement('style');
    s.id = 'scm-dev-export-style';
    s.textContent = `
      .scm-dev-export-group {
        display: inline-flex; align-items: center; gap: 6px;
        /* sit flush against the profile on the right edge of the GNB */
        margin-left: auto;
        margin-right: 12px;
      }
      .scm-dev-export-btn {
        display: inline-flex; align-items: center; gap: 6px;
        height: 32px; padding: 0 12px;
        background: #fff; color: #1A1A1A;
        border: 1px solid #E0E0E0; border-radius: 6px;
        font-family: -apple-system, BlinkMacSystemFont, 'Pretendard Variable', Pretendard, sans-serif;
        font-size: 12px; font-weight: 500;
        cursor: pointer; white-space: nowrap;
        transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease;
      }
      .scm-dev-export-btn:hover:not(:disabled) { background: #FAFAFA; border-color: #1A1A1A; }
      .scm-dev-export-btn:focus-visible { outline: 2px solid #245EFF; outline-offset: 1px; }
      .scm-dev-export-btn svg { width: 14px; height: 14px; flex-shrink: 0; }
      .scm-dev-export-btn:disabled {
        background: #F5F5F5; color: #9CA3AF; border-color: #EBEEF2;
        cursor: not-allowed;
      }
      .scm-dev-export-btn .pill {
        display: inline-flex; align-items: center; height: 18px;
        padding: 0 6px; margin-left: 4px;
        font-size: 10.5px; font-weight: 700; letter-spacing: 0.2px;
        border-radius: 999px;
      }
      .scm-dev-export-btn .pill--pending { background: #FFF4E5; color: #C2710C; }
      .scm-dev-export-btn .pill--ok      { background: #E6F7EE; color: #0E8A47; }

      .scm-dev-export-action-btn {
        display: inline-flex; align-items: center; gap: 4px;
        height: 32px; padding: 0 12px;
        /* matches the GNB DEMO tag color (#1A1A1A black) */
        background: #1A1A1A; color: #fff;
        border: 1px solid #1A1A1A; border-radius: 6px;
        font-family: -apple-system, BlinkMacSystemFont, 'Pretendard Variable', Pretendard, sans-serif;
        font-size: 12px; font-weight: 600;
        cursor: pointer; white-space: nowrap;
        transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
      }
      .scm-dev-export-action-btn:hover:not(:disabled) { background: #000; border-color: #000; }
      .scm-dev-export-action-btn.is-revert {
        background: transparent; color: #6B7280; border-color: #E0E0E0;
        font-weight: 500;
      }
      .scm-dev-export-action-btn.is-revert:hover:not(:disabled) { background: #F3F4F6; color: #1A1A1A; border-color: #1A1A1A; }
      /* Non-super: button is a status pill, not interactive */
      .scm-dev-export-action-btn.is-status {
        cursor: not-allowed;
        font-weight: 600;
      }
      .scm-dev-export-action-btn.is-status:not(.is-revert) {
        /* 작업중 — yellow, matches the download pill */
        background: #FFF4E5; color: #C2710C; border-color: #F8DDB1;
      }
      .scm-dev-export-action-btn.is-status.is-revert {
        /* 화면 확정 (read-only) — green */
        background: #E6F7EE; color: #0E8A47; border-color: #BCE8CE;
      }

      .scm-dev-export-backdrop {
        position: fixed; inset: 0; z-index: ${Z};
        background: rgba(15, 17, 22, 0.55);
        display: flex; align-items: center; justify-content: center;
        padding: 24px;
        font-family: -apple-system, BlinkMacSystemFont, 'Pretendard Variable', Pretendard, sans-serif;
      }
      .scm-dev-export-modal {
        background: #fff; color: #1A1A1A;
        width: 540px; max-width: 100%; max-height: 80vh;
        border-radius: 12px;
        box-shadow: 0 24px 48px rgba(0,0,0,0.32);
        display: flex; flex-direction: column;
        overflow: hidden;
      }
      .scm-dev-export-modal__head {
        display: flex; align-items: flex-start; gap: 12px;
        padding: 18px 20px 14px;
        border-bottom: 1px solid #F0F0F0;
      }
      .scm-dev-export-modal__titles { flex: 1; min-width: 0; }
      .scm-dev-export-modal__titles strong { display: block; font-size: 15px; font-weight: 700; }
      .scm-dev-export-modal__titles small {
        display: block; margin-top: 4px;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-size: 11.5px; color: #6B7280;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .scm-dev-export-modal__close {
        background: transparent; border: 0; cursor: pointer;
        font-size: 22px; line-height: 1; color: #9CA3AF;
        width: 28px; height: 28px; border-radius: 6px;
        display: inline-flex; align-items: center; justify-content: center;
      }
      .scm-dev-export-modal__close:hover { background: #F3F4F6; color: #1A1A1A; }

      .scm-dev-export-modal__body { padding: 18px 20px 8px; overflow-y: auto; }
      .scm-dev-export-modal__pill {
        display: inline-flex; align-items: center;
        padding: 4px 10px;
        font-size: 11.5px; font-weight: 700; letter-spacing: 0.2px;
        border-radius: 999px;
        margin-bottom: 10px;
      }
      .scm-dev-export-modal__pill--ok { background: #E6F7EE; color: #0E8A47; }
      .scm-dev-export-modal__lede {
        margin: 0 0 14px; font-size: 13.5px; line-height: 1.6; color: #374151;
      }
      .scm-dev-export-modal__files {
        display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;
      }
      .scm-dev-export-modal__file {
        background: #F8F9FB; border: 1px solid #EBEEF2; border-radius: 8px;
        padding: 12px 14px;
      }
      .scm-dev-export-modal__file code {
        display: inline-block;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-size: 12px; font-weight: 600; color: #1A1A1A;
        background: #fff; border: 1px solid #E5E7EB; border-radius: 4px;
        padding: 2px 6px;
        margin-bottom: 4px;
      }
      .scm-dev-export-modal__file span { display: block; font-size: 12px; color: #6B7280; line-height: 1.55; }
      .scm-dev-export-modal__todo {
        margin: 8px 0 4px; padding-left: 18px;
        font-size: 12px; color: #6B7280; line-height: 1.7;
      }
      /* ----- File-picker groups ----- */
      .scm-dev-export-modal__group {
        margin-bottom: 14px;
        background: #F8F9FB; border: 1px solid #EBEEF2; border-radius: 8px;
        overflow: hidden;
      }
      .scm-dev-export-modal__group[data-group="legacy"] {
        background: #FAFAFA; border-color: #E5E7EB;
      }
      .scm-dev-export-modal__group-head {
        display: flex; align-items: baseline; gap: 8px;
        padding: 10px 14px;
        background: #fff;
        border-bottom: 1px solid #EBEEF2;
      }
      .scm-dev-export-modal__group-title {
        font-size: 12.5px; font-weight: 700; color: #1A1A1A;
      }
      .scm-dev-export-modal__group-hint {
        font-size: 11.5px; color: #9CA3AF;
      }
      .scm-dev-export-modal__pick {
        display: flex; gap: 10px; align-items: flex-start;
        padding: 10px 14px;
        border-top: 1px solid #EBEEF2;
        cursor: pointer;
        transition: background 0.12s ease;
      }
      .scm-dev-export-modal__pick:first-of-type { border-top: 0; }
      .scm-dev-export-modal__pick:hover { background: #fff; }
      .scm-dev-export-modal__pick input[type="checkbox"] {
        margin-top: 2px;
        width: 15px; height: 15px;
        accent-color: #4F46E5;
        cursor: pointer; flex-shrink: 0;
      }
      .scm-dev-export-modal__pick-body { flex: 1; min-width: 0; }
      .scm-dev-export-modal__pick-row {
        display: flex; align-items: baseline; gap: 8px;
        margin-bottom: 2px;
      }
      .scm-dev-export-modal__pick-label {
        font-size: 13px; font-weight: 600; color: #1A1A1A;
      }
      .scm-dev-export-modal__pick-name {
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-size: 11.5px; color: #6B7280;
        background: #fff; border: 1px solid #E5E7EB; border-radius: 4px;
        padding: 1px 6px;
      }
      .scm-dev-export-modal__pick-desc {
        font-size: 12px; color: #6B7280; line-height: 1.55;
      }
      .scm-dev-export-modal__warn {
        margin: 4px 0 0;
        padding: 10px 12px;
        background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px;
        font-size: 11.5px; line-height: 1.6; color: #92400E;
      }
      .scm-dev-export-modal__warn code {
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-size: 11px;
        background: #fff; border: 1px solid #FDE68A; border-radius: 3px;
        padding: 0 4px; color: #92400E;
      }
      .scm-dev-export-btn-primary:disabled {
        opacity: 0.4; cursor: not-allowed;
      }
      .scm-dev-export-modal__foot {
        display: flex; justify-content: flex-end; gap: 8px;
        padding: 12px 20px 16px;
        border-top: 1px solid #F0F0F0;
        background: #FAFBFC;
      }
      .scm-dev-export-btn-ghost {
        height: 36px; padding: 0 16px;
        background: #fff; color: #6B7280;
        border: 1px solid #E5E7EB; border-radius: 6px;
        font-family: inherit; font-size: 13px; font-weight: 500; cursor: pointer;
      }
      .scm-dev-export-btn-ghost:hover { color: #1A1A1A; background: #F3F4F6; }
      .scm-dev-export-btn-primary {
        height: 36px; padding: 0 18px;
        background: #1A1A1A; color: #fff; border: 0;
        border-radius: 6px;
        font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer;
      }
      .scm-dev-export-btn-primary:hover { background: #000; }
      /* ---------- Version selector (left of handoff button) ---------- */
      .scm-dev-version-wrap {
        position: relative;
        display: inline-flex; align-items: center;
        margin-right: 4px;
      }
      .scm-dev-version-btn {
        display: inline-flex; align-items: center; gap: 6px;
        height: 32px; padding: 0 12px;
        background: #fff; color: #1A1A1A;
        border: 1px solid #E0E0E0; border-radius: 6px;
        font-family: inherit; font-size: 12px; font-weight: 500;
        cursor: pointer; white-space: nowrap;
        transition: background 0.12s ease, border-color 0.12s ease;
      }
      .scm-dev-version-btn:hover { background: #FAFAFA; border-color: #1A1A1A; }
      .scm-dev-version-btn .chev { width: 10px; height: 10px; opacity: 0.6; }
      .scm-dev-version-menu {
        display: none;
        /* anchor LEFT of the button — selector lives on the left side of
           the topbar, so the dropdown should drop to the right (i.e. its
           own LEFT edge aligned with the button's left edge). */
        position: absolute; top: calc(100% + 4px); left: 0;
        min-width: 280px; max-width: 380px;
        background: #fff; border: 1px solid #E0E0E0; border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        z-index: 100;
        padding: 6px;
      }
      .scm-dev-version-wrap.is-open .scm-dev-version-menu { display: block; }
      .scm-dev-version-item {
        display: flex; align-items: center; gap: 8px;
        padding: 8px 10px; border-radius: 6px;
        font-size: 12px; color: #1A1A1A; cursor: pointer;
      }
      .scm-dev-version-item:hover { background: #F5F5F5; }
      .scm-dev-version-item.is-active { background: #EEF2FF; }
      .scm-dev-version-item__label { font-weight: 600; flex-shrink: 0; }
      .scm-dev-version-item__date  { color: #6B7280; font-size: 11px; flex: 1; }
      .scm-dev-version-item__active-tag {
        font-size: 10px; font-weight: 700; letter-spacing: 0.4px;
        color: #4F46E5; background: #fff; border: 1px solid #C7D2FE;
        padding: 2px 6px; border-radius: 999px;
      }
      .scm-dev-version-item__del {
        background: transparent; border: 0; cursor: pointer;
        color: #9CA3AF; font-size: 14px; line-height: 1;
        padding: 2px 6px; border-radius: 4px;
      }
      .scm-dev-version-item__del:hover { color: #DC2626; background: #FEE2E2; }
      .scm-dev-version-empty {
        padding: 14px; text-align: center; color: #9CA3AF; font-size: 12px;
      }
      .scm-dev-version-title {
        padding: 6px 10px 8px;
        margin: 0 0 4px;
        border-bottom: 1px solid #EFF1F4;
        font-size: 11px; font-weight: 700; letter-spacing: 0.4px;
        color: #6B7280; text-transform: uppercase;
      }
      /* Left-aligned variant — sits inside .scm-topbar__left, 44px after
         the DEMO tag / logo. Overrides the default selector wrap margins. */
      .scm-dev-version-wrap.is-leftaligned {
        margin-right: 0;
        margin-left: 44px;
      }
      /* DEMO tag repurposed for VOC iframe — shows the current version
         label (e.g. demo_v1) instead of the literal "DEMO". Keep the
         original tag styling (black pill, white text, etc.) — only the
         TEXT is swapped. */
    `;
    document.head.appendChild(s);
  }

  // ---------- inject buttons ----------
  let elDownload, elAction;
  function isInIframe() {
    try { return !!(window.parent && window.parent !== window); } catch { return true; }
  }
  function injectButtons() {
    const right = document.querySelector('.scm-topbar__right');
    if (!right) return;
    // Inside VOC's iframe (협업 view), the VOC parent owns the version
    // selector — it lives in the VOC topbar after the L2 page select.
    // Skip both the handoff group AND the version selector here.
    if (isInIframe()) return;
    if (!document.querySelector('.scm-dev-export-group')) {
      const group = document.createElement('div');
      group.className = 'scm-dev-export-group';

      elDownload = document.createElement('button');
      elDownload.className = 'scm-dev-export-btn';
      elDownload.type = 'button';
      elDownload.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 17v2a2 2 0 002 2h10a2 2 0 002-2v-2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="label">Handoff 파일 다운로드</span>
      `;
      elDownload.addEventListener('click', openModal);
      group.appendChild(elDownload);

      elAction = document.createElement('button');
      elAction.className = 'scm-dev-export-action-btn';
      elAction.type = 'button';
      elAction.style.display = 'none';
      elAction.addEventListener('click', onActionClick);
      group.appendChild(elAction);

      right.parentNode.insertBefore(group, right);
      // Cancel the profile's own margin-left:auto so only the group +
      // version selector absorb the leftover horizontal space.
      right.style.marginLeft = '0';
    }
    // Version selector — always injected (read-only badge inside VOC
    // iframe, full dropdown standalone). Goes immediately to the LEFT
    // of the profile, RIGHT of the handoff group.
    injectVersionSelector(right);
    refresh();
  }

  // ---------- Version selector ----------
  const VOC_VERSIONS_KEY = 'scm:voc:versions:v1';
  const VOC_EDITS_KEY    = 'scm:voc:edits:v1';
  let elVersionWrap = null;
  function _loadVersions() {
    try {
      const raw = localStorage.getItem(VOC_VERSIONS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }
  // Page-key normalization. VOC iframe's `iframe.contentWindow.location
  // .pathname` can differ from a standalone demo's `location.pathname`
  // by an `.html` extension (Cloudflare Pages serves clean URLs but
  // some entry points still use the explicit file name). Normalize the
  // key on both sides so saved versions are findable regardless.
  function _normalizePageKey(p) {
    if (!p) return p;
    // Strip the `.html` suffix (Cloudflare Pages serves clean URLs).
    let n = p.replace(/\.html?$/i, '');
    // `/demo/` (clean URL for index) and `/demo/index.html` (VOC menu)
    // resolve to the same page — append `index` to trailing-slash paths
    // so both forms collapse to `/demo/index`.
    if (n.endsWith('/')) n = n + 'index';
    return n;
  }
  function _verEntryFor(versions, path) {
    if (!versions || !path) return null;
    const normalized = _normalizePageKey(path);
    return versions[normalized]
        || versions[path]
        || versions[path + '.html']
        || versions[path + 'index']
        || versions[path + 'index.html']
        || null;
  }
  function _saveVersions(map) {
    try { localStorage.setItem(VOC_VERSIONS_KEY, JSON.stringify(map)); } catch {}
  }
  function _loadAppliedMap() {
    try {
      const raw = localStorage.getItem(VOC_EDITS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }
  function _saveAppliedMap(map) {
    try { localStorage.setItem(VOC_EDITS_KEY, JSON.stringify(map)); } catch {}
  }
  function _formatDate(ts) {
    try {
      const d = new Date(ts);
      const yy = String(d.getFullYear()).slice(2);
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const mi = String(d.getMinutes()).padStart(2, '0');
      return `${yy}.${mm}.${dd} ${hh}:${mi}`;
    } catch { return ''; }
  }
  function injectVersionSelector(rightEl) {
    if (document.querySelector('.scm-dev-version-wrap')) return;
    // Same selector UI in both standalone and VOC iframe contexts —
    // the user wants 협업 view to switch versions the same way the
    // demo does. DEMO tag stays as the literal "DEMO" everywhere.
    elVersionWrap = document.createElement('div');
    // `is-leftaligned` puts the selector on the LEFT side of the topbar,
    // 48px after the logo/DEMO tag — matches the user's preferred layout.
    elVersionWrap.className = 'scm-dev-version-wrap is-leftaligned';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'scm-dev-version-btn';
    btn.innerHTML = '<span class="lbl">DEMO_V1</span><svg class="chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5l3 3 3-3"/></svg>';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      elVersionWrap.classList.toggle('is-open');
      if (elVersionWrap.classList.contains('is-open')) renderVersionMenu();
    });
    elVersionWrap.appendChild(btn);
    const menu = document.createElement('div');
    menu.className = 'scm-dev-version-menu';
    elVersionWrap.appendChild(menu);
    document.addEventListener('click', (e) => {
      if (!elVersionWrap.contains(e.target)) elVersionWrap.classList.remove('is-open');
    });
    // Sit on the LEFT side of the topbar, 80px after the logo/DEMO tag.
    // Falls back to the right side (before .scm-topbar__right) if the
    // left container isn't found.
    const leftEl = document.querySelector('.scm-topbar__left');
    if (leftEl) {
      leftEl.appendChild(elVersionWrap);
    } else {
      rightEl.parentNode.insertBefore(elVersionWrap, rightEl);
    }
    refreshVersionLabel();
  }
  // Active resolution: when versions[page].activeId is null OR doesn't match
  // any saved snapshot, "원본" (the demo's natural state) is the active row.
  function _activeIdResolved(ver) {
    if (!ver || !ver.list || !ver.list.length) return null;
    if (!ver.activeId) return null;
    return ver.list.some((v) => v.id === ver.activeId) ? ver.activeId : null;
  }
  // Position-based display label. ver.list sorted ASCENDING by createdAt
  // gives v1 (oldest) … vN (newest). Label re-derived on every render so
  // labels stay stable in the dropdown after a delete (no gaps).
  function _displayLabelMap(ver) {
    const map = {};
    if (!ver || !ver.list) return map;
    const oldestFirst = ver.list.slice().sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    oldestFirst.forEach((v, i) => { map[v.id] = 'DEMO_V' + (i + 1); });
    return map;
  }
  function refreshVersionLabel() {
    const versions = _loadVersions();
    const ver = _verEntryFor(versions, location.pathname);
    const labelMap = _displayLabelMap(ver);
    const activeId = _activeIdResolved(ver);
    let label;
    if (activeId && labelMap[activeId]) {
      label = labelMap[activeId];
    } else if (ver && ver.list && ver.list.length) {
      // active points at a deleted snapshot — fall back to the newest
      const newest = ver.list.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0];
      label = labelMap[newest.id] || 'DEMO_V?';
    } else {
      // no saved versions yet — first save creates DEMO_V1
      label = 'DEMO_V1';
    }
    if (elVersionWrap) {
      elVersionWrap.style.display = '';
      const lbl = elVersionWrap.querySelector('.lbl');
      if (lbl) lbl.textContent = label;
    }
  }
  function renderVersionMenu() {
    const menu = elVersionWrap.querySelector('.scm-dev-version-menu');
    const versions = _loadVersions();
    const ver = _verEntryFor(versions, location.pathname);
    const activeId = _activeIdResolved(ver);
    const labelMap = _displayLabelMap(ver);
    // 관리자(super OR admin) can delete any non-active version (including v1).
    const isAdmin = (myRole === 'super' || myRole === 'admin');
    const title = '<div class="scm-dev-version-title">데모 버전 선택</div>';
    if (!ver || !ver.list || !ver.list.length) {
      menu.innerHTML = title + '<div class="scm-dev-version-empty">저장된 버전이 없습니다 — 협업 화면에서 저장하면 DEMO_V1 이 생성됩니다</div>';
      return;
    }
    // newest → oldest in the dropdown
    const sorted = ver.list.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const rows = sorted.map((v) => {
      const isActive = v.id === activeId;
      const date = _formatDate(v.createdAt);
      const label = (labelMap[v.id] || '').replace(/[<>&]/g, '');
      const tag = isActive ? '<span class="scm-dev-version-item__active-tag">활성</span>' : '';
      // active version is locked from delete; everything else is fair game for admins.
      const del = (isAdmin && !isActive)
        ? `<button type="button" class="scm-dev-version-item__del" data-del-version="${v.id}" title="삭제">×</button>`
        : '';
      const dataId = v.id;
      return `<div class="scm-dev-version-item ${isActive ? 'is-active' : ''}" data-version-id="${dataId}">`
        + `<span class="scm-dev-version-item__label">${label}</span>`
        + `<span class="scm-dev-version-item__date">${date}</span>`
        + tag
        + del
        + '</div>';
    }).join('');
    menu.innerHTML = title + rows;
    menu.querySelectorAll('[data-version-id]').forEach((row) => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('[data-del-version]')) return;
        const vid = row.dataset.versionId;
        switchActiveVersion(vid);
      });
    });
    menu.querySelectorAll('[data-del-version]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const vid = btn.dataset.delVersion;
        deleteVersion(vid);
      });
    });
  }
  function switchActiveVersion(versionId) {
    const versions = _loadVersions();
    const page = _normalizePageKey(location.pathname);
    const ver = _verEntryFor(versions, location.pathname);
    if (!ver || !ver.list || !ver.list.length) return;
    const v = ver.list.find((x) => x.id === versionId);
    if (!v) return;
    if (ver.activeId === versionId) {
      if (elVersionWrap) elVersionWrap.classList.remove('is-open');
      return;
    }
    ver.activeId = versionId;
    // Always write back under the normalized key (drop legacy .html keys).
    versions[page] = ver;
    _saveVersions(versions);
    // Sync state.applied with the now-active snapshot so the next demo
    // load (and any VOC iframe push) uses it as the baseline.
    const applied = _loadAppliedMap();
    applied[page] = JSON.parse(JSON.stringify(v.applied || {}));
    _saveAppliedMap(applied);
    // Reload so the demo re-renders against the new active state.
    location.reload();
  }
  function deleteVersion(versionId) {
    // 관리자(super OR admin) can delete; member-tier roles cannot.
    if (myRole !== 'super' && myRole !== 'admin') return;
    const versions = _loadVersions();
    const page = _normalizePageKey(location.pathname);
    const ver = _verEntryFor(versions, location.pathname);
    if (!ver || !ver.list) return;
    if (ver.activeId === versionId) return;       // safety — can't delete active
    if (!confirm('이 버전을 삭제할까요? 되돌릴 수 없습니다.')) return;
    ver.list = ver.list.filter((x) => x.id !== versionId);
    _saveVersions(versions);
    renderVersionMenu();
    refreshVersionLabel();
  }
  // ---------- Apply active version's hidden cells on demo standalone ----------
  // Minimal apply: hide selectors from the active version's `applied.hidden`.
  // The full apply pipeline (column reorder, frozen override, added cols,
  // sort/filter icon inject) lives in voc/index.html and runs against the
  // iframe when the demo is opened through VOC. Standalone demos only need
  // the hide pass to reflect the active version baseline.
  // Saved hide selectors are voc-key based ([data-voc-key="col-N"] /
  // [data-voc-key="grp-N"]) — stamped by VOC's edit pane scanner. The
  // standalone demo has never run that scanner, so without this stamp
  // pass the saved CSS rules don't match anything. Walk the table the
  // same way scanEditTargets() does in voc/index.html so the same cell
  // gets the same key on both sides.
  function _stampVocKeysOnTable(table) {
    const thead = table && table.querySelector('thead');
    if (!thead) return;
    const trAll = [...thead.querySelectorAll('tr')];
    if (!trAll.length) return;
    let colCounter = 0, grpCounter = 0;
    const groupTr = trAll.length > 1 ? trAll[0] : null;
    const leafTr  = trAll[trAll.length - 1];
    if (groupTr) {
      [...groupTr.children].forEach((cell) => {
        if (cell.classList.contains('col-spacer')) return;
        if (cell.classList.contains('scm-voc-added-col')) return;
        const cs = parseInt(cell.getAttribute('colspan') || '1', 10);
        const rs = parseInt(cell.getAttribute('rowspan') || '1', 10);
        if (rs > 1) {
          if (cell.classList.contains('cb-col')) return;
          if (!cell.dataset.vocKey) cell.dataset.vocKey = 'col-' + (colCounter++);
        } else if (cs > 1) {
          if (!cell.dataset.vocKey) cell.dataset.vocKey = 'grp-' + (grpCounter++);
        } else {
          if (!cell.dataset.vocKey) cell.dataset.vocKey = 'col-' + (colCounter++);
        }
      });
    }
    if (leafTr) {
      [...leafTr.children].forEach((th) => {
        if (th.classList.contains('col-spacer') || th.classList.contains('cb-col')) return;
        if (th.classList.contains('scm-voc-added-col')) return;
        const cs = parseInt(th.getAttribute('colspan') || '1', 10);
        if (cs > 1) return;             // group cell — handled in groupTr pass
        if (!th.dataset.vocKey) th.dataset.vocKey = 'col-' + (colCounter++);
      });
    }
  }
  // Mirror voc/index.html's applyHiddenCellsToIframe: for each hidden
  // selector targeting a column / group, mark th + tbody td + colgroup
  // col with data-voc-hidden="true" so the universal CSS rule collapses
  // the entire column. Then cascade-hide row1 group cells whose every
  // 2뎁스 leaf is hidden.
  function _applyHiddenCellsForVersion(hidden) {
    if (!Array.isArray(hidden) || !hidden.length) return;
    const isColSel = (s) => /^\[data-voc-key="(col|grp)-/.test(s) || /^#voc-added-col-/.test(s);
    const tables = [...document.querySelectorAll('.mp-table')];
    if (!tables.length) return;
    // Group tables by .mp-table-host so sticky-clone + body share leaf-idx
    const groups = new Map();
    tables.forEach((tbl) => {
      const host = tbl.closest('.mp-table-host') || tbl;
      if (!groups.has(host)) groups.set(host, []);
      groups.get(host).push(tbl);
    });
    hidden.forEach((sel) => {
      if (!isColSel(sel)) return;
      groups.forEach((tblList) => _markHiddenColumnInGroupV(tblList, sel));
    });
    groups.forEach((tblList) => _cascadeHideEmptyGroupsV(tblList));
    // Zero inline widths on hidden cols — refreshFrozenClassesAndOffsets
    // reads `style.width` first, so without this it would still see the
    // original widths and mis-compute --frozen-lN offsets.
    groups.forEach((tblList) => {
      tblList.forEach((tbl) => {
        const cg = tbl.querySelector(':scope > colgroup');
        if (!cg) return;
        [...cg.children].forEach((col) => {
          if (col.dataset.vocHidden === 'true' && col.style.width !== '0px') {
            col.dataset.vocOrigColWidth = col.style.width || '';
            col.style.width = '0px';
          }
        });
      });
    });
    // Re-run frozen offset compute so sticky cells shift left into the
    // hidden columns' space (zeroed col widths above).
    const reorderApi = tables.map((t) => t._scmReorder).find(Boolean);
    if (reorderApi && reorderApi.refreshFrozenClassesAndOffsets) {
      try { reorderApi.refreshFrozenClassesAndOffsets(); } catch {}
    }
    // refreshFrozenClassesAndOffsets stamps col-frozen-last at the leaf
    // at (frozenCount - 1). If that leaf is hidden, the right-side
    // boundary border disappears — relocate the marker to the last
    // VISIBLE frozen leaf so the divider stays drawn.
    groups.forEach((tblList) => _relocateFrozenLastToLastVisibleV(tblList));
  }
  function _relocateFrozenLastToLastVisibleV(tblList) {
    const reorderApi = tblList.map((t) => t._scmReorder).find(Boolean);
    if (!reorderApi) return;
    const frozenCount = reorderApi.frozenCount | 0;
    if (frozenCount <= 0) return;
    const headTable = tblList.find((t) => t.querySelector('thead')) || tblList[0];
    const cg = headTable.querySelector(':scope > colgroup');
    if (!cg) return;
    let newLastIdx = -1;
    for (let i = frozenCount - 1; i >= 0; i--) {
      const col = cg.children[i];
      if (col && col.dataset.vocHidden !== 'true') { newLastIdx = i; break; }
    }
    if (newLastIdx < 0) return;
    tblList.forEach((tbl) => {
      tbl.querySelectorAll('.col-frozen-last').forEach((el) => el.classList.remove('col-frozen-last'));
    });
    tblList.forEach((tbl) => {
      const cgT = tbl.querySelector(':scope > colgroup');
      if (cgT && cgT.children[newLastIdx]) cgT.children[newLastIdx].classList.add('col-frozen-last');
      tbl.querySelectorAll('tbody > tr').forEach((tr) => {
        if (tr.children[newLastIdx]) tr.children[newLastIdx].classList.add('col-frozen-last');
      });
    });
    const model = reorderApi.model;
    const headerLastIdx = model.leafIdxToLeafChildIdx(newLastIdx);
    if (headerLastIdx >= 0 && model.leafTr && model.leafTr.children[headerLastIdx]) {
      model.leafTr.children[headerLastIdx].classList.add('col-frozen-last');
    }
    if (model.isTwoRow) {
      const row1Cell = model.leafIdxToRow1Cell(newLastIdx);
      if (row1Cell) row1Cell.classList.add('col-frozen-last');
    }
  }
  function _markHiddenColumnInGroupV(tblList, sel) {
    const headTable = tblList.find((t) => t.querySelector('thead')) || tblList[0];
    const thead = headTable && headTable.querySelector('thead');
    if (!thead) return;
    let cell;
    try { cell = thead.querySelector(sel); } catch { return; }
    if (!cell) return;
    cell.dataset.vocHidden = 'true';
    const trAll = thead.querySelectorAll('tr');
    const isTwoRow = trAll.length > 1;
    const cs = parseInt(cell.getAttribute('colspan') || '1', 10) || 1;
    const reorderApi = headTable._scmReorder;
    let leafStart = -1, leafCount = 0;
    if (reorderApi) {
      const model = reorderApi.model;
      const rs = parseInt(cell.getAttribute('rowspan') || '1', 10) || 1;
      if (isTwoRow && cell.parentElement === trAll[0] && (cs > 1 || rs >= 2)) {
        const range = model.row1CellLeafRange(cell);
        if (range) { leafStart = range.start; leafCount = range.count; }
      } else {
        const idx = model.thLeafIdx(cell);
        if (idx >= 0) { leafStart = idx; leafCount = 1; }
      }
    } else {
      const tr = cell.parentElement;
      if (tr) {
        let walk = 0, hit = -1;
        for (let i = 0; i < tr.children.length; i++) {
          const c = tr.children[i];
          const ccs = parseInt(c.getAttribute('colspan') || '1', 10) || 1;
          if (c === cell) { hit = walk; break; }
          walk += ccs;
        }
        if (hit >= 0) { leafStart = hit; leafCount = cs; }
      }
    }
    if (leafStart < 0) return;
    if (isTwoRow && cell.parentElement === trAll[0] && cs > 1 && reorderApi) {
      const leafTr = trAll[trAll.length - 1];
      const r2Start = reorderApi.model.row1CellRow2Start(cell);
      if (r2Start >= 0) {
        for (let i = r2Start; i < r2Start + cs; i++) {
          const lc = leafTr.children[i];
          if (lc) lc.dataset.vocHidden = 'true';
        }
      }
    }
    tblList.forEach((tbl) => {
      const colgroup = tbl.querySelector(':scope > colgroup');
      if (colgroup) {
        for (let i = leafStart; i < leafStart + leafCount; i++) {
          const col = colgroup.children[i];
          if (col) col.dataset.vocHidden = 'true';
        }
      }
      const tbody = tbl.querySelector('tbody');
      if (tbody) {
        tbody.querySelectorAll(':scope > tr').forEach((tr) => {
          for (let i = leafStart; i < leafStart + leafCount; i++) {
            const td = tr.children[i];
            if (td) td.dataset.vocHidden = 'true';
          }
        });
      }
    });
  }
  function _cascadeHideEmptyGroupsV(tblList) {
    const headTable = tblList.find((t) => t.querySelector('thead'));
    if (!headTable) return;
    const thead = headTable.querySelector('thead');
    if (!thead) return;
    const trs = thead.querySelectorAll('tr');
    if (trs.length < 2) return;
    const groupTr = trs[0];
    const colgroup = headTable.querySelector(':scope > colgroup');
    if (!colgroup) return;
    let leafIdx = 0;
    [...groupTr.children].forEach((cell) => {
      const cs = parseInt(cell.getAttribute('colspan') || '1', 10) || 1;
      const rs = parseInt(cell.getAttribute('rowspan') || '1', 10) || 1;
      if (rs > 1) { leafIdx += cs; return; }
      if (cs > 1) {
        let allHidden = true;
        for (let i = leafIdx; i < leafIdx + cs; i++) {
          const col = colgroup.children[i];
          if (!col || col.dataset.vocHidden !== 'true') { allHidden = false; break; }
        }
        if (allHidden) {
          cell.dataset.vocHidden = 'true';
          cell.style.display = 'none';
        }
      }
      leafIdx += cs;
    });
  }
  function applyActiveVersionMinimal() {
    try {
      const versions = _loadVersions();
      const ver = _verEntryFor(versions, location.pathname);
      if (!ver || !ver.activeId) return;
      const active = ver.list && ver.list.find((v) => v.id === ver.activeId);
      const a = active && active.applied;
      if (!a || !Array.isArray(a.hidden) || !a.hidden.length) return;
      // 1) CSS — covers per-selector hide + universal data-voc-hidden rules.
      const css = a.hidden.map((s) => `${s} { display: none !important; }`).join('\n')
        + '\n[data-voc-hidden="true"] { display: none !important; }'
        + '\nth[data-voc-hidden="true"], td[data-voc-hidden="true"] { padding: 0 !important; border: 0 !important; width: 0 !important; min-width: 0 !important; max-width: 0 !important; }'
        + '\ncol[data-voc-hidden="true"] { width: 0 !important; min-width: 0 !important; max-width: 0 !important; }'
        + '\n.mp-table thead .group-row th[data-voc-hidden="true"] { position: static !important; visibility: hidden !important; font-size: 0 !important; line-height: 0 !important; background: transparent !important; box-shadow: none !important; }';
      const style = document.createElement('style');
      style.id = 'scm-voc-version-hide';
      style.textContent = css;
      document.head.appendChild(style);
      // 2) Stamp voc-keys + DOM-mark cells once scm-table has finished
      //    splitting the table (clone thead + body table). scm-table runs
      //    its own DOMContentLoaded init; we may load before or after it,
      //    so retry briefly until either the API is attached or we time
      //    out (single-table no-sticky tables won't have _scmReorder but
      //    still need stamping).
      let attempts = 0;
      const tryApply = () => {
        const tables = [...document.querySelectorAll('.mp-table')];
        const hasApi = tables.some((t) => t._scmReorder);
        const hasThead = tables.some((t) => t.querySelector('thead'));
        if (!hasThead && attempts < 30) {
          attempts++;
          setTimeout(tryApply, 50);
          return;
        }
        // Some tables route their thead through scm-table sticky split
        // (thead lives on cloneTable). Skip API wait if 30 retries pass —
        // the no-sticky case still works without it.
        if (!hasApi && attempts < 30) {
          attempts++;
          setTimeout(tryApply, 50);
          return;
        }
        tables.forEach(_stampVocKeysOnTable);
        _applyHiddenCellsForVersion(a.hidden);
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryApply, { once: true });
      } else {
        tryApply();
      }
    } catch {}
  }

  function onActionClick() {
    if (myRole !== 'super') return;
    if (isConfirmed()) {
      if (!confirm('이 화면의 확정을 해제하시겠습니까?\n다운로드가 다시 비활성화됩니다.')) return;
      revertPage();
    } else {
      confirmPage((window.SCM_USER && window.SCM_USER.email) || null);
    }
  }

  // ---------- refresh button states ----------
  function refresh() {
    if (!elDownload) return;
    const ok = isConfirmed();
    const meta = confirmed[pageKey()] || {};

    // download button
    elDownload.disabled = !ok;
    elDownload.title = ok
      ? `이 화면을 React 파일 + 스펙 문서로 다운로드 (${meta.by || '확정자 미상'})`
      : '최고 관리자가 작업완료(화면 확정)해야 다운로드 가능합니다';

    // action button — visible to everyone, but only super can interact.
    // Non-super sees a disabled status pill in button form.
    elAction.style.display = '';
    elAction.classList.toggle('is-revert', ok);
    elAction.classList.toggle('is-status', myRole !== 'super');
    if (myRole === 'super') {
      elAction.disabled = false;
      if (ok) {
        elAction.textContent = '↩ 확정 해제';
        elAction.title = '확정 상태를 해제하고 다시 작업중으로 되돌립니다';
      } else {
        elAction.textContent = '✓ 작업완료';
        elAction.title = '이 화면을 확정해 개발자가 다운로드할 수 있도록 합니다';
      }
    } else {
      elAction.disabled = true;
      if (ok) {
        elAction.textContent = '✓ 화면 확정';
        elAction.title = `최고 관리자가 확정한 화면입니다${meta.by ? ' (' + meta.by + ')' : ''}`;
      } else {
        elAction.textContent = '작업중';
        elAction.title = '최고 관리자가 작업완료(화면 확정)할 때까지 다운로드는 비활성입니다';
      }
    }
  }

  // ---------- boot ----------
  function init() {
    injectStyles();
    injectButtons();
    // Apply the active version's hide rules (standalone only) — VOC's
    // iframe load handler runs the full apply pipeline so we don't want
    // to double-apply when embedded.
    if (!isInIframe()) applyActiveVersionMinimal();
    if (window.SCM_USER) {
      myRole = window.SCM_USER.role || null;
      refresh();
      // role changed → re-render selector so super gets delete buttons
      if (elVersionWrap && elVersionWrap.classList.contains('is-open')) renderVersionMenu();
    }
  }
  function bootAuth() {
    document.addEventListener('scm:auth-ready', (e) => {
      myRole = (e.detail && e.detail.user && e.detail.user.role) || null;
      refresh();
      if (elVersionWrap && elVersionWrap.classList.contains('is-open')) renderVersionMenu();
    });
  }
  // cross-tab sync
  window.addEventListener('storage', (e) => {
    if (e.key !== CONFIRMED_KEY) return;
    confirmed = loadConfirmed();
    refresh();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { init(); bootAuth(); }, { once: true });
  } else {
    init(); bootAuth();
  }
})();
