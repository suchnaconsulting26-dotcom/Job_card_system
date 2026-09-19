/**
 * Universal Corrugation Packaging Engineering & Calculator Configuration
 * Calibrated for corrugated box packaging manufacturers, converters, and sheet plants.
 */

export type FluteType = 'A' | 'B' | 'C' | 'E' | 'F' | 'BC';

export type PaperGrade =
  | 'Virgin Golden Kraft'
  | 'Natural Semi-Kraft'
  | 'High BF Test Liner'
  | 'White Top Coated'
  | 'Duplex Board'
  | 'Recycled Fluting Medium';

export type BoxType = 'rsc' | 'die-cut' | 'sheet';

export type JointType = 'stitched' | 'glued' | 'both';

export interface PlyLayerSpec {
  id: string;
  role: 'top-liner' | 'flute' | 'inner-liner' | 'bottom-liner';
  name: string;
  paperGrade: PaperGrade;
  gsm: number;
  bf: number; // Burst Factor (e.g. 16, 18, 20, 22, 24, 28, 35)
  flute?: FluteType;
  takeUpFactor: number;
  ratePerKg: number;
}

export interface CalculatorPreferences {
  // Machine Calibration: Flute Take-up factors
  takeUpFactors: Record<FluteType, number>;

  // Structural Allowances (in mm)
  allowances: {
    stitchingFlap: number; // RSC joint flap (default 35mm)
    creasing3Ply: number; // Creasing allowance for 3-ply (default 6mm)
    creasing5Ply: number; // Creasing allowance for 5-ply (default 10mm)
    creasing7Ply: number; // Creasing allowance for 7-ply (default 14mm)
    trimMarginMm: number; // Deckle roll trim margin (default 50mm / 2 inches)
    trimWastePercent: number; // Trim scrap allowance % (default 5%)
  };

  // Costing & Conversion Constants
  costing: {
    conversionCostPerKg: number; // Plant processing cost per kg (e.g. ₹8.00)
    stitchingCostPerBox: number; // Stitching cost per box (e.g. ₹0.50)
    gluingCostPerBox: number; // Glue cost per box (e.g. ₹0.40)
    printingCostPerColor: number; // Flexo ink & plate wash per color per box (e.g. ₹0.35)
    overheadPercent: number; // Factory overhead percentage (e.g. 5%)
    profitMarginPercent: number; // Profit markup percentage (e.g. 12%)
    currency: string; // ₹, $, €, £
    unit: 'mm' | 'inch';
  };

  // Default paper rates per kg
  paperRates: Record<PaperGrade, number>;
  paperDefaultBf: Record<PaperGrade, number>;

  // Website Portal Configuration
  websiteUrl: string;
  companyName: string;
}

export const DEFAULT_CALCULATOR_PREFERENCES: CalculatorPreferences = {
  takeUpFactors: {
    A: 1.55,
    B: 1.35,
    C: 1.45,
    E: 1.25,
    F: 1.18,
    BC: 1.42,
  },
  allowances: {
    stitchingFlap: 35,
    creasing3Ply: 6,
    creasing5Ply: 10,
    creasing7Ply: 14,
    trimMarginMm: 50,
    trimWastePercent: 5,
  },
  costing: {
    conversionCostPerKg: 8.5,
    stitchingCostPerBox: 0.5,
    gluingCostPerBox: 0.4,
    printingCostPerColor: 0.35,
    overheadPercent: 5,
    profitMarginPercent: 12,
    currency: '₹',
    unit: 'mm',
  },
  paperRates: {
    'Virgin Golden Kraft': 52.0,
    'Natural Semi-Kraft': 44.0,
    'High BF Test Liner': 41.0,
    'White Top Coated': 58.0,
    'Duplex Board': 48.0,
    'Recycled Fluting Medium': 38.0,
  },
  paperDefaultBf: {
    'Virgin Golden Kraft': 22,
    'Natural Semi-Kraft': 18,
    'High BF Test Liner': 20,
    'White Top Coated': 24,
    'Duplex Board': 20,
    'Recycled Fluting Medium': 16,
  },
  websiteUrl: '/website',
  companyName: 'MARUTI AGRO FOODS EXPORTS PVT LTD',
};

