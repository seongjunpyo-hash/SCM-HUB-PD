# 컨덕터 v3 설계 — "데모 빌더" 에서 "Dev 미러 + DS 거버넌스 허브" 로

| 항목 | 내용 |
|---|---|
| 대상 | `pbo-conductor` (배포: `pbo-conductor.seongjun-pyo.workers.dev`, DB: Supabase `conductor_*`) |
| 작성일 | 2026-10-22 |
| 상태 | **설계 초안 — 구현 전 합의용** |
| 범위 | 편집·핸드오프 제거, dev 레포 미러링, dev 별 DS 버전·변경 관리, 신규 화면 파이프라인 재정의 |
| 비범위 | pbo-core 컴포넌트 자체 변경, dev 레포 내부 아키텍처 변경 (미러 어댑터 1개 추가만) |

---

## 0. 한 줄 요약

> 컨덕터는 더 이상 **데모를 만드는 곳** 이 아니라, **dev 레포에 이미 있는 화면을 그대로 비추고(mirror), dev 별 공통 DS 버전과 변경·깨짐을 추적하는 곳** 이 된다.
> 화면의 진실 원천(source of truth) 은 PageSchema JSON 이 아니라 **dev 레포의 코드** 다.

---

## 1. 왜 바꾸나 (As-Is 진단)

### 1-1. 현재 구조 (2026-10 기준 실측)

| 영역 | 현재 | 실측 근거 |
|---|---|---|
| 화면 저장 | PageSchema JSON (`conductor_pages`, 78장) + 버전 (`conductor_page_versions`, 146) | Supabase |
| 편집 | 캔버스 편집기 + 편집 잠금 (`conductor_editing`, 1,329행) + 컴포넌트 레지스트리 (`conductor_components`, ds=`core`) | Supabase |
| 생성 | PRD → PageSchema draft → 승격 (`meta.gen.status`, `meta.menu`) — `pbo-prd-to-demo` 스킬 | 스킬 문서 |
| VOC | 화면 노드 앵커 코멘트 (`conductor_voc`, 106건: open 62 / resolved 44) | Supabase |
| 퍼블리시 | 검수 요청 → 승인 → `conductor_published` (9건 approved) | Supabase |
| 핸드오프 | `conductor_handoffs` 1,246건. stage `intent`(payload: schema·comments·liveSpecs·capabilities, mode rebuild/apply) → `pr`(package_dir·conductor_sha·pr_url) | Supabase |
| 대상 dev | `moms-fe`(moms) · `mwms-fe`(mwms) · `mss-mfs-fe`(scm-portal/partner) · `mss-o4o-fe`(moss) · PDA | handoff `dev_repo` |
| DS 버전 (dev 별) | moms-fe **0.8.2** (0.7.8→0.8.4 이력) · mwms-fe **0.8.5~0.8.6** · mss-mfs-fe 0.8.2 · mss-o4o-fe 0.8.2 | handoff `ds_version` |

### 1-2. 문제

1. **진실 원천이 둘** — PageSchema(데모) 와 dev 코드. 개발자가 dev 에서 바로 만들면 데모는 즉시 낡는다. 실제로 개발자들은 데모 단계를 건너뛰고 dev 로 간다.
2. **편집·핸드오프 codegen 이 가장 무거운 유지비** — 레지스트리(core.*/cmp.*), 반입 게이트, 캔버스, 패키지 생성, PR 생성 모두 PageSchema 에 묶여 있다. dev 코드가 원천이 되면 전부 불필요.
3. **DS 버전 드리프트가 보이지 않는다** — dev 마다 pbo-core 버전이 다르고(0.8.2 vs 0.8.6), 데모는 항상 최신 레지스트리로 그려지므로 "데모에선 되는데 dev 에선 깨짐" 이 반복된다. 무엇이 바뀌어 무엇이 깨졌는지 dev 별로 기록되는 곳이 없다.
4. **기존 화면은 이미 끝났다** — 78장의 데모는 역할을 다했다. 앞으로 수정은 dev 의 기존 화면에서 일어난다.
5. DB 에 백업 테이블 70여 개(`*_bak_*`) 가 쌓여 있다 — 편집 중심 운영의 흔적.

### 1-3. 바뀌지 않는 것 (유지)

