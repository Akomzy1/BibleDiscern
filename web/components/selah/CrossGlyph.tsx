// The cross mark — hairline stroke, centered. (Onboarding/auth/paywall frames)

type CrossGlyphProps = {
  size?: number;
  className?: string;
  muted?: boolean;
  style?: React.CSSProperties;
};

export function CrossGlyph({ size = 26, className, muted = false, style }: CrossGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={muted ? 'rgba(253,246,236,.65)' : 'var(--gilt)'}
      strokeWidth="1.5"
      strokeLinecap="round"
      className={`mx-auto block ${className ?? ''}`}
      style={style}
      aria-hidden
    >
      <path d="M12 3v18" />
      <path d="M6.5 9.5h11" />
    </svg>
  );
}
