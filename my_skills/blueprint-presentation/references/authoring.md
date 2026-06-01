# Blueprint Declarative Authoring

Use `blueprint.source.json` as the only authoring file for ordinary Blueprint work. Describe the argument, not the renderer. Validation and packing compile this declaration into `blueprint.config.js`.

## Minimal Shape

```json
{
  "title": "产品方案",
  "subtitle": "先看结构，再进入证据",
  "theme": "swiss-ikb",
  "overview": { "type": "dag" },
  "nodes": [
    { "id": "problem", "title": "问题", "summary": "为什么需要改变？" },
    { "id": "solution", "title": "方案", "summary": "如何解决？", "scene": "solution-scene" }
  ],
  "relations": [
    ["problem", "solution", "推导"]
  ],
  "scenes": [
    {
      "id": "solution-scene",
      "title": "方案如何工作",
      "summary": "只展开支撑当前节点的证据。",
      "blocks": [
        { "type": "text", "title": "核心判断", "body": "一句清晰结论。" },
        { "type": "quote", "quote": "结构先于细节。", "cite": "PRINCIPLE / 01" }
      ]
    }
  ]
}
```

## Authoring Rules

- Write `nodes`, `relations`, `scenes`, and `blocks`. Keep the outline readable as content.
- Use relation tuples: `["from", "to", "short label"]`.
- Omit node coordinates, canvas sizes, block IDs, eyebrows, and grid slots by default. The compiler supplies them.
- Use only registered block types: `text`, `stats`, `table`, `diagram`, `structure`, `quote`, `links`, and `image`.
- Add local images under `images/` and reference them with relative paths.
- Set `language` and optional `interfaceLanguages` at the top level.
- Set one `theme`. Add `reviewThemes` only for deliberate preset comparison.

## Optional Escape Hatches

Use explicit `x`, `y`, `canvas`, `id`, `eyebrow`, or `slot` only after preview shows a real layout problem. Do not pre-optimize coordinates before the content structure is stable.

Read `component-contracts.md` only when a registered block needs a detailed shape, a nested `structure` block needs navigation, or an escape hatch is necessary.
