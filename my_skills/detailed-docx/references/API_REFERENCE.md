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

## 保存

### `save(output_path=None) -> str`

保存文档。传 `output_path` 则另存为，否则覆盖原文件。`create_new()` 创建的文档必须传 `output_path`。

**返回:** 保存路径字符串。
