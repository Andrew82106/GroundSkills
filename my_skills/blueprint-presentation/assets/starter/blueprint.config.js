/* GENERATED FILE. Edit blueprint.source.json instead. */
window.BLUEPRINT_CONFIG = {
  "title": "蓝图 Blueprint",
  "subtitle": "基于自由组件的结构化大屏展示方案",
  "meta": "STRUCTURED PRESENTATION / DEMO",
  "theme": "swiss-ikb",
  "overview": {
    "type": "mind-map",
    "width": 1440,
    "height": 900
  },
  "ui": {
    "defaultLanguage": "zh-CN",
    "languages": [
      "zh-CN",
      "en"
    ],
    "languageLabels": {
      "zh-CN": "中文",
      "en": "EN"
    }
  },
  "nodes": [
    {
      "id": "opening",
      "title": "从全局开始",
      "summary": "演示不再从第一页开始，而是先把整个论述结构交给观众。",
      "tone": "ink",
      "x": 50,
      "y": 50
    },
    {
      "id": "structure",
      "title": "结构化蓝图",
      "summary": "节点与连线直接表达链条关系，不依赖逐页点击才能理解。",
      "scene": "structure-scene",
      "tone": "accent",
      "x": 50,
      "y": 16
    },
    {
      "id": "components",
      "title": "自由组件",
      "summary": "文本、表格、指标、示意图和链接都作为局部证据块存在。",
      "scene": "components-scene",
      "x": 87,
      "y": 50
    },
    {
      "id": "rehearsal",
      "title": "预演校准",
      "summary": "内容在本地声明，浏览器只开放少量可回填的微调能力。",
      "scene": "rehearsal-scene",
      "tone": "accent",
      "x": 50,
      "y": 84
    },
    {
      "id": "delivery",
      "title": "单文件交付",
      "summary": "确认后打包为单个 HTML，直接投屏、分享或归档。",
      "tone": "ink",
      "x": 13,
      "y": 50.00000000000001
    }
  ],
  "relations": [
    {
      "from": "opening",
      "to": "structure",
      "label": "先展开全貌"
    },
    {
      "from": "structure",
      "to": "components",
      "label": "再进入细节"
    },
    {
      "from": "components",
      "to": "rehearsal",
      "label": "预演校准"
    },
    {
      "from": "rehearsal",
      "to": "delivery",
      "label": "冻结交付"
    },
    {
      "from": "structure",
      "to": "delivery",
      "label": "结构始终可见"
    }
  ],
  "scenes": [
    {
      "id": "structure-scene",
      "node": "structure",
      "canvas": {
        "width": 1600,
        "height": 1000
      },
      "eyebrow": "SCENE 01 / DETAIL",
      "title": "结构本身就是导航。",
      "summary": "观众先理解全局链条，再决定进入哪一个局部。",
      "components": [
        {
          "type": "text",
          "title": "从线性翻页，转向可探索的论述空间。",
          "body": "思维导图不是目录装饰。它承担全局叙事、位置提示和跳转入口三个角色。",
          "bullets": [
            "关系在点击之前已经可见",
            "场景展开后仍保留结构上下文"
          ],
          "id": "structure-scene-block-1",
          "eyebrow": "TEXT",
          "slot": {
            "x": 1,
            "y": 1,
            "w": 8,
            "h": 7
          }
        },
        {
          "type": "structure",
          "title": "结构 → 节点 → 场景 → 组件",
          "structureType": "dag",
          "nodes": [
            {
              "id": "graph",
              "title": "全局蓝图",
              "summary": "先看完整结构。",
              "x": 12,
              "y": 24
            },
            {
              "id": "node",
              "title": "节点概览",
              "summary": "点击后展开摘要。",
              "x": 88,
              "y": 24
            },
            {
              "id": "scene",
              "title": "局部场景",
              "summary": "场景也是可平移画布。",
              "x": 12,
              "y": 76
            },
            {
              "id": "block",
              "title": "证据组件",
              "summary": "进入组件场景。",
              "scene": "components-scene",
              "x": 88,
              "y": 76
            }
          ],
          "relations": [
            {
              "from": "graph",
              "to": "node"
            },
            {
              "from": "node",
              "to": "scene"
            },
            {
              "from": "scene",
              "to": "block"
            }
          ],
          "id": "structure-scene-block-2",
          "eyebrow": "STRUCTURE",
          "slot": {
            "x": 10,
            "y": 1,
            "w": 7,
            "h": 7
          }
        },
        {
          "type": "quote",
          "quote": "思维导图负责提示位置，组件负责展开证据。",
          "cite": "BLUEPRINT PRINCIPLE / 01",
          "id": "structure-scene-block-3",
          "eyebrow": "QUOTE",
          "slot": {
            "x": 4,
            "y": 9,
            "w": 10,
            "h": 3
          }
        }
      ]
    },
    {
      "id": "components-scene",
      "node": "components",
      "canvas": {
        "width": 1600,
        "height": 1000
      },
      "eyebrow": "SCENE 02 / DETAIL",
      "title": "组件是细节，不是页面。",
      "summary": "每个组件只承担一种表达任务，并服从同一个局部场景。",
      "components": [
        {
          "type": "stats",
          "title": "受控的自由度",
          "items": [
            {
              "value": "16",
              "unit": "列",
              "label": "场景网格"
            },
            {
              "value": "12",
              "unit": "行",
              "label": "垂直坐标"
            },
            {
              "value": "08",
              "unit": "类",
              "label": "首批组件"
            }
          ],
          "id": "components-scene-block-1",
          "eyebrow": "STATS",
          "slot": {
            "x": 1,
            "y": 1,
            "w": 8,
            "h": 5
          }
        },
        {
          "type": "table",
          "title": "传统幻灯片与蓝图",
          "columns": [
            "维度",
            "传统 PPT",
            "Blueprint"
          ],
          "rows": [
            [
              "入口",
              "第一页",
              "全局结构图"
            ],
            [
              "导航",
              "线性翻页",
              "节点与链接"
            ],
            [
              "调整",
              "回到制作工具",
              "预演模式微调"
            ]
          ],
          "id": "components-scene-block-2",
          "eyebrow": "TABLE",
          "slot": {
            "x": 10,
            "y": 1,
            "w": 7,
            "h": 6
          }
        },
        {
          "type": "links",
          "title": "沿着蓝图继续",
          "items": [
            {
              "label": "查看预演模式",
              "scene": "rehearsal-scene"
            },
            {
              "label": "返回全局结构",
              "action": "overview"
            }
          ],
          "id": "components-scene-block-3",
          "eyebrow": "LINKS",
          "slot": {
            "x": 1,
            "y": 7,
            "w": 8,
            "h": 5
          }
        },
        {
          "type": "image",
          "title": "结构图也属于组件",
          "src": "images/blueprint-proof.svg",
          "alt": "A Swiss-style blueprint diagram showing overview, node, scene, and component blocks.",
          "caption": "LOCAL SVG / PACKED INTO SINGLE HTML",
          "fit": "contain",
          "id": "components-scene-block-4",
          "eyebrow": "IMAGE",
          "slot": {
            "x": 10,
            "y": 8,
            "w": 7,
            "h": 5
          }
        }
      ]
    },
    {
      "id": "rehearsal-scene",
      "node": "rehearsal",
      "canvas": {
        "width": 1600,
        "height": 1000
      },
      "eyebrow": "SCENE 03 / DETAIL",
      "title": "预演模式只负责最后一公里。",
      "summary": "声明文件仍然是主源。浏览器里的修改必须克制、可保存、可回填。",
      "components": [
        {
          "type": "text",
          "title": "允许微调，但不在浏览器里制作。",
          "body": "进入预演模式后，可以拖动组件、吸附网格、调整宽高，并双击少量文字进行修订。",
          "bullets": [
            "不新增或删除组件",
            "不修改关系与类型",
            "保存为覆盖文件"
          ],
          "id": "rehearsal-scene-block-1",
          "eyebrow": "TEXT",
          "slot": {
            "x": 1,
            "y": 1,
            "w": 8,
            "h": 7
          }
        },
        {
          "type": "quote",
          "quote": "布局合理时，尽量少拖。",
          "cite": "OPERATING RULE / 02",
          "id": "rehearsal-scene-block-2",
          "eyebrow": "QUOTE",
          "slot": {
            "x": 10,
            "y": 1,
            "w": 7,
            "h": 7
          }
        },
        {
          "type": "links",
          "title": "完成校准",
          "items": [
            {
              "label": "返回全局结构",
              "action": "overview"
            },
            {
              "label": "查看组件场景",
              "scene": "components-scene"
            }
          ],
          "id": "rehearsal-scene-block-3",
          "eyebrow": "LINKS",
          "slot": {
            "x": 4,
            "y": 9,
            "w": 10,
            "h": 3
          }
        }
      ]
    }
  ]
};
