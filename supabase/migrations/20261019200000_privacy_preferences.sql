-- Apply manually in the Supabase SQL editor. This file is not run by the app.
-- One row per signed-in user. Anonymous visitors are not stored here.
-- Does not alter public.profiles.

create table if not exists public.privacy_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  analytics_consent boolean not null default false,
  sale_share_opt_out boolean not null default false,
  gpc_seen boolean not null default false,
  updated_at timestamptz not null default now()
);

create or replace function public.set_privacy_preferences_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists privacy_preferences_set_updated_at on public.privacy_preferences;
create trigger privacy_preferences_set_updated_at
  before update on public.privacy_preferences
  for each row
  execute function public.set_privacy_preferences_updated_at();

alter table public.privacy_preferences enable row level security;

revoke all on table public.privacy_preferences from public, anon, authenticated;
grant select, insert, update on table public.privacy_preferences to authenticated;

drop policy if exists privacy_preferences_select_own on public.privacy_preferences;
create policy privacy_preferences_select_own
  on public.privacy_preferences
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists privacy_preferences_insert_own on public.privacy_preferences;
create policy privacy_preferences_insert_own
  on public.privacy_preferences
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists privacy_preferences_update_own on public.privacy_preferences;
create policy privacy_preferences_update_own
  on public.privacy_preferences
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
