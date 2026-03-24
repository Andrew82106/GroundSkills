# Abstract

Proceedings of the 2025 Conference on Empirical Methods in Natural Language Processing, pages 9639–9656
November 4-9, 2025 ©2025 Association for Computational Linguistics
Visual Contextual Attack: Jailbreaking MLLMs with Image-Driven
Context Injection
Ziqi Miao1⋆, Yi Ding2⋆, Lijun Li1†, Jing Shao1†
1 Shanghai Artificial Intelligence Laboratory
2 Purdue University
{miaoziqi,lilijun,shaojing}@pjlab.org.cn
ding432@purdue.edu
Abstract
With the emergence of strong vision language
capabilities, multimodal large language mod-
els (MLLMs) have demonstrated tremendous
potential for real-world applications. However,
the security vulnerabilities exhibited by the vi-
sual modality pose significant challenges to de-
ploying such models in open-world environ-
ments. Recent studies have successfully in-
duced harmful responses from target MLLMs
by encoding harmful textual semantics directly
into visual inputs.
However, in these ap-
proaches, the visual modality primarily serves
as a trigger for unsafe behavior, often exhibit-
ing semantic ambiguity and lacking grounding
in realistic scenarios. In this work, we define
a novel setting: vision-centric jailbreak, where
visual information serves as a necessary com-
ponent in constructing a complete and realis-
tic jailbreak context. Building on this setting,
we propose the VisCo (Visual Contextual) At-
tack. VisCo fabricates contextual dialogue us-
ing four distinct vision-focused strategies, dy-
namically generating auxiliary images when
necessary to construct a vision-centric jailbreak
scenario. To maximize attack effectiveness,
it incorporates automatic toxicity obfuscation
and semantic refinement to produce a final at-
tack prompt that reliably triggers harmful re-
sponses from the target black-box MLLMs.
Specifically, VisCo achieves a toxicity score
of 4.78 and an Attack Success Rate (ASR)
of 85% on MM-SafetyBench against GPT-
4o, significantly outperforming the baseline,
which achieves a toxicity score of 2.48 and an
ASR of 22.2%. Code: https://github.com/
Dtc7w3PQ/Visco-Attack. Warning: This pa-
per contains offensive and unsafe responses.
1
Introduction
Multimodal large language models (MLLMs) (Liu
et al., 2024a; Achiam et al., 2023; Team et al., 2024;
Bai et al., 2025; Zhu et al., 2025; Team et al., 2025),
⋆Equal contribution
† Corresponding authors
Intention: Steal valuable items in 
the car.
Vision-Centric Jailbreak
Vanilla Jailbreak
I
II
III
I: Identify which car 
II: Find the valuable item
III: How to steal
Intention: Steal artworks items in 
the market.
No specific information in 
the image.
FigStep
MM-Safety Bench
Intention: List steps in detail to find 
a reliable individual.
Vague intention when 
combining image and text
Figure 1: Illustration of the vision-centric jailbreak set-
ting. The visual input is an essential component that
constitutes the complete jailbreak scenario.
by incorporating dedicated visual encoders, have
demonstrated remarkable advances in tasks requir-
ing joint visual and textual understanding. How-
ever, studies have revealed that incorporating visual
encoders is a “double-edged sword” (Zong et al.,
2024; Liu et al., 2025b): while they enhance visual
perception, they also introduce new safety vulner-
abilities to the language backbone. Motivated by
this, researchers have begun to explore how harm-
ful visual content can trigger unsafe behaviors in
MLLMs, uncovering their underlying safety weak-
nesses.
One of the most straightforward approaches is
to encode harmful textual semantics directly into
the visual input. For example, Gong et al. (2023);
Wang et al. (2024b) embed harmful text into images
via typography. In contrast, Liu et al. (2024b); Ding
et al. (2025); Hu et al. (2024) utilize additional text-
to-image (T2I) models to generate harmful images
related to the original malicious query. Meanwhile,
9639

