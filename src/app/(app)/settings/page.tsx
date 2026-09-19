'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Settings as SettingsIcon,
  Globe,
  ExternalLink,
  Sliders,
  Ruler,
  DollarSign,
  Building2,
  RotateCcw,
  Save,
  CheckCircle2,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  CalculatorPreferences,
  DEFAULT_CALCULATOR_PREFERENCES,
  loadCalculatorPreferences,
  saveCalculatorPreferences,
  PaperGrade,
  FluteType
} from '@/lib/calculator-defaults';

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<CalculatorPreferences>(DEFAULT_CALCULATOR_PREFERENCES);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'website' | 'calculator' | 'costing' | 'plant'>('calculator');

  // Load preferences from localStorage on mount
  useEffect(() => {
    const loaded = loadCalculatorPreferences();
    setPreferences(loaded);
  }, []);

  const handleSave = () => {
    saveCalculatorPreferences(preferences);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleReset = () => {
    if (confirm('Reset all calculator parameters and machine calibrations to packaging industry standards?')) {
      setPreferences(DEFAULT_CALCULATOR_PREFERENCES);
      saveCalculatorPreferences(DEFAULT_CALCULATOR_PREFERENCES);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kraft-dark/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kraft text-industrial text-xs font-mono font-bold tracking-wider uppercase mb-2 border border-kraft-dark/20">
            <SettingsIcon className="w-3.5 h-3.5" />
            CONTROL PANEL & CONFIGURATION
          </div>
          <h1 className="text-3xl font-extrabold text-industrial tracking-tight">System & Plant Settings</h1>
          <p className="text-sm text-industrial/70 mt-1">
            Customize machine take-up factors, structural allowances, conversion costs, and access the customer marketing website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-kraft-dark/30 hover:bg-kraft/30 text-industrial text-xs font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset Defaults
          </Button>

          <Button
            onClick={handleSave}
            className="bg-industrial text-white hover:bg-industrial-dark text-xs font-bold shadow-sm"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-green-400" />
                Settings Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1.5" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Floating Save Alert */}
      {savedSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center justify-between shadow-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm font-medium">
              Your custom packaging engineering preferences have been saved and applied to all calculations!
            </p>
          </div>
          <Link
            href="/calculator"
            className="text-xs font-bold text-green-700 underline hover:text-green-900"
          >
            Test in Calculator &rarr;
          </Link>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-kraft-dark/15 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-bold transition-colors whitespace-nowrap ${
            activeTab === 'calculator'
              ? 'bg-industrial text-white'
              : 'text-industrial/70 hover:text-industrial hover:bg-kraft/30'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Machine Calibration & Flutes
        </button>

        <button
          onClick={() => setActiveTab('costing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-bold transition-colors whitespace-nowrap ${
            activeTab === 'costing'
              ? 'bg-industrial text-white'
              : 'text-industrial/70 hover:text-industrial hover:bg-kraft/30'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Costing & Paper Rates
        </button>

        <button
          onClick={() => setActiveTab('website')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-bold transition-colors whitespace-nowrap ${
            activeTab === 'website'
              ? 'bg-industrial text-white'
              : 'text-industrial/70 hover:text-industrial hover:bg-kraft/30'
          }`}
        >
          <Globe className="w-4 h-4" />
          Public Website Portal
        </button>

        <button
          onClick={() => setActiveTab('plant')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-bold transition-colors whitespace-nowrap ${
            activeTab === 'plant'
              ? 'bg-industrial text-white'
              : 'text-industrial/70 hover:text-industrial hover:bg-kraft/30'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Plant Profile
        </button>
      </div>

      {/* ─── TAB 1: MACHINE CALIBRATION & FLUTES ─────────────────────────── */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          {/* Flute Take-Up Factors */}
          <div className="bg-white rounded-xl border border-kraft-dark/20 p-6 shadow-xs space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-industrial flex items-center gap-2">
                  <Layers className="w-5 h-5 text-kraft-dark" />
                  Flute Take-Up Factors (Draw Ratio)
                </h3>
                <p className="text-xs text-industrial/60 mt-1">
                  Adjust the corrugated flute draw ratio for your corrugating rolls. A higher factor indicates taller flutes requiring more paper length per linear meter.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-kraft/40 text-industrial font-mono text-[11px] font-bold">
                PLANT CALIBRATION
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {(['A', 'B', 'C', 'E', 'F', 'BC'] as FluteType[]).map((flute) => (
                <div key={flute} className="p-3 bg-kraft-lighter/50 rounded-lg border border-kraft-dark/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-industrial">{flute}-Flute</span>
                    <span className="text-[10px] font-mono text-industrial/50">Ratio</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="1.0"
                    max="2.5"
                    value={preferences.takeUpFactors[flute]}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        takeUpFactors: {
                          ...preferences.takeUpFactors,
                          [flute]: parseFloat(e.target.value) || 1.0,
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-kraft-dark/30 rounded font-mono text-sm font-bold text-industrial focus:outline-none focus:ring-1 focus:ring-industrial"
                  />
                  <p className="text-[10px] text-industrial/50 font-mono">
                    {flute === 'B' ? 'Fine (2.5mm)' : flute === 'C' ? 'Med (3.6mm)' : flute === 'E' ? 'Micro (1.5mm)' : flute === 'A' ? 'Coarse (4.8mm)' : flute === 'BC' ? 'Double Wall' : 'Micro Flute'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Structural Allowances */}
          <div className="bg-white rounded-xl border border-kraft-dark/20 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-industrial flex items-center gap-2">
                <Ruler className="w-5 h-5 text-kraft-dark" />
                Box Geometry & Cutting Allowances (mm)
              </h3>
              <p className="text-xs text-industrial/60 mt-1">
                Standard folding, creasing, and stitching allowances used to calculate cutting length and cutting width from internal box dimensions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-industrial flex items-center justify-between">
                  <span>Stitching / Joint Flap Allowance</span>
                  <span className="text-[11px] font-mono text-industrial/60">mm</span>
                </label>
                <input
                  type="number"
                  value={preferences.allowances.stitchingFlap}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      allowances: {
                        ...preferences.allowances,
                        stitchingFlap: parseInt(e.target.value) || 35,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-sm font-mono font-bold"
                />
                <p className="text-[11px] text-industrial/50">Default RSC overlap joint (standard 35mm)</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-industrial flex items-center justify-between">
                  <span>3-Ply Creasing Allowance</span>
                  <span className="text-[11px] font-mono text-industrial/60">mm</span>
                </label>
                <input
                  type="number"
                  value={preferences.allowances.creasing3Ply}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      allowances: {
                        ...preferences.allowances,
                        creasing3Ply: parseInt(e.target.value) || 6,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-sm font-mono font-bold"
                />
                <p className="text-[11px] text-industrial/50">Folding score loss for 3-ply boards (typically 6mm)</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-industrial flex items-center justify-between">
                  <span>5-Ply Creasing Allowance</span>
                  <span className="text-[11px] font-mono text-industrial/60">mm</span>
                </label>
                <input
                  type="number"
                  value={preferences.allowances.creasing5Ply}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      allowances: {
                        ...preferences.allowances,
                        creasing5Ply: parseInt(e.target.value) || 10,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-sm font-mono font-bold"
                />
                <p className="text-[11px] text-industrial/50">Folding score loss for 5-ply boards (typically 10mm)</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-industrial flex items-center justify-between">
                  <span>7-Ply Creasing Allowance</span>
                  <span className="text-[11px] font-mono text-industrial/60">mm</span>
                </label>
                <input
                  type="number"
                  value={preferences.allowances.creasing7Ply}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      allowances: {
                        ...preferences.allowances,
                        creasing7Ply: parseInt(e.target.value) || 14,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-sm font-mono font-bold"
                />
                <p className="text-[11px] text-industrial/50">Heavy duty score loss for 7-ply (typically 14mm)</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-industrial flex items-center justify-between">
                  <span>Reel Trim Margin</span>
                  <span className="text-[11px] font-mono text-industrial/60">mm</span>
                </label>
                <input
                  type="number"
                  value={preferences.allowances.trimMarginMm}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      allowances: {
                        ...preferences.allowances,
                        trimMarginMm: parseInt(e.target.value) || 50,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-sm font-mono font-bold"
                />
                <p className="text-[11px] text-industrial/50">Reel width safety trim allowance (50mm / ~2 inches)</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-industrial flex items-center justify-between">
                  <span>Trim Scrap Waste %</span>
                  <span className="text-[11px] font-mono text-industrial/60">%</span>
                </label>
                <input
                  type="number"
                  value={preferences.allowances.trimWastePercent}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      allowances: {
                        ...preferences.allowances,
                        trimWastePercent: parseFloat(e.target.value) || 5,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-sm font-mono font-bold"
                />
                <p className="text-[11px] text-industrial/50">Standard slotter & edge trim scrap allowance</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: COSTING & PAPER RATES ─────────────────────────────── */}
      {activeTab === 'costing' && (
        <div className="space-y-6">
          {/* Conversion & Processing Costs */}
          <div className="bg-white rounded-xl border border-kraft-dark/20 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-industrial flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-kraft-dark" />
                Manufacturing & Operational Costs
              </h3>
              <p className="text-xs text-industrial/60 mt-1">
                Configure processing costs, stitching, printing, and profit margins used in box commercial price estimation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-industrial">Currency Symbol</label>
                <select
                  value={preferences.costing.currency}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      costing: { ...preferences.costing, currency: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-sm font-bold"
                >
                  <option value="₹">₹ (INR - Rupee)</option>
                  <option value="$">$ (USD - Dollar)</option>
                  <option value="€">€ (EUR - Euro)</option>
                  <option value="£">£ (GBP - Pound)</option>
                  <option value="AED">AED (Dirham)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-industrial">Conversion Cost per Kg</label>
                <input
                  type="number"
                  step="0.1"
                  value={preferences.costing.conversionCostPerKg}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      costing: {
                        ...preferences.costing,
                        conversionCostPerKg: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-sm font-mono font-bold"
                />
                <p className="text-[11px] text-industrial/50">Power, steam, starch, operator labor per kg</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-industrial">Stitching Cost per Box</label>
                <input
                  type="number"
                  step="0.05"
                  value={preferences.costing.stitchingCostPerBox}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      costing: {
                        ...preferences.costing,
                        stitchingCostPerBox: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-sm font-mono font-bold"
                />
                <p className="text-[11px] text-industrial/50">Wire pins & manual/auto stitch labor</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-industrial">Printing Cost per Color / Box</label>
                <input
                  type="number"
                  step="0.05"
                  value={preferences.costing.printingCostPerColor}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      costing: {
                        ...preferences.costing,
                        printingCostPerColor: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-sm font-mono font-bold"
                />
                <p className="text-[11px] text-industrial/50">Flexo water-based ink & stereo wear</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-industrial">Factory Overhead Markup %</label>
                <input
                  type="number"
                  value={preferences.costing.overheadPercent}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      costing: {
                        ...preferences.costing,
                        overheadPercent: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-sm font-mono font-bold"
                />
                <p className="text-[11px] text-industrial/50">Rent, depreciation, administration</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-industrial">Target Profit Margin %</label>
                <input
                  type="number"
                  value={preferences.costing.profitMarginPercent}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      costing: {
                        ...preferences.costing,
                        profitMarginPercent: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-sm font-mono font-bold"
                />
                <p className="text-[11px] text-industrial/50">Net target markup on manufactured cost</p>
              </div>
            </div>
          </div>

          {/* Paper Rates per Kg */}
          <div className="bg-white rounded-xl border border-kraft-dark/20 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-industrial flex items-center gap-2">
                <Layers className="w-5 h-5 text-kraft-dark" />
                Paper Reel Rates & Benchmark Burst Factor (BF)
              </h3>
              <p className="text-xs text-industrial/60 mt-1">
                Enter your current paper purchase procurement rates per kg. These will populate the layer rate fields automatically in the Corrugation Calculator.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {(Object.keys(preferences.paperRates) as PaperGrade[]).map((grade) => (
                <div key={grade} className="p-4 bg-kraft-lighter/40 rounded-xl border border-kraft-dark/15 space-y-3">
                  <span className="text-xs font-extrabold text-industrial block truncate">{grade}</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-industrial/60 uppercase">
                        Rate / Kg ({preferences.costing.currency})
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={preferences.paperRates[grade]}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            paperRates: {
                              ...preferences.paperRates,
                              [grade]: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-kraft-dark/30 rounded font-mono text-sm font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-industrial/60 uppercase">
                        Default BF
                      </label>
                      <input
                        type="number"
                        value={preferences.paperDefaultBf[grade]}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            paperDefaultBf: {
                              ...preferences.paperDefaultBf,
                              [grade]: parseInt(e.target.value) || 16,
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-kraft-dark/30 rounded font-mono text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: PUBLIC WEBSITE PORTAL ──────────────────────────────── */}
      {activeTab === 'website' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-kraft-dark/20 p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-kraft-dark/15">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-industrial/10 text-industrial text-xs font-mono font-bold">
                  <Globe className="w-3.5 h-3.5" />
                  MARKETING SHOWCASE & DEMO
                </div>
                <h3 className="text-2xl font-black text-industrial tracking-tight">Customer-Facing Website</h3>
                <p className="text-sm text-industrial/70 leading-relaxed">
                  The public website contains your marketing landing page, interactive sample box calculator, visual workflow roadmap, ROI calculator, and printable A4 ticket preview.
                </p>
              </div>

              <div className="flex-shrink-0">
                <a
                  href={preferences.websiteUrl || '/website'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-industrial text-white hover:bg-industrial-dark font-bold text-sm shadow-md transition-all group"
                >
                  <Globe className="w-4 h-4 text-kraft-lighter" />
                  <span>Visit Website</span>
                  <ExternalLink className="w-4 h-4 text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* URL Config */}
            <div className="space-y-3 pt-2">
              <label className="text-sm font-bold text-industrial block">
                Website Link / Destination URL
              </label>
              <div className="flex items-center gap-3 max-w-xl">
                <input
                  type="text"
                  value={preferences.websiteUrl}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      websiteUrl: e.target.value,
                    })
                  }
                  placeholder="/website or https://your-plant-domain.com"
                  className="flex-1 px-4 py-2.5 bg-white border border-kraft-dark/30 rounded-lg text-sm font-mono text-industrial focus:outline-none focus:ring-2 focus:ring-industrial"
                />
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="bg-industrial text-white hover:bg-industrial-dark"
                >
                  Update Link
                </Button>
              </div>
              <p className="text-xs text-industrial/50">
                Default: <code className="bg-kraft/40 px-1 py-0.5 rounded text-industrial font-bold">/website</code> (the built-in packaging showcase page). You can also provide an external corporate website URL.
              </p>
            </div>

            {/* Quick Preview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 bg-kraft-lighter/50 rounded-lg border border-kraft-dark/10 space-y-1">
                <p className="text-xs font-bold text-industrial">Landing Page</p>
                <p className="text-[11px] text-industrial/60">Features, ROI Estimator, and Industry Solutions</p>
              </div>
              <div className="p-4 bg-kraft-lighter/50 rounded-lg border border-kraft-dark/10 space-y-1">
                <p className="text-xs font-bold text-industrial">Ticket Preview</p>
                <p className="text-[11px] text-industrial/60">Interactive A4 sheet print simulator with sample specs</p>
              </div>
              <div className="p-4 bg-kraft-lighter/50 rounded-lg border border-kraft-dark/10 space-y-1">
                <p className="text-xs font-bold text-industrial">Workflow Visualizer</p>
                <p className="text-[11px] text-industrial/60">9-stage corrugated manufacturing process roadmap</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: PLANT PROFILE ──────────────────────────────────────── */}
      {activeTab === 'plant' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-kraft-dark/20 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-industrial flex items-center gap-2">
                <Building2 className="w-5 h-5 text-kraft-dark" />
                Packaging Plant & Factory Details
              </h3>
              <p className="text-xs text-industrial/60 mt-1">
                Company identity shown on generated calculation sheets and reports.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-industrial">Plant / Enterprise Name</label>
                <input
                  type="text"
                  value={preferences.companyName}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      companyName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-sm font-bold text-industrial"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-industrial">Measurement Units</label>
                <select
                  value={preferences.costing.unit}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      costing: {
                        ...preferences.costing,
                        unit: e.target.value as 'mm' | 'inch',
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-sm font-bold text-industrial"
                >
                  <option value="mm">Metric (Millimeters - mm)</option>
                  <option value="inch">Imperial (Inches - in)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="p-4 bg-kraft rounded-xl border border-kraft-dark/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-industrial/80">
          <Info className="w-4 h-4 text-industrial" />
          <span>Parameters are stored locally on your device and applied immediately to the Corrugation Calculator.</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-kraft-dark/30 hover:bg-kraft-lighter text-industrial text-xs font-bold"
          >
            Reset
          </Button>

          <Button
            onClick={handleSave}
            className="bg-industrial text-white hover:bg-industrial-dark text-xs font-bold"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
