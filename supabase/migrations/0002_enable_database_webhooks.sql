-- 0002 — enable Supabase database-webhook infrastructure.
--
-- Newer Supabase projects do not auto-install the `supabase_functions`
-- schema or the `http_request()` trigger wrapper until the first webhook
-- is created via the dashboard. We create everything here so:
--   1. Triggers calling `supabase_functions.http_request(...)` can be
--      created from SQL (see scripts/setup-webhooks.mjs).
--   2. The dashboard's Database → Webhooks page recognises them and lists
--      each one as a webhook (it parses triggers that call this exact
--      function).
--
-- The function body matches the standard Supabase wrapper around
-- `net.http_get()` / `net.http_post()` so future dashboard interactions
-- behave identically.

-- Enable pg_net (HTTP client used by the wrapper).
create extension if not exists pg_net with schema extensions;

-- Schema + invocation log table used by the dashboard.
create schema if not exists supabase_functions;

create table if not exists supabase_functions.hooks (
  id bigserial primary key,
  hook_table_id integer not null,
  hook_name text not null,
  created_at timestamptz not null default now(),
  request_id bigint
);

create index if not exists supabase_functions_hooks_h_table_id_h_name_idx
  on supabase_functions.hooks (hook_table_id, hook_name);
create index if not exists supabase_functions_hooks_request_id_idx
  on supabase_functions.hooks (request_id);

-- The wrapper trigger function. Called as e.g.
--   execute function supabase_functions.http_request(
--     'https://.../functions/v1/foo', 'POST',
--     '{"Content-Type":"application/json"}', '{}', '5000'
--   );
create or replace function supabase_functions.http_request()
returns trigger
language plpgsql
as $$
declare
  request_id bigint;
  payload jsonb;
  url text := TG_ARGV[0]::text;
  method text := TG_ARGV[1]::text;
  headers jsonb default '{}'::jsonb;
  params jsonb default '{}'::jsonb;
  timeout_ms integer default 1000;
begin
  if url is null or url = 'null' then
    raise exception 'url argument is missing';
  end if;

  if method is null or method = 'null' then
    raise exception 'method argument is missing';
  end if;

  if TG_ARGV[2] is null or TG_ARGV[2] = 'null' then
    headers = '{}'::jsonb;
  else
    headers = TG_ARGV[2]::jsonb;
  end if;

  if TG_ARGV[3] is null or TG_ARGV[3] = 'null' then
    params = '{}'::jsonb;
  else
    params = TG_ARGV[3]::jsonb;
  end if;

  if TG_ARGV[4] is null or TG_ARGV[4] = 'null' then
    timeout_ms = 1000;
  else
    timeout_ms = TG_ARGV[4]::integer;
  end if;

  case
    when method = 'GET' then
      select net.http_get into request_id from net.http_get(
        url,
        params,
        headers,
        timeout_ms
      );
    when method = 'POST' then
      payload = jsonb_build_object(
        'old_record', case when TG_OP in ('UPDATE','DELETE') then to_jsonb(OLD) else null end,
        'record',     case when TG_OP in ('INSERT','UPDATE') then to_jsonb(NEW) else null end,
        'type',       TG_OP,
        'table',      TG_TABLE_NAME,
        'schema',     TG_TABLE_SCHEMA
      );

      select net.http_post into request_id from net.http_post(
        url,
        payload,
        params,
        headers,
        timeout_ms
      );
    else
      raise exception 'method argument % is invalid', method;
  end case;

  insert into supabase_functions.hooks (hook_table_id, hook_name, request_id)
  values (TG_RELID, TG_NAME, request_id);

  return coalesce(NEW, OLD);
end
$$;

-- Permissions: grant usage to the standard Supabase roles so RLS/role
-- switching doesn't block trigger execution.
grant usage on schema supabase_functions to postgres, anon, authenticated, service_role;
grant all on all tables    in schema supabase_functions to postgres, anon, authenticated, service_role;
grant all on all functions in schema supabase_functions to postgres, anon, authenticated, service_role;
grant all on all sequences in schema supabase_functions to postgres, anon, authenticated, service_role;

alter default privileges in schema supabase_functions
  grant all on tables    to postgres, anon, authenticated, service_role;
alter default privileges in schema supabase_functions
  grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges in schema supabase_functions
  grant all on sequences to postgres, anon, authenticated, service_role;
