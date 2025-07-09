@echo off
echo ========================================
echo    BUILD APP INVENTARIO MOBILE
echo ========================================
echo.

echo [1/4] Limpiando build anterior...
if exist "dist" rmdir /s /q "dist"
echo ✓ Limpieza completada
echo.

echo [2/4] Construyendo aplicación Angular...
call npm run build:mobile
if %errorlevel% neq 0 (
    echo ❌ Error en el build de Angular
    pause
    exit /b 1
)
echo ✓ Build de Angular completado
echo.

echo [3/4] Copiando index.html para Capacitor...
copy "dist\app-inventario\browser\index.csr.html" "dist\app-inventario\browser\index.html" >nul
echo ✓ Archivo index.html copiado
echo.

echo [4/4] Sincronizando con Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Error en la sincronización con Android
    pause
    exit /b 1
)
echo ✓ Sincronización completada
echo.

echo ========================================
echo    BUILD COMPLETADO EXITOSAMENTE
echo ========================================
echo.
echo Para abrir en Android Studio:
echo   npx cap open android
echo.
echo Para ejecutar en dispositivo/emulador:
echo   npx cap run android
echo.
pause 