- 인증·권한 (`user_domains.role`: super/admin/dev/member/viewer, `sites`)
- 공지·팀 공지·알림 (`conductor_notices`, `conductor_team_notices`, `conductor_notifications`)
- 디자인 가이드/규칙 (`conductor_library_config` 의 `guide:*`, `gen:rules`) — **Claude 플러그인과 검사(lint) 의 지식 베이스** 로 역할 전환 (읽기 전용 화면 유지)
- VOC — 단, 앵커 대상이 "PageSchema 노드" 에서 "**사이트 × 라우트 × 빌드(sha)**" 로 바뀐다

---

## 2. To-Be 원칙

| # | 원칙 | 의미 |
|---|---|---|
| P1 | **코드가 원천** | 컨덕터는 dev 레포 코드를 그대로 가져와 보여준다. 컨덕터 안에서 화면을 편집하지 않는다. |
| P2 | **편집·핸드오프 없음** | 캔버스 편집기, PageSchema codegen, 핸드오프 패키지·PR 생성 기능 제거. "핸드오프" 는 PR 그 자체. |
| P3 | **기존 화면 = dev 에서 수정** | 컨덕터는 수정 전/후를 비추고, DS 영향과 깨짐을 표시하고, 코멘트를 PR 로 연결한다. |
| P4 | **신규 화면 = Figma 또는 Claude 플러그인 → dev 직행** | 산출물은 PageSchema 가 아니라 dev 레포의 React 코드. 컨덕터는 **등록·추적·검수** 만. |
| P5 | **DS 버전은 dev 별로 관리** | 사이트(dev 레포)마다 공통 DS(pbo-core 등) 버전을 기록하고, 버전 간 변경·깨짐을 화면 단위로 추적한다. |
| P6 | **dev 레포에 요구하는 건 어댑터 1개** | `conductor.config` + GitHub Action 1개. 레포 구조를 바꾸지 않는다. |

---

## 3. 전체 아키텍처

```
┌────────────────────────────── dev 레포 (musinsa/*-fe) ──────────────────────────────┐
│  moms-fe        mwms-fe        mss-mfs-fe        mss-o4o-fe        (PDA)             │
│  pbo-core 0.8.2 pbo-core 0.8.6 pbo-core 0.8.2    pbo-core 0.8.2                      │
│                                                                                      │
│  + conductor.config.ts      ← 사이트 id · 라우트↔화면 매핑 · mock 모드 · DS 패키지 목록│
│  + .github/workflows/conductor-mirror.yml  (pbo-conductor 의 reusable workflow 호출) │
│      push(develop/main) · pull_request 마다:                                          │
│        1) DS 버전 수집 (package.json / lockfile)                                      │
│        2) 미러 빌드 (mock 모드) + 화면 manifest 생성 (라우트·소스파일·DS 컴포넌트 사용) │
│        3) Playwright 스크린샷 (등록된 라우트 전부)                                     │
│        4) POST /api/mirror/builds  (manifest + 번들 + 스크린샷)                        │
└──────────────────────────────────────┬───────────────────────────────────────────────┘
                                       │ ingest (repo token)
┌──────────────────────────────────────▼───────────────────────────────────────────────┐
│                         pbo-conductor (Workers + Supabase)                           │
│                                                                                      │
│  Mirror Store ─ mirror_builds / mirror_screens / mirror_snapshots (번들·스크린샷 R2)  │
│  DS Registry ─ ds_packages / ds_releases(변경·breaking) / site_ds_versions           │
│  Change Ledger ─ screen_changes (visual diff · DS bump · 코드 diff 요약 · PR)        │
│  VOC ─ conductor_voc (anchor = site·routeKey·sha·xy) ↔ GitHub PR review comment      │
│  Guides ─ guide:* / gen:rules (읽기 전용, 플러그인·lint 가 소비)                       │
│                                                                                      │
│  UI: 홈 │ 사이트 › 화면 목록 │ 화면 뷰어(미러) │ DS 버전 │ 변경 피드 │ 신규 화면 등록 │
└──────────────────────────────────────┬───────────────────────────────────────────────┘
                                       │
          ┌────────────────────────────┴──────────────────────────────┐
          │  Figma (신규 화면 원본)         Claude 플러그인 (pbo-* 스킬) │
          │  → 프레임 링크·스크린샷 비교     → dev 레포에 코드 생성 (PR)  │
          └───────────────────────────────────────────────────────────┘
```

