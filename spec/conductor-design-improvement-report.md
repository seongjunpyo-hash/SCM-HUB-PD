# 컨덕터 설계 개선 — 조사 결과 보고서

| 항목 | 내용 |
|---|---|
| 작성일 | 2026-10-22 |
| 작성 경위 | 성준님 지시 "컨덕터를 개선하고자 하는데 우선 설계부터" — SCM-HUB-PD 세션에서 조사·설계 |
| 상세 설계서 | `seongjunpyo-hash/SCM-HUB-PD` 브랜치 `claude/conductor-design-improvement-br7rkl` 의 `spec/conductor-v3-dev-mirror-design.md` (커밋 a2799fd). PR 은 만들지 않음 |
| 이 문서 | 위 설계서의 결론 요약 (목적·이유·개선안·근거). 데스크톱 세션으로 이어서 작업하기 위한 인계용 |

---

## 1. 무엇을 바꾸려 하나 (목적)

컨덕터를 **"데모를 만드는 도구"** 에서 **"dev 레포 화면을 그대로 비추고(mirror), dev 별 공통 DS 버전과 변경·깨짐을 관리하는 허브"** 로 바꾼다.

성준님이 정한 전제:

1. **편집 기능과 핸드오프를 없앤다.** dev 를 그대로 미러링해서 dev 코드를 가져온다. 데모는 곧 dev 에 바로 구현한다.
2. **기존 화면은 이미 작업이 끝났다.** 개선·수정은 dev 의 기존 화면에서 일어난다.
3. **신규 화면은 Figma 또는 Claude 플러그인 기반으로 dev 에 바로 구현한다.** 레포 공통 DS(pbo-core 등) + 컨덕터의 코드 DS(가이드·규칙) 를 쓴다.
4. **공통 DS 버전이 dev 마다 다르다.** dev 에 바로 작업하면 무엇이 깨지고 바뀌었는지 dev 별로 컨덕터가 관리하게 한다.
5. **개발자들이 컨덕터에서 데모를 만들지 않고 바로 dev 에서 만든다.** 컨덕터가 이 흐름에 맞게 바뀌어야 한다.

## 2. 왜 바꾸나 (이유와 근거)

조사 범위: SCM-HUB-PD 레포(데모·디자인시스템·핸드오프 문서), `pbo-prd-to-demo` 스킬 문서, Supabase `conductor_*` 테이블 실측. `pbo-conductor` 레포 자체는 해당 세션에서 접근 불가.

### 2-1. 실측한 현재 상태 (Supabase, 2026-10-22)

