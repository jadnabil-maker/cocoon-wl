-- ============================================================
-- Sinna Waiting List — Supabase setup
-- ============================================================
-- Run this once in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1) Main table -------------------------------------------------
create table if not exists public.waitlist (
  id              uuid          primary key default gen_random_uuid(),
  email           text          not null unique,
  role            text          not null,
  mode            text          not null check (mode in ('email','team')),
  referral_code   text          not null unique,
  referred_by     text,
  position        bigserial,
  created_at      timestamptz   not null default now()
);

create index if not exists waitlist_referred_by_idx
  on public.waitlist(referred_by);

create index if not exists waitlist_created_at_idx
  on public.waitlist(created_at);

-- 2) Row Level Security ----------------------------------------
alter table public.waitlist enable row level security;

-- Anyone can sign up (insert their own row)
drop policy if exists "anon can insert" on public.waitlist;
create policy "anon can insert"
  on public.waitlist
  for insert
  to anon
  with check (true);

-- Anon needs SELECT to read back their own inserted row
-- (Supabase requires it for `.insert().select()` to return data)
-- Note: this also lets others query the table — see "Stronger
--       protection" note in README. For a typical waiting list,
--       this is acceptable. To lock it fully, remove this policy
--       and use an Edge Function with the service_role key.
drop policy if exists "anon can read inserted row" on public.waitlist;
create policy "anon can read inserted row"
  on public.waitlist
  for select
  to anon
  using (true);

-- 3) Public count function (no PII exposure) -------------------
create or replace function public.get_waitlist_count()
returns bigint
language sql
security definer
set search_path = public
as $$
  select count(*) from public.waitlist;
$$;

revoke all on function public.get_waitlist_count() from public;
grant execute on function public.get_waitlist_count() to anon, authenticated;

-- ============================================================
-- Done. Verify by running:
--   select * from public.waitlist;
--   select public.get_waitlist_count();
-- ============================================================
