---
name: document-format-skills
description: 文档格式处理工具。支持格式诊断、标点符号修复、格式统一。输入杂乱的文档，输出规范整洁的docx。
---

# 文档格式处理工具

处理文档格式问题：诊断格式错误、修复标点符号、统一文档样式。

## 功能概览

| 功能 | 说明 | 脚本 |
|------|------|------|
| 格式诊断 | 分析文档存在的格式问题 | `analyzer.py` |
| 标点修复 | 修复中英文标点混用 | `punctuation.py` |
| 格式统一 | 应用预设格式规范 | `formatter.py` |
| 表格自动调整 | 自动调整表格布局与对齐 | `formatter.py` |
| 页码规范 | 统一页码格式与位置 | `formatter.py` |
| Markdown 转 Word | 将.md 文件转换为.docx | `markdown_to_word.py` |

## 使用方法

### 格式诊断

分析文档存在的问题，输出诊断报告：

```bash
uv run --with python-docx python3 scripts/analyzer.py input.docx
```

输出示例：
```
=== 格式诊断报告 ===

【标点问题】共 5 处
  - 第2段: 英文括号 () 建议改为 （）
  - 第3段: 英文引号 "" 建议改为 ""

【序号问题】共 2 处
  - 序号格式不统一: 同时存在 "1、" 和 "1." 
  - 第5段: 层级跳跃，从 "一、" 直接到 "1."

【段落问题】共 3 处
  - 第2、4、7段: 缺少首行缩进
  - 行距不统一: 存在单倍、1.5倍混用

【字体问题】共 2 处
  - 正文字号不统一: 12pt、14pt 混用
  - 检测到 4 种字体混用
```

### 标点符号修复

```bash
# 智能模式（根据上下文判断）
uv run --with python-docx python3 scripts/punctuation.py input.docx output.docx

# 强制全部转中文标点
uv run --with python-docx python3 scripts/punctuation.py input.docx output.docx --mode chinese

# 强制全部转英文标点
uv run --with python-docx python3 scripts/punctuation.py input.docx output.docx --mode english

# 只修复特定类型
uv run --with python-docx python3 scripts/punctuation.py input.docx output.docx --fix brackets,quotes
```

### 格式统一

```bash
# 应用公文格式
uv run --with python-docx python3 scripts/formatter.py input.docx output.docx --preset official

# 应用学术论文格式
uv run --with python-docx python3 scripts/formatter.py input.docx output.docx --preset academic

# 应用法律文书格式
uv run --with python-docx python3 scripts/formatter.py input.docx output.docx --preset legal
```

### Markdown 转 Word

```bash
# 基本用法（输出到同名 .docx 文件）
uv run --with python-docx python3 scripts/markdown_to_word.py input.md

# 指定输出文件
uv run --with python-docx python3 scripts/markdown_to_word.py input.md output.docx

# 使用公文格式预设
uv run --with python-docx python3 scripts/markdown_to_word.py input.md output.docx --preset official

# 使用学术论文格式预设
uv run --with python-docx python3 scripts/markdown_to_word.py input.md output.docx --preset academic
```

#### 支持的 Markdown 语法

| 语法 | 示例 | 输出效果 |
|------|------|----------|
| 标题 | `# 标题 1` ~ `###### 标题 6` | 分级标题样式 |
| 加粗 | `**粗体**` 或 `__粗体__` | 加粗文本 |
| 斜体 | `*斜体*` 或 `_斜体_` | 斜体文本 |
| 删除线 | `~~删除线~~` | 带删除线的文本 |
| 行内代码 | `` `code` `` | 等宽字体显示 |
| 代码块 | ` ```language ` ... ` ``` ` | 带背景的代码块 |
| 无序列表 | `- 项目` 或 `* 项目` | 项目符号列表 |
| 有序列表 | `1. 项目` | 编号列表 |
| 引用块 | `> 引用内容` | 左侧带竖线的引用 |
| 链接 | `[文本](url)` | 蓝色下划线链接 |
| 表格 | `| 表头 | 表头 |` | 表格格式 |

### 组合使用

```bash
# 先诊断
uv run --with python-docx python3 scripts/analyzer.py messy.docx

# 修复标点 + 应用格式
uv run --with python-docx python3 scripts/punctuation.py messy.docx temp.docx
uv run --with python-docx python3 scripts/formatter.py temp.docx clean.docx --preset official

# Markdown 转 Word 后应用格式
uv run --with python-docx python3 scripts/markdown_to_word.py readme.md temp.docx
uv run --with python-docx python3 scripts/formatter.py temp.docx formatted.docx --preset official
```

---

## 标点符号处理规则

### 修复范围

| 类型 | 错误 | 正确（中文） | 正确（英文） |
|------|------|-------------|-------------|
| 括号 | 中英混用 | （） | () |
| 引号 | 直引号 "" | ""'' | "" '' |
| 冒号 | 中英混用 | ： | : |
| 逗号 | 中英混用 | ， | , |
| 句号 | 中英混用 | 。 | . |
| 分号 | 中英混用 | ； | ; |
| 问号 | 中英混用 | ？ | ? |
| 叹号 | 中英混用 | ！ | ! |
| 省略号 | ... | …… | ... |
| 破折号 | -- 或 — | —— | -- |

### 智能判断逻辑

1. **中文环境**：前后都是中文字符 → 用中文标点
2. **英文环境**：前后都是英文/数字 → 用英文标点
3. **混合环境**：默认用中文标点（可配置）

### 特殊处理

- 数字与单位之间：`100%` 保持英文
- 英文缩写：`e.g.` `i.e.` 保持英文句点
- 网址邮箱：保持原样不处理
- 代码块：跳过不处理

---

## 格式预设

### 公文格式（GB/T 9704-2012）

```
页面：A4，上边距37mm，下边距35mm，左边距28mm，右边距26mm
标题：方正小标宋简体，二号（22pt），居中
一级标题：黑体，三号（16pt），顶格，"一、"
二级标题：楷体_GB2312，三号（16pt），顶格，"（一）"
三级标题：仿宋_GB2312，三号（16pt），首行缩进，"1."
正文：仿宋_GB2312，三号（16pt），首行缩进2字符，行距固定值28pt
```

### 学术论文格式

```
页面：A4，边距25mm
标题：黑体，小二（18pt），居中
一级标题：黑体，小三（15pt），"1"
二级标题：黑体，四号（14pt），"1.1"
正文：宋体/Times New Roman，小四（12pt），首行缩进2字符，行距1.5倍
```

### 法律文书格式

```
页面：A4，上边距30mm，下边距25mm，左边距30mm，右边距25mm
标题：宋体加粗，二号（22pt），居中
条款标题：黑体，四号（14pt），"第一条"
正文：宋体，四号（14pt），首行缩进2字符，行距1.5倍
```

---

## 文件结构

```
document-format-skills/
├── SKILL.md
├── README.md
├── scripts/
│   ├── analyzer.py           # 格式诊断
│   ├── punctuation.py        # 标点修复
│   ├── formatter.py          # 格式统一
│   └── markdown_to_word.py   # Markdown 转 Word
└── presets/
    ├── official.yaml    # 公文格式
    ├── academic.yaml    # 学术论文
    └── legal.yaml       # 法律文书
```

---

## 依赖

- python-docx

使用 `uv run --with python-docx` 自动安装。

---

## 注意事项

1. **只支持 .docx**：不支持旧版 .doc 格式
2. **备份原文件**：修改前建议备份
3. **字体依赖**：输出文件需要系统安装对应字体才能正确显示
4. **表格内容**：会自动处理表格内的文字
