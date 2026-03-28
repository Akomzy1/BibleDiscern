'use client';

import { useState } from 'react';
import { APP_STORE_URL } from '@/lib/seo';

export function BillingToggle() {
  const [yearly, setYearly] = useState(true);

  return (
    <div className="space-y-4">
      {/* Monthly / Yearly selector */}
      <div className="flex gap-3">
        {/* Monthly */}
        <button
          onClick={() => setYearly(false)}
          className={`flex-1 rounded-2xl border-2 p-4 text-left transition-all ${
            !yearly ? 'border-gold bg-gold/10' : 'border-border bg-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-navy text-sm">Monthly</p>
              <p className="text-navy font-bold text-xl mt-0.5">
                $7.99<span className="text-sm font-normal text-text-light">/month</span>
              </p>
            </div>
            {!yearly && (
              <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center text-navy text-[11px] font-bold shrink-0 mt-0.5">
                ✓
              </div>
            )}
          </div>
        </button>

        {/* Yearly */}
        <button
          onClick={() => setYearly(true)}
          className={`flex-1 rounded-2xl border-2 p-4 text-left relative transition-all ${
            yearly ? 'border-gold bg-gold/10' : 'border-border bg-white'
          }`}
        >
          {yearly && (
            <div className="absolute -top-3 right-3 bg-gold text-navy text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              SAVE 48%
            </div>
          )}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-navy text-sm">Yearly</p>
              <p className="text-navy font-bold text-xl mt-0.5">
                $49.99<span className="text-sm font-normal text-text-light">/year</span>
              </p>
            </div>
            {yearly && (
              <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center text-navy text-[11px] font-bold shrink-0 mt-0.5">
                ✓
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Sub-label */}
      <p className="text-sm text-text-medium text-center">
        {yearly
          ? 'Just $4.17/mo — save 48% vs monthly'
          : 'Or save 48% with annual billing'}
      </p>

      {/* CTA */}
      <a
        href={APP_STORE_URL}
        className="block text-center py-3 rounded-full bg-gold text-navy font-bold text-sm hover:bg-gold-muted transition-colors"
      >
        Start 7-Day Free Trial
      </a>
      <p className="text-center text-xs text-text-light">No credit card required · Cancel anytime</p>
    </div>
  );
}
