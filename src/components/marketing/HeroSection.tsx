'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Layers,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  FileText,
  Clock,
  Truck,
  RotateCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const SAMPLE_STAGES = [
  { id: 'corrugation', name: 'Corrugation', icon: Layers, status: 'Completed', time: '08:30 AM', operator: 'Vikram S.' },
  { id: 'pasting', name: 'Pasting', icon: Zap, status: 'Completed', time: '09:45 AM', operator: 'Rajesh K.' },
  { id: 'printing', name: 'Printing', icon: Printer, status: 'In Progress', time: '10:15 AM', operator: 'Manoj P.', active: true },
  { id: 'punching', name: 'Punching', icon: Activity, status: 'Pending', time: 'Queued', operator: 'Line 2' },
  { id: 'stitching', name: 'Stitching', icon: ShieldCheck, status: 'Pending', time: 'Queued', operator: 'Line 4' },
  { id: 'bundling', name: 'Bundling', icon: Box, status: 'Pending', time: 'Queued', operator: 'Dispatch Team' },
];

interface HeroSectionProps {
  liveStats?: {
    totalJobCards: number;
    totalClients: number;
    pendingJobCards: number;
    inProgressJobCards: number;
    completedJobCards: number;
  };
  latestJob?: {
    id: string;
    jobNo: number;
    partyName: string;
    boxName: string;
    boxSize: { l: string; w: string; h: string };
    quantity: number;
    ply: string;
    gsm: string;
    status: string;
    cuttingSize?: string;
    decalSize?: string;
    printingColor?: string;
  };
}

