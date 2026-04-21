import type {
  Candidate,
  CandidateContractSought,
  CandidateRegion,
  CandidateRoleType,
} from '@/types';

export type ExperienceLevel = 'early' | 'mid' | 'senior';

export const ROLE_TYPES: CandidateRoleType[] = [
  'Planning',
  'Regeneration',
  'Housing',
  'Social Care',
  'Policy',
  'Commissioning',
  'Education Leadership',
  'Emergency Services',
  'Finance',
  'Procurement',
];

export const REGIONS: CandidateRegion[] = [
  'National',
  'London',
  'South East',
  'South West',
  'East of England',
  'North & Midlands',
];

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string; min: number; max: number }[] = [
  { value: 'early', label: 'Early career (0–3 yrs)', min: 0, max: 3 },
  { value: 'mid', label: 'Mid (4–9 yrs)', min: 4, max: 9 },
  { value: 'senior', label: 'Senior (10+ yrs)', min: 10, max: Number.POSITIVE_INFINITY },
];

export const CONTRACT_SOUGHT: CandidateContractSought[] = ['Permanent', 'Interim', 'Contract'];

export interface CandidateFilters {
  roleTypes: CandidateRoleType[];
  regions: CandidateRegion[];
  experience: ExperienceLevel[];
  contractTypes: CandidateContractSought[];
}

export function emptyCandidateFilters(): CandidateFilters {
  return { roleTypes: [], regions: [], experience: [], contractTypes: [] };
}

export function hasActiveCandidateFilters(f: CandidateFilters): boolean {
  return Boolean(
    f.roleTypes.length || f.regions.length || f.experience.length || f.contractTypes.length,
  );
}

export function experienceLevelFor(years: number): ExperienceLevel {
  if (years <= 3) return 'early';
  if (years <= 9) return 'mid';
  return 'senior';
}

export function experienceLabelFor(level: ExperienceLevel): string {
  return EXPERIENCE_LEVELS.find((l) => l.value === level)?.label ?? level;
}

export function filterCandidates(
  candidates: Candidate[],
  f: CandidateFilters,
): Candidate[] {
  return candidates.filter((c) => {
    if (f.roleTypes.length && !f.roleTypes.includes(c.roleType)) return false;
    if (f.regions.length && !f.regions.includes(c.region)) return false;
    if (f.experience.length) {
      const level = experienceLevelFor(c.yearsExperience);
      if (!f.experience.includes(level)) return false;
    }
    if (f.contractTypes.length && !f.contractTypes.includes(c.contractTypeSought)) return false;
    return true;
  });
}
