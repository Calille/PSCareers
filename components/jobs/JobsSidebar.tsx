import Link from 'next/link';
import { ArrowRight, Briefcase, UserRound } from 'lucide-react';

// Placeholder copy — client approval needed.
export function JobsSidebar() {
  return (
    <aside
      aria-label="Related actions"
      className="flex flex-col gap-4 lg:sticky lg:top-24"
    >
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-subtle">
        <span
          aria-hidden="true"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700"
        >
          <UserRound className="h-5 w-5" />
        </span>
        <h3 className="mt-3 text-base font-semibold text-neutral-900">
          Can&apos;t find the right role?
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          Register as a candidate and a specialist consultant will be in touch with roles tailored
          to your experience.
        </p>
        <Link
          href="/register?type=candidate"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:text-primary-800"
        >
          Register your interest
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-subtle">
        <span
          aria-hidden="true"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-700"
        >
          <Briefcase className="h-5 w-5" />
        </span>
        <h3 className="mt-3 text-base font-semibold text-neutral-900">Hiring for your team?</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          Tell us about your vacancy and we&apos;ll match it to our network of public sector
          professionals.
        </p>
        <Link
          href="/post-a-job"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:text-primary-800"
        >
          Post a job
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
