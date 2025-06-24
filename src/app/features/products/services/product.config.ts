import { environment } from '../../../../environments/environment';

export const PRODUCT_CONFIG = {
  apiUrl: `${environment.apiUrl}/Product`,
  endpoints: {
    products: '/',
    product: (id: number) => `/${id}`,
    stock: (id: number) => `/${id}/stock`,
    lowStock: '/low-stock',
    stockAlerts: '/stock-alerts',
    priceHistory: (id: number) => `/${id}/price-history`,
    movements: (id: number) => `/product/${id}`
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100]
  },
  filters: {
    defaultSortBy: 'name',
    defaultSortOrder: 'asc'
  }
}; 