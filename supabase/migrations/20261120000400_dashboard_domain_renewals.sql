begin;

alter table public.mordecai_dashboard_businesses
  add column if not exists domain_name text not null default '',
  add column if not exists domain_expires_on date,
  add column if not exists domain_auto_renew boolean;

notify pgrst, 'reload schema';

commit;
