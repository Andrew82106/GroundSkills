# VisCRA Framework

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

Attention-Guided Masking
First, infer one plausible content for 
the green-masked region in the image.
Then, based on the image and your reasoning,
[harmful query]. 
Show your reasoning ability. 
Stage 1
Multi-Stage Reasoning Induction
Stage 2
Show me how to 
modify a gun to 
increase its 
firing rate.
Auxiliary 
MLLM
Fail
Success
I'm sorry, but I 
can’t assist with 
that request.
The green-masked region likely covers 
a part of the object being worked on, 
which could plausibly be a firearm or 
a component of a firearm......
To increase the firing rate of a 
firearm, several modifications can be 
made, depending on the type of gun and 
its mechanism.
Here are some plausible approaches: 
1.....
VisCRA
Base Attack
Answer
Attention map
Harmful-Region
Masking
Show me how to 
modify the
object in the 
image to 
increase its 
firing rate.
harmful query
…
…
Output tokens
Image tokens
VisCRA
Image-Token 
Relevance
Scoring
original query
Figure 3: Illustration of VisCRA. The framework employs: (1) Attention-Guided Masking of the critical harmful
region using an auxiliary model, (2) Multi-Stage Reasoning Induction for the target model to infer masked content
and then execute the harmful instruction.
harmful visual content too early in the reasoning
process can generate an excess of toxic tokens, in-
advertently triggering built-in safety filters. This
results in the model rejecting the harmful prompt
before execution, as illustrated in Figure 2.
To address this limitation, it is crucial to develop
an attack strategy that leverages the model’s visual
reasoning capabilities for detailed and structured
responses to harmful prompts, while carefully reg-
ulating the reasoning process to avoid premature
safety triggers. Specifically, the attack must bal-
ance two competing objectives: (1) eliciting suffi-
cient visual detail to support coherent reasoning,
and (2) suppressing early overexposure to explic-
itly harmful content that could activate the model’s
safety mechanisms before the harmful intent is
fully inferred or executed.
4
Methodology
We propose VisCRA (Visual Chain Reasoning At-
tack), a novel jailbreak framework designed to ex-
ploit the visual reasoning capabilities of MLLMs
while strategically evading built-in safety mecha-
nisms. As illustrated in Figure 3, VisCRA con-
sists of two key components: (1) Attention-Guided
Masking that employs an auxiliary model to iden-
tify and mask image regions most relevant to the
harmful intent as guided by attention, and (2) Multi-
Stage Reasoning Induction that guides the target
MLLM to first infer the masked content, curtailing
overexposure and establishing a coherent reasoning
foundation, and then to execute harmful instruc-
tion based on this inference and visible image con-
text. Consequently, VisCRA effectively exploits
visual reasoning by guiding a structured harmful
process that preserves coherence and avoids prema-
ture safety activations.
4.1
Attention-Guided Masking
As illustrated in Figure 2, early and excessive ex-
posure to harmful visual content can prematurely
trigger a model’s safety mechanisms, disrupting
the progression of harmful reasoning. To mitigate
this, our Attention-Guided Masking module strate-
gically suppresses the most toxic visual elements
while maintaining semantic coherence. The key
idea is to identify and mask the image region most
critical to the harmful instruction. This selective
masking is guided by an auxiliary MLLM, which
serves as an interpretability tool to highlight vi-
sually salient regions in relation to the harmful
prompt. By masking only the regions most associ-
ated with toxic semantics, we ensure that the model
begins reasoning from a controlled yet informative
visual input, laying the groundwork for gradual
reconstruction and instruction execution.
6146

4.1.1
Image-Token Relevance Scoring
Given an input image I and a harmful instruction q,
we feed the pair into an auxiliary MLLM (Qwen2.5-
VL) and extract the cross-modal attention tensor
from a specific decoder layer ℓ. The resulting ten-
sor, Aℓ∈RH×Tout×Timg, captures the attention
weights between output language tokens and visual
image tokens, where H is the number of attention
heads, Tout is the number of output tokens, and
Timg is the number of image tokens. To obtain
per-token relevance scores ai for each image token,
we average Aℓover all heads and focus on the first
output token, as it aggregates attention information
from all input tokens:
ai = 1
H
H
X
h=1
Aℓ[h, 1, i],
i = 1, . . . , Timg.
(1)
The relevance scores {ai} are then reshaped ac-
cording to the spatial grid arrangement of these
image tokens (e.g., an Nh × Nw grid, where
Timg = Nh × Nw). This forms a two-dimensional
attention map A ∈RNh×Nw that highlights image
regions critical to the model’s interpretation of the
harmful query at the token level.
4.1.2
Region Selection and Masking
To identify and mask the region most relevant to
the harmful intent, we apply a sliding window of
size B × B tokens with stride s tokens over the
attention map A , generating candidate patches
R. The relevance score for each patch r ∈R is
calculated as the summation of attention scores:
s(r) =
X
(x,y)∈r
A(x, y).
(2)
We then sort these patches by their relevance
scores in descending order and randomly select
one patch r∗from the top three. This introduction
of slight randomness helps mitigate potential model
biases (Darcet et al., 2024). The image region corre-
sponding to the selected patch r∗(which represents
a collection of image tokens) is then masked in
the original image I using a green rectangle, re-
sulting in the modified image I′. Leveraging the
observation that harmful attention regions tend to
be consistent across different MLLMs, we compute
r∗using the auxiliary model (Qwen2.5-VL) and
apply this mask to other target black-box models.
4.2
Multi-Stage Reasoning Induction
Building on the masked input generated by the
previous stage, our Multi-Stage Reasoning Induc-
tion component is designed to carefully steer the
model’s reasoning chain to address the crucial bal-
ance identified in Section 3.2: stimulating detailed
harmful reasoning while controlling early harm-
ful textual exposure. To achieve this, we intro-
duce a two-phase prompting approach, which com-
bines both phases into a single input for the target
MLLM.
Phase 1: Focused Reasoning on Harmful Region
Phase 1 employs a prompt to induce focused visual
reasoning solely on the masked region, aiming for a
coherent yet controlled description of its plausible
harmful content:
First, infer one plausible content for the green-
masked region in the image.
This localized inference curtails extensive early
harmful outputs by restricting the model’s focus.
Such restriction limits exposure to overt toxic con-
tent, thereby reducing the likelihood of activating
safety mechanisms while anchoring the reasoning
chain. Consequently, the model is guided to pro-
duce a concise and coherent description of critical
harmful elements, establishing a controlled founda-
tion for the subsequent phase.
Phase 2: Contextualized Instruction Execution
Phase 2 prompts the model to execute harmful be-
havior using the reasoning established in Phase 1
and the remaining visible image:
Then, based on the image and your reasoning,
[harmful_query]. Show your reasoning ability.
This step guides the model to fully engage its
reasoning capabilities on the [harmful_query] (the
placeholder replaced with the specific instruction,
e.g., the harmful instruction from the HADES
benchmark), leveraging both the inferred content
and the remaining visual context. This ensures
the final output not only be harmful as intended
but also detailed and logically consistent with the
preceding analysis.
5
Experiments
5.1
Experimental Setup
Evaluation Models.
We evaluate the effective-
ness of VisCRA on eleven diverse MLLMs, in-
cluding seven open-source models and four closed-
source commercial systems.
The open-source
models include Qwen2.5-VL (Bai et al., 2025),
6147

