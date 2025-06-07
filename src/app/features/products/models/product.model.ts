export interface Product {
  id: number;
  name: string;
  code: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  categoryId: number;
  category?: Category;
  supplierId: number;
  supplier?: Supplier;
  warehouseId: number;
  warehouse?: Warehouse;
  locationId: number;
  location?: Location;
  lastMovementDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
  description?: string;
  unitId: number;
  price: number;
  isActive: boolean;
  sku?: string;
  unit?: Unit;
}

export interface ProductDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  currentStock: number;
  categoryId: number;
  categoryName?: string;
  unitId: number;
  unitName?: string;
  unitSymbol?: string;
  minimumStock: number;
  maximumStock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ProductPaginationResult {
  Items: {
    $values: ProductDto[];
  };
  TotalCount: number;
  PageNumber: number;
  PageSize: number;
  TotalPages: number;
  HasPreviousPage: boolean;
  HasNextPage: boolean;
  NextPageNumber?: number;
  PreviousPageNumber?: number;
}

export interface ProductFilter {
  searchTerm?: string;
  categoryId?: number[];
  supplierId?: number[];
  warehouseId?: number[];
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: string[];
  isActive?: boolean;
  createdFrom?: Date;
  createdTo?: Date;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}

// Interfaces auxiliares
export interface Category {
  id: number;
  name: string;
}

export interface Supplier {
  id: number;
  name: string;
}

export interface Warehouse {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
}

export interface Unit {
  id: number;
  name: string;
  symbol: string;
} 