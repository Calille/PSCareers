// notify-new-application
// Triggered by a Database Webhook on INSERT into public.applications.
// Looks up the matching job for the title/location, then emails every
// consultant.

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

interface ApplicationRecord {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string;
  cv_path: string;
  message: string | null;
  created_at: string;
}

interface JobRow {
  title: string;
  location: string;
  contract_type: string;
}

const JSON_HEADERS = { ...corsHeaders, 'Content-Type': 'application/json' };

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

  let payload: WebhookPayload<ApplicationRecord>;
  try {
    payload = (await req.json()) as WebhookPayload<ApplicationRecord>;
  } catch (e) {
    console.error('Bad JSON payload:', e);
    return new Response(JSON.stringify({ error: 'Invalid JSON.' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  if (payload.type !== 'INSERT' || payload.table !== 'applications') {
    return new Response(
      JSON.stringify({ skipped: true, reason: 'Not an applications INSERT.' }),
      { status: 200, headers: JSON_HEADERS },
    );
  }

  const r = payload.record;

  // Look up the job for context. If we can't find it, fall back gracefully.
  let job: JobRow | null = null;
  try {
    const sb = serviceClient();
    const { data, error } = await sb
      .from('jobs')
      .select('title, location, contract_type')
      .eq('id', r.job_id)
      .maybeSingle();
    if (error) console.error('Job lookup failed:', error.message);
    else job = data as JobRow | null;
  } catch (e) {
    console.error('Job lookup threw:', e);
  }

  const jobTitle = job?.title ?? '(job title unavailable)';

  const detailsRows = [
    { label: 'Applicant', value: r.full_name },
    { label: 'Email', value: r.email },
    { label: 'Phone', value: r.phone },
    { label: 'Job', value: jobTitle },
    { label: 'Location', value: job?.location ?? '' },
    { label: 'Contract type', value: job?.contract_type ?? '' },
    { label: 'CV path', value: r.cv_path },
  ];

  const bodyHtml = `
    <h1 style="margin:0 0 6px 0;font-size:20px;font-weight:700;">New application received</h1>
    <p style="margin:0 0 18px 0;color:#6B7280;font-size:14px;">
      ${escapeHtml(r.full_name)} has applied for ${escapeHtml(jobTitle)}.
    </p>
    ${renderDetailListHtml(detailsRows)}
    ${renderMessageBlockHtml('Message from applicant', r.message)}
  `;

  const bodyText =
    `New application received\n\n` +
    `${r.full_name} has applied for ${jobTitle}.\n\n` +
    renderDetailListText(detailsRows) +
    renderMessageBlockText('Message from applicant', r.message);

  try {
    const result = await notifyAllConsultants({
      subject: `New application: ${jobTitle}`,
      preheader: `${r.full_name} has applied for ${jobTitle}`,
      bodyHtml,
      bodyText,
      ctaLabel: 'View in admin',
      ctaUrl: adminUrl(`/admin/applications/${r.id}`),
    });
    console.log('notify-new-application:', JSON.stringify(result));
    return new Response(JSON.stringify({ ok: true, ...result }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (e) {
    // Per spec: log, don't fail the webhook.
    console.error('notify-new-application failed:', e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 200, headers: JSON_HEADERS },
    );
  }
});
