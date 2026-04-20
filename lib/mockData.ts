import type { Job, StaffMember } from '@/types';

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Policy Advisor',
    location: 'Manchester',
    salary: '£52,000 – £61,000',
    contractType: 'Permanent',
    description:
      'Shape and deliver strategic policy across a large metropolitan authority, working directly with senior leadership and elected members.',
    department: 'Policy & Strategy',
    postedAt: '2026-04-14',
  },
  {
    id: 'job-2',
    title: 'Social Worker – Children & Families',
    location: 'Leeds',
    salary: '£38,500 – £44,200',
    contractType: 'Permanent',
    description:
      'Join an Ofsted-rated Good service supporting children and families through assessment, intervention and ongoing casework.',
    department: 'Children’s Services',
    postedAt: '2026-04-12',
  },
  {
    id: 'job-3',
    title: 'Procurement Manager',
    location: 'Bristol',
    salary: '£48,000 – £55,000',
    contractType: 'Fixed-term',
    description:
      'Lead a programme of high-value public procurement across works, goods and services on a two-year fixed-term contract.',
    department: 'Commercial',
    postedAt: '2026-04-10',
  },
  {
    id: 'job-4',
    title: 'Planning Officer',
    location: 'Birmingham',
    salary: '£34,000 – £40,000',
    contractType: 'Permanent',
    description:
      'Manage a varied caseload of residential and commercial planning applications in one of the UK’s fastest-growing cities.',
    department: 'Planning & Development',
    postedAt: '2026-04-08',
  },
  {
    id: 'job-5',
    title: 'Data Analyst – Public Health',
    location: 'London',
    salary: '£42,000 – £49,000',
    contractType: 'Contract',
    description:
      'Twelve-month contract supporting a regional public health team to turn data into insight and commissioning decisions.',
    department: 'Public Health',
    postedAt: '2026-04-05',
  },
  {
    id: 'job-6',
    title: 'Head of Communications',
    location: 'Edinburgh',
    salary: '£65,000 – £74,000',
    contractType: 'Permanent',
    description:
      'Lead internal and external communications for a high-profile public body, reporting into the Chief Executive.',
    department: 'Communications',
    postedAt: '2026-04-03',
  },
];

export const mockStaff: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Amara Okafor',
    title: 'Director of Public Sector',
    blurb:
      'Fifteen years placing senior policy and strategy leaders across UK local and central government.',
    yearsExperience: 15,
    qualification: 'MCIPD',
    area: 'National',
  },
  {
    id: 'staff-2',
    name: 'Rhys Llewellyn',
    title: 'Principal Consultant – Social Care',
    blurb:
      'Specialist in permanent and interim social care recruitment, with a focus on children and families.',
    yearsExperience: 11,
    qualification: 'REC CertRP',
    area: 'North & Midlands',
  },
  {
    id: 'staff-3',
    name: 'Hannah Patel',
    title: 'Senior Consultant – Planning & Regeneration',
    blurb:
      'Partners with councils and combined authorities to recruit planners, regeneration and housing professionals.',
    yearsExperience: 8,
    qualification: 'BA (Hons) Urban Planning',
    area: 'South East',
  },
  {
    id: 'staff-4',
    name: 'Daniel Ferreira',
    title: 'Consultant – Data & Digital',
    blurb:
      'Focused on data, digital and technology roles across public health, transport and central government.',
    yearsExperience: 6,
    qualification: 'BSc Computer Science',
    area: 'London & Remote',
  },
];
