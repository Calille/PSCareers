// notify-new-job-submission
// Triggered by a Database Webhook on INSERT into public.employer_submissions.
// The matching jobs row is inserted in the same transaction; we look it up
// here for the title, location, contract and salary detail.

// @ts-ignore Deno-style remote import; resolved at deploy time.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import {
  WebhookPayload,
  adminUrl,
  escapeHtml,
  notifyAllConsultants,
  renderDetailListHtml,
  renderDetailListText,
  renderMessageBlockHtml,
  renderMessageBlockText,
  serviceClient,
} from '../_shared/email.ts';

declare const Deno: { env: { get(key: string): string | undefined } };

interface SubmissionRecord {
  id: string;
  job_id: string;
  organisation_name: string;
  organisation_type: string;
  contact_name: string;
  contact_job_title: string;
  contact_email: string;
  contact_phone: string;
  additional_notes: string | null;
  created_at: string;
}

interface JobRow {
  title: string;
  summary: string | null;
  location: string;
  region: string | null;
  contract_type: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_display: string | null;
  closing_date: string | null;
  start_date: string | null;
}

const JSON_HEADERS = { ...corsHeaders, 'Content-Type': 'application/json' };

function formatSalary(job: JobRow | null): string {
  if (!job) return '';
  if (job.salary_display) return job.salary_display;
  const fmt = (n: number) => `£${n.toLocaleString('en-GB')}`;
  if (job.salary_min != null && job.salary_max != null)
    return `${fmt(job.salary_min)} – ${fmt(job.salary_max)}`;
  if (job.salary_min != null) return `${fmt(job.salary_min)}+`;
  if (job.salary_max != null) return `up to ${fmt(job.salary_max)}`;
  return '';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!Deno.env.get('RESEND_API_KEY') || !Deno.env.get('NOTIFICATION_FROM_EMAIL')) {
    return new Response(
      JSON.stringify({ error: 'Email secrets not configured.' }),
      { status: 500, headers: JSON_HEADERS },
    );
  }

  let payload: WebhookPayload<SubmissionRecord>;
  try {
    payload = (await req.json()) as WebhookPayload<SubmissionRecord>;
  } catch (e) {
    console.error('Bad JSON payload:', e);
    return new Response(JSON.stringify({ error: 'Invalid JSON.' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  if (payload.type !== 'INSERT' || payload.table !== 'employer_submissions') {
    return new Response(
      JSON.stringify({
        skipped: true,
        reason: 'Not an employer_submissions INSERT.',
      }),
      { status: 200, headers: JSON_HEADERS },
    );
  }

  const r = payload.record;

  // Fetch the matching jobs row for richer context.
  let job: JobRow | null = null;
  try {
    const sb = serviceClient();
    const { data, error } = await sb
      .from('jobs')
      .select(
        'title, summary, location, region, contract_type, salary_min, salary_max, salary_display, closing_date, start_date',
      )
      .eq('id', r.job_id)
      .maybeSingle();
    if (error) console.error('Job lookup failed:', error.message);
    else job = data as JobRow | null;
  } catch (e) {
    console.error('Job lookup threw:', e);
  }

  const jobTitle = job?.title ?? '(job title unavailable)';
  const locationDisplay = job
    ? `${job.location}${job.region ? `, ${job.region}` : ''}`
    : '';

  const detailsRows = [
    { label: 'Organisation', value: r.organisation_name },
    { label: 'Org type', value: r.organisation_type },
    { label: 'Job title', value: jobTitle },
    { label: 'Location', value: locationDisplay },
    { label: 'Contract type', value: job?.contract_type ?? '' },
    { label: 'Salary', value: formatSalary(job) },
    { label: 'Closing date', value: job?.closing_date ?? '' },
    { label: 'Start date', value: job?.start_date ?? '' },
    { label: 'Contact', value: r.contact_name },
    { label: 'Job title (contact)', value: r.contact_job_title },
    { label: 'Email', value: r.contact_email },
    { label: 'Phone', value: r.contact_phone },
  ];

  const bodyHtml = `
    <h1 style="margin:0 0 6px 0;font-size:20px;font-weight:700;">New job submission</h1>
    <p style="margin:0 0 18px 0;color:#6B7280;font-size:14px;">
      ${escapeHtml(r.organisation_name)} — awaiting review.
    </p>
    ${renderDetailListHtml(detailsRows)}
    ${renderMessageBlockHtml('Job summary', job?.summary ?? '')}
    ${renderMessageBlockHtml('Additional notes from organisation', r.additional_notes)}
  `;

  const bodyText =
    `New job submission\n\n` +
    `${r.organisation_name} — awaiting review.\n\n` +
    renderDetailListText(detailsRows) +
    renderMessageBlockText('Job summary', job?.summary ?? '') +
    renderMessageBlockText('Additional notes from organisation', r.additional_notes);

  try {
    const result = await notifyAllConsultants({
      subject: `New job submission: ${jobTitle} from ${r.organisation_name}`,
      preheader: 'Awaiting review',
      bodyHtml,
      bodyText,
      ctaLabel: 'Review submission',
      ctaUrl: adminUrl(`/admin/jobs/${r.job_id}`),
    });
    console.log('notify-new-job-submission:', JSON.stringify(result));
    return new Response(JSON.stringify({ ok: true, ...result }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (e) {
    console.error('notify-new-job-submission failed:', e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 200, headers: JSON_HEADERS },
    );
  }
});
