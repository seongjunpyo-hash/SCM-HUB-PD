# MUSINSA PBO Design System

무신사 PBO 디자인시스템은 아래와 같은 패키지로 구성됩니다.

- `@musinsa/layer-tokens`
- `@musinsa/layer-components-desktop`
- `@musinsa/layer-components-pda`

---

- `@musinsa/phase-tokens`

---

- `@musinsa/pbo-assets`

## Install

git registry에 배포되있어 .npmrc 혹은 .yarnrc 설정이 필요합니다.

```bash
# .npmrc
@musinsa:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
# yarn add, pnpm add, bun add ... etc
npm install @musinsa/layer-tokens
npm install @musinsa/layer-components-desktop
npm install @musinsa/layer-components-pda

npm install @musinsa/pbo-assets

npm install @musinsa/phase-tokens
```

## Tokens setting

layer, phase에서 사용하는 색상이 정의되어있는 stylesheet.css에 대한 의존성이 있어 각 앱의 최상단에 import가 필요합니다. 또한 플랫폼에 사용되는 fonts.css를 제공합니다.

```tsx
// App.tsx or layout.tsx ... etc

import '@musinsa/layer-tokens/stylesheet.css'; // 일괄제공
// or
import '@musinsa/layer-tokens/desktop-stylesheet.css';
import '@musinsa/layer-tokens/pda-stylesheet.css';
import '@musinsa/layer-tokens/pos-stylesheet.css';

import '@musinsa/phase-tokens/stylesheet.css'; // 일괄제공
// or
import '@musinsa/phase-tokens/desktop-stylesheet.css';
import '@musinsa/phase-tokens/mobile-stylesheet.css';

// fonts sheet (Pretendard 포함되어있음, PDA는 ibm-flex-mono도 포함)
import '@musinsa/layer-tokens/desktop-fonts.css';
import '@musinsa/layer-tokens/pda-fonts.css';
import '@musinsa/layer-tokens/pos-fonts.css';
```

platform 처리 및 dark-mode 지원을 위하여 stylesheet.css에서 분기처리를 하고있습니다.
앱의 최상단 .html 파일 html 태그에 아래의 속성을 추가해주세요.

```html
<!-- index.html or layout.tsx -->

<!-- use layer -->
<html lang="en" data-layer-theme="{theme}" data-layer-platform="{platform}">
  <body></body>
</html>

<!-- use phase -->
<html lang="en" data-phase-theme="{theme}" data-phase-platform="{platform}">
  <body></body>
</html>
```

현재 theme은 `light` , `dark` 두가지를 제공하고있으며, platform은 아래와 같이 제공하고있습니다.

- layer : `desktop` , `pda` , `pos`
- phase : `desktop` , `mobile`

특정 내부요소에서만 다른 theme, platform token을 사용하는 경우 아래와 같이 사용할 곳에 속성을 추가해주세요.
(ex: MWMS의 경우 media-query에 따라 desktop, pda를 구분함)

```tsx
return (
  <div>
    light text
    <DarkPdaWrapper data-layer-theme="dark" data-layer-platform="pda">
      dark text
    </DarkPdaWrapper>
  </div>
);
```

## Use Tokens

figma plugin과 연동되어있어 **플랫폼 디자이너가 figma에서 토큰 수정시** github `layer-token or phase token` branch에 수정사항이 json형태로 반영되고,  
github-actions에 의해 **자동으로 json을 코드로 최신화하여 커밋후 PR을 생성합니다.**  
(플랫폼 디자이너가 반영한 json은 /packages/\*-tokens/src/figma-json에 반영됩니다.)

반영된 토큰은 `tokens`변수로 제공합니다. (figma에서 보이는 구조와 1:1 매칭)

```tsx
// figma의 Selection colors 값이 textButton/accent/fg 인 경우 아래와 같이 사용할 수 있습니다.
tokens.textButton.accent.fg;

// 만약 Selection colors와 값이 다르다면 figma 에서 토큰 업데이트가 안되어있는 케이스라 디자이너에게 업데이트를 요청해야합니다.
```

- 추가로 DX를 위해 카테고리별로 그룹핑하여 `colors` , `colorTokenMap` , `typography` 변수를 추가적으로 제공합니다.

