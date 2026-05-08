# scm-cell-input

mp-table 안에 있는 직접 입력 인풋. **엑셀 패턴**으로 동작 — 1번 클릭은 셀 선택만, 더블클릭/Enter/F2/타이핑 시작 시 편집 모드로 전환.

## 사용법

### 1. CSS / JS 로드

```html
<link rel="stylesheet" href="../components/cell-input/cell-input.css" />
<script src="../components/scm-table/scm-table.js"></script>
<script src="../components/cell-input/cell-input.js"></script>
```

### 2. 마크업

```html
<table class="mp-table is-cell-selectable">
  <tbody>
    <tr>
      <td>브랜드명</td>
      <td class="cell-input cell-numeric">
        <input type="number" value="1234" />
      </td>
    </tr>
  </tbody>
</table>
```

### 3. mount (mp-table init 후)

```javascript
SCMTable.init({ root: document });   // 먼저 mp-table cellSelection 활성화
SCM.cellInput.mount({
  scope: document,
  tableSelector: '.mp-table-scroll .mp-table',
  onChange: function (td, input, oldVal, newVal) {
    // 값 확정 시 호출 — 도메인 데이터 갱신
    console.log(td, oldVal, '→', newVal);
  },
});
```

## 인터랙션

| 입력 | 동작 |
|---|---|
| 1번 클릭 | 셀 선택만 (mp-table cellSelection 가 처리, 검은 inset 보더) |
| 드래그 | 다중 셀 선택 (mp-table 가 처리, Cmd+C TSV 복사 가능) |
| 더블클릭 | 편집 모드 진입 (input.focus + 텍스트 select) |
| Enter / F2 | (selected 상태) 편집 모드 진입 |
| 타이핑 (글자 키) | 편집 모드 진입 + 기존 값 → 새 값 시작 (엑셀 패턴) |
| Enter (편집 중) | 값 확정 + 다음 행 같은 컬럼으로 이동 |
| Esc (편집 중) | 값 원복 + 편집 모드 종료 |
| Tab / Shift+Tab | 다음/이전 입력 가능 셀 |
| 화살표 ↑↓←→ | 인접 입력 가능 셀로 selected 이동 |
| blur | 값 확정 + 편집 모드 종료 |

## 상태 클래스

- `td.cell-input` — 입력 셀 (디폴트 파랑 BG)
- `td.cell-input.cell-selected` — mp-table 가 부여 (선택됨)
- `td.cell-input.cell-active` — mp-table 가 부여 (포커스 셀, 검은 보더)
- `td.cell-input.is-editing` — 편집 모드 (흰 BG, input 활성)
- `td.cell-input[data-readonly="true"]` — 영구 readonly (편집 차단)
- `td.cell-input.is-changed` — 도메인 modifier (변경됨, 노란 BG)

## 디자인 토큰

| 토큰 | 값 | 용도 |
|---|---|---|
| `--ld-blue-bg-light` | `#E2F1FF` | 디폴트 입력 셀 BG (파랑 의미색) |
| `--ld-fg` | `#000` | 편집 시 inset 보더 |
| `--ld-bg` | `#fff` | 편집 모드 BG |

## 의존성

- `scm-table.css` / `scm-table.js` — `is-cell-selectable` 동작 (드래그 다중 선택, Cmd+C 복사)
- `layer-desktop.css` — 디자인 토큰
