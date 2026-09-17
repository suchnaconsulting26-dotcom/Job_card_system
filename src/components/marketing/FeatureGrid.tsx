'use client';

import {
  Layers,
  Building2,
  Activity,
  Printer,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  {
    icon: Layers,
    badge: 'AUTOMATED MATH',
    title: 'Smart Cutting & Decal Engine',
    description:
      'Eliminate manual calculation errors. Enter internal carton dimensions, and our algorithms instantly compute cutting sheet size, joint flap allowances, and optimal reel decal size.',
    bullets: ['Flute take-up ratio factor', 'Joint flap allowances', 'Trimming scrap reduction'],
  },
  {
    icon: Building2,
    badge: 'CLIENT CATALOG',
    title: 'Industry Master Specs Vault',
    description:
      'Store pre-approved carton blueprints categorized by industry client. Never re-measure a repeat order—populate complete paper GSM, ply, and printing recipes with one click.',
    bullets: ['Client item code linking', 'Approved stereo & die numbers', 'Repeat order revalidation'],
  },
  {
    icon: Activity,
    badge: 'FLOOR WORKFLOW',
    title: '9-Stage Machine Floor Sync',
    description:
      'Keep production moving smoothly. From single facer corrugation to final PP strapping, foremen and operators have instant visibility on job status and bottlenecks.',
    bullets: ['Real-time status pills', 'Stage completion tracking', 'Immediate defect isolation'],
  },
  {
    icon: Printer,
    badge: 'STANDARD PRINTOUT',
    title: 'Dust-Resistant A4 Print Tickets',
    description:
      'Engineered specifically for manufacturing floors. Generates crisp, high-contrast A4 half-page job cards with bold numbers that operators can read from across the machine line.',
    bullets: ['Half-page paper saving layout', 'Physical operator sign-off boxes', 'Laser & thermal printer ready'],
  },
  {
    icon: Truck,
    badge: 'DISPATCH CONTROL',
    title: 'Ready Batch & Vehicle Tracking',
    description:
      'Coordinate staging and logistics seamlessly. Record ready pallet counts, vehicle registration numbers, and scheduled delivery dates to prevent shipping disputes.',
    bullets: ['Partial batch dispatch tracking', 'Vehicle registration tagging', 'Delivery date commitments'],
  },
  {
    icon: ShieldCheck,
    badge: 'ENTERPRISE CLOUD',
    title: 'Supabase Real-Time Cloud Engine',
    description:
      'Built on modern PostgreSQL and Supabase SSR. Experience instant synchronization between office sales, plant floor tablets, and warehouse dispatch without local server headaches.',
    bullets: ['Zero data loss architecture', 'Secure team authentication', 'Instant multi-device sync'],
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-20 bg-white relative border-t border-kraft-dark/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kraft border border-kraft-dark/30 shadow-xs">
            <Sparkles className="w-4 h-4 text-industrial" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-industrial">
              BUILT FOR PACKAGING PLANTS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-industrial tracking-tight">
            Engineered for Corrugators. Perfected for Operators.
          </h2>
          <p className="text-base sm:text-lg text-industrial/70 font-medium">
            Generic ERP systems are too bloated, and paper registers lead to ruined runs. The Job Card System delivers focused, rugged tooling tailored to corrugated packaging.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-kraft-lighter/40 rounded-xl border border-kraft-dark/20 p-6 sm:p-7 hover:shadow-lg hover:border-kraft-dark/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Subtle paper grain texture */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]" />

                <div className="relative z-10 space-y-4">
                  {/* Top Bar: Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-industrial text-kraft-lighter flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-kraft-light" />
                    </div>
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-kraft text-industrial px-2.5 py-1 rounded border border-kraft-dark/25">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl font-bold text-industrial tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-industrial/70 font-medium mt-2 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Key Benefits List */}
                  <ul className="space-y-2 pt-2 border-t border-kraft-dark/15 text-xs font-semibold text-industrial/80">
                    {feature.bullets.map((b, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-700 flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer Link */}
                <div className="pt-6 relative z-10">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 group-hover:text-blue-700 transition-colors"
                  >
                    <span>Explore in software</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
