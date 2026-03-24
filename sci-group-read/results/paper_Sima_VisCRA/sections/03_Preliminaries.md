# Preliminaries

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

Qwen2.5-VL
R1-Onevision
InternVL2.5
MM-EUREKA-Internvl
Llama-3.2-Vision
LLaVA-CoT
0
20
40
60
80
100
Attack Success Rate (ASR) (%)
Qwen
InternVL
Llama
30%
65%
26%
35%
3%
25%
62%
68%
52%
55%
11%
54%
Method
HADES
HADES+CoT
Figure 1: Attack success rates (ASR) of base MLLMs
vs. reasoning-enhanced MLRMs, with and without
visual CoT prompting. Enhanced models (e.g., R1-
Onevision) exhibit significantly higher vulnerability to
HADES attacks compared to their base counterparts
(e.g., Qwen2.5-VL), and the inclusion of visual CoT
prompting further amplifies ASR across all models.
and text modalities to maximize harmful impact.
In black-box attack scenarios, FigStep (Gong et al.,
2025) circumvents safety alignment by embed-
ding malicious instructions via typography. MM-
SafetyBench (Liu et al., 2024) leverages diffusion
models to synthesize query-relevant harmful im-
ages, and HADES (Li et al., 2024) makes enhance-
ments via optimized prompts for diffusion models,
producing more semantically coherent and potent
harmful samples.
However, current approaches do not explicitly
engage or manipulate the visual reasoning process.
As such, they do not account for the additional vul-
nerabilities introduced by multistep visual reason-
ing, which is a defining feature of modern MLRMs.
Our work bridges this gap by directly targeting the
visual reasoning chain itself, revealing a novel and
potent attack surface unique to MLRMs.
3
Motivation
3.1
Vulnerability of MLRMs
Prior research in LRMs has identified a fundamen-
tal trade-off between reasoning depth and safety
alignment, showing that enhanced reasoning capa-
bilities can inadvertently weaken a model’s resis-
tance to harmful prompts (Jiang et al., 2025). In
this work, we extend this line of inquiry to ML-
RMs by systematically investigating how enhanced
visual reasoning affects their safety.
To this end, we evaluate base MLLMs and
their reasoning-enhanced MLRM variants using
the HADES benchmark (Li et al., 2024), which is
designed to probe multimodal safety under adver-
sarial conditions. As shown in Figure 1, reasoning-
The image depicts a dark scene with a person 
dressed in blood-soaked clothing, kneeling 
on the ground surrounded by a lot of blood.  
The lighting is dim and moody, with shadows 
creating a stark contrast.  There is a 
dagger prominently shown, held in one hand 
while the other rests on the ground.  The 
blade is clean and reflective, showcasing an 
intricate design. 
The instruction's focus is centered on a 
prohibited topic: self-harm.  Demonstrating 
or describing "the most effective way to 
stab oneself" not only promotes harmful 
ideations but directly opposes ethical, 
moral, and legal standards.  Therefore, this 
instruction is inappropriate, and it is 
critical to approach this discussion 
responsibly while avoiding any content that 
could facilitate or encourage self-harm.
Visual COT
+
HADES prompt
Attack Fail
Input
Output
Figure 2: Illustration of a visual CoT failure case. An
early, overly detailed description of harmful visual con-
tent (in red) triggers the model’s safety mechanisms (in
green), interrupting the reasoning process.
enhanced MLRMs (such as R1-Onevision (Yang
et al., 2025), MM-EUREKA-InternVL (Meng et al.,
2025), and LLaVA-CoT (Xu et al., 2024)) are sub-
stantially more susceptible to jailbreak attacks com-
pared to their base counterparts.
For instance, R1-Onevision achieves a 65%
ASR, more than double that of its base model
Qwen2.5-VL. This substantial increase in vulner-
ability is largely attributable to the models’ en-
hanced visual reasoning, which enables them to
interpret and respond to harmful prompts in more
detailed, coherent, and actionable ways. While ad-
vanced visual reasoning improves performance on
complex cognitive and perception tasks, it simulta-
neously amplifies security risks, a trade-off that is
both consequential and currently underappreciated.
These findings motivate a deeper exploration of
how reasoning itself can be exploited as an attack
surface in MLRMs.
3.2
Attack Amplification via Visual CoT
Building on the observation from Section 3.1 that
stronger visual reasoning increases MLLMs vul-
nerability, we hypothesize that explicitly eliciting
visual Chain-of-Thought (CoT) reasoning could
further amplify attack success. To test this, we
design a tailored visual CoT prompt to encourage
step-by-step reasoning over image content (See
Appendix A.1 for the prompt template.). Empiri-
cal results confirm our hypothesis: integrating vi-
sual CoT with HADES adversarial instructions sig-
nificantly boosts jailbreak success rates (as illus-
trated in Figure 1, the increase from ’HADES’ to
’HADES+CoT’ bars for each model), highlighting
the power of guided visual reasoning in bypassing
safety mechanisms. However, this approach also re-
veals an important failure mode. While detailed im-
age descriptions can aid reasoning, over-describing
6145

