"""
style_ops.py
------------
格式属性的读取与设置工具集。

封装了 python-docx 中分散的格式操作，提供统一的 dict ↔ 格式对象 转换接口：
- Font 级别：字体名、大小、粗体、颜色等
- ParagraphFormat 级别：对齐、缩进、行距等
- 表格单元格级别：背景色、边框（需底层 XML）
"""

from typing import Dict, Any, Optional

from docx.text.font import Font
from docx.text.paragraph import Paragraph
from docx.text.run import Run
from docx.shared import RGBColor, Length, Pt, Inches, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.shared import OxmlElement
from docx.oxml.ns import qn


# ═══════════════════════════════════
#  Font 格式 (Run 级别)
# ═══════════════════════════════════

def read_font(font: Font) -> Dict[str, Any]:
    """
    读取 Font 对象上显式设定（非继承）的格式属性，返回字典。

    返回的字典只包含「已被显式设置」的属性（值不为 None 的）。
    这是为了区分「被设置为某值」 vs 「继承自段落/文档样式（None）」。

    Returns:
        dict, 可能包含的 key：
        name, size, bold, italic, underline, strike, double_strike,
        all_caps, small_caps, superscript, subscript, color, highlight_color
    """
    fmt: Dict[str, Any] = {}
    if font.name is not None:
        fmt['name'] = font.name
    if font.size is not None:
        fmt['size'] = font.size.pt
    if font.bold is not None:
        fmt['bold'] = font.bold
    if font.italic is not None:
        fmt['italic'] = font.italic
    if font.underline is not None:
        fmt['underline'] = font.underline
    if font.strike is not None:
        fmt['strike'] = font.strike
    if font.double_strike is not None:
        fmt['double_strike'] = font.double_strike
    if font.all_caps is not None:
        fmt['all_caps'] = font.all_caps
    if font.small_caps is not None:
        fmt['small_caps'] = font.small_caps
    if font.superscript is not None:
        fmt['superscript'] = font.superscript
    if font.subscript is not None:
        fmt['subscript'] = font.subscript

    # 颜色需要特殊处理：可能是 RGB 或 Theme 色
    try:
        if font.color and font.color.rgb is not None:
            fmt['color'] = str(font.color.rgb)
    except Exception:
        pass

    if font.highlight_color is not None:
        fmt['highlight_color'] = str(font.highlight_color)

    return fmt


def write_font(font: Font, fmt: Dict[str, Any]) -> None:
    """
    将字典中的属性覆盖写入 Font 对象（增量式，不清除 fmt 中未提及的属性）。

    Args:
        font: python-docx Font 对象
        fmt: 格式字典，支持的 key 见 read_font() 的返回
    """
    if 'name' in fmt:
        font.name = fmt['name']
    if 'size' in fmt:
        font.size = Pt(fmt['size'])
    if 'bold' in fmt:
        font.bold = fmt['bold']
    if 'italic' in fmt:
        font.italic = fmt['italic']
    if 'underline' in fmt:
        font.underline = fmt['underline']
    if 'strike' in fmt:
        font.strike = fmt['strike']
    if 'double_strike' in fmt:
        font.double_strike = fmt['double_strike']
    if 'all_caps' in fmt:
        font.all_caps = fmt['all_caps']
    if 'small_caps' in fmt:
        font.small_caps = fmt['small_caps']
    if 'superscript' in fmt:
        font.superscript = fmt['superscript']
    if 'subscript' in fmt:
        font.subscript = fmt['subscript']
    if 'color' in fmt:
        _set_color(font, fmt['color'])
    if 'highlight_color' in fmt:
        font.highlight_color = fmt['highlight_color']


def _set_color(font: Font, color_val) -> None:
    """设置字体颜色，支持 hex 字符串 / None。"""
    if color_val is None:
        # 清除颜色 → 恢复继承
        font.color.rgb = None
        return
    hex_str = str(color_val).lstrip('#')
    if len(hex_str) == 6:
        font.color.rgb = RGBColor(
            int(hex_str[0:2], 16),
            int(hex_str[2:4], 16),
            int(hex_str[4:6], 16),
        )


def read_run(run: Run) -> Dict[str, Any]:
    """读取一个 Run 的完整信息（文本 + 格式）。"""
    return {
        'text': run.text,
        'format': read_font(run.font),
    }


def copy_run_format(src: Run, dst: Run) -> None:
    """将 src 的字体格式复制到 dst，不修改 dst 的文本内容。"""
    fmt = read_font(src.font)
    write_font(dst.font, fmt)


# ═══════════════════════════════════
#  ParagraphFormat 级别
# ═══════════════════════════════════

