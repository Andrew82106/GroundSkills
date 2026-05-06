"""
test_columns.py
---------------
分栏（Multi-column）API 的测试。
"""

import os
import sys
import tempfile

import pytest

# 确保能导入 my_docx
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from my_docx import DocxEditor


@pytest.fixture
def tmp_path():
    """返回一个临时目录路径。"""
    with tempfile.TemporaryDirectory() as d:
        yield d


class TestSetAndGetColumns:
    """set_section_columns + get_section_columns 基本功能。"""

    def test_default_single_column(self, tmp_path):
        """新建文档默认应为单栏。"""
        editor = DocxEditor.create_new()
        info = editor.get_section_columns(0)
        assert info['num'] == 1
        assert info['equal_width'] is True

    def test_set_two_columns_equal(self, tmp_path):
        """设置等宽双栏。"""
        editor = DocxEditor.create_new()
        result = editor.set_section_columns(0, num=2, space_cm=1.0)
        assert result['success'] is True
        assert result['num'] == 2

        info = editor.get_section_columns(0)
        assert info['num'] == 2
        assert info['equal_width'] is True
        # space 应约等于 1.0 cm（567 twips → 1.0 cm，取决于四舍五入）
        assert abs(info['space'] - 1.0) < 0.01

    def test_set_three_columns_with_separator(self, tmp_path):
        """设置三栏并带分隔线。"""
        editor = DocxEditor.create_new()
        editor.set_section_columns(0, num=3, space_cm=0.5, separator=True)
        info = editor.get_section_columns(0)
        assert info['num'] == 3
        assert info['separator'] is True

    def test_set_unequal_columns(self, tmp_path):
        """不等宽分栏。"""
        editor = DocxEditor.create_new()
        editor.set_section_columns(
            0, num=2, equal_width=False,
            col_widths_cm=[10, 6], space_cm=1.0,
        )
        info = editor.get_section_columns(0)
        assert info['num'] == 2
        assert info['equal_width'] is False
        assert len(info['details']) == 2
        assert abs(info['details'][0]['width_cm'] - 10.0) < 0.1
        assert abs(info['details'][1]['width_cm'] - 6.0) < 0.1
        # 第一栏的 space 应为 ~1.0cm
        assert abs(info['details'][0]['space_cm'] - 1.0) < 0.01

    def test_unequal_columns_wrong_length_raises(self, tmp_path):
        """col_widths_cm 长度不匹配时应报错。"""
        editor = DocxEditor.create_new()
        with pytest.raises(ValueError, match="col_widths_cm"):
            editor.set_section_columns(
                0, num=3, equal_width=False,
                col_widths_cm=[10, 6],  # 只给了两个值，但 num=3
            )

    def test_reset_to_single_column(self, tmp_path):
        """从双栏改回单栏。"""
        editor = DocxEditor.create_new()
        editor.set_section_columns(0, num=2)
        editor.set_section_columns(0, num=1)
        info = editor.get_section_columns(0)
        assert info['num'] == 1

    def test_save_and_reload(self, tmp_path):
        """设置分栏后保存、重新打开，分栏信息应保持。"""
        path = os.path.join(tmp_path, 'cols.docx')
        editor = DocxEditor.create_new()
        editor.add_paragraph("左栏内容")
        editor.set_section_columns(0, num=2, space_cm=1.5, separator=True)
        editor.save(path)

        editor2 = DocxEditor(path)
        info = editor2.get_section_columns(0)
        assert info['num'] == 2
        assert info['separator'] is True
        assert abs(info['space'] - 1.5) < 0.02