export function HeroSection({ liveStats, latestJob }: HeroSectionProps) {
  const [activeStageIndex, setActiveStageIndex] = useState(2); // Printing active
  const [useLiveOrder, setUseLiveOrder] = useState(Boolean(latestJob));
  const currentStage = SAMPLE_STAGES[activeStageIndex];

  const isLive = Boolean(latestJob && useLiveOrder);
  const displayParty = isLive && latestJob ? latestJob.partyName : 'Apex Pharma Logistics Ltd.';
  const displayBox = isLive && latestJob ? latestJob.boxName : 'Master Cold-Chain Shipper (Flute B+C)';
  const displayQty = isLive && latestJob ? latestJob.quantity : 5000;
  const displaySize = isLive && latestJob ? `${latestJob.boxSize.l}×${latestJob.boxSize.w}×${latestJob.boxSize.h}` : '450×320×280';
  const displayPly = isLive && latestJob ? `${latestJob.ply}-Ply Board` : '5-Ply Double Wall';
  const displayGsm = isLive && latestJob ? latestJob.gsm : '180 / 140 / 180';
  const displayJobNo = isLive && latestJob ? `#${latestJob.jobNo}` : '#84';
  const displayCutting = isLive && latestJob && latestJob.cuttingSize ? latestJob.cuttingSize : '1580 x 620 mm';
  const displayDecal = isLive && latestJob && latestJob.decalSize ? `${latestJob.decalSize} Inches` : '58 Inches';

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background Ambient Industrial Accents */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none -z-10 opacity-70"
        style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(141, 110, 99, 0.18), transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Industrial Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-kraft border border-kraft-dark/30 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-industrial">
                ENGINEERED FOR CORRUGATED BOX PLANTS & CONVERTERS
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-industrial tracking-tight leading-[1.1]">
              Stop Juggling Paper Tickets.{' '}
              <span className="inline-block bg-industrial text-kraft-lighter px-3 py-0.5 rounded-sm transform -rotate-1 shadow-sm mt-1">
                Run Your Box Plant
              </span>{' '}
              on Autopilot.
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-industrial/75 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              The purpose-built SaaS platform for corrugated packaging manufacturers. Calculate cutting dimensions & paper GSM recipes in seconds, coordinate 9 shop-floor operations, and generate millimeter-perfect A4 job tickets with zero operator errors.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-industrial hover:bg-industrial/90 text-kraft-lighter font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 h-14 px-8 text-base border border-kraft-dark/40 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span>Launch Live Software</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
              
              <a href="#calculator" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto bg-kraft-dark hover:bg-kraft-dark/90 text-kraft-lighter font-bold h-14 px-7 text-base shadow-xs cursor-pointer"
                >
                  <Layers className="w-5 h-5 mr-2" />
                  <span>Try Box Estimator</span>
                </Button>
              </a>

              <a href="#print-preview" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-industrial text-industrial font-bold hover:bg-industrial/10 h-14 px-6 text-base cursor-pointer"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  <span>View Ticket</span>
                </Button>
              </a>
            </div>

            {/* Trust Badges / Quick Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-kraft-dark/20 text-left">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-700 flex-shrink-0" />
                <span className="text-xs font-semibold text-industrial/80">
                  Zero Misprint Guarantee
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-industrial flex-shrink-0" />
                <span className="text-xs font-semibold text-industrial/80">
                  10-Second Ticket Setup
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-industrial flex-shrink-0" />
                <span className="text-xs font-semibold text-industrial/80">
                  Standard A4 Print Specs
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Cardboard Job Card Simulation */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Decorative Kraft Edge Accent */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-kraft-dark to-industrial rounded-lg blur-xs opacity-30 transform rotate-1 pointer-events-none" />

              {/* Main Interactive Card Container */}
              <div className="relative bg-white rounded-md border-2 border-industrial shadow-xl overflow-hidden">

                {/* Card Top Industrial Header */}
                <div className="bg-industrial text-kraft-lighter px-5 py-3.5 flex items-center justify-between border-b-2 border-industrial">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-kraft text-industrial font-mono font-black text-xs flex items-center justify-center">
                      {displayJobNo}
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest text-kraft-light/70">
                        {isLive ? 'LIVE FROM SYSTEM DATABASE' : 'ACTIVE PRODUCTION ORDER'}
                      </p>
                      <h2 className="text-sm font-bold tracking-tight text-white truncate max-w-[200px]">
                        {displayBox}
                      </h2>
                    </div>
                  </div>
                  {latestJob ? (
                    <button
                      type="button"
                      onClick={() => setUseLiveOrder(!useLiveOrder)}
                      className="text-[10px] font-mono font-bold bg-kraft-dark/80 hover:bg-kraft-dark text-white px-2 py-0.5 rounded cursor-pointer transition-colors"
                      title="Toggle between real database card and interactive demo"
                    >
                      {useLiveOrder ? 'Switch to Demo' : 'Show Real DB Job'}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold bg-blue-600 text-white px-2.5 py-1 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      LIVE ON FLOOR
                    </span>
                  )}
                </div>

                {/* Job Card Body Details */}
                <div className="p-5 space-y-4">
                  {/* Client & Carton Spec Bar */}
                  <div className="flex items-start justify-between border-b border-kraft-dark/20 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-industrial/50">
                        CLIENT / INDUSTRY
                      </span>
                      <h3 className="text-base font-black text-industrial">
                        {displayParty}
                      </h3>
                      <p className="text-xs font-medium text-industrial/65">
                        Item: {displayBox}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-industrial/50">
                        QUANTITY
                      </span>
                      <p className="text-2xl font-mono font-black text-industrial">
                        {displayQty.toLocaleString()} <span className="text-xs font-normal text-industrial/60">pcs</span>
                      </p>
                    </div>
                  </div>

                  {/* Dimension & Technical Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-kraft-lighter/60 p-3 rounded border border-kraft-dark/20 text-center font-mono">
                    <div className="border-r border-kraft-dark/20 pr-1">
                      <p className="text-[10px] font-bold uppercase text-industrial/50">BOX SIZE (MM)</p>
                      <p className="text-xs font-bold text-industrial mt-0.5">{displaySize}</p>
                    </div>
                    <div className="border-r border-kraft-dark/20 pr-1">
                      <p className="text-[10px] font-bold uppercase text-industrial/50">BOARD PLY</p>
                      <p className="text-xs font-bold text-blue-900 mt-0.5">{displayPly}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-industrial/50">PAPER GSM</p>
                      <p className="text-xs font-bold text-industrial mt-0.5">{displayGsm}</p>
                    </div>
                  </div>

                  {/* Secondary Technical Specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-industrial/80">
                    <div className="flex justify-between border-b border-industrial/10 py-1">
                      <span className="text-industrial/50">Cutting Size:</span>
                      <span className="font-mono font-semibold">{displayCutting}</span>
                    </div>
                    <div className="flex justify-between border-b border-industrial/10 py-1">
                      <span className="text-industrial/50">Decal Size:</span>
                      <span className="font-mono font-semibold">{displayDecal}</span>
                    </div>
                    <div className="flex justify-between border-b border-industrial/10 py-1">
                      <span className="text-industrial/50">Printing:</span>
                      <span className="font-semibold text-blue-800">
                        {isLive && latestJob?.printingColor ? latestJob.printingColor : '2-Color Flexo (Blue/Black)'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-industrial/10 py-1">
                      <span className="text-industrial/50">Joint Spec:</span>
                      <span className="font-semibold">Stitched (Heavy Wire)</span>
                    </div>
                  </div>

                  {/* Interactive Production Floor Pipeline Selector */}
                  <div className="pt-2 border-t border-kraft-dark/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-industrial flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-blue-600" />
                        <span>Interactive Shop Floor Tracker:</span>
                      </p>
                      <span className="text-[11px] font-mono text-industrial/50">
                        Click to simulate
                      </span>
                    </div>

                    {/* Step Tabs */}
                    <div className="grid grid-cols-6 gap-1">
                      {SAMPLE_STAGES.map((stage, idx) => {
                        const isSelected = activeStageIndex === idx;
                        const isDone = idx < activeStageIndex;
                        return (
                          <button
                            key={stage.id}
                            type="button"
                            onClick={() => setActiveStageIndex(idx)}
                            className={`p-1.5 rounded text-center transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-industrial text-kraft-lighter border-industrial shadow-xs scale-105'
                                : isDone
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : 'bg-kraft/30 text-industrial/60 border-kraft-dark/15 hover:bg-kraft/60'
                            }`}
                            title={`Inspect ${stage.name}`}
                          >
                            <p className="text-[10px] font-bold truncate">{stage.name}</p>
                            {isDone ? (
                              <CheckCircle2 className="w-3 h-3 mx-auto mt-0.5 text-green-600" />
                            ) : isSelected ? (
                              <RotateCw className="w-3 h-3 mx-auto mt-0.5 text-yellow-400 animate-spin" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-industrial/20 mx-auto mt-1" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Stage Live Inspector Box */}
                    <div className="mt-3 bg-industrial/5 border border-industrial/15 rounded p-3 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-kraft-dark text-white flex items-center justify-center">
                          <currentStage.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-industrial">
                            Stage: <span className="uppercase text-blue-700">{currentStage.name}</span>
                          </p>
                          <p className="text-[11px] text-industrial/60">
                            Operator: {currentStage.operator} • {currentStage.time}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded ${
                          currentStage.status === 'Completed'
                            ? 'bg-green-500 text-white'
                            : currentStage.status === 'In Progress'
                            ? 'bg-blue-600 text-white'
                            : 'bg-yellow-400 text-industrial'
                        }`}
                      >
                        {currentStage.status}
                      </span>
                    </div>
                  </div>

                  {/* Dispatch & Ready Qty Footer */}
                  <div className="flex items-center justify-between pt-2 text-xs border-t border-kraft-dark/15">
                    <div className="flex items-center gap-1.5 text-industrial/70">
                      <Truck className="w-3.5 h-3.5 text-industrial" />
                      <span>Dispatch: <strong>2,500 / 5,000 Ready</strong></span>
                    </div>
                    <Link
                      href="/dashboard"
                      className="text-blue-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Open in Software</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Verified Stamp Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-industrial border-2 border-industrial font-mono font-black text-xs uppercase px-3 py-1 rounded shadow-md transform -rotate-6">
                ★ 100% SPEC ACCURACY
              </div>
            </div>
          </div>

        </div>

        {/* Bottom KPI Counters Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-lg border border-kraft-dark/20 shadow-sm text-center">
          <div className="border-r last:border-r-0 border-kraft-dark/15 pr-2">
            <p className="text-3xl lg:text-4xl font-black font-mono text-industrial">
              {liveStats && liveStats.totalJobCards > 0 ? liveStats.totalJobCards.toLocaleString() : '500,000+'}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-industrial/50 mt-1">
              {liveStats && liveStats.totalJobCards > 0 ? 'Live Job Cards In System' : 'Job Cards Processed'}
            </p>
          </div>
          <div className="border-r last:border-r-0 border-kraft-dark/15 pr-2">
            <p className="text-3xl lg:text-4xl font-black font-mono text-industrial">
              {liveStats && liveStats.totalClients > 0 ? liveStats.totalClients : '99.8%'}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-industrial/50 mt-1">
              {liveStats && liveStats.totalClients > 0 ? 'Client Industries Connected' : 'Shop Floor QC Pass Rate'}
            </p>
          </div>
          <div className="border-r last:border-r-0 border-kraft-dark/15 pr-2">
            <p className="text-3xl lg:text-4xl font-black font-mono text-industrial">4.2 Hrs</p>
            <p className="text-xs font-bold uppercase tracking-wider text-industrial/50 mt-1">
              Saved Daily Per Line
            </p>
          </div>
          <div>
            <p className="text-3xl lg:text-4xl font-black font-mono text-industrial">A4 Standard</p>
            <p className="text-xs font-bold uppercase tracking-wider text-industrial/50 mt-1">
              1-Click Shop Floor Print
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
