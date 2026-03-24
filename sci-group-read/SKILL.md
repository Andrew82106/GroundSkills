---
name: sci-group-read
description: 用于系统化分析学术论文的技能。提供4阶段流水线：解析PDF、提取结构化内容、深度分析、跨论文领域综述。使用前请确保激活conda base环境。
license: Apache-2.0
metadata:
  author: andrewlee
  version: "1.0"
  category: academic-research
compatibility: 需要 Python 3.8+、PDF处理库（PyPDF2、pdfplumber、PyMuPDF）以及视觉模型访问权限用于章节识别。必须在conda base环境中运行。
allowed-tools: Bash(python:*) Bash(jq:*) Read Write
---

# sci-group-read

系统化文献综述工具包，提供4阶段学术论文分析流水线。

## ⚠️ Agent使用指南

**关键要点**：
1. **你是视觉模型** - 可以直接读取和理解图片，不需要外部OCR
2. **遵循SOP** - 阶段2必须严格按照 [stage2-sop.md](references/stage2-sop.md) 的5步流程
3. **使用现有脚本** - 不要自己写脚本，使用 `scripts/` 目录中的脚本
4. **步骤顺序** - 每个阶段的步骤必须按顺序执行

**阶段2特别说明**：
- 步骤1和3运行Python脚本
- 步骤2、4、5由Agent直接操作（读图片、创建文件）
- 不要跳过任何步骤

## ⚠️ 重要：环境配置

**在使用此技能前，必须确保使用conda base环境：**

```bash
# 激活conda base环境
conda activate base

# 验证环境
which python3
# 应该显示：/Users/andrewlee/anaconda3/bin/python3 或类似路径

# 验证所需库
python3 -c "import PyPDF2, pdfplumber, fitz; print('✓ 所有库已安装')"
```

**如果缺少库，请安装：**
```bash
conda activate base
pip install PyPDF2 pdfplumber PyMuPDF pdf2image pillow
```

**注意**：
- 不需要安装poppler！Agent可以直接读取图片
- pdf2image仅用于将PDF转为图片，不依赖poppler
- Agent本身就是视觉模型，可以识别图片中的文本、图表、公式

## 何时使用此技能

在以下场景使用此技能：
- 从学术PDF中解析和提取结构化数据
- 系统化分析多篇研究论文
- 生成领域级综合分析和趋势报告
- 进行全面的文献综述

## 前置条件检查

使用技能前，agent应该执行以下检查：

```bash
# 快速检查：运行环境检查脚本
python3 .claude/skills/sciGroupRead/scripts/check_env.py

# 或手动检查：
# 1. 确认conda环境
conda info --envs | grep "base"

# 2. 验证Python路径（应该在conda目录下）
which python3

# 3. 检查必需的库
python3 -c "import PyPDF2, pdfplumber, fitz, pdf2image; print('✓ 环境就绪')" || echo "✗ 缺少依赖库"
```

如果检查失败，提示用户：
```bash
conda activate base
pip install PyPDF2 pdfplumber PyMuPDF pdf2image pillow
```

## 快速开始

技能分为4个顺序阶段：

1. **Parse（解析）** - 从PDF提取元数据和关键章节
2. **Extract（提取）** - 将PDF转换为结构化markdown，按章节组织
3. **Analyze（分析）** - 对单篇论文生成批判性分析
4. **Field（领域综述）** - 跨论文综合领域洞察

### 阶段1：解析PDF

```bash
/parse <pdf文件或目录>
```

**输入**：PDF文件或包含PDF的目录  
**输出**：每篇论文生成 `results/{paper}_analysis.json`

**示例**：
```bash
/parse ~/Downloads/papers/
```

### 阶段2：提取章节

```bash
/extract <pdf文件>
```

**输入**：单个PDF文件  
**输出**：`results/paper_{Name}/` 目录，包含结构化markdown文件

