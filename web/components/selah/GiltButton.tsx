import type { ButtonHTMLAttributes } from 'react';

// Primary (gilt fill, nave text), secondary (1px gilt outline, gilt text),
// text-link (underlined gilt). Default / hover (250ms) / pressed (scale .985)
// / disabled (40%). Min height 44px. (SKILL.md §8)

type GiltButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'link';
  fullWidth?: boolean;
};

const BASE =
  'inline-flex min-h-[44px] items-center justify-center rounded-panel px-6 font-body font-semibold ' +
  'transition duration-whisper ease-selah active:scale-[0.985] ' +
  'disabled:pointer-events-none disabled:opacity-40 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500 focus-visible:ring-offset-2 focus-visible:ring-offset-nave-900';

const VARIANTS = {
  primary: 'bg-gilt-500 text-nave-900 hover:brightness-105',
  secondary: 'border border-gilt-500 text-gilt-500 hover:bg-gilt-500/10',
  link: 'min-h-[44px] px-2 text-gilt-500 underline underline-offset-4 hover:text-gilt-300',
} as const;

export function GiltButton({
  variant = 'primary',
  fullWidth = false,
  className,
  type = 'button',
  ...rest
}: GiltButtonProps) {
  return (
    <button
      type={type}
      className={`${BASE} ${VARIANTS[variant]} ${fullWidth ? 'w-full' : ''} ${className ?? ''}`}
      {...rest}
    />
  );
}
