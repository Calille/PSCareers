'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Section } from '@/components/Section';

interface Block {
  heading: string;
  body: string;
}

// PLACEHOLDER COPY — three short paragraphs awaiting client wording.
const BLOCKS: Block[] = [
  {
    heading: 'Who we are',
    body: 'A specialist UK recruitment partner focused exclusively on the public sector. Our consultants come from inside and alongside the sector, so we understand its rhythms and pressures.',
  },
  {
    heading: 'What we do',
    body: 'We place permanent, interim and contract talent across local government, NHS, civil service, housing, emergency services and broader public bodies — with a personal, advisory approach.',
  },
  {
    heading: 'Why work with us',
    body: 'You get genuine sector expertise, a vetted shortlist that respects your time, and a long-term relationship rather than a one-off transaction. The right hire, made the right way.',
  },
];

export function WhoWhatWhy() {
  const reduce = useReducedMotion();

  return (
    <Section className="bg-white pt-14 md:pt-20">
      <div className="container-page">
        <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
          {BLOCKS.map((b, i) => (
            <motion.li
              key={b.heading}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.34, delay: i * 0.06, ease: 'easeOut' }}
              className="border-t-2 border-primary-600 pt-6"
            >
              <h3 className="text-lg font-semibold text-neutral-900">{b.heading}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{b.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
