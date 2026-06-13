// Gera placeholders LQIP (blur-up) para o next/image a partir das fotos em public/images.
// Saída: src/lib/blur-data.ts (mapa caminho -> data URL minúsculo). Rodar: node scripts/gen-blur.mjs
import sharp from 'sharp';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIR = 'public/images';
const files = (await readdir(DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();

const map = {};
for (const f of files) {
  const buf = await readFile(join(DIR, f));
  const out = await sharp(buf)
    .resize(16, 16, { fit: 'inside' })
    .blur()
    .webp({ quality: 35 })
    .toBuffer();
  map[`/images/${f}`] = `data:image/webp;base64,${out.toString('base64')}`;
}

const ts = `// GERADO por scripts/gen-blur.mjs — não editar à mão (rode: node scripts/gen-blur.mjs).
// Placeholders LQIP (blur-up) p/ o next/image: a foto surge de um desfoque em vez de "pular".
export const BLUR: Record<string, string> = ${JSON.stringify(map, null, 2)};

export function blurProps(src: string): { placeholder: 'blur'; blurDataURL: string } | Record<string, never> {
  const b = BLUR[src];
  return b ? { placeholder: 'blur', blurDataURL: b } : {};
}
`;

await writeFile('src/lib/blur-data.ts', ts, 'utf8');
console.log(`blur-data.ts gerado com ${Object.keys(map).length} imagens.`);
