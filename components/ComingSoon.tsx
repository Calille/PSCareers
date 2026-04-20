import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  intro?: string;
}

export function ComingSoon({ title, intro }: ComingSoonProps) {
  return (
    <section className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-primary-50/60 to-white"
      />
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="eyebrow">Coming soon</span>
        <h1 className="mt-3">{title} — coming soon</h1>
        <p className="mt-4 max-w-xl text-neutral-600">
          {intro ??
            'This page is part of the next phase. In the meantime, keep browsing or get in touch directly.'}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link href="/contact" className="btn-secondary">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
