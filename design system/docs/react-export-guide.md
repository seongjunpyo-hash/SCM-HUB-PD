# React Export Guide

> SCM 시뮬레이션 시스템의 마지막 단계. 모듈 기반 HTML 페이지를 React 페이지로 변환해 개발팀 핸드오프.

## 시뮬레이션 시스템 흐름

```
PRD 입력
   ↓
PRD 분석 → 페이지 구조 도출 (Plan agent)
   ↓
templates/<type>.html 복사
   ↓
필요한 모듈 import + placeholder 치환
   ↓
와이어프레임 / 실사이트 (HTML/CSS/JS) — 사용자 검토 / 수정 루프
   ↓
React export (이 단계)
   ↓
페이지 .jsx + 컴포넌트 .jsx (이미 모듈마다 존재) 묶음 다운로드
   ↓
개발팀에 zip 으로 전달
```

## 변환 원칙

각 모듈은 이미 `<name>.jsx` (React twin) 을 가지고 있음. 핵심은:
- **동일 className / DOM 구조 / data-attr** 유지 → 변환은 1:1 매핑
- **인라인 마크업 (HTML 페이지) → JSX 컴포넌트** — 기계적 치환 가능

## 변환 매핑 표

### 1. 마크업 → JSX

| HTML | JSX | 비고 |
|---|---|---|
| `<div class="scm-card">...` | `<div className="scm-card">...` | `class` → `className` |
| `<input type="text">` | `<input type="text" />` | self-closing 필수 |
| `<button onclick="...">` | `<button onClick={...}>` | event 이름 camelCase |
| `<svg viewBox="...">` | 동일 | SVG 도 JSX 처리 가능 |
| `<label for="x">` | `<label htmlFor="x">` | reserved word 회피 |
| `tabindex="0"` | `tabIndex={0}` | camelCase + 숫자 expression |
| `aria-checked="true"` | 동일 (string) 또는 `aria-checked={true}` | aria-/data- 는 그대로 가능 |

### 2. 인라인 style

```html
<div style="padding:16px;background:#fff;">
```
→
```jsx
<div style={{ padding: 16, background: '#fff' }}>
```

(`px` 단위는 숫자, 그 외는 문자열)

### 3. SCM 모듈 사용

각 모듈의 `<name>.jsx` 를 import 해서 사용:

```jsx
import Button from '../design-system/components/button/button.jsx';
import '../design-system/components/button/button.css';
import Modal from '../design-system/components/confirm-modal/confirm-modal.jsx';
import '../design-system/components/confirm-modal/confirm-modal.css';

function MyPage() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal
        open={open}
        title="확인"
        descriptionHtml="<strong class='accent'>변경</strong>하시겠습니까?"
        onConfirm={() => { saveData(); setOpen(false); }}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
```

### 4. 페이지 데이터 / 상태

HTML 페이지에서 인라인 `<script>` 안에 있던 데이터 (예: `const ROWS = [...]`) / 상태 관리 로직은 React component 의 `useState` / `useEffect` 로 변환:

```jsx
function MutanPage() {
  const [rows, setRows] = useState(ROWS);
  const [filterCount, setFilterCount] = useState(3);
  // ...
}
```

### 5. 글로벌 싱글톤 (toast / confirmModal / codePopover / deployPopover) 처리

vanilla 의 `SCM.toast.show(...)` 같은 글로벌 호출은 React 의 imperative API (Provider + Context) 패턴으로 바꿔야:

```jsx
// 옵션 a: 라이브러리 (예: react-hot-toast)
import toast from 'react-hot-toast';
toast.success('저장 완료');

// 옵션 b: 자체 ToastProvider + useToast hook
const { showToast } = useToast();
showToast({ variant: 'success', title: '저장 완료' });
```

`scm-toast` 의 `<ToastStack>` + `<Toast>` 컴포넌트는 이미 React twin 으로 제공됨 — useState 로 큐 관리.

## 자동 변환 스크립트 (skeleton)

> 본격적인 변환 도구는 별도 작성 필요. 아래는 핵심 변환 규칙 골격.

