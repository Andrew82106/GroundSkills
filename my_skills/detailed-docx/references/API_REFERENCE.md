# detailed-docx API Reference

完整的 `DocxEditor` 方法签名说明。所有方法的返回值均为 Python 原生 dict，便于代码和 Agent 解析。

---

## 初始化

### `DocxEditor(file_path: str)`

加载已有的 .docx 文件。

```python
editor = DocxEditor("report.docx")
```

### `DocxEditor.create_new(template_path: str = None) -> DocxEditor`

创建空白文档。可选传入 .docx 模板路径。

```python
editor = DocxEditor.create_new()                        # 空白文档
editor = DocxEditor.create_new("template.docx")         # 基于模板
```

---

## 读取类 API

### `get_structural_map() -> dict`

返回文档的完整结构：段落列表、表格列表、节信息。

**返回结构:**

```python
{
    "paragraphs": [
        {"index": 0, "style": "Heading 1", "text": "...", "alignment": "left"},
        ...
    ],
    "tables": [
        {"index": 0, "rows": 3, "cols": 4, "preview": [["A", "B", ...], ...]},
        ...
    ],
    "sections": [
        {"index": 0, "has_header": True, "has_footer": False,
         "header_text": "...", "footer_text": ""},
        ...
    ]
}
```

### `get_paragraphs(scope: str = 'body') -> list[dict]`

获取段落详细信息，包含 Run 级别格式。

**scope 选项:** `'body'`, `'all'`, `'tables'`, `'headers'`, `'footers'`

**返回每个元素:**

```python
{
    "location": {"container": "body", "para_idx": 0},
    "text": "段落文本",
    "style": "Normal",
    "paragraph_format": {"alignment": "left", "space_after": 6.0, ...},
    "runs": [
        {"text": "文本片段", "format": {"bold": True, "color": "FF0000", ...}},
        ...
    ]
}
```

### `get_table_data(table_idx: int) -> dict`

获取表格完整数据（含格式）。

**返回:**

```python
{
    "rows": 3, "cols": 4,
    "cells": [
        [  # row 0
            {"text": "...", "shading": "FFFFFF", "paragraphs": [...]},
            ...
        ],
        ...
    ]
}
```

### `get_table_cell_text(table_idx, row_idx, col_idx) -> str`

获取指定单元格文本。支持合并单元格。

### `get_run_details(para_idx: int) -> list[dict]`

获取指定正文段落的 Run 碎片详情（调试格式问题必备）。

**返回:**

```python
[
    {"run_index": 0, "text": "...", "is_text_run": True,
     "format": {"bold": True, "name": "黑体", "size": 12.0, "color": "00518A"}},
    ...
]
```

---

## 文本替换 API（自动保留格式）

### `replace_text(old, new, scope='all', count=0, use_regex=False) -> dict`

全局替换文本。自动处理跨 Run 碎片，保留第一个命中 Run 的格式。

- `scope`: `'all'` | `'body'` | `'tables'` | `'headers'` | `'footers'`
- `count`: 最多替换次数，0=全部
- `use_regex`: True 则 old 视为正则表达式

**返回:** `{"replaced_count": 3, "scope": "all"}`

### `replace_in_paragraph(para_idx, old, new, count=0, use_regex=False) -> dict`

在指定正文段落内替换。

**返回:** `{"replaced_count": 1, "para_idx": 5}`

### `replace_in_table(table_idx, row_idx, col_idx, old, new, count=0, use_regex=False) -> dict`

在指定表格单元格内替换。支持合并单元格（有 XML 回退机制）。

**返回:** `{"replaced_count": 1, "table_idx": 0, "row_idx": 1, "col_idx": 3}`

---

## 格式修改 API（增量叠加 — 方案 A）

### `modify_format(target_text, fmt, scope='all', count=0, use_regex=False) -> dict`

查找文本并对命中区间做增量格式叠加。**不清除已有格式**，仅写入 fmt 中指定的属性。

