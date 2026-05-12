// Shared email helpers for the notify-* Edge Functions.
//
// - serviceClient(): a Supabase client using the service role key (auto-
//   injected by the Edge Functions runtime). RLS-bypassing — never expose.
// - getAllConsultantEmails(): returns every email in `consultants`.
// - sendEmail(): single Resend API call (HTML + text fallback).
// - notifyAllConsultants(): renders the branded template, fans out one
//   email per consultant. Errors are logged, never thrown to the caller.
// - renderEmail() / renderEmailText(): the branded wrapper.
// - escapeHtml(): tiny helper for user-supplied content.

// @ts-ignore Deno-style remote import; resolved at deploy time, not by tsc.
import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// Deno is provided by the Edge Functions runtime.
declare const Deno: {
  env: { get(key: string): string | undefined };
};

// ---------------------------------------------------------------------------
// Supabase service-role client
// ---------------------------------------------------------------------------

let _serviceClient: SupabaseClient | null = null;

export function serviceClient(): SupabaseClient {
  if (_serviceClient) return _serviceClient;
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Edge Function env.',
    );
  }
  _serviceClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _serviceClient;
}

// ---------------------------------------------------------------------------
// Consultant lookup
// ---------------------------------------------------------------------------

export async function getAllConsultantEmails(): Promise<string[]> {
  const sb = serviceClient();
  const { data, error } = await sb.from('consultants').select('email');
  if (error) {
    console.error('Failed to fetch consultant emails:', error.message);
    return [];
  }
  const emails = (data ?? [])
    .map((r: { email: string | null }) => r.email)
    .filter((e: string | null): e is string => !!e && e.trim().length > 0);
  return emails;
}

// ---------------------------------------------------------------------------
// Resend sender
// ---------------------------------------------------------------------------

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail(args: SendEmailArgs): Promise<boolean> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('NOTIFICATION_FROM_EMAIL');
  if (!apiKey || !from) {
    throw new Error(
      'Missing RESEND_API_KEY or NOTIFICATION_FROM_EMAIL Supabase secrets.',
    );
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [args.to],
        subject: args.subject,
        html: args.html,
        text: args.text,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '<no body>');
      console.error(`Resend send to ${args.to} failed: ${res.status} ${body}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`Resend send to ${args.to} threw:`, e);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Fan-out
// ---------------------------------------------------------------------------

export interface NotifyArgs {
  subject: string;
  preheader: string;
  /** HTML for the body content area (already-rendered, escaped where needed). */
  bodyHtml: string;
  /** Plain-text equivalent of the same body. */
  bodyText: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface NotifyResult {
  recipients: number;
  sent: number;
  failed: number;
}

export async function notifyAllConsultants(args: NotifyArgs): Promise<NotifyResult> {
  const recipients = await getAllConsultantEmails();
  if (recipients.length === 0) {
    console.warn('No consultants to notify; skipping email fan-out.');
    return { recipients: 0, sent: 0, failed: 0 };
  }

  const html = renderEmail(args);
  const text = renderEmailText(args);

  let sent = 0;
  let failed = 0;
  for (const to of recipients) {
    const ok = await sendEmail({ to, subject: args.subject, html, text });
    if (ok) sent++;
    else failed++;
  }
  return { recipients: recipients.length, sent, failed };
}

// ---------------------------------------------------------------------------
// Template
// ---------------------------------------------------------------------------

export function escapeHtml(input: string | null | undefined): string {
  if (input === null || input === undefined) return '';
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const PRIMARY = '#6D28D9'; // PS Careers purple
const ACCENT = '#16A34A'; // PS Careers green
const BORDER = '#E5E7EB';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6B7280';
const FONT_STACK =
  "'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif";

function ctaButton(label: string, url: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 4px 0;">
      <tr>
        <td align="center" bgcolor="${PRIMARY}" style="border-radius:8px;background:${PRIMARY};">
          <a href="${escapeHtml(url)}"
             style="display:inline-block;padding:12px 22px;color:#ffffff;background:${PRIMARY};
                    text-decoration:none;font-weight:600;font-size:14px;line-height:1;
                    border-radius:8px;font-family:${FONT_STACK};">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>
  `;
}

