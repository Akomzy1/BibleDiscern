// Small status pill. Gold = premium markers; success = olive affirmations;
// outline = quiet type chips (so gold stays singular on the screen).

type StatusChipProps = {
  tone?: 'gold' | 'success' | 'outline' | 'danger';
  className?: string;
  children: React.ReactNode;
};

const TONES = {
  gold: 'bg-gilt-500 text-nave-900',
  success: 'border border-olive-500/40 bg-olive-500/10 text-olive-500',
  outline: 'border border-gilt-edge text-gilt-300',
  danger: 'border border-ember-600/40 bg-ember-600/10 text-ember-600',
} as const;

export function StatusChip({ tone = 'outline', className, children }: StatusChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2.5 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.12em] ${TONES[tone]} ${className ?? ''}`}
    >
      {children}
    </span>
  );
}
