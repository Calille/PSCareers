// Placeholder copy — all user-facing strings pending client approval.

export type RegisterType = 'candidate' | 'employer';

// ---------- Candidate dropdown options ----------

export const EXPERIENCE_BANDS = ['0-3 years', '4-9 years', '10+ years'] as const;
export type ExperienceBand = (typeof EXPERIENCE_BANDS)[number];

export const REGIONS = [
  'National',
  'London',
  'South East',
  'South West',
  'East of England',
  'Midlands',
  'North',
  'Scotland',
  'Wales',
  'Northern Ireland',
] as const;
export type Region = (typeof REGIONS)[number];

export const CONTRACT_TYPES = [
  'Permanent',
  'Interim',
  'Contract',
  'Open to any',
] as const;
export type ContractType = (typeof CONTRACT_TYPES)[number];

// ---------- Employer dropdown options ----------

export const EMPLOYER_ORG_TYPES = [
  'Local government',
  'Central government',
  'NHS / Health',
  'Education',
  'Emergency services',
  'Other public sector body',
] as const;
export type EmployerOrgType = (typeof EMPLOYER_ORG_TYPES)[number];

export const HIRING_VOLUMES = [
  'Single role',
  '2-5 roles',
  '5+ roles',
  'Ongoing need',
] as const;
export type HiringVolume = (typeof HIRING_VOLUMES)[number];

// ---------- Limits ----------

export const MESSAGE_MAX = 500;
export const CV_MAX_BYTES = 5 * 1024 * 1024; // 5MB
export const CV_ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'] as const;
export const CV_ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;
export const CV_ACCEPT_ATTR = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

// ---------- Candidate values ----------

export interface CandidateValues {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  experience: ExperienceBand | '';
  region: Region | '';
  contractType: ContractType | '';
  cv: File | null;
  message: string;
  consent: boolean;
}

export type CandidateField = keyof CandidateValues;
export type CandidateErrors = Partial<Record<CandidateField, string>>;

export const emptyCandidateValues = (): CandidateValues => ({
  fullName: '',
  email: '',
  phone: '',
  jobTitle: '',
  experience: '',
  region: '',
  contractType: '',
  cv: null,
  message: '',
  consent: false,
});

// ---------- Employer values ----------

export interface EmployerValues {
  orgName: string;
  orgType: EmployerOrgType | '';
  contactName: string;
  contactTitle: string;
  email: string;
  phone: string;
  hiringVolume: HiringVolume | '';
  message: string;
  consent: boolean;
}

export type EmployerField = keyof EmployerValues;
export type EmployerErrors = Partial<Record<EmployerField, string>>;

export const emptyEmployerValues = (): EmployerValues => ({
  orgName: '',
  orgType: '',
  contactName: '',
  contactTitle: '',
  email: '',
  phone: '',
  hiringVolume: '',
  message: '',
  consent: false,
});

// ---------- Shared validators ----------

// Forgiving — only catch obvious typos. A consultant checks on the call.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// UK numbers: allow +44, 0-prefix, spaces. 9–16 digits overall.
const PHONE_RE = /^(?:\+44\s?|0)(?:[\d\s]{9,15})$/;

export function isEmail(v: string): boolean {
  return EMAIL_RE.test(v.trim());
}

export function isUkPhone(v: string): boolean {
  return PHONE_RE.test(v.trim());
}

// ---------- File validation ----------

export type CvFileError = 'type' | 'size';

export function validateCvFile(file: File): CvFileError | null {
  const name = file.name.toLowerCase();
  const okExt = CV_ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
  // Some browsers return an empty string for .doc — trust the extension as a fallback.
  const okMime =
    !file.type ||
    (CV_ALLOWED_MIME_TYPES as readonly string[]).includes(file.type);
  if (!okExt || !okMime) return 'type';
  if (file.size > CV_MAX_BYTES) return 'size';
  return null;
}

export function cvFileErrorMessage(err: CvFileError): string {
  return err === 'type'
    ? 'Please upload a PDF or Word document (.pdf, .doc, .docx).'
    : 'File is too large — please keep your CV under 5MB.';
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ---------- Form validators ----------

export function validateCandidate(v: CandidateValues): CandidateErrors {
  const e: CandidateErrors = {};

  if (!v.fullName.trim()) e.fullName = 'Please enter your full name.';
  if (!v.email.trim()) e.email = 'Please enter your email.';
  else if (!isEmail(v.email)) e.email = 'Please enter a valid email address.';
  if (!v.phone.trim()) e.phone = 'Please enter a phone number.';
  else if (!isUkPhone(v.phone)) e.phone = 'Please enter a valid UK phone number.';
  if (!v.jobTitle.trim()) e.jobTitle = 'Please enter your current or most recent job title.';
  if (!v.experience) e.experience = 'Please select your experience.';
  if (!v.region) e.region = 'Please select a region.';
  if (!v.contractType) e.contractType = 'Please select a contract type.';

  if (!v.cv) {
    e.cv = 'Please upload your CV.';
  } else {
    const fileErr = validateCvFile(v.cv);
    if (fileErr) e.cv = cvFileErrorMessage(fileErr);
  }

  if (v.message.length > MESSAGE_MAX) {
    e.message = `Keep your message under ${MESSAGE_MAX} characters.`;
  }

  if (!v.consent) e.consent = 'Please tick the consent box to continue.';

  return e;
}

export function validateEmployer(v: EmployerValues): EmployerErrors {
  const e: EmployerErrors = {};

  if (!v.orgName.trim()) e.orgName = 'Please enter your organisation.';
  if (!v.orgType) e.orgType = 'Please select an organisation type.';
  if (!v.contactName.trim()) e.contactName = 'Please enter your name.';
  if (!v.contactTitle.trim()) e.contactTitle = 'Please enter your job title.';
  if (!v.email.trim()) e.email = 'Please enter your email.';
  else if (!isEmail(v.email)) e.email = 'Please enter a valid email address.';
  if (!v.phone.trim()) e.phone = 'Please enter a phone number.';
  else if (!isUkPhone(v.phone)) e.phone = 'Please enter a valid UK phone number.';

  if (v.message.length > MESSAGE_MAX) {
    e.message = `Keep your message under ${MESSAGE_MAX} characters.`;
  }

  if (!v.consent) e.consent = 'Please tick the consent box to continue.';

  return e;
}

export function hasNoErrors(e: Record<string, string | undefined>): boolean {
  return Object.keys(e).length === 0;
}

// ---------- URL param helpers ----------

// Accept both `type=` (brief) and `as=` (earlier link convention) so existing
// links on the site keep working while the preferred param is `type`.
export function resolveRegisterType(
  params: { type?: string | string[]; as?: string | string[] } | undefined,
): RegisterType {
  const pick = (v: string | string[] | undefined): string | undefined =>
    Array.isArray(v) ? v[0] : v;
  const raw = (pick(params?.type) ?? pick(params?.as) ?? '').toLowerCase();
  return raw === 'employer' ? 'employer' : 'candidate';
}

// ---------- Reference generator ----------

export function generateReference(type: RegisterType): string {
  const prefix = type === 'employer' ? 'PSC-E' : 'PSC-C';
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 36 ** 3)
    .toString(36)
    .toUpperCase()
    .padStart(3, '0');
  return `${prefix}-${stamp}-${rand}`;
}
