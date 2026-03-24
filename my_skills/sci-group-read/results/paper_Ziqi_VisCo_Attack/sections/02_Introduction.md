# Introduction

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

Qi et al. (2024); Gao et al. (2024) attempt to inject
adversarial noise into images to construct universal
jailbreak inputs.
Despite achieving high Attack Success Rate
(ASR) and bypassing the safety mechanisms of
MLLMs, the visual information in these methods
primarily acts as a trigger, rather than providing the
essential content that defines the jailbreak scenario.
As illustrated in Fig. 1, the image in FigStep (Gong
et al., 2023) merely duplicates the textual infor-
mation and fails to construct a realistic scenario,
while the sample from MM-SafetyBench (Liu et al.,
2024b) conveys only a vague harmful intent. In
this work, we propose Vision-Centric Jailbreak,
where visual information serves as a necessary com-
ponent in constructing a complete jailbreak sce-
nario. For instance, given a harmful intent such as
“stealing valuables from a car”, the input image pro-
vides key visual cues: (i) selecting a car, (ii) identi-
fying high-value items, and (iii) demonstrating how
to perform the theft. This setup effectively prompts
the model to exhibit unsafe behavior grounded in a
realistic visual context.
To enable effective jailbreaks in realistic sce-
narios, we propose an image-driven context injec-
tion strategy VisCo (Visual Contextual) Attack.
VisCo comprises two main stages: context fabri-
cation and attack prompt refinement. In the con-
text fabrication stage, we leverage enhanced visual
information and employ one of four predefined
vision-focused strategies to construct a deceptive
multi-turn conversation history. In the refinement
stage, the initial attack prompt is automatically op-
timized for semantic alignment with the original
harmful intent and toxicity obfuscation to evade
safety mechanisms. Together, these components
enable black-box MLLMs to generate unsafe re-
sponses that are grounded in realistic and visually
coherent scenarios. We summarize our contribu-
tions as follows:
• We first propose the vision-centric jailbreak
setting, where visual information serves as a
necessary component in constructing a com-
plete and realistic jailbreak scenario. This
formulation reveals limitations of existing jail-
break attacks in real-world environments.
• We propose VisCo Attack for the vision-
centric jailbreak setting.
It leverages four
vision-focused strategies to construct decep-
tive visual contexts, followed by an automatic
toxicity obfuscation and semantic refinement
process to generate the final attack sequence.
• Extensive experiments across multiple bench-
marks validate the effectiveness of VisCo At-
tack. By crafting visually grounded attack
sequences aligned with harmful intent, VisCo
significantly outperforms baselines, achieving
toxicity scores of 4.78 and 4.88, and ASR of
85.00% and 91.07% on GPT-4o and Gemini-
2.0-Flash, respectively.
2
Related Works
Visual Jailbreak Attacks Against MLLMs.
While multimodal large language models have
demonstrated remarkable understanding and rea-
soning capabilities in visual tasks (Liu et al., 2023;
Achiam et al., 2023; Team et al., 2024; Bai et al.,
2025), the inherent continuous nature of visual fea-
tures poses security vulnerabilities to the aligned
language models (Pi et al., 2024; Ding et al., 2024;
Lu et al., 2024). Visual jailbreak attacks can be
broadly classified into two main approaches: im-
age modification attacks and query-image-related
attacks, both exploiting visual information to by-
pass the model’s safety mechanisms (Liu et al.,
2024b; Dai et al., 2025; Dang et al., 2024). Im-
age modification attacks inject adversarial pertur-
bations into images to induce MLLMs to generate
harmful responses (Jin et al., 2024; Ye et al., 2025).
Qi et al. (2024); Gao et al. (2024) aim to gener-
ate universal images with adversarial noise, while
Gong et al. (2023); Wang et al. (2024b); Zhang et al.
(2025) embed malicious instructions into images
using typography. Additionally, Zhao et al. (2025);
Yang et al. (2025) employ patching and reconstruc-
tion techniques on images containing harmful con-
tent to jailbreak MLLMs. Although these methods
achieve a high attack success rate (ASR), the modi-
fications made to images often result in semantic
corruption, limiting their harmful intent to being
expressed as text instructions in real-world sce-
narios. Query-image-related attacks (Chen et al.,
2024a), on the other hand, convey unsafe inten-
tions through both images and text instructions.
Liu et al. (2024b); Hu et al. (2024); Ding et al.
(2025); Li et al. (2025) utilize text-to-image mod-
els to generate images that precisely align with
text instructions, resulting in malicious multimodal
inputs. Exploiting the complexity of multimodal in-
puts, a more advanced attack, termed “safe inputs
but unsafe output” (Wang et al., 2024a), is imple-
9640