### 3-1. 미러 레벨 (사이트별로 선택, 섞어 쓸 수 있음)

dev 앱은 백엔드 없이는 안 뜨는 경우가 많다. 그래서 미러는 세 단계로 둔다.

| 레벨 | 무엇을 비추나 | dev 레포 요구 | 언제 |
|---|---|---|---|
| **L0 스크린샷** | 라우트별 PNG (풀 페이지) | mock 없이도 렌더되는 범위, 실패 시 빈 화면이라도 기록 | 온보딩 첫날부터. 변경 감지·visual diff 의 기본 단위 |
| **L1 정적 번들 + mock** | 빌드 번들을 컨덕터가 호스팅, iframe 으로 조작 가능 | `conductor.config.mock` (MSW 핸들러 또는 fixture) — dev 가 소유 | 상호작용 검수가 필요한 화면. **권장 목표** |
| **L2 라이브 프리뷰 URL** | dev 의 자체 preview 환경(브랜치 배포)을 iframe | preview URL 규약 + 사내망/인증 | 이미 preview 환경이 있는 레포 |

> 기본 = L0 는 항상, L1 은 사이트 온보딩 시 결정. 기존 `conductor_demo_data` 의 더미 데이터는 L1 mock fixture 의 초기값으로 이관한다.

---

## 4. 데이터 모델

### 4-1. 신규 테이블

```sql
-- 사이트(=dev 레포) 연결 설정
mirror_sites (
  id text pk,                 -- 'moms' | 'mwms' | 'mfs' | 'partner' | 'moss' | 'moss-pda'
  dev_repo text,              -- 'musinsa/mwms-fe'
  default_branch text,        -- 'develop'
  mirror_level text,          -- 'L0' | 'L1' | 'L2'
  preview_base_url text,      -- L2 전용
  ds_packages text[],         -- 추적할 패키지: '@musinsa/pbo-core', '@musinsa/layer-tokens', ...
  ingest_token_hash text,
  config jsonb                -- conductor.config 스냅샷
)

-- 빌드 1건 = 레포의 특정 커밋에서 수집한 결과
mirror_builds (
  id uuid pk, site_id text fk,
  sha text, branch text, pr_number int, pr_url text,
  ds_versions jsonb,          -- {'@musinsa/pbo-core':'0.8.6', ...}
  manifest jsonb,             -- 화면 목록 + 소스파일 + DS 컴포넌트 사용
  bundle_url text,            -- L1
  status text,                -- queued | ok | partial | failed
  created_at timestamptz
)

-- 화면 = 사이트 × routeKey (빌드와 무관한 영속 식별자)
mirror_screens (
  id uuid pk, site_id text fk,
  route_key text, route text, title text, menu_path text[],
  source_files text[],        -- 'src/pages/outbound/Schedule.tsx' ...
  origin text,                -- 'existing' | 'figma' | 'claude-plugin' | 'manual'
  figma_url text,
  status text,                -- registered | in-progress | review | live | retired
  owner_dev text, owner_pd text,
  legacy_page_id text,        -- 옛 conductor_pages.id (이력 연결용)
  first_build_id uuid, last_build_id uuid,
  unique(site_id, route_key)
)

-- 빌드별 화면 스냅샷
mirror_snapshots (
  id uuid pk, screen_id uuid fk, build_id uuid fk,
  screenshot_url text, dom_hash text,
  ds_usage jsonb,             -- [{component:'Table', pkg:'@musinsa/pbo-core', version:'0.8.6', count:2}]
  lint jsonb                  -- DS 검사 결과 (deprecated prop, 하드코딩 토큰 등)
)

-- 공통 DS 릴리즈 (pbo-core 레포 태그/CHANGELOG 에서 수집)
ds_releases (
  pkg text, version text, released_at timestamptz,
  changelog text,
  changed_components text[],  -- 변경된 컴포넌트명
  breaking jsonb,             -- [{component, summary, migration}]
  pk(pkg, version)
)

-- 변경 1건 = 같은 화면의 두 빌드 비교 결과
screen_changes (
  id uuid pk, screen_id uuid fk,
  from_build uuid, to_build uuid,
  kinds text[],               -- 'visual' | 'ds-bump' | 'code' | 'new' | 'retired'
  pixel_diff_ratio numeric,   -- 0~1
  ds_bump jsonb,              -- {pkg, from, to, breaking_hits:[...]}
  summary text,
  pr_url text, author text,
  review_status text,         -- none | requested | approved | changes-requested
  created_at timestamptz
)
```

