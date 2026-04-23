'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface Stat {
  value: string;
  label: string;
}

// Placeholder copy — client approval pending.
// NOTE: hard figures intentionally left as "X+" — awaiting real numbers from the client.
const STATS: Stat[] = [
  { value: 'X+', label: 'Years in public sector recruitment' },
  { value: 'X+', label: 'Councils & agencies served' },
  { value: 'X+', label: 'Successful placements' },
  { value: '24h', label: 'Typical response time' },
];

export function AboutStats() {
  const reduce = useReducedMotion();

  return (
    <section className="container-page py-16 md:py-20">
      <ul className="grid grid-cols-2 gap-8 text-center md:grid-cols-4 md:gap-4">
        {STATS.map((s, i) => (
          <motion.li
            key={s.label}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.32, delay: i * 0.05, ease: 'easeOut' }}
          >
            <p className="text-4xl font-bold tracking-tight text-primary-700 md:text-5xl">
              {s.value}
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.1em] text-neutral-500 md:text-sm">
              {s.label}
            </p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
