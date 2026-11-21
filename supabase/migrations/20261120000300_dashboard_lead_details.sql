begin;

alter table public.mordecai_dashboard_businesses
  add column if not exists notes text not null default '',
  add column if not exists google_maps_url text not null default '';

alter table public.mordecai_dashboard_businesses
  drop constraint if exists mordecai_dashboard_businesses_status_check;

update public.mordecai_dashboard_businesses
set status = case status
  when 'New lead' then 'New Lead'
  when 'Contacted' then 'Researching'
  when 'Proposal sent' then 'Pitching'
  when 'In progress' then 'Waiting for Response Back'
  else status
end;

alter table public.mordecai_dashboard_businesses
  add constraint mordecai_dashboard_businesses_status_check
  check (status in ('New Lead', 'Researching', 'Pitching', 'Waiting for Response Back', 'Rejected', 'Active client'));

notify pgrst, 'reload schema';

commit;
