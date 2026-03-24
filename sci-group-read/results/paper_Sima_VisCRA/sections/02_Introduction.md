# Introduction

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

the security vulnerabilities introduced by advanced
visual reasoning in MLRMs. In particular, we em-
pirically demonstrate that MLRMs exhibit signif-
icantly higher susceptibility to jailbreak attacks
compared to their base MLLM counterparts. This
observation highlights a fundamental trade-off: as
visual reasoning capabilities increase, safety align-
ment tends to degrade.
Building on this finding, we further investigate
the use of visual Chain-of-Thought (CoT) prompts
in conjunction with existing jailbreak techniques
to more deeply engage a model’s visual reasoning
capabilities. This combined approach leads to a
substantial increase in jailbreak success rates, indi-
cating that the reasoning chain itself can serve as
an attack vector. Interestingly, we also observe that
when a model produces overly detailed descriptions
of harmful visual content early in its reasoning pro-
cess, its internal safety mechanisms are more likely
to be triggered. This suggests a delicate balance
between reasoning depth and safety compliance,
one that adversaries could potentially manipulate
to bypass built-in safeguards.
Based on these insights, we propose VisCRA
(Visual Chain Reasoning Attack), a novel multi-
modal jailbreak framework that explicitly exploits
and manipulates the visual reasoning process to
circumvent a model’s safety mechanisms. VisCRA
combines targeted visual attention masking with a
two-stage reasoning induction strategy to precisely
control the visual reasoning chain, effectively trans-
forming a model’s reasoning strength into a potent
adversarial vector.
We validate the effectiveness of VisCRA through
extensive experiments on seven open-source
MLLMs and four prominent closed-source models,
evaluated across two representative benchmarks.
Our results demonstrate that VisCRA consistently
outperforms existing jailbreak techniques, achiev-
ing significantly higher attack success rates across
models under diverse settings. These findings re-
veal critical and previously overlooked security vul-
nerabilities in current MLRMs.
Our main contributions are threefold:
• We identify a fundamental trade-off between vi-
sual reasoning capability and safety alignment in
MLLMs, showing that enhanced visual reasoning
can increase vulnerability to jailbreak attacks.
• We introduce VisCRA, a novel multimodal jail-
break framework that precisely exploits and con-
trols the visual reasoning process, leading to sig-
nificantly higher attack success rates.
• Extensive evaluations on both open-source and
closed-source MLLMs validate the effectiveness
of VisCRA and reveal critical security vulnera-
bilities in state-of-the-art MLRMs.
2
Related Work
To our knowledge, the security risks introduced
by the reasoning capabilities of Multimodal Large
Reasoning Models (MLRMs) remain largely under-
explored. Existing research has primarily focused
on two adjacent areas: (1) the safety implications
of reasoning in text-only Large Reasoning Models
(LRMs) and (2) jailbreaking attacks targeting Mul-
timodal Large Language Models (MLLMs). We
briefly review both lines of work below.
2.1
Safety Challenges in LRMs
Recent studies have shown that enhanced reasoning
capabilities in LRMs do not necessarily correlate
with improved safety. For instance, Li et al. (2025a)
systematically investigate the trade-off between rea-
soning depth and safety alignment, revealing that
deeper reasoning chains can expose latent vulnera-
bilities. Follow-up work (Zhou et al., 2025; Ying
et al., 2025) further highlights that the reasoning
process itself (not just the final output) can be a crit-
ical locus of safety risk. In particular, multi-step
reasoning has been shown to increase the likelihood
of generating harmful or policy-violating content.
Complementary research (Jiang et al., 2025) also
explores how different reasoning strategies affect
safety performance in advanced models such as
DeepSeek-R1 (Guo et al., 2025), emphasizing that
certain reasoning formats (e.g., step-by-step CoT)
may unintentionally aid harmful task completion.
2.2
Jailbreak Attacks on MLLMs
Building on earlier jailbreak techniques for text-
only LLMs, recent efforts began to adapt such at-
tacks to multimodal settings (Zhang et al., 2024;
Bailey et al., 2024; Cheng et al., 2024). In white-
box attack scenarios, ImgJP (Niu et al., 2024) em-
ploys maximum-likelihood optimization to gen-
erate transferable adversarial images that effec-
tively jailbreak diverse large vision-language mod-
els.
Qi et al. (2024) demonstrate that a single
universal adversarial image can induce harmful
outputs when paired with various malicious texts.
Wang et al. (2024) employ a dual-optimization
framework to simultaneously perturb both image
6144

