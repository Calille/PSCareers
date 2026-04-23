'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  OFFICE_ADDRESS_LINES,
  OFFICE_HOURS,
} from '@/lib/contactForm';

interface Method {
  Icon: LucideIcon;
  heading: string;
  primary: ReactNode;
  caption: string;
}

// Placeholder copy — client approval pending.
function getMethods(): Method[] {
  return [
    {
      Icon: Phone,
      heading: 'Call us',
      primary: (
        <a
          href={CONTACT_PHONE_HREF}
          className="text-xl font-semibold tracking-tight text-neutral-900 hover:text-primary-700"
        >
          {CONTACT_PHONE_DISPLAY}
        </a>
      ),
      caption: OFFICE_HOURS,
    },
    {
      Icon: Mail,
      heading: 'Email us',
      primary: (
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="break-all text-xl font-semibold tracking-tight text-neutral-900 hover:text-primary-700"
        >
          {CONTACT_EMAIL}
        </a>
      ),
      caption: 'We reply within 24 hours',
    },
    {
      Icon: MapPin,
      heading: 'Visit us',
      primary: (
        <span className="flex flex-col gap-0.5 text-[15px] font-semibold leading-snug text-neutral-900">
          {OFFICE_ADDRESS_LINES.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </span>
      ),
      caption: 'By appointment',
    },
  ];
}

export function ContactMethods() {
  const reduce = useReducedMotion();
  const methods = getMethods();

  return (
    <section className="container-page pt-10 md:pt-14">
      <ul className="grid gap-4 md:grid-cols-3">
        {methods.map((m, i) => (
          <motion.li
            key={m.heading}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.32, delay: i * 0.06, ease: 'easeOut' }}
            className="group flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-subtle transition-shadow hover:shadow-card"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary-100"
            >
              <m.Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
                {m.heading}
              </h3>
              <div className="mt-2">{m.primary}</div>
              <p className="mt-2 text-sm text-neutral-500">{m.caption}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
