'use client';

import { useState, useEffect } from 'react';

// ── Static branding helpers ────────────────────────────────────────────────

function CrossIcon({ size = 28, color = '#C8A45E' }: { size?: number; color?: string }) {
  const arm = size / 2;
  const th = size / 8;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <rect x={arm - th} y={0} width={th * 2} height={size} fill={color} rx={th} />
      <rect x={0} y={arm * 0.7 - th} width={size} height={th * 2} fill={color} rx={th} />
    </svg>
  );
}

// ── What gets deleted ──────────────────────────────────────────────────────

const DELETED_ITEMS = [
  'All discernment sessions and AI-generated responses',
  'Your spiritual journal and all Ebenezer stones',
  'Prayer history and follow-up entries',
  'Stillness session records',
  'Daily Scale votes and history',
  'Subscription and billing records',
  'Push notification tokens',
  'Profile information and account credentials',
];

// ── Page component ─────────────────────────────────────────────────────────

type Step = 'form' | 'confirm' | 'sent' | 'error';

export default function DeleteAccountPage() {
  const [step, setStep] = useState<Step>('form');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle redirects back from the confirmation link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('deleted') === 'true') {
      setStep('sent');
    } else if (params.get('error')) {
      const code = params.get('error');
      const messages: Record<string, string> = {
        invalid_token: 'This deletion link has expired or is invalid. Please submit a new request.',
        missing_token: 'This link is missing the required token. Please submit a new request.',
        delete_failed: 'An error occurred while deleting your account. Please contact support@biblediscern.app.',
      };
      setErrorMsg(messages[code ?? ''] ?? 'Something went wrong. Please try again.');
      setStep('error');
    }
  }, []);

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setStep('confirm');
  }

  async function handleConfirm() {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message ?? 'Something went wrong. Please try again.');
        setStep('error');
      } else {
        setStep('sent');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF6EC' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#1B2A4A' }} className="py-6 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-1">
          <CrossIcon size={28} color="#C8A45E" />
          <span style={{ color: '#C8A45E', fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.02em' }}>
            BibleDiscern
          </span>
        </div>
        <p style={{ color: 'rgba(253,246,236,0.5)', fontSize: '0.75rem' }}>
          Weigh it with wisdom.
        </p>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-xl px-4 py-12">

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 style={{ color: '#1B2A4A', fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '2rem' }} className="mb-2">
            Delete Your Account
          </h1>
          <p style={{ color: '#5C5144', fontSize: '1.05rem' }}>
            We're sorry to see you go.
          </p>
        </div>

        {/* Warning box */}
        <div style={{ background: '#fff8f0', border: '1px solid #e8c89a', borderRadius: '12px', padding: '20px 24px' }} className="mb-8">
          <p style={{ color: '#8B3A00', fontWeight: 600, marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
            ⚠ This action cannot be undone.
          </p>
          <p style={{ color: '#5C5144', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Your spiritual journal and all Ebenezer stones will be permanently deleted.
            Nothing is kept — all data is removed immediately and cannot be recovered.
          </p>
        </div>

        {/* What gets deleted */}
        <div className="mb-10">
          <h2 style={{ color: '#1B2A4A', fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '12px' }}>
            What will be permanently deleted:
          </h2>
          <ul className="space-y-2">
            {DELETED_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span style={{ color: '#C8A45E', fontWeight: 700, marginTop: '2px', flexShrink: 0 }}>✕</span>
                <span style={{ color: '#5C5144', fontSize: '0.95rem' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── STEP: FORM ── */}
        {step === 'form' && (
          <form onSubmit={handleRequest}>
            <label style={{ display: 'block', color: '#1B2A4A', fontWeight: 600, marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
              Enter your account email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid #d0c4b0',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: '#fff',
                color: '#1B2A4A',
                outline: 'none',
                marginBottom: '16px',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#C8A45E',
                color: '#1B2A4A',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1rem',
                fontFamily: 'Georgia, serif',
                cursor: 'pointer',
              }}
            >
              Request Account Deletion
            </button>
          </form>
        )}

        {/* ── STEP: CONFIRM ── */}
        {step === 'confirm' && (
          <div style={{ border: '2px solid #C8A45E', borderRadius: '12px', padding: '24px', background: '#fff' }}>
            <h2 style={{ color: '#1B2A4A', fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.2rem', marginBottom: '8px' }}>
              Are you sure?
            </h2>
            <p style={{ color: '#5C5144', marginBottom: '6px', fontSize: '0.95rem' }}>
              You are requesting deletion of the account associated with:
            </p>
            <p style={{ color: '#1B2A4A', fontWeight: 700, marginBottom: '20px', wordBreak: 'break-all' }}>{email}</p>
            <p style={{ color: '#5C5144', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.6' }}>
              We will send a confirmation link to this email. Your account will only be deleted
              after you click the link. The link expires in 24 hours.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setStep('form')}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1.5px solid #d0c4b0',
                  borderRadius: '8px',
                  background: '#fff',
                  color: '#5C5144',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  borderRadius: '8px',
                  background: '#8B3A00',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Sending…' : 'Yes, Delete My Account'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: SENT ── */}
        {step === 'sent' && (
          <div style={{ textAlign: 'center', padding: '24px', border: '1px solid #b8d8b0', borderRadius: '12px', background: '#f0faf0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
              {new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('deleted') === 'true' ? '✅' : '✉️'}
            </div>
            <h2 style={{ color: '#1B2A4A', fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.2rem', marginBottom: '8px' }}>
              {new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('deleted') === 'true'
                ? 'Account Deleted'
                : 'Check your email'}
            </h2>
            <p style={{ color: '#3A6B35', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('deleted') === 'true'
                ? 'Your account and all associated data have been permanently deleted. We\'re grateful for the time you spent weighing what matters.'
                : <>A confirmation link has been sent to <strong>{email}</strong>. Your account will be deleted after you click the link. The link expires in 24 hours.</>}
            </p>
          </div>
        )}

        {/* ── STEP: ERROR ── */}
        {step === 'error' && (
          <div style={{ padding: '20px 24px', border: '1px solid #e8a0a0', borderRadius: '12px', background: '#fff5f5' }}>
            <p style={{ color: '#8B0000', fontWeight: 600, marginBottom: '8px' }}>Something went wrong</p>
            <p style={{ color: '#5C5144', fontSize: '0.9rem', marginBottom: '16px' }}>{errorMsg}</p>
            <button
              onClick={() => setStep('form')}
              style={{
                padding: '10px 20px',
                border: '1.5px solid #d0c4b0',
                borderRadius: '8px',
                background: '#fff',
                color: '#1B2A4A',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Footer note */}
        <p style={{ color: '#8A7F72', fontSize: '0.85rem', textAlign: 'center', marginTop: '40px' }}>
          If you're having trouble, contact{' '}
          <a href="mailto:support@biblediscern.app" style={{ color: '#C8A45E', textDecoration: 'underline' }}>
            support@biblediscern.app
          </a>
        </p>
      </main>
    </div>
  );
}
