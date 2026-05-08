# 컴포넌트 API 레퍼런스

> 모든 컴포넌트는 `'./design-system/components'`에서 한 줄로 import:
> ```js
> import { Button, TextField, Modal, ... } from './design-system/components';
> ```
> 공통 props: `className`, `...rest` 자동 전파.

---

## Button · IconButton · TextButton
`components/Button.jsx` · Figma `3:44 / 133:8819 / 117:4880`

### `<Button>`
| Prop | Type | Default | 설명 |
|---|---|---|---|
| `variant` | `'primary' \| 'accent' \| 'secondary' \| 'negative'` | `'primary'` | |
| `appearance` | `'filled' \| 'outlined' \| 'ghost'` | `'filled'` | |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | |
| `leftIcon` / `rightIcon` | ReactNode | — | |
| `loading` | boolean | `false` | |
| `fullWidth` | boolean | `false` | |
| `as` | `'button' \| 'a' \| Component` | `'button'` | 다형 렌더 |
| `disabled` | boolean | — | |

### `<IconButton>`
- `size`: `xxs / xs / s / m / l / xl` ⚠ (audit A 참고, 표준화 대상)
- 필수: `aria-label`
- prop: `icon: ReactNode`

### `<TextButton>`
- `variant`: `primary / secondary / accent / negative`
- 패딩 없는 텍스트 링크형 버튼

---

## TextField · SearchField · TextArea
`components/TextField.jsx` · Figma `7957:422 / 8299:520 / 2250:10466`

### `<TextField>`
| Prop | Type | Default | 설명 |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `type` | `'text' \| 'password' \| ...` | `'text'` | |
| `leftIcon` / `rightIcon` | ReactNode | — | |
| `prefix` / `suffix` | string | — | 정적 텍스트 |
| `clearable` | boolean | `false` | × 버튼 |
| `counter` | boolean | `false` | maxLength 카운터 표시 |
| `maxLength` | number | — | |
| `invalid` | boolean | `false` | `aria-invalid="true"` |
| `value` / `defaultValue` / `onChange` | — | — | controlled / uncontrolled |

### `<SearchField>`
- TextField + `onSearch?: (q: string) => void`, Enter 또는 검색 아이콘 클릭 시 호출.

### `<TextArea>`
- `rows`, `maxLength` 등 `<textarea>` 표준 props + `invalid`.

---

## Select · OptionList
`components/Select.jsx` · Figma `411:15311`

### `<Select>`
| Prop | Type | 설명 |
|---|---|---|
| `label`, `required`, `optional` | — | label slot |
| `placeholder` | string | |
| `helperText`, `validationMessage` | string | helper와 validation message는 동시 표시 가능 |
| `validation` | `'error' \| 'success' \| 'warning'` | |
| `invalid` | boolean | `validation='error'`의 단축형 |
| `options` | `{ value, label, disabled? }[]` | |
| `value` / `onChange` | `string \| string[]` | multiple 시 array |
| `multiple` | boolean | 좌측 체크박스 + count chip |
| `searchable` | boolean | popover 헤더에 검색 input |
| `onAddValue` | `(query) => void` | popover 헤더에 "+ value 추가" |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` |

### `<OptionList>`
- 단독 사용 가능. `Select`의 popover 콘텐츠가 분리된 형태.

---

## Checkbox · CheckboxGroup · Radio · RadioGroup · Switch
`components/Checkbox.jsx`

### `<Checkbox>` / `<Radio>`
| Prop | Type | 설명 |
|---|---|---|
| `checked` / `defaultChecked` / `onChange` | — | controlled / uncontrolled |
| `label`, `helper` | ReactNode | |
| `disabled` | boolean | |
| `invalid` | boolean | |

### `<CheckboxGroup>` / `<RadioGroup>`
| Prop | Type | 설명 |
|---|---|---|
| `value` | string \| string[] | RadioGroup은 string, CheckboxGroup은 array |
| `onChange` | (value) => void | |
| `options` | `{ value, label, disabled? }[]` | |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` |
| `label`, `helper`, `required`, `invalid` | — | wrapper Field와 동일 |

### `<Switch>`
- 동일 controlled/uncontrolled 패턴, `label` 옵션.

---

