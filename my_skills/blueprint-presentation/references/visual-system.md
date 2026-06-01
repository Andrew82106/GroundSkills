# Blueprint Swiss Visual System

Blueprint Swiss adapts the information discipline of Swiss international style to a structural presentation canvas. The design should feel like a precise working blueprint rather than a conventional slide deck.

## Direction

Use:

- A warm paper background: `#fafaf8`
- Near-black text: `#0a0a0a`
- One saturated accent: IKB blue `#002fa7`
- Straight edges, no decorative rounding
- Hairline borders and visible structural coordinates
- Large, light-weight headings and compact mono metadata
- Sparse, purposeful motion

Avoid:

- Gradients, glassmorphism, soft shadows, floating rounded cards
- Multiple competing accent colors
- Generic dashboard density
- Decorative icons without explanatory value
- Components scattered without a visible hierarchy

## Typography

Use a neutral sans stack for text and a mono stack for coordinates and metadata. Preserve the hierarchy:

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
