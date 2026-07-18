// The prayer surface: inset vellum with a 3px gilt top border, Cormorant italic.
// Gold is spent only on that border. (Today prototype, LEARN frame)

type PrayerCardProps = {
  className?: string;
  children: React.ReactNode;
};

export function PrayerCard({ className, children }: PrayerCardProps) {
  return (
    <div
      className={`rounded-control border-t-[3px] border-gilt-500 bg-vellum-200 px-4 py-4 ${className ?? ''}`}
    >
      <p className="font-scripture text-[17px] italic leading-relaxed text-ink-900">{children}</p>
    </div>
  );
}
