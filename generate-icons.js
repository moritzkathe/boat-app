const fs = require('fs');
const path = require('path');

// Create a simple PNG icon using a data URL approach
// For now, let's create placeholder PNG files that we can replace later

const createPNGPlaceholder = (size, filename) => {
  // Create a simple black square with white text as placeholder
  const canvas = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="${size/8}">CLIPPER</text>
</svg>`;
  
  fs.writeFileSync(path.join('public', filename.replace('.png', '.svg')), canvas);
  console.log(`Created ${filename.replace('.png', '.svg')}`);
};

// Create the icon files
createPNGPlaceholder(192, 'icon-192.png');
createPNGPlaceholder(512, 'icon-512.png');

console.log('Icon files created!');
console.log('Note: These are SVG placeholders. For production, you should convert them to actual PNG files.');
