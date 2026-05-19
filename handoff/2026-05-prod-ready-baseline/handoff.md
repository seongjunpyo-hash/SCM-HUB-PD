# Handoff — prod-ready 디자인 시스템 베이스라인 → scm-hub-fe

| 항목 | 내용 |
|---|---|
| 작업 | SCM Hub 디자인 시스템 베이스라인(토큰 + AG Grid override)을 운영 코드베이스에 적용 |
| 적용 대상 | `scm-hub-fe` (React 18 + TS + Vite + Emotion + AG Grid Enterprise v33) |
| 출처 | 이 repo 의 [`prod-ready/`](../../prod-ready/) — 두 CSS 파일은 그 시점 스냅샷 |
| 작성일 | 2026-05-15 |
| 범위 | 디자인 시스템 베이스라인만. 개별 데모 페이지 포팅은 별도 라운드 |

---

## 1. 목적

데모(`SCM-HUB-PD`)의 디자이너 결정사항을 운영 코드베이스 `scm-hub-fe` 에 **시각 레이어**로 입힌다. 기능 변경은 없고, 디자인 토큰과 AG Grid 테이블 톤만 SCM Hub 디자인 시스템에 맞춘다. 이후 개별 페이지를 포팅할 때 이 토큰/스타일을 기반으로 작업하게 된다.

## 2. 무엇이 바뀌나 (시각 효과)

- AG Grid 테이블의 sky blue 액센트 → 모노톤 검정
- 헤더 배경 sky tone → 흰색 + 상단 1.5px 검은 라인 (데모 `mp-table` 톤)
- 행 높이 28px → 44px, 헤더 높이 32px → 48px
- 폰트 → Pretendard, 셀 폰트 12px → 13px
- 줄무늬(zebra) 제거
- 전역에 `--scm-*` 디자인 토큰 CSS 변수 추가 (색/타이포/사이징/간격) — 아직 아무 컴포넌트도 사용하지 않으므로 그 자체로는 화면 변화 없음. 이후 styled-component 에서 점진 채택.

## 3. 변경된 파일

### 신규 (2)

| 파일 | 설명 |
|---|---|
| `src/styles/scm-tokens.css` | `:root` 디자인 토큰 변수. 순수 additive |
| `src/styles/ag-grid-balham-overrides.css` | balham 테마 CSS 변수 override |

### 수정 (3) — 각 파일에 import 1줄씩 추가

| 파일 | 추가 내용 |
|---|---|
| `src/main.tsx` | `import '@/styles/scm-tokens.css'` |
| `src/components/tableV2/GridTableV2.tsx` | `import '@/styles/ag-grid-balham-overrides.css'` |
| `src/components/table/GridTable.tsx` | `import '@/styles/ag-grid-balham-overrides.css'` |

정확한 diff 는 같은 폴더의 [`changes.diff`](./changes.diff) 참고.

## 4. 적용 방법

> 권장: `scm-hub-fe` 의 작업 규칙대로 **새 브랜치**에서 적용한다 (예: `chore/design-system-baseline`).

1. `files/scm-tokens.css`, `files/ag-grid-balham-overrides.css` 를 `scm-hub-fe/src/styles/` 로 복사한다.
2. `changes.diff` 를 적용하거나, 수동으로 import 3줄을 추가한다 (위 표 참고).
3. `npm run dev` 로 기동 후 §6 QA 체크리스트를 확인한다.
4. 커밋 전 `npm run build-check` 를 실행한다.

## 5. prod-ready README 와 다른 점 — 중요

[`prod-ready/README.md`](../../prod-ready/README.md) 는 AG Grid CSS 가 **entry(`main.tsx`)에서 import** 된다고 가정하고, override 도 `main.tsx` 에 넣으라고 안내한다. 하지만 `scm-hub-fe` 는 다르다:

- `scm-hub-fe` 는 `ag-grid.css` / `ag-theme-balham.css` 를 `GridTableV2.tsx` 와 `GridTable.tsx` **컴포넌트 안에서** import 한다.
- CSS 번들 순서는 모듈 평가 순서를 따른다. entry(`main.tsx`)의 import 가 컴포넌트 import 보다 먼저 평가된다.
- 따라서 override 를 `main.tsx` 에 넣으면 balham 이 **나중에** 와서 override 를 덮어쓴다 → 무효화.

그래서 이 핸드오프에서는:

- **`scm-tokens.css`** → `main.tsx` (entry). 토큰은 `:root` 변수 정의일 뿐이라 순서 무관, entry 가 적합.
- **`ag-grid-balham-overrides.css`** → `GridTableV2.tsx` / `GridTable.tsx` 의 **balham import 바로 다음 줄**. 순서 보장.

`build-check` 의 prettier import sort 가 override import 를 `@/styles` 그룹(import 블록 맨 끝)으로 옮길 수 있으나, 그래도 balham(third-party 그룹)보다는 뒤이므로 CSS 순서는 항상 유지된다.

## 6. 검증

### 이미 완료한 것 (정적 검증)

- 두 CSS 파일 문법: 중괄호/괄호 밸런스 OK
- override 의 모든 `var(--scm-*)` 가 fallback 을 가지며, 참조하는 `--scm-*` 14종이 모두 `scm-tokens.css` 에 정의돼 있음을 교차 확인
- `@/` alias 가 `vite.config.ts` / `tsconfig.json` 에서 `src/` 로 해석됨 확인
- 수정한 3개 TS 파일의 import 구조 정상
- balham CSS importer 가 위 2개 컴포넌트뿐임을 확인 (누락 없음)

### dev팀/로컬에서 해야 할 것 (런타임 QA)

> 샌드박스 제약으로 full build·런타임 QA 는 미실시. QA 페이지는 **SKU 관리(`src/pages/products/sku-management`)** 권장 — prod-ready 컴포넌트 레시피가 이 페이지 요소 기준.

- [ ] `npm run dev` 정상 기동, 콘솔 에러 없음
- [ ] SKU 관리 목록 테이블: 행 높이 ~44px, 헤더 흰 배경 + 상단 검은 1.5px 라인, 줄무늬 없음
- [ ] 셀 폰트 Pretendard 13px
- [ ] 행 선택 시 sky blue 가 아닌 옅은 모노톤 하이라이트
- [ ] 정렬·필터·체크박스·가상 스크롤 등 **기능은 그대로** (시각만 변경)
- [ ] cell renderer 깨짐 없음 — 특히 숫자 우측정렬, 말줄임(ellipsis), 커스텀 셀
- [ ] 셀 안 링크 색상 `#242424` + underline
- [ ] 다른 테이블 페이지(재고 이동, 입고 등) 회귀 확인
- [ ] `npm run build-check` 통과

## 7. 리스크 / 주의사항

- **`.ag-cell { display: flex; align-items: center }`** — override 파일이 셀 기본 레이아웃을 flex 로 바꾼다. 가장 영향 범위가 큰 룰. 커스텀 cell renderer, 말줄임, 우측정렬 셀에서 어긋남이 생길 수 있으니 QA 시 집중 확인.
- **행/헤더 높이 변경** (`--ag-row-height` 28→44, `--ag-header-height` 32→48) — 한 화면에 보이는 행 수, 페이지네이션 표시, 주변 레이아웃에 영향.
- **기존 커스텀 balham 스타일과 공존** — `GridTableV2.tsx` 의 `.ag-theme-balham .<validation-error-cell>`, `grid_styles.tsx` 의 `&.ag-theme-balham`, `ResizableContents.tsx` 의 `.ag-theme-balham` 룰이 이미 존재. override 는 대부분 CSS 변수 방식이라 공존하지만, 명시적 룰(헤더 보더 등)은 상호작용 가능.
- **AG Grid v33 theming** — 현재 `provideGlobalGridOptions({ theme: 'legacy' })` 로 레거시(CSS 파일 기반) 테마를 쓰므로 이 override 가 적용된다. 추후 v33 의 신규 JS theming API 로 마이그레이션하면 이 override 파일은 재작성이 필요하다.

## 8. 롤백

- **전체 원복**: import 3줄 제거 + `src/styles/` 의 CSS 2파일 삭제.
- **테이블 시각만 원복**: `GridTableV2.tsx` / `GridTable.tsx` 의 override import 만 제거. 토큰(`scm-tokens.css`)은 남겨도 아무도 참조하지 않으면 무해.

## 9. 패키지 구성

```
2026-05-prod-ready-baseline/
├── handoff.md                       ← 이 문서
├── changes.diff                     ← 수정 3개 파일 unified diff
└── files/
    ├── scm-tokens.css               ← src/styles/ 로 복사
    └── ag-grid-balham-overrides.css ← src/styles/ 로 복사
```