## Tag · StatusTag · LabelTag · FilterTag · RemovableTag
`components/Tag.jsx`

### `<StatusTag>`
| Prop | Type | 설명 |
|---|---|---|
| `variant` | `'default' \| 'progress1' \| 'progress2' \| 'progress3' \| 'success' \| 'warning' \| 'critical'` | ⚠ JSON은 `progress-primary/secondary/tertiary` (audit B) |
| `size` | `'xs' \| 's' \| 'm'` | ⚠ 표준화 대상 (audit A) |
| `count` | number | 옵션. 우측 카운트 |

### `<LabelTag>`
- `color`: `'gray' \| 'blue' \| 'green' \| 'red' \| 'yellow'`
- `tinted`: boolean (반투명 톤)
- `size`: `'xs' \| 's' \| 'm'`

### `<FilterTag>`
- `selected` / `onClick`, `disabled`
- 필터 토글 (선택 시 검정 border)

### `<RemovableTag>`
- `onRemove: () => void`
- `color`: `'gray' \| 'blue' \| ...` (LabelTag와 동일 팔레트)

---

## Tooltip
`components/Tooltip.jsx` · Figma `5002:48`

| Prop | Type | 설명 |
|---|---|---|
| `content` | ReactNode | 본문 |
| `title` | string | sticky variant 시 제목 |
| `link` | `{ href, label }` | sticky variant 링크 |
| `variant` | `'black' \| 'white'` | `'black'` |
| `placement` | 13가지 | `'top' / 'topStart' / 'topEnd' / ...` |
| `trigger` | `'hover' \| 'click' \| 'focus'` | `'hover'` |
| `sticky` | boolean | 클릭 닫기 모드 (제목+링크+×) |
| `defaultOpen` / `open` / `onOpenChange` | — | controlled / uncontrolled |

```jsx
<Tooltip content="설명"><button>?</button></Tooltip>
<Tooltip variant="white" placement="bottomEnd" sticky title="알아두세요"
         link={{ href: '/docs', label: '자세히' }}>
  <InfoIcon />
</Tooltip>
```

---

## Modal · Dialog
`components/Modal.jsx` · Figma `9949:395 / 10007:14268`

### `<Modal>`
| Prop | Type | 설명 |
|---|---|---|
| `open` | boolean | |
| `onClose` | `() => void` | ESC / overlay click / × 모두 호출 |
| `title` | string | |
| `footer` | ReactNode | 보통 Button 묶음 |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` (320–720px 대응) |
| `closeOnOverlayClick` | boolean | `true` |
| `showClose` | boolean | `true` |

### `<Dialog>`
- 480px max alert 형. `message`, `confirmLabel`, `confirmVariant`, `onConfirm`.

### `openConfirmModal` / `closeConfirmModal` (v2.26)

React state 없이도 호출 가능한 confirm 모달 vanilla API. HTML 에 `#mp-modal` 마크업이 미리 있어야 함 (자세한 구조는 [`data-list-page.md` §6](./data-list-page.md#6-confirm-modal-infra-vanilla-dom-api)).

