---
name: detailed-docx
description: >
  Comprehensive Python toolkit for fine-grained Microsoft Word (.docx) document manipulation.
  Use when the user needs to create, read, edit, or delete content in Word documents while
  preserving all existing formatting (fonts, colors, images, tables, headers/footers).
  Handles cross-run text replacement, incremental format overlay, merged-cell tables,
  multi-column layouts (dual/multi-column with column breaks), and structural document
  navigation. Powered by python-docx with XML-level safety mechanisms.
compatibility: Requires Python 3.8+ and python-docx>=1.1.0 (pip install python-docx)
metadata:
  author: andrewlee
  version: "1.0"
---

# detailed-docx 使用指南

> **⚠️ 重要提示（面向 AI Agent）：**
> 
> 使用本工具时，**不要去阅读 `my_docx/` 下的 Python 源代码**。源代码文件（`editor.py`、`run_ops.py`、`style_ops.py`、`traverser.py`）包含大量底层 XML 操作细节，读取它们会**严重消耗你的上下文窗口**，并且对正确使用本库毫无帮助。
>
> 你只需要读以下两个文档：
> 1. **本文件（SKILL.md）**：包含核心能力总览、工作流程和格式字典速查。
> 2. **[references/API_REFERENCE.md](references/API_REFERENCE.md)**：当你需要查看某个方法的具体参数和返回值时再读取。
>
> 读完本文件后你就可以直接编写调用代码了。大多数情况下不需要读 API_REFERENCE.md。

本库提供一个核心类 `DocxEditor`，支持对 Word 文档的所有精细操作。

## 安装依赖

```bash
pip install python-docx
# 仅在使用公式 API 时需要：
pip install latex2mathml mathml2omml
```

## 导入方式

```python
import sys
sys.path.insert(0, '/path/to/detailed-docx')  # 替换为实际路径
from my_docx import DocxEditor
```

## 核心能力总览

| 能力类别 | 代表方法 | 说明 |
|:---|:---|:---|
| **从零创建** | `create_new()`, `add_heading()`, `add_paragraph()`, `add_table()` | 创建空白文档并逐步添加内容 |
| **插入图片** | `add_picture()`, `add_picture_to_paragraph()`, `add_picture_to_table_cell()`, `count_pictures()` | 在文档/段落/表格单元格中插入图片，保留原有图片 |
| **插入公式** | `add_equation()`, `add_equation_to_paragraph()` | LaTeX → Word 原生公式（OMML），可在 Word 中继续编辑 |
| **结构化读取** | `get_structural_map()`, `get_table_data()`, `get_run_details()` | 将文档内容以 dict/list 形式输出 |
| **安全文本替换** | `replace_text()`, `replace_in_table()`, `replace_in_paragraph()` | 跨 Run 替换，自动保留原格式 |
| **增量格式修改** | `modify_format()`, `modify_paragraph_format()` | 仅叠加指定属性，不清除已有格式 |
| **表格操作** | `modify_table_cell_shading()`, `modify_table_cell_border()` | 设置单元格背景色、边框 |
| **三线表** | `apply_three_line_style()` | 一键将表格转为学术论文标准的三线表格式（booktabs） |
| **分栏布局** | `set_section_columns()`, `get_section_columns()`, `add_column_break()` | 设置双栏/多栏布局、分栏符、不等宽分栏 |
| **删除操作** | `delete_paragraph()`, `delete_table()`, `delete_table_row()`, `clear_table_cell()` | 安全删除，保留文档结构完整性 |

## 推荐工作流程

### 编辑已有文档

```python
editor = DocxEditor("input.docx")

# 1. 先读结构，了解文档布局
doc_map = editor.get_structural_map()
# 返回 {"paragraphs": [...], "tables": [...], "sections": [...]}

# 2. 定位目标（两种方式均可）
#    方式1：文本搜索
result = editor.replace_text("北京公司", "上海分公司")

#    方式2：坐标定位
result = editor.replace_in_table(table_idx=0, row_idx=1, col_idx=3, old="侗族", new="汉族")

# 3. 修改格式（增量叠加，不破坏已有格式）
editor.modify_format("重要条款", {"bold": True, "underline": True})

# 4. 保存
editor.save("output.docx")
```

### 从零创建文档

```python
editor = DocxEditor.create_new()
editor.add_heading("2025年度报告", level=1)
editor.add_paragraph("正文内容如下：", fmt={"size": 12, "name": "宋体"})
editor.add_table(3, 4, data=[["部门", "Q1", "Q2", "Q3"], ["销售", "100", "120", "150"]])
editor.save("new_report.docx")
```

### 插入图片

```python
editor = DocxEditor.create_new()
editor.add_heading("销售报表", level=1)
editor.add_paragraph("下图展示 Q1 趋势：")

# 文档末尾插入一张居中图片，宽度 4 英寸（高度按比例自适应）
editor.add_picture("chart.png", width=4, alignment="center")

# 已有段落末尾追加行内小图（图文混排），宽度用 Cm 指定
from docx.shared import Cm
editor.add_paragraph("评分：")
editor.add_picture_to_paragraph(2, "star.png", width=Cm(0.5))

# 在表格单元格中插入图片，先清空单元格内容
editor.add_table(2, 2, data=[["产品", "图示"], ["A", ""]])
editor.add_picture_to_table_cell(0, 1, 1, "product_a.png",
                                  width=1.5, alignment="center", clear_cell=True)

editor.save("report.docx")
```