`@musinsa/*-tokens` 는 플랫폼별로 sub-path 형태로 export하기 때문에  
typescript config `moduleResolution` 를 `bundler` 로 설정하는것을 추천드립니다. (ts 5.x.x 버전이상)

```tsx
import { tokens, colors, colorTokenMap, typography } from '@musinsa/layer-tokens/desktop';
// import { tokens, colors, typography } from '@musinsa/layer-tokens/pda';
// import { tokens, colors, typography } from '@musinsa/layer-tokens/pos';
// import { tokens, colors, typography } from '@musinsa/phase-tokens/desktop';
// import { tokens, colors, typography } from '@musinsa/phase-tokens/mobile';

/*
 *  figma에서 정의된 token을 객체형태로 제공합니다.
 *  ex) tokens.primitive.color.gray.xxx, tokens.fg, tokens.textfield.bg, tokens.pda.fg
 */
console.log(tokens);

/**
 *  tokens에서 color token만 추출하여 제공합니다.
 */
console.log(colors);

/**
 *  colors 객체를 flattening하여 제공합니다. (컴포넌트에 prop으로 색상을 전달할때 사용할 수 있습니다.)
 *  ex) colors.base.gray.900 -> colorTokenMap['base-gray-900']
 */
console.log(colorTokenMap);

/**
 *  tokens에서 typography 객체만 추출하여 제공합니다.
 */
console.log(typography);
```

`tokens['bg-accent']` 와 같이 bracket notation을 사용해야하는 토큰이 많아  
typescript config `noImplicitAny` 를 `true` 로 설정하는것을 추천드립니다.

## PBO Assets

**플랫폼 디자이너가 asset 수정시** /packages/pbo-assets/src/figma-asset 경로에 svg를 일괄 반영합니다.  
그 후 github-actions에 의해 **자동으로 svg를 react component로 최신화하여 커밋후 PR을 생성합니다.**

icon은 아래와 같이 분류됩니다.

- **basic icon**: `filled`와 `stroke` 두 가지 스타일을 지원하며, `iconStroke` 속성으로 stroke-width를 조절할 수 있습니다. (stoke 한정, filled 에서는 never 타입) `Icon` 으로 import 하여 사용할 수 있습니다.
- **graphic icon**: 비교적 복잡한 아이콘으로 단일 스타일만 지원합니다. `GraphicIcon` 으로 import 하여 사용할 수 있습니다.

<br />

`@musinsa/pbo-assets` 은 서비스별로 sub-path 형태로 export하기 때문에  
typescript config `moduleResolution` 를 `bundler` 로 설정하는것을 추천드립니다. (ts 5.x.x 버전이상)

```tsx
import { Icon, GraphicIcon } from '@musinsa/pbo-assets';
import { Icon as MwmsIcon, GraphicIcon as MwmsGraphicIcon } from '@musinsa/pbo-assets/mwms';
import { Icon as MomsIcon, GraphicIcon as MomsGraphicIcon } from '@musinsa/pbo-assets/moms';
import { Icon as ScmHubIcon, GraphicIcon as ScmHubGraphicIcon } from '@musinsa/pbo-assets/scmHub';
import { Icon as SelfPosIcon, GraphicIcon as SelfPosGraphicIcon } from '@musinsa/pbo-assets/selfPos';
// ... 그외 추가예정
```

```tsx
return (
  <>
    {/* stroke */}
    <Icon name="ic-alertCircle" size={24} colorToken="fg-critical" iconStroke="200" />
    {/* filled */}
    <Icon name="ic-alertCircle" size={24} colorToken="fg-critical" filled />
  </>
);
```

의 형태로 사용할 수 있으며, **각 아이콘 name 및 color token에 대한 타입추론을 지원합니다**.

## Components setting

대표적인 runtime css-in-js `styled-components` 의 maintenance mode 전환 및 runtime overhead issue 및 RSC 환경에서의 사용불가 문제 등의 문제가있어 zero-runtime 방식인 `vanilla-extract` 를 채택하여 제공하고있어 각 앱의 최상단에 빌드타임때 생성된 css파일의 import가 필요합니다.

```tsx
// App.tsx or layout.tsx ... etc

import '@musinsa/layer-components-desktop/style.css';
// or
import '@musinsa/layer-components-pda/style.css';
```

### components

...
