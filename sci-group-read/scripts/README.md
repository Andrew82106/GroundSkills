# sciGroupRead 脚本

这些脚本支持 sci-group-read 技能的4阶段论文分析流水线。

## ⚠️ 重要：环境要求

**所有脚本必须在conda base环境中运行！**

### 环境设置

```bash
# 1. 激活conda base环境
conda activate base

# 2. 验证环境
which python3
# 应该显示类似：/Users/andrewlee/anaconda3/bin/python3

# 3. 安装所需库
pip install PyPDF2 pdfplumber PyMuPDF pdf2image pillow

# 4. 验证安装
python3 -c "import PyPDF2, pdfplumber, fitz, pdf2image; print('✓ 所有库已安装')"
```

### 重要说明

- ⚠️ **不需要安装poppler**！Agent本身就是视觉模型
- pdf2image使用PyMuPDF作为后端，不依赖外部工具
- Agent可以直接读取图片，识别文本、图表、公式等内容

### 为什么需要conda环境？

- 脚本依赖多个PDF处理库（PyPDF2、pdfplumber、PyMuPDF）
- 这些库可能在系统Python中未安装
- conda base环境通常已配置好科学计算相关的依赖
- 避免权限问题和版本冲突

### Agent的视觉能力

- ⚠️ **Agent本身就是视觉模型**，可以直接读取和理解图片
- 在阶段2中，Agent会：
  1. 读取PDF转换的图片
  2. 识别章节结构和边界
  3. 补充代码提取遗漏的图表、公式
  4. 验证提取质量
- 不需要外部OCR或视觉API

### 环境检查

脚本会自动检查环境，如果不在conda环境中会显示警告：

```
⚠️  警告: 当前Python不在conda环境中
   建议运行: conda activate base
```

如果缺少依赖库，脚本会提示安装命令。

## 脚本列表

### 0. check_env.py - 环境检查

检查运行环境和所有依赖。

**用法：**
```bash
python check_env.py
```

**输出示例：**
```
✓ 在conda环境中
✓ PyPDF2
✓ pdfplumber
✓ PyMuPDF
✓ pdf2image
✓ pillow
✓ 环境检查通过！
```

**建议：** 在运行其他脚本前先运行此检查。

---

### 1. batch_extract.py - 阶段1：批量解析

从PDF提取元数据、摘要和结论。

**用法：**
```bash
python batch_extract.py <PDF目录>
```

**示例：**
```bash
python batch_extract.py ~/Desktop/fix/papers
```

**输出：**
- `results/{paper}_analysis.json` - 每篇论文的分析结果
- `results/batch_summary.json` - 批量处理摘要

**依赖：**
```bash
pip install PyPDF2 pdfplumber
```

### 2. pdf_to_pages.py - 阶段2：PDF转图片

将PDF页面转换为图片用于视觉分析。

**用法：**
```bash
python pdf_to_pages.py <PDF文件> [输出目录]
```

**示例：**
```bash
python pdf_to_pages.py papers/paper1.pdf
python pdf_to_pages.py papers/paper1.pdf output/custom_dir
```

**输出：**
- `output/{pdf名称}_pages/page_1.png`
- `output/{pdf名称}_pages/page_2.png`
- ...

**依赖：**
```bash
# Python库
pip install pdf2image pillow

# 系统依赖
# macOS:
brew install poppler

# Ubuntu/Debian:
sudo apt-get install poppler-utils
```

### 3. extract_by_pages.py - 阶段2步骤3：按章节提取

根据章节结构从PDF提取文本并按章节组织。

**重要**：此脚本执行阶段2的步骤3，必须在步骤2（Agent视觉识别章节结构）之后运行。

**用法：**
```bash
# 方式1：提供章节结构JSON
python extract_by_pages.py <PDF文件> <章节结构JSON>

# 方式2：从输出目录读取chapter_structure.json
python extract_by_pages.py <PDF文件> <输出目录>
```

**示例：**
```bash
# 方式1
python extract_by_pages.py paper.pdf structure.json

# 方式2（推荐）
python extract_by_pages.py paper.pdf results/paper_DeceptionBench/
```

**输入要求：**
- PDF文件路径
- 章节结构JSON（由Agent在步骤2创建）

**输出：**
- `sections/01_Abstract.md` - 各章节markdown文件
- `sections/02_Introduction.md`
- ...
- `full_text.md` - 完整文本
- `index.md` - 章节索引
- `chapter_structure.json` - 章节结构（如果不存在）

**章节结构JSON格式：**
```json
{
  "total_pages": 28,
  "chapters": [
    {"name": "Abstract", "start_page": 1, "end_page": 1},
    {"name": "Introduction", "start_page": 1, "end_page": 2},
    {"name": "Method", "start_page": 3, "end_page": 5}
  ]
}
```

**工作流程：**
1. Agent完成步骤2，创建 `chapter_structure.json`
2. 运行此脚本提取文本
3. Agent继续步骤4，读取图片补充内容

**注意：**
- 此脚本只提取文本，不处理图表
- 图表内容由Agent在步骤4补充
- 参考：`.claude/skills/sciGroupRead/references/stage2-sop.md`

## 完整工作流示例

```bash
# 阶段1：解析所有PDF
python batch_extract.py papers/

# 阶段2：提取单篇论文
python pdf_to_pages.py papers/paper1.pdf
python extract_by_pages.py output/paper1_pages Paper1

# 阶段3-4：使用技能命令
# /analyze results/paper_Paper1/
# /field results/
```

## 批量处理脚本

创建 `process_all.sh`：

```bash
#!/bin/bash
# 批量处理所有论文

PAPERS_DIR="$1"

# 阶段1
python .claude/skills/sciGroupRead/scripts/batch_extract.py "$PAPERS_DIR"

# 阶段2
for pdf in "$PAPERS_DIR"/*.pdf; do
    echo "处理: $pdf"
    python .claude/skills/sciGroupRead/scripts/pdf_to_pages.py "$pdf"
    
    paper_name=$(basename "$pdf" .pdf)
    python .claude/skills/sciGroupRead/scripts/extract_by_pages.py "output/${paper_name}_pages" "$paper_name"
done

echo "完成！现在可以运行 /analyze 和 /field 命令"
```

使用：
```bash
chmod +x process_all.sh
./process_all.sh papers/
```

## 故障排查

### 问题：无法导入模块

```bash
pip install PyPDF2 pdfplumber pdf2image pillow
```

### 问题：pdf2image 错误

确保安装了 poppler：
```bash
# macOS
brew install poppler

# Ubuntu
sudo apt-get install poppler-utils
```

### 问题：提取文本失败

- 检查PDF是否基于文本（不是扫描版）
- 尝试用PDF阅读器打开验证
- 扫描版PDF需要先OCR处理

## 更多信息

详细文档见：
- [工作流指南](../references/workflow-guide.md)
- [故障排查指南](../references/troubleshooting.md)
- [脚本详细文档](../references/scripts-guide.md)
