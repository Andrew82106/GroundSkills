#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULT_OVERVIEW = { type: 'mind-map', width: 1440, height: 900 };
const DEFAULT_THEME_LABELS = {
  'swiss-ikb': 'IKB',
  'swiss-lemon': 'LEMON',
  'swiss-green': 'GREEN',
  'swiss-orange': 'ORANGE',
  'editorial-ink': 'INK',
  'editorial-indigo': 'INDIGO',
  'editorial-forest': 'FOREST',
  'editorial-kraft': 'KRAFT',
  'editorial-dune': 'DUNE'
};
const AUTO_SLOTS = {
  1: [{ x: 1, y: 1, w: 16, h: 12 }],
  2: [{ x: 1, y: 1, w: 8, h: 12 }, { x: 10, y: 1, w: 7, h: 12 }],
  3: [{ x: 1, y: 1, w: 8, h: 7 }, { x: 10, y: 1, w: 7, h: 7 }, { x: 4, y: 9, w: 10, h: 3 }],
  4: [{ x: 1, y: 1, w: 8, h: 5 }, { x: 10, y: 1, w: 7, h: 6 }, { x: 1, y: 7, w: 8, h: 5 }, { x: 10, y: 8, w: 7, h: 5 }],
  5: [{ x: 1, y: 1, w: 8, h: 5 }, { x: 10, y: 1, w: 7, h: 5 }, { x: 1, y: 7, w: 5, h: 5 }, { x: 7, y: 7, w: 5, h: 5 }, { x: 13, y: 7, w: 4, h: 5 }]
};

const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);
const clone = (value) => JSON.parse(JSON.stringify(value));

function evenlySpaced(index, count, min, max) {
  if (count <= 1) return (min + max) / 2;
  return min + (max - min) * index / (count - 1);
}

function autoPositions(count, type) {
  if (!count) return [];
  if (type === 'list') {
    return Array.from({ length: count }, (_, index) => ({ x: 50, y: evenlySpaced(index, count, 14, 86) }));
  }
  if (type === 'mind-map') {
    const positions = [{ x: 50, y: 50 }];
    for (let index = 1; index < count; index += 1) {
      const angle = -Math.PI / 2 + (Math.PI * 2 * (index - 1)) / Math.max(1, count - 1);
      positions.push({ x: 50 + Math.cos(angle) * 37, y: 50 + Math.sin(angle) * 34 });
    }
    return positions;
  }
  const columns = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(count))));
  const rows = Math.ceil(count / columns);
  return Array.from({ length: count }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return {
      x: evenlySpaced(column, columns, 12, 88),
      y: evenlySpaced(row, rows, rows === 1 ? 50 : 24, rows === 1 ? 50 : 76)
    };
  });
}

function withAutoPositions(nodes, type) {
  const positions = autoPositions(nodes.length, type);
  return nodes.map((node, index) => ({
    ...node,
    x: node.x ?? positions[index].x,
    y: node.y ?? positions[index].y
  }));
}

function normalizeRelation(relation) {
  if (!Array.isArray(relation)) return clone(relation);
  const [from, to, label] = relation;
  return { from, to, ...(label ? { label } : {}) };
}

function normalizeStructure(component) {
  if (component.type !== 'structure') return component;
  const structureType = component.structureType || 'dag';
  return {
    ...component,
    structureType,
    nodes: withAutoPositions(component.nodes || [], structureType),
    relations: (component.relations || []).map(normalizeRelation)
  };
}

function normalizeComponents(scene, sceneIndex) {
  const blocks = scene.blocks || scene.components || [];
  const fallbackSlots = AUTO_SLOTS[Math.min(blocks.length, 5)] || AUTO_SLOTS[5];
  return blocks.map((block, blockIndex) => normalizeStructure({
    ...clone(block),
    id: block.id || `${scene.id}-block-${blockIndex + 1}`,
    eyebrow: block.eyebrow || block.type?.toUpperCase(),
    slot: block.slot || fallbackSlots[blockIndex] || AUTO_SLOTS[5][4]
  }));
}

function normalizeUi(source) {
  const defaultLanguage = source.language || source.ui?.defaultLanguage || 'zh-CN';
  const languages = source.interfaceLanguages || source.ui?.languages || [defaultLanguage];
  const reviewThemes = source.reviewThemes || source.ui?.themes;
  const ui = {
    defaultLanguage,
    languages,
    languageLabels: { 'zh-CN': '中文', en: 'EN', ...(source.ui?.languageLabels || {}) },
    ...(source.ui || {})
  };
  if (reviewThemes?.length) {
    ui.themes = reviewThemes;
    ui.themeLabels = {
      ...Object.fromEntries(reviewThemes.map((theme) => [theme, DEFAULT_THEME_LABELS[theme] || theme])),
      ...(source.ui?.themeLabels || {})
    };
  }
  return ui;
}

export function compileBlueprintSource(source) {
  if (!isObject(source)) throw new Error('blueprint.source.json must contain an object.');
  if (!Array.isArray(source.nodes) || !source.nodes.length) throw new Error('blueprint.source.json must define at least one node.');
  if (!Array.isArray(source.scenes)) throw new Error('blueprint.source.json scenes must be an array.');

  const overview = { ...DEFAULT_OVERVIEW, ...(source.overview || {}) };
  const nodes = withAutoPositions(source.nodes, overview.type);
  const scenes = source.scenes.map((scene, index) => ({
    id: scene.id,
    node: scene.node || nodes.find((node) => node.scene === scene.id)?.id,
    canvas: scene.canvas || { width: 1600, height: 1000 },
    eyebrow: scene.eyebrow || `SCENE ${String(index + 1).padStart(2, '0')} / DETAIL`,
    title: scene.title,
    summary: scene.summary || '',
    components: normalizeComponents(scene, index)
  }));

  return {
    title: source.title,
    subtitle: source.subtitle || '',
    meta: source.meta || 'BLUEPRINT PRESENTATION',
    theme: source.theme || 'swiss-ikb',
    overview,
    ui: normalizeUi(source),
    nodes,
    relations: (source.relations || []).map(normalizeRelation),
    scenes
  };
}

export async function buildBlueprintSource(projectDir, { optional = true, quiet = false } = {}) {
  const sourcePath = join(projectDir, 'blueprint.source.json');
  let raw;
  try {
    raw = await readFile(sourcePath, 'utf8');
  } catch (error) {
    if (optional && error.code === 'ENOENT') return false;
    throw error;
  }

  const config = compileBlueprintSource(JSON.parse(raw));
  const outputPath = join(projectDir, 'blueprint.config.js');
  const output = `/* GENERATED FILE. Edit blueprint.source.json instead. */\nwindow.BLUEPRINT_CONFIG = ${JSON.stringify(config, null, 2).replaceAll('<', '\\u003c')};\n`;
  await writeFile(outputPath, output);
  if (!quiet) console.log(`Built declarative Blueprint source: ${outputPath}`);
  return true;
}

async function main() {
  const projectDir = resolve(process.argv[2] || '.');
  const built = await buildBlueprintSource(projectDir, { optional: false });
  if (!built) throw new Error('Unable to build blueprint.source.json.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
