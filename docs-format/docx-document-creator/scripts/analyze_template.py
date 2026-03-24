#!/usr/bin/env python3
"""
模板分析器 - 分析模板文档的格式参数
用法：python analyze_template.py 模板.docx
"""

import sys
from docx import Document
from docx.shared import Pt, Mm
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING


def format_length(length):
    """将长度转换为可读格式"""
    if length is None:
        return "N/A"
    if hasattr(length, 'mm'):
        return f"{length.mm:.1f}mm"
    if hasattr(length, 'pt'):
        pt = length.pt
        # 转换为字号
        pt_map = {
            42: "初号", 36: "小初", 26: "一号", 24: "小一",
            22: "二号", 18: "小二", 16: "三号", 15: "小三",
            14: "四号", 12: "小四", 10.5: "五号"
        }
        if pt in pt_map:
            return f"{pt}pt ({pt_map[pt]})"
        return f"{pt}pt"
    return str(length)


def format_alignment(align):
    """格式化对齐方式"""
    if align is None:
        return "未知"
    mapping = {
        WD_ALIGN_PARAGRAPH.LEFT: "左对齐",
        WD_ALIGN_PARAGRAPH.CENTER: "居中",
        WD_ALIGN_PARAGRAPH.RIGHT: "右对齐",
        WD_ALIGN_PARAGRAPH.JUSTIFY: "两端对齐",
        WD_ALIGN_PARAGRAPH.DISTRIBUTE: "分散对齐",
    }
    return mapping.get(align, str(align))


def format_line_spacing(rule, spacing):
    """格式化行距"""
    if rule == WD_LINE_SPACING.SINGLE:
        return "单倍行距"
    elif rule == WD_LINE_SPACING.ONE_POINT_FIVE:
        return "1.5 倍行距"
    elif rule == WD_LINE_SPACING.DOUBLE:
        return "双倍行距"
    elif rule == WD_LINE_SPACING.EXACTLY:
        return f"固定值 {format_length(spacing)}"
    elif rule == WD_LINE_SPACING.MULTIPLE:
        return f"{spacing} 倍行距"
    return f"{format_length(spacing)}"


def analyze_template(template_path):
    """分析模板文档"""
    print(f"分析模板：{template_path}\n")
    doc = Document(template_path)

    # ===== 页面设置 =====
    print("=" * 50)
    print("页面设置")
    print("=" * 50)

    if doc.sections:
        section = doc.sections[0]
        print(f"纸张大小：{format_length(section.page_width)} × {format_length(section.page_height)}")
        print(f"页边距:")
        print(f"  上：{format_length(section.top_margin)}")
        print(f"  下：{format_length(section.bottom_margin)}")
        print(f"  左：{format_length(section.left_margin)}")
        print(f"  右：{format_length(section.right_margin)}")
    print()

    # ===== 遍历段落收集样式 =====
    styles_found = {
        'title': None,
        'heading1': None,
        'heading2': None,
        'body': None
    }

    title_count = 0
    h1_count = 0
    h2_count = 0
    body_count = 0

    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            continue

        style_name = para.style.name if para.style else ""
        pf = para.paragraph_format
        run = para.runs[0] if para.runs else None

        # 检测段落类型
        is_title = 'Title' in style_name or (len(text) < 50 and pf.alignment == WD_ALIGN_PARAGRAPH.CENTER and title_count == 0)
        is_h1 = 'Heading 1' in style_name or (len(text) < 30 and run and run.font.bold and h1_count < 3)
        is_h2 = 'Heading 2' in style_name or (len(text) < 30 and run and run.font.bold and h2_count < 3)

        style_info = {
            'para': pf,
            'run': run,
            'style_name': style_name
        }

        if is_title and styles_found['title'] is None:
            styles_found['title'] = style_info
            title_count += 1
        elif is_h1 and styles_found['heading1'] is None:
            styles_found['heading1'] = style_info
            h1_count += 1
        elif is_h2 and styles_found['heading2'] is None:
            styles_found['heading2'] = style_info
            h2_count += 1
        elif not any([is_title, is_h1, is_h2]) and body_count < 3:
            if styles_found['body'] is None:
                styles_found['body'] = style_info
            body_count += 1

    # ===== 输出各部分样式 =====
    def print_style(title, style_info):
        if style_info is None:
            return
        pf = style_info['para']
        run = style_info['run']

        print(f"\n{title}:")

        if run:
            font_info = []
            if run.font.name:
                font_info.append(run.font.name)
            if run.font.size:
                font_info.append(format_length(run.font.size))
            if run.font.bold:
                font_info.append("加粗")
            if run.font.italic:
                font_info.append("斜体")
            if font_info:
                print(f"  字体：{' '.join(font_info)}")

        if pf:
            align_str = format_alignment(pf.alignment)
            print(f"  对齐：{align_str}")

            if pf.first_line_indent and pf.first_line_indent > 0:
                print(f"  首行缩进：{format_length(pf.first_line_indent)}")

            if pf.line_spacing is not None:
                spacing_str = format_line_spacing(pf.line_spacing_rule, pf.line_spacing)
                print(f"  行距：{spacing_str}")

    print("=" * 50)
    print("样式分析")
    print("=" * 50)

    print_style("主标题", styles_found['title'])
    print_style("一级标题", styles_found['heading1'])
    print_style("二级标题", styles_found['heading2'])
    print_style("正文", styles_found['body'])

    print()
    print("=" * 50)

    # ===== 输出 JSON 格式（可选）=====
    if '--json' in sys.argv:
        import json
        output = {
            'page': {},
            'styles': {}
        }

        if doc.sections:
            section = doc.sections[0]
            output['page'] = {
                'width': section.page_width.emu,
                'height': section.page_height.emu,
                'margins': {
                    'top': section.top_margin.emu,
                    'bottom': section.bottom_margin.emu,
                    'left': section.left_margin.emu,
                    'right': section.right_margin.emu
                }
            }

        print("\nJSON 输出:")
        print(json.dumps(output, ensure_ascii=False, indent=2))


def main():
    if len(sys.argv) < 2:
        print("用法：python analyze_template.py 模板.docx [--json]")
        sys.exit(1)

    analyze_template(sys.argv[1])


if __name__ == '__main__':
    main()
