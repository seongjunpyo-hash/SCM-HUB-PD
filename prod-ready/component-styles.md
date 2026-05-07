# SCM Hub 컴포넌트 스타일 레퍼런스 (production 적용용)

Production 의 React + Emotion CSS-in-JS 코드 안에 그대로 복사해서 쓸 수 있는 styled-component 레시피 모음.

`scm-tokens.css` 를 entry 에 import 했다는 가정 (그래야 `var(--scm-*)` 작동). 토큰 안 쓰고 hardcode 로 가도 OK — 그 경우 토큰 값은 [scm-tokens.css](./scm-tokens.css) 참고.

---

## 버튼

### Default (outlined) — 검색 / 일괄 업로드 같이 보조 액션
```js
const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  height: var(--scm-button-height);                /* 44px */
  min-width: 80px;
  padding: var(--scm-button-padding-y) var(--scm-button-padding-x);  /* 10px 16px */

  background: var(--scm-bg-default);                /* #fff */
  color: var(--scm-fg-default);                     /* #242424 */
  border: 1px solid var(--scm-border-strong);       /* 1px solid #000 */
  border-radius: var(--scm-radius);                 /* 4px */

  font-family: inherit;
  font-size: var(--scm-font-size-md);                /* 15px */
  font-weight: var(--scm-font-weight-medium);        /* 500 */
  line-height: 1.36;

  cursor: pointer;
  white-space: nowrap;
  transition: background-color var(--scm-transition), border-color var(--scm-transition);

  &:hover:not(:disabled) {
    background: var(--scm-bg-low);                  /* #FAFBFC */
  }
  &:disabled {
    background: var(--scm-bg-disabled);              /* rgba(138,138,138,.1) */
    color: var(--scm-fg-disabled);                   /* rgba(0,0,0,.2) */
    border-color: var(--scm-border-low);             /* #EBEBEB */
    cursor: not-allowed;
  }
`;
```

### Primary (filled) — SKU 단건 등록 같이 주요 액션
```js
const PrimaryButton = styled(Button)`
  background: var(--scm-bg-primary);                /* #242424 */
  color: var(--scm-fg-on-primary);                  /* #fff */
  border-color: var(--scm-bg-primary);              /* #242424 */

  &:hover:not(:disabled) {
    background: var(--scm-bg-primary-hover);        /* #000 */
    border-color: var(--scm-bg-primary-hover);
  }
`;
```

### Ghost — 텍스트만 (취소 같은 보조)
```js
const GhostButton = styled.button`
  height: var(--scm-button-height);
  padding: var(--scm-button-padding-y) var(--scm-button-padding-x);
  background: transparent;
  border: 0;
  color: var(--scm-fg-default);
  font-size: var(--scm-font-size-md);
  font-weight: var(--scm-font-weight-medium);
  border-radius: var(--scm-radius);
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--scm-bg-low);
  }
`;
```

### Mini action — 행 안의 작은 버튼
```js
const MiniAction = styled.button`
  height: 28px;
  padding: 0 8px;
  background: var(--scm-bg-default);
  color: var(--scm-fg-default);
  border: 1px solid var(--scm-border-default);
  border-radius: var(--scm-radius);
  font-size: var(--scm-font-size-sm);                /* 13px */
  font-weight: var(--scm-font-weight-medium);
  cursor: pointer;
`;
```

---

## 링크 / Code link

```js
const Link = styled.a`
  color: var(--scm-fg-default);                     /* #242424 */
  text-decoration: none;
  font-size: var(--scm-font-size-md);                /* 15px */
  font-weight: var(--scm-font-weight-regular);

  &:hover { text-decoration: underline; }
`;

const CodeLink = styled(Link)`
  font-feature-settings: 'tnum';                    /* tabular nums */
  font-variant-numeric: tabular-nums;
`;
```

---

## 페이지 헤더

```js
const PageHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 0 16px;
`;

const PageTitle = styled.h1`
  font-size: var(--scm-font-size-2xl);              /* 24px */
  font-weight: var(--scm-font-weight-heavy);         /* 700 */
  color: var(--scm-fg-strong);                       /* #000 */
  margin: 0;
  line-height: 1.3;
