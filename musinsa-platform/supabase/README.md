# Supabase — DB schema + RLS

## 마이그레이션 적용

```bash
# 1. Supabase CLI 설치
npm i -g supabase

# 2. 프로젝트 연결
supabase login
supabase link --project-ref <YOUR_PROJECT_REF>

# 3. 마이그레이션 적용
supabase db push
```

또는 Supabase Studio (web UI) 의 SQL Editor 에서 `migrations/0001_initial.sql` 통째 붙여넣기 + Run.

## 테이블 구조

| 테이블 | 용도 |
|---|---|
| `domains` | 도메인 카탈로그 (scm-hub, scm-portal, o4o, logistics) |
| `user_domains` | 사용자 × 도메인 × 역할 |
| `conductor_versions` | 페이지별 편집 snapshot (현 SCM-HUB-PD 의 `scm:conductor:versions:v1` 대체) |
| `conductor_comments` | element 단위 댓글 |
| `conductor_edits` | 편집 중인 변경사항 (draft) |

## RLS 정책 모델

모든 conductor_* 테이블에 RLS 활성. 정책:

- **read**: `user_domains` 에 본인 매핑 있는 도메인만
- **write**: 본인 매핑의 role 이 `super` 또는 `admin` 인 도메인만
- **comment write**: `super` / `admin` / `member` 모두 가능, 단 본인 작성만 수정/삭제

## 시드 데이터

`migrations/0002_seed.sql` 에 4 도메인 초기 row insert. 사용자 (auth.users) 를 user_domains 에 추가하는 건 admin 이 Supabase Studio 또는 별도 admin UI 로.

## Auth provider 활성화

Supabase Studio → Authentication → Providers:

1. **Magic Link** (Email) — 가장 단순. 사내 이메일로 전송
2. **Google OAuth** — 사내 Google Workspace 도메인 화이트리스트