### 4-2. 기존 테이블 처리

| 테이블 | 처리 |
|---|---|
| `conductor_voc`, `conductor_notifications` | 유지. `anchor` 를 `{site, routeKey, sha, x, y}` 로 확장. `page_id` 는 `legacy_page_id` 매핑으로 호환 |
| `conductor_handoffs` | **쓰기 중단 → 읽기 전용 이력**. `dev_route`+`target` 으로 `mirror_screens` 초기 시드 생성 (route_key·dev_route·pr_url·ds_version 활용) |
| `conductor_pages`, `conductor_page_versions`, `conductor_published`, `conductor_publish_requests` | **동결(읽기 전용 "아카이브")**. 해당 화면이 미러에 연결되면 카드에 "dev 로 이관됨" 표시. 1단계 후 삭제 검토 |
| `conductor_editing`, `conductor_components`, `library:removed-elements` | 편집기 제거와 함께 **폐기** |
| `conductor_library_config` (`guide:*`, `gen:rules`, `lnb`) | `guide:*`·`gen:rules` 유지(읽기 전용 KB). `lnb` 는 미러 manifest 의 `menu_path` 로 대체 |
| `conductor_demo_data` | L1 mock fixture 로 이관 후 폐기 |
| `*_bak_*`, `legacy_backup_*`, `bak_00xx_*` (70여 개) | 덤프 보관 후 **일괄 삭제** |

---

## 5. 화면 설계 (IA)

> UI 라이브러리 기준: **Ant Design** (Layout/Sider, Table, Tabs, Descriptions, Timeline, Badge, Tag, Statistic, Steps, Drawer, Image.PreviewGroup).

```
GNB:  [컨덕터]  홈 · 사이트 ▾ · DS 버전 · 변경 피드 · 신규 화면 · 가이드 · (설정)     🔔 프로필
```

### 5-1. 홈 — 사이트 카드 대시보드

```
┌──────────────── MWMS · musinsa/mwms-fe ───────────────┐ ┌─── MOMS · moms-fe ────┐
│ pbo-core 0.8.6  (latest 0.8.6 ✓)                      │ │ pbo-core 0.8.2 ▲4 뒤처짐│
│ 마지막 빌드 f193b5d5 · develop · 2h 전                 │ │ ...                    │
│ 화면 31  변경(7일) 4  깨짐 경고 1  열린 VOC 3           │ │                        │
│ [화면 목록] [DS 영향 보기]                              │ │                        │
└───────────────────────────────────────────────────────┘ └────────────────────────┘
최근 변경 (전 사이트)  ─ Timeline: PR #1589 센터 관리·스토어 관리 (visual 12%) …
```

- 카드 = `mirror_sites` 1행. `Statistic` 4개 + DS 버전 `Tag`(최신 대비 뒤처짐 `Badge`).
- "깨짐 경고" = 최근 빌드에서 `status=failed/partial` 이거나 `screen_changes.ds_bump.breaking_hits` 가 있는 화면 수.

### 5-2. 사이트 › 화면 목록

`Table` + 상단 필터(브랜치/PR · 상태 · 출처 · 변경 유형 · 담당).

| 컬럼 | 내용 |
|---|---|
| 화면 | 제목 + `route` (코드 폰트) + 메뉴 경로 breadcrumb |
| 상태 | `Tag`: 등록됨 / 작업중(PR 열림) / 검수중 / 라이브 / 폐기 |
| 출처 | 기존 · Figma · Claude 플러그인 · 수동 |
| 최근 변경 | PR 링크 + 변경 유형 아이콘(visual / ds-bump / code) + pixel diff % |
| DS | 사용 컴포넌트 수 · breaking 영향 `Badge` |
| VOC | 열린 코멘트 수 |
| 담당 | dev / PD |

행 클릭 → 화면 뷰어. 상단 우측 `[신규 화면 등록]` (PD·super).

### 5-3. 화면 뷰어 (미러) — 핵심 화면