```python
# "很" 原来是红色粗体 → 变成红色粗体+下划线
editor.modify_format("我很开心", {"underline": True})
```

**返回:** `{"modified_count": 1, "scope": "all"}`

### `modify_paragraph_format(para_idx, fmt) -> dict`

修改段落级格式（对齐、缩进、行距等）。

```python
editor.modify_paragraph_format(0, {"alignment": "center", "space_before": 12})
```

**返回:** `{"success": True, "para_idx": 0}`

### `modify_table_cell_shading(table_idx, row_idx, col_idx, hex_color) -> dict`

设置单元格背景色。

**返回:** `{"success": True, ...}`

### `modify_table_cell_border(table_idx, row_idx, col_idx, **edges) -> dict`

设置单元格边框。

```python
editor.modify_table_cell_border(0, 0, 0,
    top={"sz": "12", "val": "single", "color": "000000"},
    bottom={"sz": "12", "val": "single", "color": "FF0000"})
```

---

## 创建类 API（从零构建）

### `add_heading(text, level=1) -> dict`

添加标题段落。level=0 为 Title，1-9 为 Heading 级别。

**返回:** `{"success": True, "para_idx": N}`

### `add_paragraph(text='', style=None, fmt=None) -> dict`

添加正文段落。可选 style（如 `'List Bullet'`）和 fmt（字体格式字典）。

**返回:** `{"success": True, "para_idx": N}`

### `add_run_to_paragraph(para_idx, text, fmt=None) -> dict`

在已有段落末尾追加一个 Run（可设独立格式），用于单段落内多格式混排。

```python
editor.add_paragraph("我觉得")
editor.add_run_to_paragraph(0, "非常好", {"bold": True, "color": "FF0000"})
# 结果：一个段落内 "我觉得" + 红色粗体 "非常好"
```

**返回:** `{"success": True, "para_idx": N, "run_idx": M}`

### `add_table(rows, cols, data=None, style=None) -> dict`

添加表格，可选填充数据和样式。

```python
editor.add_table(3, 4, data=[["姓名", "年龄"], ["张三", "25"]], style="Table Grid")
```

**返回:** `{"success": True, "table_idx": N}`

---

## 图片 API

支持的 `width` / `height` 参数类型：
- `float`：解释为**英寸**（如 `width=2` = 2 英寸）
- python-docx `Length` 对象：`Inches(2)`、`Cm(5)`、`Pt(72)`、`Emu(...)`
- `None`：使用图片原始尺寸；只指定一边时，另一边按比例自动缩放

支持的 `alignment` 取值：`'left'` | `'center'` | `'right'` | `'justify'` | `'distribute'`。

### `add_picture(image_path, width=None, height=None, alignment=None) -> dict`

在文档末尾插入一张图片（生成新段落）。支持 PNG / JPG / GIF / BMP / TIFF。

```python
editor.add_picture("chart.png", width=4, alignment="center")
```

**返回:** `{"success": True, "para_idx": N, "image_path": "..."}`

### `add_picture_to_paragraph(para_idx, image_path, width=None, height=None) -> dict`

在已有段落末尾追加图片（作为新 Run），用于图文混排。

```python
from docx.shared import Cm
editor.add_paragraph("评分：")
editor.add_picture_to_paragraph(0, "star.png", width=Cm(0.5))
```

**返回:** `{"success": True, "para_idx": N, "run_idx": M, "image_path": "..."}`

### `add_picture_to_table_cell(table_idx, row_idx, col_idx, image_path, width=None, height=None, alignment=None, clear_cell=False) -> dict`

在表格单元格中插入图片。`clear_cell=True` 会先删除单元格内已有段落（包括文字）；`False` 则在原内容后追加。支持合并单元格（自动 XML 回退）。

```python
editor.add_picture_to_table_cell(0, 1, 1, "product.png",
                                  width=1.5, alignment="center", clear_cell=True)
```

