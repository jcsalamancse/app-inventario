# Documentación del Sistema de Inventario - Versión React

## **1. Diseño UX y UI Detallado**

### **1.1 Diseño de Interfaz**
- **Estilo Moderno**: Usa Material-UI (MUI) para un diseño limpio y profesional
- **Tema Personalizado**: Crea un tema personalizado con colores corporativos y tipografías modernas
- **Componentes Reutilizables**: Diseña componentes como `Card`, `Button`, y `Dialog` que sigan un estilo consistente
- **Paleta de Colores**:
  ```typescript
  const theme = {
    primary: '#3a7bd5',
    primaryDark: '#2d62ae',
    secondary: '#16a085',
    dark: '#1c1c2c',
    darker: '#13131f',
    light: '#f8f9fa',
    gray: '#6c757d',
    grayDark: '#343a40',
    danger: '#e74c3c',
    warning: '#f39c12',
    success: '#2ecc71',
    info: '#3498db',
    accentGreen: '#7FD858',
    accentPurple: '#8B6BC7'
  }
  ```

### **1.2 Flujo de Usuario**
- **Login**:
  - El usuario ingresa su nombre de usuario y contraseña
  - Si selecciona "Recordar usuario", se guarda el nombre de usuario en `localStorage`
  - Si el usuario olvida su contraseña, puede hacer clic en "¿Olvidaste tu contraseña?"
- **Dashboard**:
  - Después del login, el usuario es redirigido al dashboard
  - El dashboard muestra un resumen de inventario, alertas, y gráficos
- **Menú Lateral**:
  - Un menú lateral (`Drawer`) permite navegar entre los módulos
  - El menú se colapsa en dispositivos móviles y se expande con un ícono de hamburguesa
- **Breadcrumbs**:
  - Muestra la ruta actual (por ejemplo, "Dashboard > Inventario > Productos")

### **1.3 Responsividad**
- **Mobile First**: Diseña primero para móviles y luego escala para tablets y escritorios
- **Breakpoints**: Usa los breakpoints de MUI (`xs`, `sm`, `md`, `lg`, `xl`)
- **Grid System**: Usa `Grid` de MUI para organizar el contenido en una cuadrícula responsive

## **2. Funcionalidad Detallada por Módulo**

### **2.1 Módulo de Autenticación (`auth`)**
#### **Login**
- **Componente**: `LoginPage`
- **Campos**:
  ```typescript
  interface LoginForm {
    username: string;
    password: string;
    rememberMe: boolean;
  }
  ```
- **Validaciones**: Usar React Hook Form con Yup
- **Acciones**:
  - Al hacer clic en "Ingresar", se llama al hook `useAuth` para autenticar
  - Si el login es exitoso, se redirige al dashboard
  - Si el usuario selecciona "Recordar usuario", se guarda en `localStorage`

#### **Recuperar Contraseña**
- **Componente**: `ForgotPasswordPage`
- **Campos**:
  ```typescript
  interface ForgotPasswordForm {
    email: string;
  }
  ```
- **Validaciones**: Email válido
- **Acciones**: Usar el hook `useAuth` para enviar el correo de recuperación

### **2.2 Módulo de Dashboard**
#### **Dashboard Principal**
- **Componente**: `DashboardPage`
- **Elementos**:
  - **Resumen de Inventario**: Tarjetas (`Card`) que muestran estadísticas
  - **Alertas**: Lista de alertas usando `List` de MUI
  - **Gráficos**: Integra gráficos usando `recharts` o `chart.js`

### **2.3 Módulo de Gestión de Inventarios (`inventory`)**
#### **Lista de Productos**
- **Componente**: `ProductListPage`
- **Elementos**:
  - **Tabla**: Usa `DataGrid` de MUI
  - **Filtros**: Campos de búsqueda y filtros por categoría
  - **Paginación**: Usa la paginación integrada de `DataGrid`
- **Acciones**:
  - **Editar**: Botón que abre un modal con `Dialog`
  - **Eliminar**: Botón que muestra un diálogo de confirmación

#### **Crear/Editar Producto**
- **Componente**: `ProductForm`
- **Campos**:
  ```typescript
  interface ProductForm {
    codigo: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
    estado: boolean;
  }
  ```
- **Validaciones**: React Hook Form con Yup
- **Acciones**: Usar el hook `useProducts` para crear/editar

