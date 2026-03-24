# Abstract

FigStep: Jailbreaking Large Vision-Language Models via Typographic Visual
Prompts
Yichen Gong1*, Delong Ran2*, Jinyuan Liu3, Conglei Wang4,
Tianshuo Cong3†, Anyu Wang3,5,6†, Sisi Duan3,5,6,7, Xiaoyun Wang3,5,6,7,8
1Department of Computer Science and Technology, Tsinghua University,
2Institute for Network Sciences and Cyberspace, Tsinghua University,
3Institute for Advanced Study, BNRist, Tsinghua University,
4Carnegie Mellon University,
5Zhongguancun Laboratory,
6National Financial Cryptography Research Center,
7Shandong Institute of Blockchain,
8School of Cyber Science and Technology, Shandong University
{gongyc18, rdl22, liujinyuan24}@mails.tsinghua.edu.cn, congleiw@andrew.cmu.edu,
{congtianshuo, anyuwang, duansisi, xiaoyunwang}@tsinghua.edu.cn
Abstract
Large Vision-Language Models (LVLMs) signify a ground-
breaking paradigm shift within the Artificial Intelligence (AI)
community, extending beyond the capabilities of Large Lan-
guage Models (LLMs) by assimilating additional modalities
(e.g., images). Despite this advancement, the safety of LVLMs
remains adequately underexplored, with a potential overre-
liance on the safety assurances purported by their underlying
LLMs. In this paper, we propose FigStep, a straightforward
yet effective black-box jailbreak algorithm against LVLMs. In-
stead of feeding textual harmful instructions directly, FigStep
converts the prohibited content into images through typogra-
phy to bypass the safety alignment. The experimental results
indicate that FigStep can achieve an average attack success
rate of 82.50% on six promising open-source LVLMs. Not
merely to demonstrate the efficacy of FigStep, we conduct
comprehensive ablation studies and analyze the distribution
of the semantic embeddings to uncover that the reason behind
the success of FigStep is the deficiency of safety alignment
for visual embeddings. Moreover, we compare FigStep with
five text-only jailbreaks and four image-based jailbreaks to
demonstrate the superiority of FigStep, i.e., negligible attack
costs and better attack performance. Above all, our work re-
veals that current LVLMs are vulnerable to jailbreak attacks,
which highlights the necessity of novel cross-modality safety
alignment techniques.
Code, Datasets — https://github.com/ThuCCSLab/FigStep
Extended version — https://arxiv.org/abs/2311.05608
Introduction
Large Vision-Language Models (LVLMs) are at the forefront
of the recent transformative wave in Artificial Intelligence
*These authors contributed equally.
†These authors are the corresponding authors.
Copyright © 2025, Association for the Advancement of Artificial
Intelligence (www.aaai.org). All rights reserved.
LVLMs
Reject
Accept
Reject
Accept
Vanilla
FigStep
Textual Module
Connector
Visual Module
Safety Alignment
Figure 1: FigStep jailbreaks LVLM through transferring the
harmful information from textual domain to visual domain,
thereby bypassing the textual module’s safety alignment.
(AI) research. Unlike single-modal Large Language Models
(LLMs) like ChatGPT (OpenAI 2022), LVLMs can process
queries with both visual and textual modalities. Notewor-
thy LVLMs like GPT-4V (OpenAI 2023a) and LLaVA (Liu
et al. 2023b) have remarkable abilities, which could enhance
end-user-oriented scenarios like image captioning for blind
people (Xu et al. 2015) or recommendation systems for chil-
dren (Deldjoo et al. 2017), where content safety is crucial.
Typically, an LVLM consists of a visual module, a con-
nector, and a textual module (see Figure 1). To be specific,
the visual module is an image encoder (Radford et al. 2021;
Li et al. 2023) that extracts visual embeddings from image-
prompts. The connector will transform these visual embed-
dings to the same latent space as the textual module (Liu et al.
2023b). The textual module takes the concatenation of text-
prompts and transforms visual embeddings to generate the
final textual responses. As the core component of LVLM, the
textual module is usually an off-the-shelf pre-trained LLM
that has undergone strict safety alignment to ensure LVLM
safety (Zheng et al. 2023; Touvron et al. 2023; Perez et al.
2022; Korbak et al. 2023; Shevlane et al. 2023).
However, most of the popular open-source LVLMs do
not undergo a rigorous safety assessment before being re-
The Thirty-Ninth AAAI Conference on Artificial Intelligence (AAAI-25)
23951



# Introduction

