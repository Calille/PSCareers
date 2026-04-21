'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  SearchX,
  X,
} from 'lucide-react';
import type { ContractType, Sector } from '@/types';
import { mockJobs } from '@/lib/mockData';
import {
  CONTRACT_TYPES,
  POSTED_OPTIONS,
  SALARY_BANDS,
  SECTORS,
  SORT_OPTIONS,
  type JobFilters,
  type PostedWithin,
  type SalaryBand,
  type SortKey,
  emptyFilters,
  filterJobs,
  hasActiveFilters,
  sortJobs,
} from '@/lib/jobFilters';
import { cn } from '@/lib/utils';
import { JobCard } from './JobCard';
import { JobsSidebar } from './JobsSidebar';

const PAGE_SIZE = 10;

export function JobsBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<JobFilters>(() => {
    const base = emptyFilters();
    return {
      ...base,
      keyword: searchParams.get('keyword') ?? '',
      location: searchParams.get('location') ?? '',
    };
  });

  const [sort, setSort] = useState<SortKey>('recent');
  const [page, setPage] = useState(1);
  const resultsTopRef = useRef<HTMLDivElement | null>(null);

  // Debounced URL sync for the shareable search terms.
  useEffect(() => {
    const handle = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.keyword.trim()) params.set('keyword', filters.keyword.trim());
      if (filters.location.trim()) params.set('location', filters.location.trim());
      const qs = params.toString();
      router.replace(qs ? `/jobs?${qs}` : '/jobs', { scroll: false });
    }, 300);
    return () => clearTimeout(handle);
  }, [filters.keyword, filters.location, router]);

  const filtered = useMemo(() => filterJobs(mockJobs, filters), [filters]);
  const sorted = useMemo(() => sortJobs(filtered, sort), [filtered, sort]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paged = useMemo(
    () => sorted.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE),
    [sorted, pageSafe],
  );

  // Reset pagination when filters or sort change.
  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  const toggleContract = (t: ContractType) =>
    setFilters((f) => ({
      ...f,
      contractTypes: f.contractTypes.includes(t)
        ? f.contractTypes.filter((v) => v !== t)
        : [...f.contractTypes, t],
    }));

  const toggleSector = (s: Sector) =>
    setFilters((f) => ({
      ...f,
      sectors: f.sectors.includes(s) ? f.sectors.filter((v) => v !== s) : [...f.sectors, s],
    }));

  const clearAll = () => setFilters(emptyFilters());

  const onSubmitSearch = (e: FormEvent) => {
    e.preventDefault();
    // Form submit already reflects state; force-trim noise.
    setFilters((f) => ({ ...f, keyword: f.keyword.trim(), location: f.location.trim() }));
  };

  const changePage = (next: number) => {
    const clamped = Math.min(Math.max(1, next), totalPages);
    setPage(clamped);
    resultsTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const active = hasActiveFilters(filters);

  return (
    <>
      <section className="border-b border-neutral-200 bg-gradient-to-b from-primary-50/50 to-white">
        <div className="container-page pb-12 pt-16 md:pb-12 md:pt-20">
          <div className="max-w-2xl">
            {/* Placeholder copy — needs client approval */}
            <span className="eyebrow">Browse roles</span>
            <h1 className="mt-3">Job search</h1>
            <p className="mt-3 text-neutral-600 md:text-lg">
              Explore the latest public sector opportunities across the UK - from local councils to
              central government teams.
            </p>
          </div>

          <form
            onSubmit={onSubmitSearch}
            className="mt-8 rounded-2xl border border-neutral-200 bg-white p-2 shadow-card md:rounded-full md:p-1.5"
            role="search"
            aria-label="Search jobs"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-0">
              <label className="flex flex-1 items-center gap-3 rounded-full px-4 py-2">
                <Search className="h-5 w-5 flex-shrink-0 text-neutral-400" aria-hidden="true" />
                <span className="sr-only">Keyword</span>
                <input
                  type="text"
                  value={filters.keyword}
                  onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
                  placeholder="Job title, role or keyword"
                  className="h-10 w-full bg-transparent text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />
              </label>
              <div className="hidden h-8 w-px bg-neutral-200 md:block" aria-hidden="true" />
              <label className="flex flex-1 items-center gap-3 rounded-full px-4 py-2">
                <MapPin className="h-5 w-5 flex-shrink-0 text-neutral-400" aria-hidden="true" />
                <span className="sr-only">Location</span>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
                  placeholder="Town, city or postcode"
                  className="h-10 w-full bg-transparent text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />
              </label>
              <button type="submit" className="btn-primary btn-lg w-full md:w-auto">
                <Search className="h-4 w-4" aria-hidden="true" />
                Search jobs
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2">
            <FilterGroupLabel>Contract</FilterGroupLabel>
            {CONTRACT_TYPES.map((t) => (
              <FilterChip
                key={t}
                active={filters.contractTypes.includes(t)}
                onClick={() => toggleContract(t)}
              >
                {t}
              </FilterChip>
            ))}

            <div className="mx-1 hidden h-6 w-px bg-neutral-200 sm:block" aria-hidden="true" />

            <FilterDropdown
              label="Sector"
              count={filters.sectors.length}
              values={SECTORS.map((s) => ({ value: s, label: s }))}
              multi
              selected={filters.sectors}
              onToggle={(v) => toggleSector(v as Sector)}
            />
            <FilterDropdown
              label="Salary"
              count={filters.salaryBand ? 1 : 0}
              values={SALARY_BANDS.map((b) => ({ value: b.value, label: b.label }))}
              selected={filters.salaryBand ? [filters.salaryBand] : []}
              onToggle={(v) =>
                setFilters((f) => ({
                  ...f,
                  salaryBand: f.salaryBand === v ? null : (v as SalaryBand),
                }))
              }
            />
            <FilterDropdown
              label="Posted"
              count={filters.postedWithin ? 1 : 0}
              values={POSTED_OPTIONS.map((p) => ({ value: p.value, label: p.label }))}
              selected={filters.postedWithin ? [filters.postedWithin] : []}
              onToggle={(v) =>
                setFilters((f) => ({
                  ...f,
                  postedWithin: f.postedWithin === v ? null : (v as PostedWithin),
                }))
              }
            />

            {active && (
              <button
                type="button"
                onClick={clearAll}
                className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-neutral-600 transition-colors hover:text-primary-700"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div ref={resultsTopRef} className="scroll-mt-24" />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5">
              <p className="text-sm text-neutral-600">
                Showing{' '}
                <span className="font-semibold text-neutral-900">{sorted.length}</span>{' '}
                {sorted.length === 1 ? 'role' : 'roles'}
                {sorted.length !== mockJobs.length && (
                  <>
                    {' '}
                    of <span className="font-semibold text-neutral-900">{mockJobs.length}</span>
                  </>
                )}
              </p>
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <span className="hidden sm:inline">Sort by</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="h-9 appearance-none rounded-full border border-neutral-200 bg-white pl-4 pr-9 text-sm font-medium text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                    aria-hidden="true"
                  />
                </div>
              </label>
            </div>

            {paged.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <motion.ul
                layout
                className="flex flex-col gap-3 md:gap-4"
                aria-label="Job results"
              >
                <AnimatePresence mode="popLayout">
                  {paged.map((job, i) => (
                    <li key={job.id}>
                      <JobCard job={job} index={i} />
                    </li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}

            {sorted.length > PAGE_SIZE && (
              <Pagination page={pageSafe} totalPages={totalPages} onChange={changePage} />
            )}
          </div>

          <div>
            <JobsSidebar />
          </div>
        </div>
      </section>
    </>
  );
}

function FilterGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mr-1 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
      {children}
    </span>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex h-8 flex-shrink-0 items-center rounded-full border px-3.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        active
          ? 'border-primary-600 bg-primary-600 text-white shadow-subtle'
          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50',
      )}
    >
      {children}
    </button>
  );
}

interface DropdownValue {
  value: string;
  label: string;
}

function FilterDropdown({
  label,
  count,
  values,
  selected,
  onToggle,
  multi = false,
}: {
  label: string;
  count: number;
  values: DropdownValue[];
  selected: string[];
  onToggle: (v: string) => void;
  multi?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const active = count > 0;

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'inline-flex h-8 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          active
            ? 'border-primary-600 bg-primary-600 text-white shadow-subtle'
            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50',
        )}
      >
        {label}
        {active && (
          <span
            className={cn(
              'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none',
              'bg-white/20 text-white',
            )}
          >
            {count}
          </span>
        )}
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-20 mt-2 min-w-[220px] overflow-hidden rounded-xl border border-neutral-200 bg-white p-1 shadow-card-lg"
          >
            {values.map((v) => {
              const isSelected = selected.includes(v.value);
              return (
                <button
                  key={v.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onToggle(v.value);
                    if (!multi) setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    isSelected
                      ? 'bg-primary-50 font-semibold text-primary-800'
                      : 'text-neutral-700 hover:bg-neutral-50',
                  )}
                >
                  <span>{v.label}</span>
                  {isSelected && <Check className="h-4 w-4 text-primary-600" aria-hidden="true" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-between gap-2 border-t border-neutral-100 pt-6"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:pointer-events-none disabled:text-neutral-300"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Previous
      </button>
      <ul className="flex items-center gap-1">
        {pages.map((p) => (
          <li key={p}>
            <button
              type="button"
              onClick={() => onChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={cn(
                'inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors',
                p === page
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-700 hover:bg-neutral-100',
              )}
            >
              {p}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:pointer-events-none disabled:text-neutral-300"
      >
        Next
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/70 px-6 py-14 text-center">
      <span
        aria-hidden="true"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-neutral-500 shadow-subtle"
      >
        <SearchX className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-neutral-900">No jobs match your search</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">
        Try broadening your keyword, changing location, or clearing a filter or two — new roles are
        added regularly.
      </p>
      <button type="button" onClick={onClear} className="btn-primary mt-6">
        Clear filters
      </button>
    </div>
  );
}
