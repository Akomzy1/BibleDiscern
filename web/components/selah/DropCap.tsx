// The type signature — the Illuminated Capital (SKILL.md §4).
// Every Scripture passage opens with a two-line Playfair drop cap in gilt.

type ScriptureBlockProps = {
  children: string;
  /** On immersive navy screens (Stillness), the verse reads in gilt300. */
  onNavy?: boolean;
  className?: string;
};

export function ScriptureBlock({ children, onNavy = false, className }: ScriptureBlockProps) {
  return (
    <p
      className={`font-scripture italic leading-relaxed ${onNavy ? 'text-gilt-300' : 'text-ink-900'}
        [&::first-letter]:font-display [&::first-letter]:not-italic
        [&::first-letter]:text-gilt-500 [&::first-letter]:text-[3.2em]
        [&::first-letter]:leading-[0.8] [&::first-letter]:float-left
        [&::first-letter]:mr-2 [&::first-letter]:mt-1 ${className ?? ''}`}
    >
      {children}
    </p>
  );
}
