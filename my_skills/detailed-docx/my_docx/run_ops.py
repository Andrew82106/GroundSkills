"""
run_ops.py
----------
底层 Run 操作引擎，负责：
1. 将段落内连续文本 Run 聚合，构建「字符 → Run 位置」的映射。
2. 跨 Run 安全文本替换（保留第一个命中 Run 的格式）。
3. 增量格式叠加（方案 A：只叠加新属性，不清除原有格式）。

特别注意：含 <w:drawing>（图片）、<w:br>（换行符）的 Run 会被跳过，
确保图片等非文本内容完全不受影响。
"""

import re
import copy
from typing import List, Tuple, Optional, Dict, Any

from docx.oxml.ns import qn
from docx.oxml.shared import OxmlElement
from docx.text.paragraph import Paragraph
from docx.shared import RGBColor, Pt


# ─────────────────────────────────────────────
# 内部辅助结构
# ─────────────────────────────────────────────

class _RunSlot:
    """描述段落中「一个可文字编辑的 Run」的位置信息。"""
    __slots__ = ('run_idx', 'char_start', 'char_end')

    def __init__(self, run_idx: int, char_start: int, char_end: int):
        self.run_idx = run_idx      # 在 paragraph.runs 中的索引
        self.char_start = char_start  # 在拼接后全文中的开始字符偏移（含）
        self.char_end = char_end      # 在拼接后全文中的结束字符偏移（不含）


def _is_text_run(run) -> bool:
    """判断一个 Run 是否是纯文字 Run（排除含图片、域字段等）。"""
    r_elem = run._r
    # 如果含 <w:drawing> 或 <w:pict>，它是图片 Run，跳过
    if r_elem.find(qn('w:drawing')) is not None:
        return False
    if r_elem.find(qn('w:pict')) is not None:
        return False
    return True


def _build_run_map(paragraph: Paragraph) -> Tuple[str, List[_RunSlot]]:
    """
    扫描段落中所有文字 Run，返回：
    - full_text: 所有文字 Run 拼接后的字符串
    - slots: 每个 Run 的字符区间列表
    """
    full_text = []
    slots: List[_RunSlot] = []
    pos = 0
    for idx, run in enumerate(paragraph.runs):
        if not _is_text_run(run):
            continue
        text = run.text or ''
        start = pos
        end = pos + len(text)
        slots.append(_RunSlot(run_idx=idx, char_start=start, char_end=end))
        full_text.append(text)
        pos = end
    return ''.join(full_text), slots


def _find_slots_in_range(slots: List[_RunSlot], match_start: int, match_end: int) -> List[_RunSlot]:
    """找出字符区间 [match_start, match_end) 覆盖到的所有 RunSlot。"""
    return [s for s in slots if s.char_end > match_start and s.char_start < match_end]


# ─────────────────────────────────────────────
# 核心：跨 Run 安全替换
# ─────────────────────────────────────────────

def replace_text_in_paragraph(
    paragraph: Paragraph,
    old: str,
    new: str,
    count: int = 0,
    use_regex: bool = False
) -> int:
    """
    在段落中查找 old（可选 regex），替换为 new，保留第一个命中 Run 的格式。
    
    Args:
        paragraph: 目标段落
        old: 要查找的文本（或正则表达式）
        new: 替换后的文本
        count: 最多替换次数，0 表示全部替换
        use_regex: 是否将 old 视为正则表达式
    
    Returns:
        本次在该段落中成功替换的次数
    """
    full_text, slots = _build_run_map(paragraph)
    if not full_text or old not in full_text and not use_regex:
        return 0

    runs = paragraph.runs

    # 找出所有匹配位置
    if use_regex:
        pattern = re.compile(old)
        matches = list(pattern.finditer(full_text))
    else:
        # 手动找所有出现位置
        matches = []
        search_from = 0
        while True:
            idx = full_text.find(old, search_from)
            if idx == -1:
                break
            # 包装成类 Match 对象
            matches.append(type('M', (), {'start': lambda s, i=idx: i, 'end': lambda s, i=idx, o=old: i+len(o)})())
            search_from = idx + 1

    if not matches:
        return 0

    if count > 0:
        matches = matches[:count]

    # 从后往前替换，避免前面的替换影响后面的偏移
    replaced = 0
    for m in reversed(matches):
        m_start = m.start()
        m_end = m.end()
        involved = _find_slots_in_range(slots, m_start, m_end)
        if not involved:
            continue

        # 获取第一个命中 Run（将保留其格式）
        first_slot = involved[0]
        first_run = runs[first_slot.run_idx]

        # 计算第一个 Run 里，匹配区间在 Run 内的局部位置
        local_start_in_first = m_start - first_slot.char_start
        local_end_in_first = min(m_end, first_slot.char_end) - first_slot.char_start

        # 重写全文并反推
        # 构建新的 full_text（用于重计 slots），这里我们直接操作 run.text
        # 第一个 Run：把「被匹配到的部分」换成 new，保留前后未命中的字符
        original_first = first_run.text or ''
        new_first = (
            original_first[:local_start_in_first]
            + new
            + original_first[local_end_in_first:]
        )
        first_run.text = new_first

        # 后续命中的 Run：只把「被命中的部分」清空，不动 rPr（格式节点）
        for slot in involved[1:]:
            run = runs[slot.run_idx]
            original = run.text or ''
            # 该 Run 在整个匹配里被命中的局部范围
            overlap_start = max(m_start, slot.char_start) - slot.char_start
            overlap_end = min(m_end, slot.char_end) - slot.char_start
            new_t = original[:overlap_start] + original[overlap_end:]
            run.text = new_t

        replaced += 1

        # 重建 slots，因为 text 已改变（为下一个 reversed match 准备）
        full_text, slots = _build_run_map(paragraph)
        runs = paragraph.runs

    return replaced


