'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { MapPin, Search } from 'lucide-react';

export function HeroSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (location.trim()) params.set('location', location.trim());
    const qs = params.toString();
    router.push(qs ? `/jobs?${qs}` : '/jobs');
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-3xl rounded-2xl border border-neutral-200 bg-white p-2 shadow-card-lg md:rounded-full md:p-1.5"
      role="search"
      aria-label="Search jobs"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-0">
        <label className="flex flex-1 items-center gap-3 rounded-full px-4 py-2">
          <Search className="h-5 w-5 flex-shrink-0 text-neutral-400" aria-hidden="true" />
          <span className="sr-only">Keyword</span>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Job title, role or keyword"
            className="h-10 w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none md:text-[15px]"
          />
        </label>
        <div className="hidden h-8 w-px bg-neutral-200 md:block" aria-hidden="true" />
        <label className="flex flex-1 items-center gap-3 rounded-full px-4 py-2">
          <MapPin className="h-5 w-5 flex-shrink-0 text-neutral-400" aria-hidden="true" />
          <span className="sr-only">Location</span>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Town, city or postcode"
            className="h-10 w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none md:text-[15px]"
          />
        </label>
        <button type="submit" className="btn-primary btn-lg w-full md:w-auto">
          <Search className="h-4 w-4" aria-hidden="true" />
          Search jobs
        </button>
      </div>
    </form>
  );
}
