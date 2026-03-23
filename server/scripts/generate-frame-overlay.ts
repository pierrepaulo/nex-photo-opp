/**
 * Gera frame-overlay.png (1080x1920, alpha na área da foto) a partir de SVG.
 * Duplica para client e server. Rodar a partir de server/: npx tsx scripts/generate-frame-overlay.ts
 */
import { writeFileSync } from 'fs';
import { basename, join } from 'path';

import sharp from 'sharp';

const REPO_ROOT =
  basename(process.cwd()) === 'server' ? join(process.cwd(), '..') : process.cwd();

const W = 1080;
const H = 1920;
const HEADER_H = 320;
const FOOTER_H = 320;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="${W}" height="${HEADER_H}" fill="#FFFFFF"/>
  <rect x="0" y="${H - FOOTER_H}" width="${W}" height="${FOOTER_H}" fill="#FFFFFF"/>
  <text x="${W / 2}" y="108" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#333333">NEX<tspan font-weight="400" fill="#606060">.lab</tspan></text>
  <text x="${W / 2}" y="178" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="600" fill="#606060">we make tech simple_</text>
  <text x="${W / 2}" y="${H - FOOTER_H + 120}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="600" fill="#606060">we make tech simple_</text>
</svg>`;

const outClient = join(REPO_ROOT, 'client', 'src', 'assets', 'frame-overlay.png');
const outServer = join(REPO_ROOT, 'server', 'src', 'assets', 'frame-overlay.png');

void sharp(Buffer.from(svg))
  .png()
  .toBuffer()
  .then((png) => {
    writeFileSync(outClient, png);
    writeFileSync(outServer, png);
    console.log('Wrote', outClient);
    console.log('Wrote', outServer);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
