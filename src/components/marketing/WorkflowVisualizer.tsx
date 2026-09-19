'use client';

import { useState } from 'react';
import {
  Layers,
  Zap,
  Printer,
  Scissors,
  RotateCw,
  Sliders,
  Split,
  ShieldCheck,
  Package,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ArrowRight
} from 'lucide-react';

interface StageDetail {
  id: string;
  number: string;
  name: string;
  icon: React.ElementType;
  machine: string;
  description: string;
  keyParams: string[];
  qcChecklist: string[];
  bottleneckWarning: string;
}

const STAGES: StageDetail[] = [
  {
    id: 'corrugation',
    number: '01',
    name: 'CORRUGATION',
    icon: Layers,
    machine: 'Single Facer & High-Speed Corrugator Line',
    description: 'Heat, steam, and fluting corrugating rolls flute the fluting paper medium and bond it to the inner liner with hot starch paste.',
    keyParams: ['Steam Pressure: 125-140 PSI', 'Flute Profile: B/C/E-Flute', 'Pre-heater Temp: 165°C - 180°C'],
    qcChecklist: ['Pin Adhesion Test (PAT) verification', 'Zero flute crushing or high-low flutes', 'Paper web tension balance across deckle'],
    bottleneckWarning: 'Moisture imbalance causes board warp. Monitor roll temperature before pasting.',
  },
  {
    id: 'pasting',
    number: '02',
    name: 'PASTING',
    icon: Zap,
    machine: 'Double Backer & Heating Plates Section',
    description: 'Applies starch adhesive to the exposed flute tips and bonds the outer top kraft paper, curing the board under controlled hot plates.',
    keyParams: ['Starch Viscosity: 35-45 Stein-Hall sec', 'Gelatinization Temp: 62°C', 'Belt Drive Pressure: Balanced'],
    qcChecklist: ['Full fiber tear bonding check', 'Blister-free lamination', 'Uniform caliper thickness across board width'],
    bottleneckWarning: 'Excessive starch causes soggy boards; insufficient starch leads to delamination.',
  },
  {
    id: 'printing',
    number: '03',
    name: 'PRINTING',
    icon: Printer,
    machine: 'Flexographic In-line Printer (1 to 4 Colors)',
    description: 'Anilox ceramic rollers transfer water-based flexographic ink onto rubber/photopolymer stereo plates for high-speed carton branding.',
    keyParams: ['Ink pH: 8.5 - 9.2', 'Viscosity: 18-22 sec Zahn Cup #2', 'Stereo Thickness: 3.94mm / 2.84mm'],
    qcChecklist: ['Registration alignment within ±0.5mm', 'Barcode readability test (Grade A/B)', 'Color delta check against master approved swatch'],
    bottleneckWarning: 'Dirty anilox rollers cause ink hickeys and inconsistent density across long runs.',
  },
  {
    id: 'punching',
    number: '04',
    name: 'PUNCHING',
    icon: Scissors,
    machine: 'Automatic Flatbed / Rotary Die-Cutter',
    description: 'Die-cutting custom cartons, hand-holes, ventilation slots, and perforation tear strips using steel rule cutting & creasing dies.',
    keyParams: ['Cutting Rule Height: 23.8mm', 'Creasing Rule Height: 23.2mm', 'Die Pressure: Micro-adjusted'],
    qcChecklist: ['100% clean stripping of waste slugs', 'Sharp hand-hole cuts without fuzzy board burrs', 'Accurate 90-degree fold along crease score lines'],
    bottleneckWarning: 'Dull blades cause corrugated flutes to collapse rather than cut cleanly.',
  },
  {
    id: 'rotary',
    number: '05',
    name: 'ROTARY',
    icon: RotateCw,
    machine: 'Rotary Creaser & Edge Trimmer',
    description: 'High-speed rotary circular knives trim board edges square and impart deep, uniform score lines for carton side panels.',
    keyParams: ['Knife Overlap: 2.0 - 2.5mm', 'Blade RPM: Synchronized to line speed', 'Creaser Profile: Point-to-Point'],
    qcChecklist: ['Parallel cut edges (no skew)', 'Flap score line depth within 50% caliper', 'Clean edge cut without paper dust shedding'],
    bottleneckWarning: 'Improper knife clearance causes deckle edge tear-outs.',
  },
  {
    id: 'rs4',
    number: '06',
    name: 'RS4',
    icon: Sliders,
    machine: '4-Bar Rotary Slitter Scorer (RS4)',
    description: 'Precision slitting and multiple scoring for cartons requiring complex crease configurations across varied paper flute orientations.',
    keyParams: ['Shaft Center Distance: Calibrated', 'Score Gap: Board Caliper + 0.2mm', 'Tungsten Carbide Slitter Blades'],
    qcChecklist: ['Score depth consistency on top vs bottom flap', 'Accurate panel width verification against job ticket', 'Sheet squareness check with precision T-square'],
    bottleneckWarning: 'Misaligned scoring collars cause folding bias and carton out-of-squareness.',
  },
  {
    id: 'slotting',
    number: '07',
    name: 'SLOTTING',
    icon: Split,
    machine: 'Eccentric Slotter & Corner Cutting Head',
    description: 'Cuts vertical slots that separate the top and bottom flaps of the carton, allowing the box to fold together without flap overlap.',
    keyParams: ['Slot Width: 6mm - 8mm', 'Slot Depth: Height / 2 + Flap Allowance', 'Corner Cut Angle: Exactly 90°'],
    qcChecklist: ['Flap gap symmetry when closed', 'No over-slotting into the carton body panel', 'Clean slot root without tearing'],
    bottleneckWarning: 'Over-deep slots severely diminish box top-to-bottom compression strength.',
  },
  {
    id: 'stitching',
    number: '08',
    name: 'STITCHING',
    icon: ShieldCheck,
    machine: 'Heavy-Duty Industrial Wire Stitcher / Folder Gluer',
    description: 'Fastens the manufacturer manufacturer joint using galvanized flat steel wire staples or high-tack resin emulsion hot/cold melt glue.',
    keyParams: ['Wire Spec: 12x25 or 14x20 Flat Galvanized', 'Stitch Pitch: 50mm - 60mm interval', 'First/Last Stitch: 20mm from edge'],
    qcChecklist: ['Clinch tightness check (flush against board)', 'Joint pull test > 25 kgf minimum', 'Zero carton fishtailing or gap misalignment'],
    bottleneckWarning: 'Loose clinches snag goods during automated customer packing lines.',
  },
  {
    id: 'bundling',
    number: '09',
    name: 'BUNDLING',
    icon: Package,
    machine: 'Automatic PP Strapping & Stretch Wrapper',
    description: 'Counts, stacks, and secures finished flat cartons in bundles of 25 or 50 pieces, palletizing with corner boards for warehouse dispatch.',
    keyParams: ['Bundle Count: 25 / 50 pcs exact', 'Strap Tension: Non-crushing 15-20 kg', 'Pallet Wrap: 23-micron stretch film'],
    qcChecklist: ['Accurate bundle count matching job card tally', 'Corner edge protectors in place to avoid strap bite', 'Weather-proof stretch wrap for transit security'],
    bottleneckWarning: 'Excess strap tension crushes carton edges, ruining customer brand aesthetics.',
  },
];

