begin;

alter table public.mordecai_dashboard_businesses
  add column if not exists review_card_cost numeric(12, 2) check (review_card_cost >= 0);

notify pgrst, 'reload schema';

commit;