```js
// design-system/tools/html-to-jsx.js (skeleton)
const replacements = [
  [/\bclass="/g, 'className="'],
  [/\bfor="/g, 'htmlFor="'],
  [/\btabindex="/g, 'tabIndex="'],
  [/\bonclick="/g, 'onClick="'],
  [/\bonchange="/g, 'onChange="'],
  // self-closing
  [/<(input|img|br|hr|meta|link|area|base|col|embed|source|track|wbr)([^>]*?)>/g, '<$1$2 />'],
  // ... (광범위한 변환은 jsxify 같은 라이브러리 활용 권장)
];

function convertHtmlToJsx(html) {
  let jsx = html;
  for (const [from, to] of replacements) jsx = jsx.replace(from, to);
  // 인라인 style / 동적 expression 등은 별도 처리
  return jsx;
}
```

실용적으로는 [`html-to-jsx`](https://www.npmjs.com/package/html-to-jsx) 또는 [`htmltojsx`](https://github.com/reactjs/react-magic) 라이브러리 활용 권장.

## 페이지 변환 절차

1. **HTML 페이지 → JSX 페이지 1차 자동 변환** (위 매핑 적용)
2. **인라인 `<script>` 의 데이터 / 함수 → useState / useEffect 로 추출**
3. **모듈 마크업 (`<div class="scm-modal">...`) → 모듈 컴포넌트 (`<Modal>...`)** 로 치환
4. **글로벌 싱글톤 호출 → React Context 또는 라이브러리** 로 교체
5. **빌드 / 테스트 / 배포 패키지 작성** (Vite / Next.js 등)

## 핸드오프 패키지 구성

```
sku-register-2026-05.zip
├ pages/
│   └ SkuRegister.jsx
├ components/             ← design-system 모듈의 .jsx + .css
│   ├ button/
│   ├ input/
│   ├ form-row/
│   └ ...
├ tokens/
│   └ layer-desktop.css
├ README.md               ← 개발팀이 통합하는 가이드
└ package.json            ← React 18+, 의존성 표시
```

## 검증 / 시각 회귀

JSX 변환 후 시각 회귀 검증:
- HTML 페이지 스크린샷 vs JSX 페이지 스크린샷 (Playwright 등)
- 시각 차이 발견 시 → React twin 컴포넌트의 className / DOM 구조 확인

## 권장 도구 스택 (개발팀 핸드오프 시)

- **빌드**: Vite (가벼움) 또는 Next.js (SSR/SSG 필요 시)
- **State**: 작은 페이지는 useState/useReducer. 큰 앱은 Zustand / Redux Toolkit
- **Toast**: react-hot-toast / sonner / 자체 Provider
- **Form**: React Hook Form + Zod
- **Test**: Vitest + Playwright (시각 회귀)

## Migration 우선순위 (Stage 12 / 13)

1. 가장 단순한 페이지부터 (sku-detail) → 패턴 검증
2. 폼 페이지 (sku-register) — useState 패턴 검증
3. 데이터 리스트 페이지 4개 — 가장 복잡 (필터 / 테이블 / 모달 / 드로어 stack)
4. 대시보드 — KPI / 차트 (Chart.js 통합)
5. 네비게이션 드로어 — Provider 형태로 (모든 페이지에서 호출 가능)

## 한계 / 알려진 이슈

- **vanilla 모듈의 글로벌 싱글톤** (toast, confirmModal 등) → React 변환 시 Provider 패턴 도입 필요
- **scm-table** 의 인터랙션 (sticky thead 분리, Excel-like 셀 selection, resize 핸들) → React 에서는 별도 라이브러리 (react-table / TanStack Table) 권장
- **filter-popover 의 4 modes** → React 에서는 mode 별 컴포넌트로 분리하는 게 더 자연스러울 수 있음 (현재 단일 컴포넌트 유지)

## 다음 단계

이 가이드는 변환 **방법론**까지만 정의. 실제 자동 변환 도구 (CLI 스크립트) 작성은 시뮬레이션 시스템의 production 단계에서.

본 시점 (시스템 구축) 에서는:
- React twin (`<name>.jsx`) 이 모든 모듈에 존재 ✓
- 페이지 템플릿 (templates/*.html) 5종 존재 ✓
- 변환 가이드 (이 문서) 존재 ✓

다음 phase (Stage 12 풀 마이그레이션 + 실제 React export 도구 작성) 시 이 문서가 reference.
