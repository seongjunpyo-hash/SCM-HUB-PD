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
  function doDownload() {
    if (!isConfirmed()) return;
    const slug = pageSlug();
    const Comp = pascal(slug) + 'Page';
    triggerDownload(`${Comp}.jsx`,       generateJsx(),  'text/jsx;charset=utf-8');
    setTimeout(() => {
      triggerDownload(`${slug}.spec.md`, generateSpec(), 'text/markdown;charset=utf-8');
    }, 250);
  }

  // ---------- modal (download confirm) ----------
  function openModal() {
    if (!isConfirmed()) return;
    if (document.querySelector('.scm-dev-export-backdrop')) return;
    const slug = pageSlug();
    const Comp = pascal(slug) + 'Page';
    const title = pageTitle();
    const assets = listExternalAssets();
    const root = findContentRoot();
    const components = inventoryScmComponents(root);
    const meta = confirmed[pageKey()] || {};

    const bd = document.createElement('div');
    bd.className = 'scm-dev-export-backdrop';
    bd.innerHTML = `
      <div class="scm-dev-export-modal" role="dialog" aria-label="개발자 다운로드">
        <header class="scm-dev-export-modal__head">
          <span class="scm-dev-export-modal__icon">📥</span>
          <div class="scm-dev-export-modal__titles">
            <strong>개발자 다운로드</strong>
            <small>${escapeHtml(title)} · /demo/${escapeHtml(slug)}.html</small>
          </div>
          <button class="scm-dev-export-modal__close" type="button" aria-label="닫기">×</button>
        </header>
        <div class="scm-dev-export-modal__body">
          <div class="scm-dev-export-modal__pill scm-dev-export-modal__pill--ok">
            ✓ 화면 확정${meta.by ? ' · ' + escapeHtml(meta.by) : ''}
          </div>
          <p class="scm-dev-export-modal__lede">
            현재 화면의 <b>main 영역만</b> (GNB / LNB 제외) 추출해 두 파일을 다운로드합니다.
          </p>
          <div class="scm-dev-export-modal__files">
            <div class="scm-dev-export-modal__file">
              <code>${escapeHtml(Comp)}.jsx</code>
              <span>React 컴포넌트 — HTML→JSX 기본 변환, 인라인 핸들러는 제거됨</span>
            </div>
            <div class="scm-dev-export-modal__file">
              <code>${escapeHtml(slug)}.spec.md</code>
              <span>스펙 문서 — 의존성 (${assets.css.length} CSS / ${assets.js.length} JS) · 컴포넌트 ${components.length}종 · TODO 체크리스트</span>
            </div>
          </div>
          <ul class="scm-dev-export-modal__todo">
            <li>데이터 fetch / 상태 관리 / 이벤트 핸들러는 자동 추출에서 제외 — 직접 연결</li>
            <li>권한 검사 (super / admin / biz / pm / dev / pd) 와이어업 필요</li>
            <li>디자인 시스템 CSS 의 React 프로젝트 이전 방식 결정</li>
          </ul>
        </div>
        <footer class="scm-dev-export-modal__foot">
          <button class="scm-dev-export-btn-ghost"   type="button" data-act="cancel">취소</button>
          <button class="scm-dev-export-btn-primary" type="button" data-act="download">📥 두 파일 다운로드</button>
        </footer>
      </div>
    `;
    document.body.appendChild(bd);
    const close = () => { try { document.body.removeChild(bd); } catch (_) {} };
    bd.addEventListener('click', (e) => { if (e.target === bd) close(); });
    bd.querySelector('.scm-dev-export-modal__close').addEventListener('click', close);
    bd.querySelector('[data-act="cancel"]').addEventListener('click', close);
    bd.querySelector('[data-act="download"]').addEventListener('click', () => { doDownload(); close(); });
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
      .scm-dev-export-modal__icon {
        width: 36px; height: 36px; flex-shrink: 0;
        display: inline-flex; align-items: center; justify-content: center;
        background: #F5F7FA; border-radius: 8px;
        font-size: 18px;
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
    const ver = versions[location.pathname];
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
    const ver = versions[location.pathname];
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
    const page = location.pathname;
    const ver = versions[page];
    if (!ver || !ver.list || !ver.list.length) return;
    const v = ver.list.find((x) => x.id === versionId);
    if (!v) return;
    if (ver.activeId === versionId) {
      if (elVersionWrap) elVersionWrap.classList.remove('is-open');
      return;
    }
    ver.activeId = versionId;
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
    const page = location.pathname;
    const ver = versions[page];
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
  function applyActiveVersionMinimal() {
    try {
      const versions = _loadVersions();
      const ver = versions[location.pathname];
      if (!ver || !ver.activeId) return;
      const active = ver.list && ver.list.find((v) => v.id === ver.activeId);
      const a = active && active.applied;
      if (!a || !Array.isArray(a.hidden) || !a.hidden.length) return;
      const css = a.hidden.map((s) => `${s} { display: none !important; }`).join('\n')
        + '\n[data-voc-hidden="true"] { display: none !important; }'
        + '\nth[data-voc-hidden="true"], td[data-voc-hidden="true"] { padding: 0 !important; border: 0 !important; width: 0 !important; min-width: 0 !important; max-width: 0 !important; }'
        + '\ncol[data-voc-hidden="true"] { width: 0 !important; min-width: 0 !important; max-width: 0 !important; }';
      const style = document.createElement('style');
      style.id = 'scm-voc-version-hide';
      style.textContent = css;
      document.head.appendChild(style);
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
