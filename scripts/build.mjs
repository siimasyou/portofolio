// Build statis: menyalin file situs ke dist/ setelah memeriksa semua aset lokal.
// Pakai:  node scripts/build.mjs          -> periksa + salin ke dist/
//         node scripts/build.mjs --check  -> hanya periksa
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const checkOnly = process.argv.includes('--check');

// File dan folder yang ikut dipublikasikan. Tambahkan di sini jika membuat halaman baru.
const publish = ['index.html', 'CNAME', 'css', 'js', 'assets'];

// 1. Pastikan semua yang akan dipublikasikan ada.
const missing = publish.filter((p) => !existsSync(join(root, p)));
if (missing.length) {
  console.error('Tidak ditemukan: ' + missing.join(', '));
  process.exit(1);
}

// 2. Periksa referensi lokal di HTML dan CSS (src, href, url()).
const files = ['index.html', 'css/style.css'];
const refs = [];
for (const f of files) {
  const text = readFileSync(join(root, f), 'utf8');
  const base = dirname(f);
  const re = /(?:src|href)="([^"#]+)"|url\(["']?([^"')#]+)["']?\)/g;
  for (const m of text.matchAll(re)) {
    const ref = m[1] || m[2];
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(ref)) continue;
    refs.push({ from: f, ref, path: join(root, base, ref) });
  }
}
const broken = refs.filter((r) => !existsSync(r.path));
if (broken.length) {
  console.error('Referensi rusak:');
  broken.forEach((r) => console.error(`  ${r.from} -> ${r.ref}`));
  process.exit(1);
}
console.log(`Pemeriksaan lolos: ${refs.length} referensi lokal ditemukan.`);
if (checkOnly) process.exit(0);

// 3. Salin ke dist/.
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
for (const p of publish) cpSync(join(root, p), join(dist, p), { recursive: true });
writeFileSync(join(dist, '.nojekyll'), ''); // agar GitHub Pages tidak memproses ulang
console.log('Selesai: situs tersalin ke dist/');