FigStep: Jailbreaking Large Vision-Language Models via Typographic Visual
Prompts
Yichen Gong1*, Delong Ran2*, Jinyuan Liu3, Conglei Wang4,
Tianshuo Cong3†, Anyu Wang3,5,6†, Sisi Duan3,5,6,7, Xiaoyun Wang3,5,6,7,8
1Department of Computer Science and Technology, Tsinghua University,
2Institute for Network Sciences and Cyberspace, Tsinghua University,
3Institute for Advanced Study, BNRist, Tsinghua University,
4Carnegie Mellon University,
5Zhongguancun Laboratory,
6National Financial Cryptography Research Center,
7Shandong Institute of Blockchain,
8School of Cyber Science and Technology, Shandong University
{gongyc18, rdl22, liujinyuan24}@mails.tsinghua.edu.cn, congleiw@andrew.cmu.edu,
{congtianshuo, anyuwang, duansisi, xiaoyunwang}@tsinghua.edu.cn
Abstract
Large Vision-Language Models (LVLMs) signify a ground-
breaking paradigm shift within the Artificial Intelligence (AI)
community, extending beyond the capabilities of Large Lan-
guage Models (LLMs) by assimilating additional modalities
(e.g., images). Despite this advancement, the safety of LVLMs
remains adequately underexplored, with a potential overre-
liance on the safety assurances purported by their underlying
LLMs. In this paper, we propose FigStep, a straightforward
yet effective black-box jailbreak algorithm against LVLMs. In-
stead of feeding textual harmful instructions directly, FigStep
converts the prohibited content into images through typogra-
phy to bypass the safety alignment. The experimental results
indicate that FigStep can achieve an average attack success
rate of 82.50% on six promising open-source LVLMs. Not
merely to demonstrate the efficacy of FigStep, we conduct
comprehensive ablation studies and analyze the distribution
of the semantic embeddings to uncover that the reason behind
the success of FigStep is the deficiency of safety alignment
for visual embeddings. Moreover, we compare FigStep with
five text-only jailbreaks and four image-based jailbreaks to
demonstrate the superiority of FigStep, i.e., negligible attack
costs and better attack performance. Above all, our work re-
veals that current LVLMs are vulnerable to jailbreak attacks,
which highlights the necessity of novel cross-modality safety
alignment techniques.
Code, Datasets — https://github.com/ThuCCSLab/FigStep
Extended version — https://arxiv.org/abs/2311.05608
Introduction
Large Vision-Language Models (LVLMs) are at the forefront
of the recent transformative wave in Artificial Intelligence
*These authors contributed equally.
†These authors are the corresponding authors.
Copyright © 2025, Association for the Advancement of Artificial
Intelligence (www.aaai.org). All rights reserved.
LVLMs
Reject
Accept
Reject
Accept
Vanilla
FigStep
Textual Module
Connector
Visual Module
Safety Alignment
Figure 1: FigStep jailbreaks LVLM through transferring the
harmful information from textual domain to visual domain,
thereby bypassing the textual module’s safety alignment.
(AI) research. Unlike single-modal Large Language Models
(LLMs) like ChatGPT (OpenAI 2022), LVLMs can process
queries with both visual and textual modalities. Notewor-
thy LVLMs like GPT-4V (OpenAI 2023a) and LLaVA (Liu
et al. 2023b) have remarkable abilities, which could enhance
end-user-oriented scenarios like image captioning for blind
people (Xu et al. 2015) or recommendation systems for chil-
dren (Deldjoo et al. 2017), where content safety is crucial.
Typically, an LVLM consists of a visual module, a con-
nector, and a textual module (see Figure 1). To be specific,
the visual module is an image encoder (Radford et al. 2021;
Li et al. 2023) that extracts visual embeddings from image-
prompts. The connector will transform these visual embed-
dings to the same latent space as the textual module (Liu et al.
2023b). The textual module takes the concatenation of text-
prompts and transforms visual embeddings to generate the
final textual responses. As the core component of LVLM, the
textual module is usually an off-the-shelf pre-trained LLM
that has undergone strict safety alignment to ensure LVLM
safety (Zheng et al. 2023; Touvron et al. 2023; Perez et al.
2022; Korbak et al. 2023; Shevlane et al. 2023).
However, most of the popular open-source LVLMs do
not undergo a rigorous safety assessment before being re-
The Thirty-Ninth AAAI Conference on Artificial Intelligence (AAAI-25)
23951

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



# FigStep Method

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

