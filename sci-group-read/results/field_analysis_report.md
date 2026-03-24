# MLLM/VLM 越狱攻击领域综合分析报告

**分析日期**: 2026-03-15
**论文数量**: 7 篇
**研究领域**: 多模态大语言模型安全/越狱攻击

---

## 1. 概述

本分析报告综合了 7 篇关于多模态大语言模型（MLLM/VLM）越狱攻击的最新研究论文。这些论文均来自 2025 年的顶级会议（EMNLP、AAAI、CVPR、ACL 等），代表了该领域的最新研究进展。

---

## 2. 论文汇总

| 论文 | 方法 | 目标模型 | 攻击成功率 | 核心创新 |
|------|------|----------|-----------|----------|
| **VisCo** (Miao et al.) | 视觉上下文注入 | GPT-4o | 85% ASR | 以视觉为中心的越狱范式 |
| **VisCRA** (Sima et al.) | 视觉链推理攻击 | Gemini 2.0, QvQ-Max, GPT-4o | 76.48%/68.56%/56.60% | 利用推理链绕过安全机制 |
| **FigStep** (Gong et al.) | 排版图像转换 | 6 个开源 LVLM | 82.50% 平均 | 文本转图像绕过对齐 |
| **HIMRD** (Ma et al.) | 启发式风险分布 | 7 个开源 +3 个商用 | 90%/68% | 跨模态风险分散 |
| **MMLink** (Wang et al.) | 多模态链接加密 | GPT-4o 等 | - | 加密 - 解密机制+邪恶对齐 |
| **COMET** (Anonymous) | 跨模态纠缠攻击 | 9 个 VLM | >94% | 知识重构+场景嵌套 |
| **TrojanWave** (Hanif et al.) | 提示学习后门 | 音频语言模型 | - | 首个针对 ALM 的后门攻击 |

---

## 3. 共同主题与趋势

### 3.1 核心观察

1. **视觉模态是安全薄弱环节**
   - 所有论文都指出视觉编码器是"双刃剑"
   - 视觉嵌入的安全对齐不足是普遍问题
   - 模型过度依赖底层 LLM 的安全保证

2. **跨模态攻击优于单模态攻击**
   - 将有害语义分散到多个模态可有效绕过检测
   - 文本 - 图像纠缠使恶意意图更隐蔽
   - 单一模态保护机制容易被规避

3. **推理能力与安全性的权衡**
   - 更强的推理能力可能导致更大的安全漏洞
   - 推理链可被利用来绕过安全机制
   - 详细推理可能放大有害输出

### 3.2 攻击方法分类

| 类别 | 方法 | 论文 |
|------|------|------|
| **视觉编码** | 将有害文本转换为图像 | FigStep |
| **上下文注入** | 构建完整的越狱场景 | VisCo |
| **推理利用** | 利用推理链绕过检测 | VisCRA, COMET |
| **风险分布** | 跨模态分散有害语义 | HIMRD, MMLink |
| **后门攻击** | 在提示学习中注入后门 | TrojanWave |

---

## 4. 攻击效果对比

### 4.1 攻击成功率 (ASR)

```
COMET:     >94% (9 个 VLM)
HIMRD:     90% (开源), 68% (商用)
VisCo:     85% (GPT-4o)
FigStep:   82.5% 平均 (6 个 LVLM)
VisCRA:    76.5% (Gemini 2.0)
           68.6% (QvQ-Max)
           56.6% (GPT-4o)
```

### 4.2 目标模型覆盖

- **开源模型**: LLaVA, InstructBLIP, MiniGPT-4, Qwen-VL 等
- **商用模型**: GPT-4o, Gemini, QvQ-Max
- **音频模型**: 大型音频语言模型 (ALM)

---

## 5. 关键洞察

### 5.1 漏洞根源

1. **跨模态安全对齐不足**
   - 视觉模块未经过严格的安全评估
   - 视觉嵌入与文本嵌入的安全标准不一致
   - 连接器模块可能存在安全盲点

2. **推理机制的双刃剑效应**
   - 推理能力增强同时增加了攻击面
   - 思维链可被操控来产生有害输出
   - 复杂推理使安全检测更加困难

3. **黑盒攻击的可行性**
   - 大多数方法不需要模型内部信息
   - 仅需 API 访问即可实施有效攻击
   - 使得攻击在实际场景中更容易执行

