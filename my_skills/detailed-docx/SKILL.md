---
name: detailed-docx
description: >
  Comprehensive Python toolkit for fine-grained Microsoft Word (.docx) document manipulation.
  Use when the user needs to create, read, edit, or delete content in Word documents while
  preserving all existing formatting (fonts, colors, images, tables, headers/footers).
  Handles cross-run text replacement, incremental format overlay, merged-cell tables,
  and structural document navigation. Powered by python-docx with XML-level safety mechanisms.
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
| **结构化读取** | `get_structural_map()`, `get_table_data()`, `get_run_details()` | 将文档内容以 dict/list 形式输出 |
| **安全文本替换** | `replace_text()`, `replace_in_table()`, `replace_in_paragraph()` | 跨 Run 替换，自动保留原格式 |
| **增量格式修改** | `modify_format()`, `modify_paragraph_format()` | 仅叠加指定属性，不清除已有格式 |
| **表格操作** | `modify_table_cell_shading()`, `modify_table_cell_border()` | 设置单元格背景色、边框 |
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

## 详细 API 参考

完整的方法签名和参数说明见 [references/API_REFERENCE.md](references/API_REFERENCE.md)。
