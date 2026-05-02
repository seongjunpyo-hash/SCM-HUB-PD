# scm-confirm-modal

확인 모달. 단건/일괄 작업 확인용. 자가포함 (자체 backdrop 포함).

## Anatomy

```
scm-confirm-modal-backdrop (rgba(0,0,0,0.32))
scm-confirm-modal (centered, 360-420px)
├ scm-confirm-modal__title (16/700)
├ scm-confirm-modal__desc (15/400, innerHTML 허용 → accent strong 등)
└ scm-confirm-modal__actions
    ├ scm-confirm-modal__cancel
    └ scm-confirm-modal__confirm.primary
```

## API (vanilla)

```js
SCM.confirmModal.open({
  title: 'n건 스토어 전개 여부 변경',
  descHtml: `... <strong class="accent">'전개중'</strong> ...`,
  cancelLabel: '취소',
  confirmLabel: '변경',
  onConfirm: () => apiCall(),
  onCancel: () => {},
});
SCM.confirmModal.close();
```

backdrop 클릭 / 취소 버튼 / ESC 키 모두 onCancel + close.
확인 버튼 → onConfirm + close.

## Props (React)

| prop | type |
|---|---|
| `open` | boolean |
| `title` | string |
| `description` | string |
| `descriptionHtml` | string (innerHTML) |
| `cancelLabel` | string |
| `confirmLabel` | string |
| `onCancel` | () => void |
| `onConfirm` | () => void |

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.mp-modal-backdrop` + `.mp-modal` (+ `h3` / `.desc strong.accent` / `.actions` / `.actions .primary`) | 4개 데이터리스트 페이지 (전개 여부 변경 / 코드 복사 / SKU 단건 등록 등 확인) |
