# scm-filter-popover

`scm-filter-select` 클릭 시 뜨는 옵션 popover. 4가지 mode 지원.

## Modes

| 클래스 | 용도 | 시각 |
|---|---|---|
| `--codeinput` | 코드 입력 (UID/SKU/바코드 등 다중) | 280w 292h, textarea + counter |
| `--list` | 다중 선택 (옵션 많음) | 260w 300max, 검색 + 체크박스 리스트 |
| `--list-single` | 단일 선택 (시즌 등) | auto w 300max, 체크 SVG 우측 |
| `--multi` | 코드입력 + 리스트 혼합 | auto w |

## Anatomy

```
scm-filter-popover-root (position fixed, z-index 200, is-open 시 표시)
└ scm-filter-popover (--codeinput / --list / --list-single / --multi)
    ├ scm-filter-popover__search          (list mode)
    │   └ scm-filter-popover__search-row > svg + input
    ├ scm-filter-popover__list-body       (list / list-single mode)
    │   └ scm-filter-popover__item-row
    │       └ scm-filter-popover__item (또는 --single)
    │           ├ pop-cb (다중 — 체크박스)
    │           ├ label
    │           └ check svg (단일)
    ├ scm-filter-popover__body            (codeinput mode)
    │   ├ scm-filter-popover__textarea > textarea
    │   └ scm-filter-popover__counter
    └ scm-filter-popover__footer
        ├ scm-filter-popover__reset
        └ scm-filter-popover__apply
```

## Item states

`data-selected="true"` — 다중: 검정 체크박스 + 회색 배경 / 단일: 우측 체크 SVG + 회색 배경.

## API (vanilla)

```js
const fp = SCM.filterPopover.mount(rootEl, {
  onClose: () => {},
});
fp.openAt(anchorEl, 'list');
fp.close();
```

anchor 위치 자동 계산 (오른쪽 넘침 보정 포함). 외부 클릭 + ESC → close.

## Props (React)

| prop | type |
|---|---|
| `open` | boolean |
| `mode` | `'codeinput' \| 'list' \| 'list-single' \| 'multi'` |
| `position` | `{ top, left }` |
| `items` | `[{ key, label, selected? }]` |
| `onItemToggle` | `(key) => void` |
| `searchQuery`, `onSearchChange` | string, (q) => void |
| `textValue`, `onTextChange` | string, (text) => void |
| `textMax` | number |
| `showFooter`, `resetLabel`, `applyLabel`, `applyDisabled`, `onReset`, `onApply` | footer 제어 |
| `onClose` | () => void |

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.mp-filter-popover-root` (+ `[data-pop-mode]`) + `.mp-filter-popover` (4 mode variants) + 모든 sub-elements | 4 데이터리스트 페이지 필터 popover |
