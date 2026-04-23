'use client';

import { type FormEvent, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import {
  CONTRACT_TYPES,
  EMPLOYER_ORG_TYPES,
  EXPERIENCE_BANDS,
  HIRING_VOLUMES,
  MESSAGE_MAX,
  REGIONS,
  type CandidateField,
  type CandidateValues,
  type ContractType,
  type EmployerField,
  type EmployerOrgType,
  type EmployerValues,
  type ExperienceBand,
  type HiringVolume,
  type RegisterType,
  type Region,
  emptyCandidateValues,
  emptyEmployerValues,
  generateReference,
  hasNoErrors,
  validateCandidate,
  validateEmployer,
} from '@/lib/registerForm';
import {
  SelectField,
  TextField,
  TextareaField,
} from '@/components/forms/FormPrimitives';
import { cn } from '@/lib/utils';
import { FileUploadField } from './FileUploadField';
import { RegisterSuccess } from './RegisterSuccess';
import { RegisterTypeToggle } from './RegisterTypeToggle';

interface RegisterFormSectionProps {
  initialType: RegisterType;
}

type Submitted = { type: RegisterType; reference: string };

// Placeholder copy — client approval pending.
export function RegisterFormSection({ initialType }: RegisterFormSectionProps) {
  const [type, setType] = useState<RegisterType>(initialType);

  // Keep both form states so values aren't lost when toggling mid-flow.
  const [candidate, setCandidate] = useState<CandidateValues>(emptyCandidateValues());
  const [employer, setEmployer] = useState<EmployerValues>(emptyEmployerValues());

  const [candidateTouched, setCandidateTouched] = useState<
    Partial<Record<CandidateField, boolean>>
  >({});
  const [employerTouched, setEmployerTouched] = useState<
    Partial<Record<EmployerField, boolean>>
  >({});

  const [submitAttempted, setSubmitAttempted] = useState<{
    candidate: boolean;
    employer: boolean;
  }>({ candidate: false, employer: false });

  const [submitted, setSubmitted] = useState<Submitted | null>(null);

  const candidateErrors = useMemo(() => validateCandidate(candidate), [candidate]);
  const employerErrors = useMemo(() => validateEmployer(employer), [employer]);

  const canSubmit =
    type === 'candidate' ? hasNoErrors(candidateErrors) : hasNoErrors(employerErrors);

  const setC = <K extends CandidateField>(key: K, v: CandidateValues[K]) =>
    setCandidate((prev) => ({ ...prev, [key]: v }));

  const setE = <K extends EmployerField>(key: K, v: EmployerValues[K]) =>
    setEmployer((prev) => ({ ...prev, [key]: v }));

  const touchC = (key: CandidateField) =>
    setCandidateTouched((p) => (p[key] ? p : { ...p, [key]: true }));
  const touchE = (key: EmployerField) =>
    setEmployerTouched((p) => (p[key] ? p : { ...p, [key]: true }));

  const errCandidate = (key: CandidateField): string | undefined =>
    submitAttempted.candidate || candidateTouched[key] ? candidateErrors[key] : undefined;
  const errEmployer = (key: EmployerField): string | undefined =>
    submitAttempted.employer || employerTouched[key] ? employerErrors[key] : undefined;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted((prev) => ({ ...prev, [type]: true }));
    if (!canSubmit) return;

    const reference = generateReference(type);
    if (type === 'candidate') {
      // No backend yet — log the full payload (file object included) and
      // flip to the success state.
      // eslint-disable-next-line no-console
      console.log('Candidate registration', { reference, ...candidate });
    } else {
      // eslint-disable-next-line no-console
      console.log('Employer registration', { reference, ...employer });
    }
    setSubmitted({ type, reference });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="container-page py-10 md:py-14">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="register-success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <RegisterSuccess type={submitted.type} reference={submitted.reference} />
          </motion.div>
        ) : (
          <motion.div
            key="register-form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="flex flex-col gap-8"
          >
            <RegisterTypeToggle value={type} onChange={setType} />

            <div className="mx-auto w-full max-w-[640px]">
              <form
                onSubmit={onSubmit}
                noValidate
                className="flex flex-col gap-6"
                id={`register-panel-${type}`}
                role="tabpanel"
                aria-labelledby={`register-tab-${type}`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {type === 'candidate' ? (
                    <motion.div
                      key="candidate-fields"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="flex flex-col gap-5"
                    >
                      <TextField
                        id="fullName"
                        label="Full name"
                        required
                        autoComplete="name"
                        value={candidate.fullName}
                        onChange={(v) => setC('fullName', v)}
                        onBlur={() => touchC('fullName')}
                        error={errCandidate('fullName')}
                      />
                      <div className="grid gap-5 md:grid-cols-2">
                        <TextField
                          id="email"
                          label="Email"
                          type="email"
                          inputMode="email"
                          required
                          autoComplete="email"
                          value={candidate.email}
                          onChange={(v) => setC('email', v)}
                          onBlur={() => touchC('email')}
                          error={errCandidate('email')}
                        />
                        <TextField
                          id="phone"
                          label="Phone"
                          type="tel"
                          inputMode="tel"
                          required
                          autoComplete="tel"
                          placeholder="e.g. 020 7123 4567"
                          value={candidate.phone}
                          onChange={(v) => setC('phone', v)}
                          onBlur={() => touchC('phone')}
                          error={errCandidate('phone')}
                        />
                      </div>
                      <TextField
                        id="jobTitle"
                        label="Current or most recent job title"
                        required
                        autoComplete="organization-title"
                        value={candidate.jobTitle}
                        onChange={(v) => setC('jobTitle', v)}
                        onBlur={() => touchC('jobTitle')}
                        error={errCandidate('jobTitle')}
                      />
                      <div className="grid gap-5 md:grid-cols-2">
                        <SelectField
                          id="experience"
                          label="Years of experience"
                          required
                          options={EXPERIENCE_BANDS}
                          value={candidate.experience}
                          onChange={(v) => setC('experience', v as ExperienceBand)}
                          onBlur={() => touchC('experience')}
                          error={errCandidate('experience')}
                        />
                        <SelectField
                          id="region"
                          label="Region"
                          required
                          options={REGIONS}
                          value={candidate.region}
                          onChange={(v) => setC('region', v as Region)}
                          onBlur={() => touchC('region')}
                          error={errCandidate('region')}
                        />
                      </div>
                      <SelectField
                        id="contractType"
                        label="Contract type sought"
                        required
                        options={CONTRACT_TYPES}
                        value={candidate.contractType}
                        onChange={(v) => setC('contractType', v as ContractType)}
                        onBlur={() => touchC('contractType')}
                        error={errCandidate('contractType')}
                      />
                      <FileUploadField
                        id="cv"
                        label="Upload CV"
                        required
                        file={candidate.cv}
                        onChange={(file) => {
                          setC('cv', file);
                          touchC('cv');
                        }}
                        error={errCandidate('cv')}
                      />
                      <TextareaField
                        id="candidateMessage"
                        label="Short message"
                        rows={4}
                        maxLength={MESSAGE_MAX}
                        placeholder="Tell us briefly what you're looking for."
                        helper="Optional"
                        value={candidate.message}
                        onChange={(v) => setC('message', v)}
                        onBlur={() => touchC('message')}
                        error={errCandidate('message')}
                      />
                      <ConsentCheckbox
                        id="candidateConsent"
                        checked={candidate.consent}
                        onChange={(v) => {
                          setC('consent', v);
                          touchC('consent');
                        }}
                        label="I'm happy for PS Careers to contact me about relevant opportunities."
                        error={errCandidate('consent')}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="employer-fields"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="flex flex-col gap-5"
                    >
                      <TextField
                        id="orgName"
                        label="Organisation name"
                        required
                        autoComplete="organization"
                        value={employer.orgName}
                        onChange={(v) => setE('orgName', v)}
                        onBlur={() => touchE('orgName')}
                        error={errEmployer('orgName')}
                      />
                      <SelectField
                        id="orgType"
                        label="Organisation type"
                        required
                        options={EMPLOYER_ORG_TYPES}
                        value={employer.orgType}
                        onChange={(v) => setE('orgType', v as EmployerOrgType)}
                        onBlur={() => touchE('orgType')}
                        error={errEmployer('orgType')}
                      />
                      <div className="grid gap-5 md:grid-cols-2">
                        <TextField
                          id="contactName"
                          label="Your name"
                          required
                          autoComplete="name"
                          value={employer.contactName}
                          onChange={(v) => setE('contactName', v)}
                          onBlur={() => touchE('contactName')}
                          error={errEmployer('contactName')}
                        />
                        <TextField
                          id="contactTitle"
                          label="Your job title"
                          required
                          autoComplete="organization-title"
                          value={employer.contactTitle}
                          onChange={(v) => setE('contactTitle', v)}
                          onBlur={() => touchE('contactTitle')}
                          error={errEmployer('contactTitle')}
                        />
                        <TextField
                          id="employerEmail"
                          label="Email"
                          type="email"
                          inputMode="email"
                          required
                          autoComplete="email"
                          value={employer.email}
                          onChange={(v) => setE('email', v)}
                          onBlur={() => touchE('email')}
                          error={errEmployer('email')}
                        />
                        <TextField
                          id="employerPhone"
                          label="Phone"
                          type="tel"
                          inputMode="tel"
                          required
                          autoComplete="tel"
                          placeholder="e.g. 020 7123 4567"
                          value={employer.phone}
                          onChange={(v) => setE('phone', v)}
                          onBlur={() => touchE('phone')}
                          error={errEmployer('phone')}
                        />
                      </div>
                      <SelectField
                        id="hiringVolume"
                        label="Approximate hiring volume"
                        options={HIRING_VOLUMES}
                        helper="Optional"
                        value={employer.hiringVolume}
                        onChange={(v) => setE('hiringVolume', v as HiringVolume)}
                        onBlur={() => touchE('hiringVolume')}
                        error={errEmployer('hiringVolume')}
                      />
                      <TextareaField
                        id="employerMessage"
                        label="Short message"
                        rows={4}
                        maxLength={MESSAGE_MAX}
                        placeholder="Tell us briefly what you're hiring for."
                        helper="Optional"
                        value={employer.message}
                        onChange={(v) => setE('message', v)}
                        onBlur={() => touchE('message')}
                        error={errEmployer('message')}
                      />
                      <ConsentCheckbox
                        id="employerConsent"
                        checked={employer.consent}
                        onChange={(v) => {
                          setE('consent', v);
                          touchE('consent');
                        }}
                        label="I'm happy for PS Careers to contact me to discuss hiring needs."
                        error={errEmployer('consent')}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="btn-primary btn-lg w-full"
                  >
                    {/* Placeholder label — "Register" vs "Submit" TBC. */}
                    Register
                  </button>
                  <p className="text-center text-xs text-neutral-500">
                    A consultant will be in touch within 24 hours.
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ---------- Inline consent checkbox ----------

interface ConsentCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
}

function ConsentCheckbox({ id, label, checked, onChange, error }: ConsentCheckboxProps) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex min-h-[48px] cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 bg-white p-3 transition-colors hover:border-neutral-300"
      >
        <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className={cn(
              'inline-flex h-5 w-5 items-center justify-center rounded-md border bg-white transition-colors',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2',
              checked
                ? 'border-primary-600 bg-primary-600 text-white'
                : error
                  ? 'border-red-300'
                  : 'border-neutral-300',
            )}
          >
            {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
          </span>
        </span>
        <span className="text-sm leading-relaxed text-neutral-700">
          {label}
          <span className="ml-0.5 text-primary-600" aria-hidden="true">
            *
          </span>
        </span>
      </label>
      {error && (
        <span id={errorId} className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
