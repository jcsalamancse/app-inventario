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
  productName?: string;
  quantity?: number;
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
  Type: number;
  Reference: string;
  ProductId: number;
  Quantity: number;
  SourceLocationId: number;
  DestinationLocationId: number;
  Notes: string;
} 