```js
import { openConfirmModal, closeConfirmModal } from '@/design-system/components';

openConfirmModal({
  title: '상품 매핑',
  descHtml: `선택하신 <strong class="accent">5건</strong>(매입)의 SKU를 매핑합니다.<br/>계속 진행하시겠습니까?`,
  confirmLabel: '매핑',
  onConfirm: () => { /* ... */ },
});
```
- backdrop click + Escape → 자동 닫힘
- `descHtml` 은 `<strong class="accent">` (#245EFF) 강조 지원

---

## Drawer
`components/Drawer.jsx` · Figma `10119:4891 / 10200:79952`

| Prop | Type | 설명 |
|---|---|---|
| `open`, `onClose` | — | |
| `title` | string | |
| `description` | string \| ReactNode | string은 ⓘ tooltip, ReactNode는 banner-info 박스 |
| `banner` | ReactNode | Banner 슬롯 (description ReactNode와 택1) |
| `stickyTop` | ReactNode | filter / tabs / calendar 등 body 위 fixed |
| `footer` | ReactNode | |
| `buttonCount` | `0 \| 1 \| 2 \| 3` | footer 버튼 개수 힌트 |
| `widthMode` | `'fluid' \| 'fixed'` | `'fixed'` |
| `width` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '400px'~'1199px'` | fixed 전용 |
| `placement` | `'right' \| 'left'` | `'right'` |
| `overlay`, `overlayClose`, `scrollable`, `showScrollbar`, `showClose` | boolean | |

### Static helpers
- `<Drawer.AccentBlock>` — 좌측 accent border + 연한 파랑 bg 강조 블록
- `<Drawer.Nested>` — main drawer 우측에 붙는 sub-drawer

---

## Banner
`components/Banner.jsx` · Figma `9903:4460`

| Prop | Type | 설명 |
|---|---|---|
| `variant` | `'info' \| 'warning' \| 'critical'` | |
| `title` | string | |
| `icon` | ReactNode | override |
| `action` | ReactNode | 보통 ghost Button |
| `dismissible` | boolean | × 표시 |
| `onClose` | `() => void` | |

---

## Tabs · Tab
`components/Tab.jsx` · Figma `6914:446`

### `<Tabs>`
| Prop | Type | 설명 |
|---|---|---|
| `type` | `'line' \| 'box' \| 'text'` | `'line'` |
| `size` | `'s' \| 'm' \| 'l'` | ⚠ 표준화 대상 (audit A) |
| `value` / `onChange` | — | controlled |
| `items` | `{ value, label, count?, disabled? }[]` | array 사용 시 children 대신 |

### `<Tab>`
| Prop | Type | 설명 |
|---|---|---|
| `value` | string | |
| `count` | number | |
| `disabled` | boolean | |

---

## PageHeader
`components/PageHeader.jsx` · Figma `8096:4360`

| Prop | Type | 설명 |
|---|---|---|
| `title` | string | |
| `meta` | string[] | breadcrumb (`['홈', 'SCM HUB', 'SKU 관리']`) |
| `actions` | ReactNode | 우측 버튼들 |
| `collapsed` | boolean | 56px 슬림 헤더 |

> ⚠ 다른 컴포넌트와 달리 `default export`도 있음 (audit G.3 — named만으로 통일 권장).

---

## Nav (LNB)
`components/Nav.jsx` · Figma `7957:422 / 662:52166`

| Prop | Type | 설명 |
|---|---|---|
| `items` | `{ id, label, icon?, count?, children? }[]` | 2단계 트리까지 |
| `activeId` / `onSelect` | — | |
| `collapsed` | boolean | 60px 폭 |
| `dark` | boolean | 다크 테마 |
| `env` | `{ label, color: 'purple' \| 'blue' \| ... }` | 환경 표시 (STG/PRD) |
| `header` / `footer` | ReactNode | |

---

## WorkspaceTabs
`components/WorkspaceTabs.jsx` · Figma `4849:90`

탑 앱 탭 (브라우저 탭 스타일)

| Prop | Type | 설명 |
|---|---|---|
| `tabs` | `{ id, label, closable? }[]` | |
| `activeId` / `onSelect` | — | |
| `onClose` | `(id) => void` | |

스크롤 시 좌/우 화살표 자동 등장.

---

## Field · FormCard · FormRow
`components/Form.jsx` · Figma `318:16096 / 174:2 / 8096:4360`

### `<Field>` — label + input + helper 묶음
| Prop | Type | 설명 |
|---|---|---|
| `label` | string | |
| `required` / `optional` | boolean | (택1) |
| `info` | ReactNode | label 옆 ⓘ |
| `helper` | ReactNode | 아래 보조 텍스트 |
| `invalid` | boolean | |
| `htmlFor` | string | a11y 연결 |

### `<FormCard>` — 카드 컨테이너
- `title`, `meta`, `actions`, `children`

### `<FormRow>` — label/input grid
- `<FormCard>` 안에서 사용. `label`, `required`, `info`, `helper`, `invalid`.

---

## Table
`components/Table.jsx`

복합 컴포넌트. **Toolbar (top) → Table → Toolbar (bottom)** 구조.

| Prop | Type | 설명 |
|---|---|---|
| `columns` | `{ key, header, align?, width?, render? }[]` | render는 커스텀 셀 |
| `data` | `Array<row>` | |
| `total` | number | toolbar 좌측 "전체 N" |
| `page`, `totalPages`, `pageSize` | number | 1-based |
| `pageSizeOptions` | number[] | `[10, 50, 100, ...]` |
| `onPageChange` / `onPageSizeChange` / `onDownload` | — | |
| `toolbarLeft` | ReactNode | filter chips 등 |
| `bottomToolbar` | boolean | `true` |
| `zebra` | boolean | 짝수 행 회색 |
| `selectable` | boolean | 좌측 체크박스 컬럼 표시 |
| `selectedRows` | `Set<key> \| Array<key>` | 선택된 행 키 |
| `onSelectionChange` | `(selectedSet: Set) => void` | 선택 변경 콜백. header 클릭 시 전체 토글 |
| `emptyTitle` / `emptyDescription` / `emptyIcon` | — | empty state |
| `rowKey` | `(row, idx) => string` | default: `row.id ?? idx` |

### Cell helpers (named exports on Table)
- `Table.NumericCell` — `value`, `color?`, `bold?`
- `Table.DateCell` — `value` (ISO string)
- `Table.StatusTextCell` — `pairs: [['Label', count, variant], ...]`
- `Table.TrailingCell` — `labels: string[]`, `description?: string`

---

## 사용 예시 — 종합

```jsx
import {
  PageHeader, FormCard, FormRow, Field,
  TextField, Select, Button, Banner, StatusTag,
} from './design-system/components';

<>
  <PageHeader
    title="SKU 생성/관리"
    meta={['홈', 'SCM HUB', 'SKU 관리']}
    actions={<>
      <Button variant="secondary">취소</Button>
      <Button>등록</Button>
    </>}
  />

  <Banner variant="warning" title="검수 필요">
    소비기한 정보가 누락된 SKU 1건이 있습니다.
  </Banner>

  <FormCard title="기본 정보" meta="필수 항목 *">
    <FormRow label="SKU 명" required>
      <TextField placeholder="입력하세요" />
    </FormRow>
    <FormRow label="카테고리">
      <Select options={[{ value: 'a', label: '의류' }]} />
    </FormRow>
    <FormRow label="상태">
      <StatusTag variant="success">활성</StatusTag>
    </FormRow>
  </FormCard>
</>
```

---

# Data List Page Components (v2.23.0)

> SCM Hub 데이터 리스트 페이지(무탠 전개상품 관리 / SKU 관리 등) 표준 패턴.
> 픽셀 spec 은 [`docs/data-list-page.md`](./data-list-page.md), 즉시 복붙용 코드는 [`docs/dev-handoff.md`](./dev-handoff.md) 참고.

## DataTable

두 가지 thead 변형 지원: 단일행(무탠) / 2단(SKU).

```jsx
import {
  DataTableHost, DataTableScroll, DataTable,
  DataTableGroupRow, DataTableCell, DataTableCheckbox, DataTableEmpty,
} from '@/design-system/components';

<DataTableHost>
  <DataTableScroll>
    <DataTable variant="grouped">           {/* "default" | "grouped" */}
      <thead>
        <DataTableGroupRow>
          <th className="cb-col" data-empty="true"></th>
          <th colSpan={5}>기본 정보</th>
          <th colSpan={9}>상품 정보</th>
          <th className="col-spacer" data-empty="true"></th>
        </DataTableGroupRow>
        <tr>
          <th className="ld-cb-col"><DataTableCheckbox label="전체 선택"/></th>
          <th className="col-auto">SKU번호</th>
          {/* ... */}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0
          ? <DataTableEmpty colSpan={25} />
          : rows.map(r => (
              <tr key={r.id} data-group={r.isGroupHead}>
                <td className="ld-cb-col"><DataTableCheckbox checked={r.checked}/></td>
                <DataTableCell>{r.skuNo}</DataTableCell>
                <DataTableCell numeric>{r.qty}</DataTableCell>
                <DataTableCell link>{r.barcode}</DataTableCell>
              </tr>
          ))
        }
      </tbody>
    </DataTable>
  </DataTableScroll>
