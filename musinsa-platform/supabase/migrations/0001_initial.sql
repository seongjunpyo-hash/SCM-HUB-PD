-- ============================================================
-- musinsa-platform — initial schema (5 tables + RLS)
-- ============================================================
-- Apply via Supabase Studio SQL Editor OR `supabase db push`.

-- ===== 1. domains — 도메인 카탈로그 =====
create table if not exists public.domains (
  id          text primary key,
  name        text not null,
  layer       text not null check (layer in ('layer', 'phase', 'flow')),
  hub_url     text,
  status      text not null default 'wip' check (status in ('live', 'wip', 'archived')),
  created_at  timestamptz not null default now()
);

-- ===== 2. user_domains — 사용자 × 도메인 × 역할 =====
create table if not exists public.user_domains (
  user_id    uuid not null references auth.users on delete cascade,
  domain_id  text not null references public.domains on delete cascade,
  role       text not null check (role in ('super', 'admin', 'member', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (user_id, domain_id)
);

create index if not exists user_domains_user_idx on public.user_domains (user_id);

-- ===== 3. voc_versions — 페이지별 편집 snapshot =====
create table if not exists public.voc_versions (
  id          uuid primary key default gen_random_uuid(),
  domain_id   text not null references public.domains on delete cascade,
  path        text not null,
  label       text,
  is_active   boolean not null default false,
  is_final    boolean not null default false,
  applied     jsonb not null,
  created_at  timestamptz not null default now(),
  created_by  uuid not null references auth.users
);

create index if not exists voc_versions_domain_path_idx
  on public.voc_versions (domain_id, path);

-- 도메인 × 페이지 당 active 는 최대 1개만 (partial unique)
create unique index if not exists voc_versions_one_active_per_page
  on public.voc_versions (domain_id, path) where is_active;

-- ===== 4. voc_comments — element 단위 댓글 =====
create table if not exists public.voc_comments (
  id          uuid primary key default gen_random_uuid(),
  domain_id   text not null references public.domains on delete cascade,
  path        text not null,
  voc_key     text not null,
  body        text not null,
  resolved    boolean not null default false,
  created_at  timestamptz not null default now(),
  created_by  uuid not null references auth.users
);

create index if not exists voc_comments_domain_path_key_idx
  on public.voc_comments (domain_id, path, voc_key);

-- ===== 5. voc_edits — draft 편집 (active version 만들기 전 임시) =====
create table if not exists public.voc_edits (
  id          uuid primary key default gen_random_uuid(),
  domain_id   text not null references public.domains on delete cascade,
  path        text not null,
  applied     jsonb not null,
  updated_at  timestamptz not null default now(),
  user_id     uuid not null references auth.users,
  unique (domain_id, path, user_id)
);

-- ============================================================
-- RLS Policies
-- ============================================================

-- domains — 누구나 read (도메인 카탈로그는 hub 에 노출). write 는 service role 만.
alter table public.domains enable row level security;
create policy "domains_read_all" on public.domains
  for select using (true);

-- user_domains — 본인 row 만 read. write 는 service role 만.
alter table public.user_domains enable row level security;
create policy "user_domains_read_self" on public.user_domains
  for select using (user_id = auth.uid());

-- voc_versions — 본인 도메인만 read, admin 이상만 write
alter table public.voc_versions enable row level security;

create policy "voc_versions_read_own_domain" on public.voc_versions
  for select using (
    exists (
      select 1 from public.user_domains
      where user_id = auth.uid() and domain_id = voc_versions.domain_id
    )
  );

create policy "voc_versions_admin_write" on public.voc_versions
  for all using (
    exists (
      select 1 from public.user_domains
      where user_id = auth.uid()
        and domain_id = voc_versions.domain_id
        and role in ('super', 'admin')
    )
  ) with check (
    exists (
      select 1 from public.user_domains
      where user_id = auth.uid()
        and domain_id = voc_versions.domain_id
        and role in ('super', 'admin')
    )
  );

-- voc_comments — 본인 도메인 read, member 이상 본인 작성 write
alter table public.voc_comments enable row level security;

create policy "voc_comments_read_own_domain" on public.voc_comments
  for select using (
    exists (
      select 1 from public.user_domains
      where user_id = auth.uid() and domain_id = voc_comments.domain_id
    )
  );

create policy "voc_comments_member_insert" on public.voc_comments
  for insert with check (
    created_by = auth.uid()
    and exists (
      select 1 from public.user_domains
      where user_id = auth.uid()
        and domain_id = voc_comments.domain_id
        and role in ('super', 'admin', 'member')
    )
  );

create policy "voc_comments_self_update" on public.voc_comments
  for update using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "voc_comments_self_or_admin_delete" on public.voc_comments
  for delete using (
    created_by = auth.uid()
    or exists (
      select 1 from public.user_domains
      where user_id = auth.uid()
        and domain_id = voc_comments.domain_id
        and role in ('super', 'admin')
    )
  );

-- voc_edits — 본인 draft 만 read/write
alter table public.voc_edits enable row level security;

create policy "voc_edits_self_all" on public.voc_edits
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());
