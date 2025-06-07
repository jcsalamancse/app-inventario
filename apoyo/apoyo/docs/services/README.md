# Documentación de Servicios

## Estructura de Servicios
```
services/
├── api/              # Cliente API base y configuración
├── auth/             # Servicios de autenticación
├── sales/            # Servicios de ventas
├── inventory/        # Servicios de inventario
└── admin/           # Servicios de administración
```

## Servicios Principales

### API Base Service

```typescript
// api/baseService.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class BaseService {
  protected api: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 10000,
      ...config
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      response => response,
      error => this.handleError(error)
    );
  }

  protected async handleError(error: any) {
    if (error.response?.status === 401) {
      // Manejar token expirado
      await this.refreshToken();
    }
    return Promise.reject(error);
  }

  private async refreshToken() {
    // Implementación de renovación de token
  }
}
```

### Auth Service

```typescript
// auth/authService.ts
import { BaseService } from '../api/baseService';
import { LoginCredentials, User } from '@/types';

export class AuthService extends BaseService {
  async login(credentials: LoginCredentials): Promise<User> {
    const { data } = await this.api.post('/auth/login', credentials);
    return data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
    localStorage.removeItem('token');
  }

  async getCurrentUser(): Promise<User> {
    const { data } = await this.api.get('/auth/me');
    return data;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await this.api.post('/auth/change-password', {
      oldPassword,
      newPassword
    });
  }
}
```

### Sales Service

```typescript
// sales/salesService.ts
import { BaseService } from '../api/baseService';
import { Sale, CreateSaleDTO, SaleFilters } from '@/types';

export class SalesService extends BaseService {
  async getSales(filters?: SaleFilters): Promise<Sale[]> {
    const { data } = await this.api.get('/sales', { params: filters });
    return data;
  }

  async createSale(sale: CreateSaleDTO): Promise<Sale> {
    const { data } = await this.api.post('/sales', sale);
    return data;
  }

  async updateSale(id: string, sale: Partial<Sale>): Promise<Sale> {
    const { data } = await this.api.put(`/sales/${id}`, sale);
    return data;
  }

  async deleteSale(id: string): Promise<void> {
    await this.api.delete(`/sales/${id}`);
  }
}
```

### Inventory Service

```typescript
// inventory/inventoryService.ts
import { BaseService } from '../api/baseService';
import { Product, Movement } from '@/types';

export class InventoryService extends BaseService {
  async getProducts(): Promise<Product[]> {
    const { data } = await this.api.get('/inventory/products');
    return data;
  }

  async createMovement(movement: Movement): Promise<void> {
    await this.api.post('/inventory/movements', movement);
  }

  async updateStock(productId: string, quantity: number): Promise<void> {
    await this.api.put(`/inventory/products/${productId}/stock`, { quantity });
  }
}
```

## Manejo de Errores

```typescript
// utils/errorHandler.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
  }
}

export const handleApiError = (error: any): never => {
  if (error.response) {
    throw new ApiError(
      error.response.status,
      error.response.data.message,
      error.response.data.details
    );
  }
  throw new ApiError(500, 'Error de conexión');
};
```

## Cache y Estado

```typescript
// cache/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 30 * 60 * 1000, // 30 minutos
      retry: 3,
      refetchOnWindowFocus: false
    }
  }
});
```

## Hooks de Servicios

```typescript
// hooks/useProducts.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { inventoryService } from '@/services';

export const useProducts = () => {
  const {
    data: products,
    isLoading,
    error
  } = useQuery(['products'], () => inventoryService.getProducts());

  const updateStock = useMutation(
    ({ productId, quantity }: { productId: string; quantity: number }) =>
      inventoryService.updateStock(productId, quantity)
  );

  return {
    products,
    isLoading,
    error,
    updateStock
  };
};
```

## WebSocket Service

```typescript
// services/websocket/WebSocketService.ts
export class WebSocketService {
  private socket: WebSocket;
  private listeners: Map<string, Function[]>;

  constructor(url: string) {
    this.socket = new WebSocket(url);
    this.listeners = new Map();
    this.setupListeners();
  }

  private setupListeners() {
    this.socket.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      this.notifyListeners(type, data);
    };
  }

  public subscribe(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  public unsubscribe(event: string, callback: Function) {
    const listeners = this.listeners.get(event) || [];
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  private notifyListeners(event: string, data: any) {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(callback => callback(data));
  }
}
```

## Servicios de Utilidad

### Email Service

```typescript
// services/email/EmailService.ts
import { BaseService } from '../api/baseService';
import { EmailTemplate } from '@/types';

export class EmailService extends BaseService {
  async sendEmail(template: EmailTemplate, data: any): Promise<void> {
    await this.api.post('/email/send', {
      template,
      data
    });
  }

  async getTemplates(): Promise<EmailTemplate[]> {
    const { data } = await this.api.get('/email/templates');
    return data;
  }
}
```

### Log Service

```typescript
// services/log/LogService.ts
import { BaseService } from '../api/baseService';
import { LogEntry, LogLevel } from '@/types';

export class LogService extends BaseService {
  async log(level: LogLevel, message: string, meta?: any): Promise<void> {
    await this.api.post('/logs', {
      level,
      message,
      meta,
      timestamp: new Date().toISOString()
    });
  }

  async getLogs(filters?: any): Promise<LogEntry[]> {
    const { data } = await this.api.get('/logs', { params: filters });
    return data;
  }
}
```

## Configuración del Entorno

```typescript
// config/environment.ts
export const environment = {
  apiUrl: process.env.NEXT_PUBLIC_DOTNET_API_URL,
  environment: process.env.NODE_ENV,
  version: process.env.NEXT_PUBLIC_APP_VERSION,
  debug: process.env.NODE_ENV === 'development'
};
```

## Variables de Entorno (.env.local)

```bash
NEXT_PUBLIC_DOTNET_API_URL=https://localhost:7001/api
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Mejores Prácticas

1. **Manejo de Estado**
   - Usar React Query para datos del servidor
   - Implementar cache estratégico
   - Manejar estados de carga y error

2. **Seguridad**
   - Validar inputs
   - Sanitizar datos
   - Usar ASP.NET Core Identity
   - Implementar políticas de autorización

3. **Performance**
   - Implementar debounce/throttle
   - Usar cancelación de requests
   - Optimizar cache

4. **Testing**
   - Pruebas unitarias para servicios
   - Mocks para requests
   - Testing de error handling

## Ejemplos de Uso

### Uso Básico
```typescript
const ProductList: React.FC = () => {
  const { products, isLoading, error } = useProducts();

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return <DataTable data={products} />;
};
```

### Manejo de Mutaciones
```typescript
const UpdateStock: React.FC = () => {
  const { updateStock } = useProducts();

  const handleUpdate = async (productId: string, quantity: number) => {
    try {
      await updateStock.mutateAsync({ productId, quantity });
      showSuccess('Stock actualizado');
    } catch (error) {
      showError('Error al actualizar stock');
    }
  };

  return <StockForm onSubmit={handleUpdate} />;
};
``` 