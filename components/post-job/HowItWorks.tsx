'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ClipboardList, Rocket, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  Icon: LucideIcon;
}

// Placeholder copy — client approval pending.
const STEPS: Step[] = [
  {
    title: 'Submit your role',
    description:
      'Share the details of the role below — we only ask for what we need to get started.',
    Icon: ClipboardList,
  },
  {
    title: 'We review and confirm',
    description:
      'A consultant checks the brief, then calls you within 24 hours to tighten anything up.',
    Icon: ShieldCheck,
  },
  {
    title: 'Your role goes live',
    description:
      'Your vacancy is published on our job board and shared with matched candidates.',
    Icon: Rocket,
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section className="container-page pt-10 md:pt-14">
      <ol className="grid gap-4 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <motion.li
            key={step.title}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.32, delay: i * 0.06, ease: 'easeOut' }}
            className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-subtle"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700"
            >
              <step.Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-700">
                Step {i + 1}
              </p>
              <h3 className="mt-1 text-base font-semibold text-neutral-900">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                {step.description}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
