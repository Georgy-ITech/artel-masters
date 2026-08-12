/**
 * Логотип не рисуется от руки: берём глиф из гарнитуры и переводим в кривые.
 * В рантайм уходит только <path>, шрифт не грузится вообще.
 *
 *   node scripts/build-wordmark.mjs
 */
import opentype from "opentype.js";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";

const { parse, Path } = opentype;

const FONT = ".fonts/Oranienbaum-Regular.ttf";
const SIZE = 200;
const TRACKING = 0.1; // разрядка, доля кегля

const buf = readFileSync(FONT);
const font = parse(
  buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
);

function pathFor(text, tracking = 0) {
  const glyphs = font.stringToGlyphs(text);
  const scale = SIZE / font.unitsPerEm;
  const combined = new Path();
  let x = 0;
  for (const glyph of glyphs) {
    const p = glyph.getPath(x, 0, SIZE);
    combined.extend(p);
    x += glyph.advanceWidth * scale + SIZE * tracking;
  }
  const width = x - SIZE * tracking;
  return { d: combined.toPathData(3), width };
}

const wordmark = pathFor("АРТЕЛЬ", TRACKING);
const letter = pathFor("А");

// вертикальные границы берём по реальным контурам, а не по метрикам кегля
function boundsOf(d) {
  const nums = d.match(/-?\d+(\.\d+)?/g).map(Number);
  const ys = nums.filter((_, i) => i % 2 === 1);
  return { min: Math.min(...ys), max: Math.max(...ys) };
}

const wb = boundsOf(wordmark.d);
const lb = boundsOf(letter.d);

mkdirSync("src/components", { recursive: true });

const file = `// Сгенерировано scripts/build-wordmark.mjs из Oranienbaum-Regular.
// Правки вносить в скрипт, а не сюда.

export const WORDMARK_PATH =
  "${wordmark.d}";
export const WORDMARK_VIEWBOX = "0 ${wb.min.toFixed(2)} ${wordmark.width.toFixed(2)} ${(wb.max - wb.min).toFixed(2)}";

export const LETTER_PATH =
  "${letter.d}";
export const LETTER_VIEWBOX = "0 ${lb.min.toFixed(2)} ${letter.width.toFixed(2)} ${(lb.max - lb.min).toFixed(2)}";
`;

writeFileSync("src/components/wordmark-path.ts", file);

// фавикон: та же буква в рамке-печати, без фильтра — на 16 px он превращается в кашу
const letterH = lb.max - lb.min;
const side = Math.max(letter.width, letterH) + 78;
const x0 = letter.width / 2 - side / 2;
const y0 = lb.min + letterH / 2 - side / 2;
const inset = 13;
writeFileSync(
  "src/app/icon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0.toFixed(1)} ${y0.toFixed(1)} ${side.toFixed(1)} ${side.toFixed(1)}" width="64" height="64">
  <rect x="${x0.toFixed(1)}" y="${y0.toFixed(1)}" width="${side.toFixed(1)}" height="${side.toFixed(1)}" fill="#14110d"/>
  <rect x="${(x0 + inset).toFixed(1)}" y="${(y0 + inset).toFixed(1)}" width="${(side - inset * 2).toFixed(1)}" height="${(side - inset * 2).toFixed(1)}" fill="none" stroke="#d6452d" stroke-width="15"/>
  <path d="${letter.d}" fill="#d6452d" stroke="#d6452d" stroke-width="9" stroke-linejoin="round"/>
</svg>
`,
);

console.log("вордмарк:", wordmark.width.toFixed(1), "×", (wb.max - wb.min).toFixed(1));
console.log("буква:", letter.width.toFixed(1), "×", (lb.max - lb.min).toFixed(1));
console.log("→ src/components/wordmark-path.ts");