**重要说明**：
- ⚠️ **Agent本身就是视觉模型**，可以直接读取图片
- 不需要安装poppler或其他外部工具
- 必须按照 [stage2-sop.md](references/stage2-sop.md) 的5步流程操作

**完整流程（5步）**：

1. **PDF转图片** - 运行脚本
   ```bash
   python3 .claude/skills/sciGroupRead/scripts/pdf_to_pages.py <pdf文件>
   ```

2. **视觉识别章节结构** - Agent读取关键页图片
   - Agent读取第1、3、6、10页等关键页
   - 识别章节标题和页码范围
   - 创建 `chapter_structure.json`

3. **代码批量提取** - 运行脚本
   ```bash
   python3 .claude/skills/sciGroupRead/scripts/extract_by_pages.py <pdf文件> <输出目录>
   ```

4. **视觉补充验证** - Agent读取图片补充内容
   - Agent读取包含图表的页面
   - 补充图表描述、公式等
   - 创建 `*_COMPLETE.md` 文件

5. **生成验证报告** - Agent创建报告
   - 创建 `VISION_VERIFICATION_REPORT.md`

**示例**：
```bash
/extract ~/papers/transformer-paper.pdf
```

详细流程见：[阶段2操作规范](references/stage2-sop.md)

### 阶段3：深度分析

```bash
/analyze <论文目录>
```

**输入**：阶段2生成的目录  
**输出**：`deep_analysis.md` 批判性评估报告

**示例**：
```bash
/analyze results/paper_DeceptionBench/
```

### 阶段4：领域综述

```bash
/field <results目录>
```

**输入**：包含多篇已分析论文的 `results/` 目录  
**输出**：`field_analysis_report.md` 领域级洞察报告

**示例**：
```bash
/field results/
```

## 工作流程

```
PDF 文件
    ↓
┌─────────┐
│ /parse  │ → results/{paper}_analysis.json
└────┬────┘
     ↓
┌─────────┐
│/extract │ → results/paper_{Name}/sections/*.md
└────┬────┘
     ↓
┌─────────┐
│/analyze │ → deep_analysis.md
└────┬────┘
     ↓
┌─────────┐
│ /field  │ → field_analysis_report.md
└─────────┘
```

## 可用资源

- [详细工作流指南](references/workflow-guide.md)
- [阶段2操作规范](references/stage2-sop.md)
- [故障排查指南](references/troubleshooting.md)
- [输出示例](references/examples/)

## 支持脚本

技能使用位于 `scripts/` 目录的Python脚本：

- `batch_extract.py` - 批量PDF解析（阶段1）
- `pdf_to_pages.py` - PDF转图片（阶段2）
- `extract_by_pages.py` - 基于章节的文本提取（阶段2）

详细使用方法见[脚本文档](references/scripts-guide.md)。

## 常见边界情况

1. **扫描版PDF**：阶段1可能在图像型PDF上失败。需先进行OCR预处理。
2. **复杂布局**：多栏或特殊布局可能需要手动调整章节边界。
3. **大文件**：超过100页的PDF可能需要增加超时设置。
4. **缺失章节**：如果提取遗漏章节，检查阶段2输出的验证报告。

## 输出结构

```
results/
├── paper1_analysis.json          # 阶段1输出
├── paper2_analysis.json
├── paper_Paper1/                 # 阶段2输出
│   ├── sections/
│   │   ├── 01_Abstract.md
│   │   ├── 02_Introduction.md
│   │   └── ...
│   ├── full_text.md
│   ├── index.md
│   └── deep_analysis.md          # 阶段3输出
└── field_analysis_report.md      # 阶段4输出
```

## 最佳实践

1. 按顺序完成所有阶段后再处理下一篇论文
2. 阶段2后检查验证报告以确保提取质量
3. 将原始PDF保存在独立于results的目录
4. 使用描述性的论文名称便于追踪
5. 运行阶段4前确保所有论文都完成了阶段3

详细说明和示例见[工作流指南](references/workflow-guide.md)。
