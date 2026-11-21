begin;

alter table public.mordecai_dashboard_businesses
  add column if not exists business_type text not null default '';

notify pgrst, 'reload schema';

commit;
