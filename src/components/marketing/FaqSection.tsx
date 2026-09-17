'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'What printer hardware is required for the shop floor?',
    a: 'Any standard office laser printer, inkjet, or continuous feed thermal/dot-matrix printer that supports A4 paper works out of the box. Our layout is formatted specifically to print two complete, millimeter-accurate job cards per A4 sheet (or one card on half-page), saving 50% on paper costs while maintaining large, legible fonts for operators.',
  },
  {
    q: 'Can machine operators use rugged tablets or smartphones on the floor?',
    a: 'Yes! The entire Job Card System is responsive and optimized for touchscreen devices. Supervisors and operators can mount affordable 10-inch Android or iPad tablets directly near the corrugator, flexo printer, or stitching machines to update job status with large tap targets.',
  },
  {
    q: 'How does the software calculate Cutting Size and Decal Roll size?',
    a: 'Our calculation engine uses standardized corrugator mathematics: Cutting Length is computed as 2 × (L + W) plus calibrated flap and manufacturer joint allowances (35mm standard). Cutting Width combines panel height and top/bottom flap allowances. Decal size automatically maps to standard paper mill roll widths in inches (e.g. 48", 52", 56", 60") to eliminate edge trim waste.',
  },
  {
    q: 'Does the system support 3-Ply, 5-Ply, and 7-Ply board combinations?',
    a: 'Absolutely. You can specify any combination of 3-Ply (Single Wall), 5-Ply (Double Wall), and 7-Ply (Triple Wall / Heavy Duty) boards, along with flute profiles (B-Flute, C-Flute, E-Flute, and BC combinations). Paper GSM recipes from 100 GSM to 350 GSM can be configured freely.',
  },
  {
    q: 'Can we store pre-approved carton designs for our repeat clients?',
    a: 'Yes. Our "Industries" and Client Master Catalog allows you to register client companies (e.g., Pharma, FMCG, Agro Exporters) and attach pre-approved item specifications with cutting sizes, stereo codes, and GSM combinations. When a repeat order arrives, simply select the client item and the entire job ticket populates in 1 second.',
  },
  {
    q: 'How secure is our production, client, and order data?',
    a: 'Your data is hosted in encrypted cloud infrastructure powered by Supabase with Row Level Security (RLS) and automated daily backups. Only authorized members of your company can access your plant metrics and client specifications.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-kraft-lighter/50 relative border-t border-kraft-dark/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kraft border border-kraft-dark/30 shadow-xs">
            <HelpCircle className="w-4 h-4 text-industrial" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-industrial">
              COMMON QUESTIONS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-industrial tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-industrial/70 font-medium">
            Everything you need to know about implementing the Job Card System on your corrugated plant floor.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-lg border border-kraft-dark/25 shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-kraft-lighter/20"
                >
                  <span className="text-base font-bold text-industrial tracking-tight">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-industrial/60 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-industrial' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-sm font-medium text-industrial/75 leading-relaxed border-t border-kraft-dark/15 pt-4 bg-kraft-lighter/20">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
