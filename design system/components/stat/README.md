# scm-stat

stats bar 안에서 사용하는 단일 카운트 라벨. "전체 500" 처럼 라벨 + 숫자.

## Variants

| 클래스 | num 색 | 비고 |
|---|---|---|
| `--all` | 검정 | 좌측 padding 0 |
| `--deployed` | `#245EFF` | 클릭 가능 (cursor pointer) |
| `--undeployed` | `#666` | 클릭 가능 |
| `--selected` | `#245EFF` | "선택 N" — padding 좌 0 |

## Helpers

- `scm-stat-divider` — 3×3 점 (#CCCCCC)

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.mp-stat`, `.mp-stat--all/--deployed/--undeployed/--selected` (+ `.label`, `.num`) | 4 데이터리스트 페이지 stats bar |
| `.mp-stat-divider` | 동일 |
