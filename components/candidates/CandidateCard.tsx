'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Candidate } from '@/types';

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
  onOpen: (candidate: Candidate) => void;
}

export function CandidateCard({ candidate, index, onOpen }: CandidateCardProps) {
  const open = () => onOpen(candidate);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index, 10) * 0.03, ease: 'easeOut' }}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View profile for candidate ${candidate.id}`}
      className="group flex h-full cursor-pointer flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-card focus-within:border-primary-300 focus-within:shadow-card"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
        {candidate.id}
      </span>
      <h3 className="mt-2 text-lg font-semibold text-neutral-900 transition-colors group-hover:text-primary-700">
        {candidate.roleTitle}
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-600">
        {candidate.shortBlurb}
      </p>

      <hr className="my-5 border-neutral-100" />

      {/* Experience column intentionally removed (Phase 7 director feedback) —
          full years-experience still appears in the expanded modal view. */}
      <dl className="mt-auto grid grid-cols-2 gap-3 text-left">
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
            Region
          </dt>
          <dd className="mt-1 text-sm font-semibold text-neutral-900">{candidate.region}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
            Qualified
          </dt>
          <dd className="mt-1 truncate text-sm font-semibold text-neutral-900">
            {candidate.qualifications[0]}
          </dd>
        </div>
      </dl>

      <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-primary-700 transition-transform duration-200 group-hover:translate-x-0.5">
        View profile
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    </motion.article>
  );
}