</DataTableHost>
```

| Prop | Component | 설명 |
|---|---|---|
| `variant` | `DataTable` | `"default"` 단일행 thead (h54·14·500) / `"grouped"` 2단 thead (h42·15·500·border-left) |
| `data-group` | `<tr>` | `"true"` 면 group head row → border-top 이 #E0E0E0 (살짝 진함). 그 외 행은 #EBEBEB |
| `data-pad="full"` | `<th>` | thead padding 16 (default 16/8/16/16) |
| `colSpan` | `DataTableEmpty` | 테이블 안 빈 row 로 사용 |

컬럼 width 토큰: `.col-auto` / `.col-small` / `.col-medium` / `.col-large` / `.col-spacer`. 자세한 룰은 [`docs/table-columns.md`](./table-columns.md).

## PageHead

```jsx
import { PageHead, PageTitle, PageActions, ActionButton } from '@/design-system/components';

<PageHead>
  <PageTitle>SKU 관리</PageTitle>
  <PageActions>
    <ActionButton variant="primary">SKU 단건 등록</ActionButton>
    <ActionButton>일괄 업로드</ActionButton>
  </PageActions>
</PageHead>
```

타이틀 26/600/lh36.4. 액션 버튼 h44 / 검정 outlined / `variant="primary"` 시 검정 filled. `count` prop 으로 우측 숫자 (accent 컬러).

## FilterBar

floating-label 패턴, 필수 = 파란 4×4 점, focus 시 보더 검정.

```jsx
import {
  FilterBar, FilterChip, FilterSelect, FilterGroup, FilterInput, FilterSearchButton,
} from '@/design-system/components';

