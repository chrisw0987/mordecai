# Search Console dashboard setup

The frontend runs with `npm run dev`. Reports call a deployed Supabase Edge Function, so Netlify Dev is not required.

## Secrets

In the same Supabase project used by the dashboard, open Edge Functions -> Secrets:

- `GSC_SERVICE_ACCOUNT_JSON`: the entire downloaded service account JSON (already added).
- `DASHBOARD_OWNER_ID`: your Supabase Authentication -> Users -> your account -> User UID. Use the same UUID as `VITE_DASHBOARD_OWNER_ID` locally. This is checked on the server; changing the frontend owner setting does not bypass it.

Keep credentials out of the frontend, Git, and chat. No Google private key needs to be stored in this repository.

## Deploy from the Supabase dashboard

1. Open Edge Functions -> Deploy a new function -> Via Editor.
2. Name the function `search-console`.
3. Replace the sample `index.ts` with the contents of `functions/search-console/index.ts` from this folder.
4. Deploy the function.
5. In the function's settings, turn off the legacy **Verify JWT** / **Enforce JWT Verification** setting if enabled. The handler itself validates the bearer token using Supabase Auth and checks `DASHBOARD_OWNER_ID` before contacting Google. Never remove those checks. This avoids gateway incompatibility with asymmetric signing keys.

Alternatively, with the Supabase CLI authenticated, run from the project root:

```powershell
npx supabase functions deploy search-console --project-ref YOUR_PROJECT_REF --no-verify-jwt
```

No database migration is needed for this integration.

## Test

1. Sign in to Mordecai dashboard and open Insights.
2. Select a Search Console property and 7, 28, or 90 days.
3. Check clicks, impressions, CTR, average position, daily clicks, top searches and pages.
4. If a site is missing, add the service account as a Restricted user in that property's Search Console settings, wait up to five minutes and refresh.

Reports use final Web Search data ending three days ago and compare with the immediately preceding equal-length period. Dates use Search Console's Pacific timezone. Responses are cached in function memory for up to five minutes, not stored in the database. A cache may be cold on a new function instance.

Only the selected website's reports are loaded; dashboard clients are not automatically linked to properties yet. Top queries and pages are limited to ten rows. Google may omit anonymized queries and does not guarantee all rows. Summary totals are fetched independently, not calculated by adding those top rows.

Allowed browser origins are localhost ports 5173 and 8888, getmordecai.com, and www.getmordecai.com. Add another exact origin in the backend's `origins` set if needed.

Run the backend's mocked security/response checks locally:

```powershell
node --test supabase/functions/search-console/index.test.mjs
```
