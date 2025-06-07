# Documentación de Componentes

## Estructura de Componentes
```
components/
├── admin/          # Componentes de administración
├── auth/           # Componentes de autenticación
├── inventory/      # Componentes de inventario
├── layout/         # Componentes de diseño
├── sales/          # Componentes de ventas
├── shared/         # Componentes compartidos
└── reports/        # Componentes de reportes
```

## Componentes Principales

### Layout

#### `Layout`
Componente principal que envuelve toda la aplicación.

```typescript
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Implementación
};
```

**Características:**
- Barra de navegación superior
- Menú lateral
- Área de contenido principal
- Manejo de tema claro/oscuro

#### `Navbar`
Barra de navegación superior.

```typescript
interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  // Implementación
};
```

**Características:**
- Botón de menú
- Logo
- Notificaciones
- Perfil de usuario

### Autenticación

#### `LoginForm`
Formulario de inicio de sesión.

```typescript
interface LoginFormProps {
  onSubmit: (credentials: Credentials) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  // Implementación
};
```

**Características:**
- Validación de campos
- Manejo de errores
- Recordar sesión
- Enlace a recuperación de contraseña

### Ventas

#### `Sales`
Vista principal de ventas.

```typescript
const Sales: React.FC = () => {
  // Implementación
};
```

**Características:**
- Lista de ventas
- Filtros
- Acciones por venta
- Paginación

#### `SaleDialog`
Diálogo para crear/editar ventas.

```typescript
interface SaleDialogProps {
  open: boolean;
  onClose: () => void;
  sale?: Sale;
  onSave: (sale: Sale) => Promise<void>;
}

const SaleDialog: React.FC<SaleDialogProps> = (props) => {
  // Implementación
};
```

**Características:**
- Selección de productos
- Cálculo automático
- Validación de stock
- Múltiples métodos de pago

### Inventario

#### `Inventory`
Vista principal de inventario.

```typescript
const Inventory: React.FC = () => {
  // Implementación
};
```

**Características:**
- Lista de productos
- Filtros avanzados
- Acciones masivas
- Exportación de datos

## Componentes Compartidos

### `DataTable`
Tabla de datos reutilizable.

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: Column[];
  onSort?: (field: string) => void;
  onFilter?: (filters: Filter[]) => void;
  onRowClick?: (row: T) => void;
}

const DataTable = <T extends object>(props: DataTableProps<T>) => {
  // Implementación
};
```

### `ConfirmDialog`
Diálogo de confirmación.

```typescript
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
  // Implementación
};
```

## Hooks Personalizados

### `useAuth`
Hook para manejar la autenticación.

```typescript
const useAuth = () => {
  // Implementación
  return {
    user,
    login,
    logout,
    isAuthenticated
  };
};
```

### `useNotification`
Hook para mostrar notificaciones.

```typescript
const useNotification = () => {
  // Implementación
  return {
    showSuccess,
    showError,
    showWarning
  };
};
```

## Guías de Estilo

### Nomenclatura
- Componentes: PascalCase
- Props interfaces: ComponentNameProps
- Hooks: use[Name]
- Handlers: handle[Event]

### Estructura de Archivos
```
ComponentName/
├── index.ts
├── ComponentName.tsx
├── ComponentName.styles.ts
└── ComponentName.test.tsx
```

### Mejores Prácticas
1. **Composición sobre Herencia**
   ```typescript
   // Bien
   const Button = ({ children, ...props }) => (
     <button {...props}>{children}</button>
   );

   // Evitar
   class CustomButton extends Button {
     // ...
   }
   ```

2. **Props Typing**
   ```typescript
   // Bien
   interface ButtonProps {
     variant: 'primary' | 'secondary';
     onClick: () => void;
   }

   // Evitar
   interface ButtonProps {
     variant: string;
     onClick: any;
   }
   ```

3. **Estado Local vs Global**
   ```typescript
   // Estado Local
   const [isOpen, setIsOpen] = useState(false);

   // Estado Global
   const { user } = useAuth();
   ```

## Testing

### Configuración
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### Ejemplos de Tests
```typescript
// Test de interacción
test('calls onSubmit when form is submitted', async () => {
  const onSubmit = jest.fn();
  render(<LoginForm onSubmit={onSubmit} />);
  
  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'password123');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(onSubmit).toHaveBeenCalled();
});
```

## Performance

### Optimizaciones
1. **Memoización**
   ```typescript
   const MemoizedComponent = React.memo(Component);
   const memoizedValue = useMemo(() => computeValue(a, b), [a, b]);
   const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
   ```

2. **Code Splitting**
   ```typescript
   const LazyComponent = React.lazy(() => import('./LazyComponent'));
   ```

3. **Virtualización**
   ```typescript
   import { VirtualizedList } from 'react-virtualized';
   
   const List = ({ items }) => (
     <VirtualizedList
       width={300}
       height={500}
       rowCount={items.length}
       rowHeight={50}
       rowRenderer={({ index, style }) => (
         <div style={style}>{items[index]}</div>
       )}
     />
   );
   ```

## Accesibilidad

### Prácticas Recomendadas
1. Usar roles ARIA apropiados
2. Proporcionar textos alternativos
3. Manejar navegación por teclado
4. Asegurar contraste de colores

```typescript
// Ejemplo de componente accesible
const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  disabled 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-disabled={disabled}
    role="button"
  >
    {children}
  </button>
);
``` 