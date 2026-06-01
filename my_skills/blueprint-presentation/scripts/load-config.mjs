import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import vm from 'node:vm';

export async function loadBlueprintConfig(projectDir) {
  const filename = join(projectDir, 'blueprint.config.js');
  const source = await readFile(filename, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename, timeout: 1000 });
  return sandbox.window.BLUEPRINT_CONFIG;
}
