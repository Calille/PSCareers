'use client';

import { AlertCircle, Mail, Phone } from 'lucide-react';
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  OFFICE_HOURS,
  TEAM_EMAILS,
} from '@/lib/contactForm';

// Placeholder copy — client approval pending.
export function ContactSidebar() {
  return (
    <aside className="order-first flex flex-col gap-5 lg:sticky lg:top-24 lg:order-none lg:self-start">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-subtle">
        <h2 className="text-base font-semibold text-neutral-900">Prefer another way?</h2>
        <ul className="mt-5 flex flex-col gap-4">
          <li className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700"
            >
              <Phone className="h-4 w-4" />
            </span>
            <div>
              <a
                href={CONTACT_PHONE_HREF}
                className="text-sm font-semibold text-neutral-900 hover:text-primary-700"
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
              <p className="text-xs text-neutral-500">{OFFICE_HOURS}</p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700"
            >
              <Mail className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">
                Email the team
              </p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {TEAM_EMAILS.map((t) => (
                  <li key={t.email} className="flex flex-wrap items-baseline gap-x-2 text-sm">
                    <span className="text-neutral-500">{t.name}</span>
                    <a
                      href={`mailto:${t.email}`}
                      className="break-all font-medium text-primary-700 hover:text-primary-800"
                    >
                      {t.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>

        <div className="my-5 border-t border-neutral-100" />

        <div className="flex items-start gap-3 rounded-xl bg-primary-50/60 p-4">
          <span
            aria-hidden="true"
            className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-primary-700 shadow-subtle"
          >
            <AlertCircle className="h-4 w-4" />
          </span>
          <p className="text-sm leading-relaxed text-neutral-700">
            For urgent hiring needs, call us directly — we&apos;ll get you straight through
            to a consultant.
          </p>
        </div>
      </div>
    </aside>
  );
}
