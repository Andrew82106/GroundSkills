---
name: blueprint-presentation
description: Create structured, component-based HTML presentations called Blueprints from a simple declarative blueprint.source.json outline. Use when Codex needs to build an explorable large-screen presentation with a pannable global structure canvas, recursive pannable local canvases, mind-map, DAG, or list structures at any depth, hierarchical scene navigation, reusable evidence blocks, configurable interface languages, a locked presentation mode, and a lightweight rehearsal mode. For ordinary authoring, focus on content nodes, relations, scenes, and blocks without inspecting runtime code or CSS. Use for requests mentioning 蓝图, 结构化大屏, 思维导图演示, component-based presentation, explorable HTML deck, or a non-linear alternative to PPT.
---

# Blueprint Presentation

Build a Blueprint as a declarative HTML presentation. Treat the global structure map as the primary interface, scenes as pannable local canvases that recursively expand nodes, and components as evidence blocks or nested structures inside each scene.

## Authoring Contract

For ordinary presentation work, edit only:

- `blueprint.source.json`
- Local files under `images/`
- `blueprint-overrides.json` after reviewing saved rehearsal changes

Do not inspect or edit `blueprint.config.js`, `blueprint-runtime.js`, `blueprint.css`, `index.html`, or files under `scripts/`. Treat them as engine internals. `blueprint.config.js` is generated from `blueprint.source.json`.

Enter engine-extension work only when the user explicitly asks to change the renderer, add a reusable block type, or fix a verified engine bug. Do not enter engine internals merely to improve one presentation.

## Standard Workflow

1. Read `references/authoring.md`.
2. Read `references/workflow.md`.
3. Read `references/themes.md` only to choose a registered preset.
4. Initialize a project:

```bash
node <SKILL_ROOT>/scripts/init-blueprint.mjs path/to/project
```

5. Edit `blueprint.source.json`. Write the argument as nodes, relations, scenes, and blocks. Omit coordinates and grid slots unless preview proves an override is necessary.
6. Validate before preview. Validation recompiles the declaration automatically:

```bash
node <SKILL_ROOT>/scripts/validate-blueprint.mjs path/to/project
```

7. Preview the editable source during development with a local server:

```bash
cd path/to/project
python3 -m http.server 4173
```

8. Open `http://localhost:4173`. Verify overview navigation, scene navigation, presentation mode, rehearsal mode, dragging, resizing, selected text editing, reload persistence, and the save button.
9. Pack the final single-file artifact:

```bash
node <SKILL_ROOT>/scripts/pack-blueprint.mjs path/to/project
```

10. Deliver `path/to/project/blueprint.html`. The viewer opens this file directly; no server command is required.

## Product Boundary

Keep two runtime modes:

- **Presentation mode**: lock components. Allow overview exploration, node preview, scene navigation, zoom controls, and returning to the global blueprint.
- **Rehearsal mode**: allow component dragging, grid-snapped resizing, and editing only text explicitly marked editable by registered components. Persist drafts to `localStorage`. Expose undo, redo, reset-scene, exit, and save actions.

Do not implement browser-side node, scene, component, or theme creation and deletion. Do not implement arbitrary HTML, CSS, script, color, image-upload, or relationship editing.

## Design Rules

Use a registered preset from `references/themes.md`. Keep `swiss-ikb` as the default. Choose the Swiss family for precise analytical material. Choose the Editorial family when the material needs reading texture.

Choose `overview.type` from `mind-map`, `dag`, or `list` according to the content. Give the overview its own canvas dimensions. The initial view fits the canvas, while zooming may intentionally move content beyond the viewport; viewers can pan the canvas to inspect it.

Prefer compiler defaults first. Add explicit coordinates or slots only after preview shows a real issue. Keep the overview readable without requiring node clicks: relations and chain direction must remain visible on the canvas when the structure uses relations.

Read `references/component-contracts.md` only when a block needs detailed fields, nested navigation, or a layout escape hatch. Use `structure` when a scene needs a mind-map, DAG, or list that continues into deeper scenes.

## Content Workflow

Before writing config, define:

1. The claim or topic of the Blueprint.
2. The global node graph and directional relations.
3. Which nodes deserve expanded scenes.
4. Which evidence components each scene needs.
5. The short text fields that may be refined during rehearsal.
6. The default interface language and optional language switcher choices.
7. The registered visual-system preset.

Keep the overview map concise. Use scenes for detail. Use components to support a node, not to recreate a conventional slide full of unrelated boxes.

## Save Model

Treat `blueprint.source.json` as the source of truth. Treat the compiled config and saved rehearsal changes as derived layers:

```text
blueprint.source.json
-> generated blueprint.config.js
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
