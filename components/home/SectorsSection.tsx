'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  Building2,
  HeartPulse,
  Home as HomeIcon,
  Landmark,
  Scale,
  Siren,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Section } from '@/components/Section';

interface SectorItem {
  Icon: LucideIcon;
  name: string;
  blurb: string;
}

// Sector list supplied by the client (Phase 7) — names are exact.
// PLACEHOLDER COPY — short blurb under each name awaiting client wording.
const SECTORS: SectorItem[] = [
  {
    Icon: HeartPulse,
    name: 'NHS',
    blurb: 'Trust, ICB and provider roles — operational, clinical and governance.',
  },
  {
    Icon: Building2,
    name: 'Local Authorities',
    blurb: 'Borough, district and unitary councils across England, Scotland and Wales.',
  },
  {
    Icon: Landmark,
    name: 'County Councils',
    blurb: 'Strategic, statutory and frontline roles across upper-tier authorities.',
  },
  {
    Icon: HomeIcon,
    name: 'Housing Associations',
    blurb: 'Development, asset management, communities and customer-facing leadership.',
  },
  {
    Icon: Scale,
    name: 'Civil Service',
    blurb: 'Whitehall departments, ALBs and policy delivery at every grade.',
  },
  {
    Icon: Siren,
    name: 'Emergency Services',
    blurb: 'Police, fire and rescue, and integrated public-safety partnerships.',
  },
];

export function SectorsSection() {
  const reduce = useReducedMotion();

  return (
    <Section className="bg-white">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Our expertise</span>
          <h2 className="mt-3">Supporting professionals into roles across:</h2>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-14">
          {SECTORS.map((s, i) => (
            <motion.li
              key={s.name}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.32, delay: i * 0.04, ease: 'easeOut' }}
              className="group flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-card"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary-100"
              >
                <s.Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-neutral-900">{s.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600">{s.blurb}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
