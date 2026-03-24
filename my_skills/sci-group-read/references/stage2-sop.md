# 阶段 2 SOP：视觉 + 代码结合的 PDF 提取流程

**版本**: 3.2 (支持热启动)
**最后更新**: 2026-03-13
**测试论文**: AgentAuditor (58 页), R-Judge (24 页)

---

## 0. 工作目录选择与热启动逻辑 ⭐

### 用户输入
```
工作目录路径：/Users/andrewlee/Desktop/fix/sciGroupRead/results/paper_{Name}/
```

### 检查逻辑

```python
import os

def check_working_dir(working_dir):
    """检查工作目录状态，决定启动模式"""

    if not os.path.exists(working_dir):
        # 目录不存在 - 全新开始
        return {
            'mode': 'fresh',
            'message': f'创建新目录：{working_dir}',
            'steps_completed': []
        }

    # 检查已存在的文件
    pages_dir = os.path.join(working_dir, 'pages')
    extracted_dir = os.path.join(working_dir, 'extracted')
    index_file = os.path.join(working_dir, 'index.md')
    vision_report = os.path.join(working_dir, 'VISION_VERIFICATION_REPORT.md')

    steps_completed = []

    if os.path.exists(pages_dir) and len(os.listdir(pages_dir)) > 0:
        steps_completed.append('step1_pdf_to_images')

    if os.path.exists(extracted_dir) and len(os.listdir(extracted_dir)) > 0:
        steps_completed.append('step2_structure_identified')
        steps_completed.append('step3_code_extraction')

    # 检查是否有 COMPLETE 文件
    complete_files = [f for f in os.listdir(extracted_dir) if '_COMPLETE.md' in f]
    if complete_files:
        steps_completed.append('step4_vision_verification')

    if os.path.exists(vision_report):
        steps_completed.append('step5_report_generated')

    if steps_completed:
        return {
            'mode': 'resume',
            'message': f'检测到已有进度，从步骤 {len(steps_completed) + 1}/5 继续',
            'steps_completed': steps_completed,
            'next_step': get_next_step(steps_completed)
        }
    else:
        return {
            'mode': 'fresh',
            'message': '目录为空，从头开始',
            'steps_completed': []
        }
```

### 启动模式决策

| 目录状态 | 已存在文件 | 模式 | 行动 |
|---------|-----------|------|------|
| 不存在 | - | Fresh | 创建目录，从步骤 1 开始 |
| 存在但空 | - | Fresh | 从步骤 1 开始 |
| 存在 | `pages/` 有图片 | Resume | 从步骤 2 继续 |
| 存在 | `pages/` + `extracted/` 有文件 | Resume | 从步骤 4 继续 |
| 存在 | 全部文件 + `VISION_VERIFICATION_REPORT.md` | Complete | 无需操作，或用户要求补充 |

### 热启动示例

**场景 1: 用户给之前处理过的目录**
```
用户：继续处理 paper_AgentAuditor_extracted_v2
检查：pages/ 有 58 张图片，extracted/ 有 19 个文件
决策：热启动，从步骤 4 继续（补充图表验证）
```

**场景 2: 用户给新目录**
```
用户：处理新论文 paper_NewMethod
检查：目录不存在
决策：冷启动，从步骤 1 开始
```

---

## 1. 完整工作流程

```
输入：PDF 文件
  │
  ├─→ 步骤 1: PDF 转图片 (PyMuPDF)
  │     输出：page_001.png ~ page_NNN.png
  │
  ├─→ 步骤 2: 视觉扫描关键页 → 确定章节结构
  │     读取：Page 1, 3, 6, 10, 23 (或类似关键页)
  │     输出：章节结构表 (章节名 + 起止页码)
  │
  ├─→ 步骤 3: 代码批量提取 → 按章节切分
  │     工具：PyMuPDF (fitz)
  │     输出：XX_chapter_name.md (19 个文件)
  │
  ├─→ 步骤 4: 视觉抽查验证 → 补充图表内容
  │     检查：Figure/Table 所在页
  │     输出：XX_chapter_name_COMPLETE.md (3-5 个文件)
  │
  └─→ 步骤 5: 生成验证报告
        输出：VISION_VERIFICATION_REPORT.md
```

---

