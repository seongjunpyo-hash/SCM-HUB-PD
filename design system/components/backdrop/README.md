# scm-backdrop

오버레이 backdrop. 모달 / 드로어 / 팝오버 뒤의 어두운 배경 또는 외부 클릭 감지용 투명 영역.

## Files

- `backdrop.css` — 자가포함 스타일
- `backdrop.js` — vanilla factory (`window.SCM.backdrop.mount`)
- `backdrop.html` — canonical marker
- `backdrop.jsx` — React twin
- `README.md` — 이 문서

## Variants

| 클래스 | 설명 |
|---|---|
| (기본) | `rgba(0,0,0,0.32)` 어두운 dim |
| `scm-backdrop--transparent` | 투명 (팝오버 외부 클릭 dismissal 용) |

## States

| 클래스 | 설명 |
|---|---|
| `is-open` | 표시됨 (`display: block`) |

## CSS Variables

| 변수 | 기본값 | 설명 |
|---|---|---|
| `--scm-backdrop-z` | `80` | z-index. 모달/드로어 stacking 에 따라 오버라이드 |

## API (vanilla)

```js
const bd = SCM.backdrop.mount(document.getElementById('my-backdrop'), {
  transparent: false,
});
bd.open();
bd.close();
bd.toggle();          // 또는 toggle(true) / toggle(false)
bd.isOpen();          // boolean
bd.onClick(() => bd.close());
bd.destroy();         // 클래스 제거 + 인스턴스 해제
```

## Props (React)

| prop | type | default | 설명 |
|---|---|---|---|
| `open` | boolean | `false` | 표시 여부 |
| `transparent` | boolean | `false` | 투명 variant |
| `zIndex` | number | `80` | z-index 오버라이드 |
| `onClick` | `() => void` | — | 클릭 핸들러 (외부 dismissal) |
| `className` | string | — | 추가 클래스 |
| `style` | CSSProperties | — | 추가 스타일 |

## Used in (legacy → migration target)

| Legacy class | 사용처 | 마이그레이션 |
|---|---|---|
| `.mp-modal-backdrop` | `index.html`, `sku-management.html`, `editshop-restock-request.html`, `editshop-restock-status.html` | `scm-backdrop` (기본) |
| `.bu-backdrop` | bulk upload modal (모든 페이지) | `scm-backdrop` (zIndex=90) |
| `.sd-backdrop` | size detail drawer (`index.html`) | `scm-backdrop` (zIndex=50) |
| `.mp-af-backdrop` | all-filter drawer (모든 페이지) | `scm-backdrop` (zIndex=50) |
| `.mp-code-backdrop` | code popover (모든 페이지) | `scm-backdrop scm-backdrop--transparent` (zIndex=49) |

## Examples

### Vanilla

```html
<link rel="stylesheet" href="design-system/components/backdrop/backdrop.css">
<script src="design-system/components/backdrop/backdrop.js"></script>

<div id="modal-bd" class="scm-backdrop"></div>

<script>
  const bd = SCM.backdrop.mount(document.getElementById('modal-bd'));
  bd.onClick(() => bd.close());
  document.getElementById('open-btn').addEventListener('click', () => bd.open());
</script>
```

### React

```jsx
import Backdrop from './backdrop.jsx';
import './backdrop.css';

function MyModal({ open, onClose }) {
  return (
    <>
      <Backdrop open={open} onClick={onClose} />
      <div className="my-modal" style={{ display: open ? 'block' : 'none' }}>
        ...
      </div>
    </>
  );
}
```
