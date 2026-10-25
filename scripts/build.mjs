import { readFile, mkdir, cp, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const files = ['index.html', 'style.css', 'app.js', 'game.css', 'game.js', 'game-core.js', 'gardening.js', 'gardening-core.js', 'world-layout.js', 'world-art.js', 'world-map.js', 'world-map.css', 'game-menus.js', 'game-menus.css', 'calm-postcards.js', 'calm-games.js', 'calm-games-core.js', 'calm-games.css', 'phase-two.js', 'phase-two-core.js', 'phase-two-art.js', 'phase-two.css', 'daily-core.js', 'extras.js', 'motion.js', 'illustration.js', 'atmosphere.css', 'gardening.css', 'audio.js', 'soundscape.js', 'pwa.js', 'sw.js', 'manifest.webmanifest', '.nojekyll', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png'];
const manifest = JSON.parse(await readFile('manifest.webmanifest', 'utf8'));
assert.equal(manifest.start_url, './');
assert.equal(manifest.scope, './');
assert.equal(manifest.display, 'standalone');
for (const icon of manifest.icons) {
  const bytes = await readFile(icon.src);
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
  assert.equal(`${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`, icon.sizes);
}
const html = await readFile('index.html', 'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const ref = match[1];
  if (ref === './' || /^(https?:|#)/.test(ref)) continue;
  assert.ok((await stat(ref)).isFile(), `Archivo no encontrado: ${ref}`);
}
const hash = createHash('sha256');
for (const file of files) hash.update(await readFile(file));
const version = hash.digest('hex').slice(0, 16);
await mkdir('_site', { recursive: true });
for (const file of files) await cp(file, `_site/${file}`, { recursive: true });
const worker = (await readFile('sw.js', 'utf8')).replace('${CACHE_PREFIX}v1', '${CACHE_PREFIX}' + version);
await writeFile('_site/sw.js', worker);
console.log(`PWA verificada y preparada en _site/ (versión ${version}).`);
