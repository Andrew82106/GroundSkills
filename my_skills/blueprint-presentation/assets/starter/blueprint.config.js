window.BLUEPRINT_CONFIG = {
  title: '蓝图 Blueprint',
  subtitle: '基于自由组件的结构化大屏展示方案',
  meta: 'STRUCTURED PRESENTATION / DEMO',
  overview: {
    type: 'mind-map',
    width: 1440,
    height: 900
  },
  ui: {
    defaultLanguage: 'zh-CN',
    languages: ['zh-CN', 'en'],
    languageLabels: { 'zh-CN': '中文', en: 'EN' }
  },
  nodes: [
    {
      id: 'opening',
      title: '从全局开始',
      summary: '演示不再从第一页开始，而是先把整个论述结构交给观众。',
      x: 12,
      y: 48,
      tone: 'ink'
    },
    {
      id: 'structure',
      title: '结构化蓝图',
      summary: '节点与连线直接表达链条关系，不依赖逐页点击才能理解。',
      scene: 'structure-scene',
      x: 35,
      y: 31,
      tone: 'accent'
    },
    {
      id: 'components',
      title: '自由组件',
      summary: '文本、表格、指标、示意图和链接都作为局部证据块存在。',
      scene: 'components-scene',
      x: 59,
      y: 48
    },
    {
      id: 'rehearsal',
      title: '预演校准',
      summary: '内容在本地配置，浏览器只开放少量可回填的微调能力。',
      scene: 'rehearsal-scene',
      x: 82,
      y: 31,
      tone: 'accent'
    },
    {
      id: 'delivery',
      title: '单文件交付',
      summary: '确认后打包为单个 HTML，直接投屏、分享或归档。',
      x: 82,
      y: 70,
      tone: 'ink'
    }
  ],
  relations: [
    { from: 'opening', to: 'structure', label: '先展开全貌' },
    { from: 'structure', to: 'components', label: '再进入细节' },
    { from: 'components', to: 'rehearsal', label: '编排校准' },
    { from: 'rehearsal', to: 'delivery', label: '冻结交付' },
    { from: 'structure', to: 'delivery', label: '结构始终可见' }
  ],
  scenes: [
    {
      id: 'structure-scene',
      node: 'structure',
      canvas: { width: 1600, height: 1000 },
      eyebrow: 'SCENE 01 / STRUCTURE',
      title: '结构本身就是导航。',
      summary: '观众先理解全局链条，再决定进入哪一个局部。',
      components: [
        {
          id: 'structure-claim',
          type: 'text',
          eyebrow: 'WHY IT MATTERS',
          title: '从线性翻页，转向可探索的论述空间。',
          body: '思维导图不是目录装饰。它承担全局叙事、位置提示和跳转入口三个角色。',
          bullets: ['关系在点击之前已经可见', '场景展开后仍保留结构上下文'],
          slot: { x: 1, y: 1, w: 7, h: 6 }
        },
        {
          id: 'structure-diagram',
          type: 'structure',
          eyebrow: 'LOCAL MODEL',
          title: '结构 → 节点 → 场景 → 组件',
          structureType: 'dag',
          nodes: [
            { id: 'graph', title: '全局蓝图', summary: '先看完整结构。', x: 12, y: 50 },
            { id: 'node', title: '节点概览', summary: '点击后展开摘要。', x: 38, y: 50 },
            { id: 'scene', title: '局部场景', summary: '场景也是可平移画布。', x: 64, y: 50 },
            { id: 'block', title: '证据组件', summary: '进入组件场景。', scene: 'components-scene', x: 90, y: 50 }
          ],
          relations: [
            { from: 'graph', to: 'node' },
            { from: 'node', to: 'scene' },
            { from: 'scene', to: 'block' }
          ],
          slot: { x: 9, y: 1, w: 8, h: 6 }
        },
        {
          id: 'structure-quote',
          type: 'quote',
          quote: '思维导图负责提示位置，组件负责展开证据。',
          cite: 'BLUEPRINT PRINCIPLE / 01',
          slot: { x: 5, y: 8, w: 9, h: 4 }
        }
      ]
    },
    {
      id: 'components-scene',
      node: 'components',
      eyebrow: 'SCENE 02 / COMPONENTIZATION',
      title: '组件是细节，不是页面。',
      summary: '每个组件只承担一种表达任务，并服从同一个局部场景。',
      components: [
        {
          id: 'component-stats',
          type: 'stats',
          eyebrow: 'SYSTEM LIMITS',
          title: '受控的自由度',
          items: [
            { value: '16', unit: '列', label: '场景网格' },
            { value: '12', unit: '行', label: '垂直坐标' },
            { value: '08', unit: '类', label: '首批组件' }
          ],
          slot: { x: 1, y: 1, w: 8, h: 5 }
        },
        {
          id: 'component-table',
          type: 'table',
          eyebrow: 'COMPARISON',
          title: '传统幻灯片与蓝图',
          columns: ['维度', '传统 PPT', 'Blueprint'],
          rows: [
            ['入口', '第一页', '全局结构图'],
            ['导航', '线性翻页', '节点与链接'],
            ['调整', '回到制作工具', '预演模式微调']
          ],
          slot: { x: 10, y: 1, w: 7, h: 7 }
        },
        {
          id: 'component-links',
          type: 'links',
          eyebrow: 'NEXT',
          title: '沿着蓝图继续',
          items: [
            { label: '查看预演模式', scene: 'rehearsal-scene' },
            { label: '返回全局结构', action: 'overview' }
          ],
          slot: { x: 1, y: 7, w: 8, h: 5 }
        },
        {
          id: 'component-image',
          type: 'image',
          eyebrow: 'EVIDENCE BLOCK',
          title: '结构图也属于组件',
          src: 'images/blueprint-proof.svg',
          alt: 'A Swiss-style blueprint diagram showing overview, node, scene, and component blocks.',
          caption: 'LOCAL SVG / PACKED INTO SINGLE HTML',
          fit: 'contain',
          slot: { x: 10, y: 8, w: 7, h: 5 }
        }
      ]
    },
    {
      id: 'rehearsal-scene',
      node: 'rehearsal',
      eyebrow: 'SCENE 03 / REHEARSAL',
      title: '预演模式只负责最后一公里。',
      summary: '配置仍然是主源。浏览器里的修改必须克制、可保存、可回填。',
      components: [
        {
          id: 'rehearsal-copy',
          type: 'text',
          eyebrow: 'EDITABLE SURFACE',
          title: '允许微调，但不在浏览器里制作。',
          body: '进入预演模式后，可以拖动组件、吸附网格、调整宽高，并双击少量文字进行修订。',
          bullets: ['不新增或删除组件', '不修改关系与类型', '保存为覆盖文件'],
          slot: { x: 1, y: 1, w: 8, h: 7 }
        },
        {
          id: 'rehearsal-quote',
          type: 'quote',
          quote: '布局合理时，尽量少拖。',
          cite: 'OPERATING RULE / 02',
          slot: { x: 10, y: 1, w: 7, h: 4 }
        },
        {
          id: 'rehearsal-links',
          type: 'links',
          eyebrow: 'DELIVERY',
          title: '完成校准',
          items: [
            { label: '返回全局结构', action: 'overview' },
            { label: '查看组件场景', scene: 'components-scene' }
          ],
          slot: { x: 10, y: 6, w: 7, h: 6 }
        }
      ]
    }
  ]
};
