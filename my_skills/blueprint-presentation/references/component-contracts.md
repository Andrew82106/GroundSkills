# Blueprint Component Contracts

## Blueprint Options

Choose a registered visual preset and the global structure form according to the content:

```js
theme: "swiss-ikb"
```

Read `themes.md` for the Swiss and Editorial preset registry. The runtime defaults to `swiss-ikb`.

```js
overview: {
  type: "dag",
  width: 1440,
  height: 900
}
```

Supported overview types: `mind-map`, `dag`, and `list`. All three use the same movable canvas. Node placement remains explicit, so the author controls the composition.

Declare the interface language during generation:

```js
ui: {
  defaultLanguage: "zh-CN",
  languages: ["zh-CN", "en"],
  languageLabels: { "zh-CN": "中文", en: "EN" }
}
```

The built-in interface dictionary covers `zh-CN` and `en`. Add `ui.labels[language]` only when overriding built-in labels or introducing another interface language. Presentation content remains authored text; the runtime does not translate it.

For a review demo, expose a controlled theme switcher:

```js
ui: {
  themes: ["swiss-ikb", "editorial-ink"],
  themeLabels: { "swiss-ikb": "IKB", "editorial-ink": "INK" }
}
```

Omit `ui.themes` in a final Blueprint when the chosen visual system should remain locked.

## Scene Canvases

Every scene is a pannable and zoomable local canvas, not a fixed slide. Override the default `1600 × 1000` canvas only when the content needs a different working area:

```js
{
  id: "analysis-scene",
  canvas: { width: 1800, height: 1200 },
  components: []
}
```

The runtime fits the full canvas on entry. Viewers can zoom and pan in presentation mode. Rehearsal mode additionally allows component layout changes.

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

### `structure`

```js
{
  type: "structure",
  title: "Local reasoning map",
  structureType: "dag",
  nodes: [
    { id: "question", title: "Question", summary: "What needs explanation?", x: 14, y: 50 },
    { id: "evidence", title: "Evidence", summary: "Inspect the supporting material.", scene: "evidence-scene", x: 52, y: 50 }
  ],
  relations: [
    { from: "question", to: "evidence", label: "inspect" }
  ]
}
```

Use when a scene contains a mind-map, DAG, or list that participates in navigation. Supported `structureType` values: `mind-map`, `dag`, and `list`. Clicking a node opens its preview; entering its scene adds another level to the navigation path.

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
    { label: "Return one level", action: "back" },
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

## Navigation

Entering a scene records the current level. A `links` item or `structure` node may enter another scene, creating a deeper path. Use `{ action: "back" }` to return one level and `{ action: "overview" }` only for an explicit jump to the root structure.
