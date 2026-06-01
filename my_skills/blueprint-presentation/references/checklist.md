# Blueprint Checklist

## Before Preview

- The overview map explains the argument without requiring clicks.
- Every scene expands a meaningful node.
- Every component supports the scene's claim.
- No scene contains more than five components without a strong reason.
- All component slots stay inside the 16 by 12 grid.
- Important components do not overlap.
- Components do not depend on internal scrollbars.
- Projected body text remains readable.
- Editable fields are limited to short rehearsal corrections.

## Presentation Mode

- Components do not drag, resize, or expose editing affordances.
- Nodes open preview cards.
- Scene links work.
- Returning to overview restores context.
- Keyboard focus is visible.
- Zoom controls work on the overview.

## Rehearsal Mode

- Mode switch is obvious but visually quiet.
- Dragging snaps to the grid.
- Resizing snaps to the grid and respects minimum sizes.
- Editable text requires an intentional double-click.
- Undo and redo work.
- Reset scene affects only the current scene.
- Refresh restores local draft changes.
- Save writes or downloads `blueprint-overrides.json`.

## Final Artifact

- `validate-blueprint.mjs` passes without errors.
- Saved overrides have been reviewed.
- `pack-blueprint.mjs` creates `dist/blueprint.html`.
- The packed HTML opens and behaves like the source project.
- `LICENSE` and `references/upstream.md` remain in redistributed skill copies.
