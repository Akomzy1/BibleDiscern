// /admin — operator overview. Server component (fidelity-exempt internal
// tooling). requireAdminRSC re-checks the ADMIN_EMAILS allowlist before any
// service-role query runs. Aggregates only — never any user's situation,
// journal, or prayer content.

import Link from 'next/link';
import { PRICING } from '@librato/shared';
import { requireAdminRSC } from '@/lib/supabase/rsc';
import {
  getUserMetrics,
  getRevenueMetrics,
  getEngagementMetrics,
  getScaleInventorySummary,
} from '@/lib/admin-metrics';

export const dynamic = 'force-dynamic';

const usd = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const num = (n: number) => n.toLocaleString('en-US');
const pct = (r: number) => `${Math.round(r * 100)}%`;

// ─── presentational helpers (pure — no hooks) ────────────────────────────────

function Section({
  title,
  children,
  caption,
}: {
  title: string;
  children: React.ReactNode;
  caption?: React.ReactNode;
}) {
  return (
    <section className="mt-9 first:mt-2">
      <h2 className="mb-3 font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-vellum-200/60">
        {title}
      </h2>
      {children}
      {caption && <div className="mt-2.5 font-body text-[12px] leading-snug text-vellum-200/50">{caption}</div>}
    </section>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-panel border border-vellum-100/10 bg-nave-800 p-4 ${className ?? ''}`}>
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  delta,
}: {
  label: string;
  value: string;
  sub?: string;
  delta?: React.ReactNode;
}) {
  return (
    <Card>
      <div className="font-display text-[26px] font-medium leading-none text-gilt-500">{value}</div>
      <div className="mt-1.5 font-body text-[11px] uppercase tracking-[0.14em] text-vellum-200/60">{label}</div>
      {sub && <div className="mt-1 font-body text-[12px] text-vellum-200/70">{sub}</div>}
      {delta && <div className="mt-1.5">{delta}</div>}
    </Card>
  );
}

function Delta({ curr, prev }: { curr: number; prev: number }) {
  const d = curr - prev;
  const up = d >= 0;
  return (
    <span className={`font-body text-[11.5px] font-semibold ${up ? 'text-olive-500' : 'text-ember-600'}`}>
      {up ? '▲' : '▼'} {num(Math.abs(d))} vs prior period
    </span>
  );
}

function BarList({
  rows,
  max,
}: {
  rows: { label: string; count: number }[];
  max: number;
}) {
  return (
    <div className="grid gap-1.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          <span className="w-[78px] flex-none font-body text-[12px] tabular-nums text-vellum-200/60">
            {r.label}
          </span>
          <span className="relative h-4 flex-1 overflow-hidden rounded-pill bg-nave-900">
            <span
              className="absolute inset-y-0 left-0 rounded-pill bg-gilt-500/70"
              style={{ width: `${max > 0 ? (r.count / max) * 100 : 0}%` }}
            />
          </span>
          <span className="w-9 flex-none text-right font-body text-[12px] tabular-nums text-vellum-100">
            {r.count}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default async function AdminOverviewPage() {
  await requireAdminRSC(); // re-check the allowlist before any service-role read

  const [users, revenue, engagement, inventory] = await Promise.all([
    getUserMetrics(),
    getRevenueMetrics(),
    getEngagementMetrics(),
    getScaleInventorySummary(),
  ]);

  const maxVotes = Math.max(1, ...engagement.votesPerDay.map((d) => d.count));
  const maxSeason = Math.max(1, ...users.seasons.map((s) => s.count));

  return (
    <main className="mx-auto w-full max-w-[1100px] px-5 py-7">
      <h1 className="font-display text-3xl font-medium text-vellum-100">Overview</h1>
      <p className="mt-1 font-body text-[13.5px] text-vellum-200/60">
        Operator metrics. Aggregates only — no user content is shown here.
      </p>

      {/* ── USERS ── */}
      <Section title="Users">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Stat label="Total signups" value={num(users.total)} />
          <Stat
            label="New · last 7 days"
            value={num(users.new7d)}
            delta={<Delta curr={users.new7d} prev={users.prev7d} />}
          />
          <Stat
            label="New · last 30 days"
            value={num(users.new30d)}
            delta={<Delta curr={users.new30d} prev={users.prev30d} />}
          />
          <Stat
            label="Onboarding complete"
            value={pct(users.onboardingRate)}
            sub={`${num(users.onboarded)} of ${num(users.total)}`}
          />
        </div>

        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
          <Card>
            <div className="mb-2.5 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-vellum-200/60">
              Voted users (engagement proxy)
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ['1 day', users.votedUsers1d],
                ['7 days', users.votedUsers7d],
                ['30 days', users.votedUsers30d],
              ].map(([l, v]) => (
                <div key={l as string} className="rounded-control bg-nave-900 py-2.5">
                  <div className="font-display text-xl font-medium text-gilt-500">{num(v as number)}</div>
                  <div className="mt-0.5 font-body text-[11px] text-vellum-200/60">{l}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div className="mb-2.5 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-vellum-200/60">
              Season distribution
            </div>
            {users.seasons.length === 0 ? (
              <p className="font-body text-[13px] text-vellum-200/50">No seasons recorded yet.</p>
            ) : (
              <BarList rows={users.seasons.map((s) => ({ label: s.label, count: s.count }))} max={maxSeason} />
            )}
          </Card>
        </div>
        <p className="mt-2.5 font-body text-[12px] leading-snug text-vellum-200/50">
          &quot;Voted users&quot; = distinct people who cast a Daily Scale vote in the window. We have no
          analytics events, so this is the honest active-user proxy — not sessions or opens.
        </p>
      </Section>

      {/* ── REVENUE ── */}
      <Section
        title="Revenue"
        caption={
          <>
            Synced from Stripe webhooks —{' '}
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-gilt-500 underline underline-offset-2 hover:text-gilt-300"
            >
              Stripe Dashboard
            </a>{' '}
            is the source of truth. Premium tier only (the signup trigger seeds every free user as
            &quot;trialing&quot;, so those are excluded).
          </>
        }
      >
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Stat
            label="Active Premium"
            value={num(revenue.activePremium)}
            sub={`${num(revenue.activeMonthly)} monthly · ${num(revenue.activeAnnual)} annual`}
          />
          <Stat label="On trial" value={num(revenue.trialing)} sub="Premium trials in progress" />
          <Stat label="MRR" value={usd(revenue.mrr)} />
          <Stat label="ARR · run-rate" value={usd(revenue.arr)} sub="MRR × 12" />
        </div>

        <Card className="mt-2.5">
          <div className="font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-vellum-200/60">
            MRR formula
          </div>
          <p className="mt-2 font-body text-[13.5px] leading-relaxed text-vellum-100">
            <span className="tabular-nums">{num(revenue.activeMonthly)}</span> active monthly ×{' '}
            {usd(revenue.monthlyPrice)} +{' '}
            <span className="tabular-nums">{num(revenue.activeAnnual)}</span> active annual ×{' '}
            {usd(revenue.annualMonthlyEquiv)} ({usd(PRICING.annual.price)}/12) ={' '}
            <span className="font-semibold text-gilt-500">{usd(revenue.mrr)}</span> MRR
          </p>
        </Card>

        <div className="mt-2.5 grid grid-cols-3 gap-2.5">
          <Stat label="Trials started · 30d" value={num(revenue.trialsStarted30d)} />
          <Stat label="Converted (paying)" value={num(revenue.conversions)} />
          <Stat label="Cancellations · 30d" value={num(revenue.cancellations30d)} />
        </div>
      </Section>

      {/* ── ENGAGEMENT ── */}
      <Section title="Engagement">
        <div className="grid gap-2.5 sm:grid-cols-2">
          <Card>
            <div className="mb-1 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-vellum-200/60">
              Today&apos;s scale
            </div>
            {engagement.todayScale ? (
              <>
                <p className="font-scripture text-[15px] italic leading-snug text-vellum-100">
                  {engagement.todayScale.question}
                </p>
                <div className="mt-2.5 flex items-center gap-3">
                  <span className="font-display text-xl font-medium text-gilt-500">
                    {num(engagement.todayScale.votesA + engagement.todayScale.votesB)}
                  </span>
                  <span className="font-body text-[12px] text-vellum-200/60">votes so far</span>
                  <span className="ml-auto font-body text-[12.5px] text-vellum-200/70">
                    A {engagement.todayScale.percentA}% · B {100 - engagement.todayScale.percentA}%
                  </span>
                </div>
              </>
            ) : (
              <p className="font-body text-[13px] text-vellum-200/50">No scale published for today yet.</p>
            )}
          </Card>
          <Card>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-control bg-nave-900 py-3">
                <div className="font-display text-xl font-medium text-gilt-500">
                  {num(engagement.journeysStarted30d)}
                </div>
                <div className="mt-0.5 font-body text-[11px] text-vellum-200/60">Journeys started · 30d</div>
              </div>
              <div className="rounded-control bg-nave-900 py-3">
                <div className="font-display text-xl font-medium text-gilt-500">
                  {num(engagement.journeysCompleted30d)}
                </div>
                <div className="mt-0.5 font-body text-[11px] text-vellum-200/60">Completed · 30d</div>
              </div>
              <div className="rounded-control bg-nave-900 py-3">
                <div className="font-display text-xl font-medium text-gilt-500">
                  {num(engagement.journalEntries30d)}
                </div>
                <div className="mt-0.5 font-body text-[11px] text-vellum-200/60">Journal entries · 30d</div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mt-2.5">
          <div className="mb-2.5 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-vellum-200/60">
            Votes per day · last 14 days
          </div>
          <BarList
            rows={engagement.votesPerDay.map((d) => ({ label: d.day.slice(5), count: d.count }))}
            max={maxVotes}
          />
        </Card>
      </Section>

      {/* ── SCALE INVENTORY ── */}
      <Section title="Scale inventory">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Stat label="Approved pool" value={num(inventory.approved)} />
          <Stat label="Scheduled" value={num(inventory.scheduled)} />
          <Stat
            label="Days of runway"
            value={num(inventory.runway)}
            sub="approved + scheduled"
          />
          <Card className="flex flex-col justify-center">
            <Link
              href="/admin/scales"
              className="font-body text-[13.5px] font-semibold text-gilt-500 underline underline-offset-2 hover:text-gilt-300"
            >
              Manage scales →
            </Link>
            <span className="mt-1 font-body text-[12px] text-vellum-200/60">Curate, approve, retire</span>
          </Card>
        </div>
        <Card className="mt-2.5">
          <div className="mb-2.5 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-vellum-200/60">
            Runway by territory
          </div>
          {Object.keys(inventory.byTerritory).length === 0 ? (
            <p className="font-body text-[13px] text-vellum-200/50">Nothing approved or scheduled.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(inventory.byTerritory)
                .sort((a, b) => b[1] - a[1])
                .map(([t, n]) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-pill border border-vellum-100/12 bg-nave-900 px-2.5 py-1 font-body text-[12px] text-vellum-100"
                  >
                    {t} <span className="text-gilt-500">{n}</span>
                  </span>
                ))}
            </div>
          )}
        </Card>
      </Section>
    </main>
  );
}
