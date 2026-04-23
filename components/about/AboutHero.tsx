'use client';

import { motion, useReducedMotion } from 'framer-motion';

// Placeholder copy — client approval pending.
export function AboutHero() {
  const reduce = useReducedMotion();
  const anim = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, ease: 'easeOut', delay },
        };

  return (
    <section className="relative overflow-hidden border-b border-neutral-200">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary-50/60 via-white to-white"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-16 -z-10 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-32 -z-10 h-64 w-64 rounded-full bg-accent-200/40 blur-3xl"
      />

      <div className="container-page pb-14 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.span {...anim(0)} className="eyebrow">
            About Public Sector Careers
          </motion.span>
          <motion.h1
            {...anim(0.05)}
            className="mt-4 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl"
          >
            Specialist recruitment built for the public sector
          </motion.h1>
          <motion.p
            {...anim(0.1)}
            className="mx-auto mt-5 max-w-2xl text-base text-neutral-600 md:text-lg"
          >
            We place talented people into meaningful roles across UK councils, government
            agencies, the NHS and beyond — with consultants who know the sector inside out.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
