const fs = require('fs');
const path = require('path');

// Función para copiar directorios recursivamente
function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    
    if (fs.lstatSync(fromPath).isFile()) {
      fs.copyFileSync(fromPath, toPath);
    } else {
      copyFolderSync(fromPath, toPath);
    }
  });
}

console.log('📦 Copying static files to standalone...');

try {
  // Copiar .next/static
  const staticSource = path.join('.next', 'static');
  const staticDest = path.join('.next', 'standalone', '.next', 'static');
  if (fs.existsSync(staticSource)) {
    copyFolderSync(staticSource, staticDest);
    console.log('✅ .next/static copied');
  }

  // Copiar public
  const publicSource = 'public';
  const publicDest = path.join('.next', 'standalone', 'public');
  if (fs.existsSync(publicSource)) {
    copyFolderSync(publicSource, publicDest);
    console.log('✅ public copied');
  }

  console.log('🎉 All files copied successfully!');
} catch (error) {
  console.error('❌ Error copying files:', error);
  process.exit(1);
}