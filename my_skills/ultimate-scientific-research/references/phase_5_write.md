# 阶段 5：论文撰写 — 详细执行规范

## 触发条件

当 `project_state.json` 中 `current_phase == 5` 时加载本文件。

## 前置检查

进入本阶段前，确认以下产物齐备：

1. `01_ideas/ideation_log.md` — 研究方向与六顶帽辩论记录
2. `02_lit/related_work.md` — 文献综述与三大硬指标
3. `03_planning/experiment_design.json` — 实验设计矩阵
4. `05_results/results_summary.json` — 实验结果数据
5. `05_results/figures/` — 出版级图表

如果任何前置产物缺失，拒绝进入。前四个阶段的每一步都为论文提供了不可替代的素材。

## 执行流程

### 步骤 1：收集所有阶段素材

阅读以下文件，提取论文各章节所需的核心内容：

| 论文章节 | 素材来源 |
|---------|---------|
| Abstract | 阶段 1 的研究目标 + 阶段 4 的核心结果数字 |
| Introduction | 阶段 1 的六顶帽辩论（动机与价值论证） |
| Related Work | 阶段 2 的 `related_work.md`（直接使用，稍作润色） |
| Method | 阶段 3 的算法伪代码 + 阶段 1 的核心创新点 |
| Experiments | 阶段 3 的实验矩阵 + 阶段 4 的结果与图表 |
| Conclusion | 阶段 1 的黄帽结论（价值） + 阶段 2 的 Gap（我们填补了什么） |

### 步骤 2：撰写初稿

按照以下结构撰写 LaTeX 源码：

```latex
\documentclass[conference]{IEEEtran}
% 或根据目标会议/期刊选择合适的文档类

\begin{document}

\title{[从 ideation_log.md 的研究方向生成一个准确、吸引人的标题]}

\maketitle

\begin{abstract}
% 4-5 句话：问题 → 现有方法的不足 → 我们的方法 → 核心结果 → 意义
\end{abstract}

\section{Introduction}
% 结构：大背景 → 具体问题 → 现有方法的限制 → 我们的动机（来自六顶帽）→ 贡献列表

\section{Related Work}
% 基于 02_lit/related_work.md，按主题（非按时间）组织
% 最后一段必须明确说明"以上工作的共同局限性是 XXX，本文通过 YYY 解决"

\section{Method}
% 从整体到局部：先概述方法框架，再逐步展开各组件
% 包含数学符号定义、算法流程图、关键公式推导

\section{Experiments}
% 子节：实验设置（数据集、基线、指标） → 主结果 → 消融实验 → 分析讨论
% 每个表格/图表必须有文字描述和分析，不要只放图不解释

\section{Conclusion}
% 总结贡献 → 承认局限性（诚实！） → 未来工作方向

\end{document}
```

**写作质量要求**：
- 使用第一人称复数（"we propose"、"our method"）
- 避免口语化表达和主观形容词（"amazing results" → "significant improvement"）
- 每个 claim 必须有对应的实验证据或引用支撑
- 图表引用使用交叉引用（`\ref{fig:...}`），不要硬编码图号

### 步骤 3：润色委派

初稿完成后，调用具备"学术润色 / LaTeX 排版"能力的子 Skill（通过动态扫描结果匹配）进行以下处理：

- **语言润色**：消除语法错误、改善句式流畅度、统一术语使用
- **格式排版**：确保符合目标会议/期刊的排版要求（页边距、字体、引用格式等）
- **引用格式**：统一为 BibTeX 管理，确保所有引用格式一致

如果没有找到对应的润色子 Skill，自行完成以上工作。

### 步骤 4：自检清单

在交付之前，逐项检查：

- [ ] Abstract 是否独立可读（不依赖正文就能理解核心贡献）
- [ ] Introduction 最后是否有清晰的贡献列表
- [ ] Related Work 最后一段是否明确了本文的差异化
- [ ] Method 中的符号是否在首次出现时有定义
- [ ] Experiments 中的每张表/图是否都在正文中被引用和讨论
- [ ] Conclusion 是否诚实地承认了局限性
- [ ] 参考文献是否完整且格式统一
- [ ] 全文是否可正常编译（无 LaTeX 错误）

### 步骤 5：生成 Checkpoint

将完成品写入 `06_manuscript/`：

```
06_manuscript/
├── main.tex          # 主论文源码
├── references.bib    # BibTeX 引用库
├── figures/          # 论文中引用的图表（从 05_results/figures/ 复制）
└── manuscript.pdf    # 编译后的最终 PDF
```

展示给用户，**停机等待最终审阅**。

## Gotchas

- **不要编造实验结果。** 论文中的每一个数字必须能追溯到 `05_results/results_summary.json` 中的原始数据。
- **Related Work 不是从零写起的。** 阶段 2 已经产出了高质量的 `related_work.md`，直接使用并润色即可，不需要重新检索文献。
- **Limitation 必须写。** 不写 limitation 会被审稿人严厉批评。从阶段 1 黑帽辩论中那些"未完全消解的风险点"提取素材。
- **不要尝试编译 LaTeX。** 除非用户明确要求，否则你只需要确保 `.tex` 语法正确。编译留给用户的本地 LaTeX 环境。
