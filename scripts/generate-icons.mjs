// Genera los iconos PWA (192 y 512 px) como PNG puros con zlib de Node,
// sin dependencias externas: estrella dorada sobre azul noche.
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

const table = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  table[n] = c >>> 0;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const t = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

const NAVY = [10, 18, 48];
const GOLD = [245, 179, 1];

function draw(size) {
  const px = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  // Estrella de 5 puntas
  const star = [];
  const R1 = size * 0.3;
  const R2 = size * 0.125;
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? R1 : R2;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    star.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  const inPoly = (x, y) => {
    let inside = false;
    for (let i = 0, j = star.length - 1; i < star.length; j = i++) {
      const xi = star[i][0];
      const yi = star[i][1];
      const xj = star[j][0];
      const yj = star[j][1];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };
  const ringR = size * 0.42;
  const ringT = size * 0.035;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - cx, y - cy);
      let col = NAVY;
      if (Math.abs(d - ringR) < ringT) col = GOLD;
      else if (inPoly(x + 0.5, y + 0.5)) col = GOLD;
      const o = (y * size + x) * 4;
      px[o] = col[0];
      px[o + 1] = col[1];
      px[o + 2] = col[2];
      px[o + 3] = 255;
    }
  }
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filtro "none"
    px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // 8 bits por canal
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const size of [192, 512]) {
  const buf = draw(size);
  writeFileSync(join(outDir, `icon-${size}.png`), buf);
  console.log(`OK icon-${size}.png (${buf.length} bytes)`);
}
