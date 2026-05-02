# scm-toast

우상단 토스트 시스템. stack 컨테이너에 쌓이면서 슬라이드 인/아웃, 일정 시간 후 자동 dismiss.

## Variants

| 클래스 | 아이콘 색 |
|---|---|
| `scm-toast--success` | `#22C55E` 초록 |
| `scm-toast--info` | `#3B82F6` 파랑 |
| `scm-toast--critical` | `#EF4444` 빨강 |

## Behavior

- 페이지에 stack 컨테이너 (`scm-toast-stack`) 1개 자동 마운트 (없으면 생성)
- 토스트는 위에서 아래로 쌓임, 8px gap
- 슬라이드 인 220ms, 슬라이드 아웃 220ms
- 기본 duration 3000ms (0 또는 음수면 자동 dismiss 비활성)

## API (vanilla)

```js
SCM.toast.show({
  variant: 'success',     // 'success' | 'info' | 'critical'
  title: '저장 완료',
  desc: '변경사항이 적용됐습니다.',
  duration: 3000,         // ms (0 이면 무한)
  iconRef: 'ic-checkCircle-filled', // 커스텀 아이콘 ref (선택)
});

SCM.toast.setContainer(el);   // 커스텀 stack 컨테이너
SCM.toast.clear();            // 모든 토스트 제거
```

토스트 인스턴스에서 직접 dismiss:
```js
const t = SCM.toast.show({ ... });
t.dismiss();
```

## React

```jsx
import { ToastStack } from './toast.jsx';
import './toast.css';

function App() {
  const [items, setItems] = useState([]);
  function showToast(t) {
    setItems([...items, { id: Date.now(), duration: 3000, ...t }]);
  }
  function removeToast(id) {
    setItems(items.filter(i => i.id !== id));
  }
  return (
    <>
      <ToastStack items={items} onRemove={removeToast} />
      <button onClick={() => showToast({ variant: 'success', title: '저장 완료' })}>
        Save
      </button>
    </>
  );
}
```

## Used in (legacy → migration target)

| Legacy | 사용처 | 마이그레이션 |
|---|---|---|
| `.toast-stack`, `.toast` (+`.toast--success/info/critical`) | `index.html` (현재 무탠만) | `scm-toast` — 모든 페이지로 확산 |
| `showToast({ variant, title, desc })` JS API | `index.html` 인라인 함수 | `SCM.toast.show(...)` |

## Migration note

현재 `showToast` 는 `index.html` 안에서만 정의됨. 다른 페이지에서도 호출 가능하도록 `scm-toast.js` 를 모든 페이지에서 import. 기존 호출 사이트는 `showToast(...)` → `SCM.toast.show(...)` 로 1:1 치환.