| 영역 | 수치 |
|---|---|
| 화면(PageSchema) | `conductor_pages` 78장, `conductor_page_versions` 146 |
| 편집 | `conductor_editing` 잠금 1,329행, `conductor_components` 레지스트리(ds=core) |
| 생성 | `gen-*` draft 16장 (`meta.gen.status` draft/promoted, 출처 agent/json) |
| VOC | 106건 (open 62 / resolved 44) |
| 퍼블리시 | 요청 9건 approved, published 5장 |
| 핸드오프 | `conductor_handoffs` 1,246건 — stage `intent` 968 (payload: schema·comments·liveSpecs·capabilities, mode rebuild 915 / apply 52) → stage `pr` 278 (package_dir·conductor_sha·pr_url, 예: musinsa/mwms-fe#1589) |
| dev 레포 | moms → `moms-fe`, mwms → `mwms-fe`, scm-portal/partner → `mss-mfs-fe`, moss → `mss-o4o-fe`, PDA |
| **dev 별 DS 버전** (핸드오프 `ds_version`) | **moms-fe 0.8.2** (이력 0.7.8→0.7.9→0.7.10→0.8.0→0.8.1→0.8.2→0.8.4), **mwms-fe 0.8.5~0.8.6**, mss-mfs-fe 0.8.2, mss-o4o-fe 0.8.2 |
| 백업 테이블 | `*_bak_*`, `legacy_backup_*` 등 70여 개 |
| 가이드/규칙 | `conductor_library_config` 의 `guide:filter/table/title/group`, `guide:grp:*`, `gen:rules`, `lnb` |

### 2-2. 문제

1. **진실 원천이 둘** — PageSchema(데모) 와 dev 코드. 개발자가 dev 에서 바로 만들면 데모는 즉시 낡는다. 실제 행동도 그렇다.
2. **편집·핸드오프 codegen 이 가장 무거운 유지비** — 레지스트리(core.*/cmp.*), 반입 게이트, 캔버스, 패키지 생성, PR 생성 전부 PageSchema 에 묶여 있다. dev 코드가 원천이 되면 불필요.
3. **DS 버전 드리프트가 보이지 않는다** — 데모는 항상 최신 레지스트리로 그려지고 dev 는 0.8.2~0.8.6 으로 제각각. "데모에선 되는데 dev 에선 깨짐" 이 반복되는데 기록되는 곳이 없다.
4. **기존 화면 78장은 역할을 다했다.**

### 2-3. "편집만 빼면 미러링이 되나?" 에 대한 답

아니다. 편집 제거는 두 번째 원천을 더 만들지 않게 하는 조치일 뿐, dev 코드가 컨덕터에 **보이게** 되지는 않는다. 컨덕터는 PageSchema 렌더러이고 dev 는 라우터·인증·API 에 묶인 독립 React 앱이라 그대로 실행되지 않는다. 따라서 **dev 레포 쪽에서 내보내는 어댑터(Action) + 컨덕터 쪽 수신(ingest)** 이 별도로 필요하다.

## 3. 개선안 (To-Be)

### 3-1. 원칙

| # | 원칙 |
|---|---|
| P1 | 코드가 원천 — 컨덕터 안에서 화면을 편집하지 않는다 |
| P2 | 편집·핸드오프 없음 — 핸드오프는 PR 그 자체 |
| P3 | 기존 화면은 dev 에서 수정, 컨덕터는 전/후·DS 영향·깨짐 표시와 코멘트→PR 연결 |
| P4 | 신규 화면은 Figma 또는 Claude 플러그인 → dev 직행. 컨덕터는 등록·추적·검수 |
| P5 | DS 버전은 dev(사이트) 별로 관리 |
| P6 | dev 레포에 요구하는 것은 어댑터 1개(`conductor.config` + GitHub Action) |

### 3-2. 아키텍처

```
dev 레포(*-fe) ── conductor.config + conductor-mirror.yml(Action)
   push/PR 마다: DS 버전 수집 → mock 빌드 + 화면 manifest(라우트·소스파일·DS 컴포넌트 사용) → Playwright 스크린샷 → POST /api/mirror/builds
                                   │
pbo-conductor ── Mirror Store(mirror_builds/screens/snapshots, R2) · DS Registry(ds_releases, site 별 버전)
               · Change Ledger(screen_changes: visual diff·ds-bump·code·PR) · VOC(anchor = site×routeKey×sha)
               · Guides(guide:*, gen:rules — 플러그인·lint 가 소비)
UI: 홈(사이트 카드) │ 화면 목록 │ 화면 뷰어(정보/변경/VOC/검사) │ DS 버전 매트릭스 │ 변경 피드 │ 신규 화면 등록 │ 가이드
```

미러 레벨(사이트별 선택): **L0 스크린샷**(항상) → **L1 정적 번들 + mock**(권장 목표, dev 가 mock 소유) → **L2 라이브 프리뷰 URL**.

### 3-3. 데이터 모델 요지

- 신규: `mirror_sites`, `mirror_builds`(sha·branch·pr·ds_versions·manifest), `mirror_screens`(site×routeKey 영속, origin existing/figma/claude-plugin, status registered→in-progress→review→live), `mirror_snapshots`(screenshot·ds_usage·lint), `ds_releases`(pkg·version·breaking), `screen_changes`(두 빌드 비교: pixel diff·ds bump·PR·검수 상태).
- 기존: `conductor_voc` 유지(anchor 확장), `conductor_handoffs` 읽기 전용 이력 + 화면 시드, `conductor_pages/versions/published/publish_requests` 아카이브 동결, `conductor_editing/components` 폐기, `guide:*`/`gen:rules` 유지, 백업 테이블 일괄 삭제.

### 3-4. 워크플로우 3종

- **F1 기존 화면 수정**: dev 수정 → PR → Action ingest → 컨덕터 "작업중" + before/after + DS 영향 → PD 검수(VOC→PR 코멘트, 승인=GitHub review) → 머지 → "라이브" + 이력.
- **F2 신규 화면**: PD 가 [신규 화면 등록](Figma/PRD·사이트·라우트·**해당 사이트 DS 버전 자동 고정**) → 플러그인 프롬프트 복사 → Claude Code + 개편 스킬(`pbo-prd-to-dev`, 산출물은 PageSchema 가 아니라 dev 레포 코드) → PR → F1 과 동일.
- **F3 DS 버전 업**: pbo-core 릴리즈 ingest → 매트릭스 "뒤처짐 ▲N" + 영향 화면(breaking × 사용) 산출 → 업그레이드 브랜치 미러 → 화면별 diff → 수정·머지.

### 3-5. 화면 IA (Ant Design 기준, 7종)

홈 사이트 카드(DS 버전·빌드·변경·깨짐·VOC 통계) / 사이트 › 화면 목록(Table) / 화면 뷰어(iframe 또는 스크린샷 + 정보·변경·VOC·검사 탭, 브랜치·PR 전환, before/after 슬라이더) / DS 버전 매트릭스(사이트×패키지, 셀 클릭 → 릴리즈·breaking·영향 화면 Drawer) / 변경 피드(Timeline, 검수 승인=GitHub review) / 신규 화면 등록 Steps 위저드 / 가이드(읽기 전용).
제거: 편집 캔버스·컴포넌트 라이브러리·레지스트리·생성 캔버스·퍼블리시 요청함·핸드오프 생성·편집 잠금. 기존 데모 78장은 "아카이브".

### 3-6. dev 레포 어댑터 계약

- `conductor.config.ts`: site · routes('auto' 또는 명시) · dsPackages · mirror{level, build 명령, screenshot 옵션}
- `.github/workflows/conductor-mirror.yml`: `pbo-conductor` 의 reusable workflow 호출 래퍼(10줄). 시크릿 `CONDUCTOR_INGEST_TOKEN`
- manifest: `{site, repo, sha, branch, pr, dsVersions, screens[{routeKey, route, title, menuPath, sourceFiles, dsUsage, screenshot, lint}], bundle}`
- API: `POST /api/mirror/builds`, `GET /api/mirror/sites/:id/screens`, `GET /api/guides`, `POST /api/ds/releases`, `POST /api/voc/:id/to-github`

### 3-7. 마이그레이션 (파일럿 mwms-fe)

0. 합의·파일럿 준비(2주): config·workflow·ingest·`mirror_*` 테이블, handoffs 로 화면 시드
1. 읽기 전용 미러(3주): 홈·목록·뷰어·DS 매트릭스, 편집·핸드오프·퍼블리시 feature flag 로 숨김, 데모 아카이브
2. 변경·검수·신규 등록(3주): 변경 피드·visual diff·VOC↔PR·위저드·플러그인 개편
3. DS 거버넌스·확장(4주): ds_releases·영향 분석·시뮬레이션, 나머지 사이트 온보딩, 레거시 테이블 정리

## 4. 결정 필요 사항

| # | 질문 | 권장 |
|---|---|---|
| D1 | mock 전략 — L0 로 시작 vs 파일럿부터 L1 | L0 시작, mwms 에서 L1 검증 |
| D2 | 번들 호스팅 — 컨덕터 R2 vs dev preview(L2) | R2(L1) |
| D3 | VOC 저장소 — 컨덕터 유지+PR 전송 vs GitHub 완전 이동 | 유지+전송 (현업은 GitHub 계정 없음) |
| D4 | DS breaking 출처 — CHANGELOG `## Breaking` 규약 vs changeset | 규약 합의 + 수동 등록 병행 |
| D5 | musinsa org *-fe 레포 GitHub App 설치 범위 | org 관리자 확인 |
| D6 | gen draft 16장·데모 78장 보존 기간 | 3단계 후 덤프·삭제 |
| D7 | PDA 미러 뷰포트·레포 | 별도 레포 여부 확인 |

## 5. 남긴 산출물

- 설계서: `seongjunpyo-hash/SCM-HUB-PD` / 브랜치 `claude/conductor-design-improvement-br7rkl` / `spec/conductor-v3-dev-mirror-design.md`
- 이 보고서: 같은 브랜치 `spec/conductor-design-improvement-report.md`
- PR 없음