<FilterBar>
  <FilterChip count={0}/>

  <FilterGroup>                       {/* 인접 셀렉트를 한 덩어리로 묶음 */}
    <FilterSelect label="매입형태" required state="filled" value="매입"/>
    <FilterSelect state="placeholder" value="제조구분"/>
  </FilterGroup>

  <FilterSelect label="브랜드 조회" state="placeholder" value="플랫폼"/>
  <FilterSelect state="placeholder" value="브랜드" disabledChev/>

  <FilterGroup>
    <FilterSelect label="SKU 조회" state="placeholder" value="SKU번호"/>
    <FilterInput placeholder="입력"/>
  </FilterGroup>

  <FilterSearchButton disabled>검색</FilterSearchButton>
</FilterBar>
```

| Prop | Component | 설명 |
|---|---|---|
| `state` | `FilterSelect` | `"active"` (선택값 보통) / `"filled"` (선택됨, 굵게) / `"placeholder"` (회색 가이드) |
| `required` | `FilterSelect` | label 옆 파란 4×4 점 |
| `disabledChev` | `FilterSelect` | 의존 필터 비활성 톤 (chev `rgba(0,0,0,0.20)`) |

## AllFilterDrawer (v2.25)

"전체 필터" chip 클릭 시 좌측에서 슬라이드 인. GNB(64) 아래 + LNB(56) 뒤에서 미끄러져 나오며, **딤드 없이 그림자만**으로 깊이감 표현. 다중 선택 섹션은 옵션 많을 때 검색 + 스크롤 리스트.

```jsx
import { AllFilterDrawer } from '@/design-system/components';

const [open, setOpen] = useState(false);
const [filters, setFilters] = useState({/* ... */});

<button onClick={() => setOpen(true)}>전체 필터</button>

<AllFilterDrawer
  open={open}
  onClose={() => setOpen(false)}
  sections={[
    { key:'season', label:'시즌', mode:'single', required:true,
      options:[
        {id:'all', label:'전체', selected:true},
        {id:'s1', label:'24SS'},
        {id:'s2', label:'24FW'},
      ]},
    { key:'brand', label:'브랜드', mode:'multi',
      options:[
        {id:'b1', label:'브랜드 A'},
        {id:'b2', label:'브랜드 B'},
        // ... 100개+ 가능 — 검색 자동 활성
      ]},
    { key:'uid', label:'UID', mode:'codeinput', maxLines:200, value:'' },
  ]}
  onChange={(key, value) => setFilters(f => ({ ...f, [key]: value }))}
  onApply={() => { /* 적용 */ setOpen(false); }}
  onReset={() => { /* 전체 초기화 */ }}
