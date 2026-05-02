# scm-icon-box

36×36 (또는 32×32) 컬러 아이콘 박스. KPI 카드 / activity list / quick link 등에서 카테고리·톤을 시각적으로 구분.

## Files

- `icon-box.css` · `icon-box.js` · `icon-box.html` · `icon-box.jsx` · `README.md`

## Variants

| 클래스 | 배경 | 전경 |
|---|---|---|
| (기본) | `#F5F5F5` | `#1A1A1A` |
| `scm-icon-box--blue` | `#E2F1FF` | `#245EFF` |
| `scm-icon-box--green` | `#ECFFEC` | `#1EA514` |
| `scm-icon-box--orange` | `#FFF4E5` | `#B7791F` |
| `scm-icon-box--red` | `#FFECEC` | `#F31110` |

## Sizes

| 클래스 | 크기 | 아이콘 |
|---|---|---|
| (기본) | 36×36 | 20px |
| `scm-icon-box--sm` | 32×32 | 16px |

## Props (React)

| prop | type | 설명 |
|---|---|---|
| `color` | `'blue'\|'green'\|'orange'\|'red'` | 색상 variant |
| `size` | `'sm'` | 작은 변형 |
| `children` | ReactNode | 안에 들어갈 SVG 아이콘 |

## API (vanilla)

```js
SCM.iconBox.mount(el, { color: 'blue', size: 'sm' });
```

## Used in (legacy → migration target)

| Legacy class | 사용처 | 마이그레이션 |
|---|---|---|
| `.db-kpi-icon-box` (`.is-blue/.is-green/.is-orange/.is-red`) | dashboard.html KPI 카드 | `scm-icon-box scm-icon-box--<color>` |
| `.db-list-icon` (`.is-blue/.is-green`) | dashboard.html activity list | `scm-icon-box scm-icon-box--sm scm-icon-box--<color>` |
| `.db-quick-card` 의 icon | dashboard.html quick links | `scm-icon-box` |