## 2. 步骤详解

### 步骤 1: PDF 转图片

**脚本**: `pdf_to_images.py`

```python
import fitz

def pdf_to_images(pdf_path, output_dir, dpi=150):
    doc = fitz.open(pdf_path)
    for i in range(len(doc)):
        page = doc[i]
        zoom = dpi / 72  # 150 DPI
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)
        pix.save(f"{output_dir}/page_{i+1:03d}.png")
    doc.close()
```

**输出**: `page_001.png`, `page_002.png`, ..., `page_NNN.png`

---

### 步骤 2: 视觉扫描确定结构

**读取以下关键页**:

| 页码类型 | 目的 | 识别内容 |
|---------|------|---------|
| Page 1 | 标题页 | 标题、作者、Abstract、Introduction |
| Page 2-3 | 早期章节 | Related Work, Preliminaries, Method |
| Page 6-7 | 中期章节 | Benchmark, Experiments |
| Page 10-11 | 后期章节 | Results, Limitation, Conclusion |
| 倒数第二页 | Appendix 目录 | 所有附录子章节 |

**输出章节结构表**:

```python
CHAPTER_STRUCTURE = [
    ('Abstract', 1, 1),
    ('Introduction', 1, 2),
    ('Related_Work', 2, 3),
    ('Method', 3, 5),
    ('Experiments', 6, 9),
    ('Conclusion', 10, 10),
    ('References', 11, 22),
    ('Appendix', 23, 58),
]
```

---

### 步骤 3: 代码批量提取

**脚本**: `extract_by_structure_v2.py`

```python
import fitz

CHAPTER_STRUCTURE = [...]  # 从步骤 2 获取

def extract_all_chapters(pdf_path, output_dir):
    doc = fitz.open(pdf_path)

    for chapter_name, start_page, end_page in CHAPTER_STRUCTURE:
        chapter_text = ""
        for i in range(start_page - 1, min(end_page, len(doc))):
            page = doc[i]
            chapter_text += page.get_text("text")

        # 保存章节文件
        filename = f"{idx+1:02d}_{chapter_name}.md"
        with open(f"{output_dir}/{filename}", 'w') as f:
            f.write(f"# {chapter_name}\n\n")
            f.write(chapter_text)

    doc.close()
```

**输出**:
- `01_Abstract.md`
- `02_Introduction.md`
- `...`
- `full_text.md` (全文备份)
- `index.md` (章节索引)

---

### 步骤 4: 视觉抽查验证

**检查清单**:

| 检查项 | 识别方法 | 处理 |
|-------|---------|-----|
| Figure | 读图，描述内容 | 补充到 COMPLETE 文件 |
| Table | 读图，转录为 Markdown 表格 | 补充到 COMPLETE 文件 |
| 公式 | 检查代码提取是否正确 | 修正 LaTeX 格式 |
| 流程图 | 详细描述流程步骤 | 补充到 COMPLETE 文件 |

**COMPLETE 文件格式**:

```markdown
# Chapter Name

## Figure X: [图表标题]

**位置**: 第 Y 页

**视觉描述**: [详细描述图的内容]

**内容转录**:
- 元素 1: ...
- 元素 2: ...

---

## 正文内容

[代码提取的文本]
```

---

### 步骤 5: 生成验证报告

**脚本**: 手动创建 `VISION_VERIFICATION_REPORT.md`

**内容**:

```markdown
# 视觉验证报告

## 提取质量评估

| 章节 | 质量 | 图表丢失 | 补充文件 |
|------|------|---------|---------|
| Abstract | ✅ | 无 | - |
| Method | ⚠️ | Figure 2 | 04_COMPLETE.md |
| ... | ... | ... | ... |

## 补充的图表

- Figure 2: Workflow (p4) ✅
- Figure 3: Risk Categories (p6) ✅
- Figure 4: Results (p10) ✅

## 待验证内容

- Appendix A-J (p23-58) - 待检查
```

---

## 2. 输出目录结构

