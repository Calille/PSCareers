'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/Section';
import { mockCandidates } from '@/lib/mockData';

// Reframed in Phase 7 — was "Meet our team" pointing at /staff (which is
// actually the anonymous candidate showcase). Now this section previews
// real candidates with anonymised reference codes, rather than implying
// these are PS Careers staff.
//
// PLACEHOLDER COPY — heading and supporting line awaiting client approval.
export function StaffSection() {
  const featured = mockCandidates.slice(0, 3);

  return (
    <Section className="bg-neutral-50">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="eyebrow">Available talent</span>
            <h2 className="mt-3">Candidates ready to join your team</h2>
            <p className="mt-4 text-neutral-600">
              A preview of vetted public sector professionals currently seeking new roles.
              Profiles are anonymised — request an introduction and we&apos;ll handle it
              personally.
            </p>
          </div>
          <Link
            href="/staff"
            className="hidden text-sm font-semibold text-primary-700 hover:text-primary-800 md:inline-flex md:items-center md:gap-1"
          >
            Browse all candidates
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {featured.map((candidate) => (
            <li key={candidate.id}>
              <Link
                href="/staff"
                className="group flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-card"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  {candidate.id}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-neutral-900 transition-colors group-hover:text-primary-700">
                  {candidate.roleTitle}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-600">
                  {candidate.shortBlurb}
                </p>

                <hr className="my-5 border-neutral-100" />

                {/* Experience column intentionally removed (Phase 7). */}
                <dl className="mt-auto grid grid-cols-2 gap-3">
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                      Region
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-neutral-900">
                      {candidate.region}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                      Qualified
                    </dt>
                    <dd className="mt-1 truncate text-sm font-semibold text-neutral-900">
                      {candidate.qualifications[0]}
                    </dd>
                  </div>
                </dl>

                <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-primary-700 transition-transform duration-200 group-hover:translate-x-0.5">
                  View profile
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex md:hidden">
          <Link href="/staff" className="btn-secondary w-full">
            Browse all candidates
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
