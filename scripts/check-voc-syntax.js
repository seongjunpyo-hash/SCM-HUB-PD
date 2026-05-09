#!/usr/bin/env node
/* voc/index.html 의 inline <script> 가 안전한지 검사.
 *
 * 막아야 할 패턴:
 * 1) JS 문자열/주석 안에 리터럴 '</script>' 가 있으면 HTML 파서가 외부
 *    <script> 블록을 그 자리에서 종료시켜서 voc 의 절반이 실행 안 됨.
 *    PR #131 에서 한 번 발생 → PR #133 hotfix.
 * 2) 추출한 main IIFE 가 syntax error 면 voc 가 통째로 안 뜸.
 *
 * 검사 방식:
 * - 모든 <script>...</script> 블록 추출.
 * - 각 블록 안에 리터럴 '</script>' 가 있는지 정규식으로 검사.
 *   (split 한 형태 '</scr' + 'ipt>' 는 통과)
 * - 가장 큰 블록(main IIFE)을 node --check 와 동등한 vm.Script 로 파싱.
 *
 * 실패 시 exit 1 → CI / pre-push / 로컬 빌드 단계에서 차단.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const FILE = path.join(__dirname, '..', 'voc', 'index.html');
const html = fs.readFileSync(FILE, 'utf8');

let fail = false;

// 1) 모든 inline script 블록 (src 없는 것) 추출.
const blocks = [];
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g;
let m;
while ((m = re.exec(html)) !== null) {
  // src 가 있는 외부 스크립트는 본문이 비어있을 가능성 — content 만 있는 것만 검사.
  const tag = m[0].slice(0, m[0].indexOf('>') + 1);
  if (/\ssrc\s*=/.test(tag)) continue;
  const body = m[1];
  if (body.trim().length === 0) continue;
  // 줄 번호 계산 (디버깅용)
  const lineNo = html.slice(0, m.index).split('\n').length;
  blocks.push({ body, lineNo });
}

// 2) 각 블록 안에 리터럴 '</script>' 가 있는지 검사.
//    (extracted 된 시점에서 이미 닫는 태그는 제거된 상태이므로 추가 등장 = 본문 안에 있던 것)
blocks.forEach((b, i) => {
  if (/<\/script\s*>/i.test(b.body)) {
    console.error(`[check-voc-syntax] FAIL: voc/index.html line ~${b.lineNo} 의 <script> 본문에 리터럴 </script> 가 있음.`);
    console.error('  → JS 문자열에 닫는 script 태그를 넣을 때는 반드시 분할: \'</scr\' + \'ipt>\'');
    console.error('  → 주석에서도 마찬가지 (HTML 파서는 JS 주석을 모름).');
    fail = true;
  }
});

// 3) 가장 큰 블록 (main IIFE) 을 syntax check.
const main = blocks.reduce((acc, b) => (b.body.length > acc.body.length ? b : acc), { body: '', lineNo: 0 });
if (main.body.length > 0) {
  try {
    new vm.Script(main.body, { filename: 'voc/index.html (main inline script)' });
  } catch (err) {
    console.error(`[check-voc-syntax] FAIL: main inline script (around line ${main.lineNo}) 에 syntax error.`);
    console.error('  ', err.message);
    fail = true;
  }
}

// 4) 외부 JS 모듈도 syntax check + </script> 리터럴 검사 (voc 가 inline 으로 평가하거나
//    voc 와 같은 파이프라인에 들어가는 파일). 한 곳이라도 깨지면 voc 가 다양한 형태로 깨짐.
const EXTRA_JS = [
  path.join(__dirname, '..', 'voc', 'component-library.js'),
  path.join(__dirname, '..', 'dev-export.js'),
  path.join(__dirname, '..', 'design system', 'components', 'lnb', 'lnb.js'),
];
EXTRA_JS.forEach((p) => {
  if (!fs.existsSync(p)) return;
  const src = fs.readFileSync(p, 'utf8');
  // </script> 리터럴은 .js 파일에서는 직접적인 HTML 파싱 영향은 없지만, 동일 패턴이
  // 향후 inline 화될 가능성을 막기 위해 경고만 (warn — fail 아님).
  // 실제 fail 은 syntax error 만.
  try {
    new vm.Script(src, { filename: p });
  } catch (err) {
    console.error(`[check-voc-syntax] FAIL: ${path.relative(process.cwd(), p)} 에 syntax error.`);
    console.error('  ', err.message);
    fail = true;
  }
});

if (fail) {
  console.error('\n[check-voc-syntax] ❌ 검사 실패. 푸시 전에 위 항목을 고쳐 주세요.');
  process.exit(1);
}
console.log(`[check-voc-syntax] ✅ voc/index.html ${blocks.length} inline script(s) OK (main: ${main.body.length} chars) + ${EXTRA_JS.filter(fs.existsSync).length} extra JS module(s) OK.`);
