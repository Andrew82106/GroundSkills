#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
环境检查脚本
验证sci-group-read技能所需的环境和依赖
"""

import sys
import os

def check_environment():
    """完整的环境检查"""
    print("="*70)
    print("  sci-group-read 环境检查")
    print("="*70)
    
    all_ok = True
    
    # 1. 检查Python环境
    print("\n1. Python环境")
    print("-"*70)
    python_path = sys.executable
    print(f"   Python路径: {python_path}")
    print(f"   Python版本: {sys.version.split()[0]}")
    
    if 'anaconda' in python_path.lower() or 'conda' in python_path.lower():
        print("   ✓ 在conda环境中")
    else:
        print("   ⚠️  不在conda环境中")
        print("   建议: conda activate base")
        all_ok = False
    
    # 2. 检查必需的库
    print("\n2. Python库依赖")
    print("-"*70)
    
    required_libs = {
        'PyPDF2': 'PyPDF2',
        'pdfplumber': 'pdfplumber',
        'fitz': 'PyMuPDF',
        'pdf2image': 'pdf2image',
        'PIL': 'pillow'
    }
    
    missing_libs = []
    for module, package in required_libs.items():
        try:
            __import__(module)
            print(f"   ✓ {package}")
        except ImportError:
            print(f"   ✗ {package} (未安装)")
            missing_libs.append(package)
            all_ok = False
    
    if missing_libs:
        print(f"\n   安装命令: pip install {' '.join(missing_libs)}")
    
    # 3. Agent视觉能力说明
    print("\n3. Agent视觉能力")
    print("-"*70)
    print("   ✓ Agent本身就是视觉模型")
    print("   ✓ 可以直接读取和理解图片")
    print("   ✓ 不需要外部OCR或视觉API")
    print("   ℹ️  在阶段2中，Agent会读取图片识别章节和补充内容")
    
    # 4. 检查工作目录
    print("\n4. 工作目录")
    print("-"*70)
    cwd = os.getcwd()
    print(f"   当前目录: {cwd}")
    
    # 检查是否有papers目录
    if os.path.exists('papers'):
        print("   ✓ papers目录存在")
    else:
        print("   ⚠️  papers目录不存在")
    
    # 检查是否有results目录
    if os.path.exists('results'):
        print("   ✓ results目录存在")
    else:
        print("   ℹ️  results目录不存在（首次运行时会自动创建）")
    
    # 总结
    print("\n" + "="*70)
    if all_ok:
        print("  ✓ 环境检查通过！可以开始使用sci-group-read技能")
    else:
        print("  ✗ 环境检查失败，请按照上述提示修复问题")
    print("="*70)
    
    return all_ok

if __name__ == "__main__":
    success = check_environment()
    sys.exit(0 if success else 1)
