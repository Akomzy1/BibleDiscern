'use client';

// /admin/scales — internal curation tooling (fidelity-exempt per CLAUDE.md).
// Inventory runway, the full scale table with status filtering, a real-LEARN
// preview, and manual create / edit / approve / retire. All writes go through
// /api/admin/* which re-checks the ADMIN_EMAILS allowlist server-side; this page
// is only reachable because the server layout already cleared the same check.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { TERRITORIES } from '@librato/shared';
import type { DailyScale as Scale } from '@librato/shared';
import type { AdminScale } from '@/lib/admin-scales';
import { getBrowserClient } from '@/lib/supabase/browser';
import { GiltButton, StatusChip } from '@/components/selah';
import { ScaleLens } from '@/components/scale/ScaleLens';

// ─── types mirrored from GET /api/admin/scales ───────────────────────────────

interface Inventory {
  approved: number;
  scheduled: number;
  draft: number;
  published: number;
  retired: number;
  runway: number;
  byTerritory: Record<string, number>;
  upcoming: { date: string; status: string; territory: string | null; question: string }[];
}

const FILTERS = ['all', 'draft', 'approved', 'scheduled', 'published', 'retired'] as const;
type Filter = (typeof FILTERS)[number];

const STATUS_TONE: Record<string, 'gold' | 'success' | 'outline'> = {
  draft: 'outline',
  approved: 'gold',
  scheduled: 'gold',
  published: 'success',
  retired: 'outline',
};

// ─── auth'd fetch ────────────────────────────────────────────────────────────

async function authFetch(url: string, init?: RequestInit) {
  const {
    data: { session },
  } = await getBrowserClient().auth.getSession();
  if (!session) throw new Error('Not signed in.');
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message ?? `Request failed (${res.status}).`);
  return json.data;
}

// ─── form ────────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  question: '',
  territory: TERRITORIES[0] as string,
  side_a_label: '',
  side_a_argument: '',
  side_b_label: '',
  side_b_argument: '',
  scripture_reference: '',
  scripture_text: '',
  scripture_lens: '',
  prayer: '',
  seed_votes_a: 0,
  seed_votes_b: 0,
};
type FormState = typeof EMPTY_FORM;

function formFrom(s: AdminScale): FormState {
  return {
    question: s.question,
    territory: s.territory ?? (TERRITORIES[0] as string),
    side_a_label: s.side_a_label,
    side_a_argument: s.side_a_argument,
    side_b_label: s.side_b_label,
    side_b_argument: s.side_b_argument,
    scripture_reference: s.scripture_reference,
    scripture_text: s.scripture_text,
    scripture_lens: s.scripture_lens,
    prayer: s.prayer,
    seed_votes_a: s.votes_a,
    seed_votes_b: s.votes_b,
  };
}

