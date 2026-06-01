# Blueprint Workflow

## 1. Model The Structure

Start with the argument, not with pages. Choose the smallest structure that fits the content:

- Use `mind-map` for a concept branching from a center.
- Use `dag` for dependencies, reasoning chains, and parallel paths.
- Use `list` for ordered sections where edges add little value.

For a directed structure, write a graph:

```text
entry question -> context -> constraints -> solution -> evidence -> next action
```

Keep overview nodes short enough to scan on a large screen. A node title should usually fit within 12 Chinese characters or 5 English words. Put detail into `summary` and scenes.

Set `overview.width` and `overview.height` for a comfortable normal-scale canvas. The runtime fits it on first open, then lets viewers zoom and pan without forcing nodes back inside the viewport.

Assign scenes only to nodes that need expansion. A useful Blueprint can have 8-14 overview nodes and 3-6 scenes. Avoid turning every node into a scene.

## 2. Choose Components

Use the smallest set of components that explains the node:

- Use `text` for a compact claim and explanation.
- Use `stats` only for real metrics.
- Use `table` for comparisons where row and column relationships matter.
- Use `diagram` for a local structural relationship.
- Use `structure` when a local map should open deeper scenes.
- Use `quote` for a framing statement.
- Use `links` for onward navigation or references.
- Use `image` for evidence, screenshots, or a purposeful visual anchor.

Read `component-contracts.md` for config shapes.

## 3. Place Components

Place components on the 16-column by 12-row grid. Use `slot: { x, y, w, h }`, with one-based `x` and `y`.

Treat the scene grid as a local canvas, not as a slide boundary. The viewer can pan and zoom the canvas after entry. If a scene needs its own structure map, add a `structure` component and continue the hierarchy through its nodes.

Use composition, not uniform card grids:

- Keep one dominant component per scene.
- Pair it with one or two supporting components.
- Leave deliberate negative space.
- Avoid placing more than five components in a scene.
- Use the same left content axis across scenes.

Rehearsal mode exists for small corrections. If every component needs dragging, improve the config layout instead.

## 4. Preview And Save During Authoring

While authoring, serve the editable project over HTTP so optional `blueprint-overrides.json` can load:

```bash
python3 -m http.server 4173
```

Presentation mode is the default. Enter rehearsal mode from the toolbar or with `?mode=rehearsal`.

Declare `ui.defaultLanguage` during generation. Include multiple `ui.languages` when viewers should be able to switch interface controls between languages.

In rehearsal mode:

- Drag from the component header.
- Resize from the bottom-right handle.
- Double-click editable text to refine it.
- Use undo and redo for local corrections.
- Click `Save changes` to write or download `blueprint-overrides.json`.

Review saved overrides before placing them beside the HTML source. The overrides remain intentionally small and reviewable.

## 5. Validate And Pack

Validate the source project:

```bash
node <SKILL_ROOT>/scripts/validate-blueprint.mjs path/to/project
```

Pack to one HTML file:

```bash
node <SKILL_ROOT>/scripts/pack-blueprint.mjs path/to/project
```

The output defaults to `blueprint.html` in the project root. It contains the styles, config, reviewed overrides, runtime, and local images. Deliver this single file: the viewer opens it directly without running a server.
