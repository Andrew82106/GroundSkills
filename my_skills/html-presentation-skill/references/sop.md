# HTML Presentation - Detailed SOP

本文档描述 HTML Presentation 技能的完整执行流程，供主 Agent 参考。

---

## 核心原则

**主 Agent 和子 Agent 必须手动编写每个幻灯片的 HTML 内容**，工具脚本仅提供辅助功能：
- 读取/分析数据
- 生成样式代码片段
- 验证格式

**不能**依赖任何一键生成脚本。

---

## 模式一：主题生成（用户输入主题）

```
用户输入主题 → 调用子 agent 生成 Markdown 初稿 → 用户确认/修订 → [选择风格] → 手动编写 HTML
```

### SOP 流程

1. **接收主题** - 用户输入如"帮我做一个 PPT，主题是微服务架构实践"

2. **调用子 agent 生成 Markdown 初稿**
   - Prompt 示例：
     ```
     你是一个演示文稿内容策划专家。
     任务：根据主题"{theme}"生成 Markdown 演示文稿草稿。
     要求：
     1. 包含封面、目录、3-5 个核心内容页、结束页
     2. 每页用 `---` 分隔
     3. 内容结构清晰，每页一个核心观点
     输出完整的 Markdown 内容。
     ```
   - 等待子 agent 返回 Markdown

3. **展示给用户确认**
   - 输出 Markdown 给用户查看
   - 询问是否需要修改

4. **协同修订**（多轮对话）
   - 根据用户反馈调整内容
   - 可再次调用子 agent 进行修订

5. **选择演示风格**
   - 向用户展示可用风格选项：
     | 风格 | 适用场景 | 动画效果 |
     |------|----------|----------|
     | 极简主义 (minimalist) | 技术分享、内训 | 淡入淡出 |
     | 现代渐变 (modern-gradient) | 产品发布、创意 | 滑动切换 |
     | 学术专业 (academic) | 学术汇报、正式 | 缩放过渡 |
     | 活泼创意 (creative) | 教育、创意产业 | 3D 翻转 |
   - **必须等待用户选择后才能进入下一步**

6. **进入 HTML 手动编写流程**（见下方）

---

## 模式二：Markdown 转换（用户直接输入 Markdown）

```
用户输入 Markdown → 读取规范 → 调用子 agent 审核 → 商讨修订 → [选择风格] → 手动编写 HTML
```

### SOP 流程

1. **接收 Markdown** - 用户提供已有草稿

2. **读取格式规范**
   - 读取 `references/docs/skills.md` 了解 Markdown 格式要求

3. **调用子 agent 审核**
   - Prompt 示例：
     ```
     你是一个 Markdown 格式审核专家。
     任务：审核用户提供的 Markdown 是否符合演示文稿规范。
     检查项：
     1. 分页符使用是否正确（`---` 分隔符）
     2. 标题层级是否合理（# 封面，## 幻灯片标题）
     3. 表格、代码块、列表语法是否正确
     输出：
     - 问题列表（如有）
     - 修改建议
     ```
   - 等待子 agent 返回审核结果

4. **与用户商讨修改**
   - 展示审核结果
   - 确认修改方案
   - **任何异常都必须与用户沟通确认后才能继续**

5. **选择演示风格**
   - 向用户展示可用风格选项（同上）
   - **必须等待用户选择后才能进入下一步**

6. **进入 HTML 手动编写流程**（见下方）

---

## HTML 手动编写流程（核心工作流）

这是两种模式汇合后的核心流程。

**前置条件：**
- 用户已确认 Markdown 内容
- 用户已选择演示风格（主题 + 动画）

### 步骤 1：拆分 Markdown 为 Chunk

**主 Agent 操作：**
- 调用 `scripts/chunk_splitter.py` 按 `---` 分页符拆分

```bash
python scripts/chunk_splitter.py input.md -o .chunks/
```

脚本返回 chunk 列表，包含每个 chunk 的路径、标题、类型。

### 步骤 2：分析每个 Chunk 内容

**主 Agent 为每个 chunk 调用子 Agent 分析：**

**子 Agent Prompt：**
```
你是一个内容分析专家。

任务：分析这个 Markdown chunk，提取结构化信息，帮助生成 HTML。

输入内容：
{chunk_content}

请分析：
1. 内容类型：cover（封面）/ toc（目录）/ content（内容）/ table（表格）/ chart（图表）/ code（代码）/ end（结束页）
2. 标题：提取 h1/h2 标题
3. 元素列表：
   - 段落：纯文本内容
   - 列表：ul/ol 项目
   - 表格：markdown 表格数据 → 提取为 {header: [], rows: []}
   - 代码块：``` 包裹的代码 → 提取语言和代码内容
   - 图表数据：识别数值对比数据 → 提取为 {labels: [], values: []}
