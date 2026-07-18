'use client';

// Gilt time pills — selected takes the gilt fill; the rest stay quiet outlines.
// (Onboarding S4 / Settings "Daily Scale time")

type TimePillsProps = {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function TimePills({ options, value, onChange, className }: TimePillsProps) {
  return (
    <div className={`flex gap-2 ${className ?? ''}`} role="radiogroup" aria-label="Time">
      {options.map((o) => {
        const sel = o === value;
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={sel}
            onClick={() => onChange(o)}
            className={`min-h-[44px] flex-1 rounded-pill px-3 font-body text-sm font-semibold transition-all duration-whisper ease-selah focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500 ${
              sel
                ? 'border border-gilt-500 bg-gilt-500 text-nave-900'
                : 'border border-gilt-500/20 bg-transparent text-vellum-200/60 hover:text-vellum-200'
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