```
┌ 센터 관리  mwms/les/warehouse   [develop ▾] [PR #1589 ▾]   비교: f193b5 ↔ a1c2d3  [열기 ↗] ┐
├────────────────────────────────────────────────────┬─────────────────────────────────────┤
│                                                    │ Tabs: 정보 │ 변경 │ VOC(3) │ 검사(1) │
│   iframe (L1 번들) 또는 스크린샷 (L0)               │                                     │
│                                                    │ [정보]  Descriptions                 │
│   VOC 핀 오버레이 (x,y 정규화 좌표)                  │  라우트 · 소스 파일(링크) · 담당      │
│                                                    │  Figma 프레임 · 최근 PR · 빌드 sha    │
│                                                    │  DS 사용: Table 0.8.6 · Button ×4 …  │
│                                                    │                                     │
│                                                    │ [변경]  before/after 슬라이더·오버레이 │
│                                                    │  pixel diff 12% · DS 0.8.5→0.8.6     │
│                                                    │  breaking: Table.pagination 프롭 변경 │
│                                                    │  코드 diff 요약(파일·+/-)             │
│                                                    │                                     │
│                                                    │ [VOC]  핀 코멘트 스레드               │
│                                                    │  → "PR 코멘트로 보내기" (GitHub)      │
│                                                    │                                     │
│                                                    │ [검사]  DS lint 결과                  │
│                                                    │  하드코딩 색상 3 · deprecated prop 1  │
└────────────────────────────────────────────────────┴─────────────────────────────────────┘
```

- 브랜치/PR 셀렉터로 **같은 화면의 다른 빌드** 를 즉시 전환. "비교" 는 두 빌드의 스냅샷을 `Image` 오버레이/슬라이더로.
- VOC 핀은 화면 좌표(0~1 정규화) 에 앵커 — 빌드가 바뀌어도 위치 유지, 변경된 빌드엔 "이전 빌드 코멘트" 표시.
- VOC → GitHub PR review comment 로 전송(선택). 해결 상태는 양방향 동기(PR 코멘트 resolved → VOC resolved).

### 5-4. DS 버전 — dev 별 매트릭스

```
패키지 ＼ 사이트      MFS      Partner   MOMS      MWMS      MOSS      latest
@musinsa/pbo-core    0.8.2 ▲4 0.8.2 ▲4  0.8.2 ▲4  0.8.6 ✓   0.8.2 ▲4  0.8.6
@musinsa/layer-tokens 1.2.2    1.2.2     1.2.1 ▲1  1.2.2     1.2.2     1.2.2
@musinsa/pbo-assets   1.1.6    …
```

- 셀 클릭 → Drawer: 현재 → latest 사이 `ds_releases` 목록, breaking 항목, **이 사이트에서 영향받는 화면 목록**(사용 컴포넌트 ∩ breaking 컴포넌트) 과 각 화면 링크.
- `[업그레이드 시뮬레이션]` : 안내 — "브랜치 `chore/ds-0.8.6` 에서 bump 후 push 하면 미러 빌드가 자동 생성되고, 변경 피드에서 화면별 before/after 가 뜬다." (컨덕터가 PR 을 직접 만들진 않는다. P2)
- 릴리즈 수집: pbo-core 레포의 태그 + CHANGELOG(`## Breaking` 섹션 규약) 를 Action 으로 ingest. 규약이 없으면 수동 등록 폼 제공.

### 5-5. 변경 피드

전 사이트의 `screen_changes` 타임라인. 카드 = 화면 1건 × PR 1건.

```
┌ 10-20 16:25 · MWMS · PR #1589 · 이나연 ────────────────────────────────────────┐
│ 센터 관리  [visual 12%] [ds-bump 0.8.5→0.8.6]   before ▣  after ▣   검수: 요청됨 │
│ 스토어 관리 [visual 3%]                                               검수: 승인 │
└──────────────────────────────────────────────────────────────────────────────┘
```

- "검수" 는 옛 퍼블리시 요청을 대체. PD 가 `승인 / 수정 요청` 을 누르면 GitHub PR review 로 기록된다(컨덕터 자체 승인 상태는 미러일 뿐).
- 필터: 사이트 · 변경 유형 · 검수 상태 · 기간.

### 5-6. 신규 화면 등록 (옛 "데모 생성" 대체)

`Steps` 4단계 위저드. **산출물은 코드가 아니라 "추적 레코드 + 플러그인 프롬프트"**.