const STORAGE_KEY = 'boxcraft_universal_calculator_preferences_v1';

export function loadCalculatorPreferences(): CalculatorPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_CALCULATOR_PREFERENCES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CALCULATOR_PREFERENCES;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CALCULATOR_PREFERENCES,
      ...parsed,
      takeUpFactors: {
        ...DEFAULT_CALCULATOR_PREFERENCES.takeUpFactors,
        ...(parsed.takeUpFactors || {}),
      },
      allowances: {
        ...DEFAULT_CALCULATOR_PREFERENCES.allowances,
        ...(parsed.allowances || {}),
      },
      costing: {
        ...DEFAULT_CALCULATOR_PREFERENCES.costing,
        ...(parsed.costing || {}),
      },
      paperRates: {
        ...DEFAULT_CALCULATOR_PREFERENCES.paperRates,
        ...(parsed.paperRates || {}),
      },
      paperDefaultBf: {
        ...DEFAULT_CALCULATOR_PREFERENCES.paperDefaultBf,
        ...(parsed.paperDefaultBf || {}),
      },
    };
  } catch {
    return DEFAULT_CALCULATOR_PREFERENCES;
  }
}

export function saveCalculatorPreferences(prefs: CalculatorPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.error('Failed to save calculator preferences to localStorage', err);
  }
}

