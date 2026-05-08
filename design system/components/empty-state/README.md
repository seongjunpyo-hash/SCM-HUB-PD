# scm-empty-state

큰 빈 상태. 아이콘 + 제목 + 설명. 페이지 / 테이블 / 리스트 영역에서 사용.

작은 hint 만 필요하면 `scm-empty-hint` 사용.

## Layout

centered flex column, padding 80px 24px, gap 16px, hairline 하단 보더.

## Icon colors

| 클래스 | 색상 |
|---|---|
| (기본) | `#FFA12A` 오렌지 (알림/주의) |
| `scm-empty-state__icon--blue` | `#245EFF` |
| `scm-empty-state__icon--green` | `#1EA514` |
| `scm-empty-state__icon--gray` | `#8A8A8A` |
| `scm-empty-state__icon--red` | `#F31110` |

## Variants

`scm-empty-state--no-border` — 하단 보더 제거 (패널 안에 박힐 때).

## Props (React)

| prop | type |
|---|---|
| `icon` | ReactNode (SVG) |
| `iconColor` | 색상 variant |
| `title` | string |
| `description` | string |
| `noBorder` | boolean |

## Used in (legacy → migration target)

| Legacy class | 사용처 | 마이그레이션 |
|---|---|---|
| `.reg-pending-empty` (+`.icon`, `.title`, `.desc`) | `sku-register.html` (등록 대기 빈 상태) | `scm-empty-state` |
