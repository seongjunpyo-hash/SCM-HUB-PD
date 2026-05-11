-- ============================================================
-- musinsa-platform — seed 4 도메인
-- ============================================================

insert into public.domains (id, name, layer, status) values
  ('scm-hub',    'SCM Hub',    'layer', 'live'),
  ('scm-portal', 'SCM Portal', 'phase', 'wip'),
  ('o4o',        'O4O',        'phase', 'wip'),
  ('logistics',  'Logistics',  'flow',  'wip')
on conflict (id) do nothing;
