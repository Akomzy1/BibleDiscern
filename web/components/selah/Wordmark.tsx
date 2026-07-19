// The BibleDiscern mark — a typeset lockup, not a drawn logo (Brand Assets sheet).
// A gilt cross of two hairline strokes leads; "BibleDiscern" in Playfair Display
// 600 follows. The cross is ALWAYS gilt — the one gold moment on its surface.
//
// Geometry derives from the text size S (= 1em), verbatim from the brand sheet:
//   cross height = 0.9·S   ·   cross width = 0.62·height   ·   crossbar at 26%
//   stroke = S/12 (hairline)   ·   gap cross→name = 0.55·S   ·   tracking +0.01em

type WordmarkProps = {
  className?: string;
  /** Ground the lockup sits on — sets the NAME color. Cross stays gilt either way. */
  tone?: 'navy' | 'vellum';
  /** Include the leading cross. Set false where a standalone cross already sits above (auth). */
  cross?: boolean;
};

export function Wordmark({ className, tone = 'navy', cross = true }: WordmarkProps) {
  return (
    <span
      className={`inline-flex items-center font-display text-[19px] font-semibold tracking-[0.01em] ${
        tone === 'vellum' ? 'text-ink-900' : 'text-vellum-100'
      } ${className ?? ''}`}
    >
      {cross && (
        // cross: viewBox normalized to cross-height = 1, rendered at 0.9em tall
        <svg
          viewBox="0 0 0.62 1"
          aria-hidden
          fill="var(--gilt)"
          style={{ height: '0.9em', width: '0.558em', marginRight: '0.55em', display: 'block' }}
        >
          <rect x="0.2637" y="0" width="0.0926" height="1" />
          <rect x="0" y="0.26" width="0.62" height="0.0926" />
        </svg>
      )}
      BibleDiscern
    </span>
  );
}
