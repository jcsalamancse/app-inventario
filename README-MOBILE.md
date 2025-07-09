# 📱 App Inventario - Versión Móvil

Aplicación móvil Android generada a partir del proyecto web Angular 19 usando Capacitor.

## 🚀 Características

- ✅ **Aplicación nativa Android** usando Capacitor
- ✅ **Reutilización del código Angular** existente
- ✅ **Arquitectura modular** y mantenible
- ✅ **Gestión de estado** con NgRx
- ✅ **Interfaz responsive** optimizada para móvil
- ✅ **Autenticación JWT** integrada
- ✅ **Almacenamiento nativo** con Capacitor Preferences
- ✅ **Detección de conectividad** en tiempo real

## 📋 Requisitos Previos

### Software Necesario
- **Node.js** (v18 o superior)
- **Android Studio** (última versión)
- **Android SDK** (API 24+)
- **Java JDK** (v8 o superior)

### Configuración de Android Studio
1. Instalar Android Studio
2. Configurar Android SDK
3. Crear un emulador Android o conectar dispositivo físico
4. Habilitar "Modo desarrollador" en dispositivo físico

## 🛠️ Instalación y Configuración

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
La aplicación ya está configurada para usar la API:
```
https://adsoinventarios.dataifx.co:3434/Api/Api
```

### 3. Build y Sincronización
```bash
# Opción 1: Script automatizado (RECOMENDADO)
build-mobile.bat

# Opción 2: Comandos manuales
npm run build:mobile
npx cap sync android
```

## 📱 Desarrollo y Pruebas

### Abrir en Android Studio
```bash
npx cap open android
```

### Ejecutar en Emulador/Dispositivo
```bash
npx cap run android
```

### Comandos Útiles
```bash
# Build para móvil
npm run build:mobile

# Sincronizar cambios
npx cap sync android

# Copiar archivos web
npx cap copy android

# Ver logs en tiempo real
npx cap run android --livereload --external
```

## 🏗️ Arquitectura del Proyecto

```
app-inventario-mobile/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── services/
│   │   │       └── mobile.service.ts    # Servicios móviles
│   │   ├── features/                    # Módulos de funcionalidad
│   │   ├── shared/                      # Componentes compartidos
│   │   └── store/                       # Gestión de estado NgRx
│   ├── environments/
│   │   └── environment.mobile.ts        # Configuración móvil
│   └── assets/
├── android/                             # Proyecto Android nativo
├── capacitor.config.ts                  # Configuración Capacitor
└── package.json
```

## 🔧 Configuraciones Específicas

### Capacitor (capacitor.config.ts)
- **webDir**: `dist/app-inventario/browser`
- **Android**: Configurado para HTTPS
- **SplashScreen**: 2 segundos con spinner
- **StatusBar**: Tema oscuro

### Android (build.gradle)
- **minSdkVersion**: 24
- **targetSdkVersion**: 34
- **Optimización**: Minificación y shrinkResources habilitados
- **Split APK**: Habilitado para reducir tamaño

### Permisos Android
- `INTERNET`: Conexión a la API
- `ACCESS_NETWORK_STATE`: Estado de red
- `CAMERA`: Para funcionalidades futuras
- `STORAGE`: Para archivos locales

## 🎨 Adaptaciones Móviles

### Servicio Móvil (MobileService)
- Detección de plataforma nativa
- Almacenamiento nativo con fallback a localStorage
- Gestión de conectividad
- Configuración automática de StatusBar y SplashScreen

### Responsive Design
- Optimizado para pantallas móviles
- Soporte para gestos táctiles
- Navegación adaptada para móvil

## 📦 Generación de APK

### APK de Debug
```bash
# En Android Studio
Build > Build Bundle(s) / APK(s) > Build APK(s)
```

### APK de Release
1. Generar keystore para firma
2. Configurar signingConfig en build.gradle
3. Build > Generate Signed Bundle / APK

## 🐛 Solución de Problemas

### Error: "web assets directory must contain index.html"
```bash
# Solución: Copiar index.csr.html a index.html
copy "dist\app-inventario\browser\index.csr.html" "dist\app-inventario\browser\index.html"
```

### Error de Certificado SSL
- La aplicación está configurada para permitir tráfico HTTP a `adsoinventarios.dataifx.co`
- Verificar `network_security_config.xml`

### Error de Build Android
```bash
# Limpiar y reconstruir
cd android
./gradlew clean
./gradlew build
```

## 📈 Optimizaciones Implementadas

### Performance
- **Lazy Loading**: Módulos cargados bajo demanda
- **Tree Shaking**: Eliminación de código no usado
- **Minificación**: Reducción del tamaño del bundle
- **Compresión**: Assets optimizados

### UX/UI
- **SplashScreen**: Pantalla de carga profesional
- **StatusBar**: Integración nativa
- **Gestos**: Soporte para gestos móviles
- **Offline**: Almacenamiento local para datos críticos

## 🔄 Flujo de Desarrollo

1. **Desarrollo**: Modificar código Angular en `src/`
2. **Build**: `npm run build:mobile`
3. **Sincronización**: `npx cap sync android`
4. **Pruebas**: `npx cap run android`
5. **Iteración**: Repetir ciclo

## 📞 Soporte

Para problemas específicos de la aplicación móvil:
1. Verificar logs de Android Studio
2. Revisar configuración de Capacitor
3. Validar conectividad con la API
4. Comprobar permisos de Android

## 🚀 Próximas Mejoras

- [ ] **Push Notifications** con Firebase
- [ ] **Sincronización offline** completa
- [ ] **Escáner de códigos QR** para inventario
- [ ] **Firma digital** para reportes
- [ ] **Modo oscuro** nativo
- [ ] **Widgets** de Android
- [ ] **Accesibilidad** mejorada

---

**Versión**: 1.0.0  
**Última actualización**: Julio 2025  
**Tecnologías**: Angular 19, Capacitor 7, Android SDK 