// Daily Scale A/B badge. A = nave circle with vellum letter; B = gilt circle
// with nave letter. B's gold is a token, not a second "gold moment" — keep
// everything else on that screen quiet. (SKILL.md §8)

type SideBadgeProps = {
  side: 'a' | 'b';
  className?: string;
};

export function SideBadge({ side, className }: SideBadgeProps) {
  return (
    <span
      aria-hidden
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-pill font-body text-sm font-semibold uppercase ${
        side === 'a' ? 'bg-nave-800 text-vellum-100' : 'bg-gilt-500 text-nave-900'
      } ${className ?? ''}`}
    >
      {side.toUpperCase()}
    </span>
  );
}
