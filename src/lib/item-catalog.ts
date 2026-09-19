import { InventoryItem } from './types';

export interface MasterCatalogItem {
  id: string;
  itemCode?: string;
  name: string; // Box Name / Description
  clientId?: string;
  clientName?: string;
  boxSize: {
    l: string;
    w: string;
    h: string;
  };
  ply: string; // '3' | '5' | '7'
  topPaper: string;
  liner: string;
  numberOfPapers?: string;
  gsm: string;
  cuttingSize?: string;
  decalSize?: string;
  printing?: string;
  stitching?: boolean;
  remarks?: string;
  isCustom?: boolean;
}

export const DEFAULT_CATALOG_ITEMS: MasterCatalogItem[] = [
  {
    id: 'cat-mgo-10',
    itemCode: 'MGO-10KG',
    name: '10 KG FRESH MANGO EXPORT CARTON (VENTILATED TRAY)',
    clientName: 'MARUTI AGRO FOODS EXPORTS PVT LTD',
    boxSize: { l: '480', w: '340', h: '180' },
    ply: '5',
    topPaper: 'Virgin Golden Kraft',
    liner: '140 High BF Test Liner',
    numberOfPapers: '5 Layers (Double Wall Flute)',
    gsm: '180 / 140 / 140 / 140 / 150',
    cuttingSize: '1680 × 520 mm',
    decalSize: '56 Inches',
    printing: '3-Color Flexo (Red, Green, Black)',
    stitching: true,
    remarks: 'Export grade packaging. Ensure ventilation hole punch dies are 100% slug-free. Apply high moisture-resistant starch gum.',
  },
  {
    id: 'cat-app-20',
    itemCode: 'APP-20KG',
    name: '20 KG ROYAL DELICIOUS APPLE TELESCOPIC BOX',
    clientName: 'HIMALAYAN ORCHARD AGRO FRESH',
    boxSize: { l: '500', w: '320', h: '300' },
    ply: '5',
    topPaper: 'Virgin Golden Kraft',
    liner: '180 High BF Test Liner',
    numberOfPapers: '5 Layers (Double Wall)',
    gsm: '200 / 140 / 140 / 140 / 180',
    cuttingSize: '1720 × 640 mm',
    decalSize: '58 Inches',
    printing: '2-Color Flexo (Red & Green)',
    stitching: true,
    remarks: 'High moisture resistance starch required. Check telescopic lid fit.',
  },
  {
    id: 'cat-ind-7p',
    itemCode: 'MCH-HVY-7P',
    name: 'HEAVY DUTY INDUSTRIAL MACHINERY BULK SHIPPER',
    clientName: 'BHARAT GEARS & TRANSMISSIONS LTD',
    boxSize: { l: '600', w: '400', h: '400' },
    ply: '7',
    topPaper: 'Virgin Golden Kraft',
    liner: 'High BF Test Liner',
    numberOfPapers: '7 Layers (Triple Wall Flute)',
    gsm: '230 / 140 / 150 / 140 / 150 / 140 / 200',
    cuttingSize: '2080 × 820 mm',
    decalSize: '68 Inches',
    printing: '1-Color Flexo (Black)',
    stitching: true,
    remarks: 'Reinforced heavy-duty wire stitching, 4 staples per joint.',
  },
  {
    id: 'cat-ecom-3p',
    itemCode: 'ECOM-STD-3P',
    name: 'E-COMMERCE SHIPPER MAILER CARTON',
    clientName: 'NEXUS E-COMMERCE LOGISTICS',
    boxSize: { l: '300', w: '200', h: '150' },
    ply: '3',
    topPaper: 'Natural Semi-Kraft',
    liner: 'High BF Test Liner',
    numberOfPapers: '3 Layers (Single Wall)',
    gsm: '150 / 120 / 140',
    cuttingSize: '1060 × 360 mm',
    decalSize: '44 Inches',
    printing: '1-Color Flexo',
    stitching: false,
    remarks: 'Glued joint for clean auto-packer conveyor line feed.',
  },
  {
    id: 'cat-pharm-5p',
    itemCode: 'PHARM-MST-5P',
    name: 'PHARMACEUTICAL SHIPPER MASTER BOX',
    clientName: 'APEX HEALTHCARE FORMULATIONS',
    boxSize: { l: '400', w: '300', h: '250' },
    ply: '5',
    topPaper: 'White Top Coated',
    liner: 'High BF Test Liner',
    numberOfPapers: '5 Layers (Double Wall)',
    gsm: '180 / 140 / 140 / 140 / 150',
    cuttingSize: '1460 × 560 mm',
    decalSize: '48 Inches',
    printing: '2-Color Flexo (Blue & Cyan)',
    stitching: true,
    remarks: 'Sterile clean board requirement, pharma cGMP audit compliant.',
  },
];

const LOCAL_STORAGE_ITEMS_KEY = 'boxcraft_custom_catalog_items_v1';

export function loadLocalCustomItems(): MasterCatalogItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ITEMS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalCustomItem(item: MasterCatalogItem): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadLocalCustomItems();
    // Check if item with same itemCode or name already exists
    const filtered = existing.filter(
      (i) =>
        (item.itemCode && i.itemCode?.toLowerCase() !== item.itemCode.toLowerCase()) ||
        i.name.toLowerCase() !== item.name.toLowerCase()
    );
    filtered.unshift({ ...item, isCustom: true });
    localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to save custom item to localStorage', err);
  }
}

export function mergeCatalogItems(
  dbItems: InventoryItem[] = []
): MasterCatalogItem[] {
  const localCustom = loadLocalCustomItems();

  // Convert dbItems to MasterCatalogItem format
  const mappedDbItems: MasterCatalogItem[] = dbItems.map((db) => ({
    id: db.id,
    itemCode: db.itemCode || undefined,
    name: db.name,
    clientId: db.clientId,
    boxSize: db.boxSize || { l: '400', w: '300', h: '250' },
    ply: db.ply || '5',
    topPaper: db.topPaper || 'Virgin Golden Kraft',
    liner: db.liner || 'High BF Test Liner',
    numberOfPapers: db.ply ? `${db.ply} Layers` : '5 Layers',
    gsm: db.gsm || '180 / 140 / 150',
    cuttingSize: db.cuttingSize,
    decalSize: db.decalSize,
    printing: db.printing || 'Plain Unprinted',
    stitching: db.stitching !== false,
    remarks: db.description,
    isCustom: true,
  }));

  // Merge order: 1) localCustom, 2) mappedDbItems, 3) DEFAULT_CATALOG_ITEMS
  const combined: MasterCatalogItem[] = [...localCustom, ...mappedDbItems];

  DEFAULT_CATALOG_ITEMS.forEach((def) => {
    const exists = combined.some(
      (c) =>
        (def.itemCode && c.itemCode?.toLowerCase() === def.itemCode.toLowerCase()) ||
        c.name.toLowerCase() === def.name.toLowerCase()
    );
    if (!exists) {
      combined.push(def);
    }
  });

  return combined;
}