`width` / `height` 接受：
- `float`：英寸（如 `width=4` = 4 英寸）
- `Inches(2)` / `Cm(5)` / `Pt(72)` / `Emu(...)`：python-docx Length 对象
- `None`：使用图片原始尺寸；只指定一边时，另一边按比例自动缩放

### 插入 LaTeX 公式

```python
editor = DocxEditor.create_new()
editor.add_heading("二次方程求根公式", level=2)

# 独立成段的居中公式
editor.add_equation(r"x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}", alignment="center")

# 行内公式（与文字同段）
editor.add_paragraph("由牛顿第二定律 ")
editor.add_equation_to_paragraph(1, r"F = ma")
editor.add_run_to_paragraph(1, " 可知...")

editor.save("math.docx")
```

转换链路：LaTeX → MathML（`latex2mathml`）→ OMML（`mathml2omml`）→ Word 段落。
生成的是 Word 原生公式 `<m:oMath>`，打开后可在 Word 公式编辑器里继续修改。

**渲染失败时**：方法本身**不抛异常**，会在该位置写入文本 `[渲染失败] {原始 LaTeX}`，
返回值 `{"rendered": False, "error": "..."}` 便于调用方判断和补救。

### 分栏布局（双栏 / 多栏）

```python
editor = DocxEditor.create_new()
editor.add_heading("双栏报告", level=1)

# 1. 设置第一节为双栏，栏间距 1.27cm，带分隔线
editor.set_section_columns(0, num=2, space_cm=1.27, separator=True)

# 2. 写入左栏内容
editor.add_paragraph("这是左栏的正文内容。")
editor.add_table(2, 2, data=[["指标", "值"], ["销售额", "100万"]])

# 3. 插入分栏符 → 后续内容强制从右栏开始
editor.add_column_break()

# 4. 写入右栏内容
editor.add_paragraph("这是右栏的正文内容。")
editor.add_picture("chart.png", width=3)

editor.save("two_column_report.docx")
```

不等宽分栏：

```python
# 左栏 10cm、右栏 6cm，栏间距 1cm
editor.set_section_columns(0, num=2, equal_width=False,
                           col_widths_cm=[10, 6], space_cm=1.0)
```

读取已有文档的分栏设置：

```python
editor = DocxEditor("existing.docx")
info = editor.get_section_columns(0)
# {'num': 2, 'space': 1.27, 'equal_width': True, 'separator': True, 'details': []}
```

### 三线表（学术论文标准表格）

```python
editor = DocxEditor("paper.docx")

# 一键转换：清除所有边框，只保留顶线、栏目线、底线
editor.apply_three_line_style(0)  # 第1个表格，默认1行表头

# 双行表头的三线表
editor.apply_three_line_style(1, header_rows=2)

# 自定义线条粗细
editor.apply_three_line_style(2, top_border_pt=2.0, mid_border_pt=1.0, bottom_border_pt=2.0)

editor.save("paper_styled.docx")
```

> **⚠️ 论文编排提示**：中文学术论文的表格**必须使用三线表**。当你判断用户正在编排论文或学术文档时，所有新建和已有表格都应调用 `apply_three_line_style()` 转换为三线表。

### 删除内容

```python
editor = DocxEditor("input.docx")
editor.delete_paragraph(3)           # 删除第4段
editor.delete_table_row(0, 2)        # 删除第1个表格的第3行
editor.clear_table_cell(0, 1, 2)     # 清空单元格文本（保留格式）
editor.save("cleaned.docx")
```

## 格式字典 (format_spec)

所有格式相关的 API 都接受统一的 dict 格式：

```python
{
    "bold": True,           # 粗体
    "italic": True,         # 斜体
    "underline": True,      # 下划线
    "strike": True,         # 删除线
    "name": "黑体",          # 字体名
    "size": 14,             # 字号 (pt)
    "color": "FF0000",      # 字体颜色 (hex)
    "all_caps": True,       # 全大写
    "superscript": True,    # 上标
    "subscript": True,      # 下标
}
```

段落格式：

```python
{
    "alignment": "center",       # left/center/right/justify
    "space_before": 12,          # 段前距 (pt)
    "space_after": 6,            # 段后距 (pt)
    "line_spacing": 1.5,         # 行距倍数
    "first_line_indent": 0.5,    # 首行缩进 (inches)
}
```

## Gotchas（必读注意事项）

- **永远不要直接设置 `paragraph.text = "..."`**，这会摧毁所有 Run 格式。请使用 `replace_text()`。
- **合并单元格的表格**：`replace_in_table` 已内置 XML 级别的回退机制，能够安全处理含 gridSpan/vMerge 的复杂合并表格。
- **图片安全**：含 `<w:drawing>` 的 Run 会被自动跳过，替换操作不会破坏文档中的图片。
- **删除后索引前移**：调用 `delete_paragraph()` 或 `delete_table_row()` 后，后续元素的索引会减少。如需连续删除多项，请**从后往前删除**。
- **create_new() 必须指定保存路径**：`editor.save()` 会报错，必须 `editor.save("output.docx")`。
- **分栏布局的本质限制**：Word 分栏是节级别的排版属性，内容在 XML 中仍是线性序列。`add_column_break()` 通过分栏符控制内容断开点，但无法精确保证某段内容一定出现在某一栏——最终由 Word 排版引擎决定。使用 `add_column_break()` 是最可靠的栏位控制手段。
- **学术论文必须使用三线表**：当用户的文档是论文/学术稿件时，所有表格都应使用 `apply_three_line_style()` 转为三线表。这是中文学术论文的强制排版规范。

## 详细 API 参考

完整的方法签名和参数说明见 [references/API_REFERENCE.md](references/API_REFERENCE.md)。
