---
name: docx-document-creator
description: 智能文档排版工具。核心功能：分析模板文档的格式（字体、字号、段落样式、页边距等），然后将目标文档的内容按照模板格式重新排版。支持一键套用模板、格式迁移、批量排版。
license: Apache-2.0
metadata:
  author: andrewlee
  version: "2.0"
  category: document-processing
compatibility: 需要 Python 3.8+ (python-docx), Node.js (docx-js 可选)
allowed-tools: Bash(python:*) Bash(node:*) Read Write Edit
---

# 智能文档排版工具

## 核心功能

**一键套用模板**：分析模板文档的格式规范，自动应用到目标文档。

```bash
# 基本用法：用模板格式化文档
uv run --with python-docx python3 scripts/apply_template.py 模板.docx 目标文档.docx 输出.docx
```

## 快速开始

### 场景 1：用模板排版论文

```bash
# 你有：
# - 期刊模板：template.docx（定义了字体、字号、段落样式等）
# - 你的论文：draft.docx（内容已写好，格式混乱）

# 运行：
uv run --with python-docx python3 scripts/apply_template.py template.docx draft.docx output.docx

# 输出：output.docx - 内容是你的，格式完全匹配模板
```

### 场景 2：分析模板格式

```bash
# 查看模板的具体格式参数
uv run --with python-docx python3 scripts/analyze_template.py 模板.docx
```

输出示例：
```
=== 模板格式分析 ===

页面设置:
  纸张：A4 (210mm × 297mm)
  页边距：上 37mm, 下 35mm, 左 28mm, 右 26mm

标题样式:
  主标题：方正小标宋，22pt，居中
  一级标题：黑体，16pt，"一、"
  二级标题：楷体，16pt，"（一）"

正文样式:
  字体：仿宋_GB2312
  字号：16pt (三号)
  首行缩进：2 字符
  行距：固定值 28pt

段落样式:
  段前距：0pt
  段后距：0pt
  对齐方式：两端对齐
```

### 场景 3：批量排版

```bash
# 用同一个模板排版多个文档
uv run --with python-docx python3 scripts/batch_apply.py 模板.docx docs/*.docx --output-dir formatted/
```

---

## 脚本工具

| 脚本 | 功能 | 命令 |
|------|------|------|
| `apply_template.py` | 核心：套用模板格式 | `apply_template.py 模板.docx 输入.docx 输出.docx` |
| `analyze_template.py` | 分析模板格式参数 | `analyze_template.py 模板.docx` |
| `batch_apply.py` | 批量应用模板 | `batch_apply.py 模板.docx *.docx` |
| `extract_style.py` | 提取样式为 JSON | `extract_style.py 模板.docx --output style.json` |
| `punctuation.py` | 智能标点修复 | `punctuation.py 输入.docx 输出.docx` |
| `analyzer.py` | 格式诊断 | `analyzer.py 文档.docx` |

---

## 工作原理

### apply_template.py 流程

```
1. 读取模板文档
   ↓
2. 提取所有样式（字体、段落、编号等）
   ↓
3. 读取目标文档
   ↓
4. 保留内容，替换样式
   ↓
5. 生成新文档（内容=目标，格式=模板）
```

### 样式提取范围

| 类别 | 提取项 |
|------|--------|
| 页面 | 纸张大小、页边距、分栏 |
| 字体 | 字体名、字号、粗体、斜体、颜色 |
| 段落 | 对齐、缩进、行距、段前段后距 |
| 编号 | 序号格式（一、1、(1) 等） |
| 表格 | 边框、底纹、单元格边距 |

---

## 使用示例

### 示例 1：学术论文排版

```bash
# 模板：某期刊的 Word 模板
# 目标：你的论文草稿

uv run --with python-docx python3 scripts/apply_template.py \
    templates/journal_template.docx \
    my_paper.docx \
    my_paper_formatted.docx
```

### 示例 2：公文排版

```bash
# 模板：GB/T 9704-2012 公文模板
# 目标：起草的通知

uv run --with python-docx python3 scripts/apply_template.py \
    templates/official_template.docx \
    draft_notice.docx \
    final_notice.docx
```

