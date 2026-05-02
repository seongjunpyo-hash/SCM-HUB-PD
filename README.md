# SCM Hub Workspace

무신사 SCM Hub 의 디자인 시스템 + 시뮬레이션 도구 + 데모 페이지 + 핸드오프/스펙 문서를 한 곳에 모은 통합 워크스페이스.

---

## 📁 폴더 구조

```
scm hub/                      ← 워크스페이스 루트 (git repo)
├── index.html                # 진입점 (4 카드: 시뮬레이션 / 데모 / 핸드오프 / 스펙)
├── README.md                 # (이 파일)
├── .gitignore
│
├── design system/            # 🎨 디자인 시스템 + 시뮬레이션 도구
│   ├── index.html            #    시뮬레이션 시스템 허브
│   ├── prd-validate/         #    PRD 검증 (4-step wizard)
│   ├── simulator/            #    AI 와이어프레임 시뮬레이터
│   ├── catalog/              #    컴포넌트 카탈로그
│   ├── components/           #    scm-* 컴포넌트 모듈 (CSS/JS)
│   ├── icons/                #    SVG 아이콘 자산 (159개)
│   ├── layer-desktop.css     #    디자인 토큰
│   ├── cloudflare-worker/    #    AI API 프록시 (선택)
│   └── 시뮬레이터-실행.command  #    더블클릭 실행
│
├── demo/                     # 🏢 SCM Hub 실제 페이지 데모
│   ├── index.html            #    무탠 전개상품 관리
│   ├── dashboard.html
│   ├── sku-management.html
│   ├── sku-detail.html
│   ├── sku-register.html
│   ├── editshop-restock-request.html
│   └── editshop-restock-status.html
│
├── handoff/                  # 📦 디자이너 ↔ 개발자 핸드오프 산출물
├── spec/                     # 📋 PRD / 비즈니스 요구사항 / API 스펙
└── legacy/                   # 🗑 옛 .legacy.html / 미사용 파일 보관
```

---

## 🚀 빠른 시작

### 로컬 실행

```bash
cd "/Users/seongjunpyo/Documents/A.I/SCM HUB/scm hub"
python3 -m http.server 8080
```

또는 `design system/시뮬레이터-실행.command` 더블클릭.

브라우저에서:
- **워크스페이스 진입점**: http://localhost:8080/
- **시뮬레이션 시스템**: http://localhost:8080/design system/
- **SCM Hub 데모**: http://localhost:8080/demo/dashboard.html

### 시뮬레이터 사용

1. `design system/` 진입
2. **PRD 검증** 카드 → 4-step wizard 로 PRD 입력 + 검증
3. 검증 통과 → **시뮬레이터** 카드 잠금 해제
4. 좌측 「키 입력」 으로 Anthropic API 키 (`sk-ant-...`) 입력
5. AI 가 PRD 분석 → 와이어프레임 자동 생성
6. 좌측 spec 패널에서 컬럼/필터/액션 직접 편집 (학습 누적)

---

## 🧩 디자인 시스템 사용

`scm-*` 컴포넌트는 자가포함 — CSS + (필요 시) JS 만 link 하면 작동.

```html
<link rel="stylesheet" href="design system/layer-desktop.css" />
<link rel="stylesheet" href="design system/components/scm-table/scm-table.css" />
<link rel="stylesheet" href="design system/components/page-head/page-head.css" />
```

전체 컴포넌트 인벤토리는 [컴포넌트 카탈로그](./design system/catalog/) 참고.

---

## 📤 Git 배포

```bash
cd "/Users/seongjunpyo/Documents/A.I/SCM HUB/scm hub"
git add .
git commit -m "Restructure — workspace 통합"
git push
```

GitHub Pages 배포 시:
- Settings → Pages → Source: `Deploy from a branch` → `main` / root
- 배포 URL: `https://<user>.github.io/<repo>/`

> ⚠️ AI 키 (`sk-ant-...`) 는 절대 commit 하지 마세요. 클라이언트 BYOK 로만 입력 받음. Cloudflare Worker 도 secret 으로 관리.

---

## 🔧 Cloudflare Worker (선택)

팀 공유 시 매 사용자가 키 입력하지 않게 Worker 프록시 배포 가능. 자세한 내용은 [`design system/cloudflare-worker/worker.js`](./design system/cloudflare-worker/worker.js) 상단 주석 참고.

---

## 📦 핸드오프 / 📋 스펙

- **handoff/** — Figma export, 명세서, 가이드, screenshots 등
- **spec/** — PRD, 비즈니스 요구사항, 데이터 모델, API 스펙

작업 단위로 하위 폴더 생성 권장 (예: `handoff/2026-05-sku-management/`, `spec/sku-management-prd.md`).

---

## 🗑 Legacy

`legacy/scm-hub/` 안에 옛 `.legacy.html` 파일들과 미사용 자산 보관 (참고용).