export function renderEmail(args: NotifyArgs): string {
  const cta = args.ctaLabel && args.ctaUrl ? ctaButton(args.ctaLabel, args.ctaUrl) : '';
  const preheader = escapeHtml(args.preheader);
  const subject = escapeHtml(args.subject);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;background:#F5F5F7;color:${TEXT_DARK};font-family:${FONT_STACK};">
    <!-- Preheader (hidden in body, shown in inbox preview) -->
    <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#F5F5F7;">
      ${preheader}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F5F7;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
                 style="max-width:600px;background:#ffffff;border:1px solid ${BORDER};border-radius:12px;overflow:hidden;">
            <!-- Brand bar -->
            <tr>
              <td style="background:${PRIMARY};padding:20px 28px;">
                <span style="color:#ffffff;font-family:${FONT_STACK};font-weight:700;font-size:16px;letter-spacing:0.02em;">
                  Public Sector Careers
                </span>
                <span style="display:inline-block;width:6px;height:6px;border-radius:9999px;background:${ACCENT};margin-left:8px;vertical-align:middle;"></span>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px;font-family:${FONT_STACK};color:${TEXT_DARK};font-size:15px;line-height:1.55;">
                ${args.bodyHtml}
                ${cta}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="border-top:1px solid ${BORDER};padding:18px 28px;background:#FAFAFB;">
                <p style="margin:0;font-family:${FONT_STACK};font-size:12px;color:${TEXT_MUTED};">
                  Public Sector Careers Ltd · Internal notification — please do not reply.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderEmailText(args: NotifyArgs): string {
  const cta = args.ctaLabel && args.ctaUrl ? `\n\n${args.ctaLabel}: ${args.ctaUrl}\n` : '\n';
  return [
    'Public Sector Careers — internal notification',
    '------------------------------------------------',
    '',
    args.bodyText.trim(),
    cta,
    '— Public Sector Careers Ltd',
  ]
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}

// ---------------------------------------------------------------------------
// Body builders shared across functions
// ---------------------------------------------------------------------------

export interface DetailRow {
  label: string;
  value: string | null | undefined;
}

/**
 * Render a key/value detail block. Empty/null values are skipped so the
 * email doesn't show empty rows. `value` is HTML-escaped automatically.
 */
export function renderDetailListHtml(rows: DetailRow[]): string {
  const cells = rows
    .filter((r) => r.value !== null && r.value !== undefined && String(r.value).trim() !== '')
    .map(
      (r) => `
        <tr>
          <td style="padding:8px 0;width:170px;color:${TEXT_MUTED};font-size:13px;vertical-align:top;">
            ${escapeHtml(r.label)}
          </td>
          <td style="padding:8px 0;color:${TEXT_DARK};font-size:14px;font-weight:600;vertical-align:top;">
            ${escapeHtml(String(r.value))}
          </td>
        </tr>`,
    )
    .join('');

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${cells}</table>`;
}

export function renderDetailListText(rows: DetailRow[]): string {
  return rows
    .filter((r) => r.value !== null && r.value !== undefined && String(r.value).trim() !== '')
    .map((r) => `${r.label}: ${r.value}`)
    .join('\n');
}

export function renderMessageBlockHtml(label: string, message: string | null | undefined): string {
  if (!message || !message.trim()) return '';
  return `
    <div style="margin-top:18px;padding:14px 16px;background:#F9FAFB;border:1px solid ${BORDER};border-radius:8px;">
      <p style="margin:0 0 6px 0;font-size:12px;color:${TEXT_MUTED};text-transform:uppercase;letter-spacing:0.08em;">
        ${escapeHtml(label)}
      </p>
      <p style="margin:0;font-size:14px;color:${TEXT_DARK};white-space:pre-wrap;line-height:1.55;">
        ${escapeHtml(message)}
      </p>
    </div>
  `;
}

export function renderMessageBlockText(label: string, message: string | null | undefined): string {
  if (!message || !message.trim()) return '';
  return `\n${label}:\n${message.trim()}\n`;
}

// ---------------------------------------------------------------------------
// Webhook payload helpers
// ---------------------------------------------------------------------------

export interface WebhookPayload<T = Record<string, unknown>> {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  record: T;
  old_record: T | null;
}

export function adminBaseUrl(): string {
  const fromEnv = Deno.env.get('ADMIN_BASE_URL');
  return (fromEnv && fromEnv.trim()) || 'https://pscareers.co.uk';
}

export function adminUrl(path: string): string {
  const base = adminBaseUrl().replace(/\/+$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}
