// Onboarding progress: six dots, active in gilt.

type ProgressDotsProps = {
  count: number;
  active: number; // zero-based
  className?: string;
};

export function ProgressDots({ count, active, className }: ProgressDotsProps) {
  return (
    <div
      className={`flex items-center justify-center gap-2 ${className ?? ''}`}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={count}
      aria-valuenow={active + 1}
      aria-label={`Step ${active + 1} of ${count}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-pill transition-colors duration-whisper ease-selah ${
            i === active ? 'bg-gilt-500' : 'bg-gilt-300/25'
          }`}
        />
      ))}
    </div>
  );
}
