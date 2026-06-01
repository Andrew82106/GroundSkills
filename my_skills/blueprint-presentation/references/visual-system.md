# Blueprint Visual Systems

Blueprint adapts two upstream directions to a structural presentation canvas. `Swiss` should feel like a precise working blueprint. `Editorial` should feel like an explorable electronic magazine. Both remain structured large-screen systems rather than conventional slide decks.

Read `themes.md` before choosing a preset.

## Shared Direction

- Straight edges, no decorative rounding
- Visible structural coordinates and explicit hierarchy
- Compact mono metadata
- Sparse, purposeful motion

Avoid:

- Glassmorphism, soft shadows, and floating rounded cards
- Generic dashboard density
- Decorative icons without explanatory value
- Components scattered without a visible hierarchy

## Swiss Direction

Use Swiss for product, technical, analytical, and methods-oriented material:

- A light neutral paper background
- Near-black text
- One saturated accent such as IKB blue, lemon, acid green, or signal orange
- Hairline borders and a visible structural grid
- Large, light-weight sans headings

## Editorial Direction

Use Editorial for narrative, humanities, historical, background, and research-story material:

- Warm paper and ink palettes
- Serif display headings with sans body copy
- Editorial rules instead of uniform card borders
- Quiet evidence surfaces and restrained monochrome emphasis
- An archival, electronic-magazine reading texture

## Typography

Use a neutral sans stack for Swiss text, a serif display stack for Editorial headings, and a mono stack for coordinates and metadata. Preserve the hierarchy:

| Role | Guidance |
|---|---|
| Overview title | Large, light, compressed line height |
| Node title | Medium, direct, no filler |
| Scene title | Large and light, aligned to the left axis |
| Body text | At least 16px for projected readability |
| Metadata | 12-14px mono, uppercase where appropriate |

Use heavier weight as text gets smaller. Do not use light-weight small text.

## Layout

Use two coordinate systems:

- Overview canvas: a fixed-size, pannable canvas with percent-based node positions and optional SVG relations.
- Scene canvas: a fixed-size, pannable canvas containing a strict 16-column by 12-row grid.

The initial overview should fit the complete structure without interaction. After zooming, allow viewers to pan the canvas instead of compressing nodes back into the viewport. Use node clicks to disclose summaries and scene-entry links, not to reveal basic structure.

Each scene should include:

- A chrome row with scene position and context.
- A scene heading on the top-left axis.
- A quiet miniature structure map or context path.
- A component grid with deliberate whitespace.

A scene may contain a `structure` component and continue into deeper scenes. Do not treat a scene as a terminal slide.

## Motion

Use short entrance transitions:

- Nodes: staggered opacity and slight vertical lift.
- Relations: stroke reveal after nodes begin appearing.
- Scene components: subtle opacity and lift.
- Mode switches: immediate state changes with restrained feedback.

Respect `prefers-reduced-motion`. Do not animate while dragging or resizing.

## Accessibility

- Maintain visible focus outlines.
- Give nodes and toolbar actions meaningful labels.
- Keep all navigation available by keyboard.
- Preserve readable contrast on accent blocks.
- Do not encode relationships only by color; use arrows and labels.
