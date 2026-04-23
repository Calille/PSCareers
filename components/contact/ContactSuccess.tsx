'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface ContactSuccessProps {
  onReset: () => void;
}

// Placeholder copy — client approval pending.
export function ContactSuccess({ onReset }: ContactSuccessProps) {
  const reduce = useReducedMotion();

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center shadow-subtle md:px-10 md:py-16"
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

      <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">Message sent</h2>
      <p className="max-w-md text-sm leading-relaxed text-neutral-600">
        Thanks for getting in touch. We&apos;ll reply within 24 hours.
      </p>

      <button type="button" onClick={onReset} className="btn-primary mt-4">
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Send another message
      </button>
    </div>
  );
}
