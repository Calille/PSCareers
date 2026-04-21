'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, BriefcaseBusiness, CalendarClock, MapPin, Send, Star } from 'lucide-react';
import type { Candidate } from '@/types';
import { ModalShell } from './ModalShell';
import { EnquiryForm } from './EnquiryForm';

type View = 'profile' | 'form';

interface CandidateModalProps {
  candidate: Candidate | null;
  onClose: () => void;
}

const TITLE_ID = 'candidate-modal-title';

export function CandidateModal({ candidate, onClose }: CandidateModalProps) {
  const [view, setView] = useState<View>('profile');

  useEffect(() => {
    if (candidate) setView('profile');
  }, [candidate]);

  return (
    <ModalShell open={Boolean(candidate)} onClose={onClose} labelledBy={TITLE_ID}>
      {candidate && (
        <AnimatePresence mode="wait">
          {view === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <CandidateProfile
                candidate={candidate}
                titleId={TITLE_ID}
                onRequestIntro={() => setView('form')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <EnquiryForm
                candidate={candidate}
                titleId={TITLE_ID}
                onBack={() => setView('profile')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </ModalShell>
  );
}

function CandidateProfile({
  candidate,
  titleId,
  onRequestIntro,
}: {
  candidate: Candidate;
  titleId: string;
  onRequestIntro: () => void;
}) {
  return (
    <div className="flex flex-col gap-6 px-6 py-8 md:px-10 md:py-10">
      <header className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">
          {candidate.id}
        </span>
        <h2 id={titleId} className="text-2xl font-bold text-neutral-900 md:text-3xl">
          {candidate.roleTitle}
        </h2>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
          <span className="inline-flex items-center gap-1.5">
            <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
            {candidate.roleType}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {candidate.region}
          </span>
        </p>
      </header>

      <p className="text-[15px] leading-relaxed text-neutral-700">{candidate.fullBio}</p>

      <dl className="grid gap-4 rounded-xl border border-neutral-200 bg-neutral-50/60 p-5 sm:grid-cols-2">
        <DetailRow icon={<Star className="h-4 w-4" />} label="Years of experience">
          {candidate.yearsExperience} years
        </DetailRow>
        <DetailRow icon={<MapPin className="h-4 w-4" />} label="Region">
          {candidate.region}
        </DetailRow>
        <DetailRow icon={<BriefcaseBusiness className="h-4 w-4" />} label="Contract type sought">
          {candidate.contractTypeSought}
        </DetailRow>
        <DetailRow icon={<CalendarClock className="h-4 w-4" />} label="Availability">
          {candidate.availability}
        </DetailRow>
        <DetailRow icon={<Award className="h-4 w-4" />} label="Qualifications" span={2}>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-neutral-700">
            {candidate.qualifications.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </DetailRow>
      </dl>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
          Specialist areas
        </h4>
        <ul className="mt-3 flex flex-wrap gap-2">
          {candidate.specialisms.map((s) => (
            <li
              key={s}
              className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-800"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-500">
          Full identifying details are shared after we&apos;ve spoken with you.
        </p>
        <button type="button" onClick={onRequestIntro} className="btn-primary">
          <Send className="h-4 w-4" aria-hidden="true" />
          Request an introduction
        </button>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  children,
  span = 1,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  span?: 1 | 2;
}) {
  return (
    <div className={span === 2 ? 'sm:col-span-2' : ''}>
      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500">
        <span className="text-primary-600" aria-hidden="true">
          {icon}
        </span>
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-neutral-800">{children}</dd>
    </div>
  );
}
