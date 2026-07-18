'use client';

// Quiet toggle row on vellum: label + note left, switch right. (Settings frame)

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  note?: string;
  disabled?: boolean;
};

export function Toggle({ checked, onChange, label, note, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 text-left disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt-500"
    >
      <span className="min-w-0 flex-1">
        <span className="block font-body text-[15px] text-ink-900">{label}</span>
        {note && <span className="mt-0.5 block font-body text-[12.5px] text-ink-500">{note}</span>}
      </span>
      <span
        aria-hidden
        className={`relative inline-flex h-7 w-12 flex-none items-center rounded-pill transition-colors duration-whisper ease-selah ${
          checked ? 'bg-gilt-500' : 'bg-ink-900/15'
        }`}
      >
        <span
          className={`absolute h-[22px] w-[22px] rounded-pill bg-vellum-100 transition-transform duration-whisper ease-selah ${
            checked ? 'translate-x-[23px]' : 'translate-x-[3px]'
          }`}
        />
      </span>
    </button>
  );
}
