# Breakpoints & Minimum Resolution

> SCM Hub PBO 데스크탑 제품의 화면 사이즈 룰

## 최소 해상도

**Min width: `1440px`**

PBO 데스크탑 제품은 1440px 이상의 해상도에서 사용한다는 전제로 디자인됩니다.
1440px 미만의 뷰포트(예: 작은 노트북, 분할 창)에서는 **레이아웃을 깨지 않고 가로 스크롤**이 발생하도록 합니다.

## 구현 패턴

```css
html, body { margin:0; padding:0; }
body { min-width: 1440px; }
.app  {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);  /* 1fr 만 쓰면 그리드 컬럼이 부풀 수 있음 */
  min-width: 1440px;
}
.app > * { min-width: 0; }    /* 그리드 자식 기본 min-width:auto 무력화 */
```

```html
<meta name="viewport" content="width=1440" />
```

- `body { min-width: 1440px }` 가 가장 중요. 뷰포트가 더 좁아지면 body 자체가 1440px 폭을 유지하고 브라우저가 가로 스크롤을 만들어 줌
- `viewport meta` 의 `width=1440` 은 모바일/태블릿에서 강제로 1440 폭으로 렌더링하라는 힌트
- LNB(56px) + 메인 영역으로 구성된 `.app` 그리드도 동일한 min-width 가드

### ⚠ Grid 자식의 min-width 함정

CSS Grid 자식의 `min-width` 기본값은 `auto`(= 콘텐츠 폭) 입니다. 안에 넓은 테이블이 있으면 그 컬럼이 `1fr` 보다 넓어지면서 **상단의 액션바 / 페이지 헤더까지 같이 밀려 잘립니다**.

해결책 두 가지를 같이 적용합니다.

```css
.app { grid-template-columns: 56px minmax(0, 1fr); }
.app > * { min-width: 0; }
```

추가로 안에서 가로 스크롤을 만들 컨테이너에는 `min-width: 0; max-width: 100%; overflow-x: auto;` 를 명시해서 그리드 컬럼 너비 안에서만 스크롤이 일어나게 합니다.

```css
.scroll-host { min-width: 0; max-width: 100%; overflow-x: auto; }
```

이걸 안 하면 "데이터가 없을 땐 멀쩡한데, 행이 추가되면 페이지가 갑자기 잘린다" 는 증상이 생깁니다.

## DO / DON'T

| ✅ | ❌ |
|---|---|
| 1440px 폭 기준으로 컴포넌트 폭/여백/그리드를 결정 | 100vw 기준으로 % 만 사용해 어느 폭에서도 비례 축소되게 |
| 1440 미만에서는 가로 스크롤 허용 | 1440 미만에서 컴포넌트가 부서지거나 겹침 |
| 폭 1440 ~ 1920 정도까지 시각적으로 자연스럽게 | 2560 / 4K 까지 대응한답시고 거대한 max-width 패딩 | 

## 참고: 모바일 / 반응형이 필요한 경우

PBO 데스크탑 제품은 기본적으로 데스크탑 전용입니다. 모바일·태블릿 대응이 필요한 화면은 별도의 디자인/레이아웃 트랙으로 다룹니다.
