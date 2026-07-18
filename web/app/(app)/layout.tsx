import { TabBar } from '@/components/selah';

// Authenticated app chrome: nave900 ground, single centered column (max 640px),
// bottom TabBar with safe-area insets. Journey + onboarding render their own
// full-bleed layouts and omit the TabBar.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-nave-900 text-vellum-100">
      <div className="mx-auto w-full max-w-[640px] px-4 pb-28 pt-safe">{children}</div>
      <TabBar />
    </div>
  );
}
