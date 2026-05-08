# scm-side-drawer

우측 슬라이드 드로어. head + body + footer 슬롯. 자체 backdrop 포함.

## Anatomy

```
scm-side-drawer-backdrop (rgba(0,0,0,0.32))
scm-side-drawer (translateX 100% → 0, 0.25s)
├ scm-side-drawer__head (padding 24 24 0)
│   ├ scm-side-drawer__head-meta (좌측 메타 텍스트)
│   └ scm-side-drawer__close (32×32, × 아이콘)
├ scm-side-drawer__body (padding 0 24 24, scroll)
└ scm-side-drawer__footer (padding 16 24, top border, gap 8)
```

## Sizes

| 클래스 | width |
|---|---|
| `scm-side-drawer--sm` | 480 |
| `scm-side-drawer--md` | 640 |
| `scm-side-drawer--lg` | 848 (기본 — `--lg` 안 붙여도 동일) |

## API (vanilla)

```js
const dr = SCM.sideDrawer.mount(drawerEl, {
  backdrop: backdropEl,        // optional
  size: 'lg',
  onClose: () => {},
});
dr.open();
dr.close();
```

`.scm-side-drawer__close` 클릭 + backdrop 클릭 → 자동 close.

## Props (React)

| prop | type |
|---|---|
| `open` | boolean |
| `onClose` | () => void |
| `size` | `'sm' \| 'md' \| 'lg'` |
| `ariaLabel` | string |
| `headMeta` | ReactNode |
| `footer` | ReactNode |
| `children` | ReactNode (body) |

`open` 토글 시 transition 적용. 애니메이션 끝난 후에야 DOM 에서 제거 (외부에서 제어 불필요).

## Used in (legacy → migration target)

| Legacy | 사용처 | 마이그레이션 |
|---|---|---|
| `.sd-drawer` + `.sd-backdrop` (+ head/close/body/footer) | 무탠 사이즈 개별 설정 drawer | `scm-side-drawer scm-side-drawer--lg` |
| `.mp-af-drawer` + `.mp-af-backdrop` (좌측 슬라이드, 14px+ 폭, 다른 위치) | 4 데이터리스트 페이지 "전체 필터" 드로어 | **별도 모듈** (Stage 7 `scm-filter-drawer`) — 좌측 슬라이드, top:64 / left:LNB-width 같은 다른 정렬 |

## Note

`scm-filter-drawer` 가 별도 모듈인 이유: filter drawer 는 좌측에서 LNB 옆으로 슬라이드, top:64 (topbar 아래 시작), 다른 z-index 정책. side-drawer 는 우측 풀하이트.
