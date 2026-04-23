import Link from 'next/link';
import { Briefcase, Sparkles } from 'lucide-react';

// Placeholder copy — client approval pending.
export function AboutCta() {
  return (
    <section className="container-page pb-20">
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
          <h2 className="text-neutral-900">Ready to work with us?</h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-700">
            Whether you&apos;re planning your next move or building out a team, start a
            conversation — we&apos;ll do the rest.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/register?type=candidate" className="btn-primary btn-lg">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Register as a candidate
            </Link>
            <Link href="/post-a-job" className="btn-secondary btn-lg">
              <Briefcase className="h-4 w-4" aria-hidden="true" />
              Post a role
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
