# Documentación Técnica - Sistema de Inventario

## Índice
1. [Stack Tecnológico](#stack-tecnológico)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Plan de Implementación](#plan-de-implementación)
4. [Estructura de Módulos](#estructura-de-módulos)
5. [Guías de Desarrollo](#guías-de-desarrollo)

## Stack Tecnológico

### Frontend Core
- **Angular 19**
  - Última versión estable con mejoras significativas en rendimiento
  - Características principales:
    - Standalone Components por defecto
    - Signals para estado reactivo
    - Control Flow mejorado (@if, @for, @switch)
    - View Transitions API
    - Mejor soporte para SSR (Server-Side Rendering)
    - Mejor integración con .NET
    - Mejor rendimiento en aplicaciones grandes
    - Mejor soporte para PWA

### UI/UX
- **Angular Material 19**
  - Componentes Material Design actualizados
  - Temas personalizables con CSS variables
  - Componentes accesibles por defecto
  - Mejor rendimiento en componentes complejos
  - Soporte para modo oscuro mejorado
  - Mejor integración con Angular 19

### Estado y Datos
- **RxJS 7+**
  - Manejo de estado reactivo
  - Operadores para transformación de datos
  - Mejor manejo de operaciones asíncronas
  - Mejor integración con Signals
- **NgRx 17+** (opcional, para estado global)
  - Patrón Redux para estado global
  - DevTools para debugging
  - Mejor trazabilidad
  - Mejor integración con Signals

### Routing y Navegación
- **Angular Router**
  - Lazy loading de módulos
  - Guards para protección de rutas
  - Resolvers para precarga de datos
  - Mejor manejo de navegación

## Arquitectura del Proyecto

### Estructura de Carpetas
```
src/
├── app/
│   ├── core/                 # Servicios singleton, guards, interceptors
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── services/
│   ├── shared/              # Componentes, directivas y pipes compartidos
│   │   ├── components/
│   │   ├── directives/
│   │   └── pipes/
│   ├── features/            # Módulos de la aplicación
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── suppliers/
│   │   ├── contacts/
│   │   ├── users/
│   │   ├── movements/
│   │   ├── reports/
│   │   ├── audit/
│   │   └── settings/
│   ├── models/              # Interfaces y tipos
│   └── utils/               # Utilidades y helpers
├── assets/                  # Recursos estáticos
└── environments/            # Configuración por ambiente
```

## Plan de Implementación

### Fase 1: Setup (1-2 días)
```bash
# Inicialización con Angular 19
ng new app-inventario --routing --style=scss --strict --standalone

# Dependencias principales
ng add @angular/material@19
npm install @ngrx/store@17 @ngrx/effects@17 @ngrx/entity@17 @ngrx/store-devtools@17

# Configuración adicional
ng add @angular/pwa
ng add @angular/ssr
```

### Fase 2: Componentes Base (2-3 días)
- Layout principal
- Sistema de navegación
- Componentes de formulario
- Tablas de datos
- Modales y diálogos
- Sistema de notificaciones

### Fase 3: Implementación de Módulos (3 semanas)

#### Módulos en orden de implementación:
1. **Autenticación y Seguridad**
   - Login
   - Gestión de sesiones
   - Recuperación de contraseña

2. **Dashboard Principal**
   - Vista general
   - Widgets de resumen
   - Gráficos y estadísticas

3. **Gestión de Productos**
   - CRUD de productos
   - Gestión de inventario
   - Control de stock

4. **Gestión de Categorías**
   - CRUD de categorías
   - Árbol de categorías
   - Asignación de productos

5. **Gestión de Proveedores**
   - CRUD de proveedores
   - Gestión de contactos
   - Historial de compras

6. **Gestión de Usuarios**
   - CRUD de usuarios
   - Roles y permisos
   - Gestión de accesos

7. **Movimientos**
   - Registro de movimientos
   - Historial de transacciones
   - Filtros y búsquedas

8. **Reportes**
   - Generación de reportes
   - Exportación de datos
   - Filtros avanzados

9. **Auditoría**
   - Registro de auditoría
   - Trazabilidad de acciones
   - Logs del sistema

10. **Configuración**
    - Configuración general
    - Preferencias del sistema
    - Parámetros globales

### Fase 4: Integración (1 semana)
- Integración con API
- Manejo de errores
- Sistema de caché
- Optimización de rendimiento

### Fase 5: Testing y Optimización (1 semana)
- Pruebas unitarias con Jasmine
- Pruebas e2e con Cypress
- Optimización de bundle
- Mejoras de accesibilidad

## Guías de Desarrollo

### Convenciones de Código
- Usar TypeScript estricto
- Seguir el patrón de diseño de componentes
- Implementar lazy loading
- Mantener componentes pequeños y reutilizables

### Patrones de Diseño
- Smart/Container Components
- Services para lógica de negocio
- Guards para protección de rutas
- Interceptors para manejo de HTTP

### Mejores Prácticas
- Implementar error handling
- Usar RxJS para operaciones asíncronas
- Implementar lazy loading
- Mantener la accesibilidad

### Testing
- Jasmine para pruebas unitarias
- Cypress para pruebas E2E
- Coverage mínimo: 80%

## Consideraciones de Seguridad
- Implementación de JWT
- Sanitización de inputs
- Protección contra XSS
- Validación de datos

## Optimización de Rendimiento
- Lazy loading de módulos
- OnPush Change Detection
- Optimización de bundles
- Virtualización de listas

## Accesibilidad
- ARIA labels
- Navegación por teclado
- Contraste de colores
- Mensajes de error accesibles

## Despliegue en IIS

### Requisitos del Servidor
- Windows Server 2016 o superior
- IIS 10 o superior
- URL Rewrite Module para IIS
- .NET Core Hosting Bundle

### Configuración del Proyecto
```bash
# Build de producción
ng build --configuration production

# Estructura de archivos generada
dist/
├── index.html
├── assets/
└── ...
```

### Configuración de IIS
1. **web.config**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="Angular Routes" stopProcessing="true">
                    <match url=".*" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                        <add input="{REQUEST_URI}" pattern="^/(api)" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/" />
                </rule>
            </rules>
        </rewrite>
        <staticContent>
            <mimeMap fileExtension=".json" mimeType="application/json" />
        </staticContent>
    </system.webServer>
</configuration>
```

### Optimizaciones para IIS
1. **Compresión**
   - Habilitar compresión GZIP/Brotli
   - Configurar tipos MIME
   - Optimizar caché del navegador

2. **Seguridad**
   - Configurar HTTPS
   - Implementar headers de seguridad
   - Configurar CORS si es necesario

3. **Rendimiento**
   - Configurar caché de archivos estáticos
   - Optimizar compresión de assets
   - Implementar CDN si es necesario

### Pasos de Despliegue
1. Construir la aplicación en modo producción
2. Crear un nuevo sitio web en IIS
3. Configurar el web.config
4. Desplegar los archivos de build
5. Configurar permisos de carpeta
6. Probar la aplicación

### Monitoreo y Mantenimiento
- Configurar logs de IIS
- Implementar monitoreo de rendimiento
- Establecer proceso de actualización
- Configurar backups

---

Esta documentación servirá como guía de referencia durante todo el desarrollo del proyecto. Se actualizará según sea necesario para reflejar cambios en la arquitectura o decisiones técnicas. 