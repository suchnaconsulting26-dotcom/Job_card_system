export type JobStatus = 'pending' | 'in-progress' | 'completed' | 'hold';

export interface JobCard {
  id: string;
  jobNo: number;
  createdAt: string;

  // Client Info
  partyName: string;

  // Box Details
  boxName: string;
  boxSize: {
    l: string;
    w: string;
    h: string;
  };
  cuttingSize?: string;
  decalSize?: string;
  quantity: number;

  // Material Specs
  ply: string;
  topPaper: string;
  liner: string;
  numberOfPapers?: string;
  gsm: string;

  // Production
  printingColor: string;
  stitching: boolean;

  // Dates
  orderDate: string;
  deliveryDate: string;

  // Shipment Info
  readyQuantity?: number;
  vehicleNumber?: string;

  // Status
  status: JobStatus;

  // Notes
  remarks: string;
}

export type CreateJobCardInput = Omit<JobCard, 'id' | 'jobNo' | 'createdAt' | 'status'>;

export interface Client {
  id: string;
  name: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;

  // Detailed Specs (Merged from Master Items)
  itemCode?: string;
  boxSize?: {
    l: string;
    w: string;
    h: string;
  };
  topPaper?: string;
  liner?: string;
  ply?: string;
  gsm?: string;
  cuttingSize?: string;
  decalSize?: string;
  printing?: string;
  stitching?: boolean;

  createdAt: string;
  updatedAt: string;
}

export type CreateInventoryItemInput = Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>;
