# PS Careers — Database webhooks

The Edge Functions in `supabase/functions/notify-*/` send internal email
notifications to all consultants when new submissions land. Each function is
triggered by a **Supabase Database Webhook** that fires on `INSERT` to the
matching table.

## How they're managed

Webhooks are configured by the script at `scripts/setup-webhooks.mjs`.
Re-run it any time you add, remove or change a webhook:

```bash
npm run setup:webhooks
```

The script is **idempotent** — it drops and recreates each trigger every
run, and reports `created` vs `updated` per webhook.

### How it works under the hood

Supabase webhooks are implemented as Postgres triggers that call
`supabase_functions.http_request(...)`, which wraps `net.http_post()` from
the `pg_net` extension. Migration `0002_enable_database_webhooks.sql`
installs `pg_net`, the `supabase_functions` schema, the `hooks` log table,
and the wrapper function (Supabase normally auto-installs these the first
time you create a webhook via the dashboard).

The Supabase **Management API does not expose** a stable CRUD surface for
webhooks — both `/v1/projects/{ref}/database/hooks` and `.../webhooks`
return 404. The script uses the Management API's `/database/query`
endpoint to run SQL, which is what the dashboard does internally.

### How to add or change a webhook

1. Edit the `WEBHOOKS` array near the top of `scripts/setup-webhooks.mjs`.
2. Run `npm run setup:webhooks`.
3. Verify in the dashboard:
   <https://supabase.com/dashboard/project/kekqpfszqvpmbacbabtj/database/hooks>

To **remove** a webhook, drop the entry from the array and run a manual
`drop trigger if exists <name> on public.<table>` via the SQL editor, then
re-run the script.

## Prerequisites

Before wiring webhooks:

1. **Domain verified in Resend.** Until the domain on
   `NOTIFICATION_FROM_EMAIL` is verified, Resend will reject every send. The
   webhooks themselves will still fire successfully — the logs will just
   show 4xx responses from Resend. Verify the domain at
   <https://resend.com/domains> first.

2. **Edge Functions deployed.** Run:

   ```bash
   SUPABASE_ACCESS_TOKEN=<your-token> npx supabase functions deploy notify-new-application --project-ref kekqpfszqvpmbacbabtj --use-api
   SUPABASE_ACCESS_TOKEN=<your-token> npx supabase functions deploy notify-new-candidate --project-ref kekqpfszqvpmbacbabtj --use-api
   SUPABASE_ACCESS_TOKEN=<your-token> npx supabase functions deploy notify-new-employer --project-ref kekqpfszqvpmbacbabtj --use-api
   SUPABASE_ACCESS_TOKEN=<your-token> npx supabase functions deploy notify-new-job-submission --project-ref kekqpfszqvpmbacbabtj --use-api
   SUPABASE_ACCESS_TOKEN=<your-token> npx supabase functions deploy notify-new-enquiry --project-ref kekqpfszqvpmbacbabtj --use-api
   ```

   (Or `npx supabase login` once, then drop the env-var prefix.)

3. **Secrets set on the project.** From the dashboard
   *(Project Settings → Edge Functions → Secrets)* or via CLI:

   ```bash
   npx supabase secrets set RESEND_API_KEY=re_xxx --project-ref kekqpfszqvpmbacbabtj
   npx supabase secrets set NOTIFICATION_FROM_EMAIL=notifications@pscareers.co.uk --project-ref kekqpfszqvpmbacbabtj
   # Optional: override the default https://pscareers.co.uk admin URL
   npx supabase secrets set ADMIN_BASE_URL=https://pscareers.co.uk --project-ref kekqpfszqvpmbacbabtj
   ```

   `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected — do
   not set them manually.

## Manual dashboard setup (fallback / reference)

If the script can't run (e.g. no `SUPABASE_ACCESS_TOKEN` available), the
same five webhooks can be created by hand. In the Supabase dashboard, go
to **Database → Webhooks → Create a new hook**:

| Hook name                         | Table                  | Events  | Method | URL                                                                                                |
| --------------------------------- | ---------------------- | ------- | ------ | -------------------------------------------------------------------------------------------------- |
| `notify_new_application`          | `applications`         | INSERT  | POST   | `https://kekqpfszqvpmbacbabtj.supabase.co/functions/v1/notify-new-application`         |
| `notify_new_candidate`            | `candidates`           | INSERT  | POST   | `https://kekqpfszqvpmbacbabtj.supabase.co/functions/v1/notify-new-candidate`           |
| `notify_new_employer`             | `employers`            | INSERT  | POST   | `https://kekqpfszqvpmbacbabtj.supabase.co/functions/v1/notify-new-employer`            |
| `notify_new_job_submission`       | `employer_submissions` | INSERT  | POST   | `https://kekqpfszqvpmbacbabtj.supabase.co/functions/v1/notify-new-job-submission`      |
| `notify_new_enquiry`              | `enquiries`            | INSERT  | POST   | `https://kekqpfszqvpmbacbabtj.supabase.co/functions/v1/notify-new-enquiry`             |