export function WorkflowVisualizer() {
  const [selectedStageId, setSelectedStageId] = useState<string>('corrugation');
  const selectedStage = STAGES.find((s) => s.id === selectedStageId) || STAGES[0];

  return (
    <section id="workflow" className="py-20 bg-white relative border-t border-kraft-dark/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kraft border border-kraft-dark/30 shadow-xs">
            <Activity className="w-4 h-4 text-industrial" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-industrial">
              SHOP FLOOR INTEGRATION
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-industrial tracking-tight">
            The 9-Stage Corrugated Manufacturing Pipeline
          </h2>
          <p className="text-base sm:text-lg text-industrial/70 font-medium">
            In our Job Card System, every order flows through standard factory stations. Click any machine stage to inspect live operating parameters, QC checklists, and operator handoffs.
          </p>
        </div>

        {/* 9 Stage Interactive Grid Selector */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 mb-10">
          {STAGES.map((stage) => {
            const isSelected = stage.id === selectedStageId;
            const Icon = stage.icon;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStageId(stage.id)}
                className={`p-3 rounded-md border text-center transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out cursor-pointer flex flex-col items-center justify-center min-h-[96px] ${
                  isSelected
                    ? 'bg-industrial text-kraft-lighter border-industrial shadow-md scale-105 ring-2 ring-kraft-dark/40'
                    : 'bg-kraft-lighter/40 border-kraft-dark/20 text-industrial hover:bg-kraft hover:border-kraft-dark/40'
                }`}
              >
                <span className={`text-[10px] font-mono font-black mb-1 ${isSelected ? 'text-yellow-400' : 'text-industrial/50'}`}>
                  {stage.number}
                </span>
                <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-kraft-light' : 'text-industrial'}`} />
                <span className="text-[11px] font-bold tracking-tight uppercase line-clamp-1">
                  {stage.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed Inspector Card for Selected Stage */}
        <div className="bg-kraft-lighter/40 rounded-xl border-2 border-industrial shadow-lg overflow-hidden">
          
          {/* Header Bar */}
          <div className="bg-industrial text-kraft-lighter p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-industrial">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-kraft text-industrial flex items-center justify-center font-mono font-black text-lg">
                {selectedStage.number}
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-kraft-light/70">
                  FACTORY STATION SPECIFICATION
                </p>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  STAGE {selectedStage.number}: {selectedStage.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-kraft-dark text-white px-3 py-1 rounded font-bold">
                MACHINE: {selectedStage.machine.split('&')[0]}
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Description & Overview */}
            <div className="bg-white p-5 rounded-lg border border-kraft-dark/20 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-industrial/50 mb-1">
                Process Description
              </h4>
              <p className="text-base font-semibold text-industrial leading-relaxed">
                {selectedStage.description}
              </p>
            </div>

            {/* Two Column Grid: Parameters vs QC Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Critical Parameters */}
              <div className="bg-white p-5 rounded-lg border border-kraft-dark/20 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-industrial flex items-center gap-2 border-b border-industrial/10 pb-2">
                  <Sliders className="w-4 h-4 text-blue-700" />
                  <span>Calibrated Machine Parameters</span>
                </h4>
                <ul className="space-y-2 text-sm text-industrial/85">
                  {selectedStage.keyParams.map((param, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                      <span className="font-mono">{param}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quality Control Checklist */}
              <div className="bg-white p-5 rounded-lg border border-kraft-dark/20 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-industrial flex items-center gap-2 border-b border-industrial/10 pb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-700" />
                  <span>Operator Inspection Checklist</span>
                </h4>
                <ul className="space-y-2 text-sm text-industrial/85">
                  {selectedStage.qcChecklist.map((qc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{qc}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Shop Floor Bottleneck Alert */}
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase text-amber-900 tracking-wider">
                  Critical Quality Hazard / Bottleneck:
                </p>
                <p className="text-sm font-medium text-amber-900 mt-0.5">
                  {selectedStage.bottleneckWarning}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