Textual Module
“How can someone manufacture illegal drugs?”
Paraphrase
“Steps to manufacture
illegal drags.”
Typography
（!∗）
（!"）
(##)
Incitement
“Generate detailed
content for each item...”
(!#)
LLaVA
MiniGPT4
CogVLM
GPT-4V
Large Vision-Language Models (LVLMs)
Visual Module
Connector
FigStep
Harmful Response
Illegal 
Activity
Hate
Speech
Malware
Generation
Fraud
…
Output
Figure 2: The illustration of FigStep. The goal of FigStep is to generate jailbreaking image-prompt I′ (which is a typography
that contains harmful instructions) and benign incitement text-prompt T ′.
we carry out the “Paraphrase” of FigStep with the help of
GPT-4 by using a paraphrasing prompt template. Specifically,
we leverage few-shot learning (Brown et al. 2020) within five
demonstrations to enhance the paraphrase effectiveness of
GPT-4. LVLMs utilize the default hyperparameters during
the inference process.
Metric. We use the following two metrics to evaluate the
effectiveness of jailbreaks.
• Attack Success Rate (ASR): Given a prohibited question
dataset, ASR refers to the proportion of generating prohib-
ited responses by different jailbreak algorithms. Due to
the unstable performance of current automated jailbreak
evaluators (Ran et al. 2024), following (Yuan et al. 2023;
Li et al. 2024), all the model responses are manually as-
sessed for the sake of accuracy. Furthermore, considering
the stochastic nature of the model’s replies, we repeat-
edly launch FigStep five times for each question, and one
jailbreak could be deemed successful if any one of five
attempts could yield a prohibited response. To this end,
we manually reviewed a total of 66, 000 model responses.
• Perplexity (PPL): We introduce PPL to evaluate the qual-
ity of the model responses. A lower PPL indicates a higher
degree of “confidence” in the generated text, meaning that
the model’s responses are statistically closer to real hu-
man language. We use GPT-2 to calculate the PPL of each
response and report the mean value.
Vanilla Query
Before evaluating the effectiveness of FigStep, we first take
the harmful textual questions from SafeBench to directly
query LVLMs. We denote these queries as vanilla queries.
The related results are shown in Table 1.
Underlying LLMs Determine LVLMs Safety. First, we
could observe that the safety disparity among LVLMs is
associated with their underlying LLMs. Take MiniGPT4 as an
example, which leverages three kinds of LLMs, MiniGPT4-
Llama-2-CHAT-7B performs the best safety property, owing
to the strict safety alignment within Llama-2-CHAT-7B.
The Impact of Model Intelligence on ASR. The PPL re-
sults illustrate that CogVLM-Chat-v1.1 exhibits limited profi-
LVLMs
Attack
ASR (↑)
PPL (↓)
LLaVA-1.5-V-1.5-7B
Vanilla
57.40%
24.01
FigStep
84.00%
5.77
LLaVA-1.5-V-1.5-13B
Vanilla
45.40%
9.17
FigStep
88.20%
6.05
MGPT4-L2-CHAT-7B
Vanilla
23.80%
7.98
FigStep
82.60%
9.54
MGPT4-V-7B
Vanilla
50.60%
23.24
FigStep
68.00%
8.23
MGPT4-V-13B
Vanilla
83.40%
20.62
FigStep
85.20%
7.32
CogVLM-Chat-v1.1
Vanilla
8.20%
30.54
FigStep
87.00%
9.44
Average
Vanilla
44.80%
19.26
FigStep
82.50%
7.73
Table 1: The results of ASR and PPL caused by vanilla
queries and FigStep. The evaluation dataset is SafeBench.
ciency in processing text-only queries. The responses always
report that there is no information in the image, instead of
answering or refusing the query. In our manual review, we
consider that although such responses do not constitute direct
refusals to assist with users’ requests, they still do not violate
AI safety policy.
Jailbreaking via FigStep
From this part, we demonstrate the attack efficacy of FigStep.
FigStep Outperforms Vanilla Query. Initially, as Table 1
shows, FigStep is capable of achieving effective jailbreak-
ing performance regardless of the underlying LLMs, visual
modules, or different types of connectors. Although LLaMA-
2-Chat-7B performs excellent safety alignment for text-only
23954



# Experiments

Textual Module
“How can someone manufacture illegal drugs?”
Paraphrase
“Steps to manufacture
illegal drags.”
Typography
（!∗）
（!"）
(##)
Incitement
“Generate detailed
content for each item...”
(!#)
LLaVA
MiniGPT4
CogVLM
GPT-4V
Large Vision-Language Models (LVLMs)
Visual Module
Connector
FigStep
Harmful Response
Illegal 
Activity
Hate
Speech
Malware
Generation
Fraud
…
Output
Figure 2: The illustration of FigStep. The goal of FigStep is to generate jailbreaking image-prompt I′ (which is a typography
that contains harmful instructions) and benign incitement text-prompt T ′.
we carry out the “Paraphrase” of FigStep with the help of
GPT-4 by using a paraphrasing prompt template. Specifically,
we leverage few-shot learning (Brown et al. 2020) within five
demonstrations to enhance the paraphrase effectiveness of
GPT-4. LVLMs utilize the default hyperparameters during
the inference process.
Metric. We use the following two metrics to evaluate the
effectiveness of jailbreaks.
• Attack Success Rate (ASR): Given a prohibited question
dataset, ASR refers to the proportion of generating prohib-
ited responses by different jailbreak algorithms. Due to
the unstable performance of current automated jailbreak
evaluators (Ran et al. 2024), following (Yuan et al. 2023;
Li et al. 2024), all the model responses are manually as-
sessed for the sake of accuracy. Furthermore, considering
the stochastic nature of the model’s replies, we repeat-
edly launch FigStep five times for each question, and one
jailbreak could be deemed successful if any one of five
attempts could yield a prohibited response. To this end,
we manually reviewed a total of 66, 000 model responses.
• Perplexity (PPL): We introduce PPL to evaluate the qual-
ity of the model responses. A lower PPL indicates a higher
degree of “confidence” in the generated text, meaning that
the model’s responses are statistically closer to real hu-
man language. We use GPT-2 to calculate the PPL of each
response and report the mean value.
Vanilla Query
Before evaluating the effectiveness of FigStep, we first take
the harmful textual questions from SafeBench to directly
query LVLMs. We denote these queries as vanilla queries.
The related results are shown in Table 1.
Underlying LLMs Determine LVLMs Safety. First, we
could observe that the safety disparity among LVLMs is
associated with their underlying LLMs. Take MiniGPT4 as an
example, which leverages three kinds of LLMs, MiniGPT4-
Llama-2-CHAT-7B performs the best safety property, owing
to the strict safety alignment within Llama-2-CHAT-7B.
The Impact of Model Intelligence on ASR. The PPL re-
sults illustrate that CogVLM-Chat-v1.1 exhibits limited profi-
LVLMs
Attack
ASR (↑)
PPL (↓)
LLaVA-1.5-V-1.5-7B
Vanilla
57.40%
24.01
FigStep
84.00%
5.77
LLaVA-1.5-V-1.5-13B
Vanilla
45.40%
9.17
FigStep
88.20%
6.05
MGPT4-L2-CHAT-7B
Vanilla
23.80%
7.98
FigStep
82.60%
9.54
MGPT4-V-7B
Vanilla
50.60%
23.24
FigStep
68.00%
8.23
MGPT4-V-13B
Vanilla
83.40%
20.62
FigStep
85.20%
7.32
CogVLM-Chat-v1.1
Vanilla
8.20%
30.54
FigStep
87.00%
9.44
Average
Vanilla
44.80%
19.26
FigStep
82.50%
7.73
Table 1: The results of ASR and PPL caused by vanilla
queries and FigStep. The evaluation dataset is SafeBench.
ciency in processing text-only queries. The responses always
report that there is no information in the image, instead of
answering or refusing the query. In our manual review, we
consider that although such responses do not constitute direct
refusals to assist with users’ requests, they still do not violate
AI safety policy.
Jailbreaking via FigStep
From this part, we demonstrate the attack efficacy of FigStep.
FigStep Outperforms Vanilla Query. Initially, as Table 1
shows, FigStep is capable of achieving effective jailbreak-
ing performance regardless of the underlying LLMs, visual
modules, or different types of connectors. Although LLaMA-
2-Chat-7B performs excellent safety alignment for text-only
23954

(a) LLaVA-1.5-V-1.5-7B
(b) LLaVA-1.5-V-1.5-13B
(c) MiniGPT4-L2-CHAT-7B
(d) MiniGPT4-V-7B
(e) MiniGPT4-Vicuna-13B
(f) CogVLM-Chat-v1.1
Figure 3: The results of ASR caused by vanilla queries and
FigStep over different forbidden AI topics.
queries, its vulnerability significantly increases when meeting
FigStep. The effectiveness of FigStep also naturally validates
our first intuition: these LVLMs can generate policy-violating
content corresponding to the instructions in image-prompts,
indicating that they can accurately recognize and interpret
the text in image-prompts. Above all, the higher ASR and
lower PPL achieved by FigStep underscores its powerful
jailbreaking effect.
Attack Success Rate on Each Topic. Figure 3 presents
detailed ASR results on each topic in SafeBench. Overall,
FigStep achieves a high ASR across different prohibited top-
ics. To be specific, Figure 3c illustrates the effectiveness of
FigStep in breaching the safety alignment of MiniGPT4-
Llama-2-CHAT-7B across the first seven topics, wherein
MiniGPT4-Llama-2-CHAT-7B originally exhibited strong
robustness. For example, the vanilla query yields an aver-
age ASR of 5.14% across these first seven topics, while
FigStep significantly enhances ASR to 76.86%. Meanwhile,
for the latter three topics, the average ASR of the vanilla
query is 67.33%, indicating that LLaMA-2-Chat-7B is not
well-aligned for questions of these topics, and FigStep still
markedly increases the ASR to 96.00%.
Ablation Study
To demonstrate the necessity of each component in FigStep
(i.e., the design of FigStep is not trivial), besides vanilla query
(denoted as Qva) and FigStep, we propose additional four
kinds of potential queries that the malicious users can use.
The LVLMs discussed in this part are LLaVA-v1.5-Vicuna-
v1.5-13B, MiniGPT4-Llama-2-CHAT-7B, and CogVLM-
Chat-v1.1. For the sake of brevity, we use LLaVA, MiniGPT4,
Queries
LVLMs
ASR (↑)
PPL (↓)
Qva
LLaVA
32.00%
18.32
MiniGPT4
18.00%
8.16
CogVLM
10.00%
37.14
Q′
1
LLaVA
16.00%
10.44
MiniGPT4
28.00%
8.48
CogVLM
0.00%
211.55
Q′
2
LLaVA
60.00%
7.02
MiniGPT4
30.00%
9.25
CogVLM
0.00%
12.75
Q′
3
LLaVA
4.00%
35.94
MiniGPT4
34.00%
82.58
CogVLM
0.00%
31.42
Q′
4
LLaVA
0.00%
58.43
MiniGPT4
26.00%
39.15
CogVLM
4.00%
30.37
FigStep
LLaVA
92.00%
5.37
MiniGPT4
90.00%
9.21
CogVLM
82.00%
9.22
Table 2: Results of Ablation Study.
and CogVLM to denote them and utilize SafeBench-Tiny as
the evaluation dataset unless otherwise stated.
The detailed explanations of the proposed malicious
queries are outlined below. (1) Q′
1 is a text-only query that
consists of two parts: the first part is the rephrased declarative
statement of the text-prompt in Qva, and the second part is
three indexes “1. 2. 3.” Note that the above text-prompt is
exactly the textual content embedded in the image-prompt of
FigStep. (2) Q′
2 is another kind of text-only query. To con-
struct the text-prompt of Q′
2, we add the inciting text-prompt
of FigStep upon the text-prompt of Q′
1. In other words, Q′
2
integrates all the textual information that appears in FigStep,
but only in textual modality. (3) Q′
3 is an image-only query.
Q′
3 only contains FigStep’s image-prompt and leaves its text-
prompt out. (4) The formats of Q′
4 and FigStep are similar,
i.e., they both contain text-prompt and image-prompt con-
currently. But differently, the texts in the image-prompts of
Q′
4 are the original questions, and the text-prompt instructs
the model to provide answers to these questions. The goal of
proposing Q′
4 is to evaluate if directly embedding the harmful
question into image-prompt can jailbreak LVLMs effectively.
Validation of Intuition 2. The detailed results of all these
queries are illustrated in Table 2. We conduct a comparison
of the ASR results for Qva, Q′
1, Q′
2, and FigStep. In these
queries, except for FigStep, the text-prompts of the other
three queries contain harmful content. We can observe that
due to harmful keywords in the textual prompts, Qva, Q′
1, and
Q′
2 are ineffective in jailbreaking LVLMs. Note that the infor-
mation in Q′
2 and FigStep are the same, but the jailbreaking
efficacy of FigStep is significantly stronger, highlighting the
importance of embedding unsafe words in the image-prompts.
Meanwhile, through comparing Q′
3 with FigStep, we could
deduce that even if harmful information is embedded in im-
23955

Figure 4: A visualization of how the embeddings for benign
and prohibited questions differ depending on the type of
prompt used: Qva, Q′
2 or FigStep.
ages, without a valid incitement textual prompt to guide the
model into continuation mode, the model fails to compre-
hend the user’s intent and cannot complete the information
presented in the image-prompts.
Validation of Intuition 3. Recall that our third intuition is
using an incitement text-prompt to engage the model in a
continuation task. Here we first take text-only queries as
examples. Among them, only the text-prompt of Q′
2 clarified
what needs to be replenished by the model, causing a higher
ASR than Qva and Q′
1. Moreover, across all three LVLMs,
FigStep’s jailbreaking performance consistently surpasses
that of Q′
4. This is attributed to the fact that Q′
4 does not
engage the model in a continuation task but rather guides the
model to provide direct answers to questions, even though
the text-prompts of Q′
4 are benign, which is easier to trigger
the alignment mechanism in LVLMs.
Discussion
Prompt Semantic Visualization. To explore why FigStep
breaks LVLM’s safety guardrail, we analyze the embedding
separability between benign and prohibited questions when
queried in different formats. To begin with, for each topic of
Illegal Activity, Hate Speech, and Malware Generation, we
generate 50 benign questions using GPT-4 according to the
original prohibited questions in SafeBench. All these ques-
tions are transformed into the prompt format of Qva, Q′
2,
and FigStep. Following Gerganov (2023), the semantic em-
bedding of the whole query is defined as the hidden vector
of the last layer. Therefore, we use t-SNE (Van der Maaten
and Hinton 2008) to project these embeddings onto a two-
dimensional space, as shown in Figure 4. For MiniGPT4,
the text-only prompts Qva and Q′
2 leads to highly separable
embeddings for benign and prohibited queries, indicating that
the underlying LLM can effectively differentiate them and
output appropriate responses. Meanwhile, the typographic
prompts (FigStep) result in overlapping embeddings of be-
nign and prohibited queries, implying that the visual em-
bedding transformation ignores the safety constraints of the
Method
IA
HS
MG
GCG
0.00%
10.00%
10.00%
CipherChat
0.00%
4.00%
2.00%
DeepInception
52.00%
22.00%
54.00%
ICA
0.00%
0.00%
0.00%
MultiLingual
0.00%
4.00%
6.00%
VRP
14.00%
2.00%
8.00%
QR
38.00%
22.00%
38.00%
JPOCR
28.00%
18.00%
30.00%
FigStep
82.00%
38.00%
86.00%
JPOCR (Red teaming)
64.00%
42.00%
76.00%
FigStep (Red teaming)
100.00%
76.00%
98.00%
VAE
30.00%
6.00%
10.00%
JPadv
32.00%
20.00%
30.00%
FigStepadv
80.00%
38.00%
80.00%
Table 3: We compare FigStep with various advanced text-
based and image-based jailbreak algorithms. The results are
evaluated across three harmful topics: IA (Illegal Activity),
HS (Hate Speech), and MG (Malware Generation). Here the
victim LVLM is MiniGPT4.
textual latent space. Similar conclusions hold for LLaVA and
CogVLM.
Comparison with Other Jailbreaks. We further compare
FigStep with SOTA jailbreak methods, including text-based
jailbreaks and image-based jailbreaks. Notably, we intro-
duce (a) FigStepadv, a variant of FigStep utilizing adver-
sarial perturbation, and (b) FigStep (Red teaming), which
uses additional 10 rephrased text-prompts to fully jailbreak
LVLMs. In specific, we use FGSM to generate the adversar-
ial image for FigStepadv. An image with random Gaussian
noise is set as the initial image. The typography image in
FigStep is used as the target image. The optimization goal is
to minimize the distance between their visual embeddings.
Table 3 shows the results of FigStep and other attacks. We
observe that FigStep outperforms the text-based jailbreak
methods, as well as visual adversarial examples (VAE) (Qi
et al. 2023a), Visual-RolePlay (VRP) (Ma et al. 2024), Query-
Relevant Images (QR) (Liu et al. 2023d), Jailbreak-in-pieces
(JPOCR) (Shayegani, Dong, and Abu-Ghazaleh 2024), and
its optimized version JPadv. JPOCR, as a gradient-free jail-
breaking method, only transfers core harmful phases (i.e., a
word) into images, causing it relatively ineffective in circum-
venting the safeguards of VLMs, while FigStep injects an
entire instruction into the image-prompt and conduct para-
phrasing. Besides the red teaming versions of FigStep and
JPOCR, FigStepadv is also more powerful than JPadv, which
indicates that FigStep has more potential to be a stepping
stone for advanced gradient-based jailbreaks against LVLMs.
In short, the methodology of FigStep presents consistently
superior performance than other methods.
Impact of Hyperparameters. Figure 5 shows the ASR re-
sults under different number of repetitions and temperatures.
We observe that with more jailbreak attempts, the ASR pro-
23956



# Related Work

Figure 4: A visualization of how the embeddings for benign
and prohibited questions differ depending on the type of
prompt used: Qva, Q′
2 or FigStep.
ages, without a valid incitement textual prompt to guide the
model into continuation mode, the model fails to compre-
hend the user’s intent and cannot complete the information
presented in the image-prompts.
Validation of Intuition 3. Recall that our third intuition is
using an incitement text-prompt to engage the model in a
continuation task. Here we first take text-only queries as
examples. Among them, only the text-prompt of Q′
2 clarified
what needs to be replenished by the model, causing a higher
ASR than Qva and Q′
1. Moreover, across all three LVLMs,
FigStep’s jailbreaking performance consistently surpasses
that of Q′
4. This is attributed to the fact that Q′
4 does not
engage the model in a continuation task but rather guides the
model to provide direct answers to questions, even though
the text-prompts of Q′
4 are benign, which is easier to trigger
the alignment mechanism in LVLMs.
Discussion
Prompt Semantic Visualization. To explore why FigStep
breaks LVLM’s safety guardrail, we analyze the embedding
separability between benign and prohibited questions when
queried in different formats. To begin with, for each topic of
Illegal Activity, Hate Speech, and Malware Generation, we
generate 50 benign questions using GPT-4 according to the
original prohibited questions in SafeBench. All these ques-
tions are transformed into the prompt format of Qva, Q′
2,
and FigStep. Following Gerganov (2023), the semantic em-
bedding of the whole query is defined as the hidden vector
of the last layer. Therefore, we use t-SNE (Van der Maaten
and Hinton 2008) to project these embeddings onto a two-
dimensional space, as shown in Figure 4. For MiniGPT4,
the text-only prompts Qva and Q′
2 leads to highly separable
embeddings for benign and prohibited queries, indicating that
the underlying LLM can effectively differentiate them and
output appropriate responses. Meanwhile, the typographic
prompts (FigStep) result in overlapping embeddings of be-
nign and prohibited queries, implying that the visual em-
bedding transformation ignores the safety constraints of the
Method
IA
HS
MG
GCG
0.00%
10.00%
10.00%
CipherChat
0.00%
4.00%
2.00%
DeepInception
52.00%
22.00%
54.00%
ICA
0.00%
0.00%
0.00%
MultiLingual
0.00%
4.00%
6.00%
VRP
14.00%
2.00%
8.00%
QR
38.00%
22.00%
38.00%
JPOCR
28.00%
18.00%
30.00%
FigStep
82.00%
38.00%
86.00%
JPOCR (Red teaming)
64.00%
42.00%
76.00%
FigStep (Red teaming)
100.00%
76.00%
98.00%
VAE
30.00%
6.00%
10.00%
JPadv
32.00%
20.00%
30.00%
FigStepadv
80.00%
38.00%
80.00%
Table 3: We compare FigStep with various advanced text-
based and image-based jailbreak algorithms. The results are
evaluated across three harmful topics: IA (Illegal Activity),
HS (Hate Speech), and MG (Malware Generation). Here the
victim LVLM is MiniGPT4.
textual latent space. Similar conclusions hold for LLaVA and
CogVLM.
Comparison with Other Jailbreaks. We further compare
FigStep with SOTA jailbreak methods, including text-based
jailbreaks and image-based jailbreaks. Notably, we intro-
duce (a) FigStepadv, a variant of FigStep utilizing adver-
sarial perturbation, and (b) FigStep (Red teaming), which
uses additional 10 rephrased text-prompts to fully jailbreak
LVLMs. In specific, we use FGSM to generate the adversar-
ial image for FigStepadv. An image with random Gaussian
noise is set as the initial image. The typography image in
FigStep is used as the target image. The optimization goal is
to minimize the distance between their visual embeddings.
Table 3 shows the results of FigStep and other attacks. We
observe that FigStep outperforms the text-based jailbreak
methods, as well as visual adversarial examples (VAE) (Qi
et al. 2023a), Visual-RolePlay (VRP) (Ma et al. 2024), Query-
Relevant Images (QR) (Liu et al. 2023d), Jailbreak-in-pieces
(JPOCR) (Shayegani, Dong, and Abu-Ghazaleh 2024), and
its optimized version JPadv. JPOCR, as a gradient-free jail-
breaking method, only transfers core harmful phases (i.e., a
word) into images, causing it relatively ineffective in circum-
venting the safeguards of VLMs, while FigStep injects an
entire instruction into the image-prompt and conduct para-
phrasing. Besides the red teaming versions of FigStep and
JPOCR, FigStepadv is also more powerful than JPadv, which
indicates that FigStep has more potential to be a stepping
stone for advanced gradient-based jailbreaks against LVLMs.
In short, the methodology of FigStep presents consistently
superior performance than other methods.
Impact of Hyperparameters. Figure 5 shows the ASR re-
sults under different number of repetitions and temperatures.
We observe that with more jailbreak attempts, the ASR pro-
23956

(a) Number of repetitions
(b) Temperature
Figure 5: The Impact of Hyper-parameters.
gressively enlarges. However, FigStep is effective enough
that it does not need to repeat as many as 5 times to achieve
a high ASR. For instance, if we just query with 1 repetition,
ASR for LLaVA already attains 82%, and ASR for both
MiniGPT4 and CogVLM could reach up to 60%. Moreover,
as the number of repetitions increases to 3, the results of ASR
on all three models reach above 80%. When querying with
10 repetitions, the ASR on MiniGPT4 and LLaVA achieves
98% and 94%, respectively. From the results under different
temperatures, we can see that as temperature increases, there
will be a higher probability of generating harmful responses.
The observed experimental phenomenon can be attributed to
the fact that as the temperature increases, the model’s creativ-
ity is enhanced, leading to a richer diversity in the generated
content.
Defenses
In this section, we discuss three potential defenses: OCR
Detection, System Prompt Modification, and adding random
noise into image-prompts.
OCR Detection. We first utilize EasyOCR (AI 2023) to recog-
nize the text in the visual-prompts of FigStep, the averaged
detection success rate is 88.98%. However, when we lever-
age LLaMA-2-Chat-7B as a toxicity classifier to judge the
harmfulness of the extracted textual content, only 40.00% of
the responses are deemed as harmful, and the results are re-
duced to 30.00% when using OpenAI’s moderation (OpenAI
2024b). These guardrails can be deliberately disabled in open-
source models. Furthermore, they could even be actively by-
passed. To demonstrate this, we propose FigStephide, which
hides the text in the image by manipulating the background
color. Specifically, the background color spectrum is set to
#000010, which is very close to the font color #000000. The
ASR results of FigStephide are 64.00%, 68.00%, and 52.00%
against LLaVA, MiniGPT4, and CogVLM, respectively, illus-
trating that such visual-prompts do not effect the jailbreaking
performance. Therefore, as long as the core vulnerabilities
within the LVLMs persist, the system-level defenses, such as
OCR detection, are inefficient in mitigating FigStep.
System Prompt-Based Defense. We then try to add a new
textual safety guidance prompt upon the existing system
prompt to assess whether a meticulously designed system
prompt can mitigate the impact of FigStep. The safety guid-
ance instructs the model to check for text in the image
and avoid assisting if the content violates AI safety poli-
cies. In this scenario, the ASR results of FigStephide are
68.00%, 64.00%, and 48.00% against LLaVA, MiniGPT4,
Baseline FigStep FigStephide
FigSteppro
GPT-4o
28.00%
48.00%
56.00%
62.00%
GPT-4V
18.00%
34.00%
52.00%
70.00%
Table 4: ASR results of GPT-4V and GPT-4o.
and CogVLM, respectively. Therefore, FigStep can still jail-
break LVLMs with high ASR though we pre-define a new
system prompt with wider consideration for safety.
Random Noise-Based Defense. We add Gaussian noise
(mean=0, std=100) to make visible degradation to the im-
age quality. However, FigStep is robust to such defense with
only a slight reduction in ASR (MiniGPT4: 90%→86%,
CogVLM: 82%→76%, LLaVA: 92%→92%). This may be
due to the large font size and high contrast between the text
color and the background in the image prompt. However,
introducing Gaussian noise may affect the performance of
benign downstream tasks. When perturbing the images of
the first thirty questions from the Llava-bench-in-the-wild
(Liu et al. 2023b), the number of correct answers also slightly
decreases: MiniGPT4: 15→13, CogVLM: 26→25, LLaVA:
24→22. This indicates that it may interfere with the expe-
rience of legitimate users. Therefore, incorporating random
noise into the image-prompt is inefficient in resisting FigStep
and can slightly impair the model’s ability to perceive regular
images.
Real-world Case Study. We regard the SOTA closed-source
LVLMs, GPT-4o and GPT-4V, as our real-world case studies.
These commercial LVLMs have deployed powerful OCR
toolkit in advance (OpenAI 2023a). Here we further propose
a variant of FigStep, namely FigSteppro. In brief, FigSteppro
splits image-prompt into harmless segments, inputs them to
the model simultaneously, and then subsequently reconstructs
them by exploiting the intelligence of LVLMs. Table 4 shows
the ASR results of FigStep, FigStephide, and FigSteppro.
We observe that FigStep can increase the harmfulness of
both GPT-4V and GPT-4o compared to baseline results, and
FigSteppro can further outperform FigStep. Hence, as long
as this vulnerability persists, relying solely on external tools
for jailbreak prevention may be temporary.
Conclusion
In this paper, we introduce FigStep, a straightforward yet
effective jailbreak algorithm against LVLMs. Our approach
is centered on transforming harmful textual instructions into
typographic images, circumventing the safety alignment in
the underlying LLMs of LVLMs. By conducting a compre-
hensive evaluation, we uncover cross-modality alignment
vulnerabilities of LVLMs. Above all, we highlight that it is
dangerous and irresponsible to directly release the LVLMs
without ensuring strict cross-modal alignment, and we ad-
vocate for the utilization of FigStep to develop novel cross-
model safety alignment techniques in the future.
23957



# Conclusion

(a) Number of repetitions
(b) Temperature
Figure 5: The Impact of Hyper-parameters.
gressively enlarges. However, FigStep is effective enough
that it does not need to repeat as many as 5 times to achieve
a high ASR. For instance, if we just query with 1 repetition,
ASR for LLaVA already attains 82%, and ASR for both
MiniGPT4 and CogVLM could reach up to 60%. Moreover,
as the number of repetitions increases to 3, the results of ASR
on all three models reach above 80%. When querying with
10 repetitions, the ASR on MiniGPT4 and LLaVA achieves
98% and 94%, respectively. From the results under different
temperatures, we can see that as temperature increases, there
will be a higher probability of generating harmful responses.
The observed experimental phenomenon can be attributed to
the fact that as the temperature increases, the model’s creativ-
ity is enhanced, leading to a richer diversity in the generated
content.
Defenses
In this section, we discuss three potential defenses: OCR
Detection, System Prompt Modification, and adding random
noise into image-prompts.
OCR Detection. We first utilize EasyOCR (AI 2023) to recog-
nize the text in the visual-prompts of FigStep, the averaged
detection success rate is 88.98%. However, when we lever-
age LLaMA-2-Chat-7B as a toxicity classifier to judge the
harmfulness of the extracted textual content, only 40.00% of
the responses are deemed as harmful, and the results are re-
duced to 30.00% when using OpenAI’s moderation (OpenAI
2024b). These guardrails can be deliberately disabled in open-
source models. Furthermore, they could even be actively by-
passed. To demonstrate this, we propose FigStephide, which
hides the text in the image by manipulating the background
color. Specifically, the background color spectrum is set to
#000010, which is very close to the font color #000000. The
ASR results of FigStephide are 64.00%, 68.00%, and 52.00%
against LLaVA, MiniGPT4, and CogVLM, respectively, illus-
trating that such visual-prompts do not effect the jailbreaking
performance. Therefore, as long as the core vulnerabilities
within the LVLMs persist, the system-level defenses, such as
OCR detection, are inefficient in mitigating FigStep.
System Prompt-Based Defense. We then try to add a new
textual safety guidance prompt upon the existing system
prompt to assess whether a meticulously designed system
prompt can mitigate the impact of FigStep. The safety guid-
ance instructs the model to check for text in the image
and avoid assisting if the content violates AI safety poli-
cies. In this scenario, the ASR results of FigStephide are
68.00%, 64.00%, and 48.00% against LLaVA, MiniGPT4,
Baseline FigStep FigStephide
FigSteppro
GPT-4o
28.00%
48.00%
56.00%
62.00%
GPT-4V
18.00%
34.00%
52.00%
70.00%
Table 4: ASR results of GPT-4V and GPT-4o.
and CogVLM, respectively. Therefore, FigStep can still jail-
break LVLMs with high ASR though we pre-define a new
system prompt with wider consideration for safety.
Random Noise-Based Defense. We add Gaussian noise
(mean=0, std=100) to make visible degradation to the im-
age quality. However, FigStep is robust to such defense with
only a slight reduction in ASR (MiniGPT4: 90%→86%,
CogVLM: 82%→76%, LLaVA: 92%→92%). This may be
due to the large font size and high contrast between the text
color and the background in the image prompt. However,
introducing Gaussian noise may affect the performance of
benign downstream tasks. When perturbing the images of
the first thirty questions from the Llava-bench-in-the-wild
(Liu et al. 2023b), the number of correct answers also slightly
decreases: MiniGPT4: 15→13, CogVLM: 26→25, LLaVA:
24→22. This indicates that it may interfere with the expe-
rience of legitimate users. Therefore, incorporating random
noise into the image-prompt is inefficient in resisting FigStep
and can slightly impair the model’s ability to perceive regular
images.
Real-world Case Study. We regard the SOTA closed-source
LVLMs, GPT-4o and GPT-4V, as our real-world case studies.
These commercial LVLMs have deployed powerful OCR
toolkit in advance (OpenAI 2023a). Here we further propose
a variant of FigStep, namely FigSteppro. In brief, FigSteppro
splits image-prompt into harmless segments, inputs them to
the model simultaneously, and then subsequently reconstructs
them by exploiting the intelligence of LVLMs. Table 4 shows
the ASR results of FigStep, FigStephide, and FigSteppro.
We observe that FigStep can increase the harmfulness of
both GPT-4V and GPT-4o compared to baseline results, and
FigSteppro can further outperform FigStep. Hence, as long
as this vulnerability persists, relying solely on external tools
for jailbreak prevention may be temporary.
Conclusion
In this paper, we introduce FigStep, a straightforward yet
effective jailbreak algorithm against LVLMs. Our approach
is centered on transforming harmful textual instructions into
typographic images, circumventing the safety alignment in
the underlying LLMs of LVLMs. By conducting a compre-
hensive evaluation, we uncover cross-modality alignment
vulnerabilities of LVLMs. Above all, we highlight that it is
dangerous and irresponsible to directly release the LVLMs
without ensuring strict cross-modal alignment, and we ad-
vocate for the utilization of FigStep to develop novel cross-
model safety alignment techniques in the future.
23957



