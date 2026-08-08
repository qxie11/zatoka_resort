const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  const svgPath = path.join(__dirname, '../src/app/icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // Generate 192x192 PNG for Googlebot & Web Manifest
  const png192 = await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toBuffer();

  // Generate 512x512 PNG
  const png512 = await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toBuffer();

  // Generate 180x180 Apple Touch Icon
  const appleIcon = await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toBuffer();

  // Generate 48x48 Favicon PNG
  const png48 = await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toBuffer();

  // Save to public/
  fs.writeFileSync(path.join(__dirname, '../public/icon.png'), png192);
  fs.writeFileSync(path.join(__dirname, '../public/icon-512.png'), png512);
  fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), appleIcon);
  fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), png48);
  fs.writeFileSync(path.join(__dirname, '../public/favicon-48x48.png'), png48);

  // Save to src/app/
  fs.writeFileSync(path.join(__dirname, '../src/app/icon.png'), png192);
  fs.writeFileSync(path.join(__dirname, '../src/app/apple-icon.png'), appleIcon);

  console.log('Successfully generated all Googlebot-compliant PNG & ICO favicons!');
}

generateFavicons().catch(console.error);
