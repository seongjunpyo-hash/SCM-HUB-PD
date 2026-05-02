# scm-bulk-upload-modal

일괄 업로드 모달. 1024w 큰 모달, header/body/footer 구조. 자체 backdrop 포함.

## Anatomy

```
scm-bu-backdrop (rgba(0,0,0,0.32), z-index 90)
scm-bu-modal (1024w, centered, z-index 91)
├ scm-bu-header (border-bottom)
│   ├ h2 (제목)
│   └ scm-bu-close (32×32 × 아이콘)
├ scm-bu-body (overflow auto, gap 20)
│   ├ scm-bu-warning (collapsible, 주의사항)
│   │   └ scm-bu-warning__list > li (.is-critical)
│   ├ scm-bu-type-section (업로드 유형 + 템플릿)
│   │   └ scm-bu-type-row > scm-bu-type-label + scm-bu-type-controls
│   └ scm-bu-history-section (이력 테이블)
│       └ scm-bu-history-table
│           └ scm-bu-status-pill / scm-bu-result-group / scm-bu-result-dl
└ scm-bu-footer (top border, 우측 정렬)
```

## States

| 상태 | 설명 |
|---|---|
| `.is-open` (modal/backdrop) | 표시 |
| `.scm-bu-warning.is-collapsed` | 주의사항 list 숨김 + chev 회전 |
| `[data-state="processing/done/partial"]` (status pill) | 색상 |

## Status pill colors

| state | bg | fg |
|---|---|---|
| processing | `#E2F1FF` | `#245EFF` |
| done | `#ECFFEC` | `#1EA514` |
| partial | `#E6FFFB` | `#08979C` |

## API (vanilla)

```js
const m = SCM.bulkUploadModal.mount({
  modal: document.querySelector('.scm-bu-modal'),
  backdrop: document.querySelector('.scm-bu-backdrop'),
  onClose: () => {},
});
m.open();
m.close();
```

backdrop 클릭 / 닫기 버튼 / ESC → close.
warning 토글 자동 부착.

## Props (React)

`<BulkUploadModal>`:

| prop | type |
|---|---|
| `open` | boolean |
| `onClose` | () => void |
| `title` | string |
| `warningTitle` | string |
| `warningItems` | `Array<{ text, critical? }>` |
| `typeSection` | ReactNode (slot) |
| `historyRows` | `Array<{ no, statusLabel, statusState, type, file, result?, time, user }>` |
| `footer` | ReactNode |

추가 export: `<BulkUploadWarning>`, `<BulkUploadHistoryTable>` 개별 사용 가능.

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.bu-backdrop` + `.bu-modal` (+ `.bu-header`, `.bu-body`, `.bu-footer`) | 무탠 / SKU 관리 / restock-request |
| `.bu-warning` (+ head/list, `.is-critical`) | 모달 내부 |
| `.bu-type-section` (+ row/label/controls/template-btn) | 모달 내부 |
| `.bu-history-table` (+ status-pill, result-group, result-dl) | 모달 내부 |
| `.bu-radio` / `.bu-select` / `.bu-btn-secondary/-primary` | **외부 모듈로 대체**: `scm-radio scm-radio--sm`, `scm-select scm-select--bu`, `scm-button` / `scm-button--primary` |

## Note

기존의 `bu-radio`, `bu-select`, `bu-btn-*` 은 Stage 2 의 공통 모듈 (`scm-radio`, `scm-select`, `scm-button`) 로 대체. 본 모듈은 modal frame + warning + type-section 컨테이너 + history-table 만 책임.
