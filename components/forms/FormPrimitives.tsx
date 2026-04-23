'use client';

import type { ChangeEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ---------- Section heading ----------

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="text-xl font-bold text-neutral-900 md:text-2xl">{title}</h2>
    </div>
  );
}

// ---------- Shared field wrapper ----------

interface FieldShellProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  helper?: ReactNode;
  counter?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function FieldShell({
  id,
  label,
  required,
  error,
  helper,
  counter,
  className,
  children,
}: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-neutral-800">
        {label}
        {required && (
          <span className="ml-0.5 text-primary-600" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {(error || helper || counter) && (
        <div className="flex min-h-[1rem] items-start justify-between gap-3 text-xs">
          <span
            id={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
            className={cn(error ? 'text-red-600' : 'text-neutral-500')}
          >
            {error ?? helper}
          </span>
          {counter && <span className="shrink-0 tabular-nums">{counter}</span>}
        </div>
      )}
    </div>
  );
}

// ---------- Base input styles ----------

export const baseInputCls =
  'h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2';

export function inputStateCls(invalid?: boolean) {
  return invalid
    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
    : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-100';
}

// ---------- Text input ----------

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'decimal';
  pattern?: string;
  min?: number | string;
  max?: number | string;
  error?: string;
  helper?: ReactNode;
  className?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  required,
  type = 'text',
  placeholder,
  autoComplete,
  inputMode,
  pattern,
  min,
  max,
  error,
  helper,
  className,
}: TextInputProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      error={error}
      helper={helper}
      className={className}
    >
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        pattern={pattern}
        min={min}
        max={max}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
        className={cn(baseInputCls, inputStateCls(Boolean(error)))}
      />
    </FieldShell>
  );
}

// ---------- Select ----------

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  required?: boolean;
  placeholder?: string;
  options: readonly string[];
  error?: string;
  helper?: ReactNode;
  className?: string;
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  onBlur,
  required,
  placeholder = 'Please choose',
  options,
  error,
  helper,
  className,
}: SelectFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      error={error}
      helper={helper}
      className={className}
    >
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
          className={cn(
            baseInputCls,
            inputStateCls(Boolean(error)),
            'appearance-none pr-10',
            !value && 'text-neutral-400',
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="text-neutral-900">
              {o}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-400"
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path
              d="M1 1L6 6L11 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </FieldShell>
  );
}

// ---------- Textarea ----------

interface TextareaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  error?: string;
  helper?: ReactNode;
  className?: string;
}

export function TextareaField({
  id,
  label,
  value,
  onChange,
  onBlur,
  required,
  placeholder,
  rows = 4,
  maxLength,
  error,
  helper,
  className,
}: TextareaFieldProps) {
  const counter = maxLength ? (
    <CharCounter current={value.length} max={maxLength} />
  ) : undefined;

  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      error={error}
      helper={helper}
      counter={counter}
      className={className}
    >
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
        className={cn(
          'w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2',
          inputStateCls(Boolean(error)),
        )}
      />
    </FieldShell>
  );
}

function CharCounter({ current, max }: { current: number; max: number }) {
  const pct = current / max;
  const over = current > max;
  const warn = pct >= 0.9 && !over;
  return (
    <span
      className={cn(
        'font-medium',
        over ? 'text-red-600' : warn ? 'text-amber-600' : 'text-neutral-500',
      )}
      aria-live="polite"
    >
      {current.toLocaleString()}/{max.toLocaleString()}
    </span>
  );
}
