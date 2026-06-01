#!/usr/bin/env node
import { cp, mkdir, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const skillRoot = resolve(scriptDir, '..');
const starter = join(skillRoot, 'assets', 'starter');
const target = resolve(process.argv[2] || 'blueprint-project');

async function main() {
  await mkdir(target, { recursive: true });
  const existing = await readdir(target);
  if (existing.length) {
    console.error(`Target directory is not empty: ${target}`);
    console.error('Choose an empty directory so existing work is not overwritten.');
    process.exit(1);
  }

  await cp(starter, target, { recursive: true });
  console.log(`Initialized Blueprint project: ${target}`);
  console.log('');
  console.log('Next:');
  console.log(`  1. Edit ${join(target, 'blueprint.config.js')}`);
  console.log(`  2. Validate with: node ${join(skillRoot, 'scripts', 'validate-blueprint.mjs')} ${target}`);
  console.log(`  3. Optionally preview source edits with: cd ${target} && python3 -m http.server 4173`);
  console.log(`  4. Pack with: node ${join(skillRoot, 'scripts', 'pack-blueprint.mjs')} ${target}`);
  console.log(`  5. Deliver ${join(target, 'blueprint.html')}; viewers open it directly.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
