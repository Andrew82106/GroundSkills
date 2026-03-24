# Background

leased (Liu et al. 2023b; Zhu et al. 2023; Wang et al. 2023).
Meanwhile, since the components of LVLM are not safely
aligned as a whole, the safety guardrail of the underlying
LLM may not cover the unforeseen domains introduced by
the visual modality, which could lead to jailbreaks. There-
fore, a natural question arises: Does the safety alignment of
the underlying LLMs provide an illusory safety guarantee
to the corresponding LVLMs? It is worth noting that recent
research has revealed that LVLMs are susceptible to jailbreak
attacks (Shayegani, Dong, and Abu-Ghazaleh 2024; Qi et al.
2023a; Carlini et al. 2023). The cornerstone of their methodol-
ogy involves manipulating the model’s output by introducing
perturbation, usually generated through optimization, to the
image-prompts, which is fundamentally analogous to the
techniques employed in crafting adversarial examples within
the Computer Vision (CV) domain (Carlini and Wagner 2017;
Madry et al. 2019).
We highlight that distinct from the above jailbreak meth-
ods, FigStep eliminates the need for perturbation, thereby
asserting that black-box access alone is sufficient to jailbreak
LVLMs. Meanwhile, our intention is not only to exhibit that
the computational cost and technical barriers to executing
FigStep are negligible, but also to leverage FigStep to under-
score the ubiquity of safety vulnerabilities within LVLMs.
More critically, compared with optimization-based jailbreaks,
FigStep could offer a more convenient baseline for conduct-
ing safety assessments of LVLMs.
Our Contributions
We first propose a novel safety benchmark namely SafeBench,
on which we launch FigStep against six popular open-source
LVLMs. Our results demonstrate that FigStep substantially
promotes the Attack Success Rate (ASR) compared to di-
rectly feeding text-only harmful questions. To find out the
reason behind the success of FigStep, we further perform
exhaustive ablation studies and analyze the distribution of se-
mantic embeddings, noticing that the visual embeddings are
only semantically but not safely aligned to the LLM’s textual
embeddings. Finally, we explore three potential defense meth-
ods: OCR-tool detection, adding random noise, and system
prompt modification, and find that all of them are ineffective
in resisting FigStep. Accordingly, we propose two enhanced
variants: FigStepadv and FigStephide to address the OCR
detection. We also propose FigSteppro, which splits image-
prompt into harmless segments, to jailbreak GPT-4V (Ope-
nAI 2023a) and GPT-4o (OpenAI 2024a).
In summary, we prove that adversaries can easily exploit
the core ideas of FigStep to jailbreak LVLMs, thereby re-
vealing that the safety of LVLMs cannot be solely dependent
on their underlying LLMs. This is because of an intrinsic
limitation within text-only safety alignment approaches that
hinders their applicability to the non-discrete nature of visual
information. To this end, we advocate for the utilization of
FigStep as a “probe” to aid in the development of novel safety
alignment methodologies that can align the textual and visual
modalities in a compositional manner.
Above all, our major contributions are as follows.
• We introduce SafeBench, a novel comprehensive safety
benchmark for evaluating the safety risks of LVLMs.
• We propose FigStep, an efficient black-box jailbreak algo-
rithm against LVLMs. We highlight that FigStep should
serve as a baseline for evaluating LVLM’s cross-modal
safety alignment.
• Our work demonstrates that current prominent LVLMs
(open-source or closed-source) are exposed to significant
risks of misuse, necessitating the urgent development of
new defensive mechanisms.
Related Work
Jailbreak Against LLMs. To forbid LLMs from generat-
ing harmful content that violates human values (Bommasani
et al. 2021; Liang et al. 2022), different safety alignment
techniques are proposed, such as supervised instruction-
tuning (Wei et al. 2021; Ouyang et al. 2022) and RLHF (Li
2017; Chung et al. 2022). However, safety alignment tech-
niques are not impregnable. Currently, there are two method-
ologies capable of compromising these safety mechanisms:
the removal of safety guardrails through model fine-tuning
techniques (Qi et al. 2023b; Zhan et al. 2023; Yang et al.
2023) and jailbreaks that focus on the meticulous modifica-
tion of inputs to bypass the safety alignment without updat-
ing model parameters (Yi et al. 2024; Liu et al. 2023c; Deng
et al. 2024). We focus on jailbreaks in this paper. The jail-
break techniques are broadly classified into two categories:
gradient-based methods represented by Greedy Coordinate
Gradient (GCG) (Zou et al. 2023) and non-gradient methods,
such as MultiLingual (Deng et al. 2024), CipherChat (Yuan
et al. 2023), DeepInception (Li et al. 2024), and In-Context
Attack (ICA) (Wei, Wang, and Wang 2023).
Jailbreak Against LVLMs. The current safety alignment
techniques primarily focused on the training and fine-tuning
processes of single-modal language models. With the trend in
LLMs moving towards multimodality, recent studies (Carlini
et al. 2023; Bailey et al. 2023; Zhao et al. 2023; Qi et al.
2023a; Shayegani, Dong, and Abu-Ghazaleh 2024; Niu et al.
2024) have demonstrated that LVLMs can be directed to pro-
duce arbitrary responses (e.g., wrong image description or
harmful response) through generating adversarial perturba-
tions onto the input images. Unlike these attacks, FigStep
has almost no costs with a weaker threat model.
Threat Model
Adversary’s Goal. The adversary’s goal is to exploit the
LVLM in order to obtain the answer to some questions that
are forbidden by the safety policy, even though the LVLM is
designed to avoid doing so. This goal captures the real-world
scenario, where a malicious user might abuse the model’s
power to acquire inappropriate knowledge, or an ignorant
user might force the model to provide guidance for crucial
decisions without considering the risk of being misled.
Adversary’s Knowledge & Capabilities. In this paper, we
present a black-box attack that does not require any infor-
mation or manipulation of the LVLM. The adversary is only
required to have the capability to query the model and re-
ceive its textual response. The dialogue is restricted to one
turn without any history except a preset system prompt. This
23952

