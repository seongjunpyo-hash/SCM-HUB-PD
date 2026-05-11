# Getting Started — musinsa-platform 0일차 가이드

이 문서는 musinsa-platform 을 처음부터 끝까지 셋업하는 단계별 가이드. 각 단계는 누가 무엇을 하는지 명시:

- 🤖 **자동** — AI 가 이미 만들어둔 파일/구조. 너는 확인만.
- 👤 **수동** — 너가 직접 해야 할 작업.
- ✅ **검증** — 그 단계 완료 확인 방법.

전체 소요시간: **약 90분** (Cloudflare 설정 포함).

---

## 0. 개요 — 무엇을 만드는가

musinsa-platform 은 4 도메인 (`scm-hub`, `scm-portal`, `o4o`, `logistics`) 의 데모 + 공통 디자인 시스템 + 도메인 관리 홈를 통합한 정적 플랫폼.

```
                      ┌─────────────────────────┐
                      │   musinsa-platform.com  │  ← home (auth + 도메인 카드)
                      │   /home/, /scm-portal/, …│
                      └────────────┬────────────┘
                                   │
                                   ▼  CDN <link>/<script>
                      ┌─────────────────────────┐
                      │     ds.musinsa.com      │  ← design-system (core + layers)
                      └────────────┬────────────┘
                                   │
                                   ▼  AUTH + DATA
                      ┌─────────────────────────┐
                      │   xxx.supabase.co       │  ← Supabase
                      │   - auth.users          │
                      │   - domains             │
                      │   - user_domains        │
                      │   - conductor_versions / …    │
                      └─────────────────────────┘
```

- **정적 시스템**: build 없음, HTML/CSS/JS 그대로
- **Backend**: Supabase (Auth + Postgres + RLS)
- **Hosting**: Cloudflare Pages × 2 (platform / design-system)
- **SCM-HUB-PD repo 는 별개로 유지** — design-system CDN 만 import 해서 통합

---

## 1. 사전 준비 [👤 수동]

다음 계정/도구가 필요:

| 항목 | 용도 | 비용 |
|---|---|---|
| GitHub 계정 | repo 생성 | 무료 |
| Supabase 계정 ([supabase.com](https://supabase.com)) | 백엔드 | 무료 tier OK |
| Cloudflare 계정 ([cloudflare.com](https://cloudflare.com)) | hosting | 무료 |
| 도메인 (선택) | `musinsa-platform.com`, `ds.musinsa.com` | 보유 시 |
| 사내 이메일 | Magic Link 테스트 | - |

**도구**:
- [Git](https://git-scm.com/) (macOS 기본 탑재)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (선택, web Studio 만으로도 OK)
- 텍스트 에디터 (VS Code 등)

---

## 2. Step 1 — Local 골격 받기 [🤖 자동 + 👤 수동]

🤖 **이미 완료**: SCM-HUB-PD 의 `claude/musinsa-platform-skeleton` branch 에 `musinsa-platform/` 폴더로 골격 push 됨. 폴더 구조:

```
musinsa-platform/
├── CLAUDE.md                          ← 플랫폼 전역 원칙
├── README.md                          ← 빠른 시작
├── GETTING_STARTED.md                 ← 이 문서
├── home/                               ← 도메인 관리 홈
│   ├── auth-gate.js
│   ├── index.html
│   ├── login.html
│   ├── forbidden.html
│   └── .env.example
├── design-system/
│   ├── CLAUDE.md                      ← 컴포넌트 작성 규칙
│   ├── core/components/               ← (빈 — 단계 9 에서 SCM-HUB-PD 의 컴포넌트 복사)
│   └── layers/
│       ├── layer/tokens.css           ← scm-hub 용
│       ├── phase/tokens.css           ← scm-portal / o4o
│       └── flow/tokens.css            ← logistics
├── domains/{scm-hub,scm-portal,o4o,logistics}/
├── supabase/
│   ├── README.md
│   └── migrations/
│       ├── 0001_initial.sql           ← 5 테이블 + RLS
│       └── 0002_seed_domains.sql      ← 4 도메인 시드
├── conductor/                          ← (단계 12 에서)
└── .github/workflows/deploy.yml       ← Cloudflare Pages
```

👤 **너가 할 것**: macOS 에서 그 폴더만 떼서 별 디렉토리로:

```bash
# 1. SCM-HUB-PD 의 해당 branch checkout
cd ~/Documents/GitHub/SCM-HUB-PD     # 또는 너의 SCM-HUB-PD 경로
git fetch origin claude/musinsa-platform-skeleton
git checkout claude/musinsa-platform-skeleton

# 2. musinsa-platform 폴더만 별 위치로 복사
cp -r musinsa-platform ~/Documents/GitHub/musinsa-platform

# 3. SCM-HUB-PD 는 main 으로 복귀 (clutter 방지)
git checkout main
```

✅ **검증**:

```bash
ls ~/Documents/GitHub/musinsa-platform
# CLAUDE.md  README.md  GETTING_STARTED.md  home/  design-system/  domains/  supabase/  ...
```

---

## 3. Step 2 — GitHub 새 repo 생성 [👤 수동]

1. [github.com/new](https://github.com/new) 접속
2. Repository name: **`musinsa-platform`**
3. Private ✅
4. **"Add a README" / ".gitignore" / "license" 모두 체크 해제** (빈 repo)
5. Create repository
6. 생성 후 표시되는 URL 기록 (예: `git@github.com:yourname/musinsa-platform.git`)

✅ **검증**: 빈 repo 페이지가 "Quick setup" 안내를 보여줌.

---

## 4. Step 3 — Local 폴더를 GitHub 에 push [👤 수동]

```bash
cd ~/Documents/GitHub/musinsa-platform

# git init + 첫 commit
git init -b main
git add -A
git commit -m "chore: initial skeleton — home + design-system + 4 domains + supabase schema"

# 위 Step 2 에서 만든 repo URL 로 push
git remote add origin git@github.com:yourname/musinsa-platform.git
git push -u origin main
```

✅ **검증**: GitHub 의 repo 페이지에서 파일 트리가 보임.

---

## 5. Step 4 — Supabase project 생성 [👤 수동]

1. [supabase.com/dashboard](https://supabase.com/dashboard) 로그인
2. **New project** 클릭
3. 입력:
   - Organization: 본인 organization (없으면 생성)
   - Name: `musinsa-platform`
   - Database password: **강력한 비밀번호 + 안전한 곳에 기록** (나중에 필요)
   - Region: `Northeast Asia (Seoul)` 추천
   - Pricing plan: Free
4. Create new project (생성에 약 2분)

✅ **검증**: project 대시보드가 열림. 좌측 메뉴에 SQL Editor / Authentication / Table Editor 보임.

---

## 6. Step 5 — DB schema + RLS 적용 [👤 수동]

방법 A (web Studio) 권장:

1. project 대시보드 → 좌측 **SQL Editor** 클릭
2. **+ New query** 클릭
3. `supabase/migrations/0001_initial.sql` 의 내용 전체 복사 → 붙여넣기 → **Run**
   - 결과: "Success. No rows returned" 같은 메시지
4. **+ New query** 다시
5. `supabase/migrations/0002_seed_domains.sql` 의 내용 전체 복사 → 붙여넣기 → **Run**

방법 B (Supabase CLI):

```bash
cd ~/Documents/GitHub/musinsa-platform
npm i -g supabase
supabase login
supabase link --project-ref <YOUR_PROJECT_REF>   # project 대시보드의 Settings → General → Reference ID
supabase db push
```

✅ **검증**:
- 좌측 **Table Editor** → 5 테이블 (`domains`, `user_domains`, `conductor_versions`, `conductor_comments`, `conductor_edits`) 보임
- `domains` 테이블에 4 row (scm-hub / scm-portal / o4o / logistics)
- 좌측 **Authentication** → **Policies** → 각 테이블에 RLS 정책들 보임

---

## 7. Step 6 — Auth provider 활성화 [👤 수동]

### Magic Link (필수)

1. 좌측 **Authentication** → **Providers**
2. **Email** 항목 펼치기 → **Enable Email provider** 가 켜져 있는지 확인 (기본 켜짐)
3. **Confirm email** 옵션 — 사내 환경이라면 **OFF 추천** (Magic Link 만으로 가입+로그인 한 번에)

### Google OAuth (선택, 추천)

1. 같은 화면의 **Google** 펼치기 → **Enable Google provider**
2. [Google Cloud Console](https://console.cloud.google.com) 에서 OAuth 2.0 Client ID 생성:
   - Authorized redirect URI: `https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback`
3. Client ID + Client Secret 을 Supabase 의 Google provider 설정에 입력
4. **Save**

### URL 설정

1. 좌측 **Authentication** → **URL Configuration**
2. **Site URL**: `http://localhost:8080` (개발 중) — 나중에 prod 도메인으로 교체
3. **Redirect URLs** 에 다음 추가:
   - `http://localhost:8080/home/`
   - `https://musinsa-platform.pages.dev/home/` (Step 10 이후)

✅ **검증**: Providers 화면에서 Email / Google 옆에 초록 토글.

---

## 8. Step 7 — Supabase 키를 코드에 주입 [👤 수동]

1. project 대시보드 → 좌측 **Settings** → **API**
2. 다음 두 값 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Project API keys** → **anon (public)**: `eyJhbG...` (긴 JWT)
3. macOS 에서 `home/config.js` 새 파일:

```js
// home/config.js — Supabase 키 주입. .gitignore 됨.
window.__MUSINSA_PLATFORM__ = {
  supabaseUrl:     'https://xxxxx.supabase.co',
  supabaseAnonKey: 'eyJhbG...',
};
```

4. `home/index.html` 과 `home/login.html` 의 `<script src="/home/auth-gate.js">` **앞에** `<script src="/home/config.js"></script>` 추가:

```html
<head>
  <script src="/home/config.js"></script>           <!-- 추가 -->
  <script src="/home/auth-gate.js"></script>
  ...
```

> **anon key 는 공개돼도 안전** (RLS 가 진짜 권한 검증) 하지만, 코드 검색 용이성 차원에서 분리 권장.

✅ **검증**: `home/config.js` 가 `.gitignore` 의 룰 (`home/config.js`) 로 무시되는지 `git status` 로 확인.

---

## 9. Step 8 — 로컬 실행 + Magic Link 첫 로그인 [👤 수동]

```bash
cd ~/Documents/GitHub/musinsa-platform
npx http-server . -p 8080
```

브라우저 [http://localhost:8080/home/](http://localhost:8080/home/) 접속:

1. auth-gate 가 미인증 감지 → `/home/login.html?next=/home/` 리다이렉트
2. 사내 이메일 입력 → **매직 링크 전송**
3. 메일함에서 링크 클릭 → 자동 로그인 → `/home/` 로 돌아옴
4. **단**: 도메인 카드들이 "접근 권한 없음" 표시 (아직 user_domains 에 본인 row 없음)

✅ **검증**:
- 로그인 후 home 상단에 본인 이메일 표시
- Supabase Studio → Authentication → Users → 본인 row 1개 생김

---

## 10. Step 9 — 본인을 super 역할로 등록 [👤 수동]

1. Supabase Studio → **Authentication** → **Users** → 본인 row 의 **UID 복사**
2. **SQL Editor** → **+ New query**:

```sql
insert into user_domains (user_id, domain_id, role) values
  ('PASTE_YOUR_UID_HERE', 'scm-hub',    'super'),
  ('PASTE_YOUR_UID_HERE', 'scm-portal', 'super'),
  ('PASTE_YOUR_UID_HERE', 'o4o',        'super'),
  ('PASTE_YOUR_UID_HERE', 'logistics',  'super');
```

→ **Run**

3. 브라우저에서 `localhost:8080/home/` 새로고침

✅ **검증**: 도메인 카드 4개가 활성 (클릭 가능) 상태로 노출. 각 카드에 "권한: super" 표시.

---

## 11. Step 10 — Cloudflare Pages 배포 (platform) [👤 수동]

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 로그인 → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. GitHub 연동 + `musinsa-platform` repo 선택
3. 빌드 설정:
   - **Build command**: (빈 칸)
   - **Build output directory**: `/` (root)
   - **Production branch**: `main`
4. **Save and Deploy**
5. 배포 완료 후 URL 확인: `https://musinsa-platform.pages.dev`

### Supabase URL Configuration 추가

1. Supabase Studio → **Authentication** → **URL Configuration**
2. **Redirect URLs** 에 추가:
   - `https://musinsa-platform.pages.dev/home/`
3. **Save**

### 환경 변수 주입 (config.js)

`config.js` 는 `.gitignore` 라 repo 에 없음 → Cloudflare 에서 배포 시 빠짐. 두 가지 대안:

**A. config.js 를 repo 에 직접 commit** (anon key 는 공개 안전)
**B. Cloudflare Pages 의 Build environment 에 변수 등록 후 build hook 으로 inject** (복잡)

→ **A 추천**: `.gitignore` 의 `home/config.js` 한 줄을 제거 + commit + push.

✅ **검증**: `https://musinsa-platform.pages.dev/home/` 접속 → 로그인 + 도메인 카드 노출.

---

## 12. Step 11 — Cloudflare Pages 배포 (design-system CDN) [👤 수동]

1. Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. 같은 `musinsa-platform` repo 선택
3. 빌드 설정:
   - **Project name**: `musinsa-design-system`
   - **Build command**: (빈 칸)
   - **Build output directory**: `design-system`
   - **Production branch**: `main`
4. Save and Deploy
5. URL 확인: `https://musinsa-design-system.pages.dev`

### (선택) 커스텀 도메인 매핑

도메인 보유 시:
1. project → **Custom domains** → **Set up a custom domain**
2. `ds.musinsa.com` 입력 → DNS 자동 설정 안내 따라 진행

✅ **검증**: `https://musinsa-design-system.pages.dev/CLAUDE.md` 접속 시 파일 다운로드. `https://musinsa-design-system.pages.dev/layers/layer/tokens.css` 도 동일.

---

## 13. Step 12 — design-system core 채우기 (SCM-HUB-PD 의 컴포넌트 이전) [👤 + 🤖]

지금까지 `design-system/core/components/` 는 비어있음. SCM-HUB-PD 의 design system 을 이전.

### 옵션 A — 통째 이전 (가장 빠름)

```bash
cd ~/Documents/GitHub/musinsa-platform

# SCM-HUB-PD 의 design system 폴더 → core/components 로 복사
cp -r ~/Documents/GitHub/SCM-HUB-PD/"design system"/components/* design-system/core/components/

git add design-system/core/components
git commit -m "feat(design-system): import components from SCM-HUB-PD"
git push
```

### 옵션 B — 한 컴포넌트씩 이전하며 토큰 분리 (정확)

각 컴포넌트의 raw hex 를 토큰 변수로 교체하며 1개씩 PR. 시간 오래 걸리지만 깔끔.

> **추천**: 옵션 A 로 일단 통째 이전 + 일부 페이지 PoC 후, 점진적으로 토큰화 PR 누적.

✅ **검증**: `https://musinsa-design-system.pages.dev/core/components/button/button.css` 접속 시 CSS 다운로드.

---

## 14. Step 13 — scm-hub 의 한 페이지 CDN PoC [👤]

SCM-HUB-PD 의 한 페이지 (예: `sku-list.html`) 의 `<link>` / `<script>` 를 musinsa-design-system CDN 으로 교체.

Before:
```html
<link rel="stylesheet" href="../design system/components/button/button.css" />
```

After:
```html
<link rel="stylesheet" href="https://musinsa-design-system.pages.dev/layers/layer/tokens.css" />
<link rel="stylesheet" href="https://musinsa-design-system.pages.dev/core/components/button/button.css" />
```

✅ **검증**: 페이지가 외부 CDN 의 CSS 로 정상 렌더. 시각 회귀 없음.

---

## 15. 다음 단계 (Step 14+)

위 13 단계가 끝나면 0일차 + 주차 1 완료. 이후:

| 주차 | 작업 |
|---|---|
| 2 | home auth-gate 의 path prefix 권한 규칙 확정. SCM-HUB-PD 의 모든 페이지에 CDN 적용 (sed 일괄) |
| 3 | `domains/logistics/` 의 첫 페이지 1~2개 (flow layer 토큰 작성) |
| 4 | `conductor/` 분리 — SCM-HUB-PD 의 `dev-export.js` + `voc/` 를 이 platform 으로 이전 + localStorage → Supabase 로 데이터 전환 |
| 5 | `domains/scm-portal/`, `domains/o4o/` (phase layer 사용) |

---

## 부록 A — 트러블슈팅

### Magic Link 메일 안 옴
- Supabase 의 무료 tier 는 메일 발송 quota 가 시간당 3건. 잠시 후 재시도.
- 스팸 메일함 확인.
- 사내 메일 서버가 supabase.io 도메인 차단했을 수도 — IT 에 문의.

### 로그인 후 즉시 로그아웃됨
- `home/config.js` 의 SUPABASE_URL / SUPABASE_ANON_KEY 가 다른 project 의 값으로 잘못 들어갔을 가능성.
- Supabase URL Configuration 의 Redirect URLs 에 현재 origin 이 등록 안 됨.

### 도메인 카드가 안 보임
- `user_domains` 테이블에 본인 user_id row 가 있는지 SQL Editor 로 확인:
  ```sql
  select * from user_domains where user_id = '<YOUR_UID>';
  ```
- RLS 가 본인 row 만 보여줘서 — anon key 가 아닌 본인 세션으로 호출돼야 함. 로그인 안 됐으면 0 row.

### Cloudflare Pages 빌드 실패
- Build command 가 비어있는지 확인 (정적이라 빌드 불필요).
- Output directory 가 올바른지 (`/` 또는 `design-system`).

### CORS 에러 (CDN ↔ platform)
- 정적 CSS/JS 는 보통 CORS 불필요. 만약 발생하면 Cloudflare Pages 의 Headers 설정에 `Access-Control-Allow-Origin: *` 추가.

---

## 부록 B — 비용 추정

| 서비스 | tier | 한도 | 비고 |
|---|---|---|---|
| GitHub | Free | private repo 무제한 | OK |
| Supabase | Free | 500MB DB / 2GB bandwidth / 50,000 MAU | 사내 데모 수준이면 충분 |
| Cloudflare Pages | Free | 빌드 500회/월 / 무제한 요청 | OK |

→ **월 $0 으로 운영 가능**. 사용량 늘면 Supabase Pro ($25/월) 정도가 첫 업그레이드 후보.

---

## 부록 C — 단계 요약 체크리스트

너가 할 일만 시간 순:

- [ ] 1. SCM-HUB-PD 의 `claude/musinsa-platform-skeleton` branch 에서 musinsa-platform 폴더 추출
- [ ] 2. GitHub 에 빈 `musinsa-platform` repo 생성
- [ ] 3. 추출한 폴더 → git init + push
- [ ] 4. Supabase project 생성
- [ ] 5. `0001_initial.sql` + `0002_seed_domains.sql` 실행
- [ ] 6. Email + Google OAuth provider 활성화 + URL Configuration
- [ ] 7. `home/config.js` 작성 + Supabase URL/anon key 주입
- [ ] 8. `npx http-server . -p 8080` → Magic Link 첫 로그인
- [ ] 9. `user_domains` 에 본인을 super 로 4 도메인 등록
- [ ] 10. Cloudflare Pages 에 platform 배포
- [ ] 11. Cloudflare Pages 에 design-system 배포
- [ ] 12. SCM-HUB-PD 의 design system 을 core/components 로 이전
- [ ] 13. SCM-HUB-PD 의 한 페이지로 CDN PoC

---

## 부록 D — 자주 묻는 질문

**Q. SCM-HUB-PD 와 musinsa-platform 의 사용자 데이터는 분리되나?**
A. (b) 선택했으므로 별 repo + 별 Supabase project = 별 user pool. 미래에 통합하려면 user export/import 또는 SSO 도입.

**Q. SCM-HUB-PD 의 현 Conductor (구 VOC) 데이터 (localStorage) 는 어떻게?**
A. 일단 그대로. 단계 4주차의 conductor 분리 시점에 SCM-HUB-PD 의 localStorage → Supabase 로 마이그레이션 스크립트 작성 (사용자 본인이 본인 브라우저에서 export → import).

**Q. design-system 의 토큰을 새로 만들어야 하는가? PBO 토큰 재사용 가능?**
A. layers/layer/tokens.css 에 SCM-HUB-PD 의 musinsa-tokens/* 를 그대로 import 하거나 통합 가능. 12 단계에서 결정.

**Q. 사내 SSO (Google Workspace) 와 연동 가능?**
A. Google OAuth provider 활성화 + Google Workspace 의 OAuth 도메인 화이트리스트로 사내 이메일만 통과 가능.

---

질문이 생기거나 막히는 단계가 있으면 그 단계 번호 + 에러 메시지/스크린샷을 알려줘. 단계별로 trouble shoot 해줄게.
