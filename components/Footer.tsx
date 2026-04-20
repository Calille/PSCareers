import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { navLinks } from '@/lib/nav';
import { Logo } from './Logo';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3 md:gap-8 md:py-16">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm text-neutral-600">
            The UK&apos;s specialist careers platform for the public sector — connecting talented
            professionals with councils, agencies and government teams.
          </p>
          <address className="not-italic text-sm text-neutral-600">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" aria-hidden="true" />
              <span>
                Registered office
                <br />
                123 Sample Street, London, EC1A 1AA
              </span>
            </div>
          </address>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Quick links
          </h4>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-neutral-700 transition-colors hover:text-primary-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/register"
                className="text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800"
              >
                Register your interest
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Contact
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-neutral-700">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary-600" aria-hidden="true" />
              <a
                href="mailto:hello@pscareers.co.uk"
                className="transition-colors hover:text-primary-700"
              >
                hello@pscareers.co.uk
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary-600" aria-hidden="true" />
              <a href="tel:+441234567890" className="transition-colors hover:text-primary-700">
                +44 (0)1234 567 890
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" aria-hidden="true" />
              <span>Serving England, Scotland &amp; Wales</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-200">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-5 text-xs text-neutral-500 md:flex-row md:items-center">
          <p>© {year} Public Sector Careers Ltd. All rights reserved.</p>
          <p>Registered in England &amp; Wales · Company no. 00000000</p>
        </div>
      </div>
    </footer>
  );
}
