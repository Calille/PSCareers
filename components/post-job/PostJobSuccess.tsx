'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react';

interface PostJobSuccessProps {
  reference: string;
  onReset: () => void;
}

// Placeholder copy — client approval pending.
export function PostJobSuccess({ reference, onReset }: PostJobSuccessProps) {
  const reduce = useReducedMotion();

  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center shadow-subtle md:px-10 md:py-16"
    >
      <motion.span
        initial={reduce ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
        className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent-50 text-accent-600"
        aria-hidden="true"
      >
        <CheckCircle2 className="h-8 w-8" />
      </motion.span>

      <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
        Thanks — we&apos;ve received your submission
      </h2>
      <p className="max-w-md text-sm leading-relaxed text-neutral-600">
        One of our consultants will be in touch within 24 hours to confirm the details before
        your role goes live.
      </p>

      <div className="mt-2 rounded-full bg-neutral-100 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-neutral-700">
        Reference: <span className="font-mono text-neutral-900">{reference}</span>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
        <Link href="/" className="btn-secondary">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>
        <button type="button" onClick={onReset} className="btn-primary">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Submit another role
        </button>
      </div>
    </div>
  );
}