function Labeled({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500">
        {label}
        {hint && <span className="font-normal normal-case tracking-normal text-ink-500/70">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full rounded-control border border-ink-900/15 bg-vellum-200 px-3 py-2 font-body text-[14px] text-ink-900 outline-none focus:border-gilt-500 focus:ring-1 focus:ring-gilt-500';

function ScaleForm({
  initial,
  submitting,
  error,
  onCancel,
  onSubmit,
  mode,
}: {
  initial: FormState;
  submitting: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (form: FormState, approve: boolean) => void;
  mode: 'create' | 'edit';
}) {
  const [form, setForm] = useState<FormState>(initial);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="relative overflow-hidden rounded-panel border border-gilt-500/25 bg-vellum-100 p-5 text-ink-900 shadow-glow">
      <h3 className="mb-4 font-display text-xl font-medium text-ink-900">
        {mode === 'create' ? 'New scale' : 'Edit scale'}
      </h3>
      <div className="grid gap-3.5">
        <Labeled label="Question" hint="≤ 90 chars, an honest either/or">
          <textarea
            rows={2}
            value={form.question}
            onChange={(e) => set('question', e.target.value)}
            className={inputCls}
          />
        </Labeled>
        <Labeled label="Territory">
          <select
            value={form.territory}
            onChange={(e) => set('territory', e.target.value)}
            className={inputCls}
          >
            {TERRITORIES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Labeled>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="grid gap-3.5">
            <Labeled label="Side A label" hint="≤ 5 words">
              <input value={form.side_a_label} onChange={(e) => set('side_a_label', e.target.value)} className={inputCls} />
            </Labeled>
            <Labeled label="Side A argument">
              <textarea rows={4} value={form.side_a_argument} onChange={(e) => set('side_a_argument', e.target.value)} className={inputCls} />
            </Labeled>
          </div>
          <div className="grid gap-3.5">
            <Labeled label="Side B label" hint="≤ 5 words">
              <input value={form.side_b_label} onChange={(e) => set('side_b_label', e.target.value)} className={inputCls} />
            </Labeled>
            <Labeled label="Side B argument">
              <textarea rows={4} value={form.side_b_argument} onChange={(e) => set('side_b_argument', e.target.value)} className={inputCls} />
            </Labeled>
          </div>
        </div>

        <Labeled label="Scripture reference" hint='e.g. "Matthew 5:9 & Matthew 10:34"'>
          <input value={form.scripture_reference} onChange={(e) => set('scripture_reference', e.target.value)} className={inputCls} />
        </Labeled>
        <Labeled label="Scripture text">
          <textarea rows={2} value={form.scripture_text} onChange={(e) => set('scripture_text', e.target.value)} className={inputCls} />
        </Labeled>
        <Labeled label="Scripture lens" hint="3–4 sentences · never declares a winner">
          <textarea rows={4} value={form.scripture_lens} onChange={(e) => set('scripture_lens', e.target.value)} className={inputCls} />
        </Labeled>
        <Labeled label="Prayer" hint="1–2 sentences, first person">
          <textarea rows={2} value={form.prayer} onChange={(e) => set('prayer', e.target.value)} className={inputCls} />
        </Labeled>

        <div className="grid grid-cols-2 gap-3.5">
          <Labeled label="Seed votes A">
            <input type="number" min={0} value={form.seed_votes_a} onChange={(e) => set('seed_votes_a', Number(e.target.value))} className={inputCls} />
          </Labeled>
          <Labeled label="Seed votes B">
            <input type="number" min={0} value={form.seed_votes_b} onChange={(e) => set('seed_votes_b', Number(e.target.value))} className={inputCls} />
          </Labeled>
        </div>
      </div>

      {error && <p className="mt-3 font-body text-[13px] text-ember-600">{error}</p>}

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <GiltButton onClick={() => onSubmit(form, false)} disabled={submitting}>
          {submitting ? 'Saving…' : mode === 'create' ? 'Save as draft' : 'Save changes'}
        </GiltButton>
        {mode === 'create' && (
          <button
            type="button"
            disabled={submitting}
            onClick={() => onSubmit(form, true)}
            className="rounded-pill border border-gilt-500 px-4 py-2 font-body text-[14px] font-semibold text-gilt-700 transition-colors hover:bg-gilt-500/10 disabled:opacity-50"
          >
            Save &amp; approve
          </button>
        )}
        <button
          type="button"
          disabled={submitting}
          onClick={onCancel}
          className="rounded-pill px-4 py-2 font-body text-[14px] font-semibold text-ink-500 hover:text-ink-900"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── detail (preview + actions) ──────────────────────────────────────────────

function toScale(s: AdminScale): Scale {
  return {
    id: s.id,
    date: s.published_date ?? '',
    question: s.question,
    side_a_label: s.side_a_label,
    side_a_argument: s.side_a_argument,
    side_b_label: s.side_b_label,
    side_b_argument: s.side_b_argument,
    scripture_reference: s.scripture_reference,
    scripture_text: s.scripture_text,
    scripture_lens: s.scripture_lens,
    prayer: s.prayer,
    votes_a: s.votes_a,
    votes_b: s.votes_b,
  };
}

function ScaleDetail({
  scale,
  busy,
  onEdit,
  onApprove,
  onRetire,
}: {
  scale: AdminScale;
  busy: boolean;
  onEdit: () => void;
  onApprove: () => void;
  onRetire: () => void;
}) {
  const editable = scale.status === 'draft' || scale.status === 'approved';
  const approvable = scale.status === 'draft';
  const immutable = scale.status === 'published' || scale.status === 'retired';

  return (
    <div className="rounded-panel border border-ink-900/10 bg-vellum-100 p-5 text-ink-900 shadow-glow">
      <div className="mb-3 flex flex-wrap items-center gap-2 font-body text-[12px] text-ink-500">
        <StatusChip tone={STATUS_TONE[scale.status] ?? 'outline'}>{scale.status}</StatusChip>
        <span>· {scale.territory ?? 'untagged'}</span>
        <span>· source: {scale.source}</span>
        {scale.published_date && <span>· published {scale.published_date}</span>}
        {scale.approved_at && <span>· approved {scale.approved_at.slice(0, 10)}</span>}
      </div>

      {/* WEIGH side arguments (admin sees both fully) */}
      <div className="grid gap-2.5 sm:grid-cols-2">
        {(['a', 'b'] as const).map((side) => (
          <div key={side} className="rounded-control border border-ink-900/10 bg-vellum-200 p-3">
            <p className="font-body text-[13px] font-semibold text-ink-900">
              {side.toUpperCase()} — {side === 'a' ? scale.side_a_label : scale.side_b_label}
            </p>
            <p className="mt-1 font-body text-[12.5px] leading-normal text-ink-500">
              {side === 'a' ? scale.side_a_argument : scale.side_b_argument}
            </p>
          </div>
        ))}
      </div>

      {/* The REAL LEARN component, so the preview matches exactly what ships */}
      <div className="mt-4 border-t border-ink-900/10 pt-2">
        <ScaleLens scale={toScale(scale)} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        {editable && (
          <button
            type="button"
            disabled={busy}
            onClick={onEdit}
            className="rounded-pill border border-ink-900/20 px-4 py-2 font-body text-[13px] font-semibold text-ink-900 hover:bg-ink-900/5 disabled:opacity-50"
          >
            Edit
          </button>
        )}
        {approvable && (
          <button
            type="button"
            disabled={busy}
            onClick={onApprove}
            className="rounded-pill border border-gilt-500 bg-gilt-500 px-4 py-2 font-body text-[13px] font-semibold text-nave-900 hover:bg-gilt-300 disabled:opacity-50"
          >
            Approve
          </button>
        )}
        {editable && (
          <button
            type="button"
            disabled={busy}
            onClick={onRetire}
            className="rounded-pill border border-ember-600/40 px-4 py-2 font-body text-[13px] font-semibold text-ember-600 hover:bg-ember-600/5 disabled:opacity-50"
          >
            Retire
          </button>
        )}
        {immutable && (
          <p className="font-body text-[12.5px] italic text-ink-500">
            {scale.status === 'published'
              ? 'Published scales are immutable here.'
              : 'Retired.'}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── inventory header ────────────────────────────────────────────────────────

function Stat({ n, label, warn }: { n: number; label: string; warn?: boolean }) {
  return (
    <div className="rounded-control border border-vellum-100/10 bg-nave-800 px-3.5 py-3">
      <div className={`font-display text-2xl font-medium ${warn ? 'text-ember-600' : 'text-gilt-500'}`}>
        {n}
      </div>
      <div className="mt-0.5 font-body text-[11px] uppercase tracking-[0.14em] text-vellum-200/60">
        {label}
      </div>
    </div>
  );
}

function InventoryHeader({ inv }: { inv: Inventory }) {
  // Runway thresholds mirror SCALE_INVENTORY (warning 21 / critical 7).
  const runwayWarn = inv.runway < 21;
  const territoryEntries = Object.entries(inv.byTerritory).sort((a, b) => b[1] - a[1]);
  return (
    <section className="grid gap-4">
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
        <Stat n={inv.runway} label="Runway (days)" warn={runwayWarn} />
        <Stat n={inv.approved} label="Approved" />
        <Stat n={inv.scheduled} label="Scheduled" />
        <Stat n={inv.draft} label="Draft" />
        <Stat n={inv.published} label="Published" />
        <Stat n={inv.retired} label="Retired" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-panel border border-vellum-100/10 bg-nave-800 p-4">
          <h3 className="mb-2.5 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-vellum-200/60">
            Runway by territory
          </h3>
          {territoryEntries.length === 0 ? (
            <p className="font-body text-[13px] text-vellum-200/60">Nothing approved or scheduled.</p>
          ) : (
            <ul className="grid gap-1.5">
              {territoryEntries.map(([t, n]) => (
                <li key={t} className="flex items-center justify-between font-body text-[13px] text-vellum-100">
                  <span>{t}</span>
                  <span className="text-gilt-500">{n}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-panel border border-vellum-100/10 bg-nave-800 p-4">
          <h3 className="mb-2.5 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-vellum-200/60">
            Next 7 dated
          </h3>
          {inv.upcoming.length === 0 ? (
            <p className="font-body text-[13px] text-vellum-200/60">No scheduled or published dates ahead.</p>
          ) : (
            <ul className="grid gap-1.5">
              {inv.upcoming.map((u) => (
                <li key={u.date} className="flex items-center gap-2 font-body text-[13px] text-vellum-100">
                  <span className="w-[86px] flex-none text-vellum-200/70">{u.date}</span>
                  <StatusChip tone={STATUS_TONE[u.status] ?? 'outline'}>{u.status}</StatusChip>
                  <span className="truncate text-vellum-200/80">{u.question}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function AdminScalesPage() {
  const [scales, setScales] = useState<AdminScale[]>([]);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<null | { mode: 'create' } | { mode: 'edit'; id: string }>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Inventory is computed over the whole set, so always fetch unfiltered for
      // it; the table itself is filtered client-side.
      const data = await authFetch('/api/admin/scales');
      setScales(data.scales as AdminScale[]);
      setInventory(data.inventory as Inventory);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(
    () => (filter === 'all' ? scales : scales.filter((s) => s.status === filter)),
    [scales, filter],
  );
  const selected = useMemo(() => scales.find((s) => s.id === selectedId) ?? null, [scales, selectedId]);

  async function submitForm(form: FormState, approve: boolean) {
    setBusy(true);
    setFormError(null);
    try {
      if (editing?.mode === 'create') {
        await authFetch('/api/admin/scales', {
          method: 'POST',
          body: JSON.stringify({ ...form, status: approve ? 'approved' : 'draft' }),
        });
      } else if (editing?.mode === 'edit') {
        await authFetch(`/api/admin/scales/${editing.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ action: 'edit', patch: form }),
        });
      }
      setEditing(null);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Save failed.');
    } finally {
      setBusy(false);
    }
  }

  async function transition(id: string, action: 'approve' | 'retire') {
    if (action === 'retire' && !window.confirm('Retire this scale? It will leave the approved pool.')) return;
    setBusy(true);
    try {
      await authFetch(`/api/admin/scales/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1100px] px-5 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-medium text-vellum-100">Scale Admin</h1>
          <p className="mt-1 font-body text-[13.5px] text-vellum-200/60">
            Curate the Daily Scale pipeline. Manual scales enter as drafts — only the selector ever publishes.
          </p>
        </div>
        <GiltButton
          onClick={() => {
            setFormError(null);
            setEditing({ mode: 'create' });
            setSelectedId(null);
          }}
        >
          New scale
        </GiltButton>
      </header>

      {loading && <p className="font-body text-vellum-200/60">Loading…</p>}
      {error && <p className="mb-4 font-body text-[13.5px] text-ember-600">{error}</p>}

      {inventory && <InventoryHeader inv={inventory} />}

      {editing && (
        <div className="mt-6">
          <ScaleForm
            mode={editing.mode}
            initial={
              editing.mode === 'edit'
                ? formFrom(scales.find((s) => s.id === editing.id)!)
                : EMPTY_FORM
            }
            submitting={busy}
            error={formError}
            onCancel={() => setEditing(null)}
            onSubmit={submitForm}
          />
        </div>
      )}

      {/* filter chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-pill border px-3.5 py-1.5 font-body text-[12.5px] font-semibold capitalize transition-colors ${
              filter === f
                ? 'border-gilt-500 bg-gilt-500 text-nave-900'
                : 'border-vellum-100/15 text-vellum-200/70 hover:text-vellum-100'
            }`}
          >
            {f}
            {f !== 'all' && inventory ? ` · ${inventory[f as keyof Inventory] ?? 0}` : ''}
          </button>
        ))}
      </div>

      {/* table */}
      <div className="mt-3 overflow-x-auto rounded-panel border border-vellum-100/10">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-vellum-100/10 font-body text-[11px] uppercase tracking-[0.12em] text-vellum-200/50">
              <th className="px-3 py-2.5 font-semibold">Status</th>
              <th className="px-3 py-2.5 font-semibold">Date</th>
              <th className="px-3 py-2.5 font-semibold">Territory</th>
              <th className="px-3 py-2.5 font-semibold">Question</th>
              <th className="px-3 py-2.5 font-semibold">Source</th>
              <th className="px-3 py-2.5 text-right font-semibold">Votes</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center font-body text-[13.5px] text-vellum-200/50">
                  No scales for this filter.
                </td>
              </tr>
            )}
            {visible.map((s) => (
              <tr
                key={s.id}
                onClick={() => setSelectedId(selectedId === s.id ? null : s.id)}
                className={`cursor-pointer border-b border-vellum-100/[0.06] font-body text-[13px] text-vellum-100 transition-colors hover:bg-nave-800 ${
                  selectedId === s.id ? 'bg-nave-800' : ''
                }`}
              >
                <td className="px-3 py-2.5">
                  <StatusChip tone={STATUS_TONE[s.status] ?? 'outline'}>{s.status}</StatusChip>
                </td>
                <td className="px-3 py-2.5 text-vellum-200/70">{s.published_date ?? '—'}</td>
                <td className="px-3 py-2.5 text-vellum-200/70">{s.territory ?? 'untagged'}</td>
                <td className="max-w-[360px] truncate px-3 py-2.5">{s.question}</td>
                <td className="px-3 py-2.5 text-vellum-200/70">{s.source}</td>
                <td className="px-3 py-2.5 text-right text-vellum-200/70">
                  {(s.votes_a + s.votes_b).toLocaleString('en-US')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* detail */}
      {selected && (
        <div className="mt-5">
          <ScaleDetail
            scale={selected}
            busy={busy}
            onEdit={() => {
              setFormError(null);
              setEditing({ mode: 'edit', id: selected.id });
            }}
            onApprove={() => void transition(selected.id, 'approve')}
            onRetire={() => void transition(selected.id, 'retire')}
          />
        </div>
      )}
    </main>
  );
}
