import type { ReactNode } from 'react';

export function FilterGroupLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mr-1 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
      {children}
    </span>
  );
}