# ─────────────────────────────────────────────
# 核心：增量格式叠加（方案 A）
# ─────────────────────────────────────────────

def apply_format_to_paragraph_text(
    paragraph: Paragraph,
    target_text: str,
    fmt: Dict[str, Any],
    count: int = 0,
    use_regex: bool = False
) -> int:
    """
    在段落中查找 target_text，对命中区间内的每个 Run 做「增量格式叠加」：
    - 仅写入 fmt 中指定的属性
    - 不删除或覆盖 Run 上已有的其他格式属性
    - 若 target_text 的每个 Run 拥有不同格式（如一半红一半蓝），
      各自在保留原有格式的基础上叠加新属性

    Args:
        paragraph: 目标段落
        target_text: 要查找的文本或正则
        fmt: 格式字典，如 {'bold': True, 'color': 'FF0000', 'size': 14}
        count: 最多处理几处，0 = 全部
        use_regex: 是否使用正则

    Returns:
        成功处理的匹配次数
    """
    full_text, slots = _build_run_map(paragraph)
    if not full_text:
        return 0

    if use_regex:
        matches = list(re.finditer(target_text, full_text))
    else:
        matches = []
        search_from = 0
        while True:
            idx = full_text.find(target_text, search_from)
            if idx == -1:
                break
            matches.append(type('M', (), {'start': lambda s, i=idx: i, 'end': lambda s, i=idx, t=target_text: i+len(t)})())
            search_from = idx + 1

    if not matches:
        return 0
    if count > 0:
        matches = matches[:count]

    runs = paragraph.runs
    applied = 0

    for m in matches:
        m_start = m.start()
        m_end = m.end()
        involved = _find_slots_in_range(slots, m_start, m_end)
        if not involved:
            continue

        for slot in involved:
            run = runs[slot.run_idx]
            _apply_fmt_to_run(run, fmt)

        applied += 1

    return applied


def _apply_fmt_to_run(run, fmt: Dict[str, Any]) -> None:
    """
    将 fmt 增量叠加到 run 上（只写 fmt 里有的 key，不清除其他格式）。
    支持的字段:
      bold, italic, underline, strike, all_caps, small_caps,
      superscript, subscript,
      color (hex string, e.g. 'FF0000' or '#FF0000'),
      size (pt, float or int),
      name (font name, str)
    """
    font = run.font

    if 'bold' in fmt:
        font.bold = fmt['bold']
    if 'italic' in fmt:
        font.italic = fmt['italic']
    if 'underline' in fmt:
        font.underline = fmt['underline']
    if 'strike' in fmt:
        font.strike = fmt['strike']
    if 'all_caps' in fmt:
        font.all_caps = fmt['all_caps']
    if 'small_caps' in fmt:
        font.small_caps = fmt['small_caps']
    if 'superscript' in fmt:
        font.superscript = fmt['superscript']
    if 'subscript' in fmt:
        font.subscript = fmt['subscript']
    if 'name' in fmt:
        font.name = fmt['name']
        # font.name 只设置 ascii/hAnsi，中文字符需要额外设置 eastAsia
        r_elem = run._r
        rPr = r_elem.find(qn('w:rPr'))
        if rPr is None:
            rPr = OxmlElement('w:rPr')
            r_elem.insert(0, rPr)
        rFonts = rPr.find(qn('w:rFonts'))
        if rFonts is None:
            rFonts = OxmlElement('w:rFonts')
            rPr.insert(0, rFonts)
        rFonts.set(qn('w:eastAsia'), fmt['name'])
    if 'size' in fmt:
        font.size = Pt(fmt['size'])
    if 'color' in fmt:
        hex_str = str(fmt['color']).lstrip('#')
        if len(hex_str) == 6:
            font.color.rgb = RGBColor(
                int(hex_str[0:2], 16),
                int(hex_str[2:4], 16),
                int(hex_str[4:6], 16)
            )
        elif fmt['color'] is None:
            # 取消颜色，恢复继承
            font.color.theme_color = None
            rPr = run._r.find(qn('w:rPr'))
            if rPr is not None:
                clr = rPr.find(qn('w:color'))
                if clr is not None:
                    rPr.remove(clr)
