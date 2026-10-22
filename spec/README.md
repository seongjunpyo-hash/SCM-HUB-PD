# Spec — PRD / 비즈니스 요구사항 / API 스펙

도메인별로 하위 파일 또는 폴더 생성.

```
spec/
├── README.md           (이 파일)
├── conductor-v3-dev-mirror-design.md   컨덕터 v3 설계 — dev 미러 + DS 거버넌스 (편집·핸드오프 제거)
├── glossary.md         도메인 용어집 (SKU / UID / 무탠 / 편집샵 등)
├── permissions.md      권한 매트릭스 (SCM-MD-Read / Write 등)
│
├── store/              스토어 도메인
│   ├── editshop-restock-request.md
│   └── editshop-restock-status.md
├── hanger/             상품 관리 도메인
│   ├── sku-management.md
│   └── sku-mapping.md
├── order/              발주/입고 관리
└── stock/              재고 관리
```

## 권장 PRD 템플릿

```markdown
# [페이지 이름] PRD

## 목적
한 줄 요약.

## 사용자
주 사용자 (예: MD, 운영자, 외부 브랜드 담당자)

## 테이블 컬럼
- 컬럼1 (type)
- 컬럼2 (type)
- ...

## 필터
- 필터1
- 필터2
- ...

## 액션
- 신규 등록 (primary)
- 일괄 업로드 (ghost)
- ...

## 빈 상태
"등록된 항목이 없습니다"

## 권한
SCM-MD-Read 이상

## 비즈니스 규칙
- ...
```

이 템플릿으로 작성한 spec 을 시뮬레이터의 PRD 검증에 그대로 paste 하면 자동 분석됨.
