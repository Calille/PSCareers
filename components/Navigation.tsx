'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navLinks } from '@/lib/nav';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <div className="container-page flex h-16 items-center justify-between md:h-20">
          <Logo />

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'text-primary-700'
                    : 'text-neutral-700 hover:text-neutral-900',
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary-600" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/register" className="btn-primary hidden md:inline-flex">
              Register
            </Link>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-100 md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/*
        Rendered as a sibling of <header> (not a child) because the header uses
        backdrop-filter, which creates a containing block for fixed descendants
        and would cause the overlay to paint behind hero content on mobile.
      */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 bottom-0 top-16 z-50 bg-white md:hidden"
          >
            <motion.nav
              aria-label="Mobile"
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="container-page flex h-full flex-col gap-1 overflow-y-auto py-6"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.22 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center justify-between rounded-xl px-4 py-4 text-lg font-semibold transition-colors',
                      isActive(link.href)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-800 hover:bg-neutral-50',
                    )}
                  >
                    {link.label}
                    <span aria-hidden="true" className="text-neutral-300">
                      →
                    </span>
                  </Link>
                </motion.div>
              ))}
              <div className="mt-4 border-t border-neutral-200 pt-4">
                <Link href="/register" className="btn-primary btn-lg w-full">
                  Register
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
