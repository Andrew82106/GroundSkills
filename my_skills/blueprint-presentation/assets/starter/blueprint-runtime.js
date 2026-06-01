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

  if (!app || !baseConfig) {
    throw new Error('Blueprint requires #app and window.BLUEPRINT_CONFIG.');
  }

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const storageKey = `${STORAGE_PREFIX}${baseConfig.title || 'untitled'}`;
  const state = {
    view: 'overview',
    sceneId: null,
    selectedNodeId: null,
    selectedComponentId: null,
    rehearsal: new URLSearchParams(location.search).get('mode') === 'rehearsal',
    zoom: 1,
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
    if (!fileOverrides) {
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
    localStorage.setItem(storageKey, JSON.stringify(state.overrides));
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
    showToast('Undid the last rehearsal change');
  }

  function redo() {
    if (!state.redo.length) return;
    state.undo.push(snapshot());
    state.overrides = state.redo.pop();
    persistDraft();
    render();
    showToast('Restored the rehearsal change');
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
      ? '<button class="tool-button" data-action="overview">Overview</button>'
      : `
        <button class="tool-button" data-action="zoom-out" aria-label="Zoom out">−</button>
        <button class="tool-button" data-action="zoom-fit">Fit</button>
        <button class="tool-button" data-action="zoom-in" aria-label="Zoom in">+</button>
      `;

    return `
      <header class="topbar">
        <div class="brand"><span class="brand-mark"></span><span>Blueprint / ${escapeHtml(baseConfig.title)}</span></div>
        <div class="toolbar">
          <div class="toolbar-group">${sceneControls}</div>
          <div class="toolbar-group rehearsal-only">
            <button class="tool-button" data-action="undo" ${state.undo.length ? '' : 'disabled'}>Undo</button>
            <button class="tool-button" data-action="redo" ${state.redo.length ? '' : 'disabled'}>Redo</button>
            ${state.view === 'scene' ? '<button class="tool-button" data-action="reset-scene">Reset scene</button>' : ''}
            <button class="tool-button" data-action="save">Save changes</button>
          </div>
          <div class="toolbar-group">
            <button class="tool-button ${state.rehearsal ? 'active' : ''}" data-action="toggle-mode">
              ${state.rehearsal ? 'Exit rehearsal' : 'Rehearsal'}
            </button>
          </div>
        </div>
      </header>
    `;
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
        aria-label="Open node ${escapeAttr(getText(key, node.title))}">
        <span class="node-index">${String(index + 1).padStart(2, '0')} / ${node.scene ? 'SCENE' : 'NODE'}</span>
        <span class="node-title">${escapeHtml(getText(key, node.title))}</span>
        ${node.scene ? '<span class="node-scene-marker" aria-hidden="true"></span>' : ''}
      </button>
    `;
  }

  function drawerMarkup() {
    const node = baseConfig.nodes.find((item) => item.id === state.selectedNodeId);
    if (!node) return '<aside class="preview-drawer" aria-hidden="true"></aside>';
    const titleKey = `nodes.${node.id}.title`;
    const summaryKey = `nodes.${node.id}.summary`;
    return `
      <aside class="preview-drawer is-open" aria-label="Node preview">
        <div class="drawer-head">
          <span class="drawer-meta">Node preview / ${escapeHtml(node.id)}</span>
          <button class="drawer-close" data-action="close-drawer" aria-label="Close node preview">×</button>
        </div>
        <div class="drawer-body">
          <h2 class="drawer-title">${editable(titleKey, node.title)}</h2>
          <p class="drawer-summary">${editable(summaryKey, node.summary)}</p>
          <div class="drawer-actions">
            ${node.scene ? `<button class="primary-action" data-action="enter-scene" data-scene="${escapeAttr(node.scene)}">Enter scene</button>` : ''}
            <button class="secondary-action" data-action="close-drawer">Close</button>
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
            <h1 class="overview-title">蓝图<br><em>Blueprint</em></h1>
            <p class="overview-subtitle">${escapeHtml(baseConfig.subtitle || '')}</p>
          </div>
          <div class="overview-legend">
            <div class="legend-row"><span class="legend-line"></span><span>Directional relation</span></div>
            <div class="legend-row"><span class="legend-node"></span><span>Click node for preview</span></div>
            <div class="mode-note">${state.rehearsal ? 'Rehearsal mode / local calibration enabled' : 'Presentation mode / structure locked'}</div>
          </div>
        </aside>
        <div class="overview-viewport">
          <div class="overview-stage" style="transform:scale(${state.zoom})">
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
      <div class="mini-map" aria-label="Current position in global blueprint">
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
        <button class="drag-handle" data-drag-handle aria-label="Drag ${escapeAttr(dragLabel)}">Move</button>
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

  function quoteComponent(scene, component) {
    return `
      <div class="quote-block">
        <div>
          <div class="quote-mark">“</div>
          <div class="quote-copy">${editable(`scenes.${scene.id}.components.${component.id}.quote`, component.quote)}</div>
        </div>
        <div class="quote-cite">${editable(`scenes.${scene.id}.components.${component.id}.cite`, component.cite || '')}</div>
      </div>
      <button class="drag-handle" data-drag-handle aria-label="Drag quote">Move</button>
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
          return `<button class="link-button" data-action="${item.action === 'overview' ? 'overview' : 'enter-scene'}" ${item.scene ? `data-scene="${escapeAttr(item.scene)}"` : ''}>${label}</button>`;
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
        <span class="resize-handle" data-resize-handle aria-label="Resize component"></span>
      </article>
    `;
  }

  function sceneMarkup() {
    const scene = baseConfig.scenes.find((item) => item.id === state.sceneId) || baseConfig.scenes[0];
    state.sceneId = scene.id;
    return `
      <section class="view scene" aria-label="${escapeAttr(scene.title)}">
        <aside class="scene-rail">
          <button class="rail-back" data-action="overview">← Global blueprint</button>
          <h2 class="rail-title">${escapeHtml(baseConfig.title)}</h2>
          <p class="rail-summary">当前场景仍然属于全局结构。返回蓝图时，节点关系和当前位置保持可见。</p>
          ${miniMapMarkup(scene.node)}
        </aside>
        <div class="scene-main">
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
      </section>
    `;
  }

  function updateHash() {
    const hash = state.view === 'scene' && state.sceneId ? `#/scene/${state.sceneId}` : '#/overview';
    history.replaceState(null, '', `${location.pathname}${location.search}${hash}`);
  }

  function render() {
    document.body.classList.toggle('is-rehearsal', state.rehearsal);
    app.innerHTML = `
      <div class="app-shell">
        ${toolbar()}
        ${state.view === 'scene' ? sceneMarkup() : overviewMarkup()}
        <div class="toast" role="status" aria-live="polite"></div>
      </div>
    `;
    updateHash();
  }

  function enterScene(sceneId) {
    if (!baseConfig.scenes.some((scene) => scene.id === sceneId)) return;
    state.view = 'scene';
    state.sceneId = sceneId;
    state.selectedNodeId = null;
    state.selectedComponentId = null;
    render();
  }

  function showOverview() {
    state.view = 'overview';
    state.selectedNodeId = null;
    state.selectedComponentId = null;
    render();
  }

  function toggleMode() {
    state.rehearsal = !state.rehearsal;
    state.selectedComponentId = null;
    render();
    showToast(state.rehearsal ? 'Rehearsal mode enabled' : 'Presentation mode enabled');
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
    showToast('Reset the current scene');
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
        showToast('Saved blueprint-overrides.json');
        return;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        showToast('Save cancelled');
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
    showToast('Downloaded blueprint-overrides.json');
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
      render();
    } else if (action === 'close-drawer') {
      state.selectedNodeId = null;
      render();
    } else if (action === 'enter-scene') {
      enterScene(actionTarget.dataset.scene);
    } else if (action === 'overview') {
      showOverview();
    } else if (action === 'toggle-mode') {
      toggleMode();
    } else if (action === 'zoom-in') {
      state.zoom = clamp(Number((state.zoom + .12).toFixed(2)), .72, 1.45);
      render();
    } else if (action === 'zoom-out') {
      state.zoom = clamp(Number((state.zoom - .12).toFixed(2)), .72, 1.45);
      render();
    } else if (action === 'zoom-fit') {
      state.zoom = 1;
      render();
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
          showToast('Saved local text revision');
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
    const columnUnit = (rect.width - columnGap * (GRID_COLUMNS - 1)) / GRID_COLUMNS + columnGap;
    const rowUnit = (rect.height - rowGap * (GRID_ROWS - 1)) / GRID_ROWS + rowGap;
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
        showToast(resizing ? 'Resized and saved locally' : 'Moved and saved locally');
      }
    };

    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up, { once: true });
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
    toggleMode,
    saveChanges
  };

  loadInitialOverrides().then(() => {
    restoreLocationFromHash();
    render();
  });
})();
