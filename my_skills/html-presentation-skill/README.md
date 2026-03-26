# HTML 演示文稿生成技能

生成美观、现代的 HTML 演示文稿，替代传统 PPT。

## 快速开始

### 模式一：主题生成

直接向技能描述你的需求：

```
帮我做一个 PPT，主题是"微服务架构实践"
```

技能会自动：
1. 生成 Markdown 初稿供你确认
2. 与你协同修订内容
3. 转换为精美的 HTML 演示文稿

### 模式二：Markdown 转换

提供已有的 Markdown 草稿：

```
把这个 Markdown 转成 PPT
```

技能会：
1. 审核格式是否符合规范
2. 与你确认修改方案
3. 转换为 HTML 演示文稿

---

## Markdown 格式规范

详细格式规范见 [references/docs/skills.md](references/docs/skills.md)

### 基本结构

```markdown
# 演示文稿标题

副标题（可选）
作者信息（可选）

---

## 目录

1. 第一章
2. 第二章

---

## 内容页

正文内容...

### 小标题

- 列表项 1
- 列表项 2

| 表格 | 示例 |
|------|------|
| 数据 1 | 数据 2 |

```python
# 代码块
def hello():
    print("Hello")
```

---

## 谢谢聆听

Q&A
```

---

## 主题风格

| 主题 | 适用场景 |
|------|----------|
| minimalist | 技术分享、内训 |
| modern-gradient | 产品发布、创意展示 |
| academic | 学术汇报、正式场合 |
| creative | 教育、创意产业 |

## 动画效果

| 动画 | 描述 |
|------|------|
| fade | 淡入淡出 |
| slide | 滑动切换 |
| zoom | 缩放过渡 |
| flip | 3D 翻转 |

---

## 项目结构

```
html-presentation-skill/
├── SKILL.md                  # Main Agent SOP (internal)
├── README.md                 # User documentation
├── references/
│   ├── sop.md                # Detailed SOP for agents
│   └── docs/
│       └── skills.md         # Markdown format specification
├── scripts/
│   ├── chunk_splitter.py     # Markdown splitter (PEP 723)
│   ├── content_analyzer.py   # Content analyzer (PEP 723)
│   ├── table_generator.py    # Table generator (PEP 723)
│   └── chart_generator.py    # Chart generator (PEP 723)
└── assets/
    ├── themes.css            # Theme styles
    ├── animations.css        # Animation styles
    ├── style.css             # Base styles
    ├── presentation.js       # Interaction logic
    └── single-file.html      # Single-file template
```

---

## 脚本工具

脚本是底层工具，**只能由主 Agent 在 SOP 流程中调用**：

| 脚本 | 功能 | 调用时机 |
|------|------|---------|
| `scripts/chunk_splitter.py` | 按 `---` 分页符拆分 Markdown | 主 Agent 调用，拆分内容为 chunks |
| `scripts/table_generator.py` | 生成 HTML 表格 | 子 Agent 渲染表格时调用 |
| `scripts/chart_generator.py` | 生成 SVG 图表 | 子 Agent 渲染图表时调用 |

**注意**：本技能没有一键生成脚本，所有流程必须由主 Agent orchestrate。

---

## 键盘快捷键

| 按键 | 功能 |
|------|------|
| → ↓ 空格 | 下一页 |
| ← ↑ | 上一页 |
| Home | 第一页 |
| End | 最后一页 |
| ESC | 关闭侧边栏 |

---

## 特性

- **渐进式披露** - 按需加载规范，保持上下文简洁
- **子 agent 协作** - 内容分析、渲染等任务分布给子 agent
- **智能内容识别** - 自动识别文本/表格/图表/代码
- **响应式设计** - 支持桌面和移动端
- **单文件输出** - 生成一个 HTML 即可分享
