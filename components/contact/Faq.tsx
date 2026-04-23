'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

// Placeholder copy — client approval pending.
const FAQS: FaqItem[] = [
  {
    q: 'How does your review process work?',
    a: 'Every vacancy submitted through our site is reviewed by a consultant before it goes live. We confirm the brief with you, check the package and location detail is accurate, and only then publish.',
  },
  {
    q: 'What parts of the public sector do you cover?',
    a: "UK local government, central government departments, NHS bodies, education authorities, emergency services and public sector-adjacent bodies. If you're not sure we cover your area, just ask.",
  },
  {
    q: 'Do you charge candidates?',
    a: "No. Our service is always free for candidates — employers pay our fees. You'll never be asked for payment and we won't sell your data on.",
  },
  {
    q: 'How quickly will my role go live?',
    a: "Most roles are live within 24 hours of submission, once we've confirmed the detail with you. If you're up against a tight deadline, call us and we can usually move faster.",
  },
  {
    q: 'Can I speak to a consultant before sharing my CV?',
    a: 'Absolutely. Many candidates prefer a confidential chat first. Call the office or email us to book a 15-minute conversation with a consultant — no CV needed up front.',
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="container-page pb-20 pt-4 md:pb-28">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="eyebrow">Questions</span>
          <h2 className="mt-3 text-neutral-900">Frequently asked questions</h2>
        </div>

        <ul className="mt-10 flex flex-col gap-3">
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;
            return (
              <li
                key={item.q}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-subtle"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left text-base font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 md:px-6"
                  >
                    <span className="leading-snug">{item.q}</span>
                    <motion.span
                      aria-hidden="true"
                      animate={{ rotate: open ? 45 : 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>
                </h3>

                {/* Outer wrapper is always mounted so `aria-controls` always
                    resolves to an element; the inner motion.div handles the
                    open/close animation. */}
                <div id={panelId} aria-labelledby={buttonId}>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-6 pt-0 text-sm leading-relaxed text-neutral-600 md:px-6 md:text-[15px]">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
