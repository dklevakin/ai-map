import { copyFile, mkdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const publicAssets = path.join(projectRoot, 'public', 'assets');
const manifestPath = path.join(projectRoot, 'dist', '.vite', 'manifest.json');

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

try {
  await ensureDir(publicAssets);
  const manifestRaw = await readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestRaw);
  const entry = manifest['src/main.tsx'];

  if (!entry || typeof entry !== 'object') {
    throw new Error('Missing manifest entry for src/main.tsx');
  }

  const jsTarget = path.join(publicAssets, 'app.js');
  const cssTarget = path.join(publicAssets, 'app.css');

  if (entry.file) {
    const jsSource = path.join(projectRoot, 'dist', entry.file);
    await copyFile(jsSource, jsTarget);
    console.log(`Copied ${entry.file} -> assets/app.js`);
  }

  let cssFile = Array.isArray(entry.css) && entry.css.length > 0 ? entry.css[0] : null;
  if (!cssFile) {
    const cssEntry = Object.values(manifest).find((value) => value && typeof value === 'object' && value.src === 'style.css');
    if (cssEntry && cssEntry.file) {
      cssFile = cssEntry.file;
    }
  }

  if (cssFile) {
    const cssSource = path.join(projectRoot, 'dist', cssFile);
    await copyFile(cssSource, cssTarget);
    console.log(`Copied ${cssFile} -> assets/app.css`);
  } else {
    await rm(cssTarget, { force: true });
  }
} catch (error) {
  console.error('Failed to sync bundled assets:', error);
  process.exitCode = 1;
}
