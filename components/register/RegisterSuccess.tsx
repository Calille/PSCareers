'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { RegisterType } from '@/lib/registerForm';

interface RegisterSuccessProps {
  type: RegisterType;
  reference: string;
}

// Placeholder copy — client approval pending.
export function RegisterSuccess({ type, reference }: RegisterSuccessProps) {
  const reduce = useReducedMotion();

  const message =
    type === 'candidate'
      ? 'One of our consultants will review your details and be in touch within 24 hours to discuss suitable opportunities.'
      : 'One of our consultants will be in touch within 24 hours to discuss your hiring needs.';

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
        <CheckCircle2 className="h-9 w-9" />
      </motion.span>

      <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
        Thanks — you&apos;re registered
      </h2>
      <p className="max-w-md text-sm leading-relaxed text-neutral-600 md:text-base">
        {message}
      </p>

      <div className="mt-2 rounded-full bg-neutral-100 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-neutral-700">
        Reference: <span className="font-mono text-neutral-900">{reference}</span>
      </div>

      <div className="mt-6">
        <Link href="/" className="btn-secondary">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
