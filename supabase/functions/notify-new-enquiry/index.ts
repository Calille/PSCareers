// notify-new-enquiry
// Triggered by a Database Webhook on INSERT into public.enquiries.
// One function handles all three enquiry_type values; the subject and
// preheader branch internally.

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

type EnquiryType = 'contact_form' | 'candidate_intro_request' | 'general';

interface EnquiryRecord {
  id: string;
  enquiry_type: EnquiryType;
  name: string;
  email: string;
  phone: string | null;
  organisation: string | null;
  subject: string | null;
  message: string;
  i_am_a: string | null;
  candidate_reference: string | null;
  created_at: string;
}

const JSON_HEADERS = { ...corsHeaders, 'Content-Type': 'application/json' };

function buildSubjectAndPreheader(r: EnquiryRecord): {
  subject: string;
  preheader: string;
  heading: string;
} {
  switch (r.enquiry_type) {
    case 'contact_form':
      return {
        subject: `New contact enquiry: ${r.subject?.trim() || '(no subject)'}`,
        preheader: `From ${r.name}`,
        heading: 'New contact enquiry',
      };
    case 'candidate_intro_request':
      return {
        subject: `Intro requested for ${r.candidate_reference ?? '(no reference)'}`,
        preheader: `From ${r.name}${r.organisation ? ` at ${r.organisation}` : ''}`,
        heading: 'Candidate introduction request',
      };
    case 'general':
    default:
      return {
        subject: `New enquiry: ${r.subject?.trim() || '(no subject)'}`,
        preheader: `From ${r.name}`,
        heading: 'New enquiry',
      };
  }
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

  let payload: WebhookPayload<EnquiryRecord>;
  try {
    payload = (await req.json()) as WebhookPayload<EnquiryRecord>;
  } catch (e) {
    console.error('Bad JSON payload:', e);
    return new Response(JSON.stringify({ error: 'Invalid JSON.' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  if (payload.type !== 'INSERT' || payload.table !== 'enquiries') {
    return new Response(
      JSON.stringify({ skipped: true, reason: 'Not an enquiries INSERT.' }),
      { status: 200, headers: JSON_HEADERS },
    );
  }

  const r = payload.record;
  const { subject, preheader, heading } = buildSubjectAndPreheader(r);

  const detailsRows = [
    { label: 'Type', value: r.enquiry_type.replace(/_/g, ' ') },
    { label: 'Name', value: r.name },
    { label: 'Email', value: r.email },
    { label: 'Phone', value: r.phone ?? '' },
    { label: 'Organisation', value: r.organisation ?? '' },
    { label: 'I am a', value: r.i_am_a ?? '' },
    { label: 'Candidate reference', value: r.candidate_reference ?? '' },
    { label: 'Subject', value: r.subject ?? '' },
  ];

  const bodyHtml = `
    <h1 style="margin:0 0 6px 0;font-size:20px;font-weight:700;">${escapeHtml(heading)}</h1>
    <p style="margin:0 0 18px 0;color:#6B7280;font-size:14px;">
      ${escapeHtml(preheader)}
    </p>
    ${renderDetailListHtml(detailsRows)}
    ${renderMessageBlockHtml('Message', r.message)}
  `;

  const bodyText =
    `${heading}\n\n` +
    `${preheader}\n\n` +
    renderDetailListText(detailsRows) +
    renderMessageBlockText('Message', r.message);

  try {
    const result = await notifyAllConsultants({
      subject,
      preheader,
      bodyHtml,
      bodyText,
      ctaLabel: 'View in admin',
      ctaUrl: adminUrl(`/admin/enquiries/${r.id}`),
    });
    console.log('notify-new-enquiry:', JSON.stringify({ enquiry_type: r.enquiry_type, ...result }));
    return new Response(JSON.stringify({ ok: true, ...result }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (e) {
    console.error('notify-new-enquiry failed:', e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 200, headers: JSON_HEADERS },
    );
  }
});
