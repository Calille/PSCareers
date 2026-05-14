import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  /** Renders as priority — set for the header (above-the-fold). */
  priority?: boolean;
}

// Source is 709x196 (≈3.6:1). Display at ~h-9 / h-10 — next/image serves
// appropriately scaled variants and avoids layout shift via the intrinsic
// aspect ratio.
export function Logo({ className, priority = false }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Public Sector Careers home"
      className={cn('group inline-flex items-center', className)}
    >
      <Image
        src="/weblogo.webp"
        alt="Public Sector Careers"
        width={709}
        height={196}
        priority={priority}
        sizes="(min-width: 768px) 200px, 160px"
        className="h-9 w-auto transition-transform duration-200 group-hover:scale-105 md:h-10"
      />
    </Link>
  );
}
