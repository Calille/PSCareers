// notify-new-employer
// Triggered by a Database Webhook on INSERT into public.employers.

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

interface EmployerRecord {
  id: string;
  organisation_name: string;
  organisation_type: string;
  contact_name: string;
  contact_job_title: string;
  email: string;
  phone: string;
  hiring_volume: string | null;
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

  let payload: WebhookPayload<EmployerRecord>;
  try {
    payload = (await req.json()) as WebhookPayload<EmployerRecord>;
  } catch (e) {
    console.error('Bad JSON payload:', e);
    return new Response(JSON.stringify({ error: 'Invalid JSON.' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  if (payload.type !== 'INSERT' || payload.table !== 'employers') {
    return new Response(
      JSON.stringify({ skipped: true, reason: 'Not an employers INSERT.' }),
      { status: 200, headers: JSON_HEADERS },
    );
  }

  const r = payload.record;

  const detailsRows = [
    { label: 'Organisation', value: r.organisation_name },
    { label: 'Type', value: r.organisation_type },
    { label: 'Contact', value: r.contact_name },
    { label: 'Job title', value: r.contact_job_title },
    { label: 'Email', value: r.email },
    { label: 'Phone', value: r.phone },
    { label: 'Hiring volume', value: r.hiring_volume ?? '' },
    { label: 'Marketing consent', value: r.consent_given ? 'Yes' : 'No' },
  ];

  const bodyHtml = `
    <h1 style="margin:0 0 6px 0;font-size:20px;font-weight:700;">New employer registered</h1>
    <p style="margin:0 0 18px 0;color:#6B7280;font-size:14px;">
      ${escapeHtml(r.organisation_type)}${r.hiring_volume ? ` — ${escapeHtml(r.hiring_volume)}` : ''}
    </p>
    ${renderDetailListHtml(detailsRows)}
    ${renderMessageBlockHtml('Message from employer', r.message)}
  `;

  const bodyText =
    `New employer registered\n\n` +
    `${r.organisation_type}${r.hiring_volume ? ` — ${r.hiring_volume}` : ''}\n\n` +
    renderDetailListText(detailsRows) +
    renderMessageBlockText('Message from employer', r.message);

  try {
    const result = await notifyAllConsultants({
      subject: `New employer registered: ${r.organisation_name}`,
      preheader: `${r.organisation_type}${r.hiring_volume ? ` — ${r.hiring_volume}` : ''}`,
      bodyHtml,
      bodyText,
      ctaLabel: 'View in admin',
      ctaUrl: adminUrl(`/admin/employers/${r.id}`),
    });
    console.log('notify-new-employer:', JSON.stringify(result));
    return new Response(JSON.stringify({ ok: true, ...result }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (e) {
    console.error('notify-new-employer failed:', e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 200, headers: JSON_HEADERS },
    );
  }
});
