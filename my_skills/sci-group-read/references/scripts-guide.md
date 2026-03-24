# 脚本指南

sci-group-read 技能中使用的Python脚本详细文档。

## 概述

技能使用位于 `scripts/` 的三个主要Python脚本：

1. `batch_extract.py` - 阶段1：批量PDF解析
2. `pdf_to_pages.py` - 阶段2：PDF转图片
3. `extract_by_pages.py` - 阶段2：基于章节的文本提取

## batch_extract.py

从学术PDF中提取元数据、摘要和结论。

### 用法

```bash
python scripts/batch_extract.py <输入目录>
```

### 参数

- `输入目录`：包含PDF文件的目录路径

### 输出

在 `results/` 目录创建JSON文件：
- 每个PDF生成 `{paper}_analysis.json`
- 包含处理摘要的 `batch_summary.json`

### 示例

```bash
python scripts/batch_extract.py ~/research/papers/
```

### 输出格式

```json
{
  "title": "论文标题",
  "authors": ["作者1", "作者2"],
  "year": "2024",
  "abstract": "完整摘要文本...",
  "conclusion": "完整结论文本...",
  "metadata": {
    "pages": 12,
    "file_size": "2.3 MB",
    "processed_date": "2024-03-15"
  }
}
```

### 高级选项

编辑脚本以自定义：
- 文本提取方法
- 章节检测模式
- 输出格式
- 错误处理

### 常见问题

**问题**：无法从PDF提取文本
**解决**：PDF可能是图像型。使用OCR预处理。

**问题**：缺少摘要或结论
**解决**：检查章节是否使用非标准标题。调整脚本中的正则表达式模式。

## pdf_to_pages.py

将PDF页面转换为高质量图片，用于基于视觉的章节检测。

### 用法

```bash
python scripts/pdf_to_pages.py <pdf文件> [输出目录]
```

### 参数

- `pdf文件`：PDF文件路径
- `输出目录`（可选）：保存图片的位置（默认：`output/{pdf名称}_pages/`）

### 输出

创建编号的PNG图片：
```
output/paper_name_pages/
├── page_1.png
├── page_2.png
├── page_3.png
└── ...
```

### 示例

```bash
python scripts/pdf_to_pages.py ~/papers/attention.pdf
```

### 配置

编辑脚本以调整：

```python
# 图片质量（DPI）
DPI = 300  # 越高 = 质量越好，文件越大

# 图片格式
FORMAT = 'PNG'  # PNG、JPEG等

# 压缩
OPTIMIZE = True  # 减小文件大小
```

### 性能提示

1. **DPI设置**：
   - 150 DPI：快速，较低质量（适合测试）
   - 300 DPI：平衡（推荐）
   - 600 DPI：高质量，慢（用于复杂布局）

2. **磁盘空间**：
   - 估算：300 DPI时每页约500KB
   - 100页论文 ≈ 50MB

3. **处理时间**：
   - 300 DPI时每页约1-2秒

### 常见问题

**问题**：内存不足错误
**解决**：分批处理页面。降低DPI设置。

**问题**：转换缓慢
**解决**：降低DPI或使用JPEG格式代替PNG。

## extract_by_pages.py

使用视觉模型从页面图片提取文本并按章节组织。

### 用法

```bash
python scripts/extract_by_pages.py <图片目录> [论文名称]
```

### 参数

- `图片目录`：包含页面图片的目录
- `论文名称`（可选）：输出目录的名称

### 输出

创建结构化markdown文件：
```
results/paper_{Name}/
├── sections/
│   ├── 01_Abstract.md
│   ├── 02_Introduction.md
│   └── ...
├── full_text.md
├── index.md
├── chapter_structure.json
└── VISION_VERIFICATION_REPORT.md
```

### 示例

```bash
python scripts/extract_by_pages.py output/attention_pages/ AttentionMechanisms
```

### 章节检测

脚本通过以下方式识别章节：
1. 分析页面布局和排版
2. 检测标题样式和大小
3. 识别常见章节模式
4. 验证章节边界

### 配置

编辑脚本以自定义：

```python
# 章节检测灵敏度
HEADING_THRESHOLD = 0.8  # 0.0-1.0，越高 = 越严格

# 要检测的常见章节名称
SECTION_PATTERNS = [
    'abstract', 'introduction', 'related work',
    'methodology', 'experiments', 'results',
    'discussion', 'conclusion', 'references'
]

# 最小章节长度（单词数）
MIN_SECTION_LENGTH = 50
```

### 验证报告

