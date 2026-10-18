// Descarga las fuentes Barlow / Barlow Condensed (woff2, subconjuntos latin y
// latin-ext) desde Google Fonts para servirlas en local (la app debe funcionar
// sin conexión una vez instalada).
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "fonts");
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const FONTS = [
  { family: "Barlow Condensed", weights: [600, 700], prefix: "barlow-condensed" },
  { family: "Barlow", weights: [400, 500, 700], prefix: "barlow" },
];

async function woff2Url(family, weight, subset) {
  const url =
    "https://fonts.googleapis.com/css2?family=" +
    encodeURIComponent(family) +
    ":wght@" +
    weight +
    "&display=swap";
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error("HTTP " + res.status + " para " + family + " " + weight);
  const css = await res.text();
  // Bloques precedidos por comentarios /* latin */ y /* latin-ext */
  const re = new RegExp(
    "/\\* " + subset + " \\*/[^}]*url\\((https://[^)]+\\.woff2)\\)",
    "s",
  );
  const m = css.match(re);
  return m ? m[1] : null;
}

const manifest = [];
for (const f of FONTS) {
  for (const w of f.weights) {
    for (const subset of ["latin", "latin-ext"]) {
      const url = await woff2Url(f.family, w, subset);
      if (!url) {
        console.log("AVISO: no se encontró " + f.family + " " + w + " (" + subset + ")");
        continue;
      }
      const name = f.prefix + "-" + w + "-" + subset + ".woff2";
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(join(root, name), buf);
      manifest.push({ family: f.family, weight: w, subset, file: name });
      console.log("OK " + name + " (" + buf.length + " bytes)");
    }
  }
}
writeFileSync(join(root, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("Fuentes descargadas: " + manifest.length);
