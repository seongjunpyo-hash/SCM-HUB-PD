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
        background: #1A1A1A; color: #fff;
        border: 1px solid #1A1A1A; border-radius: 6px;
        font-family: -apple-system, BlinkMacSystemFont, 'Pretendard Variable', Pretendard, sans-serif;
        font-size: 12px; font-weight: 600;
        cursor: pointer; white-space: nowrap;
        transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
      }
      .scm-dev-export-action-btn:hover:not(:disabled) { background: #000; }
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
    `;
    document.head.appendChild(s);
  }

  // ---------- inject buttons ----------
  let elDownload, elAction;
  function injectButtons() {
    // Skip when this demo is embedded in an iframe (e.g. inside the VOC
    // viewer). Handoff is a standalone-demo affordance only.
    try { if (window.parent && window.parent !== window) return; } catch (_) { return; }
    const right = document.querySelector('.scm-topbar__right');
    if (!right) return;
    if (document.querySelector('.scm-dev-export-group')) return;

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
    // Cancel the profile's own margin-left:auto so only the group absorbs
    // the leftover horizontal space — keeps group flush against profile
    // on the right edge instead of flexbox splitting the gap.
    right.style.marginLeft = '0';
    refresh();
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
    if (window.SCM_USER) { myRole = window.SCM_USER.role || null; refresh(); }
  }
  function bootAuth() {
    document.addEventListener('scm:auth-ready', (e) => {
      myRole = (e.detail && e.detail.user && e.detail.user.role) || null;
      refresh();
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