1. **출처** — Figma 링크 / PRD(텍스트·URL·PDF) / Claude 플러그인 프롬프트 복사 / 수동
2. **위치** — 사이트(dev 레포) · 라우트 · 메뉴 경로 · 담당 dev · 담당 PD
3. **DS 고정** — 해당 사이트의 **현재 DS 버전을 자동 표기**(예: mwms-fe pbo-core 0.8.6). 프롬프트에 그대로 박힌다 → "데모는 최신인데 dev 는 옛 버전" 문제 원천 차단
4. **생성** — `mirror_screens` 에 `status=registered`, `origin=figma|claude-plugin` 로 생성. 브랜치명 규약(`feat/<site>-<routeKey>`) 과 **플러그인 프롬프트** 를 복사 제공

이후 자동 추적: 브랜치 push 감지 → `in-progress` → PR 열림 → 미러 빌드 → `review` → 머지 → `live`(= 기존 화면으로 전환). Figma 출처면 Figma 프레임 PNG(Figma API) 와 미러 스크린샷을 "변경" 탭에서 나란히 비교.

### 5-7. 가이드 / 규칙 (읽기 전용)

기존 `guide:filter|table|title|group`, `guide:grp:*`, `gen:rules` 를 그대로 노출. 편집은 super 만. **Claude 플러그인이 이 API(`GET /api/guides`) 를 읽어 프롬프트에 주입** 하고, 미러 "검사" 탭의 lint 규칙 중 자동화 가능한 것(필터 한 줄 4개, 버튼 사이즈 L 등)은 manifest 의 DS 사용 정보로 검사한다.

### 5-8. 제거되는 화면

편집 캔버스 · 컴포넌트 라이브러리 · 레지스트리 관리 · 생성(draft 캔버스) · 퍼블리시 요청함 · 핸드오프 패키지/PR 생성 · 편집 잠금 표시. 기존 데모 78장은 "아카이브" 메뉴(읽기 전용 렌더러만 유지) 로 이동.

---

## 6. 워크플로우

### F1. 기존 화면 수정 (dev 주도)

```
dev: dev 레포에서 수정 → push → PR
  └ Action: 빌드·manifest·스크린샷 → ingest
컨덕터: 화면 상태 "작업중" · 변경 피드 카드(before/after · DS 영향) · 알림(담당 PD)
PD: 뷰어에서 검수 → VOC 핀 → PR 코멘트 / 승인(= GitHub review)
dev: 반영 → 머지 → develop 빌드 ingest → 화면 "라이브" · 변경 이력에 영구 기록
```

### F2. 신규 화면 (Figma 또는 Claude 플러그인 → dev 직행)

```
PD: [신규 화면 등록] (Figma/PRD · 사이트 · 라우트 · DS 버전 자동 고정) → 프롬프트 복사
dev/PD: Claude Code + pbo 스킬(개편판 `pbo-prd-to-dev`) 로 dev 레포에 코드 생성
        - 레포의 DS 버전·컴포넌트 import 경로를 그대로 사용 (레지스트리 아님)
        - 컨덕터 가이드 API 를 읽어 규칙 준수
        - 브랜치 규약으로 push → PR
이후 F1 과 동일 (등록됨 → 작업중 → 검수 → 라이브)
```

### F3. 공통 DS 버전 업 (사이트별)

```
DS 릴리즈(pbo-core 태그) → ingest → ds_releases
컨덕터: 매트릭스에 "뒤처짐 ▲N" · 영향 화면 목록(breaking × 사용) 산출
dev: 업그레이드 브랜치에서 bump → push → 미러 빌드 → 화면별 visual diff
PD/dev: 깨진 화면만 골라 수정 → 머지 → 매트릭스 갱신 · 변경 이력에 "ds-bump" 로 기록
```

---

## 7. dev 레포 어댑터 계약 (P6 — 이것만 요구한다)

### 7-1. `conductor.config.ts`

```ts
export default {
  site: 'mwms',                              // mirror_sites.id
  routes: 'auto',                            // 라우터에서 자동 추출, 또는 명시 배열
  // routes: [{ routeKey:'mwms-les-warehouse', path:'/mwms/les/warehouse', title:'센터 관리', menu:['마스터','센터'] }],
  dsPackages: ['@musinsa/pbo-core', '@musinsa/layer-tokens', '@musinsa/pbo-assets'],
  mirror: {
    level: 'L1',
    build: 'pnpm build --mode conductor',    // mock 모드 빌드 (MSW 등)
    screenshot: { viewport: [1440, 900], waitFor: '[data-page-ready]' },
  },
}
```

