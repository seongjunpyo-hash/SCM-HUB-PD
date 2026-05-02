# Handoff — 디자이너 ↔ 개발자 인계 산출물

작업 단위로 하위 폴더 생성 권장.

```
handoff/
├── 2026-05-sku-management/
│   ├── figma-export/
│   ├── spec.md
│   ├── screenshots/
│   └── notes.md
└── 2026-05-editshop-restock/
    └── ...
```

## 권장 구조

각 작업 폴더 안에:
- **figma-export/** — Figma 에서 export 한 SVG / PNG / PDF
- **spec.md** — 작업 spec (페이지 목적 / 컬럼 / 필터 / 액션 / 권한 등)
- **screenshots/** — 디자인 시안 캡처
- **notes.md** — QA 노트 / 변경 이력 / 이슈

## 시뮬레이터에서 만든 와이어프레임 보관

시뮬레이터 (`design-system/simulator/`) 에서 「HTML 복사」로 받은 마크업을 `wireframe.html` 로 저장해두면 핸드오프 시 바로 공유 가능.
