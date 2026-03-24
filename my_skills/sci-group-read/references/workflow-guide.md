# 工作流指南

使用 sci-group-read 技能进行系统化文献综述的完整指南。

## 概述

sci-group-read 技能提供结构化的4阶段流水线来分析学术论文：

1. **Parse（解析）** - 提取结构化元数据
2. **Extract（提取）** - 转换为带章节的markdown
3. **Analyze（分析）** - 生成批判性分析
4. **Field（领域综述）** - 综合领域洞察

## 完整工作流示例

### 场景：分析ICML 2024的NLP论文

#### 步骤1：整理论文

```bash
mkdir ~/research/icml-2024-nlp
# 将所有PDF文件放入此目录
```

#### 步骤2：解析所有论文（阶段1）

```bash
/parse ~/research/icml-2024-nlp/
```

**发生了什么：**
- 从每个PDF提取标题、作者、摘要、结论
- 为每篇论文创建 `results/{paper}_analysis.json`
- 生成包含概览的 `batch_summary.json`

**预期输出：**
```
results/
├── paper1_analysis.json
├── paper2_analysis.json
├── paper3_analysis.json
└── batch_summary.json
```

**检查：** 查看 `batch_summary.json` 验证所有论文都成功解析。

#### 步骤3：提取章节（阶段2）

对每篇需要深度分析的论文：

```bash
/extract ~/research/icml-2024-nlp/attention-mechanisms.pdf
```

**发生了什么：**
- 将PDF转换为图片（每页一张）
- 使用视觉模型识别章节边界
- 提取每个章节的文本
- 创建结构化markdown文件
- 生成验证报告

**预期输出：**
```
results/paper_AttentionMechanisms/
├── sections/
│   ├── 01_Abstract.md
│   ├── 02_Introduction.md
│   ├── 03_Methodology.md
│   ├── 04_Experiments.md
│   ├── 05_Results.md
│   ├── 06_Conclusion.md
│   └── 07_References.md
├── full_text.md
├── index.md
└── VISION_VERIFICATION_REPORT.md
```

**检查：** 查看 `VISION_VERIFICATION_REPORT.md` 了解提取质量指标。

#### 步骤4：深度分析（阶段3）

```bash
/analyze results/paper_AttentionMechanisms/
```

**发生了什么：**
- 读取所有章节markdown文件
- 执行批判性分析
- 评估方法论、贡献、局限性
- 识别与相关工作的联系

**预期输出：**
```
results/paper_AttentionMechanisms/deep_analysis.md
```

**检查：** 阅读分析以理解关键洞察。

#### 步骤5：对其他论文重复步骤3-4

```bash
/extract ~/research/icml-2024-nlp/transformer-variants.pdf
/analyze results/paper_TransformerVariants/

/extract ~/research/icml-2024-nlp/efficient-attention.pdf
/analyze results/paper_EfficientAttention/
```

#### 步骤6：领域综述（阶段4）

分析多篇论文后：

```bash
/field results/
```

**发生了什么：**
- 读取所有 `deep_analysis.md` 文件
- 识别共同主题和趋势
- 综合领域级洞察
- 突出研究空白和未来方向

**预期输出：**
```
results/field_analysis_report.md
```

## 批量处理脚本

高效处理多篇论文：

```bash
# 解析所有论文
/parse ~/research/icml-2024-nlp/

# 提取和分析每篇论文
for pdf in ~/research/icml-2024-nlp/*.pdf; do
    echo "处理中: $pdf"
    /extract "$pdf"
    
    # 获取论文目录名
    paper_name=$(basename "$pdf" .pdf)
    paper_dir="results/paper_${paper_name}"
    
    if [ -d "$paper_dir" ]; then
        /analyze "$paper_dir"
    fi
done

# 生成领域综述
/field results/
```

## 质量控制检查清单

### 阶段1（解析）后
- [ ] 所有PDF都有对应的JSON文件
- [ ] `batch_summary.json` 显示无错误
- [ ] 摘要和结论完整

### 阶段2（提取）后
- [ ] `VISION_VERIFICATION_REPORT.md` 显示高置信度
- [ ] `sections/` 目录中存在所有主要章节
- [ ] `full_text.md` 可读且格式良好
- [ ] 无重大文本提取错误

### 阶段3（分析）后
- [ ] `deep_analysis.md` 涵盖所有关键方面
- [ ] 分析包含方法论评估
- [ ] 识别了局限性
- [ ] 注明了与相关工作的联系

### 阶段4（领域综述）后
- [ ] 报告综合了所有论文的洞察
- [ ] 识别了共同主题
- [ ] 突出了研究空白
- [ ] 提出了未来方向

## 获得最佳结果的技巧

1. **论文选择**：在扩大规模前先从5-10篇高度相关的论文开始
2. **命名**：使用描述性的PDF文件名（如 `smith2024-attention.pdf`）
3. **验证**：继续前始终检查验证报告
4. **增量式**：在批量处理前先完成几篇论文的所有阶段
5. **备份**：将原始PDF与results目录分开保存

## 时间估算

- **阶段1（解析）**：每篇论文约30秒
- **阶段2（提取）**：每篇论文2-5分钟（取决于长度）
- **阶段3（分析）**：每篇论文1-2分钟
- **阶段4（领域综述）**：3-5分钟（取决于论文数量）

## 下一步

- 查看[故障排查指南](troubleshooting.md)了解常见问题
- 查看[脚本指南](scripts-guide.md)了解高级自动化
- 查看[示例](examples/)了解样本输出
