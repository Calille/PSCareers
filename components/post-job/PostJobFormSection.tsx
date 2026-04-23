'use client';

import { type FormEvent, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send } from 'lucide-react';
import {
  DESCRIPTION_MAX,
  ORG_TYPES,
  POST_ROLE_TYPES,
  SUMMARY_MAX,
  emptyPostJobValues,
  generateReference,
  hasNoErrors,
  type OrgType,
  type PostJobErrors,
  type PostJobField,
  type PostJobValues,
  type PostRoleType,
  validatePostJob,
} from '@/lib/postJobForm';
import { PostJobSidebar } from './PostJobSidebar';
import { PostJobSuccess } from './PostJobSuccess';
import {
  SectionHeading,
  SelectField,
  TextField,
  TextareaField,
} from '@/components/forms/FormPrimitives';

// Placeholder copy — client approval pending.
export function PostJobFormSection() {
  const [values, setValues] = useState<PostJobValues>(emptyPostJobValues());
  const [touched, setTouched] = useState<Partial<Record<PostJobField, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitted, setSubmitted] = useState<{ reference: string } | null>(null);

  const errors = useMemo(() => validatePostJob(values), [values]);
  const canSubmit = hasNoErrors(errors);

  const set = <K extends PostJobField>(key: K, v: PostJobValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const markTouched = (key: PostJobField) =>
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }));

  // Only show an error once the user has interacted with the field, or once
  // they've attempted to submit the whole form.
  const errFor = (key: PostJobField): string | undefined =>
    (submitAttempted || touched[key]) ? errors[key] : undefined;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!canSubmit) return;
    const reference = generateReference();
    // No backend yet — log and flip to success state.
    // eslint-disable-next-line no-console
    console.log('Post-a-job submission', { reference, ...values });
    setSubmitted({ reference });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onReset = () => {
    setValues(emptyPostJobValues());
    setTouched({});
    setSubmitAttempted(false);
    setSubmitted(null);
  };

  return (
    <section className="container-page py-10 md:py-14">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <PostJobSuccess reference={submitted.reference} onReset={onReset} />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10"
          >
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-10">
              {/* ---------------- Section 1: Organisation ---------------- */}
              <fieldset className="flex flex-col gap-6">
                <SectionHeading eyebrow="Step 1" title="About your organisation" />
                <div className="grid gap-5 md:grid-cols-2">
                  <TextField
                    id="orgName"
                    label="Organisation name"
                    required
                    value={values.orgName}
                    onChange={(v) => set('orgName', v)}
                    onBlur={() => markTouched('orgName')}
                    autoComplete="organization"
                    error={errFor('orgName')}
                  />
                  <SelectField
                    id="orgType"
                    label="Organisation type"
                    required
                    value={values.orgType}
                    onChange={(v) => set('orgType', v as OrgType)}
                    onBlur={() => markTouched('orgType')}
                    options={ORG_TYPES}
                    error={errFor('orgType')}
                  />
                  <TextField
                    id="contactName"
                    label="Your name"
                    required
                    value={values.contactName}
                    onChange={(v) => set('contactName', v)}
                    onBlur={() => markTouched('contactName')}
                    autoComplete="name"
                    error={errFor('contactName')}
                  />
                  <TextField
                    id="contactTitle"
                    label="Your job title"
                    required
                    value={values.contactTitle}
                    onChange={(v) => set('contactTitle', v)}
                    onBlur={() => markTouched('contactTitle')}
                    autoComplete="organization-title"
                    error={errFor('contactTitle')}
                  />
                  <TextField
                    id="email"
                    label="Your email"
                    required
                    type="email"
                    inputMode="email"
                    value={values.email}
                    onChange={(v) => set('email', v)}
                    onBlur={() => markTouched('email')}
                    autoComplete="email"
                    error={errFor('email')}
                  />
                  <TextField
                    id="phone"
                    label="Your phone"
                    required
                    type="tel"
                    inputMode="tel"
                    value={values.phone}
                    onChange={(v) => set('phone', v)}
                    onBlur={() => markTouched('phone')}
                    autoComplete="tel"
                    placeholder="e.g. 020 7123 4567"
                    error={errFor('phone')}
                  />
                </div>
              </fieldset>

              {/* ---------------- Section 2: Role ---------------- */}
              <fieldset className="flex flex-col gap-6">
                <SectionHeading eyebrow="Step 2" title="About the role" />
                <div className="grid gap-5 md:grid-cols-2">
                  <TextField
                    id="jobTitle"
                    label="Job title"
                    required
                    value={values.jobTitle}
                    onChange={(v) => set('jobTitle', v)}
                    onBlur={() => markTouched('jobTitle')}
                    error={errFor('jobTitle')}
                    className="md:col-span-2"
                  />
                  <SelectField
                    id="roleType"
                    label="Role type"
                    required
                    value={values.roleType}
                    onChange={(v) => set('roleType', v as PostRoleType)}
                    onBlur={() => markTouched('roleType')}
                    options={POST_ROLE_TYPES}
                    error={errFor('roleType')}
                  />
                  <TextField
                    id="location"
                    label="Location"
                    required
                    value={values.location}
                    onChange={(v) => set('location', v)}
                    onBlur={() => markTouched('location')}
                    placeholder="e.g. Norwich — hybrid"
                    error={errFor('location')}
                  />
                  <TextField
                    id="salaryFrom"
                    label="Salary from (£)"
                    required
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={values.salaryFrom}
                    onChange={(v) => set('salaryFrom', v)}
                    onBlur={() => markTouched('salaryFrom')}
                    placeholder="35000"
                    error={errFor('salaryFrom')}
                  />
                  <TextField
                    id="salaryTo"
                    label="Salary to (£)"
                    required
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={values.salaryTo}
                    onChange={(v) => set('salaryTo', v)}
                    onBlur={() => markTouched('salaryTo')}
                    placeholder="45000"
                    error={errFor('salaryTo')}
                  />
                  <TextField
                    id="closingDate"
                    label="Closing date"
                    required
                    type="date"
                    value={values.closingDate}
                    onChange={(v) => set('closingDate', v)}
                    onBlur={() => markTouched('closingDate')}
                    error={errFor('closingDate')}
                  />
                  <TextField
                    id="startDate"
                    label="Start date"
                    type="date"
                    value={values.startDate}
                    onChange={(v) => set('startDate', v)}
                    onBlur={() => markTouched('startDate')}
                    helper="Optional"
                    error={errFor('startDate')}
                  />
                </div>
              </fieldset>

              {/* ---------------- Section 3: Detail ---------------- */}
              <fieldset className="flex flex-col gap-6">
                <SectionHeading eyebrow="Step 3" title="Role details" />
                <div className="flex flex-col gap-5">
                  <TextareaField
                    id="summary"
                    label="Short role summary"
                    required
                    rows={3}
                    maxLength={SUMMARY_MAX}
                    value={values.summary}
                    onChange={(v) => set('summary', v)}
                    onBlur={() => markTouched('summary')}
                    placeholder="2–3 sentences — the elevator pitch that appears at the top of the listing."
                    error={errFor('summary')}
                  />
                  <TextareaField
                    id="description"
                    label="Full job description"
                    required
                    rows={8}
                    maxLength={DESCRIPTION_MAX}
                    value={values.description}
                    onChange={(v) => set('description', v)}
                    onBlur={() => markTouched('description')}
                    placeholder="The full responsibilities, team context, working pattern and anything else candidates should know."
                    error={errFor('description')}
                  />
                  <TextareaField
                    id="requirements"
                    label="Key requirements"
                    rows={5}
                    value={values.requirements}
                    onChange={(v) => set('requirements', v)}
                    onBlur={() => markTouched('requirements')}
                    placeholder="Optional — qualifications, experience, clearances or must-haves."
                    helper="Optional"
                    error={errFor('requirements')}
                  />
                  <TextareaField
                    id="notes"
                    label="Additional notes for PS Careers"
                    rows={4}
                    value={values.notes}
                    onChange={(v) => set('notes', v)}
                    onBlur={() => markTouched('notes')}
                    placeholder="Anything we should know about this role that won’t appear publicly."
                    helper="Optional — only seen by our consultants"
                    error={errFor('notes')}
                  />
                </div>
              </fieldset>

              {/* ---------------- Submit ---------------- */}
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="btn-primary btn-lg w-full"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Submit role for review
                </button>
                <p className="text-center text-xs leading-relaxed text-neutral-500">
                  By submitting, you confirm you&apos;re authorised to hire on behalf of your
                  organisation. We&apos;ll be in touch within 24 hours.
                </p>
              </div>
            </form>

            <PostJobSidebar />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
