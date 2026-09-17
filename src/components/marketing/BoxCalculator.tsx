'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Layers,
  ArrowRight,
  PackageCheck,
  Cpu,
  Sparkles,
  Info,
  Scale,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function BoxCalculator() {
  // Dimensions in mm
  const [length, setLength] = useState<number>(400);
  const [width, setWidth] = useState<number>(300);
  const [height, setHeight] = useState<number>(250);

  // Specifications
  const [ply, setPly] = useState<'3' | '5' | '7'>('5');
  const [flute, setFlute] = useState<'B' | 'C' | 'E' | 'BC'>('BC');
  const [topPaper, setTopPaper] = useState<string>('Virgin Golden Kraft');
  const [topGsm, setTopGsm] = useState<number>(180);
  const [fluteGsm, setFluteGsm] = useState<number>(140);
  const [linerGsm, setLinerGsm] = useState<number>(150);
  const [joint, setJoint] = useState<'stitched' | 'glued'>('stitched');
  const [printing, setPrinting] = useState<string>('2-Color Flexo');
  const [quantity, setQuantity] = useState<number>(2000);

  // Computed Specifications
  const calculations = useMemo(() => {
    // Standard RSC box sheet layout formulas (mm)
    const flapAllowance = 35; // joint/stitching flap
    const creasingAllowance = ply === '3' ? 6 : ply === '5' ? 10 : 14;

    // Cutting Length = 2 * (Length + Width) + joint flap
    const cuttingLength = 2 * (length + width) + flapAllowance + creasingAllowance;
    // Cutting Width = Width + Height + top/bottom flap allowances
    const cuttingWidth = width + height + (ply === '3' ? 4 : 8);

    // Decal size in inches (standard roll width calculation)
    const decalInches = Math.ceil((cuttingWidth / 25.4) + 2);

    // Fluting take-up factor
    const takeUpFactor = flute === 'B' ? 1.35 : flute === 'C' ? 1.45 : flute === 'E' ? 1.25 : 1.42;

    // Total GSM per square meter
    let totalGsm = 0;
    if (ply === '3') {
      // 1 Top + 1 Flute + 1 Liner
      totalGsm = topGsm + (fluteGsm * takeUpFactor) + linerGsm;
    } else if (ply === '5') {
      // 1 Top + 2 Flutes + 1 Inner Liner + 1 Bottom Liner
      totalGsm = topGsm + (fluteGsm * takeUpFactor * 2) + (linerGsm * 2);
    } else {
      // 7-Ply: 1 Top + 3 Flutes + 3 Liners
      totalGsm = topGsm + (fluteGsm * takeUpFactor * 3) + (linerGsm * 3);
    }

    // Box Sheet Area (m²)
    const sheetAreaSqM = (cuttingLength * cuttingWidth) / 1_000_000;
    
    // Weight per box (grams)
    const weightPerBoxGram = Math.round(sheetAreaSqM * totalGsm);

    // Total Paper Reel Required (kg)
    const totalReelKg = Math.round((weightPerBoxGram * quantity) / 1000 * 1.05); // +5% trim waste

    // Estimated Bursting Strength (kg/cm²) based on average BF of 18-20
    const bfFactor = topPaper.includes('Virgin') ? 22 : topPaper.includes('White') ? 20 : 16;
    const estimatedBs = ((totalGsm * bfFactor) / 1000).toFixed(1);

    return {
      cuttingLength,
      cuttingWidth,
      decalInches,
      sheetAreaSqM: sheetAreaSqM.toFixed(3),
      weightPerBoxGram,
      totalReelKg,
      totalGsm: Math.round(totalGsm),
      estimatedBs,
    };
  }, [length, width, height, ply, flute, topPaper, topGsm, fluteGsm, linerGsm, quantity]);

  return (
    <section id="calculator" className="py-20 bg-kraft-lighter/60 relative border-t border-kraft-dark/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kraft border border-kraft-dark/30 shadow-xs">
            <Calculator className="w-4 h-4 text-industrial" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-industrial">
              INTERACTIVE PLANT SIMULATOR
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-industrial tracking-tight">
            Instant Corrugated Box Spec & GSM Estimator
          </h2>
          <p className="text-base sm:text-lg text-industrial/70 font-medium">
            Test the math behind the Job Card System. Input your carton dimensions and paper recipes to compute cutting dimensions, decal roll size, and sheet weight live.
          </p>
        </div>

        {/* Calculator Grid: Inputs on Left, Real-Time Spec Ticket on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-lg border-2 border-kraft-dark/25 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Dimension Sliders / Inputs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-industrial uppercase tracking-wider flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-kraft-dark" />
                  1. Internal Box Dimensions (MM)
                </h3>
                <span className="text-xs font-mono text-industrial/50 bg-kraft-lighter px-2 py-0.5 rounded">
                  L × W × H
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Length */}
                <div className="bg-kraft-lighter/50 p-3.5 rounded border border-kraft-dark/20">
                  <div className="flex justify-between text-xs font-bold text-industrial mb-1">
                    <span>LENGTH (L)</span>
                    <span className="font-mono text-blue-900">{length} mm</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="1200"
                    step="10"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full accent-industrial cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-industrial/40 font-mono mt-1">
                    <span>150</span>
                    <span>1200mm</span>
                  </div>
                </div>

                {/* Width */}
                <div className="bg-kraft-lighter/50 p-3.5 rounded border border-kraft-dark/20">
                  <div className="flex justify-between text-xs font-bold text-industrial mb-1">
                    <span>WIDTH (W)</span>
                    <span className="font-mono text-blue-900">{width} mm</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="900"
                    step="10"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full accent-industrial cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-industrial/40 font-mono mt-1">
                    <span>100</span>
                    <span>900mm</span>
                  </div>
                </div>

                {/* Height */}
                <div className="bg-kraft-lighter/50 p-3.5 rounded border border-kraft-dark/20">
                  <div className="flex justify-between text-xs font-bold text-industrial mb-1">
                    <span>HEIGHT (H)</span>
                    <span className="font-mono text-blue-900">{height} mm</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="800"
                    step="10"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full accent-industrial cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-industrial/40 font-mono mt-1">
                    <span>80</span>
                    <span>800mm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Board Construction (Ply & Flute) */}
            <div className="pt-2 border-t border-kraft-dark/15">
              <h3 className="text-base font-bold text-industrial uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-kraft-dark" />
                2. Board Construction & Fluting
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ply Selection */}
                <div>
                  <label className="text-xs font-bold text-industrial/70 block mb-1.5 uppercase">
                    Board Ply
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '3', label: '3-Ply', desc: 'Single' },
                      { id: '5', label: '5-Ply', desc: 'Double' },
                      { id: '7', label: '7-Ply', desc: 'Heavy' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPly(item.id as any)}
                        className={`p-2 rounded border text-center transition-all cursor-pointer ${
                          ply === item.id
                            ? 'bg-industrial text-kraft-lighter border-industrial font-bold shadow-xs'
                            : 'bg-kraft-lighter/40 border-kraft-dark/20 text-industrial hover:bg-kraft-lighter'
                        }`}
                      >
                        <p className="text-sm">{item.label}</p>
                        <p className="text-[10px] opacity-70">{item.desc} Wall</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flute Profile */}
                <div>
                  <label className="text-xs font-bold text-industrial/70 block mb-1.5 uppercase">
                    Flute Profile
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'B', label: 'B-Flute', mm: '3mm' },
                      { id: 'C', label: 'C-Flute', mm: '4mm' },
                      { id: 'E', label: 'E-Flute', mm: '1.5mm' },
                      { id: 'BC', label: 'B+C', mm: '7mm' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFlute(f.id as any)}
                        className={`p-2 rounded border text-center transition-all cursor-pointer ${
                          flute === f.id
                            ? 'bg-industrial text-kraft-lighter border-industrial font-bold shadow-xs'
                            : 'bg-kraft-lighter/40 border-kraft-dark/20 text-industrial hover:bg-kraft-lighter'
                        }`}
                      >
                        <p className="text-xs">{f.label}</p>
                        <p className="text-[9px] opacity-70">{f.mm}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Paper GSM & Quality Recipe */}
            <div className="pt-2 border-t border-kraft-dark/15">
              <h3 className="text-base font-bold text-industrial uppercase tracking-wider mb-4 flex items-center gap-2">
                <Scale className="w-4 h-4 text-kraft-dark" />
                3. Paper Quality & GSM Recipe
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Top Paper */}
                <div>
                  <label className="text-xs font-bold text-industrial/70 block mb-1 uppercase">
                    Top Paper
                  </label>
                  <select
                    value={topPaper}
                    onChange={(e) => setTopPaper(e.target.value)}
                    className="w-full bg-kraft-lighter/50 border border-kraft-dark/30 rounded p-2 text-xs font-semibold text-industrial focus:ring-1 focus:ring-industrial"
                  >
                    <option value="Virgin Golden Kraft">Virgin Golden Kraft</option>
                    <option value="Semi-Kraft Brown">Semi-Kraft Brown</option>
                    <option value="Bleached White Kraft">Bleached White Kraft</option>
                    <option value="Duplex Board Laminated">Duplex Board Laminated</option>
                  </select>
                </div>

                {/* Top Paper GSM */}
                <div>
                  <label className="text-xs font-bold text-industrial/70 block mb-1 uppercase">
                    Top GSM
                  </label>
                  <select
                    value={topGsm}
                    onChange={(e) => setTopGsm(Number(e.target.value))}
                    className="w-full bg-kraft-lighter/50 border border-kraft-dark/30 rounded p-2 text-xs font-mono font-semibold text-industrial focus:ring-1 focus:ring-industrial"
                  >
                    {[120, 140, 160, 180, 200, 230, 250].map((g) => (
                      <option key={g} value={g}>{g} GSM</option>
                    ))}
                  </select>
                </div>

                {/* Fluting GSM */}
                <div>
                  <label className="text-xs font-bold text-industrial/70 block mb-1 uppercase">
                    Fluting Medium
                  </label>
                  <select
                    value={fluteGsm}
                    onChange={(e) => setFluteGsm(Number(e.target.value))}
                    className="w-full bg-kraft-lighter/50 border border-kraft-dark/30 rounded p-2 text-xs font-mono font-semibold text-industrial focus:ring-1 focus:ring-industrial"
                  >
                    {[100, 120, 140, 160, 180].map((g) => (
                      <option key={g} value={g}>{g} GSM High BF</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Finishing & Order Quantity */}
            <div className="pt-2 border-t border-kraft-dark/15 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-industrial/70 block mb-1 uppercase">
                  Printing Spec
                </label>
                <select
                  value={printing}
                  onChange={(e) => setPrinting(e.target.value)}
                  className="w-full bg-kraft-lighter/50 border border-kraft-dark/30 rounded p-2 text-xs font-semibold text-industrial"
                >
                  <option value="None / Plain">Plain (No Print)</option>
                  <option value="1-Color Flexo">1-Color Flexo</option>
                  <option value="2-Color Flexo">2-Color Flexo</option>
                  <option value="4-Color Process">4-Color CMYK Process</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-industrial/70 block mb-1 uppercase">
                  Joint / Closure
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setJoint('stitched')}
                    className={`py-2 text-xs font-bold rounded border cursor-pointer ${
                      joint === 'stitched' ? 'bg-industrial text-white' : 'bg-kraft-lighter/40 border-kraft-dark/20 text-industrial'
                    }`}
                  >
                    Stitched
                  </button>
                  <button
                    type="button"
                    onClick={() => setJoint('glued')}
                    className={`py-2 text-xs font-bold rounded border cursor-pointer ${
                      joint === 'glued' ? 'bg-industrial text-white' : 'bg-kraft-lighter/40 border-kraft-dark/20 text-industrial'
                    }`}
                  >
                    Glued
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-industrial/70 block mb-1 uppercase">
                  Order Quantity
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-kraft-lighter/50 border border-kraft-dark/30 rounded p-2 text-xs font-mono font-bold text-industrial"
                >
                  {[500, 1000, 2000, 5000, 10000, 25000].map((q) => (
                    <option key={q} value={q}>{q.toLocaleString()} pcs</option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Real-Time Spec Sheet Ticket (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-lg border-2 border-industrial shadow-md overflow-hidden">
              
              {/* Ticket Top Header */}
              <div className="bg-industrial text-kraft-lighter p-4 flex items-center justify-between border-b-2 border-industrial">
                <div className="flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-sm tracking-wide uppercase font-mono">
                    REAL-TIME SPECIFICATION TICKET
                  </span>
                </div>
                <span className="text-[10px] bg-kraft-dark text-kraft-lighter px-2 py-0.5 rounded font-mono font-bold">
                  AUTO-CALCULATED
                </span>
              </div>

              {/* Ticket Body Content */}
              <div className="p-5 space-y-4">
                
                {/* Visual Proportional Box Wireframe Diagram */}
                <div className="h-36 bg-kraft-lighter/60 rounded border border-kraft-dark/25 p-3 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="text-center">
                    {/* Isometric Box Graphic */}
                    <div className="inline-block relative">
                      <div
                        className="bg-kraft-light border-2 border-kraft-dark shadow-xs transition-all duration-300 rounded flex items-center justify-center"
                        style={{
                          width: `${Math.min(180, Math.max(100, length / 4))}px`,
                          height: `${Math.min(90, Math.max(50, height / 3))}px`,
                        }}
                      >
                        <div className="text-center font-mono text-[10px] font-bold text-industrial">
                          {length} × {width} × {height} mm
                          <p className="text-[8px] text-industrial/60 uppercase">{ply}-Ply {flute}-Flute</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-2 text-[9px] font-mono text-industrial/50">
                    Proportional Preview
                  </div>
                </div>

                {/* Primary Computed Output Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-kraft-lighter/40 border border-kraft-dark/20 p-3 rounded text-center">
                    <p className="text-[10px] uppercase font-bold text-industrial/60">
                      CUTTING SIZE
                    </p>
                    <p className="text-lg font-black font-mono text-blue-900 mt-0.5">
                      {calculations.cuttingLength} × {calculations.cuttingWidth}
                    </p>
                    <p className="text-[10px] text-industrial/50">millimeters</p>
                  </div>

                  <div className="bg-kraft-lighter/40 border border-kraft-dark/20 p-3 rounded text-center">
                    <p className="text-[10px] uppercase font-bold text-industrial/60">
                      DECAL ROLL SIZE
                    </p>
                    <p className="text-lg font-black font-mono text-industrial mt-0.5">
                      {calculations.decalInches}&quot;
                    </p>
                    <p className="text-[10px] text-industrial/50">standard reel width</p>
                  </div>
                </div>

                {/* Detailed Math Table */}
                <div className="space-y-2 text-xs border-t border-kraft-dark/15 pt-3">
                  <div className="flex justify-between py-1 border-b border-industrial/5 font-mono">
                    <span className="text-industrial/65">Combined Board GSM:</span>
                    <span className="font-bold text-industrial">{calculations.totalGsm} GSM</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-industrial/5 font-mono">
                    <span className="text-industrial/65">Board Area Per Box:</span>
                    <span className="font-bold text-industrial">{calculations.sheetAreaSqM} m²</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-industrial/5 font-mono">
                    <span className="text-industrial/65">Estimated Unit Weight:</span>
                    <span className="font-bold text-blue-900">{calculations.weightPerBoxGram} grams</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-industrial/5 font-mono">
                    <span className="text-industrial/65">Estimated Bursting Strength:</span>
                    <span className="font-bold text-industrial">~{calculations.estimatedBs} kg/cm²</span>
                  </div>
                  <div className="flex justify-between py-1.5 bg-yellow-50 px-2 rounded border border-yellow-200 font-mono">
                    <span className="font-bold text-yellow-900">Total Paper Reel Needed:</span>
                    <span className="font-black text-yellow-900">{calculations.totalReelKg.toLocaleString()} kg</span>
                  </div>
                </div>

                {/* 1-Click Action to Open in App */}
                <div className="pt-2">
                  <Link
                    href={`/create?boxSizeL=${length}&boxSizeW=${width}&boxSizeH=${height}&cuttingSize=${calculations.cuttingLength}x${calculations.cuttingWidth}&decalSize=${calculations.decalInches}&ply=${ply}&topPaper=${encodeURIComponent(topPaper)}&gsm=${topGsm}/${fluteGsm}/${linerGsm}&quantity=${quantity}&printingColor=${encodeURIComponent(printing)}&stitching=${joint === 'stitched'}&boxName=${encodeURIComponent(`${ply}-Ply ${flute}-Flute Shipper`)}`}
                  >
                    <Button
                      size="lg"
                      className="w-full bg-industrial hover:bg-industrial/90 text-kraft-lighter font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span>Create Job Card With This Spec</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <p className="text-[11px] text-center text-industrial/50 mt-2">
                    ⚡ Pre-populates into the live software form with one click.
                  </p>
                </div>

              </div>
            </div>

            {/* Educational Technical Note */}
            <div className="p-3.5 bg-kraft/40 rounded border border-kraft-dark/20 text-xs text-industrial/80 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-kraft-dark flex-shrink-0 mt-0.5" />
              <p>
                <strong>Shop Floor Rule:</strong> Decal size is rounded up to match nearest available paper mill reels, minimizing trim scrap on high-speed corrugator machines.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
