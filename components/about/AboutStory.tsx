'use client';

import { motion, useReducedMotion } from 'framer-motion';

// Placeholder copy — client approval pending.
// NOTE: avoid specific claims (years, headcount) until client confirms.
export function AboutStory() {
  const reduce = useReducedMotion();

  return (
    <section className="container-page py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-5 md:gap-12 lg:gap-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="md:col-span-2"
        >
          <span className="eyebrow">Our story</span>
          <h2 className="mt-3 text-neutral-900">Built by people who know the sector</h2>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.08 }}
          className="flex flex-col gap-4 text-base leading-relaxed text-neutral-700 md:col-span-3 md:text-[17px]"
        >
          <p>
            Public Sector Careers was founded to bring genuine specialism back to public
            sector recruitment — because placing a director of regeneration isn&apos;t the
            same as placing a private sector marketing manager.
          </p>
          <p>
            Our consultants have spent their careers working with councils, central
            government departments, health bodies and education authorities. We speak the
            sector&apos;s language, understand how its hiring really works, and build
            long-term relationships rather than hitting quick placement targets.
          </p>
          <p>
            Whether you&apos;re a senior professional considering your next move, or a
            hiring lead building out a team, we make the process feel personal, considered
            and honest from start to finish.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