`;

const PageSub = styled.p`
  font-size: var(--scm-font-size-sm);
  color: var(--scm-fg-muted);
  margin: 4px 0 0;
`;

const PageActions = styled.div`
  display: flex;
  gap: 8px;
`;
```

---

## 입력 / 드롭다운

```js
const Input = styled.input`
  height: var(--scm-input-height);                  /* 44px */
  padding: 0 var(--scm-input-padding-x);             /* 0 12px */
  border: 1px solid var(--scm-border-default);       /* #E0E0E0 */
  border-radius: var(--scm-radius);
  font-family: inherit;
  font-size: var(--scm-font-size-base);              /* 14px */
  color: var(--scm-fg-default);
  background: var(--scm-bg-default);

  &:hover { border-color: var(--scm-fg-strong); }
  &:focus {
    outline: none;
    border-color: var(--scm-fg-strong);
    box-shadow: 0 0 0 2px rgba(36, 36, 36, 0.08);
  }
  &:disabled {
    background: var(--scm-bg-disabled);
    color: var(--scm-fg-disabled);
    border-color: var(--scm-border-low);
    cursor: not-allowed;
  }
  &::placeholder { color: var(--scm-fg-low); }
`;

const Select = styled(Input).attrs({ as: 'select' })``;
```

---

## 상태 칩 (status chip)

```js
const StatusChip = styled.span<{ tone: 'ok'|'warn'|'err'|'info' }>`
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: var(--scm-radius);
  font-size: var(--scm-font-size-xs);                /* 11px */
  font-weight: var(--scm-font-weight-bold);          /* 600 */

  ${({ tone }) => ({
    ok:   `background: var(--scm-status-success-bg); color: var(--scm-status-success);`,
    warn: `background: var(--scm-status-warning-bg); color: var(--scm-status-warning);`,
    err:  `background: var(--scm-status-error-bg);   color: var(--scm-status-error);`,
    info: `background: var(--scm-status-info-bg);    color: var(--scm-status-info);`,
  })[tone]}
`;
```

---

## 필터 칩 / 셀렉트 칩

```js
const FilterSelect = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 44px;
  padding: 0 12px;
  background: var(--scm-bg-default);
  color: var(--scm-fg-default);
  border: 1px solid var(--scm-border-default);       /* #E0E0E0 */
  border-radius: var(--scm-radius);
  font-size: var(--scm-font-size-sm);                /* 13px */
  font-weight: var(--scm-font-weight-regular);
  cursor: pointer;

  &[data-state="filled"] { font-weight: var(--scm-font-weight-medium); }
  &:hover { border-color: var(--scm-fg-strong); }
`;
```

---

## 정보 banner

```js
const InfoBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--scm-status-info-bg);
  color: var(--scm-status-info);
  border: 1px solid var(--scm-status-info);
  border-radius: var(--scm-radius);
  font-size: var(--scm-font-size-base);
`;
```

---

## 빠른 참고 — 핵심 값

| 항목 | 값 |
|---|---|
| Body 폰트 | `Pretendard, notokr, ...` 14px / 400 |
| 본문 텍스트 | `#242424` (`--scm-fg-default`) |
| Primary BG | `#242424` (`--scm-bg-primary`) |
| Default 보더 | `1px solid #000` (`--scm-border-strong`) |
| 옅은 보더 | `#E0E0E0` (`--scm-border-default`) |
| Hover BG | `#FAFBFC` (`--scm-bg-low`) |
| 버튼 크기 | h44 / padding 10px 16px / radius 4px / font 15px·500 |
| Disabled | bg `rgba(138,138,138,.1)` / text `rgba(0,0,0,.2)` / border `#EBEBEB` |

토큰 전체 목록 → [scm-tokens.css](./scm-tokens.css)
