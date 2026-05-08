# scm-card

컨테이너 카드. 대시보드 / 폼 / 상세 페이지의 콘텐츠 블록.

## Anatomy

```
scm-card (또는 --gray)
├ scm-card-head (head 패턴 1: head 영역)
│   ├ scm-card-title
│   └ scm-card-link (옵션)
└ scm-card-body (또는 --flush)

또는 (폼 카드 패턴 2):
scm-card (--gray)
├ scm-card-title (--lg)
├ scm-card-section
├ scm-card-divider
└ scm-card-section (--padded)
```

## Variants

| 클래스 | 톤 | radius |
|---|---|---|
| (기본) | white | 8 |
| `scm-card--gray` | `#F8F9FC` | 4 |

## Body / Section modifiers

| 클래스 | 효과 |
|---|---|
| `scm-card-body` | padding 20 24 |
| `scm-card-body--flush` | padding 0 (차트/테이블 풀폭) |
| `scm-card-section` | padding 0 24 24 |
| `scm-card-section--padded` | padding 24 |
| `scm-card-divider` | 1px #EBEBEB |

## Title sizes

| 클래스 | size |
|---|---|
| (기본) | 16/600 line-h 21.76 |
| `scm-card-title--lg` | 18/600 line-h 24.48 (폼 카드 큰 제목) |

## Used in (legacy → migration target)

| Legacy class | 사용처 | 마이그레이션 |
|---|---|---|
| `.db-card` (+head/title/body, body--flush) | dashboard.html | `scm-card` |
| `.reg-card` / `.reg-card--gray` | sku-register | `scm-card` / `scm-card--gray` |
| `.reg-card-title` | sku-register | `scm-card-title scm-card-title--lg` |
| `.reg-card-section` (+`--padded`) | sku-register | `scm-card-section` (+`--padded`) |
| `.reg-card-divider` | sku-register | `scm-card-divider` |
