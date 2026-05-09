/* VOC 편집 탭 — 컴포넌트 라이브러리 (단일 source)
 *
 * 30개 핵심 컴포넌트를 아토믹 디자인 (Atom / Molecule / Organism) 으로 묶음.
 *
 * 각 항목 형식:
 *   {
 *     id:    'banner-info',          // 고유 ID (override 키)
 *     label: '안내 배너',             // 카드 / 토스트 노출 라벨
 *     sub:   '상단 안내',             // 카드 보조 텍스트
 *     level: 'atom'|'molecule'|'organism',
 *     type:  'banner'|'card'|...     // cmpType select 동기화용
 *     html:  '<div ...>...</div>',   // 인라인 스타일 — 어느 페이지에 넣어도 OK
 *   }
 *
 * 라이브러리 변경 시 이 파일만 수정 → VOC 편집 탭에 자동 반영.
 * (window.SCM_VOC_LIB 로 노출 — voc/index.html 의 SMALL_UNITS fallback)
 */
(function (root) {
  'use strict';

  // ─── ATOMS (10) ──────────────────────────────────────────────
  const ATOMS = [
    { id: 'btn-primary', label: '주 버튼', sub: 'Primary', type: 'button',
      html: `<button type="button" style="padding:10px 18px;background:#4F46E5;color:#fff;border:0;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;margin:4px;">버튼 텍스트</button>` },
    { id: 'btn-ghost', label: 'Ghost 버튼', sub: '테두리만', type: 'button',
      html: `<button type="button" style="padding:10px 18px;background:#fff;color:#111827;border:1px solid #D1D5DB;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;margin:4px;">버튼 텍스트</button>` },
    { id: 'btn-danger', label: 'Danger 버튼', sub: '경고/삭제', type: 'button',
      html: `<button type="button" style="padding:10px 18px;background:#fff;color:#DC2626;border:1px solid #FCA5A5;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;margin:4px;">삭제</button>` },
    { id: 'tag-blue', label: '파랑 태그', sub: '강조', type: 'custom',
      html: `<span style="display:inline-flex;align-items:center;height:24px;padding:2px 8px;background:#EEF2FF;color:#312E81;border-radius:4px;font-size:13px;line-height:18px;font-weight:500;">신규</span>` },
    { id: 'tag-green', label: '초록 태그', sub: '완료/성공', type: 'custom',
      html: `<span style="display:inline-flex;align-items:center;height:24px;padding:2px 8px;background:#ECFDF5;color:#065F46;border-radius:4px;font-size:13px;line-height:18px;font-weight:500;">완료</span>` },
    { id: 'tag-gray', label: '회색 태그', sub: '중립', type: 'custom',
      html: `<span style="display:inline-flex;align-items:center;height:24px;padding:2px 8px;background:#F3F4F6;color:#374151;border-radius:4px;font-size:13px;line-height:18px;font-weight:500;">대기</span>` },
    { id: 'status-pill-active', label: '상태 pill', sub: '활성/비활성', type: 'custom',
      html: `<span style="display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 10px;background:#ECFDF5;color:#065F46;border-radius:999px;font-size:12px;font-weight:600;"><span style="width:6px;height:6px;border-radius:50%;background:#10B981;"></span>활성</span>` },
    { id: 'checkbox-input', label: '체크박스', sub: 'label 포함', type: 'form',
      html: `<label style="display:inline-flex;align-items:center;gap:8px;font-size:13px;color:#111827;cursor:pointer;margin:6px;"><input type="checkbox" checked style="width:16px;height:16px;accent-color:#4F46E5;" /><span>옵션 선택</span></label>` },
    { id: 'divider', label: '구분선', sub: '가로 1px', type: 'custom',
      html: `<hr style="border:0;border-top:1px solid #E5E7EB;margin:16px 0;" />` },
    { id: 'badge-count', label: '카운트 배지', sub: '숫자 강조', type: 'custom',
      html: `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 6px;background:#EF4444;color:#fff;border-radius:999px;font-size:11px;font-weight:700;">12</span>` },
  ];

  // ─── MOLECULES (10) ───────────────────────────────────────────
  const MOLECULES = [
    { id: 'banner-info', label: '안내 배너', sub: '상단 안내', level: 'molecule', type: 'banner',
      html: `<div style="display:flex;gap:12px;align-items:center;padding:14px 18px;border-radius:8px;background:#EEF2FF;color:#312E81;font-size:13px;border:1px solid #C7D2FE;margin:12px 0;">
  <span style="font-size:18px;line-height:1;">ℹ️</span>
  <div style="flex:1;"><b>안내</b> — 새로운 기능이 추가됐습니다. 우측 [편집] 탭에서 직접 수정해 보세요.</div>
</div>` },
    { id: 'banner-warn', label: '경고 배너', sub: '주의 안내', level: 'molecule', type: 'banner',
      html: `<div style="display:flex;gap:12px;align-items:center;padding:14px 18px;border-radius:8px;background:#FFF7ED;color:#9A3412;font-size:13px;border:1px solid #FED7AA;margin:12px 0;">
  <span style="font-size:18px;line-height:1;">⚠️</span>
  <div style="flex:1;"><b>주의</b> — 출고 마감 시간이 30분 남았습니다.</div>
</div>` },
    { id: 'banner-success', label: '성공 배너', sub: '완료 안내', level: 'molecule', type: 'banner',
      html: `<div style="display:flex;gap:12px;align-items:center;padding:14px 18px;border-radius:8px;background:#ECFDF5;color:#065F46;font-size:13px;border:1px solid #A7F3D0;margin:12px 0;">
  <span style="font-size:18px;line-height:1;">✅</span>
  <div style="flex:1;"><b>완료</b> — 모든 작업이 정상 처리됐습니다.</div>
</div>` },
    { id: 'kpi-card', label: 'KPI 카드', sub: '숫자 강조', level: 'molecule', type: 'kpi',
      html: `<div style="display:inline-flex;flex-direction:column;gap:6px;padding:18px 20px;border-radius:10px;background:#fff;border:1px solid #E5E7EB;min-width:180px;margin:12px 8px 12px 0;">
  <span style="font-size:11px;font-weight:600;color:#6B7280;letter-spacing:0.4px;text-transform:uppercase;">오늘의 출고</span>
  <span style="font-size:28px;font-weight:700;color:#111827;line-height:1;">1,284<span style="font-size:13px;color:#6B7280;font-weight:500;margin-left:4px;">건</span></span>
  <span style="font-size:11.5px;color:#10B981;font-weight:600;">▲ 어제 대비 +6.2%</span>
</div>` },
    { id: 'card-info', label: '정보 카드', sub: '제목+본문', level: 'molecule', type: 'card',
      html: `<div style="padding:16px 18px;border-radius:10px;background:#fff;border:1px solid #E5E7EB;margin:12px 0;">
  <h4 style="margin:0 0 8px;font-size:14px;font-weight:700;color:#111827;">카드 제목</h4>
  <p style="margin:0;font-size:12.5px;color:#4B5563;line-height:1.6;">카드 본문 — 여기에 설명, 차트, 또는 액션 버튼을 넣을 수 있습니다.</p>
</div>` },
    { id: 'cta-box', label: 'CTA 박스', sub: '버튼+설명', level: 'molecule', type: 'card',
      html: `<div style="display:flex;gap:14px;align-items:center;padding:16px 20px;border-radius:10px;background:#111827;color:#fff;margin:12px 0;">
  <div style="flex:1;">
    <b style="font-size:14px;display:block;margin-bottom:2px;">새 출고 등록</b>
    <span style="font-size:12px;color:#D1D5DB;">한 번에 여러 SKU 를 등록할 수 있습니다.</span>
  </div>
  <button type="button" style="padding:8px 16px;background:#6366F1;color:#fff;border:0;border-radius:6px;font-size:12.5px;font-weight:600;cursor:pointer;">+ 등록 시작</button>
</div>` },
    { id: 'form-input', label: '입력 폼', sub: '라벨+인풋', level: 'molecule', type: 'form',
      html: `<div style="display:flex;flex-direction:column;gap:6px;max-width:320px;margin:12px 0;">
  <label style="font-size:12px;font-weight:600;color:#374151;">출고 ID</label>
  <input type="text" placeholder="예: SHP-2026-00001" style="padding:9px 12px;border:1px solid #D1D5DB;border-radius:6px;font-size:13px;outline:none;" />
  <span style="font-size:11px;color:#6B7280;">대문자 알파벳 + 숫자 형식으로 입력해 주세요.</span>
</div>` },
    { id: 'search-bar', label: '검색 바', sub: '인풋+버튼', level: 'molecule', type: 'form',
      html: `<div style="display:flex;gap:8px;max-width:480px;margin:12px 0;">
  <input type="search" placeholder="SKU, 바코드, 스토어명으로 검색" style="flex:1;padding:9px 12px;border:1px solid #D1D5DB;border-radius:6px;font-size:13px;outline:none;" />
  <button type="button" style="padding:9px 16px;background:#4F46E5;color:#fff;border:0;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;">검색</button>
</div>` },
    { id: 'mini-action', label: '미니 액션', sub: '드롭다운 버튼', level: 'molecule', type: 'button',
      html: `<button type="button" style="display:inline-flex;align-items:center;gap:6px;padding:6px 10px;background:#fff;color:#111827;border:1px solid #E5E7EB;border-radius:4px;font-size:12px;font-weight:500;cursor:pointer;">코드 복사 <span style="color:#6B7280;">▾</span></button>` },
    { id: 'pagination', label: '페이지네이션', sub: '이전/다음', level: 'molecule', type: 'custom',
      html: `<div style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#374151;margin:12px 0;">
  <strong style="color:#111827;">1</strong>
  <span style="color:#6B7280;">/ 12 페이지</span>
  <button type="button" style="width:28px;height:28px;border:1px solid #E5E7EB;background:#fff;border-radius:4px;color:#9CA3AF;cursor:not-allowed;">‹</button>
  <button type="button" style="width:28px;height:28px;border:1px solid #E5E7EB;background:#fff;border-radius:4px;color:#111827;cursor:pointer;">›</button>
</div>` },
  ];

  // ─── ORGANISMS (10) ───────────────────────────────────────────
  const ORGANISMS = [
    { id: 'list-items', label: '아이템 리스트', sub: '제목+상태', level: 'organism', type: 'list',
      html: `<ul style="list-style:none;padding:0;margin:12px 0;border:1px solid #E5E7EB;border-radius:8px;background:#fff;">
  <li style="display:flex;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #F3F4F6;font-size:13px;"><span>출고 #1284</span><span style="color:#10B981;font-weight:600;">완료</span></li>
  <li style="display:flex;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #F3F4F6;font-size:13px;"><span>출고 #1283</span><span style="color:#F59E0B;font-weight:600;">대기</span></li>
  <li style="display:flex;justify-content:space-between;padding:12px 16px;font-size:13px;"><span>출고 #1282</span><span style="color:#10B981;font-weight:600;">완료</span></li>
</ul>` },
    { id: 'table-mini', label: '미니 테이블', sub: '3행 표', level: 'organism', type: 'list',
      html: `<table style="width:100%;max-width:640px;border-collapse:collapse;font-size:13px;background:#fff;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;margin:12px 0;">
  <thead><tr style="background:#F9FAFB;">
    <th style="padding:10px 12px;text-align:left;font-weight:600;color:#374151;border-bottom:1px solid #E5E7EB;">SKU</th>
    <th style="padding:10px 12px;text-align:left;font-weight:600;color:#374151;border-bottom:1px solid #E5E7EB;">스토어</th>
    <th style="padding:10px 12px;text-align:right;font-weight:600;color:#374151;border-bottom:1px solid #E5E7EB;">수량</th>
  </tr></thead>
  <tbody>
    <tr><td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;">SSKJ12345</td><td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;">강남</td><td style="padding:10px 12px;text-align:right;border-bottom:1px solid #F3F4F6;">120</td></tr>
    <tr><td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;">SSKJ12346</td><td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;">홍대</td><td style="padding:10px 12px;text-align:right;border-bottom:1px solid #F3F4F6;">85</td></tr>
    <tr><td style="padding:10px 12px;">SSKJ12347</td><td style="padding:10px 12px;">성수</td><td style="padding:10px 12px;text-align:right;">52</td></tr>
  </tbody>
</table>` },
    { id: 'filter-row', label: '필터 칩 줄', sub: '복수 칩', level: 'organism', type: 'custom',
      html: `<div style="display:flex;flex-wrap:wrap;gap:8px;padding:12px 0;margin:12px 0;">
  <button type="button" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#fff;color:#111827;border:1px solid #E5E7EB;border-radius:999px;font-size:12.5px;font-weight:500;cursor:pointer;">전체 필터 <span style="background:#4F46E5;color:#fff;padding:0 6px;border-radius:999px;font-size:11px;">2</span></button>
  <button type="button" style="padding:6px 12px;background:#EEF2FF;color:#312E81;border:1px solid #C7D2FE;border-radius:999px;font-size:12.5px;font-weight:500;cursor:pointer;">상태: 출고대기 ✕</button>
  <button type="button" style="padding:6px 12px;background:#EEF2FF;color:#312E81;border:1px solid #C7D2FE;border-radius:999px;font-size:12.5px;font-weight:500;cursor:pointer;">브랜드: NIKE ✕</button>
</div>` },
    { id: 'stats-row', label: '통계 바', sub: '여러 KPI', level: 'organism', type: 'kpi',
      html: `<div style="display:flex;gap:24px;align-items:center;padding:14px 18px;background:#F9FAFB;border-radius:8px;margin:12px 0;font-size:13px;">
  <span><span style="color:#6B7280;">전체</span> <b style="font-size:15px;color:#111827;margin-left:6px;">350</b></span>
  <span style="color:#E5E7EB;">|</span>
  <span><span style="color:#6B7280;">처리중</span> <b style="font-size:15px;color:#F59E0B;margin-left:6px;">120</b></span>
  <span style="color:#E5E7EB;">|</span>
  <span><span style="color:#6B7280;">완료</span> <b style="font-size:15px;color:#10B981;margin-left:6px;">230</b></span>
</div>` },
    { id: 'progress-bar', label: '진행률 바', sub: '단계 표시', level: 'organism', type: 'custom',
      html: `<div style="max-width:480px;margin:12px 0;">
  <div style="display:flex;justify-content:space-between;font-size:12px;color:#6B7280;margin-bottom:6px;"><span>출고 진행률</span><span><b style="color:#111827;">68%</b> (240/350)</span></div>
  <div style="height:8px;background:#F3F4F6;border-radius:999px;overflow:hidden;"><div style="width:68%;height:100%;background:linear-gradient(90deg,#4F46E5,#6366F1);border-radius:999px;"></div></div>
</div>` },
    { id: 'timeline', label: '타임라인', sub: '단계별 상태', level: 'organism', type: 'list',
      html: `<ol style="list-style:none;padding:0;margin:12px 0;font-size:13px;">
  <li style="display:flex;gap:12px;padding-bottom:14px;border-left:2px solid #E5E7EB;margin-left:8px;padding-left:16px;position:relative;"><span style="position:absolute;left:-6px;top:0;width:10px;height:10px;border-radius:50%;background:#10B981;"></span><div><b>출고 등록</b><div style="color:#6B7280;font-size:11.5px;">2026.05.07 09:12</div></div></li>
  <li style="display:flex;gap:12px;padding-bottom:14px;border-left:2px solid #E5E7EB;margin-left:8px;padding-left:16px;position:relative;"><span style="position:absolute;left:-6px;top:0;width:10px;height:10px;border-radius:50%;background:#10B981;"></span><div><b>출고 확정</b><div style="color:#6B7280;font-size:11.5px;">2026.05.07 14:30</div></div></li>
  <li style="display:flex;gap:12px;border-left:2px solid transparent;margin-left:8px;padding-left:16px;position:relative;"><span style="position:absolute;left:-6px;top:0;width:10px;height:10px;border-radius:50%;background:#F59E0B;"></span><div><b>입고 대기</b><div style="color:#6B7280;font-size:11.5px;">진행 중</div></div></li>
</ol>` },
    { id: 'empty-state', label: '빈 상태', sub: '데이터 없음', level: 'organism', type: 'card',
      html: `<div style="text-align:center;padding:48px 24px;background:#F9FAFB;border:1px dashed #E5E7EB;border-radius:10px;margin:12px 0;">
  <div style="font-size:32px;margin-bottom:8px;">📭</div>
  <div style="font-size:14px;font-weight:600;color:#111827;margin-bottom:4px;">조회된 데이터가 없습니다</div>
  <div style="font-size:12.5px;color:#6B7280;">필터 조건을 변경해 다시 시도해 주세요.</div>
</div>` },
    { id: 'tabs-bar', label: '탭 바', sub: '3개 탭', level: 'organism', type: 'custom',
      html: `<div style="display:flex;gap:0;border-bottom:1px solid #E5E7EB;margin:12px 0;">
  <button type="button" style="padding:12px 18px;background:transparent;border:0;border-bottom:2px solid #4F46E5;color:#4F46E5;font-size:13px;font-weight:600;cursor:pointer;">전체</button>
  <button type="button" style="padding:12px 18px;background:transparent;border:0;border-bottom:2px solid transparent;color:#6B7280;font-size:13px;font-weight:500;cursor:pointer;">처리중</button>
  <button type="button" style="padding:12px 18px;background:transparent;border:0;border-bottom:2px solid transparent;color:#6B7280;font-size:13px;font-weight:500;cursor:pointer;">완료</button>
</div>` },
    { id: 'avatar-stack', label: '아바타 스택', sub: '담당자 묶음', level: 'organism', type: 'custom',
      html: `<div style="display:inline-flex;align-items:center;margin:12px 0;">
  <span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:#4F46E5;color:#fff;font-size:12px;font-weight:600;border:2px solid #fff;">홍</span>
  <span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:#10B981;color:#fff;font-size:12px;font-weight:600;border:2px solid #fff;margin-left:-10px;">박</span>
  <span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:#F59E0B;color:#fff;font-size:12px;font-weight:600;border:2px solid #fff;margin-left:-10px;">김</span>
  <span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:#F3F4F6;color:#6B7280;font-size:11px;font-weight:600;border:2px solid #fff;margin-left:-10px;">+5</span>
  <span style="margin-left:10px;font-size:12.5px;color:#6B7280;">담당자 8명</span>
</div>` },
    { id: 'notification-card', label: '알림 카드', sub: '아이콘+본문+액션', level: 'organism', type: 'card',
      html: `<div style="display:flex;gap:14px;padding:16px 18px;border-radius:10px;background:#fff;border:1px solid #E5E7EB;box-shadow:0 1px 2px rgba(0,0,0,0.04);max-width:520px;margin:12px 0;">
  <span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;background:#EEF2FF;color:#4F46E5;font-size:18px;flex-shrink:0;">🔔</span>
  <div style="flex:1;">
    <b style="display:block;font-size:13.5px;color:#111827;margin-bottom:2px;">새 출고 요청 도착</b>
    <p style="margin:0 0 8px;font-size:12.5px;color:#6B7280;line-height:1.55;">강남점에서 12개 SKU 의 보충 요청이 들어왔습니다.</p>
    <button type="button" style="padding:6px 12px;background:#4F46E5;color:#fff;border:0;border-radius:5px;font-size:12px;font-weight:600;cursor:pointer;">확인하기</button>
  </div>
</div>` },
  ];

  // 레벨 라벨 부여 (atom level 은 ATOMS 정의 시 누락된 경우 보강)
  ATOMS.forEach(u => { u.level = u.level || 'atom'; });
  MOLECULES.forEach(u => { u.level = u.level || 'molecule'; });
  ORGANISMS.forEach(u => { u.level = u.level || 'organism'; });

  const ALL_UNITS = [].concat(ATOMS, MOLECULES, ORGANISMS);

  root.SCM_VOC_LIB = {
    UNITS: ALL_UNITS,
    BY_LEVEL: { atom: ATOMS, molecule: MOLECULES, organism: ORGANISMS },
    LEVELS: [
      { key: 'atom',     label: 'Atoms',     hint: '기본 UI 요소 (버튼, 태그, 인풋)' },
      { key: 'molecule', label: 'Molecules', hint: '조합 컴포넌트 (배너, 카드, KPI)' },
      { key: 'organism', label: 'Organisms', hint: '복합 섹션 (테이블, 필터바, 알림카드)' },
    ],
  };
})(typeof window !== 'undefined' ? window : globalThis);
