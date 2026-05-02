# scm-lnb

좌측 네비게이션 바(LNB). topbar 와 함께 SCM Hub 의 sticky 셸을 구성한다. 햄버거 토글로 collapsed(56) ↔ expanded(260) 폭이 바뀌며 상태는 `localStorage('scm-lnb-open')` 으로 영속화된다.

## Files

- `lnb.css` · `lnb.js` · `lnb.html` · `lnb.jsx` · `README.md`

## Spec

| 속성 | 값 |
|---|---|
| position | sticky / top:64 / z-index:15 |
| width | `var(--scm-lnb-width)` (56 → 260) |
| height | `calc(100vh - 64px)` |
| background | `#FAFAFA` |
| border-right | 1px solid #E5E5E5 |
| transition | `width 0.2s ease` |
| row hover/active bg | `#F0F0F0` |

페이지 측 :root 에 다음을 정의한다 (Topbar/LNB 동일 base):

```css
:root { --scm-lnb-width: 56px; --scm-sticky-gnb: 64px; }
html.is-lnb-open { --scm-lnb-width: 260px; }
```

## Rows

| key | label | href |
|---|---|---|
| `dashboard` | 대시보드 | `dashboard.html` |
| `index` | 무탠 전개상품 | `index.html` |
| `sku-management` | SKU 관리 | `sku-management.html` |
| `editshop-status` | 편집샵 보충 현황 | `editshop-restock-status.html` |
| `editshop-request` | 편집샵 보충 요청 | `editshop-restock-request.html` |

`data-key` 로 active 행을 식별한다.

## Markup

`lnb.html` 의 canonical 마크업을 그대로 복사 사용. 5행 고정.

## Props (React)

| prop | type | 설명 |
|---|---|---|
| `active` | `'dashboard' \| 'index' \| 'sku-management' \| 'editshop-status' \| 'editshop-request'` | 현재 페이지 키 |
| `rows` | `Array<{key, href, label, icon}>` | 커스텀 메뉴 (기본 `LNB_ROWS`) |

## API (vanilla)

```js
SCM.lnb.mount(document.querySelector('.scm-lnb'), { active: 'sku-management' });

// 외부 토글 / 상태 조회
SCM.lnb.toggle();
SCM.lnb.open();
SCM.lnb.close();
SCM.lnb.isOpen();
SCM.lnb.setActive(el, 'dashboard');
```

`SCM.topbar.mount(...)` 는 `onLnbToggle` 미지정 시 자동으로 `SCM.lnb.toggle()` 을 호출하므로, 두 모듈이 같이 로드되면 추가 설정 없이 토글이 작동한다.

## FOUC 방지

`<head>` 에 다음 stub 권장 — lnb.css 평가 전에 `is-lnb-open` 을 결정.

```html
<script>
  try {
    if (localStorage.getItem('scm-lnb-open') === '1')
      document.documentElement.classList.add('is-lnb-open');
  } catch(_) {}
</script>
```

`lnb.js` 자체도 IIFE 내부에서 동일 복원을 1회 수행하지만 (defer/하단 로딩 시 이미 늦으므로) head stub 이 안전하다.

## Used in

| 페이지 | active |
|---|---|
| `dashboard.html` | `dashboard` |
| `index.html` (무탠) | `index` |
| `sku-management.html` | `sku-management` |
| `sku-register.html` | `sku-management` (등록은 SKU 관리 하위) |
| `sku-detail.html` | `sku-management` |
| `editshop-restock-status.html` | `editshop-status` |
| `editshop-restock-request.html` | `editshop-request` |

## Notes

- inline SVG 사용 — 페이지 sprite 의존 제거.
- 라우팅은 page-anchor (`href`) 그대로. SPA 도입 시 React 트윈에서 `Link` 로 swap.
