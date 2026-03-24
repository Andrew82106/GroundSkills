#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量PDF解析脚本 - 阶段1
从学术PDF中提取元数据、摘要和结论

环境要求：
- 必须在conda base环境中运行
- 需要安装：PyPDF2, pdfplumber, PyMuPDF
"""

import os
import sys
import json
import re
from pathlib import Path

# 环境检查
def check_environment():
    """检查运行环境和依赖"""
    errors = []
    
    # 检查Python路径（应该在conda环境中）
    python_path = sys.executable
    if 'anaconda' not in python_path.lower() and 'conda' not in python_path.lower():
        errors.append(f"⚠️  警告: 当前Python不在conda环境中: {python_path}")
        errors.append("   建议运行: conda activate base")
    
    # 检查必需的库
    required_libs = {
        'PyPDF2': 'PyPDF2',
        'pdfplumber': 'pdfplumber', 
        'fitz': 'PyMuPDF'
    }
    
    missing_libs = []
    for module, package in required_libs.items():
        try:
            __import__(module)
        except ImportError:
            missing_libs.append(package)
    
    if missing_libs:
        errors.append(f"✗ 缺少依赖库: {', '.join(missing_libs)}")
        errors.append(f"   安装命令: pip install {' '.join(missing_libs)}")
    
    if errors:
        print("="*60)
        print("环境检查")
        print("="*60)
        for error in errors:
            print(error)
        print("="*60)
        if missing_libs:
            print("\n无法继续，请先安装缺少的库。")
            return False
    
    return True

# 先检查环境
if not check_environment():
    sys.exit(1)

# 导入依赖
import PyPDF2
import pdfplumber
import fitz  # PyMuPDF
from datetime import datetime

def clean_text(text):
    """清理提取的文本，修复格式问题"""
    if not text:
        return ""
    
    # 移除多余的换行符
    text = re.sub(r'\n+', '\n', text)
    
    # 修复连在一起的单词（在小写字母后紧跟大写字母的地方添加空格）
    # 例如：wordAnother -> word Another
    text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)
    
    # 修复连在一起的句子（在句号后没有空格的地方添加空格）
    text = re.sub(r'\.([A-Z])', r'. \1', text)
    
    # 修复逗号后缺少空格
    text = re.sub(r',([A-Za-z])', r', \1', text)
    
    # 移除多余的空格
    text = re.sub(r' +', ' ', text)
    
    # 清理首尾空白
    text = text.strip()
    
    return text

def extract_text_from_pdf(pdf_path):
    """从PDF提取文本，优先使用PyMuPDF"""
    text = ""
    
    # 方法1：尝试PyMuPDF（通常效果最好）
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text()
        doc.close()
        if text.strip():
            return text
    except Exception as e:
        print(f"PyMuPDF失败: {e}")
    
    # 方法2：尝试pdfplumber
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        if text.strip():
            return text
    except Exception as e:
        print(f"pdfplumber失败: {e}")
    
    # 方法3：尝试PyPDF2
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() or ""
        if text.strip():
            return text
    except Exception as e:
        print(f"PyPDF2失败: {e}")
    
    return None

def extract_section(text, section_keywords, max_length=5000):
    """提取特定章节"""
    text_lower = text.lower()
    
    # 查找章节开始位置
    start_pos = -1
    for keyword in section_keywords:
        pos = text_lower.find(keyword.lower())
        if pos != -1:
            start_pos = pos
            break
    
    if start_pos == -1:
        return ""
    
    # 提取章节内容（限制长度）
    section_text = text[start_pos:start_pos + max_length]
    
    # 清理文本
    section_text = clean_text(section_text)
    
    return section_text.strip()

def parse_pdf(pdf_path):
    """解析单个PDF"""
    print(f"解析: {pdf_path}")
    
    # 提取文本
    text = extract_text_from_pdf(pdf_path)
    if not text:
        return None
    
    # 提取标题（通常在前几行）
    lines = text.split('\n')
    title = lines[0] if lines else "Unknown Title"
    title = clean_text(title)
    
    # 提取摘要
    abstract_keywords = ['abstract', '摘要', 'summary']
    abstract = extract_section(text, abstract_keywords, max_length=2000)
    
    # 提取结论
    conclusion_keywords = ['conclusion', '结论', 'concluding remarks', 'discussion']
    conclusion = extract_section(text, conclusion_keywords, max_length=2000)
    
    # 获取元数据
    file_stat = os.stat(pdf_path)
    
    result = {
        "title": title.strip(),
        "source_file": str(pdf_path),
        "abstract": abstract[:1000] if abstract else "",
        "conclusion": conclusion[:1000] if conclusion else "",
        "metadata": {
            "file_size": f"{file_stat.st_size / (1024*1024):.2f} MB",
            "processed_date": datetime.now().isoformat(),
            "extraction_method": "PyMuPDF/pdfplumber/PyPDF2"
        }
    }
    
    return result

def batch_extract(input_dir, output_dir="results"):
    """批量处理PDF文件"""
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    # 查找所有PDF文件（包括子目录）
    pdf_files = list(input_path.glob("**/*.pdf"))
    
    if not pdf_files:
        print(f"在 {input_dir} 中未找到PDF文件")
        return
    
    print(f"找到 {len(pdf_files)} 个PDF文件")
    
    results = []
    for pdf_file in pdf_files:
        try:
            result = parse_pdf(pdf_file)
            if result:
                # 保存单个结果
                output_file = output_path / f"{pdf_file.stem}_analysis.json"
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(result, f, ensure_ascii=False, indent=2)
                
                results.append({
                    "file": pdf_file.name,
                    "status": "success",
                    "output": str(output_file)
                })
                print(f"✓ 成功: {pdf_file.name}")
            else:
                results.append({
                    "file": pdf_file.name,
                    "status": "failed",
                    "error": "无法提取文本"
                })
                print(f"✗ 失败: {pdf_file.name}")
        except Exception as e:
            results.append({
                "file": pdf_file.name,
                "status": "error",
                "error": str(e)
            })
            print(f"✗ 错误: {pdf_file.name} - {e}")
    
    # 保存批量摘要
    summary = {
        "total_files": len(pdf_files),
        "successful": len([r for r in results if r["status"] == "success"]),
        "failed": len([r for r in results if r["status"] != "success"]),
        "results": results,
        "processed_date": datetime.now().isoformat()
    }
    
    summary_file = output_path / "batch_summary.json"
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    
    print(f"\n批量处理完成！")
    print(f"成功: {summary['successful']}/{summary['total_files']}")
    print(f"摘要保存至: {summary_file}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python batch_extract.py <PDF目录>")
        sys.exit(1)
    
    input_directory = sys.argv[1]
    batch_extract(input_directory)
