import { useId } from 'react';

// One inline SVG feTurbulence layer at ~2.5% opacity, tiled over vellum
// panels. No raster image, no payload. (SKILL.md §6)
export function VellumGrain() {
  const id = useId();
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.025] mix-blend-multiply"
      aria-hidden
    >
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}
