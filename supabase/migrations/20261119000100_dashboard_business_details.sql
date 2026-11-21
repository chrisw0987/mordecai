begin;

alter table public.mordecai_dashboard_businesses
  add column if not exists website_cost numeric(12, 2) check (website_cost >= 0),
  add column if not exists date_acquired date;

-- Existing owner-only row security and permissions remain in effect.
notify pgrst, 'reload schema';

commit;
