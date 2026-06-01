#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';

const projectDir = resolve(process.argv[2] || '.');
const outputFlag = process.argv.indexOf('--output');
const output = resolve(outputFlag > -1 ? process.argv[outputFlag + 1] : join(projectDir, 'dist', 'blueprint.html'));

async function readOptional(filename, fallback) {
  try {
    return await readFile(filename, 'utf8');
  } catch {
    return fallback;
  }
}

async function main() {
  const index = await readFile(join(projectDir, 'index.html'), 'utf8');
  const css = await readFile(join(projectDir, 'blueprint.css'), 'utf8');
  const config = await readFile(join(projectDir, 'blueprint.config.js'), 'utf8');
  const runtime = await readFile(join(projectDir, 'blueprint-runtime.js'), 'utf8');
  const overrides = await readOptional(join(projectDir, 'blueprint-overrides.json'), '{}');
  JSON.parse(overrides);

  let packed = index
    .replace('<link rel="stylesheet" href="./blueprint.css" data-blueprint-style>', `<style data-blueprint-style>\n${css}\n</style>`)
    .replace('<script src="./blueprint.config.js" data-blueprint-config></script>', `<script data-blueprint-config>\n${config}\nwindow.BLUEPRINT_OVERRIDES = ${overrides};\n</script>`)
    .replace('<script src="./blueprint-runtime.js" data-blueprint-runtime></script>', `<script data-blueprint-runtime>\n${runtime}\n</script>`);

  const mimeByExtension = {
    '.gif': 'image/gif',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
  };

  const localImages = [...packed.matchAll(/["'](images\/[^"']+)["']/g)].map((match) => match[1]);
  for (const imagePath of new Set(localImages)) {
    const extension = extname(imagePath).toLowerCase();
    const mime = mimeByExtension[extension];
    if (!mime) throw new Error(`Cannot inline unsupported image type: ${imagePath}`);
    const bytes = await readFile(join(projectDir, imagePath));
    const dataUrl = `data:${mime};base64,${bytes.toString('base64')}`;
    packed = packed.replaceAll(imagePath, dataUrl);
  }

  if (packed.includes('./blueprint-runtime.js') || packed.includes('./blueprint.config.js') || packed.includes('./blueprint.css')) {
    throw new Error('Packing failed: expected starter asset tags were not replaced.');
  }

  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, packed);
  console.log(`Packed single-file Blueprint: ${output}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
