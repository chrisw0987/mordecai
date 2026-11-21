alter table public.mordecai_dashboard_businesses
  add column if not exists next_action text not null default '',
  add column if not exists last_contacted date,
  add column if not exists status_changed_at timestamptz,
  add column if not exists last_action_completed_at timestamptz;

-- Leave historical status dates unknown; start tracking from this migration onward.
create or replace function public.dashboard_track_status_change()
returns trigger language plpgsql set search_path = public as $$
begin
  if TG_OP = 'INSERT' then
    NEW.status_changed_at := now();
  elsif NEW.status is distinct from OLD.status then
    NEW.status_changed_at := now();
  else
    NEW.status_changed_at := OLD.status_changed_at;
  end if;
  if NEW.status in ('Rejected', 'Active client') then
    NEW.follow_up := null;
    NEW.next_action := '';
  end if;
  return NEW;
end;
$$;
drop trigger if exists dashboard_status_change on public.mordecai_dashboard_businesses;
create trigger dashboard_status_change before insert or update
on public.mordecai_dashboard_businesses for each row execute function public.dashboard_track_status_change();
