// The uppercase label. Gilt on navy, ink on vellum. (SKILL.md §4, §8)

type EyebrowProps = {
  on?: 'navy' | 'vellum';
  className?: string;
  children: React.ReactNode;
};

export function Eyebrow({ on = 'navy', className, children }: EyebrowProps) {
  return (
    <p
      className={`font-body text-[11px] font-semibold uppercase tracking-[0.18em] ${
        on === 'navy' ? 'text-gilt-500' : 'text-ink-500'
      } ${className ?? ''}`}
    >
      {children}
    </p>
  );
}
