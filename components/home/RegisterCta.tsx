'use client';

import Link from 'next/link';
import { Briefcase, UserRound } from 'lucide-react';
import { Section } from '@/components/Section';

export function RegisterCta() {
  return (
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
            <span className="eyebrow">Get started</span>
            <h2 className="mt-3 text-neutral-900">Register your interest</h2>
            <p className="mx-auto mt-4 max-w-xl text-neutral-700">
              Whether you&apos;re hiring into a public sector team or looking for your next role,
              we&apos;ll match you with a specialist consultant within 48 hours.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/register?as=candidate"
                className="btn-primary btn-lg w-full sm:w-auto"
              >
                <UserRound className="h-4 w-4" aria-hidden="true" />
                I&apos;m a candidate
              </Link>
              <Link
                href="/register?as=employer"
                className="btn-secondary btn-lg w-full sm:w-auto"
              >
                <Briefcase className="h-4 w-4" aria-hidden="true" />
                I&apos;m an employer
              </Link>
            </div>

            <p className="mt-5 text-xs text-neutral-500">
              No spam. No aggressive calls. A real conversation with a real consultant.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
