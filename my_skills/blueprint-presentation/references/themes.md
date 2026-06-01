# Blueprint Theme Presets

Blueprint themes are controlled presets adapted from the two visual directions in `op7418/guizang-ppt-skill`. Choose a visual system first, then choose a palette. Do not improvise arbitrary browser-side CSS controls.

## Choose A Visual System

Use `Swiss` for product narratives, technical explanations, analytical reports, and methods. It uses a neutral sans hierarchy, rectilinear geometry, visible coordinates, and one high-saturation anchor color.

Use `Editorial` for narrative arguments, humanities, background sections, historical material, and research stories where reading texture matters. It uses serif display headings, paper-and-ink palettes, editorial rules, and quieter component surfaces.

## Registered Presets

| ID | System | Palette | Recommended use |
|---|---|---|---|
| `swiss-ikb` | Swiss | IKB blue | Default. Precise, technical, and broadly reusable. |
| `swiss-lemon` | Swiss | Lemon yellow | High-energy emphasis with dark text on accent blocks. |
| `swiss-green` | Swiss | Acid green | Contemporary, experimental, and data-forward. |
| `swiss-orange` | Swiss | Signal orange | Warm, assertive, and suitable for action-oriented material. |
| `editorial-ink` | Editorial | Black ink on warm paper | Default editorial direction. Restrained and archival. |
| `editorial-indigo` | Editorial | Indigo porcelain | Research, culture, and calm long-form explanation. |
| `editorial-forest` | Editorial | Forest ink | Environmental, fieldwork, and material narratives. |
| `editorial-kraft` | Editorial | Kraft paper | Historical, industrial, and archive-like material. |
| `editorial-dune` | Editorial | Dune paper | Warm essays, landscape, and human-centered narratives. |

## Config

Lock the generated Blueprint to one preset:

```json
"theme": "swiss-ikb"
```

Expose a controlled switcher only when reviewers need to compare approved presets:

```json
"reviewThemes": ["swiss-ikb", "editorial-ink", "editorial-indigo"]
```

The compiler supplies short toolbar labels. The runtime persists the selected preset separately from rehearsal overrides. It does not support arbitrary colors, arbitrary CSS, or browser-side theme creation.
