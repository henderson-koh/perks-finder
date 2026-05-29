// Generates icons/icon-192.png and icons/icon-512.png using only Node.js core.
// Run once: node create-icons.js
// Produces solid-color (#4f7eff) PNG files suitable for PWA manifest icons.

const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const len  = Buffer.alloc(4);  len.writeUInt32BE(data.length);
  const t    = Buffer.from(type, 'ascii');
  const crcb = Buffer.alloc(4);  crcb.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcb]);
}

function solidPng(size, r, g, b) {
  const sig  = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit truecolor RGB

  // Each row: filter byte (0=None) + R G B per pixel
  const row = Buffer.alloc(1 + size * 3);
  for (let x = 0; x < size; x++) {
    row[1 + x * 3]     = r;
    row[1 + x * 3 + 1] = g;
    row[1 + x * 3 + 2] = b;
  }
  const raw  = Buffer.concat(Array.from({ length: size }, () => row));
  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

const dir = path.join(__dirname, 'icons');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

// #4f7eff = rgb(79, 126, 255)
fs.writeFileSync(path.join(dir, 'icon-192.png'), solidPng(192, 79, 126, 255));
fs.writeFileSync(path.join(dir, 'icon-512.png'), solidPng(512, 79, 126, 255));

console.log('Generated icons/icon-192.png and icons/icon-512.png');
