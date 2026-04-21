import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CandidatesBrowser } from '@/components/candidates/CandidatesBrowser';

export const metadata: Metadata = {
  title: 'Available candidates',
  description:
    'Browse anonymised profiles of vetted public sector candidates currently seeking new roles — then let us make the introduction.',
};

export default function StaffPage() {
  return (
    <Suspense fallback={<StaffFallback />}>
      <CandidatesBrowser />
    </Suspense>
  );
}

function StaffFallback() {
  return (
    <section className="container-page py-24">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-56 rounded-full bg-neutral-100" />
        <div className="h-14 w-3/4 rounded-xl bg-neutral-100" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-neutral-100" />
          ))}
        </div>
      </div>
    </section>
  );
}
