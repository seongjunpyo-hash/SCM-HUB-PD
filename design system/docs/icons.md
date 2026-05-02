# Icons (PBOAssets)

> Source of truth: [Figma · PBOAssets](https://figma.com/design/Ddl91LLUFZmZF4EtqhHSWU/PBOAssets) — Icon master 페이지

LayerDesktop은 자체 아이콘 세트를 두지 않고 **PBOAssets** 의 `basic/ic-*` 아이콘을 그대로 사용합니다.
원본은 20×20 viewBox · 4 weight × filled 변형(`light`, `regular`, `bold`, `filled`) 가 한 컴포넌트 셋 안에 있습니다.

## 파일 위치 규칙

```
<프로젝트 루트>/icons/basic/ic-<name>.svg     # PBOAssets에서 export
```

이 디자인 시스템은 아이콘 SVG 파일을 직접 포함하지 않습니다. 각 제품 폴더(예: `scm hub/`)가 필요한 아이콘만 export 해서 자기 폴더에 둡니다.

## 사용 패턴 (CSS mask + currentColor)

아이콘은 `<svg>` inline이 아니라 **CSS mask**로 그립니다. 이 방식의 장점:

- `currentColor`(부모 `color`)로 색이 자동 따라옴 → 호버/상태 색 변화에 별도 처리 불필요
- 마크업이 한 줄(`<span class="ic ic-search">`) → 가독성 ↑
- 같은 SVG를 여러 사이즈/색으로 재사용 가능

### Base CSS

```css
.ic {
  display:inline-block; flex-shrink:0; vertical-align:middle;
  width:20px; height:20px;
  background-color: currentColor;
  -webkit-mask-size:contain; mask-size:contain;
  -webkit-mask-position:center; mask-position:center;
  -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat;
}
.ic--16 { width:16px; height:16px; }
.ic--14 { width:14px; height:14px; }
.ic--12 { width:12px; height:12px; }
```

### Per-icon class

```css
.ic-search { -webkit-mask-image: url('icons/basic/ic-search.svg'); mask-image: url('icons/basic/ic-search.svg'); }
.ic-eye    { -webkit-mask-image: url('icons/basic/ic-eye.svg');    mask-image: url('icons/basic/ic-eye.svg'); }
/* ... 사용하는 아이콘만 추가 */
```

### Markup

```html
<span class="ic ic-search"></span>                <!-- 20×20 currentColor -->
<span class="ic ic-search ic--16" style="color:var(--ld-fg-low);"></span>
<button>
  <span class="ic ic-download ic--14"></span> 다운로드
</button>
```

## Export 워크플로

PBOAssets에서 export 한 아이콘은 다음 후처리가 필요합니다.

1. **viewBox 정규화**: Figma가 component set 통째로 export 하면 `viewBox="0 0 128 20"` (variant 4개 가로 나열). 첫 variant(`weight=light, filled=false`)만 보이도록 `0 0 20 20`으로 변경.
2. **색 토큰화**: `stroke="black"` / `fill="black"` → `currentColor` 로 치환. 이래야 `.ic` 클래스의 `background-color: currentColor`와 함께 동작.

자동화 스크립트 예시 (`node`):

```js
const fs = require('fs'), path = require('path');
const dir = './icons/basic';
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.svg'))) {
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes('viewBox="0 0 128 20"')) {
    s = s.replace('width="128"', 'width="20"')
         .replace('viewBox="0 0 128 20"', 'viewBox="0 0 20 20"')
         .replace(/stroke="black"/g, 'stroke="currentColor"')
         .replace(/fill="black"/g, 'fill="currentColor"');
    fs.writeFileSync(p, s);
  }
}
```

## 사용 가능한 아이콘 (PBOAssets `basic/`, 147개)

카테고리별 일부:

- **Overview**: `ic-search`, `ic-eye`, `ic-eyeClosed`, `ic-home`, `ic-bell`, `ic-edit`, `ic-editWrite`, `ic-mail`, `ic-menu`, `ic-delete`, `ic-copy`, `ic-calendar`, `ic-image`, `ic-lock`, `ic-unlock`, `ic-link`, `ic-attach`, `ic-bulb`, `ic-global`, `ic-grid`, `ic-mobile`, `ic-desktop`
- **Suggested**: `ic-close`, `ic-closeCircle`, `ic-plus`, `ic-plusCircle`, `ic-minus`, `ic-tag`, `ic-checkCircle`, `ic-checkSquare`, `ic-alertCircle`, `ic-alertTriangle`, `ic-questionCircle`, `ic-infoCircle`
- **Shopping**: `ic-clothing`, `ic-hangerClothing`, `ic-store`, `ic-truck`, `ic-shoppingBag`, `ic-creditCard`, `ic-barcode`, `ic-qrcode`, `ic-heart`, `ic-star`, `ic-thumbsUp`, `ic-thumbsDown`
- **Editor / Table**: `ic-control`, `ic-dragHandle`, `ic-filter`, `ic-funnel`, `ic-freezeColLeft`, `ic-freezeColRight`, `ic-lineChart`, `ic-zoomIn`, `ic-zoomOut`, `ic-download`, `ic-upload`
- **Directional**: `ic-arrowUp`, `ic-arrowDown`, `ic-arrowLeft`, `ic-arrowRight`, `ic-arrowUpDown`, `ic-arrowRightLeft`, `ic-doubleUp/Down/Left/Right`, `ic-chevronUp/Down/Left/Right`, `ic-caretUp/Down/Left/Right`
- **ETC**: `ic-trophy`, `ic-experiment`, `ic-thunderbolt`, `ic-rocket`, `ic-gift`, `ic-calculator`, `ic-sidebarCollapse`, `ic-printer`, `ic-wifi`, `ic-dashboard`, `ic-setting`

전체 목록은 `<프로젝트>/icons/basic/` 디렉터리 참고.

## React 사용 (계획)

현재는 CSS mask 방식만 가이드합니다. 필요해지면 다음 형태의 `Icon.jsx`를 추가합니다.

```jsx
import { Icon } from './design-system/components';

<Icon name="search" size={16} />
<Icon name="eye" />
```

`Icon` 컴포넌트는 내부적으로 같은 CSS mask 패턴을 쓰고, name → 파일 경로 매핑 테이블만 한 곳에 둡니다.

## 의미 가이드 (자주 헷갈리는 케이스)

| 의미             | 아이콘                  | 비고 |
|------------------|-------------------------|------|
| 진행중 / pending | `ic-paperWarning`       | 문서+경고. 단순 시계 강조면 `ic-clockCircle` |
| 전개중 / 활성   | `ic-checkCircle`        | accent 컬러로 |
| 미전개 / 숨김   | `ic-eyeClosed`          | gray-low 톤 |
| 정렬 가능 헤더  | `ic-arrowUpDown`        | 양방향 화살표 |
| 메뉴 / 햄버거   | `ic-menu`               | LNB 토글 |
| 필터 칩         | `ic-funnel`             | 깔때기. `ic-filter`도 가능 |
| 다운로드        | `ic-download`           | 아래 화살표 + 받침 |
| 페이지 ‹ ›      | `ic-chevronLeft/Right`  | `ic-caretLeft/Right`은 작은 삼각형 |
