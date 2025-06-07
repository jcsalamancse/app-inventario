# Documentación de InventarioApp

## Descripción General
InventarioApp es una aplicación web moderna para la gestión integral de inventario, ventas y administración de negocios. Desarrollada con React y Next.js, ofrece una interfaz de usuario intuitiva y responsive.

## Estructura del Proyecto
```
src/
├── components/     # Componentes de React organizados por módulos
├── services/      # Servicios para comunicación con la API
├── hooks/         # Hooks personalizados de React
├── context/       # Contextos de React para estado global
├── types/         # Definiciones de TypeScript
├── utils/         # Utilidades y helpers
├── pages/         # Páginas y rutas de Next.js
└── styles/        # Estilos y temas
```

## Módulos Principales

### 1. Autenticación y Seguridad
- Gestión de usuarios y roles
- Sistema de autenticación JWT
- Control de acceso basado en roles
- Gestión de contraseñas segura

### 2. Gestión de Inventario
- Control de stock
- Gestión de productos y categorías
- Movimientos de inventario
- Alertas de stock bajo

### 3. Ventas
- Proceso de venta
- Gestión de clientes
- Facturación
- Historial de ventas

### 4. Administración
- Panel de control
- Configuración del sistema
- Gestión de usuarios
- Auditoría y logs

## Tecnologías Utilizadas

- **Frontend:**
  - React 18
  - Next.js 13
  - Material-UI v5
  - TypeScript
  - React Query
  - Context API

- **Herramientas de Desarrollo:**
  - ESLint
  - Prettier
  - Git
  - npm

## Requisitos del Sistema

- Node.js 16.x o superior
- npm 7.x o superior
- Navegador web moderno

## Configuración del Entorno

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/inventario-app.git
```

2. Instalar dependencias:
```bash
cd inventario-app
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env.local
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Documentación Detallada

- [Documentación de Módulos](./modules/README.md)
- [Documentación de API](./api/README.md)
- [Documentación de Componentes](./components/README.md)
- [Documentación de Servicios](./services/README.md)

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles. 