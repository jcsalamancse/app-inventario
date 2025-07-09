const fs = require('fs');
const path = require('path');

// Tamaños de iconos para Android
const iconSizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
};

// Función para copiar el logo a todas las carpetas de iconos
function copyIcons() {
    const sourceLogo = path.join(__dirname, 'src', 'assets', 'Logo-Claro.png');
    const androidResPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');
    
    console.log('🔄 Copiando logo a todas las carpetas de iconos...');
    
    Object.keys(iconSizes).forEach(folder => {
        const targetPath = path.join(androidResPath, folder, 'ic_launcher.png');
        const targetPathRound = path.join(androidResPath, folder, 'ic_launcher_round.png');
        
        try {
            // Copiar ic_launcher.png
            fs.copyFileSync(sourceLogo, targetPath);
            console.log(`✅ Copiado a ${folder}/ic_launcher.png`);
            
            // Copiar ic_launcher_round.png
            fs.copyFileSync(sourceLogo, targetPathRound);
            console.log(`✅ Copiado a ${folder}/ic_launcher_round.png`);
        } catch (error) {
            console.error(`❌ Error copiando a ${folder}:`, error.message);
        }
    });
    
    console.log('🎉 Iconos copiados exitosamente!');
}

// Ejecutar la función
copyIcons(); 