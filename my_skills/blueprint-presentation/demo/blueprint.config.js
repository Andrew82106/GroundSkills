window.BLUEPRINT_CONFIG = {
  title: 'Blueprint Skill Manual',
  subtitle: '一份用蓝图解释蓝图的结构化说明书',
  meta: 'BLUEPRINT PRESENTATION / SELF-DOCUMENTING DEMO',
  theme: 'swiss-ikb',
  overview: {
    type: 'dag',
    width: 1440,
    height: 900
  },
  ui: {
    defaultLanguage: 'zh-CN',
    languages: ['zh-CN', 'en'],
    languageLabels: { 'zh-CN': '中文', en: 'EN' },
    themes: [
      'swiss-ikb',
      'swiss-lemon',
      'swiss-green',
      'swiss-orange',
      'editorial-ink',
      'editorial-indigo',
      'editorial-forest',
      'editorial-kraft',
      'editorial-dune'
    ],
    themeLabels: {
      'swiss-ikb': 'IKB',
      'swiss-lemon': 'LEMON',
      'swiss-green': 'GREEN',
      'swiss-orange': 'ORANGE',
      'editorial-ink': 'INK',
      'editorial-indigo': 'INDIGO',
      'editorial-forest': 'FOREST',
      'editorial-kraft': 'KRAFT',
      'editorial-dune': 'DUNE'
    }
  },
  nodes: [
    {
      id: 'entry',
      title: '为什么不是 PPT',
      summary: '传统幻灯片从第一页开始。蓝图先把论述结构交给观众，再进入局部。',
      scene: 'architecture-scene',
      x: 11,
      y: 50,
      tone: 'ink'
    },
    {
      id: 'structure',
      title: '全局蓝图',
      summary: '结构可以是思维导图、DAG 或列表。点击节点，只是展开摘要和场景入口。',
      scene: 'architecture-scene',
      x: 32,
      y: 29,
      tone: 'accent'
    },
    {
      id: 'components',
      title: '自由组件',
      summary: '文字、表格、指标、示意图、引用、链接和图片，都作为局部证据块存在。',
      scene: 'components-scene',
      x: 53,
      y: 50
    },
    {
      id: 'modes',
      title: '两种模式',
      summary: '演示模式保持锁定。预演模式只开放最后一公里的校准能力。',
      scene: 'modes-scene',
      x: 73,
      y: 29,
      tone: 'accent'
    },
    {
      id: 'themes',
      title: '视觉系统',
      summary: 'Swiss 负责分析与方法论，Editorial 负责叙事与观点。色板是受控预设，不是浏览器里的任意编辑。',
      scene: 'themes-scene',
      x: 53,
      y: 76
    },
    {
      id: 'persistence',
      title: '保存覆盖层',
      summary: '本地配置仍然是主源。浏览器调整保存为小型覆盖文件，便于审阅和回填。',
      scene: 'persistence-scene',
      x: 73,
      y: 72
    },
    {
      id: 'delivery',
      title: '单文件交付',
      summary: '确认后的蓝图可以打包成独立 HTML，直接投屏、分享或部署。',
      scene: 'delivery-scene',
      x: 92,
      y: 50,
      tone: 'ink'
    }
  ],
  relations: [
    { from: 'entry', to: 'structure', label: '先展开全貌' },
    { from: 'structure', to: 'components', label: '再进入细节' },
    { from: 'components', to: 'modes', label: '预演校准' },
    { from: 'components', to: 'themes', label: '选择气质' },
    { from: 'modes', to: 'persistence', label: '保存调整' },
    { from: 'themes', to: 'persistence', label: '锁定主题' },
    { from: 'persistence', to: 'delivery', label: '冻结交付' },
    { from: 'structure', to: 'delivery', label: '结构始终可见' }
  ],
  scenes: [
    {
      id: 'architecture-scene',
      node: 'structure',
      canvas: { width: 1600, height: 1000 },
      eyebrow: 'SCENE 01 / ARCHITECTURE',
      title: '先看全局，再进入局部。',
      summary: '蓝图不是带思维导图的 PPT。思维导图、DAG 或列表都可以成为首页、目录、导航和位置提示。',
      components: [
        {
          id: 'architecture-claim',
          type: 'text',
          eyebrow: 'CORE IDEA',
          title: '把“翻页”改造成“探索”。',
          body: '观众进入蓝图后，首先看到完整的论述链条。总览使用独立画布，初次打开自动适应视口；放大后可以拖动画布继续探索。',
          bullets: ['结构形式服从内容', '节点承担结构位置', '场景承担局部展开', '组件承担证据展示'],
          slot: { x: 1, y: 1, w: 7, h: 6 }
        },
        {
          id: 'architecture-diagram',
          type: 'structure',
          eyebrow: 'FOUR-LAYER MODEL',
          title: '结构化展示模型',
          structureType: 'dag',
          nodes: [
            { id: 'overview', title: '全局蓝图', summary: '第一层先交代完整论述结构。', x: 10, y: 50 },
            { id: 'node', title: '节点概览', summary: '点击节点展开摘要与下一层入口。', x: 37, y: 50 },
            { id: 'scene', title: '局部场景', summary: '局部场景仍然是可平移、可缩放的画布。', scene: 'local-structure-scene', x: 64, y: 50 },
            { id: 'component', title: '证据组件', summary: '文字、表格、图片和结构图都只是画布中的组件。', scene: 'components-scene', x: 90, y: 50 }
          ],
          relations: [
            { from: 'overview', to: 'node', label: '点击展开' },
            { from: 'node', to: 'scene', label: '进入局部' },
            { from: 'scene', to: 'component', label: '组织证据' }
          ],
          slot: { x: 9, y: 1, w: 8, h: 6 }
        },
        {
          id: 'architecture-quote',
          type: 'quote',
          quote: '思维导图负责提示位置，组件负责展开证据。',
          cite: 'BLUEPRINT PRINCIPLE / 01',
          slot: { x: 4, y: 8, w: 10, h: 4 }
        }
      ]
    },
    {
      id: 'local-structure-scene',
      node: 'structure',
      canvas: { width: 1800, height: 1100 },
      eyebrow: 'SCENE 02 / RECURSIVE CANVAS',
      title: '局部画布仍然可以继续展开。',
      summary: '第二层、第三层或更深层都不是固定幻灯片。它们仍然可以包含结构图与自由组件，并继续下钻。',
      components: [
        {
          id: 'local-structure-map',
          type: 'structure',
          eyebrow: 'NESTED STRUCTURE',
          title: '局部结构图也是正式组件',
          structureType: 'mind-map',
          nodes: [
            { id: 'canvas', title: '局部画布', summary: '每一层都有自己的正常比例与独立视角。', x: 12, y: 52, tone: 'ink' },
            { id: 'map', title: '结构图组件', summary: '结构图可以是思维导图、DAG 或列表。', x: 38, y: 28, tone: 'accent' },
            { id: 'evidence', title: '证据组件', summary: '结构图可以与文字、表格、图片并置。', scene: 'components-scene', x: 62, y: 56 },
            { id: 'deeper', title: '继续下钻', summary: '点击后进入更深层场景，返回时仍回到当前层。', scene: 'modes-scene', x: 88, y: 30, tone: 'accent' }
          ],
          relations: [
            { from: 'canvas', to: 'map', label: '容纳' },
            { from: 'map', to: 'evidence', label: '组织' },
            { from: 'map', to: 'deeper', label: '继续展开' }
          ],
          slot: { x: 1, y: 1, w: 16, h: 7 }
        },
        {
          id: 'local-structure-copy',
          type: 'text',
          eyebrow: 'RECURSIVE RULE',
          title: '任何层级都保持画布语义。',
          body: '画布进入时自动适应视口，放大后可以拖动探索。预演模式只是在此基础上增加组件位置校准，不改变浏览模型。',
          bullets: ['局部画布可平移与缩放', '结构图节点可继续进入下一层', '返回按钮回到直接上一级'],
          slot: { x: 3, y: 9, w: 12, h: 3 }
        }
      ]
    },
    {
      id: 'components-scene',
      node: 'components',
      eyebrow: 'SCENE 03 / COMPONENTIZATION',
      title: '组件是细节，不是页面。',
      summary: '每个组件只负责一种表达任务。它们由本地配置决定，并吸附到统一的大屏网格。',
      components: [
        {
          id: 'component-stats',
          type: 'stats',
          eyebrow: 'SYSTEM CONTRACT',
          title: '受控的自由度',
          items: [
            { value: '08', unit: '类', label: '首批组件' },
            { value: '16', unit: '列', label: '水平网格' },
            { value: '12', unit: '行', label: '垂直坐标' }
          ],
          slot: { x: 1, y: 1, w: 7, h: 5 }
        },
        {
          id: 'component-table',
          type: 'table',
          eyebrow: 'REGISTERED TYPES',
          title: '首批组件注册表',
          columns: ['组件', '适合表达', '预演可改'],
          rows: [
            ['text / quote', '观点与语境', '短文本'],
            ['stats / table', '指标与对比', '数值和单元格'],
            ['diagram / image', '静态关系与证据', '标签和说明'],
            ['structure', '递归结构导航', '节点标题'],
            ['links', '继续探索', '链接文字']
          ],
          slot: { x: 9, y: 1, w: 8, h: 7 }
        },
        {
          id: 'component-image',
          type: 'image',
          eyebrow: 'EVIDENCE BLOCK',
          title: '图片也是结构中的证据块',
          src: 'images/blueprint-proof.svg',
          alt: 'A Swiss-style diagram showing overview, node, scene, and component blocks.',
          caption: 'LOCAL SVG / PACKED INTO SINGLE HTML',
          fit: 'contain',
          slot: { x: 1, y: 7, w: 7, h: 5 }
        },
        {
          id: 'component-links',
          type: 'links',
          eyebrow: 'NEXT',
          title: '继续探索',
          items: [
            { label: '查看两种运行模式', scene: 'modes-scene' },
            { label: '返回全局蓝图', action: 'overview' }
          ],
          slot: { x: 9, y: 9, w: 8, h: 3 }
        }
      ]
    },
    {
      id: 'themes-scene',
      node: 'themes',
      eyebrow: 'SCENE 04 / VISUAL SYSTEMS',
      title: '主题不是换色，而是选择一种表达纪律。',
      summary: '蓝图保留参考仓库的两条成熟方向：Swiss 强调结构精度，Editorial 强调叙事质感。右上角主题按钮用于在这份 demo 中轮换查看预设。',
      components: [
        {
          id: 'themes-principle',
          type: 'text',
          eyebrow: 'CONTROLLED PRESETS',
          title: '视觉系统先于色板。',
          body: '正式蓝图通常在生成时锁定一个主题。demo 才开放主题轮换，用来判断内容更适合精确的结构分析，还是更接近电子杂志的叙事展开。',
          bullets: ['Swiss：无衬线、直角、可见网格、单一高饱和锚点色', 'Editorial：衬线标题、纸张色、墨水色、编辑式分隔线', '浏览器只切换注册预设，不开放任意 CSS 修改'],
          slot: { x: 1, y: 1, w: 7, h: 7 }
        },
        {
          id: 'themes-table',
          type: 'table',
          eyebrow: 'REGISTERED THEMES',
          title: '两族九套预设',
          columns: ['系统', '预设', '适合内容'],
          rows: [
            ['Swiss', 'IKB / Lemon / Green / Orange', '产品、技术、分析、方法论'],
            ['Editorial', 'Ink / Indigo / Forest', '叙事、观点、人文、研究背景'],
            ['Editorial', 'Kraft / Dune', '历史、材料、田野、档案感内容']
          ],
          slot: { x: 9, y: 1, w: 8, h: 7 }
        },
        {
          id: 'themes-quote',
          type: 'quote',
          quote: '色板是约束，不是装饰。',
          cite: 'VISUAL RULE / 03',
          slot: { x: 4, y: 9, w: 10, h: 3 }
        }
      ]
    },
    {
      id: 'modes-scene',
      node: 'modes',
      eyebrow: 'SCENE 05 / TWO MODES',
      title: '展示和校准，必须分开。',
      summary: '蓝图在浏览器里提供两种模式，但不会演化成一个在线制作工具。',
      components: [
        {
          id: 'modes-table',
          type: 'table',
          eyebrow: 'MODE COMPARISON',
          title: '演示模式与预演模式',
          columns: ['能力', '演示模式', '预演模式'],
          rows: [
            ['节点与场景跳转', '允许', '允许'],
            ['组件拖动与缩放', '锁定', '允许，吸附网格'],
            ['少量文本修订', '锁定', '双击后编辑'],
            ['界面语言切换', '允许', '允许'],
            ['新增或删除组件', '不允许', '不允许']
          ],
          slot: { x: 1, y: 1, w: 9, h: 7 }
        },
        {
          id: 'modes-boundary',
          type: 'text',
          eyebrow: 'BOUNDARY',
          title: '预演模式只负责最后一公里。',
          body: '组件数量、类型、关系、素材和主题仍然在本地配置中维护。浏览器只承担布局校准和短文本修订。',
          bullets: ['场景返回遵循进入路径', '拖动和缩放自动吸附网格', '界面按钮可以切换语言', '保存结果可以审阅'],
          slot: { x: 11, y: 1, w: 6, h: 7 }
        },
        {
          id: 'modes-quote',
          type: 'quote',
          quote: '布局合理时，尽量少拖。',
          cite: 'OPERATING RULE / 02',
          slot: { x: 4, y: 9, w: 10, h: 3 }
        }
      ]
    },
    {
      id: 'persistence-scene',
      node: 'persistence',
      eyebrow: 'SCENE 06 / SAVE MODEL',
      title: '保存的是覆盖层，不是混乱。',
      summary: '浏览器调整与本地源配置解耦。每次保存仍然是一个可以阅读、审阅和回填的小文件。',
      components: [
        {
          id: 'persistence-diagram',
          type: 'diagram',
          eyebrow: 'LOAD ORDER',
          title: '配置加载顺序',
          nodes: [
            { id: 'config', label: '本地配置' },
            { id: 'file', label: '覆盖文件' },
            { id: 'draft', label: '浏览器草稿' },
            { id: 'artifact', label: '单文件产物' }
          ],
          edges: [['config', 'file'], ['file', 'draft'], ['draft', 'artifact']],
          slot: { x: 1, y: 1, w: 16, h: 4 }
        },
        {
          id: 'persistence-copy',
          type: 'text',
          eyebrow: 'SOURCE OF TRUTH',
          title: '配置文件仍然是主源。',
          body: '预演模式中的修改先写入 localStorage。点击保存后，浏览器输出 blueprint-overrides.json。确认后的覆盖文件放回项目目录，再进入最终打包。',
          bullets: ['草稿可刷新恢复', '覆盖文件保持小而清晰', '打包前可以人工检查'],
          slot: { x: 1, y: 6, w: 9, h: 6 }
        },
        {
          id: 'persistence-stats',
          type: 'stats',
          eyebrow: 'DELIVERABLES',
          title: '三层文件关系',
          items: [
            { value: '01', unit: '份', label: '源配置' },
            { value: '01', unit: '份', label: '覆盖文件' },
            { value: '01', unit: '个', label: '最终 HTML' }
          ],
          slot: { x: 11, y: 6, w: 6, h: 6 }
        }
      ]
    },
    {
      id: 'delivery-scene',
      node: 'delivery',
      eyebrow: 'SCENE 07 / DELIVERY',
      title: '制作目录继续迭代，单个 HTML 对外交付。',
      summary: '源项目保留全部配置和素材。打包器将 CSS、运行时、覆盖配置和本地图片内联为一个文件。',
      components: [
        {
          id: 'delivery-copy',
          type: 'text',
          eyebrow: 'SOURCE PROJECT',
          title: '项目目录用于继续修改。',
          body: '初始化脚本会生成 index.html、blueprint.config.js、blueprint-overrides.json、样式、运行时和 images 目录。',
          bullets: ['编辑配置', '本地预览', '校验结构', '打包交付'],
          slot: { x: 1, y: 1, w: 7, h: 7 }
        },
        {
          id: 'delivery-image',
          type: 'image',
          eyebrow: 'PACKED ARTIFACT',
          title: '最终只有一个 blueprint.html',
          src: 'images/blueprint-proof.svg',
          alt: 'A Swiss-style chain showing how the Blueprint artifact is structured.',
          caption: 'CSS + JS + OVERRIDES + LOCAL IMAGES / INLINE',
          fit: 'contain',
          slot: { x: 9, y: 1, w: 8, h: 6 }
        },
        {
          id: 'delivery-quote',
          type: 'quote',
          quote: '源项目用于修改，单个 HTML 用于交付。',
          cite: 'DELIVERY RULE / 03',
          slot: { x: 1, y: 9, w: 7, h: 3 }
        },
        {
          id: 'delivery-links',
          type: 'links',
          eyebrow: 'REVIEW AGAIN',
          title: '继续查看',
          items: [
            { label: '回到保存机制', scene: 'persistence-scene' },
            { label: '回到全局蓝图', action: 'overview' }
          ],
          slot: { x: 9, y: 8, w: 8, h: 4 }
        }
      ]
    }
  ]
};
