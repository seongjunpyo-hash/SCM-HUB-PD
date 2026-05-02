# scm-code-popover

UID / SKU / 바코드 / 스타일넘버 묶음 보기 popover. 셀 안 코드 link 클릭 시 표시.

## Anatomy

```
scm-code-popover-backdrop (투명, 외부 클릭 dismiss)
scm-code-popover (position fixed)
├ h4 (제목)
├ ul > li (코드 항목, .linked 시 underlined)
└ scm-code-popover__actions
    ├ <button> 복사 (N)
    └ <button class="primary"> 닫기
```

## API (vanilla)

```js
SCM.codePopover.open({
  title: '연결된 UID번호 확인',
  items: ['383827', '383828', '383829'],
  copyLabel: 'UID 복사',
  anchorEl: triggerElement,        // 위치 계산용 (optional)
  linked: true,                    // li 에 .linked 클래스
  onCopy: (items) => navigator.clipboard.writeText(items.join('\n')),
});

SCM.codePopover.close();
```

backdrop 클릭, 닫기 버튼, ESC 키 모두 close.

## Props (React)

| prop | type |
|---|---|
| `open` | boolean |
| `title` | string |
| `items` | string[] |
| `linked` | boolean |
| `copyLabel` | string |
| `position` | `{ top, left }` |
| `onCopy` | `(items) => void` |
| `onClose` | `() => void` |

## Used in (legacy → migration target)

| Legacy | 사용처 |
|---|---|
| `.mp-code-popover` + `.mp-code-backdrop` (+ `.is-open`) | 4개 데이터리스트 페이지. UID/SKU/바코드/스타일넘버/대표스타일 5종 |
