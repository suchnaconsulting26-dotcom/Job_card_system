'use client';

import { Star, Building2, Quote, CheckCircle2 } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      'Before the Job Card System, our supervisors spent 2 hours every morning hand-writing paper tickets and arguing over cutting sizes. Now, cutting dimensions and reel decal sizes are generated in 5 seconds. We saved 6 tons of edge trim scrap in our very first month.',
    author: 'Sunil R. Patel',
    role: 'Managing Director',
    company: 'Shree Balaji Corrugators & Packaging (3-Line Plant, Gujarat)',
    impact: 'Saved 6 Tons Paper Scrap / Month',
    rating: 5,
  },
  {
    quote:
      'The A4 half-page printout is pure gold on the shop floor. Corrugator operators, flexo printers, and stitchers all have the exact technical blueprint they need. In 6 months, we haven&apos;t had a single misprinted box or dimension dispute with our pharma clients.',
    author: 'Rajiv Sengupta',
    role: 'Head of Quality & Production',
    company: 'Eastern Pack Converters (Kolkata & Cuttack)',
    impact: 'Zero Quality Claims in 6 Months',
    rating: 5,
  },
  {
    quote:
      'Tracking ready quantities and vehicle numbers right on the job card solved our dispatch gate bottlenecks. Our truck drivers no longer sit waiting for gate passes—the warehouse knows exactly which pallets are bundled and ready.',
    author: 'Harpreet Singh',
    role: 'Operations & Dispatch Foreman',
    company: 'Doaba Box Works (Ludhiana Industrial Area)',
    impact: 'Same-Day Dispatch Turnaround',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white relative border-t border-kraft-dark/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kraft border border-kraft-dark/30 shadow-xs">
            <Quote className="w-4 h-4 text-industrial" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-industrial">
              TESTED ON REAL FACTORY FLOORS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-industrial tracking-tight">
            Trusted by Packaging Plant Leaders
          </h2>
          <p className="text-base sm:text-lg text-industrial/70 font-medium">
            Over 500,000 corrugated cartons have moved through our system. Read why plant owners, supervisors, and machine operators prefer it over cumbersome legacy software.
          </p>
        </div>

        {/* 3 Testimonial Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-kraft-lighter/40 rounded-xl border border-kraft-dark/20 p-8 flex flex-col justify-between hover:shadow-lg hover:border-kraft-dark/40 transition-all duration-300 relative overflow-hidden"
            >
              {/* Paper texture overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]" />

              <div className="relative z-10 space-y-4">
                {/* Rating Stars & Impact Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-green-100 text-green-800 px-2.5 py-0.5 rounded border border-green-300">
                    {t.impact}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-sm font-medium text-industrial/85 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author & Plant Info */}
              <div className="relative z-10 pt-6 mt-6 border-t border-kraft-dark/15 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-industrial text-kraft-lighter font-bold flex items-center justify-center font-mono text-sm flex-shrink-0">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-industrial leading-tight">
                    {t.author}
                  </h4>
                  <p className="text-xs font-semibold text-industrial/60">
                    {t.role}
                  </p>
                  <p className="text-[11px] text-industrial/50 mt-0.5">
                    {t.company}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
