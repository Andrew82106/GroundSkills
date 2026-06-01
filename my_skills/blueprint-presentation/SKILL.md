---
name: blueprint-presentation
description: Create structured, component-based HTML presentations called Blueprints. Use when Codex needs to build an explorable large-screen presentation with a pannable global structure canvas, recursive pannable local canvases, mind-map, DAG, or list structures at any depth, hierarchical scene navigation, reusable content components, configurable interface languages, a locked presentation mode, and a lightweight rehearsal mode for dragging, resizing, editing selected text, persisting adjustments, and saving layout overrides. Use for requests mentioning 蓝图, 结构化大屏, 思维导图演示, component-based presentation, explorable HTML deck, or a non-linear alternative to PPT.
---

# Blueprint Presentation

Build a Blueprint as a local-configured HTML presentation. Treat the global structure map as the primary interface, scenes as pannable local canvases that recursively expand nodes, and components as evidence blocks or nested structures inside each scene.

## Start Here

1. Read `references/workflow.md`.
2. Read `references/visual-system.md` before changing visual styling.
3. Read `references/themes.md` and choose a registered visual preset.
4. Read `references/component-contracts.md` before adding components or config fields.
5. Initialize a project:

```bash
node <SKILL_ROOT>/scripts/init-blueprint.mjs path/to/project
```

6. Edit `blueprint.config.js`. Keep content and component count local. Do not add browser-side creation or deletion controls.
7. Validate before preview:

```bash
node <SKILL_ROOT>/scripts/validate-blueprint.mjs path/to/project
```

8. Preview the editable source during development with a local server:

```bash
cd path/to/project
python3 -m http.server 4173
```

9. Open `http://localhost:4173`. Verify overview navigation, scene navigation, presentation mode, rehearsal mode, dragging, resizing, selected text editing, reload persistence, and the save button.
10. Pack the final single-file artifact:

```bash
node <SKILL_ROOT>/scripts/pack-blueprint.mjs path/to/project
```

11. Deliver `path/to/project/blueprint.html`. The viewer opens this file directly; no server command is required.

## Product Boundary

Keep two runtime modes:

- **Presentation mode**: lock components. Allow overview exploration, node preview, scene navigation, zoom controls, and returning to the global blueprint.
- **Rehearsal mode**: allow component dragging, grid-snapped resizing, and editing only text explicitly marked editable by registered components. Persist drafts to `localStorage`. Expose undo, redo, reset-scene, exit, and save actions.

Do not implement browser-side node, scene, component, or theme creation and deletion. Do not implement arbitrary HTML, CSS, script, color, image-upload, or relationship editing.

## Design Rules

Use a registered preset from `references/themes.md`. Keep `swiss-ikb` as the default. Choose the Swiss family for precise analytical material: one saturated accent color, rectilinear geometry, fine rules, a visible structural grid, large light-weight headings, restrained motion, and mono metadata. Choose the Editorial family when the material needs reading texture: serif display headings, paper-and-ink palettes, editorial rules, and quieter evidence surfaces.

Choose `overview.type` from `mind-map`, `dag`, or `list` according to the content. Give the overview its own canvas dimensions. The initial view fits the canvas, while zooming may intentionally move content beyond the viewport; viewers can pan the canvas to inspect it.

Prefer a strong initial layout so rehearsal adjustments remain exceptional. Give each scene its own fixed-size canvas, fit it on entry, and allow viewers to pan and zoom it in presentation mode. Use a 16-column by 12-row scene grid. Make scene components snap to the grid. Keep the overview readable without requiring node clicks: relations and chain direction must remain visible on the canvas when the structure uses relations.

Use the component registry in `references/component-contracts.md`. Use `structure` when a scene needs a mind-map, DAG, or list that continues into deeper scenes. Add another component type only when it recurs across Blueprints and has a clear data contract.

## Content Workflow

Before writing config, define:

1. The claim or topic of the Blueprint.
2. The global node graph and directional relations.
3. Which nodes deserve expanded scenes.
4. Which evidence components each scene needs.
5. The layout slot for each component.
6. The short text fields that may be refined during rehearsal.
7. The default interface language and optional language switcher choices.
8. The registered visual-system preset.

Keep the overview map concise. Use scenes for detail. Use components to support a node, not to recreate a conventional slide full of unrelated boxes.

## Save Model

Treat `blueprint.config.js` as the source of truth. Treat saved rehearsal changes as a reviewable override layer:

```text
blueprint.config.js
-> blueprint-overrides.json, when loaded through HTTP
-> localStorage draft overrides
```

The save button writes or downloads `blueprint-overrides.json`. Review the file and place it beside `index.html` before final packing.

## Verification

Run both validators:

```bash
python3 /Users/andrewlee/.codex/skills/.system/skill-creator/scripts/quick_validate.py <SKILL_ROOT>
node <SKILL_ROOT>/scripts/validate-blueprint.mjs path/to/project
```

Then use a browser to review every scene against `references/checklist.md`. Do not deliver a Blueprint based only on static code inspection.

## License And Provenance

This skill is licensed under AGPL-3.0. It adapts design-system ideas and implementation patterns from `op7418/guizang-ppt-skill`. Keep `LICENSE` and `references/upstream.md` when redistributing this skill or derived templates.
