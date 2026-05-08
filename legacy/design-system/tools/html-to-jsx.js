/**
 * html-to-jsx.js — HTML → JSX 단순 변환 스크립트 (skeleton)
 *
 * 사용:
 *   node html-to-jsx.js input.html > output.jsx
 *
 * 본 스크립트는 핵심 매핑만 처리. production 변환은
 * `html-to-jsx` / `htmltojsx` 라이브러리 권장.
 *
 * 변환 매핑:
 *   class="..." → className="..."
 *   for="..." → htmlFor="..."
 *   tabindex="0" → tabIndex={0}
 *   onclick="..." → onClick={() => { ... }}
 *   <input ...> → <input ... />  (void elements self-close)
 *   인라인 style="padding:16px;color:#000;" → style={{ padding: 16, color: '#000' }}
 *   주석 <!-- --> → {/* *\/}
 *
 * 한계:
 *   - 페이지의 동적 부분 (인라인 <script>) 은 변환 안 함 — 사람이 useState/useEffect 로 분리
 *   - 컴포넌트 매핑 (<div class="scm-modal"> → <Modal>) 안 함 — 사람이 import 추가
 */

const fs = require('fs');

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'source', 'track', 'wbr',
]);

const ATTR_RENAMES = {
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  readonly: 'readOnly',
  maxlength: 'maxLength',
  minlength: 'minLength',
  contenteditable: 'contentEditable',
  spellcheck: 'spellCheck',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  rowspan: 'rowSpan',
  colspan: 'colSpan',
  onclick: 'onClick',
  onchange: 'onChange',
  oninput: 'onInput',
  onsubmit: 'onSubmit',
  onkeydown: 'onKeyDown',
  onkeyup: 'onKeyUp',
  onfocus: 'onFocus',
  onblur: 'onBlur',
};

function camelize(s) {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function convertInlineStyle(styleStr) {
  const out = {};
  styleStr.split(';').forEach(decl => {
    const [k, v] = decl.split(':').map(s => s && s.trim());
    if (!k || !v) return;
    const key = camelize(k);
    // 숫자 + px → 숫자
    if (/^-?\d+(\.\d+)?px$/.test(v)) {
      out[key] = parseFloat(v);
    } else {
      out[key] = v;
    }
  });
  return JSON.stringify(out).replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'");
}

function convertHtml(html) {
  let s = html;

  // 1. 주석 변환: <!-- foo --> → {/* foo */}
  s = s.replace(/<!--([\s\S]*?)-->/g, (_, body) => `{/*${body}*/}`);

  // 2. 속성 변환 (class, for, tabindex, on*, ...)
  s = s.replace(/\b([a-z-]+)=("([^"]*)"|'([^']*)')/gi, (match, name, _full, dq, sq) => {
    const value = dq != null ? dq : sq;
    const lower = name.toLowerCase();
    if (ATTR_RENAMES[lower]) {
      const newName = ATTR_RENAMES[lower];
      // tabindex 같은 숫자 속성은 expression 으로
      if (newName === 'tabIndex' && /^-?\d+$/.test(value)) {
        return `${newName}={${value}}`;
      }
      // onClick 등 핸들러는 함수 expression — 단순 처리
      if (/^on[A-Z]/.test(newName)) {
        return `${newName}={() => { ${value.replace(/'/g, "\\'")} }}`;
      }
      return `${newName}="${value}"`;
    }
    // 인라인 style
    if (lower === 'style') {
      return `style={${convertInlineStyle(value)}}`;
    }
    return match; // unchanged
  });

  // 3. void elements self-close
  VOID_ELEMENTS.forEach(tag => {
    const re = new RegExp(`<${tag}\\b([^>]*?)(?<!/)>`, 'gi');
    s = s.replace(re, `<${tag}$1 />`);
  });

  return s;
}

// ---- Main ----
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node html-to-jsx.js <input.html> [> output.jsx]');
    process.exit(1);
  }
  const input = fs.readFileSync(args[0], 'utf8');
  const output = convertHtml(input);
  process.stdout.write(output);
}

module.exports = { convertHtml, convertInlineStyle };
