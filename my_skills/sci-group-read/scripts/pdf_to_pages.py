#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PDF转图片脚本 - 阶段2
将PDF页面转换为高质量图片用于Agent视觉分析

环境要求：
- 必须在conda base环境中运行
- 需要安装：PyMuPDF (fitz)
- 不需要poppler！使用PyMuPDF直接渲染
"""

import os
import sys
from pathlib import Path

# 环境检查
def check_environment():
    """检查运行环境和依赖"""
    errors = []
    
    # 检查Python路径
    python_path = sys.executable
    if 'anaconda' not in python_path.lower() and 'conda' not in python_path.lower():
        errors.append(f"⚠️  警告: 当前Python不在conda环境中: {python_path}")
        errors.append("   建议运行: conda activate base")
    
    # 检查PyMuPDF
    try:
        import fitz
    except ImportError as e:
        errors.append(f"✗ 缺少依赖库: PyMuPDF")
        errors.append("   安装命令: pip install PyMuPDF")
        print("\n".join(errors))
        return False
    
    if errors:
        print("="*60)
        print("环境检查")
        print("="*60)
        for error in errors:
            print(error)
        print("="*60)
    
    return True

# 先检查环境
if not check_environment():
    sys.exit(1)

import fitz  # PyMuPDF

# 配置
DPI = 150  # 图片质量（150 DPI足够Agent识别）
FORMAT = 'PNG'  # 图片格式

def pdf_to_pages(pdf_path, output_dir=None, dpi=DPI):
    """将PDF转换为图片，使用PyMuPDF"""
    pdf_file = Path(pdf_path)
    
    if not pdf_file.exists():
        print(f"错误: 文件不存在 - {pdf_path}")
        return False
    
    # 设置输出目录
    if output_dir is None:
        output_dir = Path("output") / f"{pdf_file.stem}_pages"
    else:
        output_dir = Path(output_dir)
    
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"转换PDF: {pdf_file.name}")
    print(f"输出目录: {output_dir}")
    print(f"DPI: {dpi}")
    
    try:
        # 使用PyMuPDF转换
        print("正在转换...")
        doc = fitz.open(pdf_path)
        
        print(f"共 {len(doc)} 页")
        
        # 计算缩放比例
        zoom = dpi / 72  # 72是PDF的默认DPI
        mat = fitz.Matrix(zoom, zoom)
        
        # 转换每一页
        for i in range(len(doc)):
            page = doc[i]
            pix = page.get_pixmap(matrix=mat)
            
            output_file = output_dir / f"page_{i+1:03d}.png"
            pix.save(str(output_file))
            
            print(f"✓ 保存: page_{i+1:03d}.png")
        
        doc.close()
        
        print(f"\n转换完成！")
        print(f"图片保存至: {output_dir}")
        print(f"\n提示: Agent可以直接读取这些图片进行视觉分析")
        return True
        
    except Exception as e:
        print(f"错误: {e}")
        print("\n提示:")
        print("- 确保安装了 PyMuPDF:")
        print("  pip install PyMuPDF")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python pdf_to_pages.py <PDF文件> [输出目录]")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else None
    
    success = pdf_to_pages(pdf_path, output_dir)
    sys.exit(0 if success else 1)