_ALIGN_MAP = {
    WD_ALIGN_PARAGRAPH.LEFT: 'left',
    WD_ALIGN_PARAGRAPH.CENTER: 'center',
    WD_ALIGN_PARAGRAPH.RIGHT: 'right',
    WD_ALIGN_PARAGRAPH.JUSTIFY: 'justify',
    WD_ALIGN_PARAGRAPH.DISTRIBUTE: 'distribute',
}
_ALIGN_REVERSE = {v: k for k, v in _ALIGN_MAP.items()}


def read_paragraph_format(para: Paragraph) -> Dict[str, Any]:
    """
    读取段落级格式属性。

    Returns:
        dict, 可能包含的 key：
        style, alignment,
        left_indent, right_indent, first_line_indent (单位 inches),
        space_before, space_after (单位 pt),
        line_spacing (浮点倍数) 或 line_spacing_pt (绝对 pt 值)
    """
    fmt: Dict[str, Any] = {}

    if para.style and para.style.name:
        fmt['style'] = para.style.name

    if para.alignment is not None:
        fmt['alignment'] = _ALIGN_MAP.get(para.alignment, str(para.alignment))

    pf = para.paragraph_format
    if pf.left_indent is not None:
        fmt['left_indent'] = pf.left_indent.inches
    if pf.right_indent is not None:
        fmt['right_indent'] = pf.right_indent.inches
    if pf.first_line_indent is not None:
        fmt['first_line_indent'] = pf.first_line_indent.inches
    if pf.space_before is not None:
        fmt['space_before'] = pf.space_before.pt
    if pf.space_after is not None:
        fmt['space_after'] = pf.space_after.pt
    if pf.line_spacing is not None:
        if isinstance(pf.line_spacing, Length):
            fmt['line_spacing_pt'] = pf.line_spacing.pt
        else:
            fmt['line_spacing'] = pf.line_spacing

    return fmt


def write_paragraph_format(para: Paragraph, fmt: Dict[str, Any]) -> None:
    """将格式字典增量写入段落属性。"""
    if 'style' in fmt:
        try:
            para.style = fmt['style']
        except KeyError:
            pass  # 样式不存在则静默跳过

    if 'alignment' in fmt:
        val = fmt['alignment']
        if isinstance(val, str):
            val = _ALIGN_REVERSE.get(val.lower(), val)
        para.alignment = val

    pf = para.paragraph_format
    if 'left_indent' in fmt:
        pf.left_indent = Inches(fmt['left_indent'])
    if 'right_indent' in fmt:
        pf.right_indent = Inches(fmt['right_indent'])
    if 'first_line_indent' in fmt:
        pf.first_line_indent = Inches(fmt['first_line_indent'])
    if 'space_before' in fmt:
        pf.space_before = Pt(fmt['space_before'])
    if 'space_after' in fmt:
        pf.space_after = Pt(fmt['space_after'])
    if 'line_spacing_pt' in fmt:
        pf.line_spacing = Pt(fmt['line_spacing_pt'])
    elif 'line_spacing' in fmt:
        pf.line_spacing = fmt['line_spacing']


# ═══════════════════════════════════
#  表格单元格级别 (需要底层 XML)
# ═══════════════════════════════════

def read_cell_shading(cell) -> Optional[str]:
    """读取单元格背景色，返回 hex 字符串或 None。"""
    tc = cell._tc
    tcPr = tc.tcPr
    if tcPr is None:
        return None
    shd = tcPr.find(qn('w:shd'))
    if shd is None:
        return None
    return shd.get(qn('w:fill'))


def set_cell_shading(cell, hex_color: str) -> None:
    """设置单元格背景色。"""
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    # 移除已有的 shading
    existing = tcPr.find(qn('w:shd'))
    if existing is not None:
        tcPr.remove(existing)
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hex_color.lstrip('#'))
    tcPr.append(shd)


def set_cell_border(cell, **edges) -> None:
    """
    设置单元格边框。

    Args:
        cell: python-docx Cell 对象
        **edges: 边名 → 属性字典, 如:
            top={'sz': 12, 'val': 'single', 'color': '000000'}
            bottom={'sz': 12, 'val': 'single', 'color': '000000'}
            
    边名可选: top, bottom, left, right, insideH, insideV
    """
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    # 移除已有的 tcBorders
    existing = tcPr.find(qn('w:tcBorders'))
    if existing is not None:
        tcPr.remove(existing)

    borders = OxmlElement('w:tcBorders')
    for edge_name, attrs in edges.items():
        edge_el = OxmlElement(f'w:{edge_name}')
        for attr_key, attr_val in attrs.items():
            edge_el.set(qn(f'w:{attr_key}'), str(attr_val))
        borders.append(edge_el)
    tcPr.append(borders)
