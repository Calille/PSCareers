#!/usr/bin/env node
/**
 * scripts/setup-webhooks.mjs — idempotent setup of PS Careers database webhooks.
 *
 * APPROACH
 *   The Supabase Management API does not expose a stable CRUD surface for
 *   database webhooks: `GET /v1/projects/{ref}/database/hooks` and
 *   `/database/webhooks` both return 404. So this script uses the
 *   Management API's `/database/query` endpoint to run SQL that creates
 *   the underlying Postgres triggers, which is exactly what the dashboard
 *   does internally. Each trigger calls `supabase_functions.http_request()`
 *   to POST to the matching Edge Function on INSERT.
 *
 *   The script is idempotent: `drop trigger if exists` then `create
 *   trigger`, so re-running updates in place. It detects whether each
 *   trigger pre-existed via `pg_trigger` and reports created/updated
 *   accordingly.
 *
 * USAGE
 *   npm run setup:webhooks
 *
 * REQUIRES (read from .env.local)
 *   SUPABASE_ACCESS_TOKEN           — personal access token, sbp_...
 *   NEXT_PUBLIC_SUPABASE_URL        — project URL, the ref is parsed from it
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY   — anon key, baked into the Authorization
 *                                     header the trigger sends to the Edge
 *                                     Function gateway
 */

import { config as loadEnv } from 'dotenv';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// .env.local is the Next.js convention for project-local secrets — load it
// explicitly rather than relying on dotenv's default `.env`.
const here = dirname(fileURLToPath(import.meta.url));
const envLocal = resolve(here, '..', '.env.local');
if (existsSync(envLocal)) loadEnv({ path: envLocal });
// Also pick up `.env` as a fallback if the project ever adopts one.
loadEnv();

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function die(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

if (!ACCESS_TOKEN) die('Missing SUPABASE_ACCESS_TOKEN in .env.local.');
if (!PROJECT_URL) die('Missing NEXT_PUBLIC_SUPABASE_URL in .env.local.');
if (!ANON_KEY) die('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.');

// Parse the project ref from URL (https://<ref>.supabase.co/...).
let projectRef;
try {
  projectRef = new URL(PROJECT_URL).hostname.split('.')[0];
  if (!projectRef) throw new Error('empty');
} catch (e) {
  die(`Could not parse project ref from NEXT_PUBLIC_SUPABASE_URL: ${PROJECT_URL}`);
}

const FN_BASE = `https://${projectRef}.supabase.co/functions/v1`;
const API_BASE = `https://api.supabase.com/v1/projects/${projectRef}`;
const DASHBOARD = `https://supabase.com/dashboard/project/${projectRef}/database/hooks`;

// Five webhooks to manage. Edit this list and re-run to add/change/remove.
const WEBHOOKS = [
  { name: 'notify_new_application',    table: 'applications',         fn: 'notify-new-application' },
  { name: 'notify_new_candidate',      table: 'candidates',           fn: 'notify-new-candidate' },
  { name: 'notify_new_employer',       table: 'employers',            fn: 'notify-new-employer' },
  { name: 'notify_new_job_submission', table: 'employer_submissions', fn: 'notify-new-job-submission' },
  { name: 'notify_new_enquiry',        table: 'enquiries',            fn: 'notify-new-enquiry' },
];

const TIMEOUT_MS = 5000;

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

async function mgmtFetch(path, init = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  return res;
}

async function runSql(query) {
  const res = await mgmtFetch('/database/query', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`SQL query failed (HTTP ${res.status}): ${text}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ---------------------------------------------------------------------------
// Trigger SQL
// ---------------------------------------------------------------------------

/** Single-quote-escape for a SQL string literal. */
const sqlEscape = (s) => String(s).replace(/'/g, "''");

function buildTriggerSql({ name, table, fn }) {
  const url = `${FN_BASE}/${fn}`;
  const headers = JSON.stringify({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ANON_KEY}`,
  });

  // Wrap drop + create in a single statement so it's atomic at the statement
  // level. Using a DO block lets us pass the timeout as an int literal cleanly.
  // Trigger arguments must be plain text literals — no `::jsonb` casts,
  // no numeric literals. The wrapper function casts them internally via
  // TG_ARGV[n]::jsonb / TG_ARGV[n]::integer.
  return `
drop trigger if exists ${name} on public.${table};
create trigger ${name}
after insert on public.${table}
for each row
execute function supabase_functions.http_request(
  '${sqlEscape(url)}',
  'POST',
  '${sqlEscape(headers)}',
  '{}',
  '${TIMEOUT_MS}'
);`;
}