scenario resembles the most common situation where the at-
tacker is merely a regular user who cannot deploy an LVLM
instance on their own due to the unavailability of the model
or the scarcity of resources.
Methodology
In this section, we present FigStep, a straightforward yet ef-
fective jailbreak algorithm using typographic visual prompts.
Initially, we elucidate the core concepts of our attack, fol-
lowed by a detailed presentation of the FigStep pipeline.
Intuitions
We first summarize the main observations about LVLM that
can inspire our attack. These insights will be validated later
in the Evaluation section.
• Intuition 1: The LVLMs can understand and follow the
instructions in typographic visual prompts. The LVLMs
have been fine-tuned to perform multimodal tasks such
as answering questions that are based on both texts and
images or recognizing text in images (Liu et al. 2023a).
Intuitively, this capability signifies that the LVLMs can
also recognize and answer the typographic questions in
images.
• Intuition 2: The content safety guardrails of LVLMs are
ineffective against the typographic visual prompts. Even
if underlying LLMs of LVLMs have been safety aligned
in advance, the visual inputs could introduce new risks
to content safety since the visual embedding space is
only semantically but not safely aligned to the LLM’s
embedding space.
• Intuition 3: The safety alignment within LVLMs can be
further breached when instructed to generate the content
step-by-step. This intuition is based on the model’s ability
to reason step-by-step (Wei et al. 2022). By instructing
the model to answer the prohibited question in steps, the
model could be more engaged in the completion task
and improve the quality of the responses, enhancing the
jailbreaking effectiveness of FigStep.
Pipeline
Given a prohibited text-only query Q∗= (T ∗, ⊥), FigStep’s
goal is to generate the corresponding jailbreaking query
Qjail = (T ′, I′) ←FigStep(T ∗).
To achieve this goal, the pipeline of FigStep is designed into
three steps: 1) Paraphrase, 2) Typography, and 3) Incitement,
as illustrated in Figure 2. These steps are detailed as follows.
1) Paraphrase: Following Intuition 3, the first step of
FigStep is to rephrase the prohibited question T ∗into
a textual statement T † ∈T. This statement is designed
to begin with a noun such as “Steps to”, “List of”, and
“Methods to” which indicates that the answer is a list and
the model should generate the answer item-by-item.
2) Typography: Based on intuitions 1 and 2, instead of
directly feeding the paraphrased instruction T † into the
LVLM, FigStep will transform this text into a typographi-
cal image I′ ∈I as the final jailbreaking image-prompt.
The numbered index from 1 to 3 is added to the visual
prompt as a hint to the response format.
3) Incitement: FigStep designs an incitement text-prompt
T ′ ∈T to motivate the model to engage in the com-
pletion task. This incitement prompt is designed to be
neutral and benign to avoid triggering the model’s con-
tent safety mechanisms. As the gradient-based adversarial
prompts (Zou et al. 2023) can be easily detected by the
perplexity-based filter and need white-box access (Song,
Rush, and Shmatikov 2020; Alon and Kamfonas 2023),
we manually craft and hardcode the default benign incite-
ment prompt of FigStep.
Evaluation
Experimental Setup
Dataset. To simulate possible harmful questions posed by
the malicious users, we propose SafeBench, a novel com-
prehensive safety benchmark which consists of 500 harmful
questions. The construction of SafeBench contains two steps:
• Common Safety Topic Collection. We first collect the
common forbidden topics listed in both the OpenAI usage
policy (OpenAI 2023b) and the Meta’s Llama-2 usage
policy (Meta 2023), and then select 10 different topics
that should be included in SafeBench.
• LLM-based Dataset Generation. For each selected topic,
we first compose a detailed description by integrating
related content from the usage policies, then we query
GPT-4 to generate 50 non-repetitive questions according
to each topic description. In order to facilitate large-scale
comprehensive experiments more conveniently, we sam-
ple 5 questions from each topic in SafeBench, ultimately
creating a small-scale dataset named SafeBench-Tiny that
consists of a total of 50 harmful questions.
LVLMs. We focus on the promising open-source LVLMs
to conduct the main attack analysis. For instance, we se-
lect the following six LVLMs: two from LLaVA-v1.5 (Liu
et al. 2023a), three from MiniGPT4 (Zhu et al. 2023), and
CogVLM-Chat-v1.1 (Wang et al. 2023). MiniGPT-4 mod-
els only train the connector layer. LLaVA models keep the
visual encoder frozen while continuing to update both the
connector layer and the base LLM. CogVLM takes a dif-
ferent approach by adding an additional QKV matrix and
an MLP as a visual expert module in each layer of the base
LLM, alongside using a visual encoder and connector layer.
In CogVLM, only the connector layer and the visual expert
modules are trainable. Note that we also demonstrate that
the SOTA closed-source models, GPT-4V and GPT-4o, are
vulnerable to the methodology of FigStep.
FigStep. The default malicious image-prompt I′ of FigStep
is a typography of T † that contains black text and a white
background. The image size of I′ is 760×760. The text font is
FreeMono Bold and the font size is 80. As for the jailbreaking
incitement text-prompt, we use a manually designed inciting
prompt as our default T ′ to launch FigStep. We will further
discuss the impact of different settings in I′ and T ′ on the ef-
fectiveness of FigStep in the Discussion section. Meanwhile,
23953

