'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchX, X } from 'lucide-react';
import type {
  Candidate,
  CandidateContractSought,
  CandidateRegion,
  CandidateRoleType,
} from '@/types';
import { mockCandidates } from '@/lib/mockData';
import {
  CONTRACT_SOUGHT,
  EXPERIENCE_LEVELS,
  REGIONS,
  ROLE_TYPES,
  type CandidateFilters,
  type ExperienceLevel,
  emptyCandidateFilters,
  filterCandidates,
  hasActiveCandidateFilters,
} from '@/lib/candidateFilters';
import { FilterChip } from '@/components/filters/FilterChip';
import { FilterDropdown } from '@/components/filters/FilterDropdown';
import { FilterGroupLabel } from '@/components/filters/FilterGroupLabel';
import { CandidateCard } from './CandidateCard';
import { CandidateModal } from './CandidateModal';
import { CandidatesCta } from './CandidatesCta';

// Placeholder copy — client approval pending.
export function CandidatesBrowser() {
  const [filters, setFilters] = useState<CandidateFilters>(emptyCandidateFilters());
  const [selected, setSelected] = useState<Candidate | null>(null);

  const filtered = useMemo(() => filterCandidates(mockCandidates, filters), [filters]);

  const toggleRole = (r: CandidateRoleType) =>
    setFilters((f) => ({
      ...f,
      roleTypes: f.roleTypes.includes(r)
        ? f.roleTypes.filter((v) => v !== r)
        : [...f.roleTypes, r],
    }));

  const toggleRegion = (r: CandidateRegion) =>
    setFilters((f) => ({
      ...f,
      regions: f.regions.includes(r) ? f.regions.filter((v) => v !== r) : [...f.regions, r],
    }));

  const toggleExperience = (lvl: ExperienceLevel) =>
    setFilters((f) => ({
      ...f,
      experience: f.experience.includes(lvl)
        ? f.experience.filter((v) => v !== lvl)
        : [...f.experience, lvl],
    }));

  const toggleContract = (c: CandidateContractSought) =>
    setFilters((f) => ({
      ...f,
      contractTypes: f.contractTypes.includes(c)
        ? f.contractTypes.filter((v) => v !== c)
        : [...f.contractTypes, c],
    }));

  const clearAll = () => setFilters(emptyCandidateFilters());
  const active = hasActiveCandidateFilters(filters);

  return (
    <>
      <section className="border-b border-neutral-200 bg-gradient-to-b from-primary-50/50 to-white">
        <div className="container-page pb-12 pt-16 md:pb-12 md:pt-20">
          <div className="max-w-2xl">
            <span className="eyebrow">Available candidates</span>
            <h1 className="mt-3">Meet the talent ready to join your team</h1>
            <p className="mt-3 text-neutral-600 md:text-lg">
              A preview of vetted public sector professionals currently seeking new roles —
              browse, then let us make the introduction personally.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2">
            <FilterGroupLabel>Experience</FilterGroupLabel>
            {EXPERIENCE_LEVELS.map((lvl) => {
              const isActive = filters.experience.includes(lvl.value);
              const shortLabel =
                lvl.value === 'early' ? 'Early (0–3)' : lvl.value === 'mid' ? 'Mid (4–9)' : 'Senior (10+)';
              return (
                <FilterChip
                  key={lvl.value}
                  active={isActive}
                  onClick={() => toggleExperience(lvl.value)}
                >
                  {shortLabel}
                </FilterChip>
              );
            })}

            <div className="mx-1 hidden h-6 w-px bg-neutral-200 sm:block" aria-hidden="true" />

            <FilterDropdown
              label="Role type"
              count={filters.roleTypes.length}
              values={ROLE_TYPES.map((r) => ({ value: r, label: r }))}
              multi
              selected={filters.roleTypes}
              onToggle={(v) => toggleRole(v as CandidateRoleType)}
            />
            <FilterDropdown
              label="Region"
              count={filters.regions.length}
              values={REGIONS.map((r) => ({ value: r, label: r }))}
              multi
              selected={filters.regions}
              onToggle={(v) => toggleRegion(v as CandidateRegion)}
            />
            <FilterDropdown
              label="Contract sought"
              count={filters.contractTypes.length}
              values={CONTRACT_SOUGHT.map((c) => ({ value: c, label: c }))}
              multi
              selected={filters.contractTypes}
              onToggle={(v) => toggleContract(v as CandidateContractSought)}
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
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6">
          <p className="text-sm text-neutral-600">
            Showing <span className="font-semibold text-neutral-900">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'candidate' : 'candidates'}
            {filtered.length !== mockCandidates.length && (
              <>
                {' '}
                of <span className="font-semibold text-neutral-900">{mockCandidates.length}</span>
              </>
            )}
          </p>
        </div>

        {filtered.length === 0 ? (
          <EmptyState onClear={clearAll} />
        ) : (
          <motion.ul
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Candidate showcase"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((candidate, i) => (
                <li key={candidate.id}>
                  <CandidateCard candidate={candidate} index={i} onOpen={setSelected} />
                </li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </section>

      <CandidatesCta />

      <CandidateModal candidate={selected} onClose={() => setSelected(null)} />
    </>
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
      <h3 className="mt-4 text-lg font-semibold text-neutral-900">
        No candidates match your filters
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">
        Try widening your filters — or tell us what you&apos;re looking for and we&apos;ll draw
        from our wider network.
      </p>
      <button type="button" onClick={onClear} className="btn-primary mt-6">
        Clear filters
      </button>
    </div>
  );
}
