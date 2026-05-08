# scm-topbar

전역 상단 네비게이션 바(GNB). 로고 / 데모 태그 / 메뉴 토글 / 사용자 정보를 한 줄에 배치한다. 모든 SCM Hub 페이지의 최상단에 sticky 로 고정된다.

## Files

- `topbar.css` · `topbar.js` · `topbar.html` · `topbar.jsx` · `README.md`

## Spec

| 속성 | 값 |
|---|---|
| height | 64px |
| position | sticky / top:0 / z-index:20 |
| border-bottom | 1px solid #E5E5E5 |
| box-shadow | 0 1px 1px rgba(0,0,0,.08) |
| menu-btn | 56x64, hover bg-low |
| avatar | 32x32 / radius 50% / #EEEEEE |

## Markup

```html
<header class="scm-topbar">
  <div class="scm-topbar__left">
    <button class="scm-topbar__menu-btn" data-scm-lnb-toggle aria-label="메뉴">
      <svg viewBox="0 0 24 24"><!-- 햄버거 --></svg>
    </button>
    <span class="scm-topbar__logo">SCM HUB</span>
    <span class="scm-topbar__demo-tag">DEMO · scm-* 모듈</span>
  </div>
  <div class="scm-topbar__right">
    <span class="scm-topbar__avatar">J</span>
    <span class="scm-topbar__name">juji@musinsa.com</span>
  </div>
</header>
```

## Props (React)

| prop | type | default | 설명 |
|---|---|---|---|
| `userName` | string | `'juji@musinsa.com'` | 우측에 표시될 사용자 이메일/이름 |
| `userInitial` | string | `'J'` | avatar 안 이니셜 |
| `demoTag` | string | `'DEMO · scm-* 모듈'` | 우측 데모 태그 — falsy 면 숨김 |
| `onLnbToggle` | () => void | — | 햄버거 클릭 시 호출 |

## API (vanilla)

```js
SCM.topbar.mount(document.querySelector('.scm-topbar'), {
  userName: 'juji@musinsa.com',
  userInitial: 'J',
  demoTag: 'DEMO',
  onLnbToggle: () => SCM.lnb.toggle(),  // 미지정 시 default 동작
});
```

`onLnbToggle` 을 넘기지 않으면 자동으로 `SCM.lnb.toggle()` (있으면) 또는 `html.is-lnb-open` 토글 + `localStorage('scm-lnb-open')` 영속화를 수행한다.

## Used in

| 페이지 | 호출 |
|---|---|
| `index.html` (무탠) | `SCM.topbar.mount('.scm-topbar')` |
| `sku-management.html` | 〃 |
| `sku-register.html` | 〃 |
| `sku-detail.html` | 〃 |
| `editshop-restock-status.html` | 〃 |
| `editshop-restock-request.html` | 〃 |
| `dashboard.html` | 〃 |

## Notes

- inline SVG 사용 — 페이지 SVG sprite (`#ic-menu`) 의존 제거.
- 사용자 이메일/이니셜은 추후 세션/계정 API 와 연동될 예정. 현재는 하드코딩.
