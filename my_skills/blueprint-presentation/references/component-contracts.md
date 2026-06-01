# Blueprint Component Contracts

## Shared Fields

Every scene component uses:

```js
{
  id: "unique-within-scene",
  type: "text",
  title: "Optional heading",
  eyebrow: "Optional mono label",
  slot: { x: 1, y: 1, w: 6, h: 4 }
}
```

Slots use a one-based 16-column by 12-row grid. Keep `x + w <= 17` and `y + h <= 13`.

## Registered Types

### `text`

```js
{
  type: "text",
  title: "A compact claim",
  body: "One or two short paragraphs.",
  bullets: ["Optional item", "Optional item"]
}
```

Editable during rehearsal: `title`, `body`, and each bullet.

### `stats`

```js
{
  type: "stats",
  title: "Measured impact",
  items: [
    { value: "16", unit: "列", label: "Scene grid" },
    { value: "2", unit: "种", label: "Runtime modes" }
  ]
}
```

Use only real values. Editable during rehearsal: item labels and short values.

### `table`

```js
{
  type: "table",
  title: "Comparison",
  columns: ["Dimension", "Traditional PPT", "Blueprint"],
  rows: [
    ["Navigation", "Linear", "Structural"]
  ]
}
```

Editable during rehearsal: headings and cells. Keep tables compact.

### `diagram`

```js
{
  type: "diagram",
  title: "Local chain",
  nodes: [
    { id: "a", label: "Structure" },
    { id: "b", label: "Scene" }
  ],
  edges: [["a", "b"]]
}
```

Use for a small local relationship. Keep labels in HTML. Use SVG only for geometry.

### `quote`

```js
{
  type: "quote",
  quote: "Structure is the navigation.",
  cite: "Blueprint principle"
}
```

Editable during rehearsal: quote and citation.

### `links`

```js
{
  type: "links",
  title: "Continue exploring",
  items: [
    { label: "Open solution scene", scene: "solution-scene" },
    { label: "Return to overview", action: "overview" },
    { label: "External reference", href: "https://example.com" }
  ]
}
```

Use links to continue the argument. Do not use them as an unstructured resource dump.

### `image`

```js
{
  type: "image",
  title: "Evidence",
  src: "images/example.jpg",
  alt: "Description",
  caption: "Short evidence caption",
  fit: "cover"
}
```

Use `cover` for photographs and `contain` for screenshots or dense diagrams. Editable during rehearsal: title and caption only.

## Overview Nodes

```js
{
  id: "solution",
  title: "结构优先",
  summary: "先表达全局逻辑，再进入细节。",
  scene: "solution-scene",
  x: 54,
  y: 42,
  tone: "accent"
}
```

`x` and `y` are overview percentages. Supported tones: `default`, `accent`, and `ink`.

## Relations

```js
{
  from: "problem",
  to: "solution",
  label: "推导"
}
```

Relations must point to registered overview nodes. Keep labels short.
