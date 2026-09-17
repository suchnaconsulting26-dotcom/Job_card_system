'use client';

import { useState } from 'react';
import {
  Package,
  Truck,
  Apple,
  ShoppingBag,
  HeartPulse,
  Wrench,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const INDUSTRIES = [
  {
    id: 'ecommerce',
    title: 'E-Commerce & Logistics',
    icon: ShoppingBag,
    summary: 'High-speed 3-Ply mailers and standard shipper cartons optimized for volume throughput.',
    specHighlights: [
      '3-Ply B-Flute (3mm) with high puncture resistance',
      'Pre-calculated adhesive peel & seal tape allowances',
      'Grade A barcode flexo printing for automated sorting',
      'Bursting strength: 10-12 kg/cm²',
    ],
    sampleCarton: 'Amazon / Flipkart Approved Shipper',
    typicalGsm: '140 Top Kraft / 120 Flute / 140 Test Liner',
  },
  {
    id: 'heavy-industrial',
    title: 'Heavy Machinery & Auto Parts',
    icon: Wrench,
    summary: 'Extreme duty 5-Ply & 7-Ply triple-wall packaging engineered for stackability and export.',
    specHighlights: [
      '7-Ply Triple Wall (A+B+C Flute combination)',
      'Heavy wire stitched joints with reinforced staples',
      'Stacking strength supporting up to 850 kg payload',
      'Moisture-resistant kraft top with high Cobb value',
    ],
    sampleCarton: 'Transmission & Gearbox Export Shipper',
    typicalGsm: '250 Virgin Golden Kraft / 180 Flute x 3 / 200 Liners',
  },
  {
    id: 'agro-produce',
    title: 'Agro & Fresh Produce Trays',
    icon: Apple,
    summary: 'Ventilated moisture-proof cartons with die-cut handles designed for cold-chain storage.',
    specHighlights: [
      '5-Ply C+B Flute with water-resistant starch bonding',
      'Automated die-cut ventilation slots for air circulation',
      'Corner-reinforced stackable self-locking tray designs',
      'Food-grade odor-free paper reel recipes',
    ],
    sampleCarton: '10 KG Fresh Mango / Grape Export Tray',
    typicalGsm: '200 Virgin Kraft / 160 High BF Flute / 180 Kraft',
  },
  {
    id: 'food-fmcg',
    title: 'Food, Beverage & FMCG',
    icon: Package,
    summary: 'Vibrant flexo-printed secondary cartons and shelf-ready retail display packaging.',
    specHighlights: [
      '3-Ply & 5-Ply precision rotary scored cartons',
      'Multi-color flexographic ink impression with varnish',
      'Easy-open tear tape perforations for grocery shelves',
      'Exact flap clearance for automated case-packers',
    ],
    sampleCarton: '24-Pack Biscuit / Snack Master Shipper',
    typicalGsm: '180 Bleached White Kraft / 140 Flute / 140 Liner',
  },
  {
    id: 'pharma',
    title: 'Pharmaceuticals & Medical',
    icon: HeartPulse,
    summary: 'Micro-flute secondary cartons with strict batch traceability and cleanroom specifications.',
    specHighlights: [
      'Micro-flute E-Flute (1.5mm) for high graphic fidelity',
      'Tamper-evident closure glue flaps',
      'Lot number and expiry date reverse printing panels',
      'Complete batch history and vehicle dispatch audits',
    ],
    sampleCarton: 'Vial Secondary Shipper & Insulation Outer',
    typicalGsm: '230 Duplex Laminated Board / 120 E-Flute / 140 Kraft',
  },
];

export function IndustrySolutions() {
  const [activeTab, setActiveTab] = useState<string>('ecommerce');
  const currentIndustry = INDUSTRIES.find((i) => i.id === activeTab) || INDUSTRIES[0];
  const Icon = currentIndustry.icon;

  const createParams = new URLSearchParams({
    partyName: currentIndustry.title,
    boxName: currentIndustry.sampleCarton,
    gsm: currentIndustry.typicalGsm,
    from: 'solutions'
  }).toString();

  return (
    <section id="solutions" className="py-20 bg-kraft-lighter/40 relative border-t border-kraft-dark/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kraft border border-kraft-dark/30 shadow-xs">
            <Package className="w-4 h-4 text-industrial" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-industrial">
              SECTOR SOLUTIONS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-industrial tracking-tight">
            Tailored for Every Corrugated Box Category
          </h2>
          <p className="text-base sm:text-lg text-industrial/70 font-medium">
            Whether you manufacture high-speed e-commerce mailers, export fruit trays, or 7-ply heavy industrial shippers, the Job Card System includes industry-specific presets.
          </p>
        </div>

        {/* Tab Buttons Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {INDUSTRIES.map((ind) => {
            const isSelected = activeTab === ind.id;
            const TabIcon = ind.icon;
            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => setActiveTab(ind.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-industrial text-kraft-lighter border-industrial shadow-sm scale-105'
                    : 'bg-white text-industrial/70 border-kraft-dark/20 hover:bg-kraft/40 hover:text-industrial'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{ind.title.split('&')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Industry Card Showcase */}
        <div className="bg-white rounded-xl border-2 border-industrial shadow-lg p-6 sm:p-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Spec Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-kraft text-industrial flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-industrial/50 font-bold">
                    PACKAGING VERTICAL
                  </span>
                  <h3 className="text-2xl font-black text-industrial tracking-tight">
                    {currentIndustry.title}
                  </h3>
                </div>
              </div>

              <p className="text-base text-industrial/80 font-medium leading-relaxed">
                {currentIndustry.summary}
              </p>

              <div className="space-y-3 pt-2 border-t border-kraft-dark/15">
                <h4 className="text-xs font-bold uppercase tracking-wider text-industrial/50">
                  Pre-Configured Plant Standards:
                </h4>
                <ul className="space-y-2.5 text-sm text-industrial/85 font-medium">
                  {currentIndustry.specHighlights.map((spec, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  href={`/create?${createParams}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-white bg-industrial px-4 py-2.5 rounded shadow-sm hover:bg-black transition-colors"
                >
                  <span>Create Job With This Spec</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/inventory"
                  className="inline-flex items-center gap-2 text-sm font-bold text-industrial bg-kraft-lighter px-4 py-2.5 rounded border border-kraft-dark/30 hover:bg-kraft transition-colors"
                >
                  <span>Explore Specs Vault</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Blueprint Blueprint Card */}
            <div className="lg:col-span-5 bg-kraft-lighter/50 rounded-lg border border-kraft-dark/30 p-6 space-y-4">
              <div className="border-b border-kraft-dark/20 pb-3">
                <span className="text-[10px] font-mono uppercase text-industrial/50 font-bold">
                  SAMPLE ITEM SPECIFICATION
                </span>
                <h4 className="text-base font-black text-blue-900 mt-0.5">
                  {currentIndustry.sampleCarton}
                </h4>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-industrial/10">
                  <span className="text-industrial/60">Flute Spec:</span>
                  <span className="font-bold text-industrial">Optimized Take-up</span>
                </div>
                <div className="flex justify-between py-1 border-b border-industrial/10">
                  <span className="text-industrial/60">Recommended GSM:</span>
                  <span className="font-bold text-industrial text-right">{currentIndustry.typicalGsm}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-industrial/10">
                  <span className="text-industrial/60">Job Ticket Status:</span>
                  <span className="font-bold text-green-700">Validated Formula</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded border border-kraft-dark/20 flex flex-col gap-2">
                <p className="text-[11px] font-semibold text-industrial/70 text-center">
                  Available in the software master catalog for one-click customer re-orders.
                </p>
                <Link
                  href={`/create?${createParams}`}
                  className="text-xs font-bold text-blue-900 hover:text-blue-700 text-center flex items-center justify-center gap-1"
                >
                  <span>Load into Software</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
