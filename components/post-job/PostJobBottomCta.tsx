import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';

// Placeholder copy — client approval pending.
export function PostJobBottomCta() {
  return (
    <section className="container-page pb-20 pt-6 md:pt-10">
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
          <h2 className="text-neutral-900">Not ready to post a role yet?</h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-700">
            Have a look at the public sector talent currently open to moves — or just get in
            touch and tell us what you&apos;re planning.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/staff" className="btn-primary btn-lg">
              <Users className="h-4 w-4" aria-hidden="true" />
              Browse our candidates
            </Link>
            <Link href="/contact" className="btn-secondary btn-lg">
              Get in touch
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
