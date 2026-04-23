import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';

// Placeholder copy — client approval pending.
// NOTE: points at the anonymous candidate showcase at /staff. Confirm with the client
// whether they want a dedicated "directors" / team page naming Adrian, Jonny, Claire
// etc. by name and photo — that would live at a new URL like /team or /directors.
export function AboutTeamTeaser() {
  return (
    <section className="container-page py-14 md:py-20">
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white px-6 py-12 shadow-subtle md:px-14 md:py-14">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            <span className="eyebrow">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              The team
            </span>
            <h2 className="mt-3 text-neutral-900">Meet the people behind PS Careers</h2>
            <p className="mt-3 text-neutral-600">
              Our consultants have each spent years embedded in the public sector. See the
              candidates they&apos;re currently representing on the candidate showcase.
            </p>
          </div>
          <Link href="/staff" className="btn-primary btn-lg justify-self-start md:justify-self-end">
            View candidate showcase
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