**返回:** `{"success": True, "table_idx": N, "row_idx": M, "col_idx": K, "image_path": "..."}`

### `count_pictures() -> dict`

统计文档中内联图片（inline shapes）的数量。

**返回:** `{"count": N}`

---

## 公式 API（LaTeX → OMML）

依赖（按优先级）：
- **首选** `pandoc`（命令行）：覆盖最全，对 `\rightarrow` / `\propto` / `\mathbf{}` / `\frac{}{}` 等所有常用 LaTeX 命令稳定可靠
- **后备** `pip install latex2mathml mathml2omml`：无 pandoc 时自动启用，部分命令覆盖有限

转换链路 LaTeX → OMML，最终生成 Word 原生公式 `<m:oMath>`（行内）或 `<m:oMathPara>`（独立成段），可在 Word 公式编辑器中继续编辑。

**返回值中的 `engine` 字段**指明实际使用的转换路径：`'pandoc'` / `'latex2mathml'`。

**渲染失败行为**：方法**不抛异常**，会在公式位置写入文本 `[渲染失败] {原始 LaTeX}`（剥除控制字符），并在返回值中带上 `rendered=False` 与 `error` 字段。

> ⚠️ **LaTeX 字符串请使用 raw string**：`r"\alpha"` 才能保留反斜杠；`"\alpha"` 在 Python 解析阶段就被破坏（`\a` 是响铃 0x07，`\r` 是回车）。

### `add_equation(latex, alignment=None) -> dict`

在文档末尾插入公式（生成新段落）。

```python
editor.add_equation(r"x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}", alignment="center")
```

**返回（成功）：** `{"success": True, "para_idx": N, "rendered": True}`
**返回（失败）：** `{"success": True, "para_idx": N, "rendered": False, "error": "..."}`

### `add_equation_to_paragraph(para_idx, latex) -> dict`

在已有段落末尾追加行内公式（与文字同段）。

```python
editor.add_paragraph("由 ")
editor.add_equation_to_paragraph(0, r"F = ma")
editor.add_run_to_paragraph(0, " 可知...")
```

**返回:** 同 `add_equation`，无 `alignment`。

### `add_equation_to_table_cell(table_idx, row_idx, col_idx, latex, clear_cell=True, alignment='center') -> dict`

在已存在的表格单元格中插入公式（用于自定义复杂排版）。

```python
editor.add_equation_to_table_cell(0, 1, 2, r"\alpha_{ij} = 0.7",
                                   clear_cell=True, alignment='center')
```

参数：
- `clear_cell`：是否先清空目标单元格已有段落，默认 `True`
- `alignment`：单元格内段落对齐，默认 `'center'`

**返回:** `{"success": True, "table_idx": N, "row_idx": M, "col_idx": K, "rendered": bool}`

### `add_equation_with_number(latex, number, eq_col_ratio=0.75, total_width_cm=6.95) -> dict`

**论文级编号公式排版的一键 API**：底层创建无边框透明 1×2 表格，左格放公式（居中、垂直居中），右格放编号（右对齐、垂直居中、`<w:noWrap/>` 防换行）。

```python
editor.add_equation_with_number(r"P_{chain}(N_j) = P(N_i)\cdot \mathbf{M}_{ij}", "（5）")
```

参数：
- `latex`：公式 LaTeX 源
- `number`：编号文本，例如 `"(5)"` 或 `"（5）"`
- `eq_col_ratio`：公式列宽占比（0~1），默认 0.75
- `total_width_cm`：表格总宽（厘米）。**双栏论文每栏约 6.95cm（默认）**；单栏全宽通常 16cm 左右。**双栏论文中切勿用单栏全宽，否则公式被挤出可视区**。

**返回:** `{"success": True, "table_idx": N, "rendered": bool}`

---

## 分栏（Multi-column）API

### `get_section_columns(section_idx: int = 0) -> dict`

获取指定节的分栏设置。

