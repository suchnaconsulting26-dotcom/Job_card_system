'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Sliders,
  Layers,
  ArrowRight,
  PackageCheck,
  Scale,
  DollarSign,
  Printer,
  Sparkles,
  Info,
  Maximize2,
  RefreshCw,
  FileSpreadsheet,
  Check,
  Building2,
  HelpCircle,
  ChevronDown,
  Plus,
  Tag,
  Box,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Client } from '@/lib/types';
import { getIndustriesAction, createIndustryAction, getInventoryItemsAction, createQuickItemAction } from '@/lib/actions';
import { MasterCatalogItem, mergeCatalogItems, saveLocalCustomItem } from '@/lib/item-catalog';
import {
  CalculatorPreferences,
  DEFAULT_CALCULATOR_PREFERENCES,
  loadCalculatorPreferences,
  PlyLayerSpec,
  createDefaultLayers,
  PaperGrade,
  FluteType,
  BoxType,
  JointType,
} from '@/lib/calculator-defaults';

export default function UniversalCalculatorPage() {
  const [preferences, setPreferences] = useState<CalculatorPreferences>(DEFAULT_CALCULATOR_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Box Geometry
  const [boxType, setBoxType] = useState<BoxType>('rsc');
  const [length, setLength] = useState<number>(400); // mm
  const [width, setWidth] = useState<number>(300); // mm
  const [height, setHeight] = useState<number>(250); // mm
  const [quantity, setQuantity] = useState<number>(2500); // pcs
  const [partyName, setPartyName] = useState<string>('Maruti Agro Foods Exports Pvt Ltd');
  const [boxName, setBoxName] = useState<string>('Universal Corrugated Shipper Carton');

  // Client / Registered Industries Selection
  const [industries, setIndustries] = useState<Client[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreatingIndustry, setIsCreatingIndustry] = useState(false);
  const [justAddedMessage, setJustAddedMessage] = useState<string | null>(null);
  const clientDropdownRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  // Master Item Catalog Selection & Quick Save
  const [catalogItems, setCatalogItems] = useState<MasterCatalogItem[]>([]);
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [itemLoadedMessage, setItemLoadedMessage] = useState<string | null>(null);
  const itemContainerRef = useRef<HTMLDivElement>(null);

  // Board Spec
  const [ply, setPly] = useState<'3' | '5' | '7'>('5');
  const [layers, setLayers] = useState<PlyLayerSpec[]>([]);
  const [joint, setJoint] = useState<JointType>('stitched');
  const [printingColors, setPrintingColors] = useState<number>(2); // 0, 1, 2, 3, 4 colors

  // Inline Quick Allowance Adjustments
  const [showAdvancedParams, setShowAdvancedParams] = useState(false);
  const [customFlap, setCustomFlap] = useState<number>(35);
  const [customTrimWaste, setCustomTrimWaste] = useState<number>(5);

  // Load preferences, industries, and item catalog on mount
  useEffect(() => {
    isMounted.current = true;
    const prefs = loadCalculatorPreferences();
    setPreferences(prefs);
    setCustomFlap(prefs.allowances.stitchingFlap);
    setCustomTrimWaste(prefs.allowances.trimWastePercent);
    setLayers(createDefaultLayers('5', prefs));
    setIsLoaded(true);

    getIndustriesAction()
      .then((data) => {
        if (isMounted.current && data) {
          setIndustries(data);
        }
      })
      .catch(console.error);

    getInventoryItemsAction()
      .then((dbItems) => {
        if (isMounted.current) {
          setCatalogItems(mergeCatalogItems(dbItems || []));
        }
      })
      .catch((err) => {
        console.error('Failed to load item catalog:', err);
        if (isMounted.current) {
          setCatalogItems(mergeCatalogItems([]));
        }
      });

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        clientDropdownRef.current &&
        !clientDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        itemContainerRef.current &&
        !itemContainerRef.current.contains(event.target as Node)
      ) {
        setIsItemDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Client search helpers
  const trimmedQuery = partyName.trim().toLowerCase();
  const filteredIndustries = industries.filter((ind) =>
    ind.name.toLowerCase().includes(trimmedQuery)
  );
  const isRegisteredIndustry = industries.some(
    (ind) => ind.name.toLowerCase() === trimmedQuery
  );
  const showAddNew = partyName.trim().length > 0 && !isRegisteredIndustry;

  async function handleAddNewIndustry() {
    const trimmed = partyName.trim();
    if (!trimmed || isCreatingIndustry) return;

    setIsCreatingIndustry(true);
    try {
      const result = await createIndustryAction(trimmed);
      if (result?.error) {
        console.error(result.error);
      } else if (result?.client) {
        setIndustries((prev) => [...prev, result.client]);
        setPartyName(result.client.name);
        setJustAddedMessage(`"${result.client.name}" registered!`);
        setTimeout(() => {
          if (isMounted.current) {
            setJustAddedMessage(null);
          }
        }, 3500);
        setIsDropdownOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (isMounted.current) {
        setIsCreatingIndustry(false);
      }
    }
  }

  // When Ply changes, reset layers with current preferences
  const handlePlyChange = (newPly: '3' | '5' | '7') => {
    setPly(newPly);
    setLayers(createDefaultLayers(newPly, preferences));
  };

  // Update a single layer's property
  const handleLayerUpdate = (id: string, updates: Partial<PlyLayerSpec>) => {
    setLayers((prev) =>
      prev.map((layer) => {
        if (layer.id !== id) return layer;
        const updated = { ...layer, ...updates };

        // If paper grade changed, auto-update default rate and BF from preferences
        if (updates.paperGrade && updates.paperGrade !== layer.paperGrade) {
          const newGrade = updates.paperGrade;
          updated.ratePerKg = preferences.paperRates[newGrade] || updated.ratePerKg;
          updated.bf = preferences.paperDefaultBf[newGrade] || updated.bf;
        }

        // If flute changed, auto-update take-up factor
        if (updates.flute && updates.flute !== layer.flute) {
          updated.takeUpFactor = preferences.takeUpFactors[updates.flute] || 1.35;
        }

        return updated;
      })
    );
  };

  // Presets
  const applyPreset = (presetName: string) => {
    if (presetName === '5ply-master') {
      setBoxType('rsc');
      setLength(480);
      setWidth(340);
      setHeight(180);
      setPly('5');
      setBoxName('10 Kg Fresh Mango Export Shipper');
      setLayers(createDefaultLayers('5', preferences));
      setPrintingColors(3);
    } else if (presetName === '7ply-heavy') {
      setBoxType('rsc');
      setLength(600);
      setWidth(400);
      setHeight(400);
      setPly('7');
      setBoxName('Industrial Machinery Bulk Shipper');
      setLayers(createDefaultLayers('7', preferences));
      setPrintingColors(1);
    } else if (presetName === '3ply-ecommerce') {
      setBoxType('rsc');
      setLength(250);
      setWidth(180);
      setHeight(120);
      setPly('3');
      setBoxName('E-Commerce Delivery Mailer Box');
      setLayers(createDefaultLayers('3', preferences));
      setPrintingColors(1);
    }
  };

  // ─── PACKAGING ENGINEERING CALCULATIONS ────────────────────────────────────
  const calc = useMemo(() => {
    // 1. Structural Dimensions
    const creasingLoss =
      ply === '3'
        ? preferences.allowances.creasing3Ply
        : ply === '5'
        ? preferences.allowances.creasing5Ply
        : preferences.allowances.creasing7Ply;

    let cuttingLength = 0;
    let cuttingWidth = 0;

    if (boxType === 'rsc') {
      // Standard RSC layout:
      // Cutting Length = 2 * (L + W) + Joint Flap + Creasing Loss
      cuttingLength = 2 * (length + width) + customFlap + creasingLoss;
      // Cutting Width = W + H + top/bottom flap creasing loss
      cuttingWidth = width + height + (ply === '3' ? 4 : 8);
    } else if (boxType === 'die-cut') {
      // Die-cut blank: roughly L + 2H by W + 2H
      cuttingLength = length + 2 * height + 20;
      cuttingWidth = width + 2 * height + 20;
    } else {
      // Sheet only
      cuttingLength = length;
      cuttingWidth = width;
    }

    // Deckle Size in inches (standard roll width calculation with trim allowance)
    const deckleInches = Math.ceil((cuttingWidth + preferences.allowances.trimMarginMm) / 25.4);
    const cuttingLengthInches = (cuttingLength / 25.4).toFixed(1);
    const cuttingWidthInches = (cuttingWidth / 25.4).toFixed(1);

    // Sheet Area (m² & sq.ft)
    const sheetAreaSqM = (cuttingLength * cuttingWidth) / 1_000_000;
    const sheetAreaSqFt = sheetAreaSqM * 10.7639;

    // 2. Layer-by-layer GSM and Paper Weight
    let totalBoardGsm = 0;
    let totalPaperCostPerBox = 0;

    const layerBreakdown = layers.map((layer) => {
      // Effective GSM considering take-up factor for fluted paper
      const effectiveGsm = Math.round(layer.gsm * layer.takeUpFactor);
      totalBoardGsm += effectiveGsm;

      // Weight of this layer per box (grams)
      const weightGram = sheetAreaSqM * effectiveGsm;
      // Cost of this layer per box
      const costPerBox = (weightGram / 1000) * layer.ratePerKg;
      totalPaperCostPerBox += costPerBox;

      // Total reel requirement for batch (kg) with trim waste
      const batchReelKg = Math.round(
        (weightGram * quantity) / 1000 * (1 + customTrimWaste / 100)
      );

      return {
        ...layer,
        effectiveGsm,
        weightGram: Math.round(weightGram * 10) / 10,
        costPerBox: Math.round(costPerBox * 100) / 100,
        batchReelKg,
      };
    });

    // 3. Box Weights
    const weightPerBoxGram = Math.round(sheetAreaSqM * totalBoardGsm);
    const weightPerBoxKg = weightPerBoxGram / 1000;
    const totalOrderNetWeightKg = Math.round(weightPerBoxKg * quantity);
    const totalOrderReelWeightKg = Math.round(
      totalOrderNetWeightKg * (1 + customTrimWaste / 100)
    );
    const totalOrderReelWeightMT = (totalOrderReelWeightKg / 1000).toFixed(2);

    // 4. Strength Predictions (Bursting Strength & BCT)
    // Board Bursting Strength (BS) = sum(GSM * BF) / 1000 in kg/cm²
    let weightedBfSum = 0;
    layers.forEach((l) => {
      weightedBfSum += (l.gsm * l.bf * l.takeUpFactor);
    });
    const estimatedBsKgCm2 = (weightedBfSum / 10000).toFixed(1); // Standard kg/cm²
    const estimatedBsKpa = Math.round(parseFloat(estimatedBsKgCm2) * 98.0665);
    const boardBf = (totalBoardGsm > 0 ? (weightedBfSum / (totalBoardGsm * 10)) : 0).toFixed(1);

    // McKee formula Box Compression Test (BCT) approximation in kgf
    // BCT = 5.87 * ECT * sqrt(caliper * box perimeter)
    const caliperMm = ply === '3' ? 3.0 : ply === '5' ? 6.5 : 9.5;
    const estimatedEct = ((totalBoardGsm * 0.0075) * (ply === '5' ? 1.2 : ply === '7' ? 1.4 : 1.0)).toFixed(1); // kN/m
    const perimeterMm = 2 * (length + width);
    const estimatedBctKgf = Math.round(
      1.82 * parseFloat(estimatedEct) * Math.sqrt((caliperMm * perimeterMm) / 10)
    );

    // 5. Costing Breakdown
    const conversionCostPerBox = weightPerBoxKg * preferences.costing.conversionCostPerKg;
    const stitchingCostPerBox =
      joint === 'stitched' || joint === 'both' ? preferences.costing.stitchingCostPerBox : 0;
    const gluingCostPerBox =
      joint === 'glued' || joint === 'both' ? preferences.costing.gluingCostPerBox : 0;
    const printingCostPerBox = printingColors * preferences.costing.printingCostPerColor;

    const baseManufacturingCost =
      totalPaperCostPerBox +
      conversionCostPerBox +
      stitchingCostPerBox +
      gluingCostPerBox +
      printingCostPerBox;

    const overheadCost = baseManufacturingCost * (preferences.costing.overheadPercent / 100);
    const totalFactoryCost = baseManufacturingCost + overheadCost;
    const profitCost = totalFactoryCost * (preferences.costing.profitMarginPercent / 100);
    const sellingPricePerBox = Math.round((totalFactoryCost + profitCost) * 100) / 100;
    const totalOrderValue = Math.round(sellingPricePerBox * quantity);

    return {
      cuttingLength,
      cuttingWidth,
      cuttingLengthInches,
      cuttingWidthInches,
      deckleInches,
      sheetAreaSqM: sheetAreaSqM.toFixed(3),
      sheetAreaSqFt: sheetAreaSqFt.toFixed(2),
      totalBoardGsm: Math.round(totalBoardGsm),
      weightPerBoxGram,
      weightPerBoxKg: weightPerBoxKg.toFixed(3),
      totalOrderNetWeightKg,
      totalOrderReelWeightKg,
      totalOrderReelWeightMT,
      estimatedBsKgCm2,
      estimatedBsKpa,
      boardBf,
      estimatedEct,
      estimatedBctKgf,
      layerBreakdown,
      paperCostPerBox: Math.round(totalPaperCostPerBox * 100) / 100,
      conversionCostPerBox: Math.round(conversionCostPerBox * 100) / 100,
      stitchingCostPerBox,
      gluingCostPerBox,
      printingCostPerBox: Math.round(printingCostPerBox * 100) / 100,
      totalFactoryCost: Math.round(totalFactoryCost * 100) / 100,
      sellingPricePerBox,
      totalOrderValue,
    };
  }, [boxType, length, width, height, quantity, ply, layers, joint, printingColors, customFlap, customTrimWaste, preferences]);

  // Construct URL to pre-fill the Job Card creation form
  const createJobCardUrl = useMemo(() => {
    const params = new URLSearchParams({
      boxSizeL: String(length),
      boxSizeW: String(width),
      boxSizeH: String(height),
      cuttingSize: `${calc.cuttingLength} × ${calc.cuttingWidth} mm`,
      decalSize: `${calc.deckleInches} Inches`,
      quantity: String(quantity),
      ply: ply,
      topPaper: layers[0]?.paperGrade || 'Virgin Golden Kraft',
      liner: layers[layers.length - 1]?.paperGrade || 'High BF Test Liner',
      gsm: layers.map((l) => l.gsm).join(' / '),
      printingColor: printingColors > 0 ? `${printingColors}-Color Flexo` : 'Plain Unprinted',
      stitching: String(joint !== 'glued'),
      boxName: boxName,
      partyName: partyName,
      from: 'calculator',
    });
    return `/create?${params.toString()}`;
  }, [length, width, height, calc, quantity, ply, layers, printingColors, joint, boxName, partyName]);

  // Item Catalog search helpers
  const trimmedItemQuery = boxName.trim().toLowerCase();
  const filteredCatalogItems = catalogItems.filter((item) => {
    if (!trimmedItemQuery) return true;
    return (
      item.name.toLowerCase().includes(trimmedItemQuery) ||
      (item.itemCode && item.itemCode.toLowerCase().includes(trimmedItemQuery)) ||
      (item.clientName && item.clientName.toLowerCase().includes(trimmedItemQuery))
    );
  });
  const isExactItemMatch = catalogItems.some(
    (item) =>
      item.name.toLowerCase() === trimmedItemQuery ||
      (item.itemCode && item.itemCode.toLowerCase() === trimmedItemQuery)
  );

  // Auto-fill all specifications from chosen catalog item
  const handleSelectItem = (item: MasterCatalogItem) => {
    setBoxName(item.name);
    if (item.clientName && (!partyName || partyName === 'Maruti Agro Foods Exports Pvt Ltd')) {
      setPartyName(item.clientName);
    }
    if (item.boxSize) {
      if (item.boxSize.l) setLength(Number(item.boxSize.l) || 400);
      if (item.boxSize.w) setWidth(Number(item.boxSize.w) || 300);
      if (item.boxSize.h) setHeight(Number(item.boxSize.h) || 250);
    }

    // Determine target ply
    const targetPly: '3' | '5' | '7' =
      item.ply === '3' || item.ply === '7' ? item.ply : '5';
    setPly(targetPly);

    // Build layers with defaults for targetPly, then enrich with item specs
    let newLayers = createDefaultLayers(targetPly, preferences);

    // Parse GSM numbers if provided (e.g., "230 / 150 / 140 / 150 / 180" or "180, 140, 150")
    if (item.gsm) {
      const gsmMatches = item.gsm.match(/\d+/g);
      if (gsmMatches && gsmMatches.length > 0) {
        newLayers = newLayers.map((layer, idx) => {
          if (gsmMatches[idx]) {
            const parsedGsm = parseInt(gsmMatches[idx], 10);
            if (!isNaN(parsedGsm) && parsedGsm > 50 && parsedGsm < 600) {
              return { ...layer, gsm: parsedGsm };
            }
          }
          return layer;
        });
      }
    }

    // Assign topPaper / liner if available
    if (item.topPaper) {
      const matchedGrade = (Object.keys(preferences.paperRates) as PaperGrade[]).find(
        (grade) => grade.toLowerCase() === item.topPaper?.toLowerCase()
      );
      if (matchedGrade) {
        newLayers[0] = {
          ...newLayers[0],
          paperGrade: matchedGrade,
          ratePerKg: preferences.paperRates[matchedGrade] || newLayers[0].ratePerKg,
          bf: preferences.paperDefaultBf[matchedGrade] || newLayers[0].bf,
        };
      }
    }
    if (item.liner && newLayers.length > 1) {
      const lastIdx = newLayers.length - 1;
      const matchedGrade = (Object.keys(preferences.paperRates) as PaperGrade[]).find(
        (grade) => grade.toLowerCase() === item.liner?.toLowerCase()
      );
      if (matchedGrade) {
        newLayers[lastIdx] = {
          ...newLayers[lastIdx],
          paperGrade: matchedGrade,
          ratePerKg: preferences.paperRates[matchedGrade] || newLayers[lastIdx].ratePerKg,
          bf: preferences.paperDefaultBf[matchedGrade] || newLayers[lastIdx].bf,
        };
      }
    }
    setLayers(newLayers);

    // Stitching / Joint
    if (item.stitching !== undefined) {
      setJoint(item.stitching ? 'stitched' : 'glued');
    }

    // Printing
    if (item.printing) {
      const colorMatch = item.printing.match(/(\d+)/);
      if (colorMatch) {
        const num = parseInt(colorMatch[1], 10);
        setPrintingColors(Math.min(4, Math.max(0, num)));
      } else if (
        item.printing.toLowerCase().includes('plain') ||
        item.printing.toLowerCase().includes('unprinted')
      ) {
        setPrintingColors(0);
      }
    }

    setItemLoadedMessage(
      `Loaded "${item.itemCode ? `[${item.itemCode}] ` : ''}${item.name}" specifications!`
    );
    setTimeout(() => {
      if (isMounted.current) setItemLoadedMessage(null);
    }, 4000);
    setIsItemDropdownOpen(false);
  };

  // Quick save current specs as reusable item
  async function handleSaveCurrentAsItem() {
    const trimmedName = boxName.trim();
    if (!trimmedName || isSavingItem) return;
    setIsSavingItem(true);
    try {
      const generatedCode = `BOX-${Math.floor(1000 + Math.random() * 9000)}`;
      const newItem: MasterCatalogItem = {
        id: `custom-calc-${Date.now()}`,
        itemCode: generatedCode,
        name: trimmedName,
        clientName: partyName.trim() || undefined,
        boxSize: { l: String(length), w: String(width), h: String(height) },
        ply: ply,
        topPaper: layers[0]?.paperGrade || 'Virgin Golden Kraft',
        liner: layers[layers.length - 1]?.paperGrade || 'High BF Test Liner',
        gsm: layers.map((l) => l.gsm).join(' / '),
        cuttingSize: `${calc.cuttingLength} × ${calc.cuttingWidth} mm`,
        decalSize: `${calc.deckleInches} Inches`,
        printing: printingColors > 0 ? `${printingColors}-Color Flexo` : 'Plain Unprinted',
        stitching: joint !== 'glued',
        remarks: `${boxType.toUpperCase()} - Net: ${calc.weightPerBoxGram}g - BCT: ${calc.estimatedBctKgf} kgf`,
        isCustom: true,
      };

      saveLocalCustomItem(newItem);
      setCatalogItems((prev) => [newItem, ...prev]);

      await createQuickItemAction({
        name: newItem.name,
        itemCode: newItem.itemCode,
        boxSize: newItem.boxSize,
        ply: newItem.ply,
        topPaper: newItem.topPaper,
        liner: newItem.liner,
        gsm: newItem.gsm,
        cuttingSize: newItem.cuttingSize,
        decalSize: newItem.decalSize,
        printing: newItem.printing,
        stitching: newItem.stitching,
        remarks: newItem.remarks,
      });

      setItemLoadedMessage(`"${trimmedName}" saved to Master Item Catalog!`);
      setTimeout(() => {
        if (isMounted.current) setItemLoadedMessage(null);
      }, 4000);
      setIsItemDropdownOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      if (isMounted.current) setIsSavingItem(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-industrial font-bold">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading Universal Packaging Engine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-kraft-dark/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kraft text-industrial text-xs font-mono font-bold tracking-wider uppercase mb-2 border border-kraft-dark/20">
            <Calculator className="w-3.5 h-3.5" />
            UNIVERSAL CORRUGATION CALCULATOR
          </div>
          <h1 className="text-3xl font-extrabold text-industrial tracking-tight">
            Customizable Box & Packaging Specifier
          </h1>
          <p className="text-sm text-industrial/70 mt-1">
            Millimeter-accurate sheet layout, dynamic take-up factor draw ratios, Bursting Strength predictions, and instant commercial cost breakdown.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-kraft-dark/30 bg-white hover:bg-kraft/30 text-industrial text-xs font-bold transition-colors shadow-xs"
          >
            <Sliders className="w-4 h-4 text-industrial" />
            <span>Machine Calibration</span>
          </Link>

          <Button
            variant="outline"
            onClick={() => window.print()}
            className="border-kraft-dark/30 hover:bg-kraft/30 text-industrial text-xs font-bold print:hidden"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            Print Spec Sheet
          </Button>

          <Link
            href={createJobCardUrl}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-industrial text-white hover:bg-industrial-dark text-xs font-bold shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Generate Job Card</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 print:hidden">
        <span className="text-xs font-bold text-industrial/60 uppercase tracking-wider mr-2 flex-shrink-0">
          Load Presets:
        </span>
        <button
          onClick={() => applyPreset('5ply-master')}
          className="px-3 py-1.5 rounded-md bg-white border border-kraft-dark/20 text-xs font-bold text-industrial hover:bg-kraft/40 transition-colors whitespace-nowrap shadow-2xs"
        >
          🍎 5-Ply Export Fruit Shipper
        </button>
        <button
          onClick={() => applyPreset('7ply-heavy')}
          className="px-3 py-1.5 rounded-md bg-white border border-kraft-dark/20 text-xs font-bold text-industrial hover:bg-kraft/40 transition-colors whitespace-nowrap shadow-2xs"
        >
          ⚙️ 7-Ply Heavy Machinery Box
        </button>
        <button
          onClick={() => applyPreset('3ply-ecommerce')}
          className="px-3 py-1.5 rounded-md bg-white border border-kraft-dark/20 text-xs font-bold text-industrial hover:bg-kraft/40 transition-colors whitespace-nowrap shadow-2xs"
        >
          📦 3-Ply E-Commerce Shipper
        </button>
      </div>

      {/* ─── MAIN 2-COLUMN GRID ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ─── LEFT COLUMN: INPUTS & BOARD BUILDER (7 Cols) ─────────────── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Box Type & Dimensions */}
          <div className="bg-white rounded-xl border border-kraft-dark/20 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-industrial flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-kraft-dark" />
                Box Type & Dimensions
              </h3>
              <div className="flex rounded-lg bg-kraft-lighter p-1 border border-kraft-dark/15 text-xs font-bold">
                <button
                  onClick={() => setBoxType('rsc')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    boxType === 'rsc' ? 'bg-industrial text-white' : 'text-industrial/70'
                  }`}
                >
                  Universal RSC Box
                </button>
                <button
                  onClick={() => setBoxType('die-cut')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    boxType === 'die-cut' ? 'bg-industrial text-white' : 'text-industrial/70'
                  }`}
                >
                  Die-Cut Tray
                </button>
                <button
                  onClick={() => setBoxType('sheet')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    boxType === 'sheet' ? 'bg-industrial text-white' : 'text-industrial/70'
                  }`}
                >
                  Corrugated Sheet
                </button>
              </div>
            </div>

            {/* General Info Inputs with Client/Party Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 relative" ref={clientDropdownRef}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-industrial/70">Client / Party Name</label>
                  {justAddedMessage ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-800 bg-green-100 px-1.5 py-0.5 rounded">
                      <Check className="w-2.5 h-2.5 text-green-700" />
                      {justAddedMessage}
                    </span>
                  ) : isRegisteredIndustry ? (
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded"
                      title="This company is registered in Industries"
                    >
                      <Check className="w-2.5 h-2.5 text-green-600" />
                      Registered Industry
                    </span>
                  ) : partyName.trim().length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-industrial/60 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded">
                      Custom Party
                    </span>
                  ) : null}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={partyName}
                    placeholder="e.g. Maruti Agro Foods or select existing client"
                    onChange={(e) => {
                      setPartyName(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="w-full pl-3 pr-8 py-2 bg-white border border-kraft-dark/30 rounded-lg text-sm font-bold text-industrial focus:outline-none focus:ring-1 focus:ring-industrial"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-industrial/40 hover:text-industrial transition-colors focus:outline-none"
                    tabIndex={-1}
                    title="Toggle registered industries list"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 bg-white border-2 border-black rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in duration-150">
                    <div className="px-3 py-1.5 bg-gray-100 border-b border-gray-200 flex items-center justify-between text-[11px] font-bold text-industrial/70 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-industrial" />
                        Registered Industries
                      </span>
                      <span className="text-[10px] font-normal text-industrial/50 lowercase">
                        {filteredIndustries.length} available
                      </span>
                    </div>

                    <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
                      {filteredIndustries.length > 0 ? (
                        filteredIndustries.map((ind) => {
                          const isSelected = ind.name.toLowerCase() === trimmedQuery;
                          return (
                            <button
                              key={ind.id}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setPartyName(ind.name);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                                isSelected
                                  ? 'bg-kraft-light/50 font-bold text-black'
                                  : 'hover:bg-gray-50 text-industrial'
                              }`}
                            >
                              <span className="flex items-center gap-2 truncate">
                                <Building2 className="w-3.5 h-3.5 text-industrial/40 flex-shrink-0" />
                                <span className="truncate font-medium">{ind.name}</span>
                              </span>
                              {isSelected ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-green-700">
                                  <Check className="w-3 h-3" /> Selected
                                </span>
                              ) : (
                                <span className="text-[10px] uppercase font-semibold text-industrial/40 hover:text-industrial">
                                  Select
                                </span>
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-3 text-center text-xs text-gray-500">
                          No registered industry matches &ldquo;{partyName.trim()}&rdquo;
                        </div>
                      )}
                    </div>

                    {showAddNew && (
                      <div className="p-2 bg-kraft-lighter border-t border-kraft-dark/20">
                        <button
                          type="button"
                          disabled={isCreatingIndustry}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={handleAddNewIndustry}
                          className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-industrial hover:bg-black text-white text-xs font-bold rounded transition-all shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add &ldquo;{partyName.trim()}&rdquo; to Industries</span>
                          </span>
                          <span className="text-[10px] uppercase font-mono bg-white/20 px-1.5 py-0.5 rounded">
                            {isCreatingIndustry ? 'Adding...' : 'Save'}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-1 relative" ref={itemContainerRef}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-industrial/70 flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-industrial" />
                    Box Name / Item Code
                  </label>
                  {itemLoadedMessage ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-800 bg-green-100 px-1.5 py-0.5 rounded shadow-2xs animate-in fade-in duration-200">
                      <Check className="w-2.5 h-2.5 text-green-700" />
                      {itemLoadedMessage}
                    </span>
                  ) : isExactItemMatch ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                      <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                      Catalog Item Matched
                    </span>
                  ) : boxName.trim().length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-industrial/60 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded">
                      Custom Specs
                    </span>
                  ) : null}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={boxName}
                    placeholder="e.g. 10 KG FRESH MANGO CARTON, or enter item code..."
                    onChange={(e) => {
                      setBoxName(e.target.value);
                      setIsItemDropdownOpen(true);
                    }}
                    onFocus={() => setIsItemDropdownOpen(true)}
                    className="w-full pl-3 pr-8 py-2 bg-white border border-kraft-dark/30 rounded-lg text-sm font-bold text-industrial focus:outline-none focus:ring-1 focus:ring-industrial"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setIsItemDropdownOpen((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-industrial/40 hover:text-industrial transition-colors focus:outline-none cursor-pointer"
                    tabIndex={-1}
                    title="Toggle item catalog list"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isItemDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Dropdown Menu for Items */}
                {isItemDropdownOpen && (
                  <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 bg-white border-2 border-black rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in duration-150">
                    <div className="px-3 py-1.5 bg-gray-100 border-b border-gray-200 flex items-center justify-between text-[11px] font-bold text-industrial/70 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-industrial" />
                        Master Item Catalog & Templates
                      </span>
                      <span className="text-[10px] font-normal text-industrial/50 lowercase">
                        {filteredCatalogItems.length} available
                      </span>
                    </div>

                    <div className="max-h-56 overflow-y-auto divide-y divide-gray-100">
                      {filteredCatalogItems.length > 0 ? (
                        filteredCatalogItems.map((item) => {
                          const isSelected =
                            item.name.toLowerCase() === trimmedItemQuery ||
                            (item.itemCode &&
                              item.itemCode.toLowerCase() === trimmedItemQuery);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectItem(item);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs flex flex-col gap-1 transition-colors ${
                                isSelected
                                  ? 'bg-kraft-light/50 font-bold text-black'
                                  : 'hover:bg-gray-50 text-industrial'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 font-bold text-xs truncate">
                                  {item.itemCode && (
                                    <span className="px-1.5 py-0.5 rounded bg-industrial text-white text-[9px] font-mono">
                                      {item.itemCode}
                                    </span>
                                  )}
                                  <span className="truncate">{item.name}</span>
                                </div>
                                <span className="text-[9px] font-bold text-industrial/70 uppercase bg-gray-100 px-1.5 py-0.5 rounded ml-1 flex-shrink-0">
                                  Auto-Fill &rarr;
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-industrial/60 font-mono">
                                <span>
                                  {item.boxSize?.l} × {item.boxSize?.w} × {item.boxSize?.h} mm
                                </span>
                                <span>•</span>
                                <span>{item.ply}-Ply</span>
                                {item.clientName && (
                                  <>
                                    <span>•</span>
                                    <span className="text-industrial/80 font-bold truncate">
                                      {item.clientName}
                                    </span>
                                  </>
                                )}
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-3 text-center text-xs text-gray-500">
                          No catalog item matches &ldquo;{boxName.trim()}&rdquo;
                        </div>
                      )}
                    </div>

                    {boxName.trim().length > 0 && (
                      <div className="p-2 bg-kraft-lighter border-t border-kraft-dark/20">
                        <button
                          type="button"
                          disabled={isSavingItem}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={handleSaveCurrentAsItem}
                          className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-industrial hover:bg-black text-white text-xs font-bold rounded transition-all shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            {isSavingItem ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Plus className="w-3.5 h-3.5" />
                            )}
                            <span>Save &ldquo;{boxName.trim()}&rdquo; to Catalog</span>
                          </span>
                          <span className="text-[10px] uppercase font-mono bg-white/20 px-1.5 py-0.5 rounded">
                            {isSavingItem ? 'Saving...' : 'Save Item'}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Dimensions Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-industrial flex items-center justify-between">
                  <span>Length (L)</span>
                  <span className="text-[10px] font-mono text-industrial/50">mm</span>
                </label>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-base font-mono font-bold text-industrial focus:ring-1 focus:ring-industrial"
                />
                <span className="text-[10px] text-industrial/50 font-mono block text-right">
                  {(length / 25.4).toFixed(1)} in
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-industrial flex items-center justify-between">
                  <span>Width (W)</span>
                  <span className="text-[10px] font-mono text-industrial/50">mm</span>
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-base font-mono font-bold text-industrial focus:ring-1 focus:ring-industrial"
                />
                <span className="text-[10px] text-industrial/50 font-mono block text-right">
                  {(width / 25.4).toFixed(1)} in
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-industrial flex items-center justify-between">
                  <span>Height (H)</span>
                  <span className="text-[10px] font-mono text-industrial/50">mm</span>
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-base font-mono font-bold text-industrial focus:ring-1 focus:ring-industrial"
                />
                <span className="text-[10px] text-industrial/50 font-mono block text-right">
                  {(height / 25.4).toFixed(1)} in
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-industrial flex items-center justify-between">
                  <span>Order Quantity</span>
                  <span className="text-[10px] font-mono text-industrial/50">pcs</span>
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-base font-mono font-bold text-industrial focus:ring-1 focus:ring-industrial"
                />
                <span className="text-[10px] text-industrial/50 font-mono block text-right">
                  boxes
                </span>
              </div>
            </div>

            {/* Finishing & Joint Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-kraft-dark/15">
              <div className="space-y-1">
                <label className="text-xs font-bold text-industrial">Box Joint</label>
                <select
                  value={joint}
                  onChange={(e) => setJoint(e.target.value as JointType)}
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-xs font-bold text-industrial"
                >
                  <option value="stitched">Wire Stitched (Standard)</option>
                  <option value="glued">Cold Starch Glue Joint</option>
                  <option value="both">Stitched + Glued Combo</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-industrial">Flexo Printing</label>
                <select
                  value={printingColors}
                  onChange={(e) => setPrintingColors(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-kraft-dark/30 rounded-lg text-xs font-bold text-industrial"
                >
                  <option value={0}>Plain Unprinted</option>
                  <option value={1}>1-Color Flexo</option>
                  <option value={2}>2-Color Flexo</option>
                  <option value={3}>3-Color Flexo</option>
                  <option value={4}>4-Color Flexo</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setShowAdvancedParams(!showAdvancedParams)}
                  className="w-full px-3 py-2 rounded-lg border border-kraft-dark/30 bg-kraft-lighter/50 hover:bg-kraft text-xs font-bold text-industrial flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{showAdvancedParams ? 'Hide Quick Tuners' : 'Quick Tuners (Flap/Waste)'}</span>
                </button>
              </div>
            </div>

            {/* Inline Quick Allowance Adjustments */}
            {showAdvancedParams && (
              <div className="p-4 bg-kraft/30 rounded-xl border border-kraft-dark/20 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-industrial flex items-center justify-between">
                    <span>Joint Flap Allowance</span>
                    <span className="text-[10px] font-mono">{customFlap} mm</span>
                  </label>
                  <input
                    type="range"
                    min="25"
                    max="60"
                    value={customFlap}
                    onChange={(e) => setCustomFlap(parseInt(e.target.value))}
                    className="w-full accent-industrial cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-industrial flex items-center justify-between">
                    <span>Trim Scrap Allowance</span>
                    <span className="text-[10px] font-mono">+{customTrimWaste}%</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    value={customTrimWaste}
                    onChange={(e) => setCustomTrimWaste(parseInt(e.target.value))}
                    className="w-full accent-industrial cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Ply & Layer-by-Layer Board Builder */}
          <div className="bg-white rounded-xl border border-kraft-dark/20 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-industrial flex items-center gap-2">
                  <Layers className="w-4 h-4 text-kraft-dark" />
                  Board Construction & Layer Builder
                </h3>
                <p className="text-xs text-industrial/60 mt-0.5">
                  Configure paper grade, GSM, Burst Factor (BF), and machine flute take-up ratio for each layer.
                </p>
              </div>

              {/* Ply Toggle Buttons */}
              <div className="flex rounded-lg bg-kraft-lighter p-1 border border-kraft-dark/15 text-xs font-bold">
                <button
                  onClick={() => handlePlyChange('3')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    ply === '3' ? 'bg-industrial text-white' : 'text-industrial/70'
                  }`}
                >
                  3-Ply (Single Wall)
                </button>
                <button
                  onClick={() => handlePlyChange('5')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    ply === '5' ? 'bg-industrial text-white' : 'text-industrial/70'
                  }`}
                >
                  5-Ply (Double Wall)
                </button>
                <button
                  onClick={() => handlePlyChange('7')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    ply === '7' ? 'bg-industrial text-white' : 'text-industrial/70'
                  }`}
                >
                  7-Ply (Triple Wall)
                </button>
              </div>
            </div>

            {/* Interactive Visual Flute Profile */}
            <div className="p-4 bg-kraft-lighter/40 rounded-xl border border-kraft-dark/15 space-y-2 select-none">
              <div className="flex items-center justify-between text-[11px] font-mono text-industrial/70 mb-1">
                <span className="font-bold">LIVE BOARD CROSS-SECTION VISUALIZER</span>
                <span>Total Caliper ~{ply === '3' ? '3.0' : ply === '5' ? '6.5' : '9.5'} mm</span>
              </div>

              {/* Visualized Stack */}
              <div className="space-y-1">
                {layers.map((l, index) => {
                  if (l.role === 'flute') {
                    return (
                      <div
                        key={l.id}
                        className="h-7 w-full bg-amber-100/70 border-y border-dashed border-amber-400 rounded-xs flex items-center justify-between px-3 text-[10px] font-mono font-bold text-amber-900"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(217, 119, 6, 0.15) 8px, rgba(217, 119, 6, 0.15) 16px)',
                        }}
                      >
                        <span>〰〰〰 FLUTE {l.flute || 'B'} (Take-up: {l.takeUpFactor}x) 〰〰〰</span>
                        <span>{l.gsm} GSM • {l.paperGrade}</span>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={l.id}
                      className="h-5 w-full bg-amber-800 text-amber-50 rounded-xs flex items-center justify-between px-3 text-[10px] font-mono font-bold shadow-2xs"
                    >
                      <span>
                        {index === 0 ? 'TOP LINER' : index === layers.length - 1 ? 'BOTTOM LINER' : 'CENTER LINER'}
                      </span>
                      <span>{l.gsm} GSM • {l.paperGrade} (BF {l.bf})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Layer Configuration Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-kraft-dark/20 text-industrial/60 font-mono uppercase text-[10px]">
                    <th className="py-2 pr-2">Layer</th>
                    <th className="py-2 px-2">Paper Grade</th>
                    <th className="py-2 px-2">GSM</th>
                    <th className="py-2 px-2">BF</th>
                    <th className="py-2 px-2">Flute & Draw Ratio</th>
                    <th className="py-2 px-2 text-right">Rate/Kg</th>
                    <th className="py-2 pl-2 text-right">Weight/Box</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-kraft-dark/10">
                  {calc.layerBreakdown.map((layer, index) => (
                    <tr key={layer.id} className="hover:bg-kraft/20 transition-colors">
                      {/* Layer Role */}
                      <td className="py-2.5 pr-2">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            layer.role === 'top-liner'
                              ? 'bg-industrial text-white'
                              : layer.role === 'flute'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-kraft/50 text-industrial'
                          }`}
                        >
                          L{index + 1}: {layer.role === 'flute' ? 'Flute' : 'Liner'}
                        </span>
                      </td>

                      {/* Paper Grade */}
                      <td className="py-2.5 px-2">
                        <select
                          value={layer.paperGrade}
                          onChange={(e) =>
                            handleLayerUpdate(layer.id, {
                              paperGrade: e.target.value as PaperGrade,
                            })
                          }
                          className="w-full px-2 py-1 bg-white border border-kraft-dark/30 rounded text-xs font-medium text-industrial"
                        >
                          <option value="Virgin Golden Kraft">Virgin Golden Kraft</option>
                          <option value="Natural Semi-Kraft">Natural Semi-Kraft</option>
                          <option value="High BF Test Liner">High BF Test Liner</option>
                          <option value="White Top Coated">White Top Coated</option>
                          <option value="Duplex Board">Duplex Board</option>
                          <option value="Recycled Fluting Medium">Recycled Fluting Medium</option>
                        </select>
                      </td>

                      {/* GSM */}
                      <td className="py-2.5 px-2 w-20">
                        <input
                          type="number"
                          step="5"
                          value={layer.gsm}
                          onChange={(e) =>
                            handleLayerUpdate(layer.id, {
                              gsm: parseInt(e.target.value) || 100,
                            })
                          }
                          className="w-full px-2 py-1 bg-white border border-kraft-dark/30 rounded font-mono text-xs font-bold text-industrial"
                        />
                      </td>

                      {/* BF */}
                      <td className="py-2.5 px-2 w-16">
                        <input
                          type="number"
                          value={layer.bf}
                          onChange={(e) =>
                            handleLayerUpdate(layer.id, {
                              bf: parseInt(e.target.value) || 16,
                            })
                          }
                          className="w-full px-2 py-1 bg-white border border-kraft-dark/30 rounded font-mono text-xs font-bold text-industrial"
                        />
                      </td>

                      {/* Flute & Take-Up */}
                      <td className="py-2.5 px-2">
                        {layer.role === 'flute' ? (
                          <div className="flex items-center gap-1.5">
                            <select
                              value={layer.flute || 'B'}
                              onChange={(e) =>
                                handleLayerUpdate(layer.id, {
                                  flute: e.target.value as FluteType,
                                })
                              }
                              className="px-1.5 py-1 bg-white border border-kraft-dark/30 rounded text-xs font-bold text-industrial"
                            >
                              <option value="B">B-Flute</option>
                              <option value="C">C-Flute</option>
                              <option value="E">E-Flute</option>
                              <option value="A">A-Flute</option>
                              <option value="F">F-Flute</option>
                              <option value="BC">BC-Flute</option>
                            </select>
                            <input
                              type="number"
                              step="0.01"
                              value={layer.takeUpFactor}
                              onChange={(e) =>
                                handleLayerUpdate(layer.id, {
                                  takeUpFactor: parseFloat(e.target.value) || 1.0,
                                })
                              }
                              className="w-14 px-1.5 py-1 bg-white border border-kraft-dark/30 rounded font-mono text-xs font-bold text-industrial"
                            />
                          </div>
                        ) : (
                          <span className="text-[11px] text-industrial/40 font-mono pl-2">Flat (1.0x)</span>
                        )}
                      </td>

                      {/* Rate Per Kg */}
                      <td className="py-2.5 px-2 text-right w-20">
                        <input
                          type="number"
                          step="0.5"
                          value={layer.ratePerKg}
                          onChange={(e) =>
                            handleLayerUpdate(layer.id, {
                              ratePerKg: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-1.5 py-1 bg-white border border-kraft-dark/30 rounded font-mono text-xs font-bold text-right text-industrial"
                        />
                      </td>

                      {/* Weight Per Box */}
                      <td className="py-2.5 pl-2 text-right font-mono font-bold text-industrial">
                        {layer.weightGram}g
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: REAL-TIME OUTPUT SPECIFICATIONS (5 Cols) ────── */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Spec Card */}
          <div className="bg-white rounded-xl border-2 border-industrial p-6 shadow-md space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-kraft-dark/20 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-industrial/50 uppercase tracking-widest block">
                  CALCULATED SPECIFICATIONS
                </span>
                <h3 className="text-xl font-black text-industrial">
                  {calc.cuttingLength} × {calc.cuttingWidth} mm
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono font-bold text-industrial/50 uppercase tracking-widest block">
                  REEL DECKLE
                </span>
                <span className="text-xl font-black font-mono text-industrial">
                  {calc.deckleInches}&quot;
                </span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-kraft-lighter/60 rounded-lg border border-kraft-dark/15">
                <p className="text-[10px] font-mono uppercase text-industrial/50">Board GSM</p>
                <p className="text-lg font-mono font-extrabold text-industrial">{calc.totalBoardGsm}</p>
                <p className="text-[10px] text-industrial/60">Effective GSM</p>
              </div>

              <div className="p-3 bg-kraft-lighter/60 rounded-lg border border-kraft-dark/15">
                <p className="text-[10px] font-mono uppercase text-industrial/50">Box Weight</p>
                <p className="text-lg font-mono font-extrabold text-industrial">{calc.weightPerBoxGram}g</p>
                <p className="text-[10px] text-industrial/60">{calc.weightPerBoxKg} kg / box</p>
              </div>

              <div className="p-3 bg-kraft-lighter/60 rounded-lg border border-kraft-dark/15">
                <p className="text-[10px] font-mono uppercase text-industrial/50">Sheet Area</p>
                <p className="text-lg font-mono font-extrabold text-industrial">{calc.sheetAreaSqM}</p>
                <p className="text-[10px] text-industrial/60">m² / box</p>
              </div>
            </div>

            {/* Strength Predictions Section */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold font-mono uppercase text-industrial/60 tracking-wider">
                Predicted Strength & Compression Metrics
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg space-y-0.5">
                  <span className="text-[10px] font-bold text-blue-900 uppercase">Bursting Strength (BS)</span>
                  <p className="text-xl font-mono font-black text-blue-950">
                    {calc.estimatedBsKgCm2} <span className="text-xs font-normal">kg/cm²</span>
                  </p>
                  <p className="text-[10px] text-blue-700 font-mono">~{calc.estimatedBsKpa} kPa (BF {calc.boardBf})</p>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg space-y-0.5">
                  <span className="text-[10px] font-bold text-amber-900 uppercase">Box Compression (BCT)</span>
                  <p className="text-xl font-mono font-black text-amber-950">
                    {calc.estimatedBctKgf} <span className="text-xs font-normal">kgf</span>
                  </p>
                  <p className="text-[10px] text-amber-700 font-mono">ECT ~{calc.estimatedEct} kN/m</p>
                </div>
              </div>
            </div>

            {/* Paper Reel Inventory Requisition */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold font-mono uppercase text-industrial/60 tracking-wider">
                  Paper Reel Requirement ({quantity.toLocaleString()} pcs)
                </h4>
                <span className="text-xs font-mono font-bold text-industrial">
                  {calc.totalOrderReelWeightKg.toLocaleString()} kg ({calc.totalOrderReelWeightMT} MT)
                </span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {calc.layerBreakdown.map((layer, idx) => (
                  <div
                    key={layer.id}
                    className="flex items-center justify-between text-xs py-1 px-2 bg-kraft-lighter/40 rounded border border-kraft-dark/10"
                  >
                    <span className="truncate max-w-[200px]">
                      L{idx + 1}: {layer.paperGrade} {layer.gsm}GSM
                    </span>
                    <span className="font-mono font-bold text-industrial">
                      {layer.batchReelKg.toLocaleString()} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Commercial Costing Breakdown */}
            <div className="space-y-3 pt-2 border-t border-kraft-dark/15">
              <h4 className="text-xs font-bold font-mono uppercase text-industrial/60 tracking-wider">
                Costing & Price Estimator
              </h4>

              <div className="space-y-1 text-xs text-industrial/80">
                <div className="flex justify-between py-1">
                  <span>Paper Cost / Box</span>
                  <span className="font-mono font-bold">
                    {preferences.costing.currency} {calc.paperCostPerBox.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Conversion / Processing Cost</span>
                  <span className="font-mono font-bold">
                    {preferences.costing.currency} {calc.conversionCostPerBox.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Finishing (Joint & {printingColors}-Color Print)</span>
                  <span className="font-mono font-bold">
                    {preferences.costing.currency}{' '}
                    {(calc.stitchingCostPerBox + calc.gluingCostPerBox + calc.printingCostPerBox).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-t border-kraft-dark/15 font-bold text-industrial">
                  <span>Total Factory Cost / Box</span>
                  <span className="font-mono">{preferences.costing.currency} {calc.totalFactoryCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Final Selling Price Banner */}
              <div className="p-4 bg-industrial text-white rounded-xl space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-kraft-lighter/80 font-bold uppercase tracking-wider">
                    Recommended Selling Price
                  </span>
                  <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-kraft-lighter">
                    +{preferences.costing.profitMarginPercent}% Margin
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-mono font-black text-white">
                    {preferences.costing.currency} {calc.sellingPricePerBox.toFixed(2)}
                  </span>
                  <span className="text-xs font-mono text-kraft-lighter/70">per box</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-white/10 text-kraft-lighter/80">
                  <span>Total Order Value ({quantity} boxes):</span>
                  <span className="font-mono font-bold text-white">
                    {preferences.costing.currency} {calc.totalOrderValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="space-y-2 pt-2">
              <Link
                href={createJobCardUrl}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-700 text-white hover:bg-green-800 font-bold text-sm shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Create Production Job Card Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
