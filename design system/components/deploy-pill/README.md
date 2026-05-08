# scm-deploy-pill

데이터 리스트 셀 안 전개 상태 표시. pill (dot + 라벨) + chevron split 구조.

## Anatomy

```
scm-deploy-pill (--deployed / --undeployed / --partial)
├ scm-deploy-pill__pill (h28 칩, dot + 라벨)
│   ├ scm-deploy-pill__dot (8×8 색 dot)
│   └ 라벨 텍스트
└ scm-deploy-pill__chev (16×16 chevron-down 버튼)
```

## State variants

| 클래스 | pill bg | pill fg | dot |
|---|---|---|---|
| `--deployed` | `#E2F1FF` | `#245EFF` | `#245EFF` |
| `--undeployed` | `rgba(138,138,138,0.10)` | `#666` | `#999` |
| `--partial` | `#FEF3E2` | `#B7791F` | `#D97706` |

## Cell helper

부모 `<td>` 에 `scm-deploy-cell` 클래스 부착 시:
- `cursor: pointer` + hover 배경
- `is-open` 상태일 때 `__chev` 가 180° 회전

```html
<td class="scm-deploy-cell">
  <div class="scm-deploy-pill scm-deploy-pill--deployed">...</div>
</td>
```

## Behavior

`pointer-events: none` 가 pill 자체에 적용. 셀 전체가 클릭 영역, chevron 만 별도 인터랙션 (popover 트리거).

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.mp-deploy` + `.pill` + `.dot` + `.chev-btn` (+ is-deployed/is-undeployed/is-partial) | 무탠 / SKU 관리 / restock-request 리스트 |
