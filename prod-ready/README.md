# SCM Hub Design System — production-ready

**개발자용 — production 코드에 5분 안에 적용 가능한 최소 셋.**

이 폴더의 파일을 production repo 에 그대로 복사 + import 만 추가하면 SCM Hub 디자인시스템 시각이 적용됩니다. Demo 폴더 (디자이너의 vision) 와 분리돼 있어서 production 작업에 필요한 것만 골라 가져갈 수 있어요.

---

## 📦 포함 파일

| 파일 | 용도 | 적용 비용 |
|---|---|---|
| **[scm-tokens.css](./scm-tokens.css)** | 디자인 토큰 (color/font/sizing CSS 변수) | 1 import + ~5분 |
| **[ag-grid-balham-overrides.css](./ag-grid-balham-overrides.css)** | AG Grid 테이블을 SCM Hub 톤으로 | 1 import + 1분 |
| **[component-styles.md](./component-styles.md)** | Emotion styled-component 레시피 | 컴포넌트별 5~15분 |

---

## 🚀 적용 5단계

### 1단계 · 파일 복사 (1분)

`prod-ready/` 의 두 CSS 파일을 production 의 `src/styles/` (또는 동등한 위치) 로 복사:

```
production-repo/
└── src/
    └── styles/
        ├── scm-tokens.css                  ← 복사
        └── ag-grid-balham-overrides.css    ← 복사
```

### 2단계 · entry 에 import (30초)

`src/main.tsx` (또는 `src/index.tsx`) 에 아래 두 줄 추가. AG Grid base CSS 다음에 와야 함:

```js
// src/main.tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

import './styles/scm-tokens.css';                    // ← 추가
import './styles/ag-grid-balham-overrides.css';      // ← 추가 (AG Grid CSS 다음에)
```

여기까지만 해도 **AG Grid 테이블은 즉시 SCM Hub 톤** 으로 바뀝니다 (sky blue 액센트 → 모노톤, 행 높이 28px → 44px, Pretendard 폰트).

### 3단계 · 토큰 사용 (점진)

기존 styled-component 의 hardcoded 값을 토큰으로 점진 교체:

```diff
const SearchButton = styled.button`
- padding: 10px 16px;
- background: #fff;
- color: rgb(36, 36, 36);
- border: 1px solid #000;
- border-radius: 4px;
- height: 44px;
- font-size: 15px;
- font-weight: 500;
+ padding: var(--scm-button-padding-y) var(--scm-button-padding-x);
+ background: var(--scm-bg-default);
+ color: var(--scm-fg-default);
+ border: 1px solid var(--scm-border-strong);
+ border-radius: var(--scm-radius);
+ height: var(--scm-button-height);
+ font-size: var(--scm-font-size-md);
+ font-weight: var(--scm-font-weight-medium);
`;
```

기능은 동일, **나중에 디자인 변경 시 한 곳에서만 수정** 가능.

### 4단계 · 새 컴포넌트는 component-styles.md 참고 (필요할 때)

새 버튼/입력/칩 추가할 때 [component-styles.md](./component-styles.md) 의 레시피 그대로 복사:

```js
// component-styles.md 의 Primary 버튼 레시피 그대로 복사
const PrimaryBtn = styled.button`
  background: var(--scm-bg-primary);
  color: var(--scm-fg-on-primary);
  ...
`;
```

### 5단계 · QA (선택)

기존 페이지가 시각적으로 깨지지 않았는지 확인. AG Grid override 가 영향이 큰 부분 (테이블) 이라 그 부분 위주로 점검.

---

## ❓ FAQ

### Q. 기존 production 디자인을 그대로 두고 일부만 적용 가능?
A. **네**. 토큰 파일은 import 만 해두고, styled-component 안에서 `var(--scm-*)` 안 쓰면 영향 없음. 점진 마이그레이션 가능.

### Q. AG Grid override 가 기존 테이블을 망가뜨리진 않을까?
A. AG Grid 의 **CSS 변수만 override** 하므로 기능 (정렬·필터·virtualization 등) 은 그대로. 시각만 바뀜. 만약 시각 변경이 부담되면 `ag-grid-balham-overrides.css` import 제거하면 즉시 원래대로.

### Q. Demo 폴더 (`design system/`) 와 차이?
A.
- **Demo** = 디자이너 vision. `scm-button` `mp-table` 같은 자체 클래스로 와이어프레임 도구·prototype 용.
- **prod-ready** = 디자이너 vision 을 production 코드 (Emotion + AG Grid) 에 직접 적용 가능한 형태로 변환.
- 둘 다 **같은 토큰** (#242424, 4px, 44px 등) 을 공유 — 시각 일관성 보장.

### Q. 새 토큰 추가하고 싶음.
A. `scm-tokens.css` 에 `--scm-*` 변수 추가 후 demo 측 (`design system/layer-desktop.css`) 도 동기화.

### Q. AG Grid 가 아닌 다른 테이블 라이브러리도 비슷한 override 가능?
A. 라이브러리가 CSS 변수 기반이면 가능 (예: TanStack Table 은 unstyled, 자체 styling 자유). 별도 override 파일이 필요할 수 있음.

---

## 📋 체크리스트 (진행 상황)

- [ ] `scm-tokens.css` 복사
- [ ] `ag-grid-balham-overrides.css` 복사
- [ ] entry 에 import 2줄 추가
- [ ] AG Grid 테이블 시각 변경 확인
- [ ] (선택) styled-component hardcoded 값 → 토큰 점진 마이그레이션
- [ ] (선택) QA 회귀 테스트

---

## 🔗 관련

- 디자이너 vision (참고용 wireframe / prototype): [`design system/`](../design%20system/)
- 토큰 검증 데이터 (production F12 dump): 디자이너에게 문의
- 시뮬레이터 (PRD → 와이어프레임 자동 생성): [`design system/simulator/`](../design%20system/simulator/)