export function createDefaultLayers(
  ply: '3' | '5' | '7',
  prefs: CalculatorPreferences
): PlyLayerSpec[] {
  if (ply === '3') {
    return [
      {
        id: 'layer-1',
        role: 'top-liner',
        name: 'Top Liner (Outside)',
        paperGrade: 'Virgin Golden Kraft',
        gsm: 180,
        bf: prefs.paperDefaultBf['Virgin Golden Kraft'] || 22,
        takeUpFactor: 1.0,
        ratePerKg: prefs.paperRates['Virgin Golden Kraft'] || 52,
      },
      {
        id: 'layer-2',
        role: 'flute',
        name: 'Fluting Medium',
        paperGrade: 'Recycled Fluting Medium',
        gsm: 140,
        bf: prefs.paperDefaultBf['Recycled Fluting Medium'] || 16,
        flute: 'B',
        takeUpFactor: prefs.takeUpFactors.B || 1.35,
        ratePerKg: prefs.paperRates['Recycled Fluting Medium'] || 38,
      },
      {
        id: 'layer-3',
        role: 'bottom-liner',
        name: 'Inside Liner',
        paperGrade: 'High BF Test Liner',
        gsm: 150,
        bf: prefs.paperDefaultBf['High BF Test Liner'] || 20,
        takeUpFactor: 1.0,
        ratePerKg: prefs.paperRates['High BF Test Liner'] || 41,
      },
    ];
  }

  if (ply === '5') {
    return [
      {
        id: 'layer-1',
        role: 'top-liner',
        name: 'Top Liner (Outside)',
        paperGrade: 'Virgin Golden Kraft',
        gsm: 180,
        bf: prefs.paperDefaultBf['Virgin Golden Kraft'] || 22,
        takeUpFactor: 1.0,
        ratePerKg: prefs.paperRates['Virgin Golden Kraft'] || 52,
      },
      {
        id: 'layer-2',
        role: 'flute',
        name: 'Flute 1 (Outer Flute)',
        paperGrade: 'Recycled Fluting Medium',
        gsm: 140,
        bf: prefs.paperDefaultBf['Recycled Fluting Medium'] || 16,
        flute: 'B',
        takeUpFactor: prefs.takeUpFactors.B || 1.35,
        ratePerKg: prefs.paperRates['Recycled Fluting Medium'] || 38,
      },
      {
        id: 'layer-3',
        role: 'inner-liner',
        name: 'Center Divider Liner',
        paperGrade: 'Natural Semi-Kraft',
        gsm: 140,
        bf: prefs.paperDefaultBf['Natural Semi-Kraft'] || 18,
        takeUpFactor: 1.0,
        ratePerKg: prefs.paperRates['Natural Semi-Kraft'] || 44,
      },
      {
        id: 'layer-4',
        role: 'flute',
        name: 'Flute 2 (Inner Flute)',
        paperGrade: 'Recycled Fluting Medium',
        gsm: 140,
        bf: prefs.paperDefaultBf['Recycled Fluting Medium'] || 16,
        flute: 'C',
        takeUpFactor: prefs.takeUpFactors.C || 1.45,
        ratePerKg: prefs.paperRates['Recycled Fluting Medium'] || 38,
      },
      {
        id: 'layer-5',
        role: 'bottom-liner',
        name: 'Inside Liner (Bottom)',
        paperGrade: 'High BF Test Liner',
        gsm: 150,
        bf: prefs.paperDefaultBf['High BF Test Liner'] || 20,
        takeUpFactor: 1.0,
        ratePerKg: prefs.paperRates['High BF Test Liner'] || 41,
      },
    ];
  }

  // 7-Ply
  return [
    {
      id: 'layer-1',
      role: 'top-liner',
      name: 'Top Liner (Outside)',
      paperGrade: 'Virgin Golden Kraft',
      gsm: 200,
      bf: prefs.paperDefaultBf['Virgin Golden Kraft'] || 24,
      takeUpFactor: 1.0,
      ratePerKg: prefs.paperRates['Virgin Golden Kraft'] || 52,
    },
    {
      id: 'layer-2',
      role: 'flute',
      name: 'Flute 1',
      paperGrade: 'Recycled Fluting Medium',
      gsm: 140,
      bf: prefs.paperDefaultBf['Recycled Fluting Medium'] || 16,
      flute: 'B',
      takeUpFactor: prefs.takeUpFactors.B || 1.35,
      ratePerKg: prefs.paperRates['Recycled Fluting Medium'] || 38,
    },
    {
      id: 'layer-3',
      role: 'inner-liner',
      name: 'Center Liner 1',
      paperGrade: 'Natural Semi-Kraft',
      gsm: 150,
      bf: prefs.paperDefaultBf['Natural Semi-Kraft'] || 18,
      takeUpFactor: 1.0,
      ratePerKg: prefs.paperRates['Natural Semi-Kraft'] || 44,
    },
    {
      id: 'layer-4',
      role: 'flute',
      name: 'Flute 2',
      paperGrade: 'Recycled Fluting Medium',
      gsm: 140,
      bf: prefs.paperDefaultBf['Recycled Fluting Medium'] || 16,
      flute: 'C',
      takeUpFactor: prefs.takeUpFactors.C || 1.45,
      ratePerKg: prefs.paperRates['Recycled Fluting Medium'] || 38,
    },
    {
      id: 'layer-5',
      role: 'inner-liner',
      name: 'Center Liner 2',
      paperGrade: 'Natural Semi-Kraft',
      gsm: 150,
      bf: prefs.paperDefaultBf['Natural Semi-Kraft'] || 18,
      takeUpFactor: 1.0,
      ratePerKg: prefs.paperRates['Natural Semi-Kraft'] || 44,
    },
    {
      id: 'layer-6',
      role: 'flute',
      name: 'Flute 3',
      paperGrade: 'Recycled Fluting Medium',
      gsm: 140,
      bf: prefs.paperDefaultBf['Recycled Fluting Medium'] || 16,
      flute: 'E',
      takeUpFactor: prefs.takeUpFactors.E || 1.25,
      ratePerKg: prefs.paperRates['Recycled Fluting Medium'] || 38,
    },
    {
      id: 'layer-7',
      role: 'bottom-liner',
      name: 'Inside Liner (Bottom)',
      paperGrade: 'High BF Test Liner',
      gsm: 180,
      bf: prefs.paperDefaultBf['High BF Test Liner'] || 20,
      takeUpFactor: 1.0,
      ratePerKg: prefs.paperRates['High BF Test Liner'] || 41,
    },
  ];
}
