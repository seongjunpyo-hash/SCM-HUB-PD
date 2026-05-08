# 폴더 / 파일 구조

```
design-system/
├── README.md                      ← 시작 지점, 빠른 사용법
├── STRUCTURE.md                   ← (이 문서) 폴더 구조 설명
├── CONVENTIONS.md                 ← 네이밍 규칙, 토큰 계층 가이드
│
├── layer-desktop-tokens.json      ← 🔒 토큰 Source of Truth (DTCG 포맷)
├── layer-desktop-tokens.js        ← JS/TS export (JSON에서 파생)
├── layer-desktop.css              ← CSS 변수 + utility + component recipes
├── tailwind-preset.js             ← Tailwind 사용자용 preset
│
├── components/                    ← React 컴포넌트
│   ├── index.js                   ← Barrel export
│   ├── Button.jsx                 ← Button / IconButton / TextButton
│   ├── TextField.jsx              ← TextField / SearchField / TextArea
│   ├── Select.jsx                 ← Select / OptionList
│   ├── Checkbox.jsx               ← Checkbox / Radio / Switch (+ groups)
│   ├── Tag.jsx                    ← StatusTag / LabelTag / FilterTag / RemovableTag
│   ├── Tooltip.jsx
│   ├── Modal.jsx                  ← Modal / Dialog
│   ├── Drawer.jsx
│   ├── Banner.jsx
│   ├── Tab.jsx                    ← Tabs / Tab
│   ├── PageHeader.jsx
│   ├── Nav.jsx
│   ├── WorkspaceTabs.jsx
│   ├── Form.jsx                   ← Field / FormCard / FormRow
│   └── Table.jsx
│
├── docs/                          ← 상세 문서
│   ├── tokens.md                  ← 디자인 토큰 레퍼런스
│   ├── components.md              ← 컴포넌트 API 레퍼런스
│   └── consistency-audit.md       ← 일관성 이슈 + 수정 권장
│
└── index.html                     ← 모든 컴포넌트 라이브 데모 / 쇼케이스
```

---

## 파일별 역할 한 줄 요약

### 토큰 3종 — Source → Derived 관계

```
layer-desktop-tokens.json   (source of truth, 사람이 직접 수정)
        │
        ├─→ layer-desktop-tokens.js     (JS/TS 사용처)
        ├─→ layer-desktop.css §1–9       (브라우저 CSS 변수)
        └─→ tailwind-preset.js           (Tailwind 사용처)
```

> **현재는 3종 모두 수동 관리** 입니다. 향후 `style-dictionary` 등으로 자동 빌드 권장.
> 토큰 값을 바꿀 때는 **반드시 4개 파일을 동시에** 수정하세요. (`CONVENTIONS.md` 참고)

### `layer-desktop.css` 내부 섹션 (총 2002줄)

| 섹션 | 라인 | 내용 |
|---|---|---|
| §1 | 24–110 | Primitive: gray / blue / red / yellow / green / cyan / purple |
| §2 | 111–173 | Semantic: fg / bg / border / divider / focus |
| §3 | 174–205 | Typography: font-family / weight / size / line-height |
| §4 | 206–239 | Spacing & padding |
| §5 | 240–253 | Radius |
| §6 | 254–269 | Icon (size / stroke) |
| §7 | 270–279 | Shadow |
| §8 | 280–291 | Z-index |
| §9 | 292–586 | Component tokens (button, text-field, select, ...) |
| §10 | 590–627 | Utility classes (`.ld-text-*`, `.ld-root`) |
| §11 | 630–2002 | Component recipes (`.ld-btn`, `.ld-tf`, `.ld-modal`, ...) |

### `components/` 컨벤션

- 한 파일 = 하나의 *컴포넌트 계열* (예: `Tag.jsx` 안에 StatusTag, LabelTag, FilterTag, RemovableTag 4종)
- 모든 컴포넌트는 **CSS 클래스 기반** 스타일 (인라인 style은 최소화)
- props는 named export 함수의 인자로 정의, JSDoc으로 사용 예시 포함
- `default export`는 사용하지 않음 (PageHeader만 예외 — 향후 통일 권장)

### `index.html`

데모 페이지. `layer-desktop.css`만 로드해서 모든 컴포넌트의 정적 HTML 예시를 보여줍니다.
React 컴포넌트는 사용하지 않습니다 (CSS recipe만 사용).

---

## 향후 권장 리팩토링 (선택)

지금 구조로도 동작하지만, 규모가 더 커질 때는 다음 분리를 고려하세요.

```
design-system/
├── tokens/
│   ├── tokens.json
│   ├── tokens.js
│   └── tailwind-preset.js
├── styles/
│   ├── tokens.css            (§1–9 분리)
│   ├── base.css              (§10)
│   └── components.css        (§11)
├── components/
│   └── (현재와 동일)
└── examples/
    └── showcase.html         (현 index.html 이전)
```

이 변경 시 `tailwind-preset.js`의 import path와 `index.html`의 link href만 같이 갱신하면 됩니다.
