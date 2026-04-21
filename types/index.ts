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
