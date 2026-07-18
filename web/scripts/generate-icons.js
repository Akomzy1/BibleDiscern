// Generates the PWA icons (brand navy ground + gold cross, maskable-safe)
// as real PNGs with zero dependencies — zlib only. Run: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Brand tokens (mirrors packages/shared/src/tokens.ts)
const NAVY = [27, 42, 74]; // #1B2A4A
const GOLD = [200, 164, 94]; // #C8A45E

// ── minimal PNG encoder ──────────────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── draw the mark ────────────────────────────────────────────────────────────
function drawIcon(size) {
  const px = Buffer.alloc(size * size * 4);
  const set = (x, y, [r, g, b]) => {
    const i = (y * size + x) * 4;
    px[i] = r;
    px[i + 1] = g;
    px[i + 2] = b;
    px[i + 3] = 255;
  };
  // navy ground (full bleed — maskable safe)
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) set(x, y, NAVY);
  // gold cross, kept inside the maskable safe zone (inner 60%)
  const stroke = Math.round(size * 0.055);
  const vx0 = Math.round(size / 2 - stroke / 2);
  const vx1 = vx0 + stroke;
  const vy0 = Math.round(size * 0.24);
  const vy1 = Math.round(size * 0.76);
  const hy0 = Math.round(size * 0.395);
  const hy1 = hy0 + stroke;
  const hx0 = Math.round(size * 0.32);
  const hx1 = Math.round(size * 0.68);
  for (let y = vy0; y < vy1; y++) for (let x = vx0; x < vx1; x++) set(x, y, GOLD);
  for (let y = hy0; y < hy1; y++) for (let x = hx0; x < hx1; x++) set(x, y, GOLD);
  return encodePng(size, size, px);
}

const outDir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(outDir, { recursive: true });
for (const size of [192, 512]) {
  const file = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(file, drawIcon(size));
  console.log('wrote', file);
}
