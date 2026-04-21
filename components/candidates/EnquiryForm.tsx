'use client';

import { type FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import type { Candidate } from '@/types';

interface EnquiryFormProps {
  candidate?: Candidate;
  onBack?: () => void;
  onSubmitted?: () => void;
  titleId: string;
  // Copy — placeholder for client approval.
  heading?: string;
  intro?: string;
  submitLabel?: string;
  successMessage?: string;
}

export function EnquiryForm({
  candidate,
  onBack,
  onSubmitted,
  titleId,
  heading = 'Request an introduction',
  intro = 'Tell us a little about your vacancy and we’ll make the introduction personally. No automated emails, no data resold.',
  submitLabel = 'Send request',
  successMessage = 'Thanks — one of our consultants will be in touch within 48 hours to discuss this candidate.',
}: EnquiryFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = name.trim() && email.trim() && phone.trim() && organisation.trim();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // No backend yet — log and show success.
    // eslint-disable-next-line no-console
    console.log('Enquiry submitted', {
      candidateId: candidate?.id ?? null,
      name,
      email,
      phone,
      organisation,
      role,
      message,
    });
    setSubmitted(true);
    onSubmitted?.();
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center md:px-10 md:py-20">
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 16 }}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-50 text-accent-600"
          aria-hidden="true"
        >
          <CheckCircle2 className="h-7 w-7" />
        </motion.span>
        <h3 id={titleId} className="text-xl font-semibold text-neutral-900">
          Request sent
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-neutral-600">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 px-6 py-8 md:px-10 md:py-10">
      <div className="space-y-1.5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to profile
          </button>
        )}
        <h3 id={titleId} className="pt-1 text-2xl font-bold text-neutral-900">
          {heading}
        </h3>
        {candidate && (
          <p className="text-sm text-neutral-500">
            Candidate reference:{' '}
            <span className="font-semibold text-neutral-800">{candidate.id}</span> ·{' '}
            {candidate.roleTitle}
          </p>
        )}
        <p className="pt-2 text-sm leading-relaxed text-neutral-600">{intro}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Your name" required value={name} onChange={setName} autoComplete="name" />
        <Field
          label="Your email"
          required
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <Field
          label="Your phone"
          required
          type="tel"
          value={phone}
          onChange={setPhone}
          autoComplete="tel"
        />
        <Field
          label="Organisation / council"
          required
          value={organisation}
          onChange={setOrganisation}
          autoComplete="organization"
        />
      </div>

      <Field
        label="Role you’re hiring for"
        value={role}
        onChange={setRole}
        placeholder="Optional — helps us assess fit"
      />

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-800">Short message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Optional — any timing, team context or specific questions"
          className="min-h-[112px] resize-y rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </label>

      <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:justify-end">
        {onBack && (
          <button type="button" onClick={onBack} className="btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={!canSubmit}>
          <Send className="h-4 w-4" aria-hidden="true" />
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}

function Field({
  label,
  value,
  onChange,
  required,
  type = 'text',
  placeholder,
  autoComplete,
}: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-neutral-800">
        {label}
        {required && <span className="ml-0.5 text-primary-600">*</span>}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-11 rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
      />
    </label>
  );
}
