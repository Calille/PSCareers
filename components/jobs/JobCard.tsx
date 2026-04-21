'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Building2, MapPin, PoundSterling } from 'lucide-react';
import type { ContractType, Job } from '@/types';
import { relativePostedDate } from '@/lib/jobFilters';
import { cn } from '@/lib/utils';

// Placeholder contract badge colours — subtle surfaces, accent green used sparingly.
const CONTRACT_BADGE: Record<ContractType, string> = {
  Permanent: 'bg-accent-50 text-accent-700 ring-accent-100',
  Interim: 'bg-primary-50 text-primary-700 ring-primary-100',
  Contract: 'bg-amber-50 text-amber-800 ring-amber-100',
  Temporary: 'bg-neutral-100 text-neutral-700 ring-neutral-200',
};

interface JobCardProps {
  job: Job;
  index?: number;
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  const handleClick = () => {
    // Job detail page is a later phase — log for now.
    // eslint-disable-next-line no-console
    console.log('Job selected:', { id: job.id, title: job.title });
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index, 8) * 0.03, ease: 'easeOut' }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className="group cursor-pointer rounded-xl border border-neutral-200 bg-white p-5 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-card focus-within:border-primary-300 focus-within:shadow-card md:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[17px] font-semibold text-neutral-900 transition-colors group-hover:text-primary-700 md:text-lg">
            {job.title}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="truncate">{job.organisation}</span>
          </p>
        </div>
        <span
          className={cn(
            'inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
            CONTRACT_BADGE[job.contractType],
          )}
        >
          {job.contractType}
        </span>
      </div>

      <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-700">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-neutral-400" aria-hidden="true" />
          <dt className="sr-only">Location</dt>
          <dd>
            {job.location}
            <span className="text-neutral-400"> · {job.region}</span>
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <PoundSterling className="h-4 w-4 text-neutral-400" aria-hidden="true" />
          <dt className="sr-only">Salary</dt>
          <dd>{job.salary}</dd>
        </div>
      </dl>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-neutral-600">
        {job.description}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
        <span className="text-xs text-neutral-500">{relativePostedDate(job.postedAt)}</span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 transition-transform duration-200 group-hover:translate-x-0.5">
          View role
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </motion.article>
  );
}
