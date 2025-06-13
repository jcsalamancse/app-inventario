export interface Movement {
  id: number;
  type: string;
  status: string;
  date: string;
  reference?: string;
  sourceLocation?: string;
  destinationLocation?: string;
  items: MovementItem[];
  total: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MovementItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
}

export enum MovementType {
  Entry = 'ENTRY',
  Exit = 'EXIT',
  Transfer = 'TRANSFER'
}

export interface MovementFormData {
  type: string;
  reference: string;
  productId: number;
  quantity: number;
  sourceLocationId: number;
  destinationLocationId: number;
  notes?: string;
} 