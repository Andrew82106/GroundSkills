# GroundSkills

我的个人技能库 (Ground Skills) - 用于汇总和组织可复用的 AI 技能模块。

## 项目说明

本项目用于存储和管理我在 AI 辅助工作中开发和收集的技能 (skills)。每个技能都是一个独立的、可复用的工具包，提供特定的功能和标准化的工作流程。

## 当前技能

### sci-group-read

系统化文献综述工具包，提供 4 阶段学术论文分析流水线。

**功能特点：**
- 从学术 PDF 中解析和提取结构化数据
- 系统化分析多篇研究论文
- 生成领域级综合分析和趋势报告

**4 阶段工作流：**
1. **Parse（解析）** - 从 PDF 提取元数据和关键章节
2. **Extract（提取）** - 将 PDF 转换为结构化 markdown，按章节组织
3. **Analyze（分析）** - 对单篇论文生成批判性分析
4. **Field（领域综述）** - 跨论文综合领域洞察

**使用方法：**
```bash
# 阶段 1：解析 PDF
/parse <pdf 文件或目录>

# 阶段 2：提取章节
/extract <pdf 文件>

# 阶段 3：深度分析
/analyze <论文目录>

# 阶段 4：领域综述
/field <results 目录>
```

详细内容见 [sci-group-read 文档](sci-group-read/SKILL.md)

## 目录结构

```
SKILLS/
├── README.md                 # 本文件
├── sci-group-read/           # 文献综述技能
│   ├── SKILL.md              # 技能定义和文档
│   ├── scripts/              # Python 脚本工具
│   │   ├── batch_extract.py
│   │   ├── pdf_to_pages.py
│   │   ├── extract_by_pages.py
│   │   └── check_env.py
│   ├── references/           # 参考文档
│   │   ├── workflow-guide.md
│   │   ├── stage2-sop.md
│   │   ├── troubleshooting.md
│   │   └── scripts-guide.md
│   ├── results/              # 分析输出结果
│   └── output/               # 中间文件（页面图片等）
```

## 环境要求

使用技能前需要配置好运行环境：

```bash
# 激活 conda base 环境
conda activate base

# 安装所需 Python 库
pip install PyPDF2 pdfplumber PyMuPDF pdf2image pillow
```

## 使用指南

1. **激活环境**：确保在 conda base 环境中运行
2. **阅读技能文档**：每个技能的 SKILL.md 文件包含详细用法
3. **按顺序执行阶段**：多阶段技能需要按顺序完成
4. **查看输出结果**：结果保存在对应的输出目录中

## 新增技能

如果你有新的技能要添加：

1. 创建新的技能目录（如 `my-new-skill/`）
2. 创建 SKILL.md 文件定义技能
3. 添加必要的脚本和文档
4. 在本 README 中添加技能介绍

## License

Apache-2.0
