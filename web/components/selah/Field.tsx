import { useId } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

// Form fields — vellum field, 14 radius, gilt focus ring, ember border +
// helper text on error. (SKILL.md §8)

const FIELD =
  'w-full rounded-panel border bg-vellum-100 px-4 py-3 font-body text-ink-900 ' +
  'placeholder:text-ink-500/60 transition duration-whisper ease-selah ' +
  'focus:outline-none focus:ring-2 focus:ring-gilt-500';

function fieldBorder(error?: string) {
  return error ? 'border-ember-600' : 'border-gilt-edge';
}

type CommonProps = {
  label?: string;
  error?: string;
};

export function TextField({
  label,
  error,
  className,
  id,
  ...rest
}: CommonProps & InputHTMLAttributes<HTMLInputElement>) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={fieldId} className="mb-1.5 block font-body text-sm font-semibold text-gilt-300">
          {label}
        </label>
      )}
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={`${FIELD} ${fieldBorder(error)} min-h-[44px]`}
        {...rest}
      />
      {error && (
        <p id={`${fieldId}-error`} className="mt-1.5 font-body text-sm text-ember-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextArea({
  label,
  error,
  className,
  id,
  rows = 5,
  ...rest
}: CommonProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={fieldId} className="mb-1.5 block font-body text-sm font-semibold text-gilt-300">
          {label}
        </label>
      )}
      <textarea
        id={fieldId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={`${FIELD} ${fieldBorder(error)} resize-none leading-relaxed`}
        {...rest}
      />
      {error && (
        <p id={`${fieldId}-error`} className="mt-1.5 font-body text-sm text-ember-600">
          {error}
        </p>
      )}
    </div>
  );
}
