// notify-new-candidate
// Triggered by a Database Webhook on INSERT into public.candidates.

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
} from '../_shared/email.ts';

declare const Deno: { env: { get(key: string): string | undefined } };

interface CandidateRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  current_job_title: string;
  years_experience_band: string;
  region: string;
  contract_type_sought: string;
  cv_path: string;
  message: string | null;
  consent_given: boolean;
  created_at: string;
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

  let payload: WebhookPayload<CandidateRecord>;
  try {
    payload = (await req.json()) as WebhookPayload<CandidateRecord>;
  } catch (e) {
    console.error('Bad JSON payload:', e);
    return new Response(JSON.stringify({ error: 'Invalid JSON.' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  if (payload.type !== 'INSERT' || payload.table !== 'candidates') {
    return new Response(
      JSON.stringify({ skipped: true, reason: 'Not a candidates INSERT.' }),
      { status: 200, headers: JSON_HEADERS },
    );
  }

  const r = payload.record;

  const detailsRows = [
    { label: 'Name', value: r.full_name },
    { label: 'Current role', value: r.current_job_title },
    { label: 'Years experience', value: r.years_experience_band },
    { label: 'Region', value: r.region },
    { label: 'Contract sought', value: r.contract_type_sought },
    { label: 'Email', value: r.email },
    { label: 'Phone', value: r.phone },
    { label: 'CV path', value: r.cv_path },
    { label: 'Marketing consent', value: r.consent_given ? 'Yes' : 'No' },
  ];

  const bodyHtml = `
    <h1 style="margin:0 0 6px 0;font-size:20px;font-weight:700;">New candidate registered</h1>
    <p style="margin:0 0 18px 0;color:#6B7280;font-size:14px;">
      ${escapeHtml(r.current_job_title)} — ${escapeHtml(r.region)}
    </p>
    ${renderDetailListHtml(detailsRows)}
    ${renderMessageBlockHtml('Message from candidate', r.message)}
  `;

  const bodyText =
    `New candidate registered\n\n` +
    `${r.current_job_title} — ${r.region}\n\n` +
    renderDetailListText(detailsRows) +
    renderMessageBlockText('Message from candidate', r.message);

  try {
    const result = await notifyAllConsultants({
      subject: `New candidate registered: ${r.full_name}`,
      preheader: `${r.current_job_title} — ${r.region}`,
      bodyHtml,
      bodyText,
      ctaLabel: 'View in admin',
      ctaUrl: adminUrl(`/admin/candidates/${r.id}`),
    });
    console.log('notify-new-candidate:', JSON.stringify(result));
    return new Response(JSON.stringify({ ok: true, ...result }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (e) {
    console.error('notify-new-candidate failed:', e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 200, headers: JSON_HEADERS },
    );
  }
});
