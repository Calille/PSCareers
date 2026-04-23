'use client';

import Link from 'next/link';
import { Check, MessageCircle } from 'lucide-react';

// Placeholder copy — client approval pending.
const BENEFITS = [
  'Candidates vetted for the public sector',
  'Every role reviewed before going live',
  'A specialist consultant assigned to your role',
];

export function PostJobSidebar() {
  return (
    <aside className="order-first flex flex-col gap-5 lg:sticky lg:top-24 lg:order-none lg:self-start">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-subtle">
        <h2 className="text-base font-semibold text-neutral-900">Why post with us?</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm leading-relaxed text-neutral-700">
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700"
              >
                <Check className="h-3 w-3" />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-primary-50 p-6">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-primary-700 shadow-subtle"
          >
            <MessageCircle className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-neutral-900">Prefer to chat first?</h3>
            <p className="mt-1 text-sm leading-relaxed text-neutral-700">
              Not sure on the brief yet? Book a 15-minute call with a consultant and we&apos;ll
              help you scope the role.
            </p>
          </div>
        </div>
        <Link href="/contact" className="btn-secondary mt-4 w-full">
          Speak to a consultant
        </Link>
      </div>
    </aside>
  );
}
