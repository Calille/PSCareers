'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Compass, Handshake, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Value {
  Icon: LucideIcon;
  title: string;
  description: string;
}

// Placeholder copy — client approval pending.
const VALUES: Value[] = [
  {
    Icon: Compass,
    title: 'Specialist expertise',
    description:
      'Deep experience in the public sector — not generalists who happen to take public sector briefs.',
  },
  {
    Icon: Handshake,
    title: 'Honest partnerships',
    description:
      'Straight-talking, long-term relationships with candidates and hiring leads alike.',
  },
  {
    Icon: ShieldCheck,
    title: 'Public sector first',
    description:
      'Every process we run is designed for the realities of public service — not a private sector template.',
  },
];

export function AboutValues() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-primary-50/60 py-16 md:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">What we stand for</span>
          <h2 className="mt-3 text-neutral-900">Three things we won&apos;t compromise on</h2>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3 md:mt-14">
          {VALUES.map((v, i) => (
            <motion.li
              key={v.title}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.32, delay: i * 0.06, ease: 'easeOut' }}
              className="flex flex-col gap-4 rounded-2xl border border-white bg-white p-6 shadow-subtle"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700"
              >
                <v.Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {v.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
