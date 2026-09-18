'use client';

import { useState } from 'react';
import { Printer, Check, Copy, FileText, CheckCircle2, ArrowRight, Maximize2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

import Link from 'next/link';
import { JobCard } from '@/lib/types';
import { TicketPrintPreviewModal, TicketData } from './TicketPrintPreviewModal';

const SAMPLE_TICKET_DATA: TicketData = {
  jobNo: '#1084',
  partyName: 'MARUTI AGRO FOODS EXPORTS PVT LTD',
  boxName: '10 KG FRESH MANGO EXPORT CARTON (VENTILATED TRAY)',
  orderDate: '2026-09-17',
  boxSize: { l: '480', w: '340', h: '180' },
  cuttingSize: '1680 × 520 mm',
  decalSize: '56 Inches',
  quantity: '10,000',
  topPaper: 'Virgin Golden Kraft',
  liner: '140 High BF Test Liner',
  numberOfPapers: '5 Layers (Double Wall Flute)',
  gsm: '180 / 140 / 180',
  ply: '5-PLY (B+C)',
  printingColor: '3-Color Flexo (Red, Green, Black)',
  deliveryDate: '2026-09-22',
  readyQuantity: '4,500 pcs',
  vehicleNumber: 'MH-12-RN-4819',
  remarks: 'Export grade packaging. Ensure ventilation hole punch dies are 100% slug-free. Apply high moisture-resistant starch gum.',
};

export function TicketPreviewModal() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleQuickPrint = () => {
    window.print();
  };

  return (
    <section id="print-preview" className="py-20 bg-kraft-lighter/50 relative border-t border-kraft-dark/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kraft border border-kraft-dark/30 shadow-xs">
            <Printer className="w-4 h-4 text-industrial" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-industrial">
              MILLIMETER-PERFECT SHOP FLOOR PRINTOUT
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-industrial tracking-tight">
            Designed for Dirty, Fast-Paced Shop Floors
          </h2>
          <p className="text-base sm:text-lg text-industrial/70 font-medium">
            Tablets are great, but corrugators and flexo operators rely on indestructible physical tickets. The Job Card System formats every ticket into an exact A4 half-page standard with high-contrast borders and physical pen checkboxes.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => setIsPreviewOpen(true)}
              size="sm"
              className="bg-industrial hover:bg-industrial/90 text-kraft-lighter font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-yellow-400" />
              <span>Test Print This Sample Ticket</span>
            </Button>

            <Button
              onClick={handleQuickPrint}
              size="sm"
              variant="outline"
              className="border-2 border-industrial text-industrial font-bold hover:bg-industrial/10 flex items-center gap-2 cursor-pointer"
              title="Quickly send directly to browser printer"
            >
              <Sparkles className="w-4 h-4 text-industrial" />
              <span>Quick Print</span>
            </Button>

            <Link href="/dashboard">
              <Button
                size="sm"
                variant="outline"
                className="border-2 border-industrial text-industrial font-bold hover:bg-industrial/10 flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Explore Software Tickets</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* The Exact Printable Job Card Container matching src/app/jobs/[id]/page.tsx */}
        <div className="max-w-4xl mx-auto bg-white border-4 border-black shadow-2xl p-0.5 rounded-xs overflow-hidden">
          
          {/* Outer Header Alert */}
          <div className="bg-industrial text-kraft-lighter px-4 py-2 flex items-center justify-between text-xs font-mono">
            <span className="font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              SAMPLE PHYSICAL JOB TICKET (A4 HALF-PAGE SPEC)
            </span>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="text-[10px] uppercase font-mono font-bold bg-yellow-400 text-industrial px-2.5 py-1 rounded hover:bg-yellow-300 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="View in A4 Paper Layout"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>A4 Layout Preview</span>
            </button>
          </div>

          {/* Job Card Blueprint Table */}
          <div className="bg-white text-black p-2 sm:p-4 font-sans select-none">
            <div className="border-2 border-black flex flex-col md:flex-row">
              
              {/* Left Main Content (75% on desktop) */}
              <div className="flex-1 md:w-3/4 border-b-2 md:border-b-0 md:border-r-2 border-black">
                
                {/* Header Row */}
                <div className="flex border-b-2 border-black">
                  <div className="flex-1 p-3 border-r-2 border-black text-center">
                    <h3 className="text-2xl font-black uppercase tracking-widest text-black">
                      JOB CARD SYSTEM
                    </h3>
                    <p className="text-[10px] font-mono uppercase text-gray-600">
                      Standard Corrugated Carton Production Ticket
                    </p>
                  </div>
                  <div className="w-32 bg-gray-100 p-3 flex flex-col items-center justify-center font-mono">
                    <span className="text-[9px] font-bold text-gray-500 uppercase">JOB NO</span>
                    <span className="text-2xl font-black">#1084</span>
                  </div>
                </div>

                {/* Row 1: Company Name & Date */}
                <div className="flex border-b-2 border-black min-h-[56px]">
                  <div className="flex-1 border-r-2 border-black p-2.5">
                    <span className="text-[10px] font-bold block text-gray-700 uppercase">
                      COMPANY NAME :-
                    </span>
                    <p className="text-lg font-bold text-blue-900 font-serif tracking-wide">
                      MARUTI AGRO FOODS EXPORTS PVT LTD
                    </p>
                  </div>
                  <div className="w-44 p-2.5">
                    <span className="text-[10px] font-bold block text-gray-700 uppercase">
                      DATE :
                    </span>
                    <p className="text-base font-mono font-bold">2026-09-17</p>
                  </div>
                </div>

                {/* Row 2: Box Name */}
                <div className="flex border-b-2 border-black min-h-[50px]">
                  <div className="flex-1 p-2.5">
                    <span className="text-[10px] font-bold block text-gray-700 uppercase">
                      BOX NAME / DESCRIPTION :-
                    </span>
                    <p className="text-xl font-bold text-blue-900">
                      10 KG FRESH MANGO EXPORT CARTON (VENTILATED TRAY)
                    </p>
                  </div>
                </div>

                {/* Technical Specifications Grid */}
                <div className="border-b-2 border-black">
                  <div className="grid grid-cols-2 sm:grid-cols-4">
                    
                    {/* Box Size */}
                    <div className="p-2.5 border-b-2 sm:border-b-2 border-r-2 border-black">
                      <span className="text-[10px] font-bold block text-gray-700">BOX SIZE (MM)</span>
                      <div className="text-lg font-mono font-bold text-blue-900 leading-tight">
                        <div>480 ×</div>
                        <div>340 ×</div>
                        <div>180</div>
                      </div>
                    </div>

                    {/* Cutting Size */}
                    <div className="p-2.5 border-b-2 sm:border-b-2 border-r-2 border-black">
                      <span className="text-[10px] font-bold block text-gray-700">CUTTING SIZE</span>
                      <p className="text-lg font-mono font-bold text-blue-900 mt-2">
                        1680 × 520 mm
                      </p>
                    </div>

                    {/* Decal Size */}
                    <div className="p-2.5 border-b-2 sm:border-b-2 border-r-2 border-black">
                      <span className="text-[10px] font-bold block text-gray-700">DECAL SIZE</span>
                      <p className="text-lg font-mono font-bold text-blue-900 mt-2">
                        56 Inches
                      </p>
                    </div>

                    {/* Order Qty */}
                    <div className="p-2.5 border-b-2 border-black bg-yellow-50 flex flex-col justify-center items-center">
                      <span className="text-[10px] font-bold block text-gray-700 self-start">
                        ORDER QUANTITY
                      </span>
                      <p className="text-3xl font-black font-mono text-black">
                        10,000
                      </p>
                      <span className="text-[9px] uppercase font-bold text-gray-500">PIECES</span>
                    </div>

                    {/* Row 2 of Grid */}
                    <div className="p-2.5 border-b-2 border-r-2 border-black">
                      <span className="text-[10px] font-bold block text-gray-700">TOP PAPER :-</span>
                      <p className="text-sm font-bold text-blue-900 mt-1">Virgin Golden Kraft</p>
                    </div>

                    <div className="p-2.5 border-b-2 border-r-2 border-black">
                      <span className="text-[10px] font-bold block text-gray-700">LINER :-</span>
                      <p className="text-sm font-bold text-blue-900 mt-1">140 High BF Test Liner</p>
                    </div>

                    <div className="col-span-2 p-2.5 border-b-2 border-black">
                      <span className="text-[10px] font-bold block text-gray-700">NO. OF PAPERS :-</span>
                      <p className="text-sm font-bold text-blue-900 mt-1">5 Layers (Double Wall Flute)</p>
                    </div>

                    {/* Row 3 of Grid */}
                    <div className="p-2.5 border-r-2 border-black">
                      <span className="text-[10px] font-bold block text-gray-700">GSM</span>
                      <p className="text-base font-mono font-bold text-blue-900 mt-1">180 / 140 / 180</p>
                    </div>

                    <div className="p-2.5 border-r-2 border-black">
                      <span className="text-[10px] font-bold block text-gray-700">PLY</span>
                      <p className="text-base font-bold text-blue-900 mt-1">5-PLY (B+C)</p>
                    </div>

                    <div className="col-span-2 p-2.5">
                      <span className="text-[10px] font-bold block text-gray-700">PRINTING :-</span>
                      <p className="text-base font-bold text-blue-900 mt-1">3-Color Flexo (Red, Green, Black)</p>
                    </div>

                  </div>
                </div>

                {/* Dispatch & Remarks Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 min-h-[110px]">
                  <div className="p-3 border-b sm:border-b-0 sm:border-r-2 border-black space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-700 uppercase">DISPATCH DATE:</span>
                      <span className="font-mono font-bold text-sm">2026-09-22</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-700 uppercase">READY QTY:</span>
                      <span className="font-mono font-bold text-sm">4,500 pcs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-700 uppercase">VEHICLE NO:</span>
                      <span className="font-mono font-bold text-sm">MH-12-RN-4819</span>
                    </div>
                  </div>

                  <div className="p-3">
                    <span className="text-[10px] font-bold block text-gray-700 uppercase mb-1">
                      OPERATOR REMARKS :-
                    </span>
                    <p className="text-sm italic text-gray-800">
                      Export grade packaging. Ensure ventilation hole punch dies are 100% slug-free. Apply high moisture-resistant starch gum.
                    </p>
                  </div>
                </div>

              </div>

              {/* Right Checklist Sidebar (25% Order Status) */}
              <div className="w-full md:w-1/4 flex flex-col bg-gray-50/50">
                <div className="p-3 bg-gray-200 text-center border-b-2 border-black">
                  <h4 className="font-black text-sm uppercase tracking-wider">
                    ORDER STATUS :-
                  </h4>
                </div>

                {/* Checkbox Rows for Shop Floor Operators */}
                <div className="flex-1 flex flex-col divide-y divide-black">
                  {[
                    { name: 'CORRUGATION', done: true },
                    { name: 'PASTING', done: true },
                    { name: 'PRINTING', done: true },
                    { name: 'PUNCHING', done: false },
                    { name: 'ROTARY', done: false },
                    { name: 'RS4', done: false },
                    { name: 'SLOTTING', done: false },
                    { name: 'STITCHING', done: false },
                    { name: 'BUNDLING', done: false },
                  ].map((stage) => (
                    <div
                      key={stage.name}
                      className="flex-1 flex items-center px-4 py-2 hover:bg-yellow-100/50 transition-colors"
                    >
                      <div className="w-5 h-5 border-2 border-black mr-3 flex items-center justify-center bg-white">
                        {stage.done && (
                          <Check className="w-4 h-4 text-black stroke-[3]" />
                        )}
                      </div>
                      <span className="font-black text-xs tracking-wider">
                        {stage.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t-2 border-black bg-gray-100 text-center">
                  <p className="text-[9px] font-mono uppercase text-gray-500 font-bold">
                    OPERATOR SIGNATURE REQUIRED
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Interactive A4 Sheet Print Preview Modal */}
      <TicketPrintPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        ticket={SAMPLE_TICKET_DATA}
      />
    </section>
  );
}
