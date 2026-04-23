'use client';

import {
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  useId,
  useRef,
  useState,
} from 'react';
import { FileText, UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FieldShell } from '@/components/forms/FormPrimitives';
import {
  CV_ACCEPT_ATTR,
  CV_ALLOWED_EXTENSIONS,
  cvFileErrorMessage,
  formatBytes,
  validateCvFile,
} from '@/lib/registerForm';

interface FileUploadFieldProps {
  id?: string;
  label: string;
  required?: boolean;
  file: File | null;
  onChange: (file: File | null) => void;
  /** External validation error (e.g. from the form validator when submit attempted). */
  error?: string;
  onBlur?: () => void;
}

// Candidate CV upload — single file, drag-drop or click, inline validation.
// Placeholder helper copy pending client approval.
export function FileUploadField({
  id,
  label,
  required,
  file,
  onChange,
  error,
  onBlur,
}: FileUploadFieldProps) {
  const reactId = useId();
  const fieldId = id ?? reactId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>();

  // Either an inline-rejection message or the upstream form error.
  const shownError = localError ?? error;

  const handleFile = (next: File | null) => {
    if (!next) {
      setLocalError(undefined);
      onChange(null);
      return;
    }
    const err = validateCvFile(next);
    if (err) {
      setLocalError(cvFileErrorMessage(err));
      // Surface the invalid file to the form so the user sees the rejection
      // cleanly — but don't accept it as the selected value.
      onChange(null);
      return;
    }
    setLocalError(undefined);
    onChange(next);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null;
    handleFile(next);
    // Reset so the same file can be re-selected after removal.
    if (inputRef.current) inputRef.current.value = '';
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const next = e.dataTransfer.files?.[0] ?? null;
    handleFile(next);
  };

  const openPicker = () => inputRef.current?.click();

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPicker();
    }
  };

  const remove = () => {
    setLocalError(undefined);
    onChange(null);
    inputRef.current?.focus();
  };

  const hasError = Boolean(shownError);

  return (
    <FieldShell
      id={fieldId}
      label={label}
      required={required}
      error={shownError}
      helper={
        !file ? `Accepted: ${CV_ALLOWED_EXTENSIONS.join(', ')} · max 5MB` : undefined
      }
    >
      <input
        ref={inputRef}
        id={fieldId}
        type="file"
        accept={CV_ACCEPT_ATTR}
        onChange={onInputChange}
        onBlur={onBlur}
        className="sr-only"
        aria-invalid={hasError ? true : undefined}
        aria-describedby={hasError ? `${fieldId}-error` : `${fieldId}-helper`}
      />

      {file ? (
        <div
          className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3"
          data-testid="cv-selected"
        >
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-neutral-900">{file.name}</p>
            <p className="text-xs text-neutral-500">{formatBytes(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={remove}
            aria-label={`Remove ${file.name}`}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={onKeyDown}
          onDragOver={onDragOver}
          onDragEnter={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={cn(
            'flex min-h-[7.5rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-white px-4 py-6 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            hasError
              ? 'border-red-300 bg-red-50/40'
              : isDragging
                ? 'border-primary-500 bg-primary-50/60'
                : 'border-neutral-300 hover:border-primary-400 hover:bg-primary-50/40',
          )}
        >
          <span
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors',
              hasError
                ? 'bg-red-100 text-red-600'
                : isDragging
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-primary-50 text-primary-600',
            )}
            aria-hidden="true"
          >
            <UploadCloud className="h-5 w-5" />
          </span>
          <p className="text-sm font-medium text-neutral-800">
            <span className="text-primary-700">Click to upload</span>
            <span className="hidden sm:inline"> or drag and drop</span>
          </p>
          <p className="text-xs text-neutral-500">PDF or Word document, up to 5MB</p>
        </div>
      )}
    </FieldShell>
  );
}
