import { VellumGrain } from './VellumGrain';

// A lit page within the navy nave. Vellum panels carry the grain; navy panels
// carry the 12%-gilt edge and the gold-tinted glow shadow — never gray. (SKILL.md §6)

type PanelProps = {
  tone?: 'vellum' | 'navy';
  className?: string;
  children: React.ReactNode;
};

export function Panel({ tone = 'vellum', className, children }: PanelProps) {
  if (tone === 'navy') {
    return (
      <div
        className={`rounded-panel border border-gilt-edge bg-nave-800 shadow-glow ${className ?? ''}`}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      className={`relative overflow-hidden rounded-panel bg-vellum-100 text-ink-900 ${className ?? ''}`}
    >
      <VellumGrain />
      <div className="relative">{children}</div>
    </div>
  );
}
