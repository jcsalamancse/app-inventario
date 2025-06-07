# Documentación de Integración con API .NET

## Descripción General
El frontend se integra con una API RESTful desarrollada en .NET 8/9.

## Base URL
```
https://api.inventario-app.com/api/v1
```

## Autenticación

### Obtener Token (Identity)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

#### Respuesta
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "usuario@ejemplo.com",
    "role": "admin"
  }
}
```

## Endpoints

### Productos

#### Listar Productos
```http
GET /api/products
Authorization: Bearer {token}
```

Query Parameters:
- `pageNumber`: número de página (default: 1)
- `pageSize`: elementos por página (default: 10)
- `searchTerm`: término de búsqueda
- `categoryId`: filtrar por categoría

#### Crear Producto
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Producto Ejemplo",
  "description": "Descripción del producto",
  "price": 99.99,
  "stock": 100,
  "categoryId": "456"
}
```

### Ventas

#### Crear Venta
```http
POST /api/sales
Authorization: Bearer {token}
Content-Type: application/json

{
  "customerId": "789",
  "items": [
    {
      "productId": "123",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "paymentMethod": "Card",
  "total": 199.98
}
```

## Modelos de Datos

### Usuario
```csharp
public class UserDto
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string FullName { get; set; }
    public string Role { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### Producto
```csharp
public class ProductDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string CategoryId { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### Venta
```csharp
public class SaleDto
{
    public string Id { get; set; }
    public string Reference { get; set; }
    public string CustomerId { get; set; }
    public List<SaleItemDto> Items { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; }
    public string PaymentMethod { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class SaleItemDto
{
    public string ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal Subtotal { get; set; }
}
```

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Error en la solicitud |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - No autorizado |
| 404 | Not Found - Recurso no encontrado |
| 422 | Unprocessable Entity - Validación fallida |
| 500 | Internal Server Error - Error del servidor |

## Configuración del Cliente API

```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DOTNET_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirigir al login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Seguridad

### Headers Requeridos
```http
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

### CORS
Los siguientes orígenes deben estar configurados en el backend .NET:
- `https://inventario-app.com`
- `https://staging.inventario-app.com`
- `http://localhost:3000` (desarrollo)

### Mejores Prácticas
1. Siempre usar HTTPS
2. Validar todos los inputs
3. Usar Identity para autenticación
4. Implementar políticas de autorización
5. Sanitizar datos de respuesta 