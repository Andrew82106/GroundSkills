"""
editor.py
---------
DocxEditor — 面向用户和 AI Agent 的核心 API 类。

整合 traverser、run_ops、style_ops 三个模块的能力，
对外暴露直观的文档读取与修改接口。

设计原则：
  - 所有读取方法返回 Python 原生 dict/list，便于 Agent 解析和代码处理。
  - 所有修改方法返回操作结果摘要（替换了多少处等），便于 Agent 做下一步决策。
  - 增量格式修改（方案 A）：仅叠加指定属性，不清除原有格式。
"""

from typing import Dict, Any, List, Optional, Union

from docx import Document
from docx.text.paragraph import Paragraph
from docx.table import Table
from docx.shared import Pt, Inches, RGBColor
from docx.oxml.ns import qn

from .traverser import DocumentTraverser, LocatedParagraph
from .run_ops import replace_text_in_paragraph, apply_format_to_paragraph_text, _build_run_map, _is_text_run
from .style_ops import (
    read_font, write_font, read_run,
    read_paragraph_format, write_paragraph_format,
    read_cell_shading, set_cell_shading, set_cell_border,
)


class DocxEditor:
    """
    Word 文档精细编辑器。

    支持三大类操作：
      1. 从零创建：创建新文档、添加段落/标题/表格
      2. 编辑修改：替换文本（保留格式）、增量修改格式、修改表格
      3. 删除操作：删除段落、表格、表格行、清空单元格

    用法（编辑已有文档）：
        >>> editor = DocxEditor("input.docx")
        >>> editor.get_structural_map()
        >>> editor.replace_text("旧词", "新词")
        >>> editor.save("output.docx")

    用法（从零创建文档）：
        >>> editor = DocxEditor.create_new()
        >>> editor.add_heading("标题", level=1)
        >>> editor.add_paragraph("正文内容", fmt={"size": 12})
        >>> editor.add_table(3, 4, data=[["A", "B", "C", "D"], ...])
        >>> editor.save("new_doc.docx")
    """

    def __init__(self, file_path: str):
        """
        加载一个已有的 .docx 文件。

        Args:
            file_path: .docx 文件路径
        """
        self._path = file_path
        self._doc = Document(file_path)
        self._traverser = DocumentTraverser(self._doc)

    @classmethod
    def create_new(cls, template_path: Optional[str] = None) -> 'DocxEditor':
        """
        创建一个新的空白文档（或基于模板创建）。

        Args:
            template_path: 可选的模板文件路径。None = 使用 python-docx 默认空白模板。

        Returns:
            DocxEditor 实例（未关联文件路径，save 时必须指定 output_path）
        """
        instance = object.__new__(cls)
        instance._path = None
        if template_path:
            instance._doc = Document(template_path)
        else:
            instance._doc = Document()
        instance._traverser = DocumentTraverser(instance._doc)
        return instance

    # ═══════════════════════════════════════════════
    #  读取类 API
    # ═══════════════════════════════════════════════

    def get_structural_map(self) -> Dict[str, Any]:
        """
        返回文档的完整结构地图（JSON 友好的 dict）。

        返回：
        {
            "paragraphs": [
                {"index": 0, "style": "Heading 1", "text": "第一章 概述", "alignment": "left"},
                {"index": 1, "style": "Normal", "text": "这是正文内容...", "alignment": null},
                ...
            ],
            "tables": [
                {
                    "index": 0, "rows": 3, "cols": 4,
                    "preview": [["姓名", "年龄", ...], ["张三", "25", ...], ...]
                },
                ...
            ],
            "sections": [
                {"index": 0, "has_header": True, "has_footer": True,
                 "header_text": "公司名称", "footer_text": "第1页"},
                ...
            ]
        }
        """
        result: Dict[str, Any] = {}

        # 段落
        paras = []
        for idx, para in enumerate(self._doc.paragraphs):
            paras.append({
                'index': idx,
                'style': para.style.name if para.style else None,
                'text': para.text,
                'alignment': self._alignment_str(para.alignment),
            })
        result['paragraphs'] = paras

        # 表格
        tables = []
        for t_idx, table in enumerate(self._doc.tables):
            rows = len(table.rows)
            cols = len(table.columns)
            preview = []
            for row in table.rows:
                preview.append([cell.text for cell in row.cells])
            tables.append({
                'index': t_idx,
                'rows': rows,
                'cols': cols,
                'preview': preview,
            })
        result['tables'] = tables

        # 节（Sections）
        sections = []
        for s_idx, section in enumerate(self._doc.sections):
            header = section.header
            footer = section.footer
            sections.append({
                'index': s_idx,
                'has_header': not header.is_linked_to_previous,
                'has_footer': not footer.is_linked_to_previous,
                'header_text': '\n'.join(p.text for p in header.paragraphs) if not header.is_linked_to_previous else '',
                'footer_text': '\n'.join(p.text for p in footer.paragraphs) if not footer.is_linked_to_previous else '',
            })
        result['sections'] = sections

        return result

    def get_paragraphs(self, scope: str = 'body') -> List[Dict[str, Any]]:
        """
        获取段落的详细信息列表。

        Args:
            scope: 'body' | 'all' | 'tables' | 'headers' | 'footers'

        Returns:
            列表，每个元素：
            {
                "location": {...},
                "text": "段落文本",
                "style": "Normal",
                "paragraph_format": {...},
                "runs": [{"text": "...", "format": {...}}, ...]
            }
        """
        result = []
        for lp in self._traverser.iter_all(scope):
            para = lp.paragraph
            runs_info = []
            for run in para.runs:
                runs_info.append(read_run(run))

            result.append({
                'location': lp.location.to_dict(),
                'text': para.text,
                'style': para.style.name if para.style else None,
                'paragraph_format': read_paragraph_format(para),
                'runs': runs_info,
            })
        return result

    def get_table_data(self, table_idx: int) -> Dict[str, Any]:
        """
        获取指定表格的完整数据（含每个单元格的文本和格式）。

        Args:
            table_idx: 表格索引（从 0 开始）

        Returns:
            {
                "rows": 3,
                "cols": 4,
                "cells": [
                    [  // row 0
                        {"text": "...", "shading": "FFFFFF", "paragraphs": [...]},
                        ...
                    ],
                    ...
                ]
            }
        """
        tables = self._doc.tables
        if table_idx >= len(tables):
            raise IndexError(f"表格索引 {table_idx} 超出范围，文档中共有 {len(tables)} 个表格")

        table = tables[table_idx]
        cells_data = []
        for r_idx, row in enumerate(table.rows):
            row_data = []
            for c_idx, cell in enumerate(row.cells):
                paras_info = []
                for para in cell.paragraphs:
                    paras_info.append({
                        'text': para.text,
                        'paragraph_format': read_paragraph_format(para),
                        'runs': [read_run(run) for run in para.runs],
                    })
                row_data.append({
                    'text': cell.text,
                    'shading': read_cell_shading(cell),
                    'paragraphs': paras_info,
                })
            cells_data.append(row_data)

        return {
            'rows': len(table.rows),
            'cols': len(table.columns),
            'cells': cells_data,
        }

    def get_table_cell_text(self, table_idx: int, row_idx: int, col_idx: int) -> str:
        """获取指定表格单元格的文本。"""
        return self._get_cell(table_idx, row_idx, col_idx).text

    def get_run_details(self, para_idx: int) -> List[Dict[str, Any]]:
        """
        获取正文中第 para_idx 段的 Run 级别详细信息。
        对调试格式问题非常有用：可以看清楚每个 Run 的文本碎片和精确格式。
        """
        paras = self._doc.paragraphs
        if para_idx >= len(paras):
            raise IndexError(f"段落索引 {para_idx} 超出范围，正文共 {len(paras)} 段")
        para = paras[para_idx]
        details = []
        for r_idx, run in enumerate(para.runs):
            details.append({
                'run_index': r_idx,
                'text': run.text,
                'is_text_run': _is_text_run(run),
                'format': read_font(run.font),
            })
        return details

    # ═══════════════════════════════════════════════
    #  文本替换 API
    # ═══════════════════════════════════════════════

    def replace_text(
        self,
        old: str,
        new: str,
        scope: str = 'all',
        count: int = 0,
        use_regex: bool = False,
    ) -> Dict[str, Any]:
        """
        全局替换文本，自动保留第一个命中 Run 的格式。

        Args:
            old: 旧文本（或正则表达式）
            new: 替换后的文本
            scope: 搜索范围 'all' | 'body' | 'tables' | 'headers' | 'footers'
            count: 最多替换次数，0 = 全部
            use_regex: 是否将 old 作为正则表达式

        Returns:
            {"replaced_count": 5, "scope": "all"}
        """
        total = 0
        remaining = count
        for lp in self._traverser.iter_all(scope):
            per_para_count = remaining if remaining > 0 else 0
            n = replace_text_in_paragraph(lp.paragraph, old, new, count=per_para_count, use_regex=use_regex)
            total += n
            if count > 0:
                remaining -= n
                if remaining <= 0:
                    break
        return {'replaced_count': total, 'scope': scope}

    def replace_in_paragraph(
        self,
        para_idx: int,
        old: str,
        new: str,
        count: int = 0,
        use_regex: bool = False,
    ) -> Dict[str, Any]:
        """
        替换正文中指定段落内的文本。

        Args:
            para_idx: 段落索引
            old, new, count, use_regex: 同 replace_text

        Returns:
            {"replaced_count": N, "para_idx": para_idx}
        """
        paras = self._doc.paragraphs
        if para_idx >= len(paras):
            raise IndexError(f"段落索引 {para_idx} 超出范围，正文共 {len(paras)} 段")
        n = replace_text_in_paragraph(paras[para_idx], old, new, count=count, use_regex=use_regex)
        return {'replaced_count': n, 'para_idx': para_idx}

    def replace_in_table(
        self,
        table_idx: int,
        row_idx: int,
        col_idx: int,
        old: str,
        new: str,
        count: int = 0,
        use_regex: bool = False,
    ) -> Dict[str, Any]:
        """
        替换指定表格单元格内的文本。

        Returns:
            {"replaced_count": N, "table_idx": ..., "row_idx": ..., "col_idx": ...}
        """
        cell = self._get_cell(table_idx, row_idx, col_idx)
        total = 0
        for para in cell.paragraphs:
            n = replace_text_in_paragraph(para, old, new, count=count, use_regex=use_regex)
            total += n
            if count > 0:
                count -= n
                if count <= 0:
                    break
        return {
            'replaced_count': total,
            'table_idx': table_idx, 'row_idx': row_idx, 'col_idx': col_idx,
        }

    # ═══════════════════════════════════════════════
    #  格式修改 API（增量式叠加 - 方案 A）
    # ═══════════════════════════════════════════════

    def modify_format(
        self,
        target_text: str,
        fmt: Dict[str, Any],
        scope: str = 'all',
        count: int = 0,
        use_regex: bool = False,
    ) -> Dict[str, Any]:
        """
        查找 target_text，对命中的文本区间做增量格式叠加。

        不会清除文本上已有的其他格式属性，仅写入 fmt 中指定的属性。

        示例：
            # 原文 "项目非常成功" 中 "非常" 是红色粗体
            editor.modify_format("项目非常成功", {"underline": True})
            # 结果："非常" 变成 红色+粗体+下划线，其余字变成 下划线

        Args:
            target_text: 要查找的文本或 regex
            fmt: 格式字典，如 {'bold': True, 'color': 'FF0000', 'size': 14}
            scope: 搜索范围
            count: 最多处理几处
            use_regex: 是否正则

        Returns:
            {"modified_count": 3, "scope": "all"}
        """
        total = 0
        remaining = count
        for lp in self._traverser.iter_all(scope):
            per_para_count = remaining if remaining > 0 else 0
            n = apply_format_to_paragraph_text(
                lp.paragraph, target_text, fmt,
                count=per_para_count, use_regex=use_regex,
            )
            total += n
            if count > 0:
                remaining -= n
                if remaining <= 0:
                    break
        return {'modified_count': total, 'scope': scope}

    def modify_paragraph_format(
        self,
        para_idx: int,
        fmt: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        修改正文中第 para_idx 段的段落级格式（对齐、缩进、行距等）。

        Args:
            para_idx: 段落索引
            fmt: 格式字典，如 {'alignment': 'center', 'space_before': 12}

        Returns:
            {"success": True, "para_idx": para_idx}
        """
        paras = self._doc.paragraphs
        if para_idx >= len(paras):
            raise IndexError(f"段落索引 {para_idx} 超出范围，正文共 {len(paras)} 段")
        write_paragraph_format(paras[para_idx], fmt)
        return {'success': True, 'para_idx': para_idx}

    def modify_table_cell_shading(
        self,
        table_idx: int,
        row_idx: int,
        col_idx: int,
        hex_color: str,
    ) -> Dict[str, Any]:
        """设置表格单元格的背景色。"""
        cell = self._get_cell(table_idx, row_idx, col_idx)
        set_cell_shading(cell, hex_color)
        return {
            'success': True,
            'table_idx': table_idx, 'row_idx': row_idx, 'col_idx': col_idx,
            'color': hex_color,
        }

    def modify_table_cell_border(
        self,
        table_idx: int,
        row_idx: int,
        col_idx: int,
        **edges,
    ) -> Dict[str, Any]:
        """
        设置表格单元格边框。

        使用方式：
            editor.modify_table_cell_border(0, 0, 0,
                top={'sz': 12, 'val': 'single', 'color': '000000'},
                bottom={'sz': 12, 'val': 'single', 'color': '000000'})
        """
        cell = self._get_cell(table_idx, row_idx, col_idx)
        set_cell_border(cell, **edges)
        return {
            'success': True,
            'table_idx': table_idx, 'row_idx': row_idx, 'col_idx': col_idx,
        }

    # ═══════════════════════════════════════════════
    #  保存
    # ═══════════════════════════════════════════════

    def save(self, output_path: Optional[str] = None) -> str:
        """
        保存文档。

        Args:
            output_path: 输出路径。None 则覆盖原文件。

        Returns:
            保存路径字符串
        """
        path = output_path or self._path
        if path is None:
            raise ValueError("未指定保存路径。使用 create_new() 创建的文档必须指定 output_path。")
        self._doc.save(path)
        return path

    # ═══════════════════════════════════════════════
    #  创建类 API（从零构建文档）
    # ═══════════════════════════════════════════════

    def add_heading(self, text: str, level: int = 1) -> Dict[str, Any]:
        """
        添加一个标题段落。

        Args:
            text: 标题文字
            level: 标题级别 (0=Title, 1=Heading1, 2=Heading2, ...)

        Returns:
            {"success": True, "para_idx": N}
        """
        self._doc.add_heading(text, level=level)
        idx = len(self._doc.paragraphs) - 1
        return {'success': True, 'para_idx': idx}

    def add_paragraph(
        self,
        text: str = '',
        style: Optional[str] = None,
        fmt: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        添加一个新段落。

        Args:
            text: 段落文字
            style: 段落样式名（如 'Normal', 'List Bullet'）
            fmt: 字体格式字典，应用于整个段落文本
                 如 {'bold': True, 'size': 12, 'color': 'FF0000'}

        Returns:
            {"success": True, "para_idx": N}
        """
        para = self._doc.add_paragraph(text, style=style)
        if fmt and para.runs:
            from .run_ops import _apply_fmt_to_run
            _apply_fmt_to_run(para.runs[0], fmt)
        idx = len(self._doc.paragraphs) - 1
        return {'success': True, 'para_idx': idx}

    def add_run_to_paragraph(
        self,
        para_idx: int,
        text: str,
        fmt: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        在已有段落末尾追加一个 Run（可设置独立格式）。

        用途：在同一段落内创建多格式混排文本。

        Args:
            para_idx: 目标段落索引
            text: 追加的文本
            fmt: 该 Run 的字体格式，如 {'bold': True, 'color': 'FF0000'}

        Returns:
            {"success": True, "para_idx": N, "run_idx": M}
        """
        paras = self._doc.paragraphs
        if para_idx >= len(paras):
            raise IndexError(f"段落索引 {para_idx} 超出范围，正文共 {len(paras)} 段")
        run = paras[para_idx].add_run(text)
        if fmt:
            from .run_ops import _apply_fmt_to_run
            _apply_fmt_to_run(run, fmt)
        return {'success': True, 'para_idx': para_idx, 'run_idx': len(paras[para_idx].runs) - 1}

    def add_table(
        self,
        rows: int,
        cols: int,
        data: Optional[List[List[str]]] = None,
        style: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        添加一个新表格。

        Args:
            rows: 行数
            cols: 列数
            data: 可选的二维字符串列表填充数据，如 [["A", "B"], ["C", "D"]]
            style: 表格样式名（如 'Table Grid', 'Light Grid Accent 1'）

        Returns:
            {"success": True, "table_idx": N}
        """
        table = self._doc.add_table(rows=rows, cols=cols)
        if style:
            try:
                table.style = style
            except KeyError:
                pass  # 样式不存在则忽略
        if data:
            for r_idx, row_data in enumerate(data):
                if r_idx >= rows:
                    break
                for c_idx, val in enumerate(row_data):
                    if c_idx >= cols:
                        break
                    table.cell(r_idx, c_idx).text = str(val)
        idx = len(self._doc.tables) - 1
        return {'success': True, 'table_idx': idx}

    # ═══════════════════════════════════════════════
    #  删除类 API
    # ═══════════════════════════════════════════════

    def delete_paragraph(self, para_idx: int) -> Dict[str, Any]:
        """
        删除正文中第 para_idx 段。

        警告：删除后后续段落的索引会前移。

        Returns:
            {"success": True, "deleted_text": "被删除的文本"}
        """
        paras = self._doc.paragraphs
        if para_idx >= len(paras):
            raise IndexError(f"段落索引 {para_idx} 超出范围，正文共 {len(paras)} 段")
        para = paras[para_idx]
        deleted_text = para.text
        p_element = para._p
        p_element.getparent().remove(p_element)
        return {'success': True, 'deleted_text': deleted_text}

    def delete_table(self, table_idx: int) -> Dict[str, Any]:
        """
        删除第 table_idx 个表格。

        Returns:
            {"success": True, "table_idx": table_idx}
        """
        tables = self._doc.tables
        if table_idx >= len(tables):
            raise IndexError(f"表格索引 {table_idx} 超出范围，共 {len(tables)} 个表格")
        tbl_element = tables[table_idx]._tbl
        tbl_element.getparent().remove(tbl_element)
        return {'success': True, 'table_idx': table_idx}

    def delete_table_row(self, table_idx: int, row_idx: int) -> Dict[str, Any]:
        """
        删除指定表格中的一行。

        Returns:
            {"success": True, "table_idx": ..., "row_idx": ...}
        """
        tables = self._doc.tables
        if table_idx >= len(tables):
            raise IndexError(f"表格索引 {table_idx} 超出范围")
        table = tables[table_idx]
        if row_idx >= len(table.rows):
            raise IndexError(f"行索引 {row_idx} 超出范围，共 {len(table.rows)} 行")
        tr = table.rows[row_idx]._tr
        tr.getparent().remove(tr)
        return {'success': True, 'table_idx': table_idx, 'row_idx': row_idx}

    def clear_table_cell(
        self,
        table_idx: int,
        row_idx: int,
        col_idx: int,
    ) -> Dict[str, Any]:
        """
        清空指定单元格的文本内容（保留单元格结构和格式）。

        Returns:
            {"success": True, "cleared_text": "原内容"}
        """
        cell = self._get_cell(table_idx, row_idx, col_idx)
        old_text = cell.text
        for para in cell.paragraphs:
            for run in para.runs:
                run.text = ''
        return {
            'success': True,
            'cleared_text': old_text,
            'table_idx': table_idx, 'row_idx': row_idx, 'col_idx': col_idx,
        }

    def set_table_cell_text(
        self,
        table_idx: int,
        row_idx: int,
        col_idx: int,
        text: str,
        fmt: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        设置指定单元格的文本（覆盖写入）。

        适用于空单元格或需要完全重写内容的场景。
        如果单元格已有 Run，则替换第一个 Run 的文本并清空其余 Run；
        如果为空，则新增一个 Run。可选附带字体格式。

        Args:
            table_idx, row_idx, col_idx: 单元格坐标
            text: 要写入的文本
            fmt: 可选的字体格式字典，如 {'name': '黑体', 'size': 12, 'bold': True}

        Returns:
            {"success": True, "old_text": "原内容", ...}
        """
        cell = self._get_cell(table_idx, row_idx, col_idx)
        old_text = cell.text
        para = cell.paragraphs[0]

        if para.runs:
            para.runs[0].text = text
            for run in para.runs[1:]:
                run.text = ''
            target_run = para.runs[0]
        else:
            target_run = para.add_run(text)

        if fmt:
            from .run_ops import _apply_fmt_to_run
            _apply_fmt_to_run(target_run, fmt)

        return {
            'success': True,
            'old_text': old_text,
            'table_idx': table_idx, 'row_idx': row_idx, 'col_idx': col_idx,
        }

    # ═══════════════════════════════════════════════
    #  内部辅助
    # ═══════════════════════════════════════════════

    def _get_cell(self, table_idx: int, row_idx: int, col_idx: int):
        """
        获取指定表格单元格，含边界检查。

        对于含复杂合并单元格（gridSpan / vMerge）的表格，
        python-docx 的 table.cell(r, c) 可能崩溃。
        本方法先尝试标准 API，失败后自动回退到 XML 级别的定位。
        """
        from docx.oxml.ns import qn as _qn
        from docx.table import _Cell

        tables = self._doc.tables
        if table_idx >= len(tables):
            raise IndexError(f"表格索引 {table_idx} 超出范围，共 {len(tables)} 个表格")
        table = tables[table_idx]
        if row_idx >= len(table.rows):
            raise IndexError(f"行索引 {row_idx} 超出范围，表格 {table_idx} 共 {len(table.rows)} 行")

        # 优先尝试标准 API
        try:
            return table.cell(row_idx, col_idx)
        except (IndexError, KeyError):
            pass

        # 回退：直接遍历 XML，用 gridSpan 计算逻辑列号
        tbl = table._tbl
        tr_list = tbl.findall(_qn('w:tr'))
        if row_idx >= len(tr_list):
            raise IndexError(f"行索引 {row_idx} 超出范围（XML 级别）")

        tr = tr_list[row_idx]
        tc_list = tr.findall(_qn('w:tc'))
        logical_col = 0
        for tc in tc_list:
            grid_span = 1
            tcPr = tc.find(_qn('w:tcPr'))
            if tcPr is not None:
                gs_el = tcPr.find(_qn('w:gridSpan'))
                if gs_el is not None:
                    grid_span = int(gs_el.get(_qn('w:val'), '1'))

            if logical_col <= col_idx < logical_col + grid_span:
                return _Cell(tc, table)
            logical_col += grid_span

        raise IndexError(
            f"列索引 {col_idx} 超出范围，表格 {table_idx} 行 {row_idx} 的逻辑列数为 {logical_col}"
        )

    @staticmethod
    def _alignment_str(alignment) -> Optional[str]:
        """将 WD_ALIGN_PARAGRAPH 枚举转为可读字符串。"""
        if alignment is None:
            return None
        mapping = {0: 'left', 1: 'center', 2: 'right', 3: 'justify', 4: 'distribute'}
        return mapping.get(int(alignment), str(alignment))