### 7-2. Action (reusable workflow)

`.github/workflows/conductor-mirror.yml` 은 `pbo-conductor/.github/workflows/mirror.yml@main` 을 호출하는 10줄짜리 래퍼. 트리거: `push`(default branch), `pull_request`(opened/synchronize). 시크릿: `CONDUCTOR_INGEST_TOKEN`(사이트별).

### 7-3. Manifest 스키마 (ingest 본문)

```jsonc
{
  "site": "mwms", "repo": "musinsa/mwms-fe", "sha": "f193b5d5", "branch": "feat/…", "pr": 1589,
  "dsVersions": { "@musinsa/pbo-core": "0.8.6", "@musinsa/layer-tokens": "1.2.2" },
  "screens": [{
    "routeKey": "mwms-les-warehouse", "route": "/mwms/les/warehouse", "title": "센터 관리",
    "menuPath": ["마스터", "센터"],
    "sourceFiles": ["src/pages/les/Warehouse.tsx", "src/pages/les/components/WarehouseTable.tsx"],
    "dsUsage": [{ "component": "Table", "pkg": "@musinsa/pbo-core", "count": 1 }, { "component": "Button", "count": 4 }],
    "screenshot": "screens/mwms-les-warehouse.png",
    "lint": [{ "rule": "no-hardcoded-color", "file": "…", "line": 42 }]
  }],
  "bundle": "dist.tar.gz"
}
```

DS 사용 추출은 import 정적 분석(ts-morph) 으로 충분하다 — 런타임 계측은 1단계 비범위.

### 7-4. ingest API

| 메서드 | 경로 | 역할 |
|---|---|---|
| POST | `/api/mirror/builds` | manifest + 번들 + 스크린샷 업로드 → `mirror_builds` 생성, 화면 upsert, 스냅샷·변경(diff) 계산 큐잉 |
| GET | `/api/mirror/sites/:id/screens` | 화면 목록 (UI·플러그인 공용) |
| GET | `/api/guides` | 가이드/규칙 (플러그인 주입용) |
| POST | `/api/ds/releases` | DS 릴리즈 ingest (pbo-core 레포 Action) |
| POST | `/api/voc/:id/to-github` | VOC → PR review comment |

---

## 8. 권한

| 역할 | 할 수 있는 것 |
|---|---|
| super / admin | 사이트 연결·토큰 발급, 가이드 편집, 아카이브 삭제, 릴리즈 수동 등록 |
| pd | 신규 화면 등록, 검수(승인/수정 요청), VOC, 담당 지정 |
| dev | 레포 어댑터 설정 확인, 변경 피드·DS 매트릭스, VOC 답변, PR 링크 갱신 |
| member / viewer / 현업 | 열람 + VOC 코멘트 |

---

## 9. 마이그레이션 단계

| 단계 | 기간(안) | 내용 | 완료 기준 |
|---|---|---|---|
| **0. 합의·파일럿 준비** | 2주 | 본 설계 확정. 파일럿 = **mwms-fe**(가장 활발, 0.8.6). `conductor.config` + reusable workflow + ingest API + `mirror_*` 테이블. `conductor_handoffs` 로 화면 시드 | mwms develop 빌드가 컨덕터에 들어오고 화면 목록이 뜬다 |
| **1. 읽기 전용 미러** | 3주 | 홈·화면 목록·뷰어(L0→L1)·DS 매트릭스. 편집·핸드오프·퍼블리시 메뉴 **feature flag 로 숨김**. 기존 데모 "아카이브" 이동 | PD 가 mwms 화면을 컨덕터에서 보고 VOC 를 남긴다 |
| **2. 변경·검수·신규 등록** | 3주 | 변경 피드 + visual diff + VOC↔PR 연동 + 신규 화면 위저드 + 플러그인 개편(`pbo-prd-to-dev`) | 신규 화면 1건이 등록→PR→검수→라이브 를 컨덕터에서 끝까지 추적된다 |
| **3. DS 거버넌스·확장** | 4주 | ds_releases ingest, breaking × 사용 영향 분석, 업그레이드 시뮬레이션. moms-fe·mss-mfs-fe·mss-o4o-fe 온보딩. 레거시 테이블·백업 테이블 정리 | 한 사이트의 DS bump 가 "영향 화면 N개" 로 사전에 보이고, 머지 후 diff 로 확인된다 |

