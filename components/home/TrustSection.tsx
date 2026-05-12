'use client';

import { Compass, Handshake, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';
import { Section } from '@/components/Section';

// PLACEHOLDER COPY — pillars need client approval before launch.
const pillars = [
  {
    icon: ShieldCheck,
    title: 'Public sector specialists',
    body: 'Every consultant works exclusively within public sector recruitment — we speak your language, understand your frameworks, and know the sector.',
  },
  {
    icon: Handshake,
    title: 'Trusted by councils',
    body: 'From district councils to combined authorities, we partner with teams across the UK to deliver on permanent, interim and contract briefs.',
  },
  {
    icon: UsersRound,
    title: 'Candidate-first approach',
    body: 'Long-term relationships, honest advice, and roles that genuinely match your skills, values and career goals — not just the first vacancy on the list.',
  },
  {
    icon: Sparkles,
    title: 'Vetted candidates',
    body: 'Every shortlist is hand-screened against the brief — qualifications, sector context, motivation and right-to-work all checked before introduction.',
  },
  {
    icon: Compass,
    title: 'End-to-end support',
    body: 'From first call to first day, we stay close — advising on package, interview prep, on-boarding and the early weeks in role.',
  },
];

export function TrustSection() {
  return (
    <Section className="bg-white">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-sm tracking-[0.18em] md:text-base">Why PS Careers</span>
          <h2 className="mt-4">A recruitment partner built for the public sector</h2>
          <p className="mt-4 text-neutral-600">
            We combine deep sector expertise with the speed and transparency you&apos;d expect
            from a modern platform.
          </p>
        </div>

        {/*
          5 cards: 1 col mobile, 2 col tablet, 3 col desktop. Last row on
          desktop has 2 cards (cols 1-2) — natural grid flow leaves col 3
          empty, which reads cleanly because the cards are equal width.
        */}
        <div className="mt-12 grid gap-6 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map(({ icon: Icon, title, body }) => (
            <article key={title} className="card card-hover flex flex-col gap-4 md:p-7">
              <span
                aria-hidden="true"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700"
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
                <p className="text-sm leading-relaxed text-neutral-600">{body}</p>
              </div>
            </article>
          ))}
        </div>

        {/* PLACEHOLDER COPY — narrative paragraph reinforcing specialism.
            Awaiting final client wording. */}
        <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-neutral-600 md:text-[17px]">
          Public sector hiring is its own discipline — frameworks, governance,
          accountability, and a duty to spend public money well. Our team has spent
          careers inside and alongside the sector, which is why councils, NHS bodies and
          government departments choose us when the brief really matters.
        </p>
      </div>
    </Section>
  );
}
