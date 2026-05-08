# Pilot 비교 검증 — 무탠 페이지 (legacy vs scm-* 모듈 기반)

> 두 파일을 시각/동작 비교하기 위한 체크리스트.
>
> 목적: scm-* 모듈로 리라이트한 페이지가 legacy 페이지와 시각/동작 동등성을 유지하는지 검증.
> 작성: 2026-05-01

## 비교 대상

| | 파일 | 라인 |
|---|---|---|
| Legacy | `scm hub/index.html` | 3,875 |
| Pilot (scm-* 모듈 기반) | `scm hub/index.scm.html` | 625 (-83%) |

## 자동 비교 결과 (텍스트 기반)

### 메트릭 감소율

| 항목 | Legacy | Pilot | 감소 |
|---|---|---|---|
| 총 라인 | 3,875 | 625 | **-83%** |
| 인라인 `<style>` 라인 | 1,028 | 71 | **-93%** |
| 인라인 `<script>` 라인 | 2,193 | 186 | **-91%** |

### 외부 의존성

- Legacy: `layer-desktop.css` + `scm-table.css` (2개)
- Pilot: 47개 모듈 (CSS 47 + JS 47)

### Legacy 클래스 잔존 검사

| Prefix | 잔존 여부 | 비고 |
|---|---|---|
| `mp-page-*`, `mp-action-btn`, `mp-stats-*`, `mp-filter-*`, `mp-modal-*`, `mp-mini-*`, `mp-deploy-*`, `mp-sizeset`, `mp-link`, `mp-cb`, `mp-color-chip`, `mp-empty-hint` | ❌ 없음 (모두 scm-* 로 교체) | |
| `sd-*` | ❌ 없음 | |
| `bu-*` (CSS 클래스) | ❌ 없음 (모두 `scm-bu-*` 로 교체) | ID 는 일부 `id="bu-modal"` 등 식별자로만 잔존 — 마이너 |
| `af-*` | ❌ 없음 | |
| `mp-table`, `mp-table-host` | ✅ 잔존 (의도적) | Stage 9 마이그레이션 대상 |
| `data-mp-filter="..."` 속성 | ✅ 잔존 (마이너) | `scm-filter-select` 의 식별자. Stage 12 시 `data-filter-key` 로 정리 가능 |

## 시각 비교 — 사용자 체크리스트

브라우저에서 두 파일을 나란히 (또는 탭 전환으로) 열어서 비교.

### A. 페이지 헤드 / 골격

- [ ] **Topbar**: 64px 높이, 좌측 메뉴버튼 + 로고 + Demo 태그, 우측 사용자 정보. 스크롤 시 sticky.
- [ ] **LNB 좌측**: 56px 폭, 메뉴 아이콘만. 메뉴 버튼 클릭 시 260px 로 확장 / 다시 56px 로 축소.
- [ ] **페이지 제목**: "무탠 전개상품 관리" — 26/600 검정.
- [ ] **일괄 업로드 버튼**: outlined h44, 우측 정렬.

> Pilot 단순화 사항: LNB 메뉴 항목을 3개로 단순화 (Legacy 는 풀 메뉴 트리). 시각/위치는 동일.

### B. 필터바

- [ ] **전체 필터 칩**: outlined h44, 좌측 SVG + "전체 필터" + 카운트(파랑 600).
- [ ] **개별 필터 셀렉트들**: floating label 패턴. placeholder 시 라벨 숨김 (회색 value), filled 시 라벨이 위로 떠 작은 폰트로 + value 검정.
  - "시즌" (filled = 26-SS)
  - "대표스타일" (placeholder)
  - "컬러" (placeholder)
  - "카테고리" (placeholder)
  - "UID" (placeholder)
  - "SKU번호" (placeholder)
  - "스토어 전개 여부" (filled = 전개중)
- [ ] **필터바 가로 스크롤**: 셀렉트 많으면 좌우 스크롤. 좌/우 끝에 fade gradient.
- [ ] **검색 버튼** (h44 outlined disabled-default 톤) + **초기화 버튼** (ghost, 회전 화살표 svg).
- [ ] **Sticky**: topbar 아래 (top: 64) 에 sticky.

### C. Stats bar

