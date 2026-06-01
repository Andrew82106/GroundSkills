#!/usr/bin/env node
import { access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { buildBlueprintSource } from './build-blueprint.mjs';
import { loadBlueprintConfig } from './load-config.mjs';

const projectDir = resolve(process.argv[2] || '.');
const registeredTypes = new Set(['text', 'stats', 'table', 'diagram', 'structure', 'quote', 'links', 'image']);
const registeredOverviewTypes = new Set(['mind-map', 'dag', 'list']);
const registeredThemes = new Set([
  'swiss-ikb',
  'swiss-lemon',
  'swiss-green',
  'swiss-orange',
  'editorial-ink',
  'editorial-indigo',
  'editorial-forest',
  'editorial-kraft',
  'editorial-dune'
]);
const errors = [];
const warnings = [];

const err = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

function requireString(value, path) {
  if (typeof value !== 'string' || !value.trim()) err(`${path} must be a non-empty string.`);
}

function checkSlot(slot, path) {
  if (!isObject(slot)) {
    err(`${path} must be an object.`);
    return;
  }
  for (const key of ['x', 'y', 'w', 'h']) {
    if (!Number.isInteger(slot[key])) err(`${path}.${key} must be an integer.`);
  }
  if (!Number.isInteger(slot.x) || !Number.isInteger(slot.w) || !Number.isInteger(slot.y) || !Number.isInteger(slot.h)) return;
  if (slot.x < 1 || slot.y < 1 || slot.w < 1 || slot.h < 1) err(`${path} values must be positive.`);
  if (slot.x + slot.w > 17) err(`${path} exceeds the 16-column grid.`);
  if (slot.y + slot.h > 13) err(`${path} exceeds the 12-row grid.`);
}

function slotsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

async function main() {
  await buildBlueprintSource(projectDir, { optional: true, quiet: true });
  let config;
  try {
    config = await loadBlueprintConfig(projectDir);
  } catch (error) {
    err(`Unable to load blueprint.config.js: ${error.message}`);
  }

  if (!isObject(config)) {
    err('window.BLUEPRINT_CONFIG must be an object.');
    return report();
  }

  requireString(config.title, 'title');
  if (config.theme !== undefined && !registeredThemes.has(config.theme)) {
    err(`theme "${config.theme}" is not registered.`);
  }
  if (config.overview !== undefined) {
    if (!isObject(config.overview)) {
      err('overview must be an object.');
    } else {
      if (config.overview.type !== undefined && !registeredOverviewTypes.has(config.overview.type)) {
        err(`overview.type "${config.overview.type}" is not registered.`);
      }
      for (const key of ['width', 'height']) {
        if (config.overview[key] !== undefined && (!Number.isFinite(config.overview[key]) || config.overview[key] <= 0)) {
          err(`overview.${key} must be a positive number.`);
        }
      }
    }
  }
  if (config.ui !== undefined) {
    if (!isObject(config.ui)) {
      err('ui must be an object.');
    } else {
      if (config.ui.defaultLanguage !== undefined) requireString(config.ui.defaultLanguage, 'ui.defaultLanguage');
      if (config.ui.languages !== undefined && (!Array.isArray(config.ui.languages) || !config.ui.languages.length)) {
        err('ui.languages must contain at least one language.');
      }
      if (Array.isArray(config.ui.languages)) {
        for (const [index, language] of config.ui.languages.entries()) requireString(language, `ui.languages[${index}]`);
        if (config.ui.defaultLanguage && !config.ui.languages.includes(config.ui.defaultLanguage)) {
          err('ui.defaultLanguage must appear in ui.languages.');
        }
      }
      if (config.ui.themes !== undefined && (!Array.isArray(config.ui.themes) || !config.ui.themes.length)) {
        err('ui.themes must contain at least one registered theme.');
      }
      if (Array.isArray(config.ui.themes)) {
        for (const [index, theme] of config.ui.themes.entries()) {
          if (!registeredThemes.has(theme)) err(`ui.themes[${index}] "${theme}" is not registered.`);
        }
      }
    }
  }
  if (!Array.isArray(config.nodes) || !config.nodes.length) err('nodes must contain at least one overview node.');
  if (!Array.isArray(config.relations)) err('relations must be an array.');
  if (!Array.isArray(config.scenes)) err('scenes must be an array.');

  const nodeIds = new Set();
  const sceneIds = new Set();

  for (const [index, node] of (config.nodes || []).entries()) {
    const path = `nodes[${index}]`;
    requireString(node.id, `${path}.id`);
    requireString(node.title, `${path}.title`);
    requireString(node.summary, `${path}.summary`);
    if (nodeIds.has(node.id)) err(`${path}.id duplicates node "${node.id}".`);
    nodeIds.add(node.id);
    if (!Number.isFinite(node.x) || node.x < 4 || node.x > 96) err(`${path}.x must be between 4 and 96.`);
    if (!Number.isFinite(node.y) || node.y < 8 || node.y > 92) err(`${path}.y must be between 8 and 92.`);
  }

  for (const [index, scene] of (config.scenes || []).entries()) {
    const path = `scenes[${index}]`;
    requireString(scene.id, `${path}.id`);
    requireString(scene.title, `${path}.title`);
    if (sceneIds.has(scene.id)) err(`${path}.id duplicates scene "${scene.id}".`);
    sceneIds.add(scene.id);
    if (scene.canvas !== undefined) {
      if (!isObject(scene.canvas)) {
        err(`${path}.canvas must be an object.`);
      } else {
        for (const key of ['width', 'height']) {
          if (scene.canvas[key] !== undefined && (!Number.isFinite(scene.canvas[key]) || scene.canvas[key] <= 0)) {
            err(`${path}.canvas.${key} must be a positive number.`);
          }
        }
      }
    }
    if (!Array.isArray(scene.components)) {
      err(`${path}.components must be an array.`);
      continue;
    }
    if (scene.components.length > 5) warn(`${path} has ${scene.components.length} components. Confirm the density is intentional.`);

    const componentIds = new Set();
    for (const [componentIndex, component] of scene.components.entries()) {
      const componentPath = `${path}.components[${componentIndex}]`;
      requireString(component.id, `${componentPath}.id`);
      requireString(component.type, `${componentPath}.type`);
      if (componentIds.has(component.id)) err(`${componentPath}.id duplicates "${component.id}" within scene "${scene.id}".`);
      componentIds.add(component.id);
      if (!registeredTypes.has(component.type)) err(`${componentPath}.type "${component.type}" is not registered.`);
      checkSlot(component.slot, `${componentPath}.slot`);
      if (component.type === 'image') {
        requireString(component.src, `${componentPath}.src`);
        if (typeof component.src === 'string' && !/^https?:\/\//.test(component.src)) {
          try {
            await access(join(projectDir, component.src));
          } catch {
            warn(`${componentPath}.src does not exist locally: ${component.src}`);
          }
        }
      }
      if (component.type === 'links' && !Array.isArray(component.items)) err(`${componentPath}.items must be an array.`);
      if (component.type === 'table' && (!Array.isArray(component.columns) || !Array.isArray(component.rows))) {
        err(`${componentPath} must define columns and rows arrays.`);
      }
      if (component.type === 'structure') {
        if (component.structureType !== undefined && !registeredOverviewTypes.has(component.structureType)) {
          err(`${componentPath}.structureType "${component.structureType}" is not registered.`);
        }
        if (!Array.isArray(component.nodes) || !component.nodes.length) {
          err(`${componentPath}.nodes must contain at least one structure node.`);
        }
        if (!Array.isArray(component.relations)) err(`${componentPath}.relations must be an array.`);
        const structureNodeIds = new Set();
        for (const [nodeIndex, node] of (component.nodes || []).entries()) {
          const nodePath = `${componentPath}.nodes[${nodeIndex}]`;
          requireString(node.id, `${nodePath}.id`);
          requireString(node.title, `${nodePath}.title`);
          if (structureNodeIds.has(node.id)) err(`${nodePath}.id duplicates structure node "${node.id}".`);
          structureNodeIds.add(node.id);
          if (!Number.isFinite(node.x) || node.x < 4 || node.x > 96) err(`${nodePath}.x must be between 4 and 96.`);
          if (!Number.isFinite(node.y) || node.y < 8 || node.y > 92) err(`${nodePath}.y must be between 8 and 92.`);
        }
        for (const [relationIndex, relation] of (component.relations || []).entries()) {
          const relationPath = `${componentPath}.relations[${relationIndex}]`;
          if (!structureNodeIds.has(relation.from)) err(`${relationPath}.from references missing structure node "${relation.from}".`);
          if (!structureNodeIds.has(relation.to)) err(`${relationPath}.to references missing structure node "${relation.to}".`);
        }
      }
    }

    for (let left = 0; left < scene.components.length; left += 1) {
      for (let right = left + 1; right < scene.components.length; right += 1) {
        const a = scene.components[left];
        const b = scene.components[right];
        if (isObject(a.slot) && isObject(b.slot) && slotsOverlap(a.slot, b.slot)) {
          warn(`Scene "${scene.id}" components "${a.id}" and "${b.id}" overlap.`);
        }
      }
    }
  }

  for (const [index, relation] of (config.relations || []).entries()) {
    const path = `relations[${index}]`;
    if (!nodeIds.has(relation.from)) err(`${path}.from references missing node "${relation.from}".`);
    if (!nodeIds.has(relation.to)) err(`${path}.to references missing node "${relation.to}".`);
  }

  for (const [index, node] of (config.nodes || []).entries()) {
    if (node.scene && !sceneIds.has(node.scene)) err(`nodes[${index}].scene references missing scene "${node.scene}".`);
  }

  for (const [sceneIndex, scene] of (config.scenes || []).entries()) {
    for (const [componentIndex, component] of (scene.components || []).entries()) {
      if (component.type !== 'links') continue;
      for (const [itemIndex, item] of (component.items || []).entries()) {
        if (item.scene && !sceneIds.has(item.scene)) {
          err(`scenes[${sceneIndex}].components[${componentIndex}].items[${itemIndex}].scene references missing scene "${item.scene}".`);
        }
      }
    }
  }

  for (const [sceneIndex, scene] of (config.scenes || []).entries()) {
    for (const [componentIndex, component] of (scene.components || []).entries()) {
      if (component.type !== 'structure') continue;
      for (const [nodeIndex, node] of (component.nodes || []).entries()) {
        if (node.scene && !sceneIds.has(node.scene)) {
          err(`scenes[${sceneIndex}].components[${componentIndex}].nodes[${nodeIndex}].scene references missing scene "${node.scene}".`);
        }
      }
    }
  }

  report();
}

function report() {
  if (warnings.length) {
    console.warn('Blueprint validation warnings:');
    for (const warning of warnings) console.warn(`- ${warning}`);
  }
  if (errors.length) {
    console.error('Blueprint validation failed:');
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log('Blueprint validation passed.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
