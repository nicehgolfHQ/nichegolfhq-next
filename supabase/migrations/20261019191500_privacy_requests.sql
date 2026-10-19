-- Apply manually in the Supabase SQL editor. This file is not run by the app.
-- privacy_requests: service role only (no public policies).
-- privacy_opt_outs: anonymous and signed-in clients may insert, never read.

create table if not exists public.privacy_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (type in ('access', 'delete', 'correct', 'opt-out')),
  email text not null,
  name text,
  state text,
  details text,
  user_agent text,
  gpc boolean not null default false
);

create table if not exists public.privacy_opt_outs (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  scope text not null check (scope in ('all', 'sale-share', 'newsletter')),
  created_at timestamptz not null default now()
);

create index if not exists privacy_opt_outs_email_idx
  on public.privacy_opt_outs (email);

alter table public.privacy_requests enable row level security;
alter table public.privacy_opt_outs enable row level security;

revoke all on table public.privacy_requests from public, anon, authenticated;
revoke all on table public.privacy_opt_outs from public, anon, authenticated;

grant insert on table public.privacy_opt_outs to anon, authenticated;

drop policy if exists privacy_opt_outs_public_insert on public.privacy_opt_outs;
create policy privacy_opt_outs_public_insert
  on public.privacy_opt_outs
  for insert
  to anon, authenticated
  with check (
    char_length(email) between 3 and 254
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    and scope in ('all', 'sale-share', 'newsletter')
  );