```python
info = editor.get_section_columns(0)
```

**返回:**

```python
{
    "num": 2,              # 栏数
    "space": 1.27,         # 栏间距（厘米），仅 equal_width 时有效
    "equal_width": True,   # 是否等宽分栏
    "separator": False,    # 栏间是否有分隔线
    "details": [           # 仅 equal_width=False 时有内容
        {"width_cm": 7.5, "space_cm": 1.27},
        {"width_cm": 7.5, "space_cm": 0},
    ]
}
```

### `set_section_columns(section_idx=0, num=2, space_cm=1.27, equal_width=True, separator=False, col_widths_cm=None) -> dict`

设置指定节的分栏布局。

- `section_idx`: 节索引（从 0 开始）
- `num`: 栏数（1=单栏, 2=双栏, 3=三栏, ...）
- `space_cm`: 栏间距（厘米），仅 `equal_width=True` 时生效
- `equal_width`: 是否等宽分栏。设 `False` 时必须通过 `col_widths_cm` 指定每栏宽度
- `separator`: 是否在栏间显示分隔线
- `col_widths_cm`: 不等宽分栏时各栏宽度列表（厘米），长度必须 == `num`

```python
# 等宽双栏
editor.set_section_columns(0, num=2, space_cm=1.27, separator=True)

# 不等宽双栏
editor.set_section_columns(0, num=2, equal_width=False,
                           col_widths_cm=[10, 6], space_cm=1.0)

# 改回单栏
editor.set_section_columns(0, num=1)
```

**返回:** `{"success": True, "section_idx": 0, "num": 2}`

### `add_column_break(para_idx: int = None) -> dict`

插入分栏符（Column Break），强制后续内容转入下一栏。

- `para_idx`: 在哪个段落**之前**插入分栏符。`None` = 在文档末尾追加一个含分栏符的新段落。

```python
editor.add_paragraph("左栏最后一段")
editor.add_column_break()           # 后续内容从右栏开始
editor.add_paragraph("右栏第一段")
```

**返回:** `{"success": True, "para_idx": N}`

---

## 删除类 API

### `delete_paragraph(para_idx) -> dict`

删除正文中的指定段落。⚠️ 删除后后续索引前移。

**返回:** `{"success": True, "deleted_text": "被删除的文本"}`

### `delete_table(table_idx) -> dict`

删除整个表格。

**返回:** `{"success": True, "table_idx": N}`

### `delete_table_row(table_idx, row_idx) -> dict`

删除表格中的指定行。

**返回:** `{"success": True, "table_idx": N, "row_idx": M}`

### `clear_table_cell(table_idx, row_idx, col_idx) -> dict`

清空单元格文本（保留单元格结构和格式属性）。

**返回:** `{"success": True, "cleared_text": "原内容", ...}`

---

## 三线表 API

### `apply_three_line_style(table_idx, header_rows=1, top_border_pt=1.5, mid_border_pt=0.75, bottom_border_pt=1.5, color='000000') -> dict`

将表格转换为三线表（booktabs）样式 —— 学术论文的标准表格格式。

- `table_idx`: 表格索引
- `header_rows`: 表头行数（默认1），栏目线在第 header_rows 行之后
- `top_border_pt`: 顶线粗细（磅值），默认 1.5
- `mid_border_pt`: 栏目线粗细（磅值），默认 0.75
- `bottom_border_pt`: 底线粗细（磅值），默认 1.5
- `color`: 线条颜色（hex），默认 `'000000'`

```python
# 单行表头
editor.apply_three_line_style(0)

# 双行表头
editor.apply_three_line_style(1, header_rows=2)
```

**返回:** `{"success": True, "table_idx": N, "header_rows": M}`

---

## 保存

### `save(output_path=None) -> str`

保存文档。传 `output_path` 则另存为，否则覆盖原文件。`create_new()` 创建的文档必须传 `output_path`。

**返回:** 保存路径字符串。
