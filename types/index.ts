export type ContractType = 'Permanent' | 'Fixed-term' | 'Contract' | 'Temporary' | 'Part-time';

export interface Job {
  id: string;
  title: string;
  location: string;
  salary: string;
  contractType: ContractType;
  description: string;
  department?: string;
  postedAt?: string;
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
