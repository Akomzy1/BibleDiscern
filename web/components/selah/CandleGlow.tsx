// Immersive navy screens get ONE soft radial gold gradient (<=6% opacity)
// behind the focal element. Never more than one glow per screen. (SKILL.md §6)
export function CandleGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-[38%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{ background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)' }}
    />
  );
}
