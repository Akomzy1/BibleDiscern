'use client';

import { useState } from 'react';
import { APP_STORE_URL } from '@/lib/seo';

export function BillingToggle() {
  const [yearly, setYearly] = useState(true);

  return (
    <div className="space-y-3">
      {/* Monthly / Yearly selector */}
      <div className="flex gap-2">
        {/* Monthly */}
        <button
          onClick={() => setYearly(false)}
          className={`flex-1 rounded-xl border p-3 text-left transition-all ${
            !yearly ? 'border-gold bg-gold/10' : 'border-border bg-white'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-navy text-sm">Monthly</p>
              <p className="text-navy font-bold text-lg leading-tight mt-0.5">
                $7.99<span className="text-xs font-normal text-text-light">/month</span>
              </p>
            </div>
            {/* Radio indicator */}
            <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
              !yearly ? 'border-gold bg-gold text-navy text-[10px] font-bold' : 'border-border bg-white'
            }`}>
              {!yearly && '✓'}
            </div>
          </div>
        </button>

        {/* Yearly */}
        <button
          onClick={() => setYearly(true)}
          className={`flex-1 rounded-xl border-2 p-3 text-left relative transition-all ${
            yearly ? 'border-gold bg-gold/10' : 'border-border bg-white'
          }`}
        >
          {/* SAVE badge — always visible on yearly card */}
          <div className="absolute -top-2.5 left-3 bg-gold text-navy text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            SAVE 48%
          </div>
          <div className="flex items-start justify-between gap-2 mt-1">
            <div>
              <p className="font-semibold text-navy text-sm">Yearly</p>
              <p className="text-navy font-bold text-lg leading-tight mt-0.5">
                $49.99<span className="text-xs font-normal text-text-light">/year</span>
              </p>
              {/* Strikethrough full-year cost if paid monthly */}
              <p className="text-text-light text-xs line-through leading-tight">($95.88)</p>
            </div>
            {/* Checkmark indicator */}
            <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
              yearly ? 'border-gold bg-gold text-navy text-[10px] font-bold' : 'border-border bg-white'
            }`}>
              {yearly && '✓'}
            </div>
          </div>
        </button>
      </div>

      {/* Sub-label */}
      <p className="text-xs text-text-light text-center">
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
