'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Briefcase, Sparkles } from 'lucide-react';
import { Section } from '@/components/Section';
import { ModalShell } from './ModalShell';
import { EnquiryForm } from './EnquiryForm';

// Placeholder copy — needs client approval.
export function CandidatesCta() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Section className="bg-white pb-20">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-2xl bg-primary-50 px-6 py-12 md:px-14 md:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-200/60 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-accent-200/50 blur-3xl"
            />

            <div className="relative mx-auto max-w-2xl text-center">
              <span className="eyebrow">Bespoke search</span>
              <h2 className="mt-3 text-neutral-900">Looking for someone specific?</h2>
              <p className="mx-auto mt-4 max-w-xl text-neutral-700">
                The showcase is just a snapshot. Many of our candidates are placed before they
                appear publicly — tell us who you need and we&apos;ll draw from our wider network.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button type="button" onClick={() => setOpen(true)} className="btn-primary btn-lg">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Tell us who you need
                </button>
                <Link href="/post-a-job" className="btn-secondary btn-lg">
                  <Briefcase className="h-4 w-4" aria-hidden="true" />
                  Post a job
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <ModalShell
        open={open}
        onClose={() => setOpen(false)}
        labelledBy="enquiry-modal-title"
      >
        <EnquiryForm
          titleId="enquiry-modal-title"
          heading="Tell us who you need"
          intro="Share a quick outline of the role or skill set you're hiring for. A consultant will follow up within 48 hours with shortlisted candidates from our wider network."
          submitLabel="Send enquiry"
          successMessage="Thanks — a consultant will be in touch within 48 hours with an initial shortlist."
          onSubmitted={() => {
            // Auto-close handled by user via X/outside click. Keep success visible.
          }}
        />
      </ModalShell>
    </>
  );
}