/>
```

| Prop | 설명 |
|---|---|
| `open` | controlled boolean — 드로어 열림 상태 |
| `sections` | `[{ key, label, mode, options?, value?, maxLines?, required? }]` |
| `mode` | `"single"` chip 토글 / `"multi"` 검색+체크박스 / `"codeinput"` textarea |
| `onChange(key, value)` | single → `item\|null`, multi → `items[]`, codeinput → `string[]` |
| `onApply` / `onReset` / `onClose` | 푸터 버튼/외부 클릭/Esc 핸들러 |

## Toast (v2.25)

우측 상단 슬라이드 인 (`translateX(40px) → 0`, 0.25s ease-out) + 닫힐 때 슬라이드 아웃. `success` / `info` / `critical` 3 variants.

```jsx
import { ToastStack, useToast } from '@/design-system/components';

function App() {
  const { toasts, show, dismiss } = useToast();

  return (
    <>
      <button onClick={() => show({ variant:'success', title:'복사 완료', desc:'클립보드에 복사되었습니다.' })}>
        토스트 보이기
      </button>
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
```

| Prop (show) | 설명 |
|---|---|
| `variant` | `"success"` (초록) / `"info"` (파랑) / `"critical"` (빨강) |
| `title` | 굵은 본 라인 |
| `desc` | 부가 설명 (옵션) |
| `duration` | 자동 닫힘 ms (default 3000, 0 이면 수동 닫기만) |

## FilterField (v2.24)

**필터를 한 컴포넌트로 처리** — 셀렉트 버튼 + 팝오버 + 토글/외부닫기/Esc/위치/엑셀paste/카운터/전체 자동처리 까지 자동 wiring.
세부 컴포넌트 `<FilterSelect>`, `<FilterPopover…>` 를 직접 조합할 필요 없이 한 줄로 사용.

```jsx
import { FilterField, FilterFieldGroup } from '@/design-system/components';

// 1) 단일 선택 — "전체" 자동 prepend, 검색바/초기화 미노출, 선택 시 자동 닫힘
<FilterField
  mode="single"
  label="매입형태"
  required
  options={[{ id:'p1', label:'매입' }, { id:'p2', label:'사입' }]}
  onChange={(item) => /* item or null (전체 선택 시) */}
/>

// 2) 다중 선택 — 검색 + "선택됨" 섹션 + 초기화 버튼
<FilterField
  mode="multi"
  label="브랜드"
  options={[{ id:'b1', label:'브랜드 A' }, ...]}
  onChange={(items) => /* selected items array */}
/>

// 3) 코드 입력 (bulk paste — 엑셀 열 붙여넣기 지원)
<FilterField
  mode="codeinput"
  label="UID"
  maxLines={200}
  placeholder="값을 줄바꿈으로 구분해 입력"
  onChange={(lines) => /* string[] */}
/>

// 4) 인접 필터를 한 덩어리로 (보더 공유 + 활성 시 우측 보더 검정 자동)
<FilterFieldGroup>
  <FilterField mode="single" label="매입형태" required options={...} onChange={...} />
  <FilterField mode="single" label="제조구분" options={...} onChange={...} />
</FilterFieldGroup>
```

| Prop | 설명 |
|---|---|
| `mode` | `"single"` / `"multi"` / `"codeinput"` |
| `label` | floating label + placeholder text (필터 타이틀) |
| `required` | 라벨 옆 파란 4×4 점 |
| `options` | single/multi: `[{id, label, selected?}]` (single 의 `'all'` 옵션은 자동 prepend) |
| `maxLines` | codeinput: 최대 코드 줄 수 (default 200) |
| `placeholder` | codeinput: textarea placeholder |
| `disabledChev` | 의존 필터 비활성 톤 (chev `rgba(0,0,0,0.20)`) |
| `onChange` | single → `item \| null` / multi → `items[]` / codeinput → `string[]` |

**자동 처리 동작**:
- floating-label 모션 — 선택 시 라벨이 위로 작아지며 올라가고, "전체" 선택 / 미선택 = placeholder 상태 (라벨 숨김 + 회색 타이틀)
- 단일 선택 popover의 `min-width` = 필터 버튼 가로 (긴 라벨 잘림 방지)
- "[첫값] 외 N-1" 표시 (1개 = 라벨, 2개+ = 첫값 외 N-1)
- 외부 클릭 / Esc / 다른 필터 클릭 → 닫힘

## FilterPopover

`FilterSelect` 클릭 시 펼쳐지는 팝오버 — 3 variants.

### 1. CodeInput (멀티라인 코드 입력)

UID / SKU번호 / 바코드 등 **bulk paste** 용. 280×292, 최대 글자수 카운터(예: 200/200) 내장.

```jsx
import { FilterPopoverCodeInput } from '@/design-system/components';

<FilterPopoverCodeInput
  value={codes}
  onChange={setCodes}
  maxLength={200}
  placeholder="UID 를 줄바꿈으로 구분해 입력"
  onReset={() => setCodes('')}
/>
```

### 2/3. List (검색 + 체크박스 리스트)

카테고리 / 운영상태 / 매핑상태 등 **다중 선택** 필터. 260w 가변 높이.
선택된 항목이 있으면 자동으로 "선택됨" 섹션이 상단에 노출되고 `bg #F5F5F5` 로 시각화.

```jsx
import { FilterPopoverList } from '@/design-system/components';

const [items, setItems] = useState([
  { id: 1, label: '신발 > 스포츠화 > 러닝화', selected: true },
  { id: 2, label: '신발 > 스포츠화 > 러닝화', selected: true },
  { id: 3, label: '신발 > 스포츠화 > 농구화', selected: false },
]);
const [q, setQ] = useState('');

<FilterPopoverList
  items={items.filter(i => !q || i.label.includes(q))}
  searchValue={q}
  onSearchChange={setQ}
  searchPlaceholder="검색"
  selectedSectionLabel="선택됨"
  onItemToggle={(id, next) => setItems(prev => prev.map(i => i.id === id ? { ...i, selected: next } : i))}
  onReset={() => setItems(prev => prev.map(i => ({ ...i, selected: false })))}
/>
```

| Prop | 설명 |
|---|---|
| `items` | `[{ id, label, selected }]` |
| `searchValue` / `onSearchChange` | 검색어 controlled state |
| `selectedSectionLabel` | 선택된 항목 섹션 라벨 (default `"선택됨"`) |
| `onItemToggle(id, nextSelected)` | 체크/해제 핸들러 |
| `onReset` | 초기화 버튼 핸들러 |

### 4. Multi (v2.26 — 모드 토글 + 좌우 2단)

목록선택 / 직접입력 모드 토글 + 검색 + 좌우 2단(검색결과 / 선택됨). 선택됨 컬럼은 light-blue `#F0F7FF` (hover `#E2F1FF`), 체크박스 없이 우측 ✓ 마크.

```jsx
import { FilterPopoverMulti } from '@/design-system/components';

<FilterPopoverMulti
  items={items}
  mode={mode} onModeChange={setMode}
  searchValue={q} onSearchChange={setQ}
  onItemToggle={(id, next) => /* ... */}
  codeValue={code} onCodeChange={setCode}
  maxLines={1000}
  onReset={() => /* ... */}
/>
```
- `data-pop-mode="code"` 시 width 280px (코드 입력 팝오버와 동일)
- 직접입력 mode: textarea 에 `ta.value` 직접 셋팅 + `setSelectionRange` 로 cursor 점프 방지 (paste/delete 안전)

---

## StickyTable / FrozenColumns / CellSelection / setupStickyScrollStack (v2.26)

데이터 리스트 페이지의 sticky stack + dual-table thead + 가로 고정 컬럼 + Excel-style 셀 선택을 처리하는 vanilla JS 유틸. (자세한 패턴: [`data-list-page.md`](./data-list-page.md#v2260--sticky-stack--frozen-columns).)

### `setupStickyTable(tableEl, options?)`

`thead` 만 별도 테이블로 분리해 sticky 컨테이너로 이동, 본문/헤더 colgroup 동기화, 가로 스크롤 sync.

```js
import { setupStickyTable } from '@/design-system/components';
setupStickyTable(document.querySelector('.mp-table-scroll > .mp-table'));
```

| Option | 설명 |
|---|---|
| `headSelector` | sticky thead 컨테이너 selector (default `.mp-thead-sticky .mp-thead-scroll`) |
| `bodyScrollSelector` | 본문 가로 스크롤 컨테이너 selector (default `.mp-table-scroll`) |

`<StickyTable>` React wrapper 도 export (children 안의 `.mp-table-scroll > .mp-table` 자동 init).

### `applyFrozenColumns(tableEl, frozenCount)`

첫 N 컬럼을 `position:sticky; left:<누적 px>` 로 고정. 본문 첫 행의 너비를 측정해 `--frozen-l1..N` CSS 변수에 누적 left 셋팅.

```js
import { applyFrozenColumns } from '@/design-system/components';
applyFrozenColumns(tableEl, 6);
```

- 평면 thead/tbody 면 자동으로 `col-frozen-N` 클래스 부여
- group-row 에 `colspan` 이 큰 그룹 셀이 frozen 영역을 가로지르면 **HTML 마크업에 직접** `col-frozen-3 col-frozen-group` 명시 (split)
- frozen ↔ scrolling 경계 1px boundary line 은 CSS 가 처리 (`col-frozen-6 + td { border-left:0 }`)

### `setupCellSelection(tableEl)` → teardown fn

Excel-like 드래그 선택 + Cmd/Ctrl+C TSV 클립보드 (Excel/Sheets 호환).

```js
import { setupCellSelection } from '@/design-system/components';
const teardown = setupCellSelection(tableEl);
// teardown() 으로 이벤트/클래스 제거
```

- mousedown → 앵커, drag → 범위, mouseup → 끝
- 표 바깥 mousedown → 해제
- copy → TSV (tab/newline/quote 들어간 셀은 RFC 4180 quote-escape)
- 인터랙티브 요소(체크박스/링크/버튼)는 통과 (선택만 해제)

### `setupStickyScrollStack({ filterSelector, statsSelector })` → teardown fn

filter/stats 단의 `offsetHeight` 를 ResizeObserver 로 관측해서 `--scm-sticky-filter` / `--scm-sticky-stats` CSS 변수를 갱신. GNB(64) 는 layer-desktop.css 에 정적 `--scm-sticky-gnb`.

```js
import { setupStickyScrollStack } from '@/design-system/components';
setupStickyScrollStack({
  filterSelector: '.mp-filter-bar',
  statsSelector:  '.mp-stats-row',
});
```

`useStickyScrollStack(opts)` React hook 도 export.

## StatsBar

좌측: counts + mini-actions / 우측: download · pager · pgsize.

```jsx
import {
  StatsBar, StatsBarLeft, StatsCountsWrap, StatsCounts, StatsMiniActions,
  Stat, StatDivider, VDivider, MiniAction,
  StatsBarRight, DownloadButton, Pager, PageSize,
} from '@/design-system/components';

<StatsBar>
  <StatsBarLeft>
    <StatsCountsWrap>
      <StatsCounts>
        <Stat tone="all"        label="전체"   num={120}/>
        <StatDivider/>
        <Stat tone="accent"     label="전개중" num={87}/>
        <StatDivider/>
        <Stat tone="muted"      label="미전개" num={33}/>
      </StatsCounts>
    </StatsCountsWrap>
    <VDivider/>
    <StatsMiniActions>
      <MiniAction>코드 복사</MiniAction>
      <MiniAction disabled>전개 여부 변경</MiniAction>
    </StatsMiniActions>
  </StatsBarLeft>

  <StatsBarRight>
    <DownloadButton/>
    <VDivider/>
    <Pager current={1} total={9} prevDisabled nextDisabled={false}/>
    <PageSize value={100}/>
  </StatsBarRight>
</StatsBar>
```

## InfoBanner

회색 톤 안내 (Figma SCM Hub 변형). 토글 가능.

```jsx
import { InfoBanner } from '@/design-system/components';

<InfoBanner title="SKU 생성 및 매핑 주의사항">
  SKU 단건 등록 : ...<br/>
  상품 매핑 : ...<br/>
  상품 등록 후 매핑 : ...<br/>
  SKU 속성 일괄 변경 : ...
</InfoBanner>
```

## EmptyState

테이블 외부에서도 사용 가능한 standalone 빈 상태. 노란 삼각형 + 16/600 타이틀 + 15/400 #666 desc.

```jsx
import { EmptyState } from '@/design-system/components';

<EmptyState
  title="검색 조건을 설정해 주세요."
  desc="조회하실 조건을 입력하고 검색을 시작해 주세요."
/>
```

테이블 row 로 사용하려면 `<DataTableEmpty colSpan={N}/>` 사용.