### 示例 3：提取模板样式复用

```bash
# 第一步：从模板提取样式
uv run --with python-docx python3 scripts/extract_style.py \
    journal_template.docx \
    --output journal_style.json

# 第二步：用样式文件排版（无需原模板）
uv run --with python-docx python3 scripts/apply_style.py \
    draft.docx \
    journal_style.json \
    output.docx
```

---

## 高级功能

### 选择性应用样式

```bash
# 只应用字体和段落，不改编号
uv run --with python-docx python3 scripts/apply_template.py \
    template.docx input.docx output.docx \
    --skip-numbering

# 只应用页面设置
uv run --with python-docx python3 scripts/apply_template.py \
    template.docx input.docx output.docx \
    --only-page-setup
```

### 保留特定格式

```bash
# 保留目标文档的粗体/斜体
uv run --with python-docx python3 scripts/apply_template.py \
    template.docx input.docx output.docx \
    --preserve-bold-italic

# 保留超链接
uv run --with python-docx python3 scripts/apply_template.py \
    template.docx input.docx output.docx \
    --preserve-links
```

### 分章节处理

```bash
# 长文档分章节应用不同样式
uv run --with python-docx python3 scripts/apply_template.py \
    template.docx input.docx output.docx \
    --chapter-style chapter_styles.json
```

chapter_styles.json:
```json
{
  "abstract": { "font": "黑体", "size": 12 },
  "body": { "font": "仿宋", "size": 16 },
  "references": { "font": "宋体", "size": 10 }
}
```

---

## 格式预设

内置常用模板样式，无需模板文件即可应用：

```bash
# 学术论文格式
uv run --with python-docx python3 scripts/apply_preset.py \
    input.docx output.docx --preset academic

# 公文格式（GB/T 9704-2012）
uv run --with python-docx python3 scripts/apply_preset.py \
    input.docx output.docx --preset official

# 双栏论文格式
uv run --with python-docx python3 scripts/apply_preset.py \
    input.docx output.docx --preset double_column
```

---

## 与 docx-js 集成

需要从头创建文档时，使用 docx-js：

```javascript
// create_with_template.js
const { Document, Packer } = require('docx');
const fs = require('fs');

// 从 JSON 样式创建文档
const style = JSON.parse(fs.readFileSync('template_style.json'));
const doc = new Document({
  styles: style.docxStyles,
  sections: [{ /* 内容 */ }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('output.docx', buf);
});
```

---

## 故障排查

### 问题：输出文档格式不对

**检查**：
```bash
# 1. 分析模板，确认样式被正确提取
uv run --with python-docx python3 scripts/analyze_template.py template.docx

# 2. 比较输入输出
uv run --with python-docx python3 scripts/compare_docs.py input.docx output.docx
```

### 问题：中文显示异常

**解决**：
- 确保系统安装了模板使用的中文字体
- 检查字体映射：`fonts/` 目录中的字体配置文件

### 问题：表格格式丢失

**解决**：
```bash
# 使用 --preserve-tables 选项
uv run --with python-docx python3 scripts/apply_template.py \
    template.docx input.docx output.docx \
    --preserve-tables
```

---

## 依赖

- python-docx (必需)
- docx (Node.js, 可选)

安装：
```bash
uv run --with python-docx python3 scripts/apply_template.py ...
```

---

## API 参考

### apply_template.py 选项

| 选项 | 说明 |
|------|------|
| `--skip-numbering` | 不应用编号样式 |
| `--only-page-setup` | 只应用页面设置 |
| `--preserve-bold-italic` | 保留粗体/斜体 |
| `--preserve-links` | 保留超链接 |
| `--preserve-tables` | 保留表格格式 |
| `--dry-run` | 预览变更，不生成文件 |

### analyze_template.py 输出

- 页面设置（纸张、边距）
- 字体样式（名称、大小、效果）
- 段落样式（缩进、行距、对齐）
- 编号样式（序号格式）
- 表格样式（边框、底纹）

---

## License

Apache-2.0
