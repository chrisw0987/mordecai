begin;

-- Only the configured Mordecai dashboard owner can access these records.
create table public.mordecai_dashboard_businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  service text not null default '',
  status text not null check (status in ('New lead', 'Contacted', 'Proposal sent', 'In progress', 'Active client')),
  monthly numeric(12, 2) check (monthly >= 0),
  follow_up date,
  created_at timestamptz not null default now()
);

alter table public.mordecai_dashboard_businesses enable row level security;

revoke all on public.mordecai_dashboard_businesses from public, anon, authenticated;
grant select, insert, update on public.mordecai_dashboard_businesses to authenticated;

create policy "Dashboard owner only"
on public.mordecai_dashboard_businesses
for all to authenticated
using ((select auth.uid()) = 'f50c4da8-0c6e-4480-a734-15607f2cac42'::uuid)
with check ((select auth.uid()) = 'f50c4da8-0c6e-4480-a734-15607f2cac42'::uuid);

commit;
