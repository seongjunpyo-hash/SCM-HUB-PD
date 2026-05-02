# scm-kpi-card

대시보드 KPI 카드. label + icon-box (head) + value + delta + meta-text (body).

## Anatomy

```
scm-kpi-card (white, radius 8, padding 24)
├ scm-kpi-card__head
│   ├ scm-kpi-card__label (14/500 #666)
│   └ scm-icon-box (--blue/--green/--orange/--red)
└ scm-kpi-card__body
    ├ scm-kpi-card__value (32/600 tabular)
    └ scm-kpi-card__meta
        ├ scm-kpi-card__delta (--up green / --down red)
        └ scm-kpi-card__meta-text (#666)
```

## Used in

| Legacy | 사용처 |
|---|---|
| `.db-kpi-card` (+ head/label/icon-box/body/value/meta/delta/meta-text) | dashboard.html |
