// Placeholder copy — all user-facing strings pending client approval.

export const ORG_TYPES = [
  'Local government',
  'Central government',
  'NHS / Health',
  'Education',
  'Emergency services',
  'Other public sector body',
] as const;
export type OrgType = (typeof ORG_TYPES)[number];

export const POST_ROLE_TYPES = [
  'Permanent',
  'Interim',
  'Contract',
  'Temporary',
  'Fixed-term',
] as const;
export type PostRoleType = (typeof POST_ROLE_TYPES)[number];

export interface PostJobValues {
  // Organisation
  orgName: string;
  orgType: OrgType | '';
  contactName: string;
  contactTitle: string;
  email: string;
  phone: string;
  // Role
  jobTitle: string;
  roleType: PostRoleType | '';
  salaryFrom: string;
  salaryTo: string;
  location: string;
  closingDate: string;
  startDate: string;
  // Detail
  summary: string;
  description: string;
  requirements: string;
  notes: string;
}

export type PostJobField = keyof PostJobValues;
export type PostJobErrors = Partial<Record<PostJobField, string>>;

export const SUMMARY_MAX = 300;
export const DESCRIPTION_MAX = 3000;

export const emptyPostJobValues = (): PostJobValues => ({
  orgName: '',
  orgType: '',
  contactName: '',
  contactTitle: '',
  email: '',
  phone: '',
  jobTitle: '',
  roleType: '',
  salaryFrom: '',
  salaryTo: '',
  location: '',
  closingDate: '',
  startDate: '',
  summary: '',
  description: '',
  requirements: '',
  notes: '',
});

// Intentionally forgiving — we only want to catch obvious typos, not
// block legitimate edge-cases. The consultant will verify on the call.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// UK numbers: allow +44, 0-prefix, spaces. 9–16 digits overall.
const PHONE_RE = /^(?:\+44\s?|0)(?:[\d\s]{9,15})$/;

export function isEmail(v: string): boolean {
  return EMAIL_RE.test(v.trim());
}

export function isUkPhone(v: string): boolean {
  return PHONE_RE.test(v.trim());
}

export function validatePostJob(v: PostJobValues): PostJobErrors {
  const e: PostJobErrors = {};

  // Organisation
  if (!v.orgName.trim()) e.orgName = 'Please enter your organisation.';
  if (!v.orgType) e.orgType = 'Please select an organisation type.';
  if (!v.contactName.trim()) e.contactName = 'Please enter your name.';
  if (!v.contactTitle.trim()) e.contactTitle = 'Please enter your job title.';
  if (!v.email.trim()) e.email = 'Please enter your email.';
  else if (!isEmail(v.email)) e.email = 'Please enter a valid email address.';
  if (!v.phone.trim()) e.phone = 'Please enter a phone number.';
  else if (!isUkPhone(v.phone)) e.phone = 'Please enter a valid UK phone number.';

  // Role
  if (!v.jobTitle.trim()) e.jobTitle = 'Please enter the job title.';
  if (!v.roleType) e.roleType = 'Please select a role type.';

  const fromNum = Number(v.salaryFrom);
  const toNum = Number(v.salaryTo);
  if (!v.salaryFrom.trim()) e.salaryFrom = 'Required.';
  else if (!Number.isFinite(fromNum) || fromNum < 0) e.salaryFrom = 'Enter a number.';
  if (!v.salaryTo.trim()) e.salaryTo = 'Required.';
  else if (!Number.isFinite(toNum) || toNum < 0) e.salaryTo = 'Enter a number.';
  if (!e.salaryFrom && !e.salaryTo && toNum < fromNum) {
    e.salaryTo = '“To” must be greater than “From”.';
  }

  if (!v.location.trim()) e.location = 'Please enter a location.';
  if (!v.closingDate) e.closingDate = 'Please choose a closing date.';

  // Detail
  if (!v.summary.trim()) e.summary = 'Please add a short summary.';
  else if (v.summary.length > SUMMARY_MAX) {
    e.summary = `Keep the summary under ${SUMMARY_MAX} characters.`;
  }
  if (!v.description.trim()) e.description = 'Please add the full description.';
  else if (v.description.length > DESCRIPTION_MAX) {
    e.description = `Keep the description under ${DESCRIPTION_MAX} characters.`;
  }

  return e;
}

export function hasNoErrors(e: PostJobErrors): boolean {
  return Object.keys(e).length === 0;
}

export function generateReference(): string {
  const now = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 36 ** 3)
    .toString(36)
    .toUpperCase()
    .padStart(3, '0');
  return `PSC-R-${now}-${rand}`;
}
