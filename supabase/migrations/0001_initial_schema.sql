-- Phase 8 — initial PS Careers schema
-- Tables, indexes, triggers, RLS policies, and storage bucket policies.

-- ============================================================================
-- HELPERS
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- TABLES
-- ============================================================================

-- consultants -----------------------------------------------------------------
create table if not exists public.consultants (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  job_title text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists consultants_set_updated_at on public.consultants;
create trigger consultants_set_updated_at
  before update on public.consultants
  for each row execute function public.set_updated_at();

-- jobs ------------------------------------------------------------------------
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  description text not null,
  summary text,
  requirements text,
  location text not null,
  region text,
  sector text not null,
  contract_type text not null,
  salary_min numeric,
  salary_max numeric,
  salary_display text,
  closing_date date,
  start_date date,
  status text not null default 'draft'
    check (status in ('draft', 'pending_review', 'live', 'closed', 'rejected')),
  source text not null default 'consultant'
    check (source in ('consultant', 'employer')),
  created_by uuid references public.consultants(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists jobs_status_idx on public.jobs(status);
create index if not exists jobs_status_created_at_idx
  on public.jobs(status, created_at desc);

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

-- employer_submissions --------------------------------------------------------
create table if not exists public.employer_submissions (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references public.jobs(id) on delete cascade,
  organisation_name text not null,
  organisation_type text not null,
  contact_name text not null,
  contact_job_title text not null,
  contact_email text not null,
  contact_phone text not null,
  additional_notes text,
  created_at timestamptz not null default now()
);

-- candidates ------------------------------------------------------------------
create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  current_job_title text not null,
  years_experience_band text not null,
  region text not null,
  contract_type_sought text not null,
  cv_path text not null,
  message text,
  consent_given boolean not null default false,
  created_at timestamptz not null default now()
);

-- employers -------------------------------------------------------------------
create table if not exists public.employers (
  id uuid primary key default gen_random_uuid(),
  organisation_name text not null,
  organisation_type text not null,
  contact_name text not null,
  contact_job_title text not null,
  email text not null,
  phone text not null,
  hiring_volume text,
  message text,
  consent_given boolean not null default false,
  created_at timestamptz not null default now()
);

-- applications ----------------------------------------------------------------
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  cv_path text not null,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists applications_job_id_idx on public.applications(job_id);

-- enquiries -------------------------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  enquiry_type text not null
    check (enquiry_type in ('contact_form', 'candidate_intro_request', 'general')),
  name text not null,
  email text not null,
  phone text,
  organisation text,
  subject text,
  message text not null,
  i_am_a text,
  candidate_reference text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table public.consultants enable row level security;
alter table public.jobs enable row level security;
alter table public.employer_submissions enable row level security;
alter table public.candidates enable row level security;
alter table public.employers enable row level security;
alter table public.applications enable row level security;
alter table public.enquiries enable row level security;

-- Idempotency: drop any policies that may already exist before recreating.
do $$
declare
  p record;
begin
  for p in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'consultants', 'jobs', 'employer_submissions',
        'candidates', 'employers', 'applications', 'enquiries'
      )
  loop
    execute format('drop policy if exists %I on %I.%I',
      p.policyname, p.schemaname, p.tablename);
  end loop;
end
$$;

-- consultants -----------------------------------------------------------------
create policy "consultants_select_authenticated"
  on public.consultants for select
  to authenticated
  using (true);

create policy "consultants_update_self"
  on public.consultants for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- jobs ------------------------------------------------------------------------
-- Anonymous: read live jobs only.
create policy "jobs_select_live_anon"
  on public.jobs for select
  to anon
  using (status = 'live');

-- Authenticated: full read.
create policy "jobs_select_authenticated"
  on public.jobs for select
  to authenticated
  using (true);

-- Anonymous: employer-submitted jobs only, must be pending review.
create policy "jobs_insert_anon_employer"
  on public.jobs for insert
  to anon
  with check (source = 'employer' and status = 'pending_review');

create policy "jobs_insert_authenticated"
  on public.jobs for insert
  to authenticated
  with check (true);

create policy "jobs_update_authenticated"
  on public.jobs for update
  to authenticated
  using (true)
  with check (true);

create policy "jobs_delete_authenticated"
  on public.jobs for delete
  to authenticated
  using (true);

-- employer_submissions --------------------------------------------------------
create policy "employer_submissions_insert_anon"
  on public.employer_submissions for insert
  to anon
  with check (true);

create policy "employer_submissions_select_authenticated"
  on public.employer_submissions for select
  to authenticated
  using (true);

create policy "employer_submissions_update_authenticated"
  on public.employer_submissions for update
  to authenticated
  using (true)
  with check (true);

create policy "employer_submissions_delete_authenticated"
  on public.employer_submissions for delete
  to authenticated
  using (true);

-- candidates ------------------------------------------------------------------
create policy "candidates_insert_anon"
  on public.candidates for insert
  to anon
  with check (true);

create policy "candidates_select_authenticated"
  on public.candidates for select
  to authenticated
  using (true);

create policy "candidates_update_authenticated"
  on public.candidates for update
  to authenticated
  using (true)
  with check (true);

create policy "candidates_delete_authenticated"
  on public.candidates for delete
  to authenticated
  using (true);

-- employers -------------------------------------------------------------------
create policy "employers_insert_anon"
  on public.employers for insert
  to anon
  with check (true);

create policy "employers_select_authenticated"
  on public.employers for select
  to authenticated
  using (true);

create policy "employers_update_authenticated"
  on public.employers for update
  to authenticated
  using (true)
  with check (true);

create policy "employers_delete_authenticated"
  on public.employers for delete
  to authenticated
  using (true);

-- applications ----------------------------------------------------------------
create policy "applications_insert_anon"
  on public.applications for insert
  to anon
  with check (true);

create policy "applications_select_authenticated"
  on public.applications for select
  to authenticated
  using (true);

create policy "applications_update_authenticated"
  on public.applications for update
  to authenticated
  using (true)
  with check (true);

create policy "applications_delete_authenticated"
  on public.applications for delete
  to authenticated
  using (true);

-- enquiries -------------------------------------------------------------------
create policy "enquiries_insert_anon"
  on public.enquiries for insert
  to anon
  with check (true);

create policy "enquiries_select_authenticated"
  on public.enquiries for select
  to authenticated
  using (true);

create policy "enquiries_update_authenticated"
  on public.enquiries for update
  to authenticated
  using (true)
  with check (true);

create policy "enquiries_delete_authenticated"
  on public.enquiries for delete
  to authenticated
  using (true);

-- ============================================================================
-- AUTO-CREATE CONSULTANT ON SIGNUP
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.consultants (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- STORAGE BUCKET: cvs (private)
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('cvs', 'cvs', false)
on conflict (id) do update set public = excluded.public;

-- Storage policies live on storage.objects. Drop and recreate for idempotency.
do $$
declare
  p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname in (
        'cvs_insert_anon',
        'cvs_select_authenticated',
        'cvs_update_authenticated',
        'cvs_delete_authenticated'
      )
  loop
    execute format('drop policy if exists %I on storage.objects', p.policyname);
  end loop;
end
$$;

create policy "cvs_insert_anon"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'cvs');

create policy "cvs_select_authenticated"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'cvs');

create policy "cvs_update_authenticated"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'cvs')
  with check (bucket_id = 'cvs');

create policy "cvs_delete_authenticated"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'cvs');