class TestColumnBreak:
    """add_column_break 测试。"""

    def test_add_column_break_at_end(self, tmp_path):
        """在文档末尾追加分栏符。"""
        editor = DocxEditor.create_new()
        editor.add_paragraph("段落一")
        result = editor.add_column_break()
        assert result['success'] is True
        # 应生成一个新段落
        assert result['para_idx'] >= 1

    def test_add_column_break_at_specific_paragraph(self, tmp_path):
        """在指定段落前插入分栏符。"""
        editor = DocxEditor.create_new()
        editor.add_paragraph("第一段")
        editor.add_paragraph("第二段")
        editor.add_paragraph("第三段")
        result = editor.add_column_break(para_idx=1)
        assert result['success'] is True
        assert result['para_idx'] == 1

    def test_column_break_index_out_of_range(self, tmp_path):
        """para_idx 超出范围应报错。"""
        editor = DocxEditor.create_new()
        editor.add_paragraph("只有一段")
        with pytest.raises(IndexError):
            editor.add_column_break(para_idx=999)

    def test_column_break_in_saved_file(self, tmp_path):
        """分栏符应能在保存文件中保留。"""
        path = os.path.join(tmp_path, 'break.docx')
        editor = DocxEditor.create_new()
        editor.set_section_columns(0, num=2)
        editor.add_paragraph("左栏内容")
        editor.add_column_break()
        editor.add_paragraph("右栏内容")
        editor.save(path)

        # 重新打开，检查结构
        editor2 = DocxEditor(path)
        doc_map = editor2.get_structural_map()
        assert doc_map['sections'][0]['columns']['num'] == 2
        # 应有 3 个段落（左栏 + 分栏符段落 + 右栏）
        # 注意 python-docx 新建文档默认有一个空段落
        assert len(doc_map['paragraphs']) >= 3


class TestStructuralMapColumns:
    """get_structural_map 中的 columns 字段。"""

    def test_structural_map_contains_columns(self, tmp_path):
        """结构地图应包含 columns 字段。"""
        editor = DocxEditor.create_new()
        editor.set_section_columns(0, num=2)
        doc_map = editor.get_structural_map()
        assert 'columns' in doc_map['sections'][0]
        assert doc_map['sections'][0]['columns']['num'] == 2

    def test_structural_map_default_columns(self, tmp_path):
        """默认文档的 columns 应显示单栏。"""
        editor = DocxEditor.create_new()
        doc_map = editor.get_structural_map()
        assert doc_map['sections'][0]['columns']['num'] == 1


class TestSectionIndexErrors:
    """节索引越界检查。"""

    def test_get_columns_invalid_section(self, tmp_path):
        editor = DocxEditor.create_new()
        with pytest.raises(IndexError, match="节索引"):
            editor.get_section_columns(99)

    def test_set_columns_invalid_section(self, tmp_path):
        editor = DocxEditor.create_new()
        with pytest.raises(IndexError, match="节索引"):
            editor.set_section_columns(99, num=2)


class TestColumnsWithContent:
    """分栏模式下对表格和图片的操作兼容性。"""

    def test_table_in_two_column_section(self, tmp_path):
        """双栏模式下添加表格不应报错。"""
        path = os.path.join(tmp_path, 'table_cols.docx')
        editor = DocxEditor.create_new()
        editor.set_section_columns(0, num=2)
        editor.add_paragraph("双栏表格示例")
        editor.add_table(2, 3, data=[["A", "B", "C"], ["1", "2", "3"]])
        editor.save(path)

        editor2 = DocxEditor(path)
        doc_map = editor2.get_structural_map()
        assert doc_map['sections'][0]['columns']['num'] == 2
        assert len(doc_map['tables']) == 1

    def test_replace_text_in_two_column_doc(self, tmp_path):
        """双栏模式下文本替换仍正常工作。"""
        path = os.path.join(tmp_path, 'replace_cols.docx')
        editor = DocxEditor.create_new()
        editor.set_section_columns(0, num=2)
        editor.add_paragraph("这是旧文本")
        editor.save(path)

        editor2 = DocxEditor(path)
        result = editor2.replace_text("旧文本", "新文本")
        assert result['replaced_count'] == 1
