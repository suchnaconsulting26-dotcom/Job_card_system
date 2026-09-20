'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Printer,
  X,
  Copy,
  Check,
  FileText,
  Scissors,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface TicketData {
  jobNo: string;
  partyName: string;
  boxName: string;
  orderDate: string;
  boxSize: { l: string; w: string; h: string };
  cuttingSize: string;
  decalSize: string;
  quantity: number | string;
  topPaper: string;
  liner: string;
  numberOfPapers: string;
  gsm: string;
  ply: string;
  printingColor: string;
  deliveryDate: string;
  readyQuantity: string;
  vehicleNumber: string;
  remarks: string;
  stages?: Array<{ name: string; done: boolean }>;
}

interface TicketPrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketData;
}

const DEFAULT_STAGES = [
  { name: 'CORRUGATION', done: false },
  { name: 'PASTING', done: false },
  { name: 'PRINTING', done: false },
  { name: 'PUNCHING', done: false },
  { name: 'ROTARY', done: false },
  { name: 'RS4', done: false },
  { name: 'SLOTTING', done: false },
  { name: 'STITCHING', done: false },
  { name: 'BUNDLING', done: false },
];

export function TicketPrintPreviewModal({
  isOpen,
  onClose,
  ticket,
}: TicketPrintPreviewModalProps) {
  const [ticketMode, setTicketMode] = useState<'single' | 'double'>('single');
  const [colorMode, setColorMode] = useState<'color' | 'mono'>('color');
  const [zoomLevel, setZoomLevel] = useState<'fit' | '100'>('fit');
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll and set printing class when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('is-printing-modal');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('is-printing-modal');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('is-printing-modal');
    };
  }, [isOpen]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!isOpen || !mounted) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySpecs = () => {
    const specText = `JOB CARD ${ticket.jobNo}
Client: ${ticket.partyName}
Box: ${ticket.boxName}
Size: ${ticket.boxSize.l} x ${ticket.boxSize.w} x ${ticket.boxSize.h} mm
Cutting Size: ${ticket.cuttingSize}
Decal Size: ${ticket.decalSize}
Quantity: ${ticket.quantity}
Board: ${ticket.ply} | ${ticket.gsm} GSM
Printing: ${ticket.printingColor}`;
    navigator.clipboard.writeText(specText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render an individual Job Card ticket
  const renderTicketCard = (isDuplicate = false) => {
    const isMono = colorMode === 'mono';

    return (
      <div
        className={`w-full bg-white text-black border-2 border-black select-none ${
          isDuplicate ? 'job-card-print-second' : 'job-card-print'
        } ${isMono ? 'grayscale contrast-125' : ''}`}
        style={{
          display: 'flex',
          flexDirection: 'row',
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          color: '#000000',
        }}
      >
        {/* Left Main Content (75% on desktop/print) */}
        <div
          className="flex-1"
          style={{
            width: '75%',
            borderRight: '2px solid black',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              borderBottom: '2px solid black',
              alignItems: 'stretch',
            }}
          >
            <div
              style={{
                flex: '1',
                padding: '6px 10px',
                borderRight: '2px solid black',
                textAlign: 'center',
              }}
            >
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-black">
                JOB CARD SYSTEM
              </h3>
              <p className="text-[9px] sm:text-[10px] font-mono uppercase text-gray-700 tracking-wider">
                Standard Corrugated Carton Production Ticket {isDuplicate && '(FACTORY COPY 2)'}
              </p>
            </div>
            <div
              style={{
                width: '110px',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isMono ? '#ffffff' : '#f3f4f6',
              }}
              className="font-mono"
            >
              <span className="text-[8px] font-bold text-gray-700 uppercase">JOB NO</span>
              <span className="text-xl font-black text-black">{ticket.jobNo}</span>
            </div>
          </div>

          {/* Row 1: Company & Date */}
          <div
            style={{
              display: 'flex',
              borderBottom: '2px solid black',
              minHeight: '44px',
            }}
          >
            <div
              style={{
                flex: '1',
                borderRight: '2px solid black',
                padding: '6px 10px',
              }}
            >
              <span className="text-[9px] font-bold block text-gray-700 uppercase">
                COMPANY NAME :-
              </span>
              <p
                className={`text-base font-bold font-serif tracking-wide ${
                  isMono ? 'text-black' : 'text-blue-900'
                }`}
              >
                {ticket.partyName}
              </p>
            </div>
            <div style={{ width: '130px', padding: '6px 10px' }}>
              <span className="text-[9px] font-bold block text-gray-700 uppercase">
                DATE :
              </span>
              <p className="text-sm font-mono font-bold text-black">{ticket.orderDate}</p>
            </div>
          </div>

          {/* Row 2: Box Name */}
          <div
            style={{
              display: 'flex',
              borderBottom: '2px solid black',
              padding: '6px 10px',
              minHeight: '40px',
            }}
          >
            <div style={{ flex: '1' }}>
              <span className="text-[9px] font-bold block text-gray-700 uppercase">
                BOX NAME / DESCRIPTION :-
              </span>
              <p
                className={`text-sm sm:text-base font-bold ${
                  isMono ? 'text-black' : 'text-blue-900'
                }`}
              >
                {ticket.boxName}
              </p>
            </div>
          </div>

          {/* Technical Specifications Grid (4 columns) */}
          <div style={{ borderBottom: '2px solid black' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              }}
            >
              {/* Box Size */}
              <div
                style={{
                  padding: '6px 8px',
                  borderBottom: '2px solid black',
                  borderRight: '2px solid black',
                }}
              >
                <span className="text-[9px] font-bold block text-gray-700 uppercase">
                  BOX SIZE (MM)
                </span>
                <div
                  className={`text-sm sm:text-base font-mono font-bold leading-tight ${
                    isMono ? 'text-black' : 'text-blue-900'
                  }`}
                >
                  <div>{ticket.boxSize?.l || '-'} ×</div>
                  <div>{ticket.boxSize?.w || '-'} ×</div>
                  <div>{ticket.boxSize?.h || '-'}</div>
                </div>
              </div>

              {/* Cutting Size */}
              <div
                style={{
                  padding: '6px 8px',
                  borderBottom: '2px solid black',
                  borderRight: '2px solid black',
                }}
              >
                <span className="text-[9px] font-bold block text-gray-700 uppercase">
                  CUTTING SIZE
                </span>
                <p
                  className={`text-sm sm:text-base font-mono font-bold mt-1 ${
                    isMono ? 'text-black' : 'text-blue-900'
                  }`}
                >
                  {ticket.cuttingSize}
                </p>
              </div>

              {/* Decal Size */}
              <div
                style={{
                  padding: '6px 8px',
                  borderBottom: '2px solid black',
                  borderRight: '2px solid black',
                }}
              >
                <span className="text-[9px] font-bold block text-gray-700 uppercase">
                  DECAL SIZE
                </span>
                <p
                  className={`text-sm sm:text-base font-mono font-bold mt-1 ${
                    isMono ? 'text-black' : 'text-blue-900'
                  }`}
                >
                  {ticket.decalSize}
                </p>
              </div>

              {/* Order Qty */}
              <div
                style={{
                  padding: '6px 8px',
                  borderBottom: '2px solid black',
                  backgroundColor: isMono ? '#ffffff' : '#fef9c3',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <span className="text-[9px] font-bold block text-gray-700 self-start uppercase">
                  ORDER QUANTITY
                </span>
                <p className="text-2xl font-black font-mono text-black">
                  {typeof ticket.quantity === 'number'
                    ? ticket.quantity.toLocaleString()
                    : ticket.quantity}
                </p>
                <span className="text-[8px] uppercase font-bold text-gray-600">PIECES</span>
              </div>

              {/* Row 2 of Grid: Papers */}
              <div
                style={{
                  padding: '6px 8px',
                  borderBottom: '2px solid black',
                  borderRight: '2px solid black',
                }}
              >
                <span className="text-[9px] font-bold block text-gray-700 uppercase">
                  TOP PAPER :-
                </span>
                <p
                  className={`text-xs font-bold mt-0.5 ${
                    isMono ? 'text-black' : 'text-blue-900'
                  }`}
                >
                  {ticket.topPaper}
                </p>
              </div>

              <div
                style={{
                  padding: '6px 8px',
                  borderBottom: '2px solid black',
                  borderRight: '2px solid black',
                }}
              >
                <span className="text-[9px] font-bold block text-gray-700 uppercase">
                  LINER :-
                </span>
                <p
                  className={`text-xs font-bold mt-0.5 ${
                    isMono ? 'text-black' : 'text-blue-900'
                  }`}
                >
                  {ticket.liner}
                </p>
              </div>

              <div
                style={{
                  gridColumn: 'span 2',
                  padding: '6px 8px',
                  borderBottom: '2px solid black',
                }}
              >
                <span className="text-[9px] font-bold block text-gray-700 uppercase">
                  NO. OF PAPERS :-
                </span>
                <p
                  className={`text-xs font-bold mt-0.5 ${
                    isMono ? 'text-black' : 'text-blue-900'
                  }`}
                >
                  {ticket.numberOfPapers}
                </p>
              </div>

              {/* Row 3 of Grid: GSM, Ply, Printing */}
              <div
                style={{
                  padding: '6px 8px',
                  borderRight: '2px solid black',
                }}
              >
                <span className="text-[9px] font-bold block text-gray-700 uppercase">GSM</span>
                <p
                  className={`text-xs sm:text-sm font-mono font-bold mt-0.5 ${
                    isMono ? 'text-black' : 'text-blue-900'
                  }`}
                >
                  {ticket.gsm}
                </p>
              </div>

              <div
                style={{
                  padding: '6px 8px',
                  borderRight: '2px solid black',
                }}
              >
                <span className="text-[9px] font-bold block text-gray-700 uppercase">PLY</span>
                <p
                  className={`text-xs sm:text-sm font-bold mt-0.5 ${
                    isMono ? 'text-black' : 'text-blue-900'
                  }`}
                >
                  {ticket.ply}
                </p>
              </div>

              <div
                style={{
                  gridColumn: 'span 2',
                  padding: '6px 8px',
                }}
              >
                <span className="text-[9px] font-bold block text-gray-700 uppercase">
                  PRINTING :-
                </span>
                <p
                  className={`text-xs sm:text-sm font-bold mt-0.5 ${
                    isMono ? 'text-black' : 'text-blue-900'
                  }`}
                >
                  {ticket.printingColor}
                </p>
              </div>
            </div>
          </div>

          {/* Dispatch & Remarks Section */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              flex: '1',
            }}
          >
            <div
              style={{
                padding: '6px 10px',
                borderRight: '2px solid black',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="text-[9px] font-bold text-gray-700 uppercase">
                  DISPATCH DATE:
                </span>
                <span className="font-mono font-bold">{ticket.deliveryDate}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[9px] font-bold text-gray-700 uppercase">
                  READY QTY:
                </span>
                <span className="font-mono font-bold">{ticket.readyQuantity}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[9px] font-bold text-gray-700 uppercase">
                  VEHICLE NO:
                </span>
                <span className="font-mono font-bold">{ticket.vehicleNumber}</span>
              </div>
            </div>

            <div style={{ padding: '6px 10px' }}>
              <span className="text-[9px] font-bold block text-gray-700 uppercase mb-1">
                OPERATOR REMARKS :-
              </span>
              <p className="text-xs italic text-gray-800 leading-tight">
                {ticket.remarks}
              </p>
            </div>
          </div>
        </div>

        {/* Right Status Column (25% on desktop/print) */}
        <div
          style={{
            width: '25%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: isMono ? '#ffffff' : '#f9fafb',
          }}
        >
          <div
            style={{
              borderBottom: '2px solid black',
              padding: '6px 4px',
              textAlign: 'center',
              backgroundColor: isMono ? '#ffffff' : '#e5e7eb',
            }}
          >
            <h4 className="font-black text-xs uppercase tracking-wider text-black">
              ORDER STATUS :-
            </h4>
          </div>

          {/* 9 Stage Checkbox Rows */}
          <div
            style={{
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {(ticket.stages || DEFAULT_STAGES).map((stage) => (
              <div
                key={stage.name}
                style={{
                  flex: '1',
                  borderBottom: '1px solid black',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px 8px',
                  minHeight: '18px',
                }}
              >
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    border: '1.5px solid black',
                    marginRight: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                  }}
                >
                  {stage.done && (
                    <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                  )}
                </div>
                <span className="font-black text-[10px] tracking-wide text-black truncate">
                  {stage.name}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: '2px solid black',
              padding: '4px',
              textAlign: 'center',
              backgroundColor: isMono ? '#ffffff' : '#f3f4f6',
            }}
          >
            <p className="text-[8px] font-mono uppercase text-gray-600 font-bold">
              OPERATOR SIGNATURE REQUIRED
            </p>
          </div>
        </div>
      </div>
    );
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:block print:relative print:inset-auto print:overflow-visible print-preview-portal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#1e1e1e] text-kraft-lighter rounded-xl border border-kraft-dark/30 shadow-2xl flex flex-col max-h-[96vh] overflow-hidden print:border-none print:shadow-none print:bg-white print:max-h-none print:w-auto print:overflow-visible">
        
        {/* Top Header Toolbar (Hidden in print) */}
        <div className="px-4 py-3 bg-industrial border-b border-kraft-dark/30 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-yellow-400 text-industrial flex items-center justify-center font-bold shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="preview-modal-title" className="text-base font-bold text-white tracking-tight">
                  Print Preview — Shop Floor Job Ticket
                </h3>
                <span className="text-[10px] font-mono font-bold bg-kraft-dark/60 text-yellow-300 px-2 py-0.5 rounded tracking-wider uppercase">
                  A4 Standard
                </span>
              </div>
              <p className="text-xs text-kraft-light/70 font-mono">
                {ticketMode === 'single'
                  ? 'A4 Half-Page (190 × 138 mm) • Upper Half'
                  : 'A4 Paper-Saver (2 Tickets per Sheet) • 50% Waste Reduction'}
              </p>
            </div>
          </div>

          {/* Actions on Top Right */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              className="bg-yellow-400 hover:bg-yellow-300 text-industrial font-black flex items-center gap-2 shadow-md border border-yellow-500 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Ticket Now</span>
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-kraft-light hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Print Preview"
              title="Close Preview (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Secondary Configuration Ribbon (Hidden in print) */}
        <div className="px-4 py-2 bg-[#252525] border-b border-kraft-dark/20 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-kraft-light/80 flex-shrink-0 print:hidden">
          {/* Left: Mode Toggles */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-kraft-light/50 font-bold uppercase text-[10px]">Sheet Layout:</span>
            <div className="inline-flex rounded-md bg-black/40 p-0.5 border border-kraft-dark/30">
              <button
                type="button"
                onClick={() => setTicketMode('single')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  ticketMode === 'single'
                    ? 'bg-industrial text-yellow-300 border border-kraft-dark/40 shadow-xs'
                    : 'text-kraft-light/60 hover:text-white'
                }`}
              >
                1 Ticket (Half-Page)
              </button>
              <button
                type="button"
                onClick={() => setTicketMode('double')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  ticketMode === 'double'
                    ? 'bg-industrial text-yellow-300 border border-kraft-dark/40 shadow-xs'
                    : 'text-kraft-light/60 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span>2 Tickets (Paper-Saver)</span>
              </button>
            </div>

            <span className="text-kraft-light/30">|</span>

            <span className="text-kraft-light/50 font-bold uppercase text-[10px]">Ink Profile:</span>
            <div className="inline-flex rounded-md bg-black/40 p-0.5 border border-kraft-dark/30">
              <button
                type="button"
                onClick={() => setColorMode('color')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  colorMode === 'color'
                    ? 'bg-industrial text-yellow-300 border border-kraft-dark/40'
                    : 'text-kraft-light/60 hover:text-white'
                }`}
              >
                Flexo Color
              </button>
              <button
                type="button"
                onClick={() => setColorMode('mono')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  colorMode === 'mono'
                    ? 'bg-industrial text-yellow-300 border border-kraft-dark/40'
                    : 'text-kraft-light/60 hover:text-white'
                }`}
              >
                High-Contrast B&W
              </button>
            </div>
          </div>

          {/* Right: Quick Specs / Copy */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopySpecs}
              className="hover:text-yellow-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Specs!' : 'Copy Ticket Text'}</span>
            </button>
          </div>
        </div>

        {/* Realistic Simulated Workshop A4 Sheet Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#161616] flex justify-center items-start print:p-0 print:overflow-visible print:bg-white">
          
          {/* Simulated Physical A4 Sheet Container */}
          <div
            className="w-full max-w-[780px] bg-white text-black shadow-2xl rounded-sm p-4 sm:p-6 relative border border-gray-300 print:max-w-none print:p-0 print:border-none print:shadow-none print:rounded-none print-sheet-container"
            style={{
              minHeight: ticketMode === 'double' ? '920px' : '650px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Sheet Dimension Header Indicator (Hidden in print) */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-dashed border-gray-300 text-[10px] font-mono text-gray-500 uppercase print:hidden">
              <span className="flex items-center gap-1.5 font-bold text-gray-700">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                SIMULATED A4 PAPER (210 × 297 MM) • 10MM MARGIN GUIDELINE
              </span>
              <span>100% SCALE • MILLIMETER-CALIBRATED</span>
            </div>

            {/* Ticket 1 (Upper Half) */}
            <div className="relative print:static">
              {renderTicketCard(false)}
            </div>

            {/* Middle Perforation / Cut Line Guide */}
            {ticketMode === 'double' ? (
              <div className="job-card-cut-line-print my-4 border-t-2 border-dashed border-gray-400 relative text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[9px] font-mono font-bold text-gray-500 uppercase flex items-center gap-1 print:hidden">
                  <Scissors className="w-3 h-3 text-gray-600" />
                  <span>✂ CUT ALONG DASHED LINE TO SEPARATE HALF-PAGE (148.5 MM) ✂</span>
                </div>
              </div>
            ) : (
              <div className="my-5 border-t-2 border-dashed border-gray-400 relative text-center print:hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[9px] font-mono font-bold text-gray-500 uppercase flex items-center gap-1">
                  <Scissors className="w-3 h-3 text-gray-600" />
                  <span>✂ CUT ALONG DASHED LINE TO SEPARATE HALF-PAGE (148.5 MM) ✂</span>
                </div>
              </div>
            )}

            {/* Ticket 2 (Bottom Half) or Paper-Saver Prompt */}
            {ticketMode === 'double' ? (
              <div className="relative pt-1 print:pt-0 print:static">
                {renderTicketCard(true)}
              </div>
            ) : (
              /* Single ticket placeholder showing paper savings */
              <div className="p-8 border-2 border-dashed border-gray-300 rounded bg-gray-50/60 text-center space-y-2 select-none print:hidden">
                <div className="w-10 h-10 rounded-full bg-kraft/40 text-industrial flex items-center justify-center mx-auto">
                  <Scissors className="w-5 h-5 text-gray-600" />
                </div>
                <h4 className="text-sm font-bold text-gray-800">
                  Lower Half A4 Paper Section (Free Space)
                </h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  In production, operators cut this sheet in half to save 50% paper, or switch to{' '}
                  <strong className="text-gray-800">&quot;2 Tickets per Sheet&quot;</strong> in the toolbar above to print an identical duplicate copy for machine staging.
                </p>
                <Button
                  onClick={() => setTicketMode('double')}
                  size="sm"
                  variant="outline"
                  className="mt-2 text-xs border-gray-400 hover:bg-gray-200 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-yellow-600" />
                  Enable 2-Ticket Paper-Saver Mode
                </Button>
              </div>
            )}

            {/* Sheet Footer Watermark (Hidden in print) */}
            <div className="pt-4 mt-6 border-t border-dashed border-gray-300 flex items-center justify-between text-[9px] font-mono text-gray-400 uppercase print:hidden">
              <span>Job Card System • Corrugated Packaging Manufacturing OS</span>
              <span>ISO 216 Standard A4 Layout</span>
            </div>
          </div>
        </div>

        {/* Bottom Helper Bar (Hidden in print) */}
        <div className="px-4 py-2.5 bg-industrial border-t border-kraft-dark/30 flex flex-wrap items-center justify-between gap-2 text-xs flex-shrink-0 print:hidden">
          <div className="flex items-center gap-2 text-kraft-light/80">
            <Info className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span>
              <strong>Print Setting Tip:</strong> In the browser print dialog, select <strong>A4 Portrait</strong> with <strong>Margins: None / Minimum</strong> for exact edge alignment.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              className="bg-yellow-400 hover:bg-yellow-300 text-industrial font-black flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print (Ctrl + P)</span>
            </Button>
            <Button
              onClick={onClose}
              size="sm"
              variant="outline"
              className="border-kraft-dark/40 text-kraft-light hover:bg-kraft/20 cursor-pointer"
            >
              Close
            </Button>
          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
