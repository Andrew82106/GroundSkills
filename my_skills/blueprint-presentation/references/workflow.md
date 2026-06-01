# Blueprint Workflow

## 1. Model The Structure

Start with the argument, not with pages. Write a directed graph:

```text
entry question -> context -> constraints -> solution -> evidence -> next action
```

Keep overview nodes short enough to scan on a large screen. A node title should usually fit within 12 Chinese characters or 5 English words. Put detail into `summary` and scenes.

Assign scenes only to nodes that need expansion. A useful Blueprint can have 8-14 overview nodes and 3-6 scenes. Avoid turning every node into a scene.

## 2. Choose Components

Use the smallest set of components that explains the node:

- Use `text` for a compact claim and explanation.
- Use `stats` only for real metrics.
- Use `table` for comparisons where row and column relationships matter.
- Use `diagram` for a local structural relationship.
- Use `quote` for a framing statement.
- Use `links` for onward navigation or references.
- Use `image` for evidence, screenshots, or a purposeful visual anchor.

Read `component-contracts.md` for config shapes.

## 3. Place Components

Place components on the 16-column by 12-row grid. Use `slot: { x, y, w, h }`, with one-based `x` and `y`.

Use composition, not uniform card grids:

- Keep one dominant component per scene.
- Pair it with one or two supporting components.
- Leave deliberate negative space.
- Avoid placing more than five components in a scene.
- Use the same left content axis across scenes.

Rehearsal mode exists for small corrections. If every component needs dragging, improve the config layout instead.

## 4. Preview And Save

Serve the project over HTTP so optional `blueprint-overrides.json` can load:

```bash
python3 -m http.server 4173
```

Presentation mode is the default. Enter rehearsal mode from the toolbar or with `?mode=rehearsal`.

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

The output defaults to `dist/blueprint.html`.
