alter table public.mordecai_dashboard_businesses
  add column if not exists location text
  check (location in ('Long Island', 'Brooklyn', 'Queens'));

notify pgrst, 'reload schema';
