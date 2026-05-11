# musinsa-platform — 4 도메인 디자인 시스템 + 데모 플랫폼

Musinsa 사내 시스템 4 도메인의 데모/디자인 시스템 + 공통 인프라.

```
musinsa-platform/
├── hub/                            ← 전체 도메인 관리 (인덱스 + auth)
├── design-system/                  ← 공통 디자인 시스템 (별도 CDN 배포)
│   ├── core/                       ← 마크업 + JS 행동 (모든 layer 공유)
│   └── layers/                     ← 시각 layer (토큰 set)
│       ├── layer/                  ← scm-hub
│       ├── phase/                  ← scm-portal, o4o
│       └── flow/                   ← logistics
├── domains/                        ← 도메인별 데모
│   ├── scm-hub/        (uses layer)
│   ├── scm-portal/     (uses phase)
│   ├── o4o/            (uses phase)
│   └── logistics/      (uses flow)
├── voc-core/                       ← 도메인 공통 VOC 편집 시스템
├── supabase/                       ← DB schema + RLS migration
└── legacy/                         ← 원본 마크업 fixture
```

## 도메인 ↔ Layer 매핑

| 도메인 | Layer | 비고 |
|---|---|---|
| `scm-hub` | `layer` | SCM Hub. SCM-HUB-PD repo 별개 운영, 이 platform 의 CDN 으로 디자인 시스템 import |
| `scm-portal` | `phase` | (TBD) |
| `o4o` | `phase` | scm-portal 과 phase 공유 |
| `logistics` | `flow` | 신규 |

## 빠른 시작

### 0일차 — 환경 세팅

```bash
# 1. 의존성 (정적 시스템이라 build 없음)
# 별도 install 불필요. Live Server 또는 http-server 만 있으면 됨.

# 2. Supabase 환경 변수
cp hub/.env.example hub/.env
# .env 의 SUPABASE_URL / SUPABASE_ANON_KEY 채우기

# 3. 로컬 실행
npx http-server . -p 8080
```

### 도메인 추가 시

`design-system/CLAUDE.md` 의 컴포넌트 작성 규칙 + 이 파일 끝의 도메인 추가 체크리스트 참고.

## 인프라

- **Backend**: Supabase (Auth + Postgres + Realtime + Storage)
- **Frontend**: 정적 HTML/CSS/JS (build 없음)
- **Hosting**: Cloudflare Pages × 2 — `platform.pages.dev` (this) + `design-system.pages.dev` (CDN)
- **Repo 구조**: SCM-HUB-PD 는 별 repo 그대로 운영, 이 platform 의 CDN 디자인 시스템을 import

## 도메인 추가 체크리스트

1. `domains/<name>/` 디렉토리 생성
2. `supabase/migrations/` 에 `domains` 테이블 row insert SQL 추가
3. `hub/index.html` 의 카드 목록에 도메인 추가
4. 사용할 layer 결정 (layer/phase/flow 중) — 없으면 새 layer 추가
5. 첫 페이지 1개 — `legacy/<name>/` 의 fixture 보고 마크업 작성
6. `auth-gate.js` 의 path prefix 권한 규칙에 도메인 추가 (필요 시)

## 관련 문서

- `CLAUDE.md` — 플랫폼 전역 아키텍처 원칙
- `design-system/CLAUDE.md` — 컴포넌트 작성 규칙
- `supabase/README.md` — DB schema + RLS 정책 가이드
