'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { HeroSearch } from './HeroSearch';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut', delay },
});

export function Hero() {
  const reduce = useReducedMotion();
  const anim = (delay: number) => (reduce ? {} : fadeUp(delay));

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary-50/60 via-white to-white"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 -z-10 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-40 -z-10 h-64 w-64 rounded-full bg-accent-200/40 blur-3xl"
      />

      <div className="container-page pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            {...anim(0.05)}
            className="text-4xl font-bold tracking-tight text-neutral-900 md:text-[56px] md:leading-[1.05]"
          >
            The public sector&apos;s specialist{' '}
            <span className="relative whitespace-nowrap text-primary-700">
              careers platform
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 right-0 h-[6px] rounded-full bg-accent-200/70"
              />
            </span>
          </motion.h1>

          {/* Client-supplied wording (Phase 7) — exact copy. */}
          <motion.p
            {...anim(0.1)}
            className="mx-auto mt-5 max-w-2xl text-base text-neutral-600 md:text-lg"
          >
            The UK&apos;s specialist careers platform for the public sector — connecting
            professionals with opportunities across Local Government, NHS, Civil Service,
            Housing, Emergency Services and Public Bodies.
          </motion.p>

          <motion.div {...anim(0.15)} className="mt-10">
            <HeroSearch />
          </motion.div>

          <motion.div
            {...anim(0.2)}
            className="mt-6 flex flex-col items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-500 sm:flex-row"
          >
            <Link
              href="/register?type=candidate"
              className="inline-flex items-center gap-1 font-semibold text-primary-700 hover:text-primary-800"
            >
              New here? Register and upload your CV
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <span aria-hidden="true" className="hidden h-4 w-px bg-neutral-200 sm:block" />
            <Link
              href="/post-a-job"
              className="inline-flex items-center gap-1 font-semibold text-primary-700 hover:text-primary-800"
            >
              Employer? Post a job
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