### 5.2 防御启示

1. **需要跨模态安全对齐技术**
   - 统一的视觉 - 文本安全标准
   - 增强的视觉嵌入审查
   - 推理过程的安全监控

2. **多层防御策略**
   - 输入级别的内容过滤
   - 推理过程的异常检测
   - 输出级别的安全验证

3. **持续的红队测试**
   - 定期评估新出现的攻击方法
   - 建立全面的基准测试集
   - 社区协作的安全研究

---

## 6. 研究空白与未来方向

### 6.1 当前局限

1. **防御研究不足**
   - 大多数论文专注于攻击方法
   - 有效的防御策略研究较少
   - 缺乏系统性的防御框架

2. **评估标准不统一**
   - 各论文使用不同的基准和数据集
   - 攻击成功率的定义不一致
   - 难以进行公平的方法比较

3. **实际部署考虑有限**
   - 多数研究在受控环境下进行
   - 真实世界场景的复杂性未充分考虑
   - 计算成本和延迟问题未深入探讨

### 6.2 未来研究方向

1. **防御机制设计**
   - 跨模态安全对齐算法
   - 推理过程的安全监控
   - 自适应的防御策略

2. **标准化评估**
   - 统一的基准测试集
   - 标准化的评估指标
   - 开放的安全竞赛

3. **新兴威胁研究**
   - 多模态推理模型的安全
   - 音频 - 视觉 - 文本三模态攻击
   - 少样本/零样本攻击场景

4. **理论基础**
   - 越狱攻击的形式化定义
   - 安全边界的理论分析
   - 对抗鲁棒性的保证

---

## 7. 结论

这 7 篇论文揭示了多模态大语言模型在安全方面面临的严峻挑战。主要发现包括：

1. **视觉模态是关键弱点** - 所有方法都利用了视觉模块的安全对齐不足
2. **跨模态攻击高效** - 分散和纠缠策略显著提高了攻击成功率
3. **推理能力增加风险** - 更强的推理能力可能被利用来绕过安全机制
4. **黑盒攻击可行** - 无需内部模型信息即可实施有效攻击

这些发现强调了开发新型跨模态安全对齐技术的紧迫性，以及对多模态模型进行全面安全评估的必要性。

---

## 附录：论文详细信息

### VisCo
- **标题**: Visual Contextual Attack: Jailbreaking MLLMs with Image-Driven Context Injection
- **作者**: Ziqi Miao, Yi Ding, Lijun Li, Jing Shao
- **会议**: EMNLP 2025
- **代码**: https://github.com/Dtc7w3PQ/Visco-Attack

### VisCRA
- **标题**: VisCRA: A Visual Chain Reasoning Attack for Jailbreaking Multimodal Large Language Models
- **作者**: Bingrui Sima, Linhua Cong, Wenxuan Wang, Kun He
- **会议**: EMNLP 2025
- **代码**: https://github.com/DyMessi/VisCRA

### FigStep
- **标题**: FigStep: Jailbreaking Large Vision-Language Models via Typographic Visual Prompts
- **作者**: Yichen Gong, Delong Ran, Jinyuan Liu, 等
- **会议**: AAAI 2025
- **代码**: https://github.com/ThuCCSLab/FigStep

### HIMRD
- **标题**: Heuristic-Induced Multimodal Risk Distribution Jailbreak Attack for Multimodal Large Language Models
- **作者**: Teng Ma, Xiaojun Jia, Ranjie Duan, 等
- **会议**: 2025

### MMLink
- **标题**: Jailbreak Large Vision-Language Models Through Multi-Modal Linkage
- **作者**: Yu Wang, Xiafei Qiu, Yichen Wang, Geyuan Zeng, Tianrui Li
- **会议**: ECCV 2025

### COMET
- **标题**: Red-teaming the Multimodal Reasoning: Jailbreaking Vision-Language Models via Cross-modal Entanglement Attacks
- **会议**: CVPR 2026 (投稿)

### TrojanWave
- **标题**: TrojanWave: Exploiting Prompt Learning for Stealthy Backdoor Attacks on Large Audio-Language Models
- **作者**: Asif Hanif, Maha Tallat Zafar, Fahad Shamshad, Karthik Nandakumar
- **会议**: EMNLP 2025

---

**报告生成**: sci-group-read 技能 | 版本 1.0
