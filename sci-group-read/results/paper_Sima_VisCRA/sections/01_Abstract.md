# Abstract

Proceedings of the 2025 Conference on Empirical Methods in Natural Language Processing, pages 6143–6156
November 4-9, 2025 ©2025 Association for Computational Linguistics
VisCRA: A Visual Chain Reasoning Attack for Jailbreaking Multimodal
Large Language Models
Bingrui Sima1*
Linhua Cong1*
Wenxuan Wang2
Kun He1†
1Huazhong University of Science and Technology
2Hong Kong University of Science and Technology
{d202481592, m202476968}@hust.edu.cn
brooklet60@hust.edu.cn
Abstract
The emergence of Multimodal Large Reason-
ing Models (MLRMs) has enabled sophisti-
cated visual reasoning capabilities by inte-
grating reinforcement learning and Chain-of-
Thought (CoT) supervision. However, while
these enhanced reasoning capabilities improve
performance, they also introduce new and un-
derexplored safety risks.
In this work, we
systematically investigate the security implica-
tions of advanced visual reasoning in MLRMs.
Our analysis reveals a fundamental trade-off:
as visual reasoning improves, models become
more vulnerable to jailbreak attacks. Motivated
by this critical finding, we introduce VisCRA
(Visual Chain Reasoning Attack), a novel jail-
break framework that exploits the visual reason-
ing chains to bypass safety mechanisms. Vis-
CRA combines targeted visual attention mask-
ing with a two-stage reasoning induction strat-
egy to precisely control harmful outputs. Exten-
sive experiments demonstrate VisCRA’s signif-
icant effectiveness, achieving high attack suc-
cess rates on leading closed-source MLRMs:
76.48% on Gemini 2.0 Flash Thinking, 68.56%
on QvQ-Max, and 56.60% on GPT-4o. Our
findings highlight a critical insight: the very ca-
pability that empowers MLRMs — their visual
reasoning — can also serve as an attack vec-
tor, posing significant security risks.1 Warning:
This paper contains unsafe examples.
1
Introduction
Recent advances in Large Reasoning Models
(LRMs), such as DeepSeek-R1 (Guo et al., 2025)
and OpenAI-o1 (Jaech et al., 2024), have intro-
duced a new reasoning paradigm. Unlike tradi-
tional prompt-based approaches (Yao et al., 2023),
LRMs acquire reasoning capabilities through rein-
forcement learning, enabling strong performance
*The first two authors contribute equally.
†Corresponding author.
1Code available at: github.com/DyMessi/VisCRA
on complex cognitive tasks (Qu et al., 2025; Tian
et al., 2024).
Building on these developments, the multimodal
community has integrated Chain-of-Thought (CoT)
supervision and reinforcement learning into Mul-
timodal Large Language Models (MLLMs), lead-
ing to the emergence of Multimodal Large Rea-
soning Models (MLRMs). Models like OpenAI
o4-mini (OpenAI, 2025) now demonstrate signif-
icantly improved visual reasoning, representing a
foundational step toward multimodal artificial gen-
eral intelligence (AGI) (Wang et al., 2025; Li et al.,
2025b).
Despite these advances, such powerful reason-
ing models also bring critical safety concerns (Ying
et al., 2025). Recent research on text-only LRMs,
particularly the DeepSeek-R1 series, has indicated
that detailed reasoning can amplify safety risks by
enabling models to produce more precise and po-
tentially harmful outputs (Jiang et al., 2025; Zhou
et al., 2025). These findings have sparked increased
attention to the safety implications of high-capacity
reasoning in language models.
In contrast, the corresponding risks in MLRMs
remain rather underexplored, despite the added
complexity and potential vulnerabilities introduced
by visual modalities. Visual inputs can serve as
rich contextual cues that guide or reinforce harm-
ful reasoning trajectories, thereby expanding the
attack surface for adversarial exploitation. This gap
in understanding raises urgent concerns about the
robustness and security posture of MLRMs.
Motivated by these concerns, we pose two criti-
cal research questions:
• Does stronger visual reasoning capability in-
crease the security risks of MLLMs?
• How can adversaries exploit visual reasoning to
bypass the safety mechanisms of MLLMs?
In this work, we take a first step toward answer-
ing these questions by systematically analyzing
6143

