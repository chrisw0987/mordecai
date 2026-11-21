-- Existing owner-only RLS policy also applies to DELETE.
grant delete on table public.mordecai_dashboard_businesses to authenticated;
