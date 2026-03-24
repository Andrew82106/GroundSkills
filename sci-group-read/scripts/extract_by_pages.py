#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
按页提取脚本 - 阶段2步骤3
根据章节结构从PDF提取文本并按章节组织

重要：此脚本执行阶段2的步骤3（代码批量提取）
Agent需要先完成步骤2（视觉识别章节结构），然后调用此脚本

环境要求：
- 必须在conda base环境中运行
- 需要PyMuPDF (fitz)
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime

# 环境检查
def check_environment():
    """检查运行环境"""
    python_path = sys.executable
    if 'anaconda' not in python_path.lower() and 'conda' not in python_path.lower():
        print("⚠️  警告: 当前Python不在conda环境中")
        print(f"   路径: {python_path}")
        print("   建议运行: conda activate base")
        print()
    
    try:
        import fitz
    except ImportError:
        print("✗ 缺少依赖: PyMuPDF")
        print("  安装命令: pip install PyMuPDF")
        return False
    
    return True

if not check_environment():
    sys.exit(1)

import fitz

def extract_by_structure(pdf_path, chapter_structure, output_dir):
    """
    根据章节结构提取文本
    
    参数:
        pdf_path: PDF文件路径
        chapter_structure: 章节结构列表 [(章节名, 起始页, 结束页), ...]
        output_dir: 输出目录
    """
    output_path = Path(output_dir)
    sections_dir = output_path / "sections"
    sections_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"从PDF提取文本: {pdf_path}")
    print(f"输出目录: {output_path}")
    print(f"章节数: {len(chapter_structure)}")
    
    # 打开PDF
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    print(f"PDF总页数: {total_pages}")
    
    # 提取每个章节
    full_text = ""
    
    for i, (chapter_name, start_page, end_page) in enumerate(chapter_structure, 1):
        print(f"\n提取章节 {i}/{len(chapter_structure)}: {chapter_name} (页 {start_page}-{end_page})")
        
        chapter_text = f"# {chapter_name}\n\n"
        
        # 提取该章节的所有页面
        for page_num in range(start_page - 1, min(end_page, total_pages)):
            page = doc[page_num]
            page_text = page.get_text()
            chapter_text += page_text + "\n"
        
        # 保存章节文件
        section_file = sections_dir / f"{i:02d}_{chapter_name.replace(' ', '_')}.md"
        with open(section_file, 'w', encoding='utf-8') as f:
            f.write(chapter_text)
        
        full_text += chapter_text + "\n\n"
        print(f"✓ 保存: {section_file.name}")
    
    doc.close()
    
    # 保存完整文本
    full_text_file = output_path / "full_text.md"
    with open(full_text_file, 'w', encoding='utf-8') as f:
        f.write(full_text)
    print(f"\n✓ 保存完整文本: {full_text_file.name}")
    
    # 创建索引文件
    index_file = output_path / "index.md"
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(f"# 论文章节索引\n\n")
        f.write(f"## 章节列表\n\n")
        for i, (chapter_name, start_page, end_page) in enumerate(chapter_structure, 1):
            section_file = f"{i:02d}_{chapter_name.replace(' ', '_')}.md"
            f.write(f"{i}. [{chapter_name}](sections/{section_file}) (页 {start_page}-{end_page})\n")
        f.write(f"\n总页数: {total_pages}\n")
        f.write(f"提取时间: {datetime.now().isoformat()}\n")
    print(f"✓ 保存索引: {index_file.name}")
    
    # 保存章节结构JSON
    structure_file = output_path / "chapter_structure.json"
    with open(structure_file, 'w', encoding='utf-8') as f:
        json.dump({
            "total_pages": total_pages,
            "chapters": [
                {
                    "name": name,
                    "start_page": start,
                    "end_page": end
                }
                for name, start, end in chapter_structure
            ]
        }, f, ensure_ascii=False, indent=2)
    print(f"✓ 保存章节结构: {structure_file.name}")
    
    print(f"\n{'='*60}")
    print(f"提取完成！")
    print(f"{'='*60}")
    print(f"输出目录: {output_path}")
    print(f"章节文件: {len(chapter_structure)} 个")
    print(f"\n下一步: Agent需要读取图片，补充图表和公式内容")
    print(f"参考: .claude/skills/sciGroupRead/references/stage2-sop.md")

def load_structure_from_json(json_path):
    """从JSON文件加载章节结构"""
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    return [
        (ch['name'], ch['start_page'], ch['end_page'])
        for ch in data['chapters']
    ]

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("用法:")
        print("  方式1: python extract_by_pages.py <PDF文件> <章节结构JSON>")
        print("  方式2: python extract_by_pages.py <PDF文件> <输出目录> (需要先有chapter_structure.json)")
        print("\n示例:")
        print("  python extract_by_pages.py paper.pdf structure.json")
        print("  python extract_by_pages.py paper.pdf results/paper_Name/")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    second_arg = sys.argv[2]
    
    # 判断第二个参数是JSON文件还是目录
    if second_arg.endswith('.json'):
        # 方式1: 提供了章节结构JSON
        structure_json = second_arg
        chapter_structure = load_structure_from_json(structure_json)
        
        # 输出目录从PDF文件名推断
        pdf_name = Path(pdf_path).stem
        output_dir = Path("results") / f"paper_{pdf_name}"
    else:
        # 方式2: 提供了输出目录，从中加载chapter_structure.json
        output_dir = Path(second_arg)
        structure_json = output_dir / "chapter_structure.json"
        
        if not structure_json.exists():
            print(f"错误: 未找到章节结构文件: {structure_json}")
            print("请先完成阶段2步骤2（视觉识别章节结构）")
            sys.exit(1)
        
        chapter_structure = load_structure_from_json(structure_json)
    
    # 执行提取
    extract_by_structure(pdf_path, chapter_structure, output_dir)