For every hook:

- **Type:** Supabase Edge Functions (the dashboard has this preset).
- **HTTP Headers:** keep the default `Content-type: application/json` and
  the auto-added `Authorization: Bearer <project anon key>` header.
  Supabase's Edge Function gateway validates this for you — the function
  itself does no extra auth.
- **HTTP Params:** none.
- **Timeout:** 5000ms is fine.
- Leave the body template at the default (`{{ payload }}`) — the functions
  expect Supabase's standard webhook envelope:

  ```json
  {
    "type": "INSERT",
    "table": "<table>",
    "schema": "public",
    "record": { … },
    "old_record": null
  }
  ```

## Testing each webhook

After saving a webhook, fire a test row to confirm the chain works
end-to-end. Run these from the SQL editor in the dashboard, one at a time,
swapping in your own email so the result lands in your inbox.

> The Authorization header from the dashboard is the project's **anon**
> key, not the service role key. The function uses its auto-injected
> service-role key internally to query consultants and look up jobs.

### 1. Application

```sql
-- you'll need a real job_id; pick one from `jobs` first.
insert into public.applications (job_id, full_name, email, phone, cv_path)
values (
  (select id from public.jobs limit 1),
  'Test Applicant',
  'you+test@example.com',
  '01603 000000',
  'applications/test/cv.pdf'
);
```

### 2. Candidate

```sql
insert into public.candidates (
  full_name, email, phone, current_job_title,
  years_experience_band, region, contract_type_sought, cv_path
) values (
  'Test Candidate', 'you+test@example.com', '01603 000000',
  'Head of Planning', '10+', 'East of England', 'Permanent',
  'registrations/test/cv.pdf'
);
```

### 3. Employer

```sql
insert into public.employers (
  organisation_name, organisation_type, contact_name,
  contact_job_title, email, phone, hiring_volume
) values (
  'Test Borough Council', 'Local government', 'Test Contact',
  'Director of HR', 'you+test@example.com', '01603 000000', '5–10 roles / year'
);
```

### 4. Job submission

```sql
-- Insert the jobs row first, then the matching employer_submissions row.
with new_job as (
  insert into public.jobs (
    title, description, location, sector, contract_type,
    salary_min, salary_max, status, source
  ) values (
    'Test Service Manager', 'Test description', 'Norwich', 'Local government', 'Permanent',
    50000, 60000, 'pending_review', 'employer'
  )
  returning id
)
insert into public.employer_submissions (
  job_id, organisation_name, organisation_type,
  contact_name, contact_job_title, contact_email, contact_phone
)
select id, 'Test Borough Council', 'Local government',
       'Test Contact', 'Director of HR', 'you+test@example.com', '01603 000000'
from new_job;
```

### 5. Enquiry

```sql
insert into public.enquiries (
  enquiry_type, name, email, message, subject
) values (
  'contact_form', 'Test Person', 'you+test@example.com',
  'Hello — test message body.', 'Test subject'
);
```

After each insert, check:

- **Database → Webhooks → \[your hook\] → Latest deliveries** — should show
  a 200 response from the Edge Function.
- **Edge Functions → \[function\] → Logs** — should show the JSON line
  written by `console.log()`, e.g.
  `{ "recipients": 3, "sent": 3, "failed": 0 }`.
- **Resend dashboard → Logs** — once the domain is verified, every
  recipient should appear there as a delivered (or bounced) message.

If `recipients: 0` in the function logs, no consultant rows exist yet.
That's a common first-run state — invite a consultant via Supabase Auth
(*Authentication → Users → Invite*) and the `handle_new_user` trigger will
create the matching `consultants` row automatically.

## Cleanup

Once you've confirmed the loop works, delete the test rows:

```sql
delete from public.applications where email = 'you+test@example.com';
delete from public.candidates  where email = 'you+test@example.com';
delete from public.employers   where email = 'you+test@example.com';
delete from public.enquiries   where email = 'you+test@example.com';
delete from public.jobs        where title = 'Test Service Manager';
-- employer_submissions cascades from jobs.
```
