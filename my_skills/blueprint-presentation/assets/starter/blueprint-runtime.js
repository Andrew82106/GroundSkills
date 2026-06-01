/*
 * Blueprint Presentation - AGPL-3.0
 * Adapts Swiss visual-system ideas from https://github.com/op7418/guizang-ppt-skill
 */
(() => {
  'use strict';

  const STORAGE_PREFIX = 'blueprint-presentation:';
  const GRID_COLUMNS = 16;
  const GRID_ROWS = 12;
  const app = document.getElementById('app');
  const baseConfig = window.BLUEPRINT_CONFIG;
  const DEFAULT_UI_TEXT = {
    'zh-CN': {
      overview: '总览',
      back: '返回上一级',
      fit: '适应画布',
      rehearsal: '预演模式',
      exitRehearsal: '退出预演',
      undo: '撤销',
      redo: '重做',
      resetScene: '重置场景',
      save: '保存调整',
      zoomOut: '缩小',
      zoomIn: '放大',
      switchLanguage: '切换界面语言',
      switchTheme: '切换视觉主题',
      directionalRelation: '方向关系',
      clickNode: '点击节点查看概览',
      presentationLocked: '演示模式 / 结构已锁定',
      rehearsalEnabled: '预演模式 / 可进行本地校准',
      nodePreview: '节点概览',
      closePreview: '关闭节点概览',
      enterScene: '进入场景',
      close: '关闭',
      scene: '场景',
      node: '节点',
      graphType: '结构类型',
      currentContext: '当前场景仍然属于全局结构。返回上一级时，会回到进入这里之前的位置。',
      currentPosition: '当前在全局蓝图中的位置',
      move: '拖动',
      drag: '拖动',
      resize: '调整组件尺寸',
      undoDone: '已撤销上一次预演调整',
      redoDone: '已恢复预演调整',
      rehearsalOn: '已进入预演模式',
      rehearsalOff: '已回到演示模式',
      resetDone: '已重置当前场景',
      saveDone: '已保存 blueprint-overrides.json',
      saveCancelled: '已取消保存',
      downloadDone: '已下载 blueprint-overrides.json',
      textDone: '已保存本地文字修订',
      resizeDone: '已调整尺寸并保存到本地',
      moveDone: '已移动并保存到本地'
    },
    en: {
      overview: 'Overview',
      back: 'Back one level',
      fit: 'Fit',
      rehearsal: 'Rehearsal',
      exitRehearsal: 'Exit rehearsal',
      undo: 'Undo',
      redo: 'Redo',
      resetScene: 'Reset scene',
      save: 'Save changes',
      zoomOut: 'Zoom out',
      zoomIn: 'Zoom in',
      switchLanguage: 'Switch interface language',
      switchTheme: 'Switch visual theme',
      directionalRelation: 'Directional relation',
      clickNode: 'Click node for preview',
      presentationLocked: 'Presentation mode / structure locked',
      rehearsalEnabled: 'Rehearsal mode / local calibration enabled',
      nodePreview: 'Node preview',
      closePreview: 'Close node preview',
      enterScene: 'Enter scene',
      close: 'Close',
      scene: 'Scene',
      node: 'Node',
      graphType: 'Structure type',
      currentContext: 'This scene still belongs to the global structure. Going back returns to the level you entered from.',
      currentPosition: 'Current position in global blueprint',
      move: 'Move',
      drag: 'Drag',
      resize: 'Resize component',
      undoDone: 'Undid the last rehearsal change',
      redoDone: 'Restored the rehearsal change',
      rehearsalOn: 'Rehearsal mode enabled',
      rehearsalOff: 'Presentation mode enabled',
      resetDone: 'Reset the current scene',
      saveDone: 'Saved blueprint-overrides.json',
      saveCancelled: 'Save cancelled',
      downloadDone: 'Downloaded blueprint-overrides.json',
      textDone: 'Saved local text revision',
      resizeDone: 'Resized and saved locally',
      moveDone: 'Moved and saved locally'
    }
  };

  if (!app || !baseConfig) {
    throw new Error('Blueprint requires #app and window.BLUEPRINT_CONFIG.');
  }

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const storageKey = `${STORAGE_PREFIX}${baseConfig.title || 'untitled'}`;
  const languageKey = `${storageKey}:language`;
  const themeKey = `${storageKey}:theme`;
  const availableLanguages = [...new Set(baseConfig.ui?.languages || [baseConfig.ui?.defaultLanguage || 'zh-CN', 'en'])];
  const defaultLanguage = baseConfig.ui?.defaultLanguage || availableLanguages[0] || 'zh-CN';
  const defaultTheme = baseConfig.theme || 'swiss-ikb';
  const availableThemes = [...new Set([defaultTheme, ...(baseConfig.ui?.themes || [])])];
  const overviewConfig = {
    type: 'mind-map',
    width: 1440,
    height: 900,
    ...(baseConfig.overview || {})
  };
  const state = {
    view: 'overview',
    sceneId: null,
    selectedNodeId: null,
    selectedStructureNode: null,
    selectedComponentId: null,
    navigation: [],
    rehearsal: new URLSearchParams(location.search).get('mode') === 'rehearsal',
    language: defaultLanguage,
    theme: defaultTheme,
    overviewTransform: { x: 0, y: 0, zoom: 1 },
    overviewFitted: false,
    overviewTouched: false,
    sceneTransforms: {},
    sceneFitted: {},
    sceneTouched: {},
    overrides: { version: 1, layout: {}, content: {} },
    undo: [],
    redo: []
  };

  let toastTimer;

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const escapeAttr = escapeHtml;

  function t(key) {
    return baseConfig.ui?.labels?.[state.language]?.[key]
      || DEFAULT_UI_TEXT[state.language]?.[key]
      || DEFAULT_UI_TEXT.en[key]
      || key;
  }

  function loadLanguage() {
    try {
      const savedLanguage = localStorage.getItem(languageKey);
      if (savedLanguage && availableLanguages.includes(savedLanguage)) state.language = savedLanguage;
    } catch {
      state.language = defaultLanguage;
    }
  }

  function toggleLanguage() {
    if (availableLanguages.length < 2) return;
    const index = availableLanguages.indexOf(state.language);
    state.language = availableLanguages[(index + 1) % availableLanguages.length];
    try {
      localStorage.setItem(languageKey, state.language);
    } catch {
      // A packed file still works when the browser disables local storage.
    }
    render();
  }

  function nextLanguageLabel() {
    if (availableLanguages.length < 2) return '';
    const index = availableLanguages.indexOf(state.language);
    const nextLanguage = availableLanguages[(index + 1) % availableLanguages.length];
    return baseConfig.ui?.languageLabels?.[nextLanguage] || nextLanguage;
  }

  function loadTheme() {
    try {
      const savedTheme = localStorage.getItem(themeKey);
      if (savedTheme && availableThemes.includes(savedTheme)) state.theme = savedTheme;
    } catch {
      state.theme = defaultTheme;
    }
  }

  function applyTheme() {
    document.body.dataset.theme = state.theme;
  }

  function toggleTheme() {
    if (availableThemes.length < 2) return;
    const index = availableThemes.indexOf(state.theme);
    state.theme = availableThemes[(index + 1) % availableThemes.length];
    try {
      localStorage.setItem(themeKey, state.theme);
    } catch {
      // A packed file still works when the browser disables local storage.
    }
    render();
  }

  function nextThemeLabel() {
    if (availableThemes.length < 2) return '';
    const index = availableThemes.indexOf(state.theme);
    const nextTheme = availableThemes[(index + 1) % availableThemes.length];
    return baseConfig.ui?.themeLabels?.[nextTheme] || nextTheme;
  }

  function mergeOverrides(...layers) {
    const merged = { version: 1, layout: {}, content: {} };
    for (const layer of layers) {
      if (!layer || typeof layer !== 'object') continue;
      if (layer.layout && typeof layer.layout === 'object') {
        for (const [sceneId, components] of Object.entries(layer.layout)) {
          merged.layout[sceneId] = { ...(merged.layout[sceneId] || {}), ...(components || {}) };
        }
      }
      if (layer.content && typeof layer.content === 'object') {
        Object.assign(merged.content, layer.content);
      }
    }
    return merged;
  }

  async function loadInitialOverrides() {
    let fileOverrides = window.BLUEPRINT_OVERRIDES;
    if (!fileOverrides && !window.BLUEPRINT_PACKED) {
      try {
        const response = await fetch('./blueprint-overrides.json', { cache: 'no-store' });
        if (response.ok) fileOverrides = await response.json();
      } catch {
        fileOverrides = {};
      }
    }
    let draftOverrides = {};
    try {
      draftOverrides = JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch {
      draftOverrides = {};
    }
    state.overrides = mergeOverrides(fileOverrides, draftOverrides);
  }

  function persistDraft() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state.overrides));
    } catch {
      // A packed file remains usable when the browser disables local storage.
    }
  }

  function snapshot() {
    return clone(state.overrides);
  }

  function record(before) {
    state.undo.push(before);
    if (state.undo.length > 60) state.undo.shift();
    state.redo = [];
  }

  function undo() {
    if (!state.undo.length) return;
    state.redo.push(snapshot());
    state.overrides = state.undo.pop();
    persistDraft();
    render();
    showToast(t('undoDone'));
  }

  function redo() {
    if (!state.redo.length) return;
    state.undo.push(snapshot());
    state.overrides = state.redo.pop();
    persistDraft();
    render();
    showToast(t('redoDone'));
  }

  function getText(key, fallback = '') {
    return Object.prototype.hasOwnProperty.call(state.overrides.content, key)
      ? state.overrides.content[key]
      : fallback;
  }

  function setText(key, value) {
    const before = snapshot();
    state.overrides.content[key] = value;
    record(before);
    persistDraft();
  }

  function getSlot(sceneId, component) {
    return {
      ...component.slot,
      ...(state.overrides.layout[sceneId]?.[component.id] || {})
    };
  }

  function setSlot(sceneId, componentId, slot, before) {
    state.overrides.layout[sceneId] ||= {};
    state.overrides.layout[sceneId][componentId] = slot;
    record(before);
    persistDraft();
  }

  function editable(key, value, className = '') {
    return `<span class="${className}" data-edit-key="${escapeAttr(key)}">${escapeHtml(getText(key, value))}</span>`;
  }

  function showToast(message) {
    const toast = document.querySelector('.toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  }

  function toolbar() {
    const sceneControls = state.view === 'scene'
      ? `
        <button class="tool-button" data-action="back">${escapeHtml(t('back'))}</button>
        <button class="tool-button" data-action="overview">${escapeHtml(t('overview'))}</button>
        <button class="tool-button" data-action="zoom-out" aria-label="${escapeAttr(t('zoomOut'))}">−</button>
        <button class="tool-button" data-action="zoom-fit">${escapeHtml(t('fit'))}</button>
        <button class="tool-button" data-action="zoom-in" aria-label="${escapeAttr(t('zoomIn'))}">+</button>
      `
      : `
        <button class="tool-button" data-action="zoom-out" aria-label="${escapeAttr(t('zoomOut'))}">−</button>
        <button class="tool-button" data-action="zoom-fit">${escapeHtml(t('fit'))}</button>
        <button class="tool-button" data-action="zoom-in" aria-label="${escapeAttr(t('zoomIn'))}">+</button>
      `;

    return `
      <header class="topbar">
        <div class="brand"><span class="brand-mark"></span><span>Blueprint / ${escapeHtml(baseConfig.title)}</span></div>
        <div class="toolbar">
          <div class="toolbar-group">${sceneControls}</div>
          <div class="toolbar-group rehearsal-only">
            <button class="tool-button" data-action="undo" ${state.undo.length ? '' : 'disabled'}>${escapeHtml(t('undo'))}</button>
            <button class="tool-button" data-action="redo" ${state.redo.length ? '' : 'disabled'}>${escapeHtml(t('redo'))}</button>
            ${state.view === 'scene' ? `<button class="tool-button" data-action="reset-scene">${escapeHtml(t('resetScene'))}</button>` : ''}
            <button class="tool-button" data-action="save">${escapeHtml(t('save'))}</button>
          </div>
          <div class="toolbar-group">
            ${availableThemes.length > 1 ? `<button class="tool-button" data-action="toggle-theme" aria-label="${escapeAttr(t('switchTheme'))}: ${escapeAttr(nextThemeLabel())}">${escapeHtml(nextThemeLabel())}</button>` : ''}
            ${availableLanguages.length > 1 ? `<button class="tool-button" data-action="toggle-language" aria-label="${escapeAttr(t('switchLanguage'))}">${escapeHtml(nextLanguageLabel())}</button>` : ''}
            <button class="tool-button ${state.rehearsal ? 'active' : ''}" data-action="toggle-mode">
              ${escapeHtml(state.rehearsal ? t('exitRehearsal') : t('rehearsal'))}
            </button>
          </div>
        </div>
      </header>
    `;
  }

  function overviewTransformStyle() {
    const { x, y, zoom } = state.overviewTransform;
    return `width:${overviewConfig.width}px;height:${overviewConfig.height}px;transform:translate(${x}px, ${y}px) scale(${zoom})`;
  }

  function updateOverviewTransform() {
    const stage = document.querySelector('.overview-stage');
    if (stage) stage.style.transform = `translate(${state.overviewTransform.x}px, ${state.overviewTransform.y}px) scale(${state.overviewTransform.zoom})`;
  }

  function fitOverview() {
    const viewport = document.querySelector('.overview-viewport');
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    const padding = Math.min(54, Math.max(22, rect.width * .045));
    const zoom = clamp(Math.min(
      (rect.width - padding * 2) / overviewConfig.width,
      (rect.height - padding * 2) / overviewConfig.height
    ), .28, 1);
    state.overviewTransform = {
      x: (rect.width - overviewConfig.width * zoom) / 2,
      y: (rect.height - overviewConfig.height * zoom) / 2,
      zoom: Number(zoom.toFixed(3))
    };
    state.overviewFitted = true;
    state.overviewTouched = false;
    updateOverviewTransform();
  }

  function scheduleOverviewFit() {
    if (state.view !== 'overview' || state.overviewFitted) return;
    requestAnimationFrame(fitOverview);
  }

  function zoomOverview(delta) {
    const viewport = document.querySelector('.overview-viewport');
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    const previous = state.overviewTransform;
    const nextZoom = clamp(Number((previous.zoom + delta).toFixed(3)), .28, 2.4);
    const focusX = rect.width / 2;
    const focusY = rect.height / 2;
    const canvasX = (focusX - previous.x) / previous.zoom;
    const canvasY = (focusY - previous.y) / previous.zoom;
    state.overviewTransform = {
      x: focusX - canvasX * nextZoom,
      y: focusY - canvasY * nextZoom,
      zoom: nextZoom
    };
    state.overviewTouched = true;
    updateOverviewTransform();
  }

  function beginOverviewPan(event) {
    if (state.view !== 'overview' || event.button !== 0) return false;
    const viewport = event.target.closest('.overview-viewport');
    if (!viewport || event.target.closest('button, a, .preview-drawer')) return false;
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const initial = { ...state.overviewTransform };
    viewport.classList.add('is-panning');

    const move = (moveEvent) => {
      state.overviewTransform = {
        ...state.overviewTransform,
        x: initial.x + moveEvent.clientX - startX,
        y: initial.y + moveEvent.clientY - startY
      };
      state.overviewTouched = true;
      updateOverviewTransform();
    };

    const up = () => {
      viewport.classList.remove('is-panning');
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    };

    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up, { once: true });
    return true;
  }

  function getScene(sceneId = state.sceneId) {
    return baseConfig.scenes.find((scene) => scene.id === sceneId);
  }

  function getSceneCanvas(scene) {
    return {
      width: 1600,
      height: 1000,
      ...(scene.canvas || {})
    };
  }

  function getSceneTransform(sceneId = state.sceneId) {
    return state.sceneTransforms[sceneId] || { x: 0, y: 0, zoom: 1 };
  }

  function sceneTransformStyle(scene) {
    const canvas = getSceneCanvas(scene);
    const { x, y, zoom } = getSceneTransform(scene.id);
    return `width:${canvas.width}px;height:${canvas.height}px;transform:translate(${x}px, ${y}px) scale(${zoom})`;
  }

  function updateSceneTransform() {
    const stage = document.querySelector('.scene-stage');
    if (!stage || !state.sceneId) return;
    const { x, y, zoom } = getSceneTransform();
    stage.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
  }

  function fitScene() {
    const viewport = document.querySelector('.scene-main');
    const scene = getScene();
    if (!viewport || !scene) return;
    const canvas = getSceneCanvas(scene);
    const rect = viewport.getBoundingClientRect();
    const padding = Math.min(46, Math.max(18, rect.width * .035));
    const zoom = clamp(Math.min(
      (rect.width - padding * 2) / canvas.width,
      (rect.height - padding * 2) / canvas.height
    ), .28, 1);
    state.sceneTransforms[scene.id] = {
      x: (rect.width - canvas.width * zoom) / 2,
      y: (rect.height - canvas.height * zoom) / 2,
      zoom: Number(zoom.toFixed(3))
    };
    state.sceneFitted[scene.id] = true;
    state.sceneTouched[scene.id] = false;
    updateSceneTransform();
  }

  function scheduleSceneFit() {
    if (state.view !== 'scene' || !state.sceneId || state.sceneFitted[state.sceneId]) return;
    requestAnimationFrame(fitScene);
  }

  function zoomScene(delta) {
    const viewport = document.querySelector('.scene-main');
    const scene = getScene();
    if (!viewport || !scene) return;
    const rect = viewport.getBoundingClientRect();
    const previous = getSceneTransform(scene.id);
    const nextZoom = clamp(Number((previous.zoom + delta).toFixed(3)), .28, 2.4);
    const focusX = rect.width / 2;
    const focusY = rect.height / 2;
    const canvasX = (focusX - previous.x) / previous.zoom;
    const canvasY = (focusY - previous.y) / previous.zoom;
    state.sceneTransforms[scene.id] = {
      x: focusX - canvasX * nextZoom,
      y: focusY - canvasY * nextZoom,
      zoom: nextZoom
    };
    state.sceneTouched[scene.id] = true;
    updateSceneTransform();
  }

  function beginScenePan(event) {
    if (state.view !== 'scene' || event.button !== 0) return false;
    const viewport = event.target.closest('.scene-main');
    if (!viewport || event.target.closest('button, a, .preview-drawer, [contenteditable="true"]')) return false;
    if (state.rehearsal && event.target.closest('[data-component]')) return false;
    event.preventDefault();
    const scene = getScene();
    const startX = event.clientX;
    const startY = event.clientY;
    const initial = { ...getSceneTransform(scene.id) };
    viewport.classList.add('is-panning');

    const move = (moveEvent) => {
      state.sceneTransforms[scene.id] = {
        ...getSceneTransform(scene.id),
        x: initial.x + moveEvent.clientX - startX,
        y: initial.y + moveEvent.clientY - startY
      };
      state.sceneTouched[scene.id] = true;
      updateSceneTransform();
    };

    const up = () => {
      viewport.classList.remove('is-panning');
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    };

    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up, { once: true });
    return true;
  }

  function zoomActiveCanvas(delta) {
    if (state.view === 'scene') zoomScene(delta);
    else zoomOverview(delta);
  }

  function fitActiveCanvas() {
    if (state.view === 'scene') fitScene();
    else fitOverview();
  }

  function relationMarkup(relation) {
    const from = baseConfig.nodes.find((node) => node.id === relation.from);
    const to = baseConfig.nodes.find((node) => node.id === relation.to);
    if (!from || !to) return '';
    const middleX = (from.x + to.x) / 2;
    const middleY = (from.y + to.y) / 2;
    const curve = Math.abs(to.x - from.x) > 18 ? -7 : 7;
    const controlY = middleY + curve;
    return `
      <path class="relation-path" d="M ${from.x} ${from.y} Q ${middleX} ${controlY} ${to.x} ${to.y}"></path>
      <text class="relation-label" x="${middleX}" y="${middleY - 2}">${escapeHtml(relation.label || '')}</text>
    `;
  }

  function nodeMarkup(node, index) {
    const key = `nodes.${node.id}.title`;
    return `
      <button
        class="blueprint-node tone-${escapeAttr(node.tone || 'default')} ${state.selectedNodeId === node.id ? 'is-active' : ''}"
        style="left:${node.x}%;top:${node.y}%"
        data-action="select-node"
        data-node="${escapeAttr(node.id)}"
        aria-label="${escapeAttr(t('node'))}: ${escapeAttr(getText(key, node.title))}">
        <span class="node-index">${String(index + 1).padStart(2, '0')} / ${escapeHtml(node.scene ? t('scene') : t('node'))}</span>
        <span class="node-title">${escapeHtml(getText(key, node.title))}</span>
        ${node.scene ? '<span class="node-scene-marker" aria-hidden="true"></span>' : ''}
      </button>
    `;
  }

  function drawerMarkup() {
    let node;
    let titleKey;
    let summaryKey;
    let metaId;
    if (state.selectedStructureNode) {
      const scene = getScene(state.selectedStructureNode.sceneId);
      const component = scene?.components.find((item) => item.id === state.selectedStructureNode.componentId);
      node = component?.nodes?.find((item) => item.id === state.selectedStructureNode.nodeId);
      if (node) {
        const prefix = `scenes.${scene.id}.components.${component.id}.nodes.${node.id}`;
        titleKey = `${prefix}.title`;
        summaryKey = `${prefix}.summary`;
        metaId = `${component.id} / ${node.id}`;
      }
    } else {
      node = baseConfig.nodes.find((item) => item.id === state.selectedNodeId);
      if (node) {
        titleKey = `nodes.${node.id}.title`;
        summaryKey = `nodes.${node.id}.summary`;
        metaId = node.id;
      }
    }
    if (!node) return '<aside class="preview-drawer" aria-hidden="true"></aside>';
    return `
      <aside class="preview-drawer is-open" aria-label="${escapeAttr(t('nodePreview'))}">
        <div class="drawer-head">
          <span class="drawer-meta">${escapeHtml(t('nodePreview'))} / ${escapeHtml(metaId)}</span>
          <button class="drawer-close" data-action="close-drawer" aria-label="${escapeAttr(t('closePreview'))}">×</button>
        </div>
        <div class="drawer-body">
          <h2 class="drawer-title">${editable(titleKey, node.title)}</h2>
          ${node.summary ? `<p class="drawer-summary">${editable(summaryKey, node.summary)}</p>` : ''}
          <div class="drawer-actions">
            ${node.scene ? `<button class="primary-action" data-action="enter-scene" data-scene="${escapeAttr(node.scene)}">${escapeHtml(t('enterScene'))}</button>` : ''}
            <button class="secondary-action" data-action="close-drawer">${escapeHtml(t('close'))}</button>
          </div>
        </div>
      </aside>
    `;
  }

  function overviewMarkup() {
    return `
      <section class="view overview" aria-label="Global blueprint overview">
        <aside class="overview-copy">
          <div>
            <div class="eyebrow">${escapeHtml(baseConfig.meta || 'STRUCTURED PRESENTATION')}</div>
            <h1 class="overview-title">${escapeHtml(overviewConfig.heading || '蓝图')}<br><em>${escapeHtml(overviewConfig.headingAlt || 'Blueprint')}</em></h1>
            <p class="overview-subtitle">${escapeHtml(baseConfig.subtitle || '')}</p>
          </div>
          <div class="overview-legend">
            ${baseConfig.relations.length ? `<div class="legend-row"><span class="legend-line"></span><span>${escapeHtml(t('directionalRelation'))}</span></div>` : ''}
            <div class="legend-row"><span class="legend-node"></span><span>${escapeHtml(t('clickNode'))}</span></div>
            <div class="mode-note">${escapeHtml(t('graphType'))} / ${escapeHtml(overviewConfig.type)}</div>
            <div class="mode-note">${escapeHtml(state.rehearsal ? t('rehearsalEnabled') : t('presentationLocked'))}</div>
          </div>
        </aside>
        <div class="overview-viewport">
          <div class="overview-stage structure-${escapeAttr(overviewConfig.type)}" style="${overviewTransformStyle()}">
            <svg class="relations-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Blueprint relations">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="2.8" markerHeight="2.8" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#002fa7"></path>
                </marker>
              </defs>
              ${baseConfig.relations.map(relationMarkup).join('')}
            </svg>
            ${baseConfig.nodes.map(nodeMarkup).join('')}
          </div>
          ${drawerMarkup()}
        </div>
      </section>
    `;
  }

  function miniMapMarkup(activeNodeId) {
    return `
      <div class="mini-map" aria-label="${escapeAttr(t('currentPosition'))}">
        ${baseConfig.nodes.map((node) => `
          <span class="mini-node ${node.id === activeNodeId ? 'active' : ''}" style="left:${node.x}%;top:${node.y}%"></span>
        `).join('')}
      </div>
    `;
  }

  function componentHeader(scene, component) {
    const titleKey = `scenes.${scene.id}.components.${component.id}.title`;
    const title = component.title ? editable(titleKey, component.title, 'component-title') : '';
    const dragLabel = getText(titleKey, component.title || component.id);
    return `
      <div class="component-head">
        <div>
          ${component.eyebrow ? `<div class="component-eyebrow">${escapeHtml(component.eyebrow)}</div>` : ''}
          ${title ? `<h3 class="component-title">${title}</h3>` : ''}
        </div>
        <button class="drag-handle" data-drag-handle aria-label="${escapeAttr(t('drag'))} ${escapeAttr(dragLabel)}">${escapeHtml(t('move'))}</button>
      </div>
    `;
  }

  function textComponent(scene, component) {
    return `
      ${componentHeader(scene, component)}
      <p class="body-copy">${editable(`scenes.${scene.id}.components.${component.id}.body`, component.body || '')}</p>
      ${(component.bullets || []).length ? `
        <ul class="bullet-list">
          ${component.bullets.map((bullet, index) => `<li>${editable(`scenes.${scene.id}.components.${component.id}.bullets.${index}`, bullet)}</li>`).join('')}
        </ul>
      ` : ''}
    `;
  }

  function statsComponent(scene, component) {
    return `
      ${componentHeader(scene, component)}
      <div class="stats-grid">
        ${(component.items || []).map((item, index) => `
          <div class="stat">
            <div><span class="stat-value">${editable(`scenes.${scene.id}.components.${component.id}.items.${index}.value`, item.value)}</span><span class="stat-unit">${editable(`scenes.${scene.id}.components.${component.id}.items.${index}.unit`, item.unit || '')}</span></div>
            <div class="stat-label">${editable(`scenes.${scene.id}.components.${component.id}.items.${index}.label`, item.label)}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function tableComponent(scene, component) {
    return `
      ${componentHeader(scene, component)}
      <table class="table-card">
        <thead><tr>${component.columns.map((column, index) => `<th>${editable(`scenes.${scene.id}.components.${component.id}.columns.${index}`, column)}</th>`).join('')}</tr></thead>
        <tbody>
          ${component.rows.map((row, rowIndex) => `<tr>${row.map((cell, columnIndex) => `<td>${editable(`scenes.${scene.id}.components.${component.id}.rows.${rowIndex}.${columnIndex}`, cell)}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    `;
  }

  function diagramComponent(scene, component) {
    return `
      ${componentHeader(scene, component)}
      <div class="diagram-flow" style="--diagram-count:${Math.max(1, Math.min((component.nodes || []).length, 6))}">
        ${(component.nodes || []).map((node, index) => `
          <div class="diagram-node">${editable(`scenes.${scene.id}.components.${component.id}.nodes.${index}.label`, node.label)}</div>
        `).join('')}
      </div>
    `;
  }

  function structureRelationMarkup(component, relation, markerId) {
    const from = component.nodes.find((node) => node.id === relation.from);
    const to = component.nodes.find((node) => node.id === relation.to);
    if (!from || !to) return '';
    const middleX = (from.x + to.x) / 2;
    const middleY = (from.y + to.y) / 2;
    const curve = Math.abs(to.x - from.x) > 18 ? -6 : 6;
    return `
      <path class="structure-relation-path" d="M ${from.x} ${from.y} Q ${middleX} ${middleY + curve} ${to.x} ${to.y}" marker-end="url(#${escapeAttr(markerId)})"></path>
      <text class="structure-relation-label" x="${middleX}" y="${middleY - 2}">${escapeHtml(relation.label || '')}</text>
    `;
  }

  function structureNodeMarkup(scene, component, node, index) {
    const prefix = `scenes.${scene.id}.components.${component.id}.nodes.${node.id}`;
    const active = state.selectedStructureNode?.sceneId === scene.id
      && state.selectedStructureNode?.componentId === component.id
      && state.selectedStructureNode?.nodeId === node.id;
    return `
      <button
        class="structure-node tone-${escapeAttr(node.tone || 'default')} ${active ? 'is-active' : ''}"
        style="left:${node.x}%;top:${node.y}%"
        data-action="select-structure-node"
        data-structure-component="${escapeAttr(component.id)}"
        data-structure-node="${escapeAttr(node.id)}"
        aria-label="${escapeAttr(t('node'))}: ${escapeAttr(getText(`${prefix}.title`, node.title))}">
        <span class="structure-node-index">${String(index + 1).padStart(2, '0')}</span>
        <span class="structure-node-title">${escapeHtml(getText(`${prefix}.title`, node.title))}</span>
        ${node.scene ? '<span class="node-scene-marker" aria-hidden="true"></span>' : ''}
      </button>
    `;
  }

  function structureComponent(scene, component) {
    const markerId = `structure-arrow-${scene.id}-${component.id}`;
    return `
      ${componentHeader(scene, component)}
      <div class="structure-map structure-${escapeAttr(component.structureType || 'dag')}">
        <svg class="structure-relations-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="${escapeAttr(component.title || 'Structure')}">
          <defs>
            <marker id="${escapeAttr(markerId)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#002fa7"></path>
            </marker>
          </defs>
          ${(component.relations || []).map((relation) => structureRelationMarkup(component, relation, markerId)).join('')}
        </svg>
        ${(component.nodes || []).map((node, index) => structureNodeMarkup(scene, component, node, index)).join('')}
      </div>
    `;
  }

  function quoteComponent(scene, component) {
    return `
      <div class="quote-block">
        <div>
          <div class="quote-mark">“</div>
          <div class="quote-copy">${editable(`scenes.${scene.id}.components.${component.id}.quote`, component.quote)}</div>
        </div>
        <div class="quote-cite">${editable(`scenes.${scene.id}.components.${component.id}.cite`, component.cite || '')}</div>
      </div>
      <button class="drag-handle" data-drag-handle aria-label="${escapeAttr(t('drag'))} quote">${escapeHtml(t('move'))}</button>
    `;
  }

  function linkComponent(scene, component) {
    return `
      ${componentHeader(scene, component)}
      <div class="link-list">
        ${(component.items || []).map((item, index) => {
          const label = editable(`scenes.${scene.id}.components.${component.id}.items.${index}.label`, item.label);
          if (item.href && /^https?:\/\//.test(item.href)) {
            return `<a class="link-button" href="${escapeAttr(item.href)}" target="_blank" rel="noopener">${label}</a>`;
          }
          const action = item.action === 'overview' ? 'overview' : item.action === 'back' ? 'back' : 'enter-scene';
          return `<button class="link-button" data-action="${action}" ${item.scene ? `data-scene="${escapeAttr(item.scene)}"` : ''}>${label}</button>`;
        }).join('')}
      </div>
    `;
  }

  function imageComponent(scene, component) {
    return `
      ${componentHeader(scene, component)}
      <figure class="image-wrap">
        <img src="${escapeAttr(component.src)}" alt="${escapeAttr(component.alt || '')}" class="${component.fit === 'contain' ? 'fit-contain' : ''}">
        <figcaption class="image-caption">${editable(`scenes.${scene.id}.components.${component.id}.caption`, component.caption || '')}</figcaption>
      </figure>
    `;
  }

  const componentRenderers = {
    text: textComponent,
    stats: statsComponent,
    table: tableComponent,
    diagram: diagramComponent,
    structure: structureComponent,
    quote: quoteComponent,
    links: linkComponent,
    image: imageComponent
  };

  function componentMarkup(scene, component) {
    const slot = getSlot(scene.id, component);
    const renderer = componentRenderers[component.type] || textComponent;
    return `
      <article
        class="component component-${escapeAttr(component.type)} ${state.selectedComponentId === component.id ? 'is-selected' : ''}"
        data-component="${escapeAttr(component.id)}"
        style="grid-column:${slot.x} / span ${slot.w};grid-row:${slot.y} / span ${slot.h}">
        <div class="component-inner">${renderer(scene, component)}</div>
        <span class="resize-handle" data-resize-handle aria-label="${escapeAttr(t('resize'))}"></span>
      </article>
    `;
  }

  function sceneMarkup() {
    const scene = baseConfig.scenes.find((item) => item.id === state.sceneId) || baseConfig.scenes[0];
    state.sceneId = scene.id;
    return `
      <section class="view scene" aria-label="${escapeAttr(scene.title)}">
        <aside class="scene-rail">
          <button class="rail-back" data-action="back">← ${escapeHtml(t('back'))}</button>
          <h2 class="rail-title">${escapeHtml(baseConfig.title)}</h2>
          <p class="rail-summary">${escapeHtml(t('currentContext'))}</p>
          ${miniMapMarkup(scene.node)}
        </aside>
        <div class="scene-main">
          <div class="scene-stage" style="${sceneTransformStyle(scene)}">
            <header class="scene-header">
              <div>
                <div class="eyebrow">${escapeHtml(scene.eyebrow || 'BLUEPRINT SCENE')}</div>
                <h1 class="scene-title">${editable(`scenes.${scene.id}.title`, scene.title)}</h1>
              </div>
              <p class="scene-summary">${editable(`scenes.${scene.id}.summary`, scene.summary || '')}</p>
            </header>
            <div class="scene-grid" data-scene-grid="${escapeAttr(scene.id)}">
              ${scene.components.map((component) => componentMarkup(scene, component)).join('')}
            </div>
          </div>
          ${drawerMarkup()}
        </div>
      </section>
    `;
  }

  function updateHash() {
    const hash = state.view === 'scene' && state.sceneId ? `#/scene/${state.sceneId}` : '#/overview';
    history.replaceState(null, '', `${location.pathname}${location.search}${hash}`);
  }

  function render() {
    document.body.classList.toggle('is-rehearsal', state.rehearsal);
    applyTheme();
    app.innerHTML = `
      <div class="app-shell">
        ${toolbar()}
        ${state.view === 'scene' ? sceneMarkup() : overviewMarkup()}
        <div class="toast" role="status" aria-live="polite"></div>
      </div>
    `;
    updateHash();
    scheduleOverviewFit();
    scheduleSceneFit();
  }

  function currentLocation() {
    return state.view === 'scene' && state.sceneId
      ? { view: 'scene', sceneId: state.sceneId }
      : { view: 'overview', sceneId: null };
  }

  function sameLocation(left, right) {
    return left.view === right.view && left.sceneId === right.sceneId;
  }

  function navigateTo(location, record = true) {
    const current = currentLocation();
    if (record && !sameLocation(current, location)) state.navigation.push(current);
    state.view = location.view;
    state.sceneId = location.sceneId || null;
    state.selectedNodeId = null;
    state.selectedStructureNode = null;
    state.selectedComponentId = null;
    render();
  }

  function enterScene(sceneId, record = true) {
    if (!baseConfig.scenes.some((scene) => scene.id === sceneId)) return;
    navigateTo({ view: 'scene', sceneId }, record);
  }

  function showOverview(record = true) {
    navigateTo({ view: 'overview', sceneId: null }, record);
  }

  function goBack() {
    const previous = state.navigation.pop() || { view: 'overview', sceneId: null };
    navigateTo(previous, false);
  }

  function toggleMode() {
    state.rehearsal = !state.rehearsal;
    state.selectedComponentId = null;
    render();
    showToast(state.rehearsal ? t('rehearsalOn') : t('rehearsalOff'));
  }

  function resetScene() {
    if (!state.sceneId) return;
    const before = snapshot();
    delete state.overrides.layout[state.sceneId];
    const prefix = `scenes.${state.sceneId}.`;
    for (const key of Object.keys(state.overrides.content)) {
      if (key.startsWith(prefix)) delete state.overrides.content[key];
    }
    record(before);
    persistDraft();
    render();
    showToast(t('resetDone'));
  }

  async function saveChanges() {
    const payload = {
      version: 1,
      updatedAt: new Date().toISOString(),
      layout: state.overrides.layout,
      content: state.overrides.content
    };
    const contents = `${JSON.stringify(payload, null, 2)}\n`;
    try {
      if ('showSaveFilePicker' in window) {
        const handle = await window.showSaveFilePicker({
          suggestedName: 'blueprint-overrides.json',
          types: [{ description: 'Blueprint overrides', accept: { 'application/json': ['.json'] } }]
        });
        const writable = await handle.createWritable();
        await writable.write(contents);
        await writable.close();
        showToast(t('saveDone'));
        return;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        showToast(t('saveCancelled'));
        return;
      }
      if (error.name !== 'SecurityError') {
        console.warn('Direct file save failed, using a download instead.', error);
      }
    }

    const blob = new Blob([contents], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'blueprint-overrides.json';
    link.click();
    URL.revokeObjectURL(url);
    showToast(t('downloadDone'));
  }

  app.addEventListener('click', (event) => {
    const actionTarget = event.target.closest('[data-action]');
    const component = event.target.closest('[data-component]');

    if (component && state.rehearsal && !event.target.closest('[data-edit-key], [data-action], [data-drag-handle], [data-resize-handle]')) {
      state.selectedComponentId = component.dataset.component;
      render();
      return;
    }

    if (!actionTarget) return;
    const { action } = actionTarget.dataset;
    if (action === 'select-node') {
      state.selectedNodeId = actionTarget.dataset.node;
      state.selectedStructureNode = null;
      render();
    } else if (action === 'select-structure-node') {
      state.selectedNodeId = null;
      state.selectedStructureNode = {
        sceneId: state.sceneId,
        componentId: actionTarget.dataset.structureComponent,
        nodeId: actionTarget.dataset.structureNode
      };
      render();
    } else if (action === 'close-drawer') {
      state.selectedNodeId = null;
      state.selectedStructureNode = null;
      render();
    } else if (action === 'enter-scene') {
      enterScene(actionTarget.dataset.scene);
    } else if (action === 'overview') {
      showOverview();
    } else if (action === 'back') {
      goBack();
    } else if (action === 'toggle-language') {
      toggleLanguage();
    } else if (action === 'toggle-theme') {
      toggleTheme();
    } else if (action === 'toggle-mode') {
      toggleMode();
    } else if (action === 'zoom-in') {
      zoomActiveCanvas(.12);
    } else if (action === 'zoom-out') {
      zoomActiveCanvas(-.12);
    } else if (action === 'zoom-fit') {
      fitActiveCanvas();
    } else if (action === 'undo') {
      undo();
    } else if (action === 'redo') {
      redo();
    } else if (action === 'reset-scene') {
      resetScene();
    } else if (action === 'save') {
      saveChanges();
    }
  });

  app.addEventListener('dblclick', (event) => {
    if (!state.rehearsal) return;
    const editableTarget = event.target.closest('[data-edit-key]');
    if (!editableTarget) return;
    event.stopPropagation();
    editableTarget.contentEditable = 'true';
    editableTarget.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editableTarget);
    selection.removeAllRanges();
    selection.addRange(range);

    const finish = (commit) => {
      editableTarget.contentEditable = 'false';
      editableTarget.removeEventListener('blur', handleBlur);
      editableTarget.removeEventListener('keydown', handleKeydown);
      if (commit) {
        const value = editableTarget.innerText.trim();
        if (value !== getText(editableTarget.dataset.editKey, '')) {
          setText(editableTarget.dataset.editKey, value);
          render();
          showToast(t('textDone'));
        }
      } else {
        render();
      }
    };

    const handleBlur = () => finish(true);
    const handleKeydown = (keyboardEvent) => {
      if (keyboardEvent.key === 'Escape') {
        keyboardEvent.preventDefault();
        finish(false);
      }
      if ((keyboardEvent.metaKey || keyboardEvent.ctrlKey) && keyboardEvent.key === 'Enter') {
        keyboardEvent.preventDefault();
        finish(true);
      }
    };

    editableTarget.addEventListener('blur', handleBlur);
    editableTarget.addEventListener('keydown', handleKeydown);
  });

  app.addEventListener('pointerdown', (event) => {
    if (beginOverviewPan(event)) return;
    if (beginScenePan(event)) return;
    if (!state.rehearsal) return;
    const handle = event.target.closest('[data-drag-handle], [data-resize-handle]');
    const componentElement = event.target.closest('[data-component]');
    const grid = event.target.closest('[data-scene-grid]');
    if (!handle || !componentElement || !grid || !state.sceneId) return;

    event.preventDefault();
    const scene = baseConfig.scenes.find((item) => item.id === state.sceneId);
    const component = scene.components.find((item) => item.id === componentElement.dataset.component);
    if (!component) return;

    state.selectedComponentId = component.id;
    componentElement.classList.add('is-selected');
    const startSlot = getSlot(scene.id, component);
    const startX = event.clientX;
    const startY = event.clientY;
    const before = snapshot();
    const rect = grid.getBoundingClientRect();
    const computed = getComputedStyle(grid);
    const columnGap = Number.parseFloat(computed.columnGap) || 0;
    const rowGap = Number.parseFloat(computed.rowGap) || 0;
    const sceneZoom = getSceneTransform(scene.id).zoom;
    const renderedColumnGap = columnGap * sceneZoom;
    const renderedRowGap = rowGap * sceneZoom;
    const columnUnit = (rect.width - renderedColumnGap * (GRID_COLUMNS - 1)) / GRID_COLUMNS + renderedColumnGap;
    const rowUnit = (rect.height - renderedRowGap * (GRID_ROWS - 1)) / GRID_ROWS + renderedRowGap;
    const resizing = handle.matches('[data-resize-handle]');
    let finalSlot = startSlot;

    const apply = (slot) => {
      finalSlot = slot;
      componentElement.style.gridColumn = `${slot.x} / span ${slot.w}`;
      componentElement.style.gridRow = `${slot.y} / span ${slot.h}`;
    };

    const move = (moveEvent) => {
      const dx = Math.round((moveEvent.clientX - startX) / columnUnit);
      const dy = Math.round((moveEvent.clientY - startY) / rowUnit);
      if (resizing) {
        apply({
          ...startSlot,
          w: clamp(startSlot.w + dx, 2, GRID_COLUMNS - startSlot.x + 1),
          h: clamp(startSlot.h + dy, 2, GRID_ROWS - startSlot.y + 1)
        });
      } else {
        apply({
          ...startSlot,
          x: clamp(startSlot.x + dx, 1, GRID_COLUMNS - startSlot.w + 1),
          y: clamp(startSlot.y + dy, 1, GRID_ROWS - startSlot.h + 1)
        });
      }
    };

    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      if (JSON.stringify(finalSlot) !== JSON.stringify(startSlot)) {
        setSlot(scene.id, component.id, finalSlot, before);
        render();
        showToast(resizing ? t('resizeDone') : t('moveDone'));
      }
    };

    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up, { once: true });
  });

  window.addEventListener('resize', () => {
    if (state.view === 'overview' && !state.overviewTouched) fitOverview();
    if (state.view === 'scene' && state.sceneId && !state.sceneTouched[state.sceneId]) fitScene();
  });

  document.addEventListener('keydown', (event) => {
    const editing = document.activeElement?.matches?.('[contenteditable="true"]');
    if (editing) return;
    const modifier = event.metaKey || event.ctrlKey;
    if (modifier && event.key.toLowerCase() === 's' && state.rehearsal) {
      event.preventDefault();
      saveChanges();
      return;
    }
    if (modifier && event.key.toLowerCase() === 'z' && state.rehearsal) {
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
      return;
    }
    if (!modifier && event.key.toLowerCase() === 'e') {
      toggleMode();
      return;
    }
    if (!modifier && event.key.toLowerCase() === 'o') {
      showOverview();
      return;
    }
    if (event.key === 'Escape' && state.selectedNodeId) {
      state.selectedNodeId = null;
      render();
    }
  });

  function restoreLocationFromHash() {
    const match = location.hash.match(/^#\/scene\/(.+)$/);
    if (match && baseConfig.scenes.some((scene) => scene.id === match[1])) {
      state.view = 'scene';
      state.sceneId = match[1];
    }
  }

  window.BlueprintApp = {
    getState: () => clone(state),
    enterScene,
    showOverview,
    goBack,
    fitOverview,
    fitScene,
    toggleLanguage,
    toggleTheme,
    toggleMode,
    saveChanges
  };

  loadLanguage();
  loadTheme();
  loadInitialOverrides().then(() => {
    restoreLocationFromHash();
    render();
  });
})();