- [ ] **좌측 카운트**: "전체 12 · 전개중 8 · 미전개 4" (3×3 점 divider 사이).
  - 전체: 검정 600
  - 전개중: 파랑 600 (#245EFF)
  - 미전개: 회색 600 (#666)
- [ ] **미니액션**: "코드 복사" / "전개 여부 변경 (disabled)" — h36 outlined.
- [ ] **우측 toolbar**: timestamp + 다운로드 버튼 + v-divider + 페이저 (1/1) + "100개씩" 페이지사이즈.
- [ ] **Sticky**: filter-bar 아래 (top: 64+76) 에 sticky.

### D. 데이터 테이블 (mp-table — Stage 9 마이그레이션 전이라 legacy 클래스 그대로)

- [ ] 6 행 데이터 표시 (Legacy 는 12 행).
- [ ] 컬럼: 체크박스 / 대표스타일 / 컬러칩 / 전개 pill+chev / 사이즈 N/M / 스타일명 / 시즌 태그 / UID / SKU / 바코드 / 등록일시.
- [ ] **체크박스** (16×16 SVG): 헤더 + 각 행. 클릭 시 검정 체크.
- [ ] **컬러 칩** (h28 회색): "미디엄 인디고" / "워시드 블랙" 등.
- [ ] **전개 pill**: 파랑 (전개중) / 회색 (미전개), 좌측 dot + 라벨, 우측 chevron.
- [ ] **사이즈 셋 버튼**: "전개 5/9" — 5 파란색 600 강조, /9 회색.
- [ ] **시즌 태그**: 회색 h28 (26-SS, 26-FW).
- [ ] **UID/SKU/바코드 link**: underline.

### E. 인터랙션 (클릭 동작)

- [ ] **일괄 업로드 버튼 클릭** → 1024w 모달 표시. warning 배너, type-section 라디오 ("신규 등록"/"수정"), 닫기/제출 버튼.
- [ ] **모달 닫기 버튼 / backdrop / ESC** → 모달 닫힘.
- [ ] **warning 토글 버튼** → list 접힘/펼침 + chev 회전.
- [ ] **검색 버튼 클릭** → 우상단 토스트 ("필터 적용 완료").
- [ ] **초기화 버튼 클릭** → 우상단 토스트 ("필터 초기화 완료").
- [ ] **페이지사이즈 "100개씩" 클릭** → popup 표시, 옵션 (20/50/100/200) 선택 가능.
- [ ] **코드 복사 미니액션 클릭** → dropdown popup ("대표스타일 복사 / SKU번호 복사 / 바코드 복사") 표시. 선택 시 토스트.
- [ ] **전체 필터 칩 클릭** → 좌측 480w 필터 드로어 슬라이드 인 (top: 64 위치, 토픽 헤더 아래).
- [ ] **셀의 deploy chevron 클릭** → 옵션 popover (전개중/미전개) 표시. 옵션 선택 시 pill 톤 변환 + 토스트.
- [ ] **셀의 UID/SKU/바코드 link 클릭** → code-popover (코드 묶음 보기 + 복사 버튼).
- [ ] **셀의 사이즈 셋 버튼 클릭** → 토스트 (Pilot 단순화 — Stage 9 후 사이즈 detail drawer).

### F. Sticky 동작

- [ ] 페이지 하단으로 스크롤하면:
  1. topbar (top: 0) 항상 보임
  2. filter-bar (top: 64) 가 topbar 아래 sticky
  3. stats-bar (top: 64+76) 가 filter-bar 아래 sticky
- [ ] 가로 스크롤 시 LNB 와 main 영역 grid 가 적절히 처리.

## 알려진 단순화 / 차이 (Pilot 의도적)

| 항목 | Legacy | Pilot 차이 |
|---|---|---|
| 데이터 행 | 12 행 | 6 행 |
| LNB 메뉴 트리 | 풀 메뉴 (다중 그룹 + 2뎁스) | 3개 항목만 (간소화) |
| 필터 select 클릭 | popover (codeinput / list / list-single 등) | 토스트 (Stage 7 모듈은 있으나 페이지 logic 미연결) |
| 사이즈 detail drawer | 드로어 + 사이즈 테이블 | 토스트 (Stage 9 후 마이그레이션) |
| `mp-table` | 인라인 클래스 사용 (scm-table 모듈이 mp-* 정의 보유) | 동일 (Stage 9 시 일괄 리네임) |
| 셀 selection 로직 (Ctrl+클릭, Shift+클릭) | 풀 구현 | 단순 토글만 |
| view transition / prerender | 활성 | 비활성 |
| Toast SVG 아이콘 | 페이지 svg sprite 의 ic-checkCircle-filled 등 | 빈 svg (sprite 없음) — 토스트 박스는 보이나 아이콘만 빠짐 |

## 자동 검증 통과 항목

- HTML 구조 정합 (`htmlparser2`) ✅
- 47 모듈 CSS / JS path 모두 실제 파일 가리킴 ✅
- 인라인 mp-* / sd-* / af-* 클래스 잔존 없음 (마이너 `mp-table` 만 의도적) ✅

## 검증 후 다음 단계

브라우저에서 시각/동작 체크 후 결과를 알려주세요:

- **모두 OK** → (b) Stage 9 (scm-table 마이그레이션) 진입
- **일부 차이 발견** → 차이 항목 알려주시면 모듈 spec 보정 후 다시 비교
- **모듈 추가 필요** → 어떤 부분이 빠졌는지 알려주시면 모듈 추출

## 권장 비교 방법

1. 두 파일을 같은 윈도우 사이즈로 (1440px+) 열기
2. 위 체크리스트 A~F 순서대로 항목별 확인
3. 시각 차이 발견 시: 스크린샷 또는 어느 항목인지 표시
4. 인터랙션 차이 발견 시: 어느 동작이 안 되는지 표시