```
results/
└── paper_{Name}/
    ├── pages/                    # PDF 页面图片
    │   ├── page_001.png
    │   ├── page_002.png
    │   └── ...
    ├── extracted/                # 提取的章节
    │   ├── 01_Abstract.md
    │   ├── 02_Introduction.md
    │   ├── 03_Method_COMPLETE.md  ← 视觉补充
    │   ├── full_text.md
    │   ├── index.md
    │   └── VISION_VERIFICATION_REPORT.md
    └── sop_status.md             # 处理状态记录
```

---

## 3. 脚本文件清单

| 脚本 | 用途 |
|-----|------|
| `pdf_to_images.py` | PDF 转 PNG 图片 |
| `extract_by_structure_v2.py` | 按章节提取文本 |
| `vision_extract.py` | 创建视觉识别索引 |

---

## 4. 时间估算

| 步骤 | 耗时 |
|------|------|
| 步骤 1: PDF 转图片 | 30 秒/页 × 58 页 ≈ 30 秒 |
| 步骤 2: 视觉扫描 | 5 分钟 (读 6-8 页) |
| 步骤 3: 代码提取 | 1 分钟 |
| 步骤 4: 视觉验证 | 30 分钟 (3-5 个图表) |
| 步骤 5: 生成报告 | 5 分钟 |
| **总计** | **约 45 分钟/篇** |

---

## 5. 质量标准

| 指标 | 目标 |
|------|------|
| 章节识别准确率 | 100% |
| 文本提取完整度 | >95% |
| 图表补充覆盖率 | 100% (正文 Figures/Tables) |
| 公式正确率 | >90% |

---

## 6. 常见问题与解决方案

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 文本丢失空格 | pdfplumber 问题 | 改用 PyMuPDF |
| 图表内容丢失 | 文本提取限制 | 视觉识别补充 |
| 章节边界错误 | 正则匹配过宽 | 视觉确认边界 |
| 公式格式错误 | PDF 编码问题 | 手动修正 LaTeX |

---

## 7. 测试案例汇总

| 论文 | 页数 | 章节数 | 图表数 | 完成度 |
|------|------|--------|--------|--------|
| AgentAuditor | 58 | 19 | 4 | 60% (正文完成) |
| R-Judge | 24 | 8 | 10 | 100% ✅ |

---

**状态**: 生产就绪 ✅ (支持热启动)
**下一步**: 应用到剩余 5 篇论文

---

## 附录 A：热启动状态检查表

在处理每篇论文之前，先运行此检查：

```markdown
### 论文处理状态检查

**论文名称**: _______________
**工作目录**: _______________

#### 步骤完成情况

- [ ] 步骤 1: PDF 转图片
  - 检查：`pages/` 目录是否有 PNG 文件
  - 数量：____ / 总页数

- [ ] 步骤 2: 视觉扫描确定结构
  - 检查：是否有章节结构定义
  - 来源：`index.md` 或 `sop_status.md`

- [ ] 步骤 3: 代码批量提取
  - 检查：`extracted/` 目录是否有章节文件
  - 数量：____ 个文件

- [ ] 步骤 4: 视觉抽查验证
  - 检查：是否有 `_COMPLETE.md` 文件
  - 数量：____ 个文件

- [ ] 步骤 5: 生成验证报告
  - 检查：`VISION_VERIFICATION_REPORT.md` 是否存在

#### 下一步行动

基于以上检查，下一步应该执行：步骤 ___
```

---

## 附录 B：用户交互示例

### 场景 1：全新处理

```
用户：处理这篇论文 /path/to/new_paper.pdf
AI: 检测到这是新论文，开始阶段 2 流程
    步骤 1/5: PDF 转图片...
    ✅ 完成：生成 24 页图片
    步骤 2/5: 视觉扫描关键页...
    ...
```

### 场景 2：热启动继续

```
用户：继续处理 paper_AgentAuditor_extracted_v2
AI: 检测到已有进度：
    ✅ 步骤 1: 58 页图片已完成
    ✅ 步骤 2: 章节结构已识别
    ✅ 步骤 3: 19 个章节已提取
    ⏳ 步骤 4: 视觉验证待完成 (3 个章节需要补充图表)

    从步骤 4 继续...
```

### 场景 3：补充特定内容

```
用户：这篇论文的 Appendix 还没检查，补充一下
AI: 检测到论文已处理完成
    当前完成度：60% (正文完成)
    待补充：Appendix A-J (p23-58)

    开始补充验证...
```