mented by combining safe images and text inputs
to trigger harmful responses from MLLMs (Cui
et al., 2024; Zhou et al., 2024a).
In-Context Jailbreak.
In-context jailbreak lever-
ages the contextual understanding ability of lan-
guage models to elicit unsafe outputs, typically by
manipulating the input prompt (Liu et al., 2024c,
2025a; Li et al., 2024; Zhang et al., 2024). Wei
et al. (2023); Anil et al. (2024); Miao et al. (2025)
inject harmful context examples before malicious
queries to induce jailbreak behavior. Vega et al.
(2023) exploit the model’s preference for coher-
ent completions by appending an incomplete but
affirmatively phrased sentence after the query, co-
ercing the model to continue with unsafe content.
Kuo et al. (2025) manually simulate the reasoning
chain of harmful queries and inject such reason-
ing into the context as an attack. Recent work has
also shifted focus to manipulating LLM dialogue
history. Russinovich and Salem (2025) construct
fixed-format conversations that make the model
believe it has already agreed to provide sensitive
information. Meng et al. (2025) fabricate affirma-
tive assistant responses within fake dialogue history
and use “continue” prompts or delayed responses
to guide the model toward unsafe outputs. How-
ever, these methods are designed for LLM-only
contexts and typically rely on affirmative suffixes
or in-context demonstrations. In contrast, we con-
struct semantically coherent multi-turn deceptive
conversations that effectively embed vision-centric
manipulated dialogue histories, closely mimick-
ing natural interactions between the user and the
model.
Multi-turn Jailbreak.
Multi-turn jailbreak at-
tacks aim to avoid directly exposing harmful intent
in a single interaction by decomposing the intent
and gradually guiding the model to unsafe outputs
through continued dialogue (Wang et al., 2025).
Russinovich et al. (2024); Zhou et al. (2024b);
Weng et al. (2025) start from seemingly benign
exchanges and progressively escalate toward harm-
ful objectives. Yang et al. (2024b) adopt seman-
tically driven construction strategies that leverage
context progression to elicit sensitive outputs step
by step. Ren et al. (2024); Rahman et al. (2025)
further explore diverse multi-turn attack paths for
breaking model alignment.
3
Visual Contextual Jailbreaking
Our attack methodology focuses on bypassing the
safety mechanisms of a target MLLM in a black-
box setting. This is accomplished by constructing
a deceptive multi-turn context that precedes the ac-
tual harmful query. The core process involves gen-
erating a fabricated dialogue history and then refin-
ing the final attack prompt, which is subsequently
used to execute the complete sequence against the
target model.
3.1
Problem Formulation
The problem setting involves a target MLLM, a tar-
get image I, and a harmful query Qh. This query is
crafted to exploit the model’s understanding of the
visual content in I, aiming to trigger a response that
violates the MLLM’s safety policies. The attack
critically relies on the model’s ability to perceive
and reason over visual inputs, making the image
I an essential component of the adversarial setup.
Specifically, our goal is to construct a multimodal
input sequence Satk that elicits a harmful response
Rh that fulfills the intent of the original harmful
query Qh, which is closely tied to the visual con-
tent. The attack sequence Satk is organized as a
multi-turn conversation, where fabricated context
is used to “shield” the final attack prompt, enabling
it to trigger the targeted unsafe behavior.
Satk = (P1, R1, P2, R2, . . . , PN, RN, Patk), (1)
where (P1, R1, · · · , PN, RN) constitutes the de-
ceptive context Cfake, consisting of N simulated
user-model interaction rounds designed to mislead
the MLLM. The final prompt Patk, refined from the
original harmful query Qh, is crafted to effectively
trigger the desired unsafe response.
The construction of Satk involves two main
stages. In the deceptive context and initial prompt
generation stage (Section 3.2), N rounds of simu-
lated interactions (Pi, Ri) are generated to form the
deceptive context Cfake. Currently, an initial attack
prompt P initial
atk
is crafted based on the preceding
dialogue and is guided by the harmful query Qh.
The target image I, along with any auxiliary syn-
thesized images Igen, is embedded in relevant user
prompts Pi. In the second Attack Prompt Refine-
ment stage (Section 3.3), the initial prompt P initial
atk
is iteratively optimized to enhance its effectiveness.
This refinement process serves two key purposes:
it aligns the prompt more closely with the intent
9641

