'use client';

import { useState } from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter Workshop',
      tagline: 'Ideal for small box makers and single-line converting units.',
      monthlyPrice: 49,
      annualPrice: 39,
      badge: null,
      highlight: false,
      features: [
        'Up to 500 Active Job Cards / mo',
        '1 Packaging Plant / Corrugator Line',
        'Standard A4 Printable Job Tickets',
        'Up to 25 Client Profiles & Specs',
        'Automatic Cutting & Decal Math',
        'Email & Community Support',
      ],
      ctaText: 'Start 14-Day Free Trial',
      ctaHref: '/login',
    },
    {
      name: 'Pro Packaging Plant',
      tagline: 'For integrated corrugated factories and growing box producers.',
      monthlyPrice: 149,
      annualPrice: 119,
      badge: 'MOST POPULAR FOR PLANTS',
      highlight: true,
      features: [
        'Unlimited Job Cards Every Month',
        'Full 9-Stage Shop Floor Pipeline',
        'Unlimited Client & Industry Profiles',
        'Ready Batch & Vehicle Dispatch Tracking',
        'Tablet & Touchscreen UI for Operators',
        'Duplicate & Re-order in 1 Click',
        'Operator Checklists & QC Warnings',
        'Priority Phone & WhatsApp Plant Support',
      ],
      ctaText: 'Deploy Pro Plant Today',
      ctaHref: '/login',
    },
    {
      name: 'Enterprise Corrugator',
      tagline: 'For multi-plant packaging conglomerates and paper mills.',
      monthlyPrice: 399,
      annualPrice: 319,
      badge: 'MULTI-PLANT NETWORK',
      highlight: false,
      features: [
        'Unlimited Multi-Factory Sites',
        'Custom Flute Take-up & GSM Math Formulas',
        'ERP / SAP / Tally Accounting API Sync',
        'Dedicated Cloud Database & Isolation',
        'Role-Based Operator & Plant Manager Access',
        'Custom A4 Ticket Layout Branding',
        'On-site Machine Operator Training',
        '99.9% Uptime Guarantee & 24/7 SLA',
      ],
      ctaText: 'Contact Enterprise Sales',
      ctaHref: '/login',
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-kraft-lighter/40 relative border-t border-kraft-dark/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kraft border border-kraft-dark/30 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-industrial" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-industrial">
              TRANSPARENT PLANT PRICING
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-industrial tracking-tight">
            Simple, Predictable Plans for Any Box Plant
          </h2>
          <p className="text-base sm:text-lg text-industrial/70 font-medium">
            No hidden per-operator penalties. Pick the plan that matches your monthly output and scale as your corrugated corrugator lines expand.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={`text-sm font-bold ${!isAnnual ? 'text-industrial' : 'text-industrial/50'}`}>
              Monthly Billing
            </span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 bg-industrial rounded-full p-1 transition-colors cursor-pointer relative"
              aria-label="Toggle Annual Billing"
            >
              <div
                className={`w-6 h-6 bg-yellow-400 rounded-full shadow-md transform transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-bold flex items-center gap-1.5 ${isAnnual ? 'text-industrial' : 'text-industrial/50'}`}>
              <span>Annual Billing</span>
              <span className="text-[10px] uppercase font-mono font-black bg-green-600 text-white px-2 py-0.5 rounded-full">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div
                key={idx}
                className={`rounded-xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.highlight
                    ? 'bg-white border-4 border-industrial shadow-xl ring-2 ring-kraft-dark/30 scale-105 z-10'
                    : 'bg-white border-2 border-kraft-dark/25 shadow-sm hover:border-kraft-dark/50'
                }`}
              >
                {/* Popular Pill */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-industrial text-yellow-400 border border-yellow-400 font-mono font-bold text-[10px] uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Name & Tagline */}
                  <div>
                    <h3 className="text-2xl font-black text-industrial tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-xs font-semibold text-industrial/60 mt-1.5 min-h-[32px]">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="border-y border-kraft-dark/15 py-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black font-mono text-industrial">
                        ${price}
                      </span>
                      <span className="text-sm font-bold text-industrial/60 font-mono">
                        / plant / month
                      </span>
                    </div>
                    <p className="text-[11px] text-industrial/50 mt-1">
                      {isAnnual ? 'Billed annually ($' + price * 12 + '/yr)' : 'Billed monthly, cancel anytime'}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-industrial/50">
                      What&apos;s Included:
                    </p>
                    <ul className="space-y-2.5 text-sm text-industrial/85 font-medium">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5 stroke-[2.5]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="pt-8">
                  <Link href={plan.ctaHref} className="w-full block">
                    <Button
                      size="lg"
                      className={`w-full font-bold text-sm h-12 shadow-sm flex items-center justify-center gap-2 ${
                        plan.highlight
                          ? 'bg-industrial hover:bg-industrial/90 text-kraft-lighter'
                          : 'bg-kraft-dark hover:bg-kraft-dark/90 text-white'
                      }`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <p className="text-[10px] text-center text-industrial/50 mt-2">
                    14-day full access trial • No credit card required
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