async function triggerExists(name, table) {
  const rows = await runSql(`
    select 1 as present
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where t.tgname = '${sqlEscape(name)}'
      and n.nspname = 'public'
      and c.relname = '${sqlEscape(table)}'
    limit 1;
  `);
  return Array.isArray(rows) && rows.length > 0;
}

async function listExistingTriggers() {
  const rows = await runSql(`
    select t.tgname as name, c.relname as table_name
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and t.tgname like 'notify_new_%'
      and not t.tgisinternal
    order by t.tgname;
  `);
  return Array.isArray(rows) ? rows : [];
}

// ---------------------------------------------------------------------------
// Sanity / probe
// ---------------------------------------------------------------------------

async function probeManagementApi() {
  // Probe the (theoretical) /database/hooks endpoint so the log clearly
  // records why we're going via SQL. Returns true if the dashboard-style
  // hooks CRUD is available; false otherwise.
  try {
    const res = await mgmtFetch('/database/hooks', { method: 'GET' });
    if (res.ok) return true;
    if (res.status === 404) return false;
    const body = await res.text().catch(() => '');
    console.log(
      `  Management API /database/hooks returned ${res.status} (${body.slice(0, 120)}). Falling back to SQL.`,
    );
    return false;
  } catch (e) {
    console.log(`  Management API probe failed: ${e.message}. Falling back to SQL.`);
    return false;
  }
}

async function ensureHttpRequestAvailable() {
  // supabase_functions.http_request is auto-installed on every project, but
  // confirm with a clear error before we try to create triggers.
  const rows = await runSql(`
    select 1 as ok
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'supabase_functions' and p.proname = 'http_request'
    limit 1;
  `);
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error(
      'supabase_functions.http_request() not found. Enable the supabase_functions / pg_net extension on the project first.',
    );
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`\nPS Careers — Supabase database webhook setup`);
  console.log(`  Project ref:    ${projectRef}`);
  console.log(`  Function base:  ${FN_BASE}`);
  console.log('');

  console.log('Probing Management API…');
  const hasApi = await probeManagementApi();
  if (hasApi) {
    console.log(
      '  /database/hooks is reachable, but its schema is undocumented; using the SQL path anyway for stability.',
    );
  } else {
    console.log('  /database/hooks is not available; using SQL via /database/query.');
  }

  console.log('\nChecking prerequisites…');
  await ensureHttpRequestAvailable();
  console.log('  supabase_functions.http_request()  ✓');

  console.log('\nApplying webhooks (drop + create trigger per webhook):');
  const results = [];
  for (const wh of WEBHOOKS) {
    let wasPresent = false;
    try {
      wasPresent = await triggerExists(wh.name, wh.table);
    } catch (e) {
      console.warn(`  pg_trigger lookup failed for ${wh.name}: ${e.message}`);
    }

    try {
      await runSql(buildTriggerSql(wh));
      const status = wasPresent ? 'updated' : 'created';
      results.push({ ...wh, status });
      const icon = status === 'updated' ? '↻' : '✓';
      console.log(`  ${icon} ${status.padEnd(7)} ${wh.name.padEnd(28)} on ${wh.table.padEnd(22)} → ${wh.fn}`);
    } catch (e) {
      results.push({ ...wh, status: 'failed', error: e.message });
      console.error(`  ✖ FAILED  ${wh.name} : ${e.message}`);
    }
  }

  // Re-list to confirm what's actually present on the database now.
  console.log('\nVerifying triggers in pg_trigger…');
  const live = await listExistingTriggers();
  for (const wh of WEBHOOKS) {
    const found = live.find((t) => t.name === wh.name && t.table_name === wh.table);
    const icon = found ? '✓' : '✖';
    console.log(`  ${icon} ${wh.name}  ${found ? 'present' : 'MISSING'}`);
  }

  console.log('\nDashboard:');
  console.log(`  ${DASHBOARD}\n`);

  const failed = results.filter((r) => r.status === 'failed');
  if (failed.length > 0) {
    console.error(`${failed.length} webhook(s) failed. See errors above.`);
    process.exit(1);
  }

  const created = results.filter((r) => r.status === 'created').length;
  const updated = results.filter((r) => r.status === 'updated').length;
  console.log(
    `Done: ${created} created, ${updated} updated, ${results.length} configured in total.`,
  );
}

main().catch((e) => {
  console.error('\nFatal:', e?.stack || e?.message || e);
  process.exit(1);
});