### **2.4 Módulo de Gestión de Proveedores (`suppliers`)**
#### **Lista de Proveedores**
- **Componente**: `SupplierListPage`
- **Elementos**: Similar a ProductListPage
- **Acciones**: CRUD completo usando `useSuppliers` hook

#### **Crear/Editar Proveedor**
- **Componente**: `SupplierForm`
- **Campos**:
  ```typescript
  interface SupplierForm {
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    estado: boolean;
  }
  ```

### **2.5 Módulo de Gestión de Contactos (`contacts`)**
#### **Lista de Contactos**
- **Componente**: `ContactListPage`
- **Elementos**: Similar a otros listados
- **Acciones**: CRUD completo usando `useContacts` hook

### **2.6 Módulo de Auditorías (`audits`)**
#### **Lista de Auditorías**
- **Componente**: `AuditListPage`
- **Elementos**: Tabla con filtros y paginación
- **Acciones**: Ver detalles usando `useAudits` hook

## **3. Hooks Personalizados**

### **3.1 Autenticación**
```typescript
const useAuth = () => {
  const login = async (credentials: LoginForm) => {
    // Lógica de login
  };
  
  const logout = () => {
    // Lógica de logout
  };
  
  return { login, logout };
};
```

### **3.2 Gestión de Datos**
```typescript
const useProducts = () => {
  const { data, isLoading, error } = useQuery('products', fetchProducts);
  const createProduct = useMutation(createProductApi);
  const updateProduct = useMutation(updateProductApi);
  const deleteProduct = useMutation(deleteProductApi);
  
  return { data, isLoading, error, createProduct, updateProduct, deleteProduct };
};
```

## **4. Integración con el API**

### **4.1 Configuración de Axios**
```typescript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### **4.2 Servicios**
```typescript
const productService = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: ProductForm) => api.post('/products', data),
  update: (id: string, data: ProductForm) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`)
};
```

## **5. Estructura del Proyecto**

```
src/
  ├── components/
  │   ├── auth/
  │   │   ├── LoginForm.tsx
  │   │   └── ForgotPasswordForm.tsx
  │   ├── dashboard/
  │   │   ├── StatsCard.tsx
  │   │   └── AlertList.tsx
  │   ├── inventory/
  │   │   ├── ProductList.tsx
  │   │   └── ProductForm.tsx
  │   ├── suppliers/
  │   │   ├── SupplierList.tsx
  │   │   └── SupplierForm.tsx
  │   ├── contacts/
  │   │   ├── ContactList.tsx
  │   │   └── ContactForm.tsx
  │   ├── audits/
  │   │   └── AuditList.tsx
  │   └── shared/
  │       ├── Layout.tsx
  │       ├── Navbar.tsx
  │       └── Sidebar.tsx
  ├── hooks/
  │   ├── useAuth.ts
  │   ├── useProducts.ts
  │   ├── useSuppliers.ts
  │   ├── useContacts.ts
  │   └── useAudits.ts
  ├── services/
  │   ├── api.ts
  │   ├── authService.ts
  │   ├── productService.ts
  │   ├── supplierService.ts
  │   ├── contactService.ts
  │   └── auditService.ts
  ├── context/
  │   ├── AuthContext.tsx
  │   └── ThemeContext.tsx
  ├── utils/
  │   ├── validations.ts
  │   └── helpers.ts
  ├── styles/
  │   ├── theme.ts
  │   └── globalStyles.ts
  └── types/
      ├── auth.types.ts
      ├── product.types.ts
      ├── supplier.types.ts
      ├── contact.types.ts
      └── audit.types.ts
```

## **6. Tecnologías Utilizadas**

- **React 18+**
- **TypeScript**
- **Material-UI (MUI)**
- **React Router v6**
- **React Query**
- **Axios**
- **React Hook Form**
- **Yup**
- **Recharts**
- **Jest y React Testing Library**

## **7. Scripts de Desarrollo**

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  }
}
```

## **8. Variables de Entorno**

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
```

## **9. Guía de Contribución**

1. Crear una rama para cada feature
2. Seguir las convenciones de commits
3. Escribir tests para nuevas funcionalidades
4. Documentar cambios importantes
5. Hacer pull request a la rama develop

## **10. Despliegue**

1. Construir la aplicación:
   ```bash
   npm run build
   ```

2. Desplegar en servidor web (nginx, apache, etc.)

3. Configurar variables de entorno en producción

4. Implementar CI/CD (GitHub Actions, GitLab CI, etc.) 