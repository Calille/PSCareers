'use client';

import { Briefcase, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { RegisterType } from '@/lib/registerForm';

interface RegisterTypeToggleProps {
  value: RegisterType;
  onChange: (next: RegisterType) => void;
}

// Placeholder labels — client approval pending.
const OPTIONS: { id: RegisterType; label: string; icon: typeof UserRound }[] = [
  { id: 'candidate', label: "I'm a candidate", icon: UserRound },
  { id: 'employer', label: "I'm an employer", icon: Briefcase },
];

export function RegisterTypeToggle({ value, onChange }: RegisterTypeToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Register as"
      className="mx-auto grid w-full max-w-xl gap-3 rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-subtle sm:grid-cols-2"
    >
      {OPTIONS.map(({ id, label, icon: Icon }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`register-panel-${id}`}
            id={`register-tab-${id}`}
            onClick={() => onChange(id)}
            className={cn(
              'relative flex min-h-[56px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 sm:text-base',
              active ? 'text-white' : 'text-neutral-700 hover:bg-neutral-50',
            )}
          >
            {active && (
              <motion.span
                layoutId="register-toggle-pill"
                className="absolute inset-0 rounded-xl bg-primary-600 shadow-subtle"
                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                aria-hidden="true"
              />
            )}
            <span className="relative inline-flex items-center gap-2">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