`VISION_VERIFICATION_REPORT.md` 包含：
- 章节检测置信度分数
- 文本提取质量指标
- 潜在问题和警告
- 手动审查建议

### 常见问题

**问题**：章节合并不正确
**解决**：降低 `HEADING_THRESHOLD` 或手动调整 `chapter_structure.json`。

**问题**：缺少章节
**解决**：检查章节名称是否匹配 `SECTION_PATTERNS`。如需要添加自定义模式。

**问题**：文本质量差
**解决**：在 `pdf_to_pages.py` 中提高DPI或检查原始PDF质量。

## 与技能命令的集成

脚本由技能命令自动调用：

| 命令 | 使用的脚本 |
|---------|--------------|
| `/parse` | `batch_extract.py` |
| `/extract` | `pdf_to_pages.py` → `extract_by_pages.py` |
| `/analyze` | （使用提取的markdown文件） |
| `/field` | （使用分析文件） |

## 高级自动化

### 批量处理脚本

```bash
#!/bin/bash
# process_all.sh - 完整流水线自动化

INPUT_DIR="$1"
RESULTS_DIR="results"

echo "阶段1：解析PDF..."
python scripts/batch_extract.py "$INPUT_DIR"

echo "阶段2-3：提取和分析..."
for pdf in "$INPUT_DIR"/*.pdf; do
    echo "处理中: $pdf"
    
    # 提取
    python scripts/pdf_to_pages.py "$pdf"
    
    # 获取论文名称
    paper_name=$(basename "$pdf" .pdf)
    images_dir="output/${paper_name}_pages"
    
    # 按页提取
    python scripts/extract_by_pages.py "$images_dir" "$paper_name"
    
    # 分析（会调用agent）
    echo "准备分析: results/paper_$paper_name/"
done

echo "阶段4：准备领域综述"
echo "运行: /field results/"
```

### 并行处理

```bash
#!/bin/bash
# parallel_process.sh - 并行处理多个PDF

INPUT_DIR="$1"
MAX_JOBS=4  # 根据系统资源调整

export -f process_single_pdf

process_single_pdf() {
    pdf="$1"
    python scripts/pdf_to_pages.py "$pdf"
    paper_name=$(basename "$pdf" .pdf)
    python scripts/extract_by_pages.py "output/${paper_name}_pages" "$paper_name"
}

find "$INPUT_DIR" -name "*.pdf" | \
    xargs -n 1 -P "$MAX_JOBS" -I {} bash -c 'process_single_pdf "{}"'
```

## 依赖项

所需Python包：

```bash
pip install PyPDF2 pdfplumber pdf2image pillow
```

系统依赖：

```bash
# macOS
brew install poppler

# Ubuntu/Debian
sudo apt-get install poppler-utils

# Windows
# 从以下地址下载poppler二进制文件：
# https://github.com/oschwartz10612/poppler-windows
```

## 性能优化

### 对于大批量

1. **使用SSD存储** 以获得更快的I/O
2. **增加RAM分配** 给Python进程
3. **并行处理**（见并行处理脚本）
4. **清理中间文件** 在每篇论文后

### 对于大型PDF

1. **分块处理页面**（修改脚本）
2. **使用较低DPI** 进行初始测试
3. **增加超时设置**
4. **监控磁盘空间** 在处理期间

## 故障排查

常见问题和解决方案见[故障排查指南](troubleshooting.md)。

## 扩展脚本

### 添加自定义提取器

```python
# custom_extractor.py
def extract_custom_section(pdf_path, section_name):
    """从PDF提取特定章节"""
    # 你的实现
    pass
```

### 自定义章节模式

```python
# 在 extract_by_pages.py 中
CUSTOM_PATTERNS = {
    'methodology': ['method', 'approach', 'framework'],
    'evaluation': ['evaluation', 'experiments', 'results'],
    'limitations': ['limitation', 'future work', 'discussion']
}
```

### 输出格式自定义

```python
# 自定义markdown格式化器
def format_section(section_name, content):
    return f"# {section_name}\n\n{content}\n\n---\n"
```

## 最佳实践

1. **用样本PDF测试** 在批量处理前
2. **监控资源使用** 在处理期间
3. **备份原始PDF** 在处理前
4. **检查验证报告** 在提取后
5. **清理中间文件** 以节省空间
6. **使用版本控制** 管理脚本修改

## 下一步

- 查看[工作流指南](workflow-guide.md)了解完整使用示例
- 查看[故障排查指南](troubleshooting.md)了解问题解决
- 查看[示例](examples/)了解样本输出
