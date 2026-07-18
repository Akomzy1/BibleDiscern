'use client';

// Dev-only specimen sheet: every Selah token and primitive, for side-by-side
// comparison with the Foundations prototype frame (docs/prototypes/foundations.html).

import { useState } from 'react';
import { color, motion as motionTokens } from '@librato/shared';
import {
  Beam,
  type BeamTilt,
  ScriptureBlock,
  Panel,
  CandleGlow,
  Eyebrow,
  GiltButton,
  SideBadge,
  TabBar,
  TextField,
  TextArea,
} from '@/components/selah';

const SWATCHES = Object.entries(color) as [string, string][];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <Eyebrow>{title}</Eyebrow>
      {children}
    </section>
  );
}

export default function FoundationsPage() {
  const [tilt, setTilt] = useState<BeamTilt>('rest');
  const [sway, setSway] = useState(false);
  const [stone, setStone] = useState(false);

  return (
    <main className="min-h-screen bg-nave-900 pb-32">
      <div className="mx-auto max-w-[640px] space-y-12 px-5 py-10">
        <header className="space-y-2">
          <Eyebrow>Selah Foundations</Eyebrow>
          <h1 className="font-display text-3xl text-vellum-100">Token &amp; primitive specimens</h1>
          <p className="font-body text-vellum-200/80">
            Compare each block against the Foundations sheet. Dev route — not linked from the app.
          </p>
        </header>

        <Section title="Color tokens">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {SWATCHES.map(([name, hex]) => (
              <div key={name} className="overflow-hidden rounded-panel border border-gilt-edge">
                <div className="h-14" style={{ background: hex }} />
                <div className="bg-nave-800 px-3 py-2">
                  <p className="font-body text-xs font-semibold text-vellum-100">{name}</p>
                  <p className="font-body text-[11px] uppercase text-gilt-300/60">{hex}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Typography">
          <div className="space-y-4">
            <h2 className="font-display text-[clamp(2.2rem,6vw,3.4rem)] leading-[1.15] text-vellum-100">
              Weigh it with wisdom
            </h2>
            <p className="font-scripture text-[1.35rem] italic leading-[1.5] text-vellum-200">
              Is it wiser to wait for full clarity, or to step out in faith with what you know?
            </p>
            <p className="font-body text-base leading-[1.6] text-vellum-200/90">
              Source Sans 3 carries all UI and body copy at 1rem/1.6. Buttons use the semibold weight.
            </p>
            <Eyebrow>Eyebrow · gilt on navy · 0.18em</Eyebrow>
          </div>
        </Section>

        <Section title="The Beam">
          <Panel tone="navy" className="relative space-y-6 p-6">
            <Beam tilt={tilt} sway={sway} stone={stone} />
            <div className="flex flex-wrap gap-2">
              {(['rest', 'left', 'right'] as const).map((t) => (
                <GiltButton
                  key={t}
                  variant={tilt === t ? 'primary' : 'secondary'}
                  onClick={() => setTilt(t)}
                >
                  {t}
                </GiltButton>
              ))}
              <GiltButton variant={sway ? 'primary' : 'secondary'} onClick={() => setSway(!sway)}>
                sway
              </GiltButton>
              <GiltButton
                variant={stone ? 'primary' : 'secondary'}
                onClick={() => {
                  setStone(false);
                  requestAnimationFrame(() => requestAnimationFrame(() => setStone(true)));
                }}
              >
                stone
              </GiltButton>
            </div>
          </Panel>
        </Section>

        <Section title="Illuminated capital">
          <Panel className="p-6">
            <ScriptureBlock>
              Trust in the LORD with all your heart, and do not lean on your own understanding. In
              all your ways acknowledge him, and he will make straight your paths.
            </ScriptureBlock>
            <p className="mt-3 font-body text-sm text-ink-500">— Proverbs 3:5–6</p>
          </Panel>
        </Section>

        <Section title="Panels & texture">
          <div className="space-y-4">
            <Panel className="p-6">
              <Eyebrow on="vellum" className="mb-2">
                Vellum panel
              </Eyebrow>
              <p className="font-body text-ink-900">
                Grain at 2.5%, radius 14, ink text. A lit page inside the nave.
              </p>
            </Panel>
            <Panel tone="navy" className="p-6">
              <Eyebrow className="mb-2">Navy panel</Eyebrow>
              <p className="font-body text-vellum-200/90">
                12% gilt border, gold-tinted glow shadow — never gray.
              </p>
            </Panel>
            <div className="relative overflow-hidden rounded-panel border border-gilt-edge bg-nave-950 p-10">
              <CandleGlow />
              <p className="relative text-center font-scripture italic text-gilt-300">
                One candle glow per immersive screen, ≤6%.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Gilt buttons">
          <div className="flex flex-wrap items-center gap-3">
            <GiltButton>Primary</GiltButton>
            <GiltButton variant="secondary">Secondary</GiltButton>
            <GiltButton variant="link">Text link</GiltButton>
            <GiltButton disabled>Disabled</GiltButton>
          </div>
        </Section>

        <Section title="Side badges">
          <div className="flex items-center gap-4">
            <SideBadge side="a" />
            <SideBadge side="b" />
          </div>
        </Section>

        <Section title="Form fields">
          <div className="space-y-4">
            <TextField label="Default field" placeholder="Type something…" />
            <TextField
              label="Error field"
              defaultValue="An answer that failed"
              error="We couldn't reach the server. Your words are saved — try again in a moment."
            />
            <TextArea label="Textarea" placeholder="What's weighing on you?" rows={3} />
          </div>
        </Section>

        <Section title="Motion tokens">
          <Panel tone="navy" className="p-6">
            <ul className="space-y-1 font-body text-sm text-vellum-200/90">
              <li>ease-selah · {motionTokens.easeSelah}</li>
              <li>whisper · {motionTokens.durWhisper}ms — hovers, focus, small reveals</li>
              <li>settle · {motionTokens.durSettle}ms — beam settle, card commit</li>
              <li>breath · {motionTokens.durBreath}ms — page transitions, fade + 8px rise</li>
            </ul>
          </Panel>
        </Section>
      </div>

      <TabBar />
    </main>
  );
}
