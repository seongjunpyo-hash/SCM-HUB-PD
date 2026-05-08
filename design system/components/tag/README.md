# scm-tag

h28 인라인 태그. 시즌 / 도메인 메타 / 상태 라벨 등.

## Variants

| 클래스 | 배경 |
|---|---|
| (기본) | `rgba(0,0,0,0.05)` |
| `scm-tag--blue` | `#E2F1FF` |
| `scm-tag--green` | `#ECFFEC` |
| `scm-tag--gray` | `rgba(138,138,138,0.10)` |

## Layout

`scm-tag-stack` 으로 여러 태그를 4px gap 으로 가로 묶음 가능.

## Props (React)

| prop | type |
|---|---|
| `variant` | `'blue' \| 'green' \| 'gray'` |
| `children` | ReactNode |

## Used in (legacy → migration target)

| Legacy class | 사용처 | 마이그레이션 |
|---|---|---|
| `.mp-season .tag` | 시즌 태그 (4개 리스트 페이지) | `scm-tag` (`scm-tag-stack` 컨테이너) |
| `.er-tag` (`--blue/--green/--gray`) | restock-status (초도/재발주/자동/수동) | `scm-tag scm-tag--<variant>` |
| `.sd-tags` 의 자식 태그 | sku-detail 옵션 태그들 | `scm-tag` (`scm-tag-stack` 컨테이너) |

## Note

상태 칩 (`er-status-chip`, `er-kind-chip`, `er-forecast-chip`) 등 도메인 특화 칩은 `scm-tag` 위에 별도 컴포넌트로 추출 예정 (Stage 10).
