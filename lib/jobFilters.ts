import type { ContractType, Job, Sector } from '@/types';

export type SalaryBand = 'under-30' | '30-50' | '50-75' | '75-plus';
export type PostedWithin = '24h' | '7d' | '30d';
export type SortKey = 'recent' | 'salary-desc' | 'salary-asc';

export const SALARY_BANDS: { value: SalaryBand; label: string; min: number; max: number }[] = [
  { value: 'under-30', label: 'Under £30k', min: 0, max: 30000 },
  { value: '30-50', label: '£30k – £50k', min: 30000, max: 50000 },
  { value: '50-75', label: '£50k – £75k', min: 50000, max: 75000 },
  { value: '75-plus', label: '£75k+', min: 75000, max: Number.POSITIVE_INFINITY },
];

export const POSTED_OPTIONS: { value: PostedWithin; label: string; days: number }[] = [
  { value: '24h', label: 'Last 24 hours', days: 1 },
  { value: '7d', label: 'Last 7 days', days: 7 },
  { value: '30d', label: 'Last 30 days', days: 30 },
];

export const CONTRACT_TYPES: ContractType[] = ['Permanent', 'Interim', 'Contract', 'Temporary'];

export const SECTORS: Sector[] = [
  'Local government',
  'Central government',
  'NHS',
  'Emergency services',
  'Housing',
];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'recent', label: 'Most recent' },
  { value: 'salary-desc', label: 'Salary (high to low)' },
  { value: 'salary-asc', label: 'Salary (low to high)' },
];

export interface JobFilters {
  keyword: string;
  location: string;
  contractTypes: ContractType[];
  sectors: Sector[];
  salaryBand: SalaryBand | null;
  postedWithin: PostedWithin | null;
}

export function emptyFilters(): JobFilters {
  return {
    keyword: '',
    location: '',
    contractTypes: [],
    sectors: [],
    salaryBand: null,
    postedWithin: null,
  };
}

export function hasActiveFilters(f: JobFilters): boolean {
  return Boolean(
    f.keyword ||
      f.location ||
      f.contractTypes.length ||
      f.sectors.length ||
      f.salaryBand ||
      f.postedWithin,
  );
}

export function filterJobs(jobs: Job[], f: JobFilters, now: number = Date.now()): Job[] {
  const keyword = f.keyword.trim().toLowerCase();
  const location = f.location.trim().toLowerCase();
  const band = f.salaryBand ? SALARY_BANDS.find((b) => b.value === f.salaryBand) : null;
  const postedDays = f.postedWithin
    ? POSTED_OPTIONS.find((p) => p.value === f.postedWithin)?.days
    : undefined;
  const cutoff = postedDays !== undefined ? now - postedDays * 86_400_000 : null;

  return jobs.filter((job) => {
    if (keyword) {
      const haystack = `${job.title} ${job.organisation} ${job.description}`.toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    if (location) {
      const loc = `${job.location} ${job.region}`.toLowerCase();
      if (!loc.includes(location)) return false;
    }
    if (f.contractTypes.length && !f.contractTypes.includes(job.contractType)) return false;
    if (f.sectors.length && !f.sectors.includes(job.sector)) return false;
    if (band) {
      if (job.salaryMax < band.min) return false;
      if (job.salaryMin >= band.max) return false;
    }
    if (cutoff !== null) {
      const posted = new Date(job.postedAt).getTime();
      if (posted < cutoff) return false;
    }
    return true;
  });
}

export function sortJobs(jobs: Job[], sort: SortKey): Job[] {
  const copy = [...jobs];
  switch (sort) {
    case 'salary-desc':
      return copy.sort((a, b) => b.salaryMax - a.salaryMax);
    case 'salary-asc':
      return copy.sort((a, b) => a.salaryMin - b.salaryMin);
    case 'recent':
    default:
      return copy.sort(
        (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
      );
  }
}

export function relativePostedDate(iso: string, now: number = Date.now()): string {
  const posted = new Date(iso).getTime();
  const diffMs = Math.max(0, now - posted);
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays < 1) return 'Posted today';
  if (diffDays === 1) return 'Posted yesterday';
  if (diffDays < 30) return `Posted ${diffDays} days ago`;
  const weeks = Math.floor(diffDays / 7);
  if (weeks < 5) return `Posted ${weeks} week${weeks > 1 ? 's' : ''} ago`;
  const months = Math.floor(diffDays / 30);
  return `Posted ${months} month${months > 1 ? 's' : ''} ago`;
}
