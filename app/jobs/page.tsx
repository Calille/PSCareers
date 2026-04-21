import { Suspense } from 'react';
import type { Metadata } from 'next';
import { JobsBrowser } from '@/components/jobs/JobsBrowser';

export const metadata: Metadata = {
  title: 'Job search',
  description:
    'Search the latest UK public sector jobs — councils, central government, NHS, education and emergency services.',
};

export default function JobsPage() {
  return (
    <Suspense fallback={<JobsFallback />}>
      <JobsBrowser />
    </Suspense>
  );
}

function JobsFallback() {
  return (
    <section className="container-page py-24">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 rounded-full bg-neutral-100" />
        <div className="h-14 rounded-full bg-neutral-100" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-neutral-100" />
          ))}
        </div>
      </div>
    </section>
  );
}
