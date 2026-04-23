// Placeholder copy — all user-facing strings pending client approval.

export const ENQUIRY_TYPES = [
  'Candidate',
  'Employer',
  'General enquiry',
  'Other',
] as const;
export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export interface ContactValues {
  enquiryType: EnquiryType | '';
  name: string;
  email: string;
  phone: string;
  organisation: string;
  subject: string;
  message: string;
}

export type ContactField = keyof ContactValues;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const MESSAGE_MAX = 2000;

export const emptyContactValues = (): ContactValues => ({
  enquiryType: '',
  name: '',
  email: '',
  phone: '',
  organisation: '',
  subject: '',
  message: '',
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:\+44\s?|0)(?:[\d\s]{9,15})$/;

export function validateContact(v: ContactValues): ContactErrors {
  const e: ContactErrors = {};

  if (!v.enquiryType) e.enquiryType = 'Please choose one.';
  if (!v.name.trim()) e.name = 'Please enter your name.';
  if (!v.email.trim()) e.email = 'Please enter your email.';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (v.phone.trim() && !PHONE_RE.test(v.phone.trim())) {
    e.phone = 'Please enter a valid UK phone number.';
  }
  if (v.enquiryType === 'Employer' && !v.organisation.trim()) {
    e.organisation = 'Please enter your organisation.';
  }
  if (!v.subject.trim()) e.subject = 'Please add a subject.';
  if (!v.message.trim()) e.message = 'Please write a short message.';
  else if (v.message.length > MESSAGE_MAX) {
    e.message = `Keep the message under ${MESSAGE_MAX} characters.`;
  }

  return e;
}

export function hasNoErrors(e: ContactErrors): boolean {
  return Object.keys(e).length === 0;
}

// Contact details — placeholder/known values from the Phase 5 brief.
// Addresses & emails: confirm with the client before launch.
export const CONTACT_PHONE_DISPLAY = '01603 244933';
export const CONTACT_PHONE_HREF = 'tel:+441603244933';
export const CONTACT_EMAIL = 'hello@pscareers.co.uk';
export const OFFICE_HOURS = 'Mon–Fri, 9am–5:30pm';
export const TEAM_EMAILS: { name: string; email: string }[] = [
  { name: 'General', email: 'hello@pscareers.co.uk' },
  { name: 'Adrian', email: 'adrian@pscareers.co.uk' },
  { name: 'Jonny', email: 'jonny@pscareers.co.uk' },
  { name: 'Claire', email: 'claire@pscareers.co.uk' },
];
// Placeholder address — confirm registered office with client.
export const OFFICE_ADDRESS_LINES = ['Public Sector Careers', 'Norwich', 'NR1 (registered office TBC)'];
