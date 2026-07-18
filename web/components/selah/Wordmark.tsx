// The BibleDiscern wordmark — quiet Playfair, used on the auth shell.

type WordmarkProps = {
  className?: string;
};

export function Wordmark({ className }: WordmarkProps) {
  return (
    <span
      className={`font-display text-[19px] font-medium tracking-[0.04em] text-vellum-100 ${className ?? ''}`}
    >
      BibleDiscern
    </span>
  );
}
