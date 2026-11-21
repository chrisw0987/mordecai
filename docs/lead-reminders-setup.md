# Lead reminders setup

## Dashboard

Run `supabase/migrations/20261120000600_dashboard_lead_reminders.sql` in Supabase SQL Editor. Deploy the updated frontend as usual. Existing owner-only RLS continues to apply. Existing leads retain their follow-up dates; no historical contact or stage-change dates are invented. Stage dates start when a lead next changes status.

Bell icon: set the next action, optional reminder date and actual last-contact date. Quick status changes open the same editor before saving. Existing reminder dates take precedence over suggestions. New/edit lead forms offer a Use suggested reminder button. Rejected and secured leads automatically clear pending reminders. Update opens the status and next-action editor. Edit reminder opens the same editor to adjust dates. Suggestions exclude weekends, not holidays.

## Daily email digest (requires setup)

No email is sent by the dashboard itself. This optional server function sends only to your configured inbox, never to leads. It includes due and overdue leads only. It sends nothing on days with no due leads. There is no configured sender, key, recipient or active schedule in this repository.

1. Create a Resend account and verify a sending domain. Create a sending API key.
2. Add these Supabase Edge Function secrets (never frontend VITE variables):
   - `RESEND_API_KEY`: your sending key.
   - `LEAD_DIGEST_FROM`: verified sender, such as `Dashboard <reminders@your-domain.com>`.
   - `LEAD_DIGEST_TO`: your own inbox address.
   - `LEAD_DIGEST_DASHBOARD_URL`: deployed dashboard URL, including `/dashboard`.
   - `LEAD_DIGEST_CRON_SECRET`: a random secret of at least 32 bytes. Keep it private.
   Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to deployed functions.
3. Deploy `lead-digest`: `supabase functions deploy lead-digest --no-verify-jwt`, or paste `supabase/functions/lead-digest/index.ts` into the dashboard function editor and disable gateway JWT verification. The function checks the cron secret itself.
4. Enable Supabase Cron (`pg_cron`) and `pg_net` in your project. In Supabase Vault, create secrets named `lead_digest_url` (the deployed function URL) and `lead_digest_cron_secret` (the same random secret as above). Use the Vault UI so secrets are not pasted into SQL history.
5. Schedule using this SQL. It runs at 14:00 UTC daily: 9am New York winter / 10am summer. The digest date uses America/New_York.

```sql
select cron.schedule(
  'daily-lead-digest',
  '0 14 * * *',
  $job$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'lead_digest_url'),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'lead_digest_cron_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
  $job$
);
```

To test, execute the `select net.http_post(...)` statement once manually. It sends a real digest if due leads exist. Inspect `net._http_response` for HTTP status and Resend delivery logs for delivery. The function uses a per-day Resend idempotency key to suppress duplicate sends within the provider's idempotency window. If reminder contents change after an attempt, same-day retries can conflict; do not change the key to force duplicate sends. Scheduled HTTP failures do not automatically retry.

Pause emails:

```sql
select cron.unschedule('daily-lead-digest');
```

References: https://supabase.com/docs/guides/functions/schedule-functions and https://resend.com/docs/api-reference/emails/send-email
