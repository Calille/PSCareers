'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/Section';
import { mockStaff } from '@/lib/mockData';

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function StaffSection() {
  const featured = mockStaff.slice(0, 3);

  return (
    <Section className="bg-neutral-50">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="eyebrow">Meet our team</span>
            <h2 className="mt-3">People who know the sector</h2>
            <p className="mt-4 text-neutral-600">
              Our consultants have spent careers inside and alongside the public sector. Get in
              touch with the right specialist for your area.
            </p>
          </div>
          <Link
            href="/staff"
            className="hidden text-sm font-semibold text-primary-700 hover:text-primary-800 md:inline-flex md:items-center md:gap-1"
          >
            Meet the whole team
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {featured.map((staff) => (
            <li key={staff.id}>
              <article className="card card-hover flex h-full flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white"
                  >
                    {initials(staff.name)}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-neutral-900">{staff.name}</h3>
                    <p className="text-sm text-primary-700">{staff.title}</p>
                  </div>
                </div>
                <p className="line-clamp-3 text-sm text-neutral-600">{staff.blurb}</p>
                <dl className="mt-auto grid grid-cols-2 gap-2 border-t border-neutral-100 pt-4 text-xs">
                  <div>
                    <dt className="text-neutral-500">Experience</dt>
                    <dd className="font-medium text-neutral-800">{staff.yearsExperience} yrs</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500">Area</dt>
                    <dd className="font-medium text-neutral-800">{staff.area}</dd>
                  </div>
                </dl>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex md:hidden">
          <Link href="/staff" className="btn-secondary w-full">
            Meet the whole team
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
