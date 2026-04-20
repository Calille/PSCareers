import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Public Sector Careers home"
      className={cn('group inline-flex items-center gap-2.5', className)}
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white shadow-subtle transition-transform duration-200 group-hover:scale-105"
      >
        PS
      </span>
      {!compact && (
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-bold tracking-tight text-neutral-900">
            Public Sector Careers
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary-700">
            pscareers.co.uk
          </span>
        </span>
      )}
    </Link>
  );
}
