/* ============================================================
 * SCM HUB · Dev Export
 * ------------------------------------------------------------
 * GNB 우측 프로필 앞에 두 개의 버튼을 주입:
 *   1) 📥 Handoff 파일 다운로드 — 모두에게 보이지만 '최종 확정' 상태에서만 활성
 *   2) ✓ 최종확정 — 최고 관리자(super)만 누를 수 있음. 같은 버전 위에 있을 땐
 *      비활성, 다른 버전을 보는 중에 누르면 그 버전이 새 final 로 승격된다.
 *      한번 누른 뒤에는 '해제' 동작 없음 — 다른 버전을 final 로 다시 지정하는
 *      방식으로만 옮겨감.
 *
 * 활성화된 다운로드 버튼을 누르면 현재 데모 화면의 변경분 + 컨텍스트
 * (changes.json/md, acceptance.md, voc-thread.md 등) 를 묶어 다운로드한다.
 *
 * 데이터 모델:
 *   versions[page].activeId — 사용자가 드롭다운에서 미리보기로 선택한 버전.
 *   versions[page].finalId  — 최종 확정된 운영 베이스라인 버전 ('최종' 태그
 *                             가 따라가고, 다운로드/협업 첫 진입 기준).
 *   confirmed[page]         — 레거시 확정 플래그. finalId 가 채워지면서
 *                             자연스럽게 isConfirmed() = true 로 매핑.
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
    // 주의: same-tab broadcast 는 confirmPage / unfinalize 끝에서 (versions
    // 갱신까지 완료된 시점에) dispatch 한다. 여기서 dispatch 하면 LNB 가
    // 아직 finalId 가 안 박힌 versions 를 읽어 stale 결과를 보일 수 있음.
  }
  function pageKey() { return location.pathname; }
  // 최종 확정 (finalId) — '최종확정' 버튼이 가리키는 운영 베이스라인 버전.
  // ver.activeId 는 사용자가 드롭다운에서 미리보기로 선택한 버전(임시),
  // ver.finalId 는 super 가 명시적으로 확정한 버전(영속). 다운로드 활성 +
  // '최종' 태그는 항상 finalId 를 따른다. 페이지 첫 진입 / 협업 첫 진입
  // 시에도 finalId 가 보이도록 finalize 시 activeId = finalId 로 동기화.
  function _finalIdForPage() {
    const versions = _loadVersions ? _loadVersions() : null;
    if (!versions) return null;
    const ver = _verEntryFor ? _verEntryFor(versions, location.pathname) : null;
    if (!ver || !ver.finalId) return null;
    // finalId 가 list 안의 실제 버전을 가리키는지 확인 (삭제 후 잔존 방지)
    return (ver.list || []).some((v) => v.id === ver.finalId) ? ver.finalId : null;
  }
  function isConfirmed() {
    // 핸드오프 다운로드는 super 가 명시적으로 finalize 한 버전 (finalId) 만
    // 인정. 레거시 confirmed[page] 플래그는 stale 데이터 가능성이 있어
    // 더 이상 fallback 으로 쓰지 않음 — '작업중' 인데 다운로드가 활성화되는
    // 현상 방지.
    return !!_finalIdForPage();
  }
  // 최종확정 — 현재 보고 있는 버전(activeId)을 finalId 로 승격.
  // 버전이 하나도 없으면 v1 을 자동 생성한 뒤 그걸 finalId 로 지정.
  function confirmPage(by) {
    confirmed[pageKey()] = { by: by || null, at: Date.now() };
    saveConfirmed();
    _finalizeActiveAsFinal(by);
    refresh();
    if (typeof refreshVersionLabel === 'function') refreshVersionLabel();
    if (elVersionWrap && elVersionWrap.classList.contains('is-open')) {
      try { renderVersionMenu(); } catch (_) {}
    }
    // versions 갱신까지 완료된 후 broadcast — LNB 등 외부 컴포넌트 즉시 갱신
    try { document.dispatchEvent(new CustomEvent('scm:confirmed-changed')); } catch (_) {}
  }
  // 최종확정 해제 — super/admin 이 finalId 를 제거해서 '작업중' 상태로 되돌림.
  // 다운로드 버튼이 다시 비활성화되고, super 가 '최종확정' 버튼을 다시 누를 수 있음.
  function unfinalize() {
    delete confirmed[pageKey()];
    saveConfirmed();
    if (typeof _loadVersions !== 'function' || typeof _saveVersions !== 'function') return;
    if (typeof _verEntryFor !== 'function' || typeof _normalizePageKey !== 'function') return;
    const versions = _loadVersions();
    const page = _normalizePageKey(location.pathname);
    const ver = _verEntryFor(versions, location.pathname);
    if (!ver) return;
    delete ver.finalId;
    (ver.list || []).forEach((v) => {
      delete v.finalizedBy;
      delete v.finalizedAt;
    });
    versions[page] = ver;
    _saveVersions(versions);
    refresh();
    if (typeof refreshVersionLabel === 'function') refreshVersionLabel();
    // versions 갱신 후 broadcast — LNB 등이 즉시 작업중 톤으로 복귀
    try { document.dispatchEvent(new CustomEvent('scm:confirmed-changed')); } catch (_) {}
  }
  // 호환용 별칭
  function revertPage() { unfinalize(); }
  function _finalizeActiveAsFinal(by) {
    if (typeof _loadVersions !== 'function' || typeof _saveVersions !== 'function') return;
    if (typeof _verEntryFor !== 'function' || typeof _normalizePageKey !== 'function') return;
    const versions = _loadVersions();
    const page = _normalizePageKey(location.pathname);
    let ver = _verEntryFor(versions, location.pathname);
    if (!ver || !Array.isArray(ver.list) || !ver.list.length) {
      // 버전 없음 — 빈 applied 로 v1 자동 생성하고 finalId 로 지정
      const now = Date.now();
      const id = 'v' + now.toString(36) + Math.random().toString(36).slice(2, 5);
      ver = {
        list: [{
          id, label: 'v1', createdAt: now, applied: {},
          finalizedBy: by || null, finalizedAt: now, autoCreated: true,
        }],
        activeId: id,
        finalId: id,
      };
      versions[page] = ver;
      _saveVersions(versions);
      return;
    }
    // 기존 버전이 있으면 현재 activeId 를 finalId 로 승격.
    // activeId 가 누락/유실 상태면 list 의 최신을 활성으로 폴백.
    let target = ver.activeId && ver.list.some((v) => v.id === ver.activeId)
      ? ver.activeId
      : ver.list.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0].id;
    ver.finalId = target;
    ver.activeId = target;       // 첫 진입에서 finalId 가 보이도록 sync
    const v = ver.list.find((x) => x.id === target);
    if (v) {
      v.finalizedBy = by || null;
      v.finalizedAt = Date.now();
      // EDIT_KEY 의 applied 도 final 의 applied 로 동기화 — 협업(VOC) 첫
      // 진입 시 state.applied 가 final 을 반영해 화면 첫 그림이 final 로
      // 일치한다. 동기화 안 하면 finalize 직후에도 협업은 직전 commit 한
      // 버전의 applied 를 그대로 보여줘 어긋남.
      try {
        const applied = _loadAppliedMap();
        applied[page] = JSON.parse(JSON.stringify(v.applied || {}));
        _saveAppliedMap(applied);
      } catch (_) {}
    }
    versions[page] = ver;
    _saveVersions(versions);
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

  // Static HTML snippet of the demo's main area — `outerHTML` of the
  // content root with a small wrapper that lists the external CSS/JS
  // imports needed to make the markup render. Useful when the dev
  // team is starting a NEW page (no existing operational code) and
  // wants the demo's layout as a structural starting point.
  function generateHtml() {
    const root = findContentRoot();
    const slug = pageSlug();
    const title = pageTitle();
    const assets = listExternalAssets();
    const date = new Date().toISOString().slice(0, 10);
    const cssLinks = assets.css.map((p) => `  <link rel="stylesheet" href="${p}" />`).join('\n');
    const jsScripts = assets.js.map((p) => `  <script src="${p}"></script>`).join('\n');
    const inner = root ? root.outerHTML : '<!-- content root not found -->';
    return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <!-- Auto-exported on ${date} from /demo/${slug}.html (main 영역만 — GNB/LNB 제외).
       신규 페이지 작업 시 이 마크업을 구조 참조로 사용하세요. 의존하는 디자인
       시스템 CSS/JS 도 아래 link/script 로 같이 표기되어 있습니다. -->
${cssLinks || '  <!-- (외부 CSS 의존성 없음) -->'}
</head>
<body>
${inner}
${jsScripts || '  <!-- (외부 JS 의존성 없음) -->'}
</body>
</html>
`;
  }

  // Concatenated page-scoped CSS — collects every <style> block inside
  // the page (head + body) into one file, prefixed with a header listing
  // the external CSS imports. The dev team can paste page-specific
  // styles into their stylesheet and follow the import list to wire up
  // the design-system files. External link[rel=stylesheet] contents are
  // NOT inlined — they live in the design system and should be imported
  // there directly.
  function generateCss() {
    const slug = pageSlug();
    const title = pageTitle();
    const assets = listExternalAssets();
    const date = new Date().toISOString().slice(0, 10);
    const lines = [];
    lines.push('/* ============================================================');
    lines.push(' * ' + title + ' — page-scoped styles');
    lines.push(' * Auto-exported on ' + date + ' from /demo/' + slug + '.html');
    lines.push(' * ------------------------------------------------------------');
    lines.push(' * 신규 페이지를 만들 때 이 파일의 인라인 스타일을 그대로 가져가고,');
    lines.push(' * 아래 외부 CSS 의존성도 프로젝트 빌드에 포함시켜야 데모와 같은');
    lines.push(' * 시각 결과가 나옵니다. (운영 페이지에 변경분만 적용하는');
    lines.push(' * 시나리오에서는 보통 외부 CSS 는 이미 로드되어 있어 import 만');
    lines.push(' * 신경 쓰면 됩니다.)');
    lines.push(' * ');
    lines.push(' * Required external CSS imports:');
    if (assets.css.length) assets.css.forEach((p) => lines.push(' *   - ' + p));
    else lines.push(' *   (none)');
    lines.push(' * ============================================================ */');
    lines.push('');
    const styles = [...document.querySelectorAll('style')];
    if (!styles.length) {
      lines.push('/* 이 페이지에 인라인 <style> 블록이 없습니다. */');
    } else {
      styles.forEach((s, i) => {
        // Skip styles that we ourselves injected (dev-export, voc, version-hide).
        if (s.id && /scm-(voc|dev-export)/.test(s.id)) return;
        lines.push('/* ----- inline <style> block #' + (i + 1) + (s.id ? ' (id=' + s.id + ')' : '') + ' ----- */');
        lines.push(s.textContent.trim());
        lines.push('');
      });
    }
    return lines.join('\n');
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
// 최종 확정: ${meta.by ? meta.by + ' (' + new Date(meta.at).toISOString().slice(0,16).replace('T',' ') + ')' : '미확정'}
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
      lines.push(`- **최종 확정자**: ${meta.by}`);
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
    // 핸드오프는 '최종확정된' 버전 = finalId 가 가리키는 버전을 기준으로
    // 묶는다. finalId 가 없으면(아직 확정 전이거나 레거시 데이터) 미리보기
    // 인 activeId 로 폴백 — 그 경우에도 무엇이 패키징됐는지는 changes.json
    // 의 version 필드로 확인 가능.
    const versions = _loadVersions();
    const ver = _verEntryFor(versions, location.pathname);
    if (!ver) return { ver: null, active: null };
    const targetId = (ver.finalId && (ver.list || []).some((v) => v.id === ver.finalId))
      ? ver.finalId
      : (ver.activeId && (ver.list || []).some((v) => v.id === ver.activeId) ? ver.activeId : null);
    if (!targetId) return { ver, active: null };
    const active = (ver.list || []).find((v) => v.id === targetId) || null;
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
      { id: 'legacy-html',  kind: 'legacy', name: slug + '.html',      mime: 'text/html',               label: '데모 HTML',           desc: '데모 main 영역 마크업 + CSS/JS 의존성 (신규 페이지 시작 시)',     defaultChecked: false, build: generateHtml },
      { id: 'legacy-css',   kind: 'legacy', name: slug + '.css',       mime: 'text/css',                label: '데모 페이지 스타일',  desc: '페이지 인라인 <style> 블록 + 외부 CSS import 목록',          defaultChecked: false, build: generateCss },
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
          </div>
          <button class="scm-dev-export-modal__close" type="button" aria-label="닫기">×</button>
        </header>
        <div class="scm-dev-export-modal__body">
          <div class="scm-dev-export-modal__pill scm-dev-export-modal__pill--ok">
            ✓ 최종 확정${meta.by ? ' · ' + escapeHtml(meta.by) : ''}
          </div>
          ${renderGroup('delta')}
          ${renderGroup('helper')}
          ${renderGroup('legacy')}
        </div>
        <footer class="scm-dev-export-modal__foot">
          <button class="scm-dev-export-btn-ghost"   type="button" data-act="cancel">취소</button>
          <button class="scm-dev-export-btn-primary" type="button" data-act="download">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 16.5H17M10 13.5V3.5M10 13.5L14 9.5M10 13.5L6 9.5" stroke="currentColor" stroke-width="1.4" stroke-miterlimit="10"/>
            </svg>
            선택 파일 다운로드
          </button>
        </footer>
      </div>
    `;
    document.body.appendChild(bd);
    // 모달이 떠 있는 동안 뒤 화면 스크롤 잠금. 휠 / 키보드 / 터치 모두
    // 막혀야 해서 body.style.overflow:hidden 으로 viewport 잠그고, html
    // 도 같이 처리(브라우저별로 둘 중 하나만 먹는 케이스가 있음). close
    // 시점에 원래 값으로 복원해 다른 모달과 충돌하지 않게 함.
    const _prevBodyOverflow = document.body.style.overflow;
    const _prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const close = () => {
      try { document.body.removeChild(bd); } catch (_) {}
      document.body.style.overflow = _prevBodyOverflow;
      document.documentElement.style.overflow = _prevHtmlOverflow;
    };
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
        /* success-green to signal the affirmative '최종 확정' action */
        background: #16A34A; color: #fff;
        border: 1px solid #16A34A; border-radius: 6px;
        font-family: -apple-system, BlinkMacSystemFont, 'Pretendard Variable', Pretendard, sans-serif;
        font-size: 12px; font-weight: 600;
        cursor: pointer; white-space: nowrap;
        transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
      }
      .scm-dev-export-action-btn:hover:not(:disabled) { background: #15803D; border-color: #15803D; }
      /* Disabled (e.g. super viewing the current 최종) — muted, no fill,
         clearly non-interactive. Without this the disabled button kept
         the solid black surface and visually read as active. */
      .scm-dev-export-action-btn:disabled {
        background: #fff; color: #9CA3AF;
        border-color: #E5E7EB;
        cursor: not-allowed;
      }
      .scm-dev-export-action-btn.is-final:disabled {
        background: #F8F9FB; color: #6B7280;
        border-color: #E5E7EB;
        font-weight: 500;
      }
      /* Non-super: button is a status pill, not interactive */
      .scm-dev-export-action-btn.is-status {
        cursor: not-allowed;
        font-weight: 600;
      }
      /* '확정 해제' (super/admin viewing finalized) — destructive look so user
         understands clicking will revert to working state */
      .scm-dev-export-action-btn.is-revert {
        background: #FEF2F2; color: #DC2626; border-color: #FCA5A5;
        font-weight: 600;
      }
      .scm-dev-export-action-btn.is-revert:hover:not(:disabled) {
        background: #FEE2E2; border-color: #DC2626;
      }
      /* 작업중 (non-super, no final yet) — yellow pending state */
      .scm-dev-export-action-btn.is-status:not(.is-final) {
        background: #FFF4E5; color: #C2710C; border-color: #F8DDB1;
      }
      /* 최종 확정됨 (non-super viewing the final) — same muted look as
         super-disabled so the visual model is consistent */
      .scm-dev-export-action-btn.is-status.is-final {
        background: #F8F9FB; color: #6B7280;
        border-color: #E5E7EB;
        font-weight: 500;
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
        position: relative;
        display: flex; align-items: center;
        gap: 12px;
        padding: 18px 56px 18px 20px;   /* 위/아래 동일, 우측 close 버튼 자리 확보 */
      }
      .scm-dev-export-modal__titles { flex: 1; min-width: 0; text-align: left; }
      .scm-dev-export-modal__titles strong { display: block; font-size: 15px; font-weight: 700; }
      .scm-dev-export-modal__titles small {
        display: block; margin-top: 4px;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-size: 11.5px; color: #6B7280;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .scm-dev-export-modal__close {
        position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
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
      .scm-dev-export-btn-primary:disabled {
        opacity: 0.4; cursor: not-allowed;
      }
      .scm-dev-export-modal__foot {
        display: flex; justify-content: flex-end; gap: 8px;
        padding: 12px 20px 16px;
        background: #FFFFFF;
      }
      .scm-dev-export-btn-ghost {
        height: 36px; padding: 0 16px;
        background: #fff; color: #6B7280;
        border: 1px solid #E5E7EB; border-radius: 4px;
        font-family: inherit; font-size: 13px; font-weight: 500; cursor: pointer;
      }
      .scm-dev-export-btn-ghost:hover { color: #1A1A1A; background: #F3F4F6; }
      .scm-dev-export-btn-primary {
        display: inline-flex; align-items: center; gap: 8px;
        height: 36px; padding: 0 18px;
        background: #1A1A1A; color: #fff; border: 0;
        border-radius: 4px;
        font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer;
      }
      .scm-dev-export-btn-primary svg { width: 14px; height: 14px; flex-shrink: 0; }
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
        flex-wrap: wrap;
        padding: 8px 10px; border-radius: 6px;
        font-size: 12px; color: #1A1A1A; cursor: pointer;
      }
      .scm-dev-version-item:hover { background: #F5F5F5; }
      .scm-dev-version-item.is-active { background: #EEF2FF; }
      .scm-dev-version-item__label { font-weight: 600; flex-shrink: 0; }
      .scm-dev-version-item__date  { color: #6B7280; font-size: 11px; flex: 1; }
      .scm-dev-version-item__note {
        flex-basis: 100%;
        margin-top: 2px;
        font-size: 11.5px; color: #4B5563; line-height: 1.45;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
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
    btn.innerHTML = '<span class="lbl">DEMO_V0</span><svg class="chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5l3 3 3-3"/></svg>';
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
      // 저장된 버전이 0개 — DEMO_V0 으로 표시. 첫 저장 시 DEMO_V1 생성.
      label = 'DEMO_V0';
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
    const finalId = (ver && ver.finalId && (ver.list || []).some((v) => v.id === ver.finalId)) ? ver.finalId : null;
    const labelMap = _displayLabelMap(ver);
    // 관리자(super OR admin) 는 finalId 가 아닌 버전을 삭제할 수 있음.
    // (activeId 만 보호하던 기존 정책에서 → finalId 보호로 전환:
    // 미리보기로 옮긴 비-final 버전은 자유롭게 삭제 가능해야 함.)
    const isAdmin = (myRole === 'super' || myRole === 'admin');
    const title = '<div class="scm-dev-version-title">데모 버전 선택</div>';
    if (!ver || !ver.list || !ver.list.length) {
      menu.innerHTML = title + '<div class="scm-dev-version-empty">저장된 버전이 없습니다 — 협업 화면에서 저장하면 DEMO_V1 이 생성됩니다</div>';
      return;
    }
    // newest → oldest in the dropdown
    const sorted = ver.list.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const rows = sorted.map((v) => {
      const isActive = v.id === activeId;       // 현재 미리보기 (드롭다운 하이라이트)
      const isFinal  = v.id === finalId;        // 최종확정된 버전 (배지)
      const date = _formatDate(v.createdAt);
      const label = (labelMap[v.id] || '').replace(/[<>&]/g, '');
      const tag = isFinal ? '<span class="scm-dev-version-item__active-tag">최종</span>' : '';
      // 최종 버전만 삭제 잠금. 그 외엔 admin 이 자유롭게 정리 가능.
      const del = (isAdmin && !isFinal)
        ? `<button type="button" class="scm-dev-version-item__del" data-del-version="${v.id}" title="삭제">×</button>`
        : '';
      const dataId = v.id;
      // 저장 시 입력한 메모는 협업/데모 양쪽에서 어떤 작업이 된 버전인지
      // 식별할 수 있게 라벨 아래에 한 줄로 표시. 길면 ellipsis + title 로 풀텍스트.
      const note = (v.note || '').trim();
      const noteHtml = note
        ? `<span class="scm-dev-version-item__note" title="${escapeHtml(note)}">${escapeHtml(note)}</span>`
        : '';
      return `<div class="scm-dev-version-item ${isActive ? 'is-active' : ''}" data-version-id="${dataId}">`
        + `<span class="scm-dev-version-item__label">${label}</span>`
        + `<span class="scm-dev-version-item__date">${date}</span>`
        + tag
        + del
        + noteHtml
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
    // 최종 확정된 버전은 보호 — 운영 베이스라인이라 삭제 불가.
    if (ver.finalId && ver.finalId === versionId) return;
    if (!confirm('이 버전을 삭제할까요? 되돌릴 수 없습니다.')) return;
    ver.list = ver.list.filter((x) => x.id !== versionId);
    // 미리보기 활성 (activeId) 이 삭제 대상이었다면 final 로 폴백.
    if (ver.activeId === versionId) {
      ver.activeId = ver.finalId || (ver.list[0] && ver.list[0].id) || null;
    }
    _saveVersions(versions);
    renderVersionMenu();
    refreshVersionLabel();
    refresh();
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
  // standalone(`/demo/...`) 페이지에서 active version 의 settings.exposed === false
  // 일 때 페이지 전체를 가리는 [비공개] 오버레이를 띄운다. VOC iframe 안에서는
  // 호출되지 않음 (편집자가 항상 데모를 볼 수 있어야 하므로).
  function applyPrivateOverlayIfNeeded() {
    try {
      if (isInIframe()) return;
      const versions = _loadVersions();
      const ver = _verEntryFor(versions, location.pathname);
      // active applied snapshot 의 settings.exposed 를 본다. active 가 없으면
      // applied map 의 page 엔트리를 본다 (저장 안된 임시 상태일 수 있음).
      let applied = null;
      if (ver && ver.activeId) {
        const active = (ver.list || []).find((v) => v.id === ver.activeId);
        applied = (active && active.applied) || null;
      }
      if (!applied) {
        const map = _loadAppliedMap();
        const np = _normalizePageKey(location.pathname);
        applied = map[np] || map[location.pathname] || null;
      }
      const exposed = !applied || !applied.settings || applied.settings.exposed !== false;
      if (exposed) return;
      const ensure = () => _renderPrivateOverlay();
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensure, { once: true });
      } else {
        ensure();
      }
    } catch {}
  }
  function _renderPrivateOverlay() {
    if (document.getElementById('scm-voc-private-overlay')) return;
    const styleId = 'scm-voc-private-overlay-css';
    if (!document.getElementById(styleId)) {
      const s = document.createElement('style');
      s.id = styleId;
      // 회색 반투명 사선 패턴이 main 영역 위로만 깔리고, 가운데에 큼직한
      // [비공개] 핀이 떠있는 형태. GNB / LNB 는 가리지 않아서 다른 페이지로
      // 이동 가능. pointer-events:none 으로 클릭은 페이지로 통과 →
      // 이해관계자가 스크롤하며 미리 살펴볼 수는 있음.
      s.textContent = `
        #scm-voc-private-overlay {
          position: fixed;
          top: var(--scm-sticky-gnb, 64px);
          left: var(--scm-lnb-width, 56px);
          right: 0; bottom: 0;
          /* topbar(20), LNB(15) 보다 아래 → GNB 드롭다운 / LNB 정상 노출.
             page-head(12), filter-bar(12), stats-bar(11) 보다는 위 →
             main 안의 sticky chrome 도 함께 사선 패턴으로 덮여 "이 페이지
             전체가 비공개" 인 시각 신호 일관됨. */
          z-index: 14;
          pointer-events: none;
          background: repeating-linear-gradient(
            45deg,
            rgba(107, 114, 128, 0.10) 0 18px,
            rgba(107, 114, 128, 0.22) 18px 36px
          );
          font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.01em;
          transition: left 0.2s ease;
        }
        #scm-voc-private-overlay .scm-pv-pin {
          position: absolute; left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          display: inline-flex; flex-direction: column; align-items: center; gap: 10px;
          padding: 26px 44px 22px;
          background: rgba(31, 41, 55, 0.94); color: #fff;
          border-radius: 18px;
          box-shadow: 0 24px 56px rgba(0,0,0,0.32);
          text-align: center;
          max-width: min(86vw, 580px);
        }
        #scm-voc-private-overlay .scm-pv-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 14px; border-radius: 999px;
          background: rgba(255,255,255,0.12); color: #F9FAFB;
          font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase;
        }
        #scm-voc-private-overlay .scm-pv-tag::before {
          content: ''; width: 6px; height: 6px; border-radius: 999px;
          background: #FCA5A5;
        }
        #scm-voc-private-overlay .scm-pv-title {
          margin: 0;
          font-size: 26px; font-weight: 700; letter-spacing: -0.5px;
          line-height: 1.3;
        }
        #scm-voc-private-overlay .scm-pv-sub {
          margin: 0; font-size: 13px; color: #D1D5DB; line-height: 1.55;
        }
      `;
      document.head.appendChild(s);
    }
    const root = document.createElement('div');
    root.id = 'scm-voc-private-overlay';
    root.setAttribute('role', 'note');
    root.setAttribute('aria-label', '아직 작업중 — 비공개 데모');
    root.innerHTML = `
      <div class="scm-pv-pin">
        <span class="scm-pv-tag">비공개</span>
        <h2 class="scm-pv-title">🚧 아직 작업중이라 비공개입니다</h2>
        <p class="scm-pv-sub">공개되면 같은 URL 에서 그대로 열어볼 수 있습니다.</p>
      </div>
    `;
    document.body.appendChild(root);
  }

  // ============================================================
  // FULL VOC SNAPSHOT APPLY (mirrors voc/index.html 의 apply chain)
  // ------------------------------------------------------------
  // standalone 데모 페이지가 active 버전의 applied 를 받아 voc 편집의
  // 모든 변경을 실제 DOM 에 반영. 이전엔 a.hidden 만 처리해서 라벨/추가/
  // HTML override 등은 standalone 에 전혀 보이지 않았음 — "데모 저장이
  // 반영 안됨" 의 정체.
  //
  // 처리 항목:
  //  - hidden CSS + data-voc-hidden 셀 stamp (기존)
  //  - 추가 필터/컬럼/그룹 inject
  //  - 추가 컴포넌트 (HTML + rowbreak sentinel) inject (12-column grid)
  //  - 필터/컬럼 라벨 오버라이드
  //  - native 컴포넌트 HTML override (componentEdits.html)
  //
  // IMPORTANT: voc/index.html 의 apply 함수와 동기화 유지 — 새 step 이
  // 추가되면 여기에도 mirror.
  // ============================================================
  function _isElVisibleStandalone(el) {
    if (!el || el.nodeType !== 1) return false;
    const win = el.ownerDocument && el.ownerDocument.defaultView;
    for (let cur = el; cur && cur.nodeType === 1 && cur !== document.documentElement; cur = cur.parentElement) {
      if (cur.hasAttribute && cur.hasAttribute('hidden')) return false;
      if (win && win.getComputedStyle) {
        const cs = win.getComputedStyle(cur);
        if (cs && (cs.display === 'none' || cs.visibility === 'hidden')) return false;
      }
    }
    return true;
  }
  function _hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return String(h);
  }
  function _normLabel(s) {
    return String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  }
  // Cross-page label sync — voc 가 'scm:voc:global-labels:v1' 에 저장.
  const _GLOBAL_LABELS_KEY = 'scm:voc:global-labels:v1';
  function _loadGlobalLabels() {
    try {
      const raw = localStorage.getItem(_GLOBAL_LABELS_KEY);
      const v = raw ? JSON.parse(raw) : {};
      return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
    } catch { return {}; }
  }

  // 원본 라벨 stamp — voc 의 stampOrigLabel 미러. standalone 에서도 매칭 키
  // 동작하도록 첫 stamp.
  function _stampOrigLabelDom(el, label) {
    if (!el) return;
    if (el.getAttribute && el.getAttribute('data-voc-orig-label')) return;
    const norm = _normLabel(label);
    if (!norm) return;
    try { el.setAttribute('data-voc-orig-label', norm); } catch (_) {}
  }
  function _stampOrigLabelsForComponents(doc) {
    const main = doc.querySelector('main') || doc.body;
    if (!main) return;
    // 필터
    main.querySelectorAll('.scm-filter-bar .scm-filter-select[data-mp-filter]:not(.scm-voc-added-filter)').forEach((el) => {
      const labEl = el.querySelector('.scm-filter-select__label');
      const valEl = el.querySelector('.scm-filter-select__value');
      const label = (labEl && labEl.textContent.trim()) || (valEl && valEl.textContent.trim()) || el.dataset.mpFilter || '필터';
      _stampOrigLabelDom(el, label.replace(/\s+/g, ' ').slice(0, 28));
    });
    // 컬럼 (thead th)
    [...main.querySelectorAll('.mp-table thead th')].forEach((th) => {
      if (th.classList.contains('cb-col') || th.classList.contains('col-spacer')) return;
      const label = (th.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28) || '(빈 컬럼)';
      _stampOrigLabelDom(th, label);
    });
    // 컴포넌트 (main 직속 자식)
    [...main.children].forEach((el) => {
      if (!el || el.nodeType !== 1) return;
      const tag = (el.tagName || '').toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'template' || tag === 'noscript') return;
      if (el.classList && el.classList.contains('scm-voc-added-grid')) return;
      if (!_isElVisibleStandalone(el)) return;
      // pickLabel 미러 — 첫 title element 의 텍스트 우선.
      const head = el.querySelector('.scm-card-title, .scm-page-section__title, .scm-page-head__title, h1, h2, h3, h4');
      let label = (head && head.textContent.trim()) || (el.getAttribute('aria-label') || el.title || '').trim();
      if (!label) label = (el.textContent || '').trim().replace(/\s+/g, ' ');
      if (label) _stampOrigLabelDom(el, label.slice(0, 40));
    });
  }
  function _applyGlobalLabels(doc, gl) {
    if (!gl) return;
    if (gl.filter && Object.keys(gl.filter).length) {
      doc.querySelectorAll('.scm-filter-bar .scm-filter-select[data-voc-orig-label]').forEach((el) => {
        const orig = _normLabel(el.getAttribute('data-voc-orig-label'));
        const v = orig && gl.filter[orig];
        if (!v) return;
        const labEl = el.querySelector('.scm-filter-select__label');
        if (labEl) labEl.textContent = v;
        const valEl = el.querySelector('.scm-filter-select__value');
        if (valEl && valEl !== labEl) valEl.textContent = v;
      });
    }
    if (gl.column && Object.keys(gl.column).length) {
      doc.querySelectorAll('.mp-table thead th[data-voc-orig-label]').forEach((cell) => {
        const orig = _normLabel(cell.getAttribute('data-voc-orig-label'));
        const v = orig && gl.column[orig];
        if (!v) return;
        const host = cell.querySelector(':scope > .cell-clamp, :scope > .cell-clamp-2') || cell;
        let textNode = null;
        for (const n of host.childNodes) {
          if (n.nodeType === 3 && n.textContent.trim()) { textNode = n; break; }
        }
        if (textNode) textNode.textContent = v;
        else host.insertBefore(doc.createTextNode(v), host.firstChild);
      });
    }
    if (gl.component && Object.keys(gl.component).length) {
      doc.querySelectorAll('[data-voc-orig-label]').forEach((el) => {
        if (el.matches('.scm-filter-select, .mp-table thead th')) return;
        const orig = _normLabel(el.getAttribute('data-voc-orig-label'));
        const v = orig && gl.component[orig];
        if (!v) return;
        const head = el.querySelector('.scm-card-title, .scm-page-section__title, .scm-page-head__title, h1, h2, h3, h4');
        if (!head) return;
        let textNode = null;
        for (const n of head.childNodes) {
          if (n.nodeType === 3 && n.textContent.trim()) { textNode = n; break; }
        }
        if (textNode) textNode.textContent = v;
        else head.insertBefore(doc.createTextNode(v), head.firstChild);
      });
    }
  }

  // ---- 추가 테이블 (1단/2단) inject — voc 의 applyAddedTables mirror ----
  function _buildAddedTableHTML_devexport(t) {
    const klass = `voc-added-table-${t.id}`;
    const cellStyle = 'min-width:120px;width:120px;padding:12px 16px;';
    const safeLabel = escapeHtml(t.label || '새 테이블');
    const colgroup = `<colgroup><col style="width:120px"/><col style="width:120px"/><col class="col-spacer" data-empty="true"/></colgroup>`;
    let thead;
    if (t.type === 'grouped') {
      thead = '<thead>'
        + '<tr class="group-row">'
        +   `<th colspan="2" style="${cellStyle}">${safeLabel} 그룹</th>`
        +   '<th class="col-spacer" data-empty="true" rowspan="2" aria-hidden="true"></th>'
        + '</tr>'
        + '<tr>'
        +   `<th class="col-auto" style="${cellStyle}"><div class="cell-clamp">컬럼 1</div></th>`
        +   `<th class="col-auto" style="${cellStyle}"><div class="cell-clamp">컬럼 2</div></th>`
        + '</tr>'
        + '</thead>';
    } else {
      thead = '<thead>'
        + '<tr>'
        +   `<th class="col-auto" style="${cellStyle}"><div class="cell-clamp">컬럼 1</div></th>`
        +   `<th class="col-auto" style="${cellStyle}"><div class="cell-clamp">컬럼 2</div></th>`
        +   '<th class="col-spacer" data-empty="true" aria-hidden="true"></th>'
        + '</tr>'
        + '</thead>';
    }
    const tbodyRow = '<tr>'
      +   `<td style="${cellStyle}">—</td>`
      +   `<td style="${cellStyle}">—</td>`
      +   '<td class="col-spacer" data-empty="true"></td>'
      + '</tr>';
    const tbody = `<tbody>${tbodyRow}${tbodyRow}${tbodyRow}</tbody>`;
    return `<section class="scm-page-section scm-voc-added-table ${klass}" id="voc-added-table-${t.id}">`
      +   `<div class="scm-page-section__title">${safeLabel}</div>`
      +   '<div class="mp-table-host">'
      +     '<div class="mp-table-scroll">'
      +       `<table class="mp-table">${colgroup}${thead}${tbody}</table>`
      +     '</div>'
      +   '</div>'
      + '</section>';
  }
  function _applyAddedTables(doc, a) {
    const list = (a.added && Array.isArray(a.added.tables)) ? a.added.tables : [];
    if (!list.length) return;
    const main = doc.querySelector('main') || doc.body;
    if (!main) return;
    list.forEach((t) => {
      const id = `voc-added-table-${t.id}`;
      if (doc.getElementById(id)) return;
      const tpl = doc.createElement('template');
      tpl.innerHTML = _buildAddedTableHTML_devexport(t);
      const node = tpl.content.firstElementChild;
      if (!node) return;
      main.appendChild(node);
    });
  }

  // ---- 추가 필터 / 컬럼 / 그룹 inject ----
  function _applyAddedFiltersColumnsGroups(doc, a) {
    // Filters
    const filterBar = doc.querySelector('.scm-filter-bar');
    const addedFilters = (a.added && a.added.filters) || [];
    if (filterBar && addedFilters.length) {
      const realChip = filterBar.querySelector('.scm-filter-select[data-mp-filter]:not(.scm-voc-added-filter)');
      const wrapper = (realChip && realChip.parentElement) || filterBar.firstElementChild || filterBar;
      const resetBtn = wrapper.querySelector(':scope > .scm-filter-reset-btn');
      addedFilters.forEach((f) => {
        const id = `voc-added-filter-${f.id}`;
        if (doc.getElementById(id)) return;
        const btn = doc.createElement('button');
        btn.id = id;
        btn.type = 'button';
        btn.className = 'scm-filter-select scm-voc-added-filter';
        btn.dataset.state = 'placeholder';
        btn.dataset.mpFilter = `voc-added-${f.id}`;
        btn.dataset.vocFilterType = f.type || 'single';
        btn.innerHTML = `
          <span class="scm-filter-select__label">${escapeHtml(f.label)}</span>
          <span class="scm-filter-select__value">${escapeHtml(f.label)}</span>
          <svg class="scm-filter-select__chev" viewBox="0 0 16 16"><path d="M3 5.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
        `;
        if (resetBtn && resetBtn.parentNode === wrapper) wrapper.insertBefore(btn, resetBtn);
        else wrapper.appendChild(btn);
      });
    }
    // Columns + groups
    const visibleTables = [...doc.querySelectorAll('.mp-table')].filter(_isElVisibleStandalone);
    const hostsByIdx = [];
    const _seenHosts = new Set();
    visibleTables.forEach((t) => {
      const host = t.closest('.mp-table-host') || t;
      if (_seenHosts.has(host)) return;
      _seenHosts.add(host);
      hostsByIdx.push({ host, tables: [...host.querySelectorAll('.mp-table')] });
    });
    const cellStyle = 'min-width:120px;width:120px;padding:12px 16px;';
    ((a.added && a.added.columns) || []).forEach((c) => {
      const id = `voc-added-col-${c.id}`;
      if (doc.getElementById(id)) return;
      const klass = `voc-added-col-${c.id}`;
      const ti = (typeof c.tableIdx === 'number' && c.tableIdx >= 0) ? c.tableIdx : 0;
      const target = hostsByIdx[ti] || hostsByIdx[0];
      if (!target) return;
      const allTables = target.tables;
      allTables.forEach((tbl) => {
        const thead = tbl.querySelector('thead');
        if (!thead) return;
        const trs = thead.querySelectorAll('tr');
        const colTr = trs[trs.length - 1];
        const groupTr = trs.length > 1 ? trs[0] : null;
        const th = doc.createElement('th');
        th.id = id;
        th.className = `col-auto scm-voc-added-col ${klass}`;
        th.innerHTML = '<div class="cell-clamp">' + escapeHtml(c.label) + '</div>';
        th.setAttribute('style', cellStyle);
        const colSpacer = colTr.querySelector('.col-spacer');
        colTr.insertBefore(th, colSpacer || null);
        if (groupTr) {
          const gth = doc.createElement('th');
          gth.className = `scm-voc-added-col ${klass}`;
          gth.setAttribute('style', cellStyle);
          const gSpacer = groupTr.querySelector('.col-spacer');
          groupTr.insertBefore(gth, gSpacer || null);
        }
      });
      allTables.forEach((tbl) => {
        const tbody = tbl.querySelector('tbody');
        if (!tbody) return;
        tbody.querySelectorAll('tr').forEach((tr) => {
          const td = doc.createElement('td');
          td.className = `scm-voc-added-col ${klass}`;
          td.textContent = '—';
          td.setAttribute('style', cellStyle);
          const tdSpacer = tr.querySelector('.col-spacer, [data-empty="true"]');
          tr.insertBefore(td, tdSpacer || null);
        });
      });
      allTables.forEach((tbl) => {
        tbl.querySelectorAll(':scope > colgroup').forEach((cg) => {
          if (cg.querySelector(`col.${klass}`)) return;
          const col = doc.createElement('col');
          col.className = `scm-voc-added-col ${klass}`;
          col.style.width = '120px';
          const spacerCol = cg.querySelector('col.col-spacer') || cg.lastElementChild;
          cg.insertBefore(col, spacerCol);
        });
      });
    });
    ((a.added && a.added.groups) || []).forEach((g) => {
      const gid = `voc-added-grp-${g.id}`;
      if (doc.getElementById(gid)) return;
      const lid = `voc-added-grp-${g.id}-leaf`;
      const gKlass = `voc-added-grp-${g.id}`;
      const lKlass = `voc-added-col-${g.id}-leaf`;
      const ti = (typeof g.tableIdx === 'number' && g.tableIdx >= 0) ? g.tableIdx : 0;
      const target = hostsByIdx[ti] || hostsByIdx[0];
      if (!target) return;
      const tablesInTarget = target.tables;
      const headTable = tablesInTarget.find((t) => t.querySelector('thead'));
      if (!headTable) return;
      const headTr = headTable.querySelectorAll('thead > tr');
      if (headTr.length < 2) return;
      tablesInTarget.forEach((tbl) => {
        const thead = tbl.querySelector('thead');
        if (!thead) return;
        const trs = thead.querySelectorAll('tr');
        if (trs.length < 2) return;
        const groupTr = trs[0];
        const leafTr  = trs[trs.length - 1];
        const gth = doc.createElement('th');
        gth.id = gid;
        gth.className = `scm-voc-added-col ${gKlass}`;
        gth.setAttribute('colspan', '1');
        gth.textContent = g.label;
        gth.setAttribute('style', cellStyle);
        const gSpacer = groupTr.querySelector('.col-spacer');
        groupTr.insertBefore(gth, gSpacer || null);
        const lth = doc.createElement('th');
        lth.id = lid;
        lth.className = `col-auto scm-voc-added-col ${lKlass}`;
        lth.innerHTML = '<div class="cell-clamp">' + escapeHtml(g.leafLabel || '항목 1') + '</div>';
        lth.setAttribute('style', cellStyle);
        const lSpacer = leafTr.querySelector('.col-spacer');
        leafTr.insertBefore(lth, lSpacer || null);
      });
      tablesInTarget.forEach((tbl) => {
        const tbody = tbl.querySelector('tbody');
        if (!tbody) return;
        tbody.querySelectorAll('tr').forEach((tr) => {
          const td = doc.createElement('td');
          td.className = `scm-voc-added-col ${lKlass}`;
          td.textContent = '—';
          td.setAttribute('style', cellStyle);
          const tdSpacer = tr.querySelector('.col-spacer, [data-empty="true"]');
          tr.insertBefore(td, tdSpacer || null);
        });
      });
      tablesInTarget.forEach((tbl) => {
        tbl.querySelectorAll(':scope > colgroup').forEach((cg) => {
          if (cg.querySelector(`col.${lKlass}`)) return;
          const col = doc.createElement('col');
          col.className = `scm-voc-added-col ${lKlass}`;
          col.style.width = '120px';
          const spacerCol = cg.querySelector('col.col-spacer') || cg.lastElementChild;
          cg.insertBefore(col, spacerCol);
        });
      });
    });
  }

  // ---- 추가 컴포넌트 (12-column grid) — voc 의 applyAddedComponents mirror ----
  // entry 는 { id, label, type, html, width } 또는 rowbreak sentinel { id, kind:'rowbreak' }.
  function _applyAddedComponentsGrid(doc, a) {
    const list = (a.added && a.added.components) || [];
    if (!list.length) return;
    const main = doc.querySelector('main') || doc.body;
    if (!main) return;
    let grid = doc.querySelector('.scm-voc-added-grid');
    if (!grid) {
      grid = doc.createElement('div');
      grid.className = 'scm-voc-added-grid';
      main.appendChild(grid);
    }
    list.forEach((c) => {
      const id = `voc-added-comp-${c.id}`;
      if (doc.getElementById(id)) return;
      const wrap = doc.createElement('div');
      wrap.id = id;
      // rowbreak sentinel — full-width line break, height 0.
      if (c.kind === 'rowbreak') {
        wrap.className = 'scm-voc-added-rowbreak';
        wrap.dataset.vocAddedCompId = c.id;
        wrap.style.gridColumn = '1 / -1';
        grid.appendChild(wrap);
        return;
      }
      wrap.className = 'scm-voc-added-comp';
      wrap.dataset.vocAddedCompId = c.id;
      wrap.dataset.vocAddedCompType = c.type || 'card';
      wrap.dataset.vocAddedCompLabel = c.label || '';
      const w = (typeof c.width === 'number' && c.width >= 1 && c.width <= 12) ? c.width : 12;
      wrap.style.gridColumn = `span ${w}`;
      wrap.dataset.vocCompWidth = String(w);
      wrap.innerHTML = c.html || '';
      grid.appendChild(wrap);
    });
    // grid CSS — voc 편집 화면과 동일. standalone 에선 hover 효과 없이 단순 그리드.
    if (!doc.getElementById('scm-voc-added-grid-css')) {
      const style = doc.createElement('style');
      style.id = 'scm-voc-added-grid-css';
      style.textContent = ''
        + '.scm-voc-added-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 12px; padding: 16px 0; }\n'
        + '.scm-voc-added-grid:empty { display: none; }\n'
        + '.scm-voc-added-comp { grid-column: span 12; min-width: 0; }\n'
        + '.scm-voc-added-rowbreak { height: 0; padding: 0; margin: 0; }\n';
      doc.head.appendChild(style);
    }
  }

  // ---- 라벨 오버라이드 ----
  function _applyFilterLabels(doc, a) {
    const labels = (a.labels && a.labels.filter) || {};
    Object.keys(labels).forEach((sel) => {
      let el; try { el = doc.querySelector(sel); } catch { return; }
      if (!el) return;
      const labEl = el.querySelector('.scm-filter-select__label');
      if (labEl) labEl.textContent = labels[sel];
      const valEl = el.querySelector('.scm-filter-select__value');
      if (valEl && valEl !== labEl) valEl.textContent = labels[sel];
    });
  }
  function _applyColumnLabels(doc, a) {
    const labels = (a.labels && a.labels.column) || {};
    Object.keys(labels).forEach((sel) => {
      let cells; try { cells = doc.querySelectorAll(sel); } catch { return; }
      cells.forEach((cell) => {
        const host = cell.querySelector(':scope > .cell-clamp, :scope > .cell-clamp-2') || cell;
        let textNode = null;
        for (const n of host.childNodes) {
          if (n.nodeType === 3 && n.textContent.trim()) { textNode = n; break; }
        }
        if (textNode) textNode.textContent = labels[sel];
        else host.insertBefore(doc.createTextNode(labels[sel]), host.firstChild);
      });
    });
  }

  // ---- native 컴포넌트 HTML override ----
  function _applyNativeComponentEdits(doc, a) {
    const edits = a.componentEdits || {};
    Object.keys(edits).forEach((sel) => {
      const ed = edits[sel];
      if (!ed || !ed.html) return;
      let el;
      try { el = doc.querySelector(sel); } catch { return; }
      if (!el) return;
      if (el.dataset && el.dataset.vocCompHash === _hashStr(ed.html)) return;
      try {
        el.outerHTML = ed.html;
        let newEl;
        try { newEl = doc.querySelector(sel); } catch {}
        if (newEl && newEl.dataset) newEl.dataset.vocCompHash = _hashStr(ed.html);
      } catch (_) {}
    });
  }

  // ---- top-level: 모든 apply 실행 ----
  // Phase 1 — main 의 모든 직속 자식에 voc-key 를 stamp.
  // voc 의 scanEditTargets 와 동일한 키 체계를 standalone 에서 재현해서
  // saved selector ([data-voc-key="comp-N"]) 가 매칭되게.
  function _stampVocKeysOnComponents(doc) {
    const main = doc.querySelector('main') || doc.body;
    if (!main) return;
    let compCounter = 0;
    [...main.children].forEach((el) => {
      if (!el || el.nodeType !== 1) return;
      const tag = (el.tagName || '').toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'template' || tag === 'noscript' || tag === 'link' || tag === 'meta') return;
      if (el.classList && el.classList.contains('scm-voc-added-grid')) return;
      if (!_isElVisibleStandalone(el)) return;
      if (!el.dataset.vocKey) el.dataset.vocKey = 'comp-' + compCounter;
      compCounter++;
    });
  }

  // Phase 2 — main 의 자식 순서 CSS `order` 로 제어. DOM 무손실.
  // standalone 도 voc 와 동일하게 자연 순서면 flex CSS 안 박고, 사용자가
  // reorder 했을 때만 main 을 flex column 으로 + style.order 부여.
  function _applyComponentOrder(doc, a) {
    const main = doc.querySelector('main');
    if (!main) return;
    const order = (a.componentOrder || []).slice();
    if (!order.length) return;
    // natural order = main 의 visual section 자식의 현재 voc-key 순서.
    const naturalOrder = [];
    [...main.children].forEach((el) => {
      if (!el || el.nodeType !== 1) return;
      const tag = (el.tagName || '').toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'template' || tag === 'noscript') return;
      if (el.classList && el.classList.contains('scm-voc-added-grid')) return;
      if (!_isElVisibleStandalone(el)) return;
      if (!el.dataset.vocKey) return;
      naturalOrder.push(`[data-voc-key="${el.dataset.vocKey}"]`);
    });
    // customized 판정
    let customized = order.length !== naturalOrder.length;
    if (!customized) {
      for (let i = 0; i < order.length; i++) {
        if (order[i] !== naturalOrder[i]) { customized = true; break; }
      }
    }
    if (!customized) return;
    // flex CSS inject (idempotent)
    if (!doc.getElementById('scm-voc-layout-css')) {
      const style = doc.createElement('style');
      style.id = 'scm-voc-layout-css';
      style.textContent = ''
        + 'main { display: flex !important; flex-direction: column !important; }\n'
        + 'main > * { flex: 0 0 auto !important; }\n';
      doc.head.appendChild(style);
    }
    [...main.children].forEach((el) => { el.style.order = ''; });
    let n = 1;
    order.forEach((sel) => {
      if (!sel) return;
      let el = null;
      try { el = main.querySelector(sel); } catch (_) {}
      while (el && el.parentElement !== main) el = el.parentElement;
      if (el && el.parentElement === main) el.style.order = String(n++);
    });
    [...main.children].forEach((el) => {
      if (!el.style.order) el.style.order = String(n++);
    });
  }

  function applyFullSnapshot(a) {
    if (!a) return;
    const doc = document;
    // 0) main 직속 자식에 comp-N voc-key stamp (Phase 1) + 원본 라벨 stamp.
    //    voc-key: saved [data-voc-key="comp-N"] selector 매칭.
    //    orig-label: cross-page 라벨 매칭 키.
    _stampVocKeysOnComponents(doc);
    _stampOrigLabelsForComponents(doc);
    // 1) 추가 DOM 인젝션 — 추가 테이블 먼저 (column/group 인젝션이 그 host 를
    //    타깃하기 위함) → 필터/컬럼/그룹 → 컴포넌트(grid).
    //    Native HTML override 가 element 를 outerHTML 로 바꿔 voc-key 를 잃을
    //    수 있으니 그 전에 실행.
    _applyAddedTables(doc, a);
    _applyAddedFiltersColumnsGroups(doc, a);
    _applyAddedComponentsGrid(doc, a);
    // 2) 라벨 오버라이드 — global 먼저 (원본라벨 매칭), per-page 가 위에 덮음.
    _applyGlobalLabels(doc, _loadGlobalLabels());
    _applyFilterLabels(doc, a);
    _applyColumnLabels(doc, a);
    // 3) Native HTML override — element 가 통째로 바뀌므로 (outerHTML 교체)
    //    아래 컴포넌트 reorder 보다 먼저 — reorder 는 새 DOM 위에 style.order 박음.
    _applyNativeComponentEdits(doc, a);
    // 4) Phase 2 — 컴포넌트 순서 (CSS order). reorder 안 했으면 no-op.
    //    Native HTML override 후에 실행해서 새 element 에 style.order 가 박힘.
    _stampVocKeysOnComponents(doc);   // override 가 voc-key 를 날렸을 수 있으니 재stamp
    _applyComponentOrder(doc, a);
  }

  function applyActiveVersionMinimal() {
    try {
      const versions = _loadVersions();
      const ver = _verEntryFor(versions, location.pathname);
      if (!ver || !ver.activeId) return;
      const active = ver.list && ver.list.find((v) => v.id === ver.activeId);
      const a = active && active.applied;
      if (!a) return;
      // 1) Hide CSS — only inject if hidden has entries.
      if (Array.isArray(a.hidden) && a.hidden.length) {
        // 모든 hidden 셀렉터를 main 안으로 scope — VOC scanEditTargets 가
        // main 만 스캔하므로 origin 도 main 내부. 글로벌로 적용하면 LNB /
        // topbar 등 페이지 chrome 까지 우연히 가릴 위험이 있어 명시적으로
        // main 자손으로 제한한다.
        const css = a.hidden.map((s) => `main ${s} { display: none !important; }`).join('\n')
          + '\nmain [data-voc-hidden="true"] { display: none !important; }'
          + '\nmain th[data-voc-hidden="true"], main td[data-voc-hidden="true"] { padding: 0 !important; border: 0 !important; width: 0 !important; min-width: 0 !important; max-width: 0 !important; }'
          + '\nmain col[data-voc-hidden="true"] { width: 0 !important; min-width: 0 !important; max-width: 0 !important; }'
          + '\nmain .mp-table thead .group-row th[data-voc-hidden="true"] { position: static !important; visibility: hidden !important; font-size: 0 !important; line-height: 0 !important; background: transparent !important; box-shadow: none !important; }';
        const style = document.createElement('style');
        style.id = 'scm-voc-version-hide';
        style.textContent = css;
        document.head.appendChild(style);
      }
      // 2) Stamp voc-keys + apply full snapshot once scm-table has finished
      //    splitting tables. scm-table runs its own DOMContentLoaded init;
      //    we may load before or after it, so retry briefly until either
      //    the API is attached or we time out.
      let attempts = 0;
      const tryApply = () => {
        const tables = [...document.querySelectorAll('.mp-table')];
        const hasApi = tables.some((t) => t._scmReorder);
        const hasThead = tables.some((t) => t.querySelector('thead'));
        // 페이지에 .mp-table 이 있다면 thead/api 대기. 없는 페이지(예: 일부
        // dashboard) 는 즉시 진행.
        if (tables.length) {
          if (!hasThead && attempts < 30) {
            attempts++;
            setTimeout(tryApply, 50);
            return;
          }
          if (!hasApi && attempts < 30) {
            attempts++;
            setTimeout(tryApply, 50);
            return;
          }
        }
        tables.forEach(_stampVocKeysOnTable);
        if (Array.isArray(a.hidden) && a.hidden.length) {
          _applyHiddenCellsForVersion(a.hidden);
        }
        // Full apply pipeline — added DOM, labels, native HTML overrides.
        applyFullSnapshot(a);
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryApply, { once: true });
      } else {
        tryApply();
      }
    } catch (e) {
      try { console.warn('[dev-export] applyActiveVersionMinimal failed', e); } catch (_) {}
    }
  }

  function onActionClick() {
    if (myRole !== 'super' && myRole !== 'admin') return;
    var finalId = _finalIdForPage();
    var versions = (typeof _loadVersions === 'function') ? _loadVersions() : null;
    var ver = versions && _verEntryFor ? _verEntryFor(versions, location.pathname) : null;
    var viewingId = ver && ver.activeId && (ver.list || []).some((v) => v.id === ver.activeId) ? ver.activeId : null;
    var viewingFinal = !!finalId && viewingId === finalId;
    // 이미 최종 확정된 버전을 보고 있으면 → 해제. 그 외엔 → 확정.
    if (viewingFinal) {
      if (typeof confirm === 'function' && !confirm('최종 확정을 해제하시겠습니까?\n다운로드 버튼이 비활성화되고 작업중 상태로 돌아갑니다.')) return;
      unfinalize();
    } else {
      confirmPage((window.SCM_USER && window.SCM_USER.email) || null);
    }
  }

  // ---------- refresh button states ----------
  function refresh() {
    if (!elDownload) return;
    const finalId = _finalIdForPage();
    const ok = isConfirmed();
    const meta = confirmed[pageKey()] || {};
    // 현재 보고 있는 버전이 finalId 와 같은지 — 같으면 버튼 비활성.
    const versions = (typeof _loadVersions === 'function') ? _loadVersions() : null;
    const ver = versions && _verEntryFor ? _verEntryFor(versions, location.pathname) : null;
    const viewingId = ver && ver.activeId && (ver.list || []).some((v) => v.id === ver.activeId) ? ver.activeId : null;
    const viewingFinal = !!finalId && viewingId === finalId;

    // download button
    elDownload.disabled = !ok;
    elDownload.title = ok
      ? `이 화면의 핸드오프 파일 다운로드 (${meta.by || '확정자 미상'})`
      : '최고 관리자가 최종확정해야 다운로드 가능합니다';

    // action button — '최종확정' / '✕ 확정 해제'.
    // super/admin: 어느 상태든 클릭 가능 (확정 OR 해제). 그 외 권한은 비활성.
    elAction.style.display = '';
    var isAdmin = (myRole === 'super' || myRole === 'admin');
    elAction.classList.toggle('is-revert', isAdmin && !!viewingFinal);
    elAction.classList.toggle('is-status', !isAdmin);
    elAction.classList.toggle('is-final', !!finalId && viewingFinal);
    if (isAdmin) {
      elAction.disabled = false;
      if (viewingFinal) {
        elAction.textContent = '✕ 확정 해제';
        elAction.title = `현재 최종 확정된 버전입니다${meta.by ? ' (' + meta.by + ')' : ''}\n클릭하면 작업중 상태로 되돌립니다.`;
      } else {
        elAction.textContent = '✓ 최종확정';
        elAction.title = finalId
          ? '현재 보고 있는 버전을 최종으로 확정합니다 (이전 최종 대체)'
          : '이 화면을 최종확정해 개발자가 다운로드할 수 있도록 합니다';
      }
    } else {
      // 개발자/PM/biz/pd — 항상 비활성, 상태만 표시
      elAction.disabled = true;
      if (finalId) {
        elAction.textContent = '✓ 최종 확정됨';
        elAction.title = `최고 관리자가 최종확정한 화면입니다${meta.by ? ' (' + meta.by + ')' : ''}`;
      } else {
        elAction.textContent = '작업중';
        elAction.title = '최고 관리자가 최종확정할 때까지 다운로드는 비활성입니다';
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
    // standalone 에서만 비공개 오버레이 검사. iframe(VOC 편집) 안에서는 노출
    // 토글과 무관하게 데모를 그대로 보여줘야 한다.
    if (!isInIframe()) applyPrivateOverlayIfNeeded();
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
