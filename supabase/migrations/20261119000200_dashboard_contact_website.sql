begin;

alter table public.mordecai_dashboard_businesses
  add column if not exists contact_person text not null default '',
  add column if not exists website text not null default '';

notify pgrst, 'reload schema';

commit;
