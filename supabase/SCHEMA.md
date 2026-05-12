# PS Careers — Database schema

This document describes the live Supabase schema in plain English. The
authoritative source is the SQL in `supabase/migrations/`.

## Tables

### `consultants`

PS Careers staff profiles. One row per Supabase Auth user. The `id` is the
same UUID as the matching row in `auth.users`, so a consultant's profile is
created automatically the moment their Auth user is created (see "Auto-create
consultant on signup" below). Used by the admin UI and any future "logged in
consultant" flows. `updated_at` is maintained by a trigger.

### `jobs`

Every job listing the site can show or hold for review — both jobs entered
internally by a consultant and jobs submitted by employers via the public
"Post a job" form. The `status` column drives visibility:

- `draft` — being written, not visible
- `pending_review` — submitted, awaiting consultant approval (default for
  employer submissions)
- `live` — visible on `/jobs`
- `closed` — past closing date, hidden from public list
- `rejected` — declined by a consultant

The `source` column distinguishes whether the row originated from an internal
consultant or from a public employer submission. `created_by` references the
consultant who owns the listing internally; for employer submissions it stays
null until a consultant picks it up. `updated_at` is maintained by a trigger.

Indexed on `status` and on `(status, created_at desc)` for the public list
and the admin queue.

### `employer_submissions`

When the public "Post a job" form is submitted, two rows are written: one in
`jobs` (status = `pending_review`) and one in this table holding the
contacting organisation's details. Joined to the job via the `job_id` foreign
key (one-to-one, cascade delete with the job).

### `candidates`

Candidates who registered via the `/register` form. Contains personal
contact, current role context, region preference, and the path to their CV
in the `cvs` storage bucket. Used by consultants to build candidate
shortlists.

### `employers`

Employers who registered via the `/register` form (separate from
`employer_submissions`, which is per-vacancy). This is a top-level "I'm an
employer interested in working with you" list.

### `applications`

Direct applications against a specific live `jobs` row. Anonymous visitors
fill the application form on a job's detail page; this writes one row here
plus uploads the CV to the `cvs` bucket.

### `enquiries`

A catch-all for unsolicited messages: the contact-form on `/contact`, "request
an introduction" forms in the candidate showcase modal, and the general
enquiry CTA at the bottom of `/staff`. The `enquiry_type` column records
which surface the message came from.

## Storage

### Bucket: `cvs` (private)

CV PDFs. Layout:

- `registrations/{candidate_id}/cv.pdf` — uploaded when a candidate
  registers.
- `applications/{application_id}/cv.pdf` — uploaded when someone applies to
  a specific job.

The bucket is private. Public users can write into it (so the public forms
work) but cannot read from it. Only authenticated consultants can read,
update or delete files.

## Row Level Security

RLS is enabled on **every** application table. Public (anonymous) users can
only do exactly what the public site needs; everything else requires an
authenticated consultant session.

- **`consultants`** — Authenticated users can read every consultant row.
  Each consultant can update only their own row.
- **`jobs`** — Anonymous users can read jobs whose status is `live` and can
  insert a new job _only_ when `source = employer` and
  `status = pending_review`. Authenticated consultants have full access.
- **`employer_submissions`** — Anonymous users can insert (for the public
  Post-a-job form). Only authenticated consultants can read, update or
  delete rows.
- **`candidates`** — Anonymous users can insert (registration form). Only
  authenticated consultants can read, update or delete.
- **`employers`** — Anonymous users can insert (employer registration). Only
  authenticated consultants can read, update or delete.
- **`applications`** — Anonymous users can insert (applying to a job). Only
  authenticated consultants can read, update or delete.
- **`enquiries`** — Anonymous users can insert (contact form, intro
  requests). Only authenticated consultants can read, update or delete.

### Storage policies for `cvs`

- Anonymous users can upload (insert into the bucket) — required for public
  form CV uploads.
- Anonymous users **cannot** list or read.
- Authenticated consultants can read, update and delete every file.

## Auto-create consultant on signup

A `BEFORE INSERT ON auth.users` trigger calls `public.handle_new_user()`,
which inserts a matching row into `public.consultants` populated from
`auth.users`. This means new consultants invited via the Supabase Auth UI
automatically get a profile row — no manual step.

## Helper function

`public.set_updated_at()` is a generic `BEFORE UPDATE` trigger applied to
`consultants` and `jobs` to keep the `updated_at` timestamp accurate.

## Applying schema changes

Future schema work should land as a new migration file, _not_ by editing
`0001_initial_schema.sql`:

1. Create `supabase/migrations/000N_<short_description>.sql`.
2. Push to the live database:

   ```bash
   npx supabase db push --db-url "postgresql://postgres.<project-ref>:<password>@aws-1-eu-west-2.pooler.supabase.com:5432/postgres"
   ```

   (or `npx supabase db push --linked` after `supabase link`).

3. Regenerate types and commit:

   ```bash
   npx supabase gen types typescript --linked > types/database.ts
   ```

   (Requires Docker locally for the postgres-meta image. If Docker isn't
   available, hand-edit `types/database.ts` to match the new schema.)

Never edit a migration after it's been pushed to production — write a new
one.