롤백: 각 단계는 feature flag 로 켜고 끈다. 1단계까지는 기존 편집기 코드가 남아 있으므로 플래그만 내리면 원복.

---

## 10. 결정 필요 사항 (구현 전 답이 필요한 것)

| # | 질문 | 권장안 |
|---|---|---|
| D1 | mock 전략 — 각 dev 레포가 MSW/fixture 를 소유하는가, 아니면 L0 스크린샷으로 시작하는가 | **L0 로 시작, 파일럿(mwms) 에서 L1 검증 후 사이트별 결정** |
| D2 | 번들 호스팅 — 컨덕터 저장소(R2) vs dev 의 preview 환경(L2) | **R2 호스팅(L1)**. 사내망 의존 없음, 커밋 단위 보존 |
| D3 | VOC 의 최종 저장소 — 컨덕터 유지 vs GitHub PR 코멘트로 완전 이동 | **컨덕터 유지 + PR 로 전송(단방향 → 2단계에서 양방향)**. 현업 계정은 GitHub 이 없다 |
| D4 | DS breaking 변경의 출처 — pbo-core CHANGELOG 규약(`## Breaking`) 또는 changeset | **CHANGELOG 규약 합의 + 수동 등록 폼 병행** |
| D5 | GitHub App 설치 범위 (musinsa org 의 *-fe 레포) — PR 코멘트·리뷰 쓰기 권한 | org 관리자 확인 필요 |
| D6 | 기존 gen draft(`gen-*` 16장) 와 데모 78장 — 아카이브 보존 기간 | 3단계 종료 후 덤프 보관·삭제 |
| D7 | PDA(`v2-moss-pda`) 의 미러 뷰포트·레포 | 별도 레포인지 확인 후 결정 |

---

## 11. 성공 지표

- 개발자가 컨덕터 "밖" 에서 만든 화면의 **컨덕터 노출 지연** : 머지 후 10분 이내
- 각 사이트의 **DS 버전이 컨덕터와 실제 lockfile 에서 항상 일치** (드리프트 0)
- DS bump 시 **사전 영향 화면 목록과 머지 후 실제 깨짐 목록의 일치율** 80% 이상
- 신규 화면 1건의 등록→라이브 전 구간이 컨덕터에서 추적되는 비율 100%
- 편집기·핸드오프 관련 코드·테이블 제거로 운영 테이블 수 100+ → 20 이하

---

## 부록 A. 용어

| 용어 | 뜻 |
|---|---|
| 사이트 | 컨덕터의 권한·셸 단위이자 dev 레포 1개 (mfs/partner 는 같은 레포 `mss-mfs-fe`) |
| 미러 | dev 레포의 특정 커밋을 컨덕터가 수집해 보여주는 것 (스크린샷/번들/프리뷰) |
| 화면(screen) | 사이트 × routeKey 로 식별되는 영속 단위. 빌드가 바뀌어도 같은 화면 |
| 변경(change) | 같은 화면의 두 빌드 비교 결과 (visual · ds-bump · code · new · retired) |
| 공통 DS | `@musinsa/pbo-core`(components-desktop 등) · `@musinsa/layer-tokens` · `@musinsa/pbo-assets` 등 레포 외부 패키지 |
| 코드 DS | 컨덕터가 보관하는 가이드·규칙(`guide:*`) — 플러그인·lint 가 소비하는 지식 |

## 부록 B. 옛 개념 → 새 개념 매핑

| 옛 (v2) | 새 (v3) |
|---|---|
| PageSchema 편집 | 없음 (dev 코드 수정) |
| 생성 draft → 승격 → LNB | 신규 화면 등록 → PR → 라이브 |
| 퍼블리시 요청/승인 | PR 검수(GitHub review 미러) |
| 핸드오프 intent → pr | `screen_changes.pr_url` (PR 그 자체) |
| 레지스트리 core.*/cmp.* | dev 레포의 실제 DS import (manifest `dsUsage`) |
| `conductor_demo_data` | dev 레포 mock fixture |
| 편집 잠금 | 없음 (git 이 담당) |
