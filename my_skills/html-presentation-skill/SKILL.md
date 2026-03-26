---
name: html-presentation
description: Generate beautiful HTML presentations from Markdown or topics. Use when users ask for PPT, slides, presentations, or want to convert Markdown to HTML slides.
license: MIT
metadata:
  author: andrewlee
  version: "3.0"
compatibility: Requires Python 3.8+ for script execution
allowed-tools: Bash(python:*) Read Write
---

# HTML Presentation Skill

将 Markdown 或主题转换为精美的 HTML 演示文稿，替代传统 PPT。

## 何时使用此技能

当用户请求以下任何内容时使用此技能：
- "帮我做一个 PPT/演示文稿"
- "把这个 Markdown 转成幻灯片"
- "生成一个 HTML 演示文稿"
- "创建一个 presentation"

## 两种工作模式

### 模式一：主题生成

用户提供主题 → 生成 Markdown 初稿 → 用户确认 → 选择风格 → 生成 HTML

### 模式二：Markdown 转换

用户提供 Markdown → 审核格式 → 确认修改 → 选择风格 → 生成 HTML

## 可用主题风格

| 风格 | 适用场景 | 动画效果 |
|------|----------|----------|
| `minimalist` | 技术分享、内训 | 淡入淡出 |
| `modern-gradient` | 产品发布、创意 | 滑动切换 |
| `academic` | 学术汇报、正式 | 缩放过渡 |
| `creative` | 教育、创意产业 | 3D 翻转 |

## 核心工作流程

### 1. 内容确认阶段

- 如果用户提供主题，调用子 agent 生成 Markdown 初稿
- 如果用户提供 Markdown，调用子 agent 审核格式
- 与用户确认/修订内容
- **任何异常都必须与用户沟通**

### 2. 风格选择阶段

向用户展示上述 4 种风格选项，**必须等待用户选择**。

### 3. HTML 生成阶段（主 Agent 手动编排）

**重要：此阶段必须由主 Agent 手动编排，不能调用任何一键脚本**

1. **拆分 Markdown** - 调用 `scripts/chunk_splitter.py` 按 `---` 分页符拆分

2. **分析每个 chunk** - 为每个 chunk 调用子 agent 分析：
   - 内容类型（封面/目录/内容/表格/图表/代码/结束）
   - 提取结构化数据（表格数据、图表数据）
   - 识别需要特殊渲染的元素

3. **编写每个幻灯片的 HTML** - 主 Agent 根据分析结果：
   - 读取 `assets/single-file.html` 模板
   - 读取 `assets/themes.css` 获取主题样式
   - 读取 `assets/animations.css` 获取动画样式
   - 读取 `assets/presentation.js` 获取交互逻辑
   - **手动为每个 chunk 编写幻灯片 HTML 内容**
   - 对于表格：调用 `scripts/table_generator.py` 生成表格 HTML
   - 对于图表：调用 `scripts/chart_generator.py` 生成图表 HTML
   - 对于代码块：直接转换为 `<pre><code>` 格式
   - 对于文本：转换为适当的 HTML 标签

4. **组装最终 HTML** - 主 Agent：
   - 将所有幻灯片 HTML 插入模板
   - 嵌入主题 CSS、动画 CSS、JS
   - 写入最终输出文件

## 脚本工具（仅此 5 个）

| 脚本 | 功能 | 输入 | 输出 |
|------|------|------|------|
| `scripts/chunk_splitter.py` | 按 `---` 拆分 Markdown | Markdown 文件路径 | chunk 文件列表 |
| `scripts/content_analyzer.py` | 分析 chunk 内容类型 | chunk 文件路径 | JSON 分析结果 |
| `scripts/table_generator.py` | 生成 HTML 表格 | table_data (dict) | HTML 字符串 |
| `scripts/chart_generator.py` | 生成 SVG 图表 | chart_data (dict) | HTML 字符串 |
| `assemble.py` | 组装最终 HTML | slides JSON 文件 | HTML 文件 |

**重要：本技能没有任何一键生成脚本。所有流程必须由主 Agent 手动编排。**
`assemble.py` 只是辅助工具，需要主 Agent 提供 slides 数据。

## 内容类型识别

系统自动识别以下类型并选择最佳展示方式：

| 类型 | 识别特征 | 展示方式 |
|------|---------|---------|
| 文本 | 段落、列表 | 标准布局 |
| 表格 | Markdown 表格 | 表格布局 |
| 图表 | 数值对比数据 | 柱状图/折线图/饼图 |
| 代码 | ``` 代码块 | 代码高亮 |
| 混合 | 多种元素组合 | 分栏/卡片 |

## 异常处理原则

| 异常情况 | 处理方式 |
|---------|---------|
| Markdown 格式错误 | **必须与用户沟通**，提供修复建议 |
| 分页符不正确 | **必须与用户沟通**，询问是否自动修复 |
| 标题层级混乱 | **必须与用户沟通**，展示问题位置 |
| 脚本执行失败 | 检查日志，**与用户沟通**后处理 |

**核心原则：任何检测到的异常都必须与用户沟通确认后才能继续**

## 参考文档

- [Markdown 格式规范](references/docs/skills.md) - 详细格式要求
- [SOP 详细流程](references/sop.md) - 完整执行步骤
- [主题样式参考](assets/themes.css) - CSS 变量定义
- [动画效果参考](assets/animations.css) - 动画类定义

## 输出说明

- 生成单个 HTML 文件，包含所有 CSS 和 JS
- 支持键盘导航（方向键、空格）
- 支持触摸滑动
- 响应式设计，适配移动端
