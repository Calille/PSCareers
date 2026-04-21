export type ContractType = 'Permanent' | 'Interim' | 'Contract' | 'Temporary';

export type Sector =
  | 'Local government'
  | 'Central government'
  | 'NHS'
  | 'Education'
  | 'Emergency services'
  | 'Housing';

export interface Job {
  id: string;
  title: string;
  organisation: string;
  location: string;
  region: string;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  contractType: ContractType;
  sector: Sector;
  description: string;
  postedAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  title: string;
  blurb: string;
  yearsExperience: number;
  qualification: string;
  area: string;
}

export type CandidateRoleType =
  | 'Planning'
  | 'Regeneration'
  | 'Housing'
  | 'Social Care'
  | 'Policy'
  | 'Commissioning'
  | 'Education Leadership'
  | 'Emergency Services'
  | 'Finance'
  | 'Procurement';

export type CandidateRegion =
  | 'National'
  | 'London'
  | 'South East'
  | 'South West'
  | 'East of England'
  | 'North & Midlands';

export type CandidateContractSought = 'Permanent' | 'Interim' | 'Contract';

export interface Candidate {
  id: string;
  roleTitle: string;
  roleType: CandidateRoleType;
  shortBlurb: string;
  fullBio: string;
  yearsExperience: number;
  region: CandidateRegion;
  qualifications: string[];
  specialisms: string[];
  contractTypeSought: CandidateContractSought;
  availability: string;
}