4. 设计建议：根据内容推荐布局方式（单栏/双栏/卡片等）

输出 JSON 格式。
```

**主 Agent 收集所有分析结果**

### 步骤 3：调用工具脚本生成样式代码（可选）

**对于表格：**
```python
from table_generator import generate_html_table

table_data = {'header': ['...', '...'], 'rows': [['...', '...']]}
table_html = generate_html_table(table_data, style='striped')
```

**对于图表：**
```python
from chart_generator import generate_chart_html

chart_data = {'labels': ['A', 'B'], 'datasets': [{'label': 'Values', 'data': [10, 20]}]}
chart_html = generate_chart_html(chart_data, chart_type='bar')
```

**这些脚本只返回样式代码片段，不完整幻灯片 HTML。**

### 步骤 4：主 Agent 和子 Agent 手动编写每个幻灯片 HTML

**为每个 chunk 调用子 Agent 编写幻灯片 HTML：**

**子 Agent Prompt：**
```
你是一个前端开发专家，负责编写单个幻灯片的 HTML。

输入信息：
- Chunk 标题：{title}
- 内容类型：{content_type}
- 元素：{elements}
- 表格 HTML（如有）：{table_html}
- 图表 HTML（如有）：{chart_html}
- 主题：{theme}
- 动画：{animation}

任务：编写这个幻灯片的完整 HTML 结构。

要求：
1. 根据内容类型选择合适的 slide 类：
   - cover → class="slide slide-cover"
   - content → class="slide"
   - end → class="slide slide-end"
2. 将元素转换为适当的 HTML：
   - 段落 → <p>...</p>
   - 列表 → <ul><li>...</li></ul>
   - 标题 → <h2>...</h2>, <h3>...</h3>
   - 代码块 → <pre><code>...</code></pre>
3. 插入表格/图表 HTML（如有）
4. 考虑布局：如果内容多，使用可滚动布局
5. 返回幻灯片 HTML 字符串（不含<!DOCTYPE>等外层结构）

输出：幻灯片 HTML 字符串
```

**主 Agent 收集所有幻灯片 HTML**

### 步骤 5：主 Agent 组装最终 HTML

**主 Agent 操作：**

1. 读取 `assets/single-file.html` 模板
2. 读取 `assets/themes.css` 获取主题样式
3. 读取 `assets/animations.css` 获取动画样式
4. 读取 `assets/presentation.js` 获取交互逻辑
5. 将所有幻灯片 HTML 插入 `{{SLIDES}}` 位置
6. 替换 `{{THEME}}`, `{{ANIMATION}}`, `{{TITLE}}` 等占位符
7. 写入最终输出文件

这是纯手动组装过程，**不调用任何脚本**。

### 步骤 6：展示结果

- 向用户展示生成的 HTML 文件路径
- 可选择在浏览器打开预览

---

## 子 Agent 使用指南

### 何时调用子 Agent

| 场景 | 是否调用子 Agent | 说明 |
|------|----------------|------|
| 主题生成初稿 | ✅ | 内容创作 |
| Markdown 格式审核 | ✅ | 格式检查 |
| 内容类型分析 | ✅ | 每个 chunk 一个 |
| **幻灯片 HTML 编写** | ✅ | **核心步骤，每个 slide 一个** |
| 与用户沟通 | ❌ | 主 Agent 负责 |
| 脚本调用 | ❌ | 主 Agent 直接调用 |
| 最终组装 | ❌ | 主 Agent 手动完成 |
| 结果展示 | ❌ | 主 Agent 负责 |

### 子 Agent 设计原则

1. **任务单一** - 每个子 Agent 只做一个具体任务
2. **上下文独立** - 只接收必要信息
3. **结果结构化** - 输出 JSON 或 HTML 字符串
4. **返回主 Agent** - 结果返回主 Agent 存储

---

## 上下文管理策略

1. **子 Agent 上下文独立** - 只接收当前任务所需信息
2. **主 Agent 存储中间结果** - chunk 列表、分析结果、HTML 片段
3. **及时清理** - 子 Agent 结束后释放上下文
4. **主 Agent 保持轻量** - 只保留流程控制所需状态

---

## 异常处理原则

| 异常情况 | 处理方式 |
|---------|---------|
| Markdown 格式错误 | **必须与用户沟通**，提供修复建议 |
| 分页符不正确 | **必须与用户沟通**，询问是否自动修复 |
| 标题层级混乱 | **必须与用户沟通**，展示问题位置 |
| 脚本执行失败 | 检查日志，**与用户沟通**后处理 |
| 子 Agent 返回格式错误 | 重新调用，明确输出格式要求 |

**核心原则：任何检测到的异常都必须与用户沟通确认后才能继续**
