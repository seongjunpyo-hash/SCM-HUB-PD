# Handoff — 디자이너 ↔ 개발자 인계 산출물

## 두 종류의 핸드오프

### 1. ⚡ Production 적용용 (`prod-ready/`) — 항시 최신
디자인시스템 토큰 + AG Grid override + 컴포넌트 레시피.
**개발자가 production 코드에 그대로 적용** 할 수 있는 최소 셋.

위치: 이 repo 의 [`prod-ready/`](../prod-ready/) 폴더
적용 가이드: [`prod-ready/README.md`](../prod-ready/README.md)
다운로드 페이지: [`handoff/index.html`](./index.html)

### 2. 📂 작업별 산출물 (이 폴더 안의 하위 폴더)
PRD 검토·시뮬레이션 결과 + Figma export + spec 문서. 작업 단위로 정리.

```
handoff/
├── index.html                      ← 다운로드 페이지 (prod-ready 카드 + 작업별 목록)
├── README.md                       ← 이 파일
├── 2026-05-sku-management/         ← 작업별 폴더 (예시)
│   ├── figma-export/
│   ├── spec.md
│   ├── screenshots/
│   └── notes.md
└── 2026-05-editshop-restock/
    └── ...
```

## 권장 구조 — 작업별 폴더

각 작업 폴더 안에:
- **figma-export/** — Figma 에서 export 한 SVG / PNG / PDF
- **spec.md** — 작업 spec (페이지 목적 / 컬럼 / 필터 / 액션 / 권한 등)
- **screenshots/** — 디자인 시안 캡처
- **notes.md** — QA 노트 / 변경 이력 / 이슈
- **wireframe.html** (선택) — 시뮬레이터에서 「HTML 복사」 → 저장한 wireframe

## 시뮬레이터에서 만든 와이어프레임 보관

시뮬레이터 (`design system/simulator/`) 에서 「HTML 복사」 또는 「데모로 적용」 으로 받은 마크업을 작업 폴더 안의 `wireframe.html` 로 저장해두면 핸드오프 시 바로 공유 가능.
