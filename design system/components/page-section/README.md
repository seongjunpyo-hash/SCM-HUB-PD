# scm-page-section

페이지 섹션 래퍼. 대시보드 / 상세 / 폼 페이지에서 한 블록의 표준 래퍼.

## Anatomy

```
scm-page-section (margin-top: 32)
├ scm-page-section-head (flex space-between, mb 16)
│   ├ scm-page-section-title (h2, 18/600)
│   └ scm-page-section-link (a, 14/500 #666 → hover #000)
└ scm-page-section-body (slot)
```

`title` 과 `link` 둘 다 옵셔널 — 둘 다 없으면 head 자체 안 그림.

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.db-section`, `.db-section-head`, `.db-section-title`, `.db-section-link` | dashboard.html (활동 / 빠른 링크 등) |
| `.sd-section`, `.sd-section-head`, `.sd-section-title` | sku-detail (각 정보 섹션) — 비슷하지만 margin/padding 차이 있음. 마이그레이션 시 통합 검토. |
