'use client';

import { type FormEvent, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send } from 'lucide-react';
import {
  ContactField,
  ContactValues,
  ENQUIRY_TYPES,
  EnquiryType,
  MESSAGE_MAX,
  emptyContactValues,
  hasNoErrors,
  validateContact,
} from '@/lib/contactForm';
import {
  SelectField,
  TextField,
  TextareaField,
} from '@/components/forms/FormPrimitives';
import { ContactSidebar } from './ContactSidebar';
import { ContactSuccess } from './ContactSuccess';

// Placeholder copy — client approval pending.
export function ContactFormSection() {
  const [values, setValues] = useState<ContactValues>(emptyContactValues());
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validateContact(values), [values]);
  const canSubmit = hasNoErrors(errors);
  const showOrg = values.enquiryType === 'Employer';

  const set = <K extends ContactField>(key: K, v: ContactValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  // Clear the conditional "Organisation" field when the enquiry type moves
  // away from Employer, so a stale value can't be submitted and its touched
  // flag doesn't cause a ghost error when the user returns to Employer later.
  const setEnquiryType = (next: EnquiryType | '') => {
    setValues((prev) => ({
      ...prev,
      enquiryType: next,
      organisation: next === 'Employer' ? prev.organisation : '',
    }));
    if (next !== 'Employer') {
      setTouched((prev) => {
        if (!prev.organisation) return prev;
        const { organisation: _omit, ...rest } = prev;
        return rest;
      });
    }
  };

  const markTouched = (key: ContactField) =>
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }));

  const errFor = (key: ContactField): string | undefined =>
    submitAttempted || touched[key] ? errors[key] : undefined;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!canSubmit) return;
    // No backend yet — log and flip to success.
    // eslint-disable-next-line no-console
    console.log('Contact form submission', values);
    setSubmitted(true);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onReset = () => {
    setValues(emptyContactValues());
    setTouched({});
    setSubmitAttempted(false);
    setSubmitted(false);
  };

  return (
    <section className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-2xl pb-6 md:pb-10">
        <span className="eyebrow">Contact form</span>
        <h2 className="mt-3 text-neutral-900">Send us a message</h2>
        <p className="mt-2 text-neutral-600">
          Fill out the form and a consultant will come back to you within one working day.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="contact-success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="mx-auto max-w-xl"
          >
            <ContactSuccess onReset={onReset} />
          </motion.div>
        ) : (
          <motion.div
            key="contact-form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10"
          >
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
              <SelectField
                id="enquiryType"
                label="I am a…"
                required
                value={values.enquiryType}
                onChange={(v) => setEnquiryType(v as EnquiryType)}
                onBlur={() => markTouched('enquiryType')}
                options={ENQUIRY_TYPES}
                error={errFor('enquiryType')}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  id="name"
                  label="Your name"
                  required
                  value={values.name}
                  onChange={(v) => set('name', v)}
                  onBlur={() => markTouched('name')}
                  autoComplete="name"
                  error={errFor('name')}
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
                  type="tel"
                  inputMode="tel"
                  value={values.phone}
                  onChange={(v) => set('phone', v)}
                  onBlur={() => markTouched('phone')}
                  autoComplete="tel"
                  placeholder="e.g. 020 7123 4567"
                  helper="Optional"
                  error={errFor('phone')}
                />
                <AnimatePresence initial={false}>
                  {showOrg && (
                    <motion.div
                      key="org"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                    >
                      <TextField
                        id="organisation"
                        label="Organisation"
                        required
                        value={values.organisation}
                        onChange={(v) => set('organisation', v)}
                        onBlur={() => markTouched('organisation')}
                        autoComplete="organization"
                        error={errFor('organisation')}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <TextField
                id="subject"
                label="Subject"
                required
                value={values.subject}
                onChange={(v) => set('subject', v)}
                onBlur={() => markTouched('subject')}
                placeholder="What is this about?"
                error={errFor('subject')}
              />

              <TextareaField
                id="message"
                label="Message"
                required
                rows={8}
                maxLength={MESSAGE_MAX}
                value={values.message}
                onChange={(v) => set('message', v)}
                onBlur={() => markTouched('message')}
                placeholder="Add any context that would help us respond well — role, team, timelines, specific question."
                error={errFor('message')}
              />

              <div className="flex flex-col gap-3 pt-1">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="btn-primary btn-lg w-full sm:w-auto sm:self-start"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Send message
                </button>
                <p className="text-xs text-neutral-500">
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            </form>

            <ContactSidebar />